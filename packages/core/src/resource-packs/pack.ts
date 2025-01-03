import { createHash } from "crypto";

import { PackType } from "@serenityjs/protocol";

import { ResourceManifest } from "../types";

import { Zip } from "./zipfile";
import { readdirSync, statSync } from "fs";
import { join } from "path";

interface ContentEntry {
  path: string;
  key?: string;
}

class ResourcePack {
  // TODO: Make this configurable
  public static readonly MAX_CHUNK_SIZE = 1024 * 256; // 256 bytes for now

  public compressedData!: Buffer; // The compressed ZIP file
  public compressedSize!: bigint; // The filesize of the compressed resource pack
  public originalSize!: bigint; // The original combined size of the resource pack

  // These could all be replaced by JS getters / directly from this.manifest, but it's shorter this way
  public readonly version: string;
  public readonly name: string;
  public readonly packType: PackType = PackType.Resources;
  public readonly isRtx: boolean;
  public readonly hasScripts: boolean = false;

  // Encryption key for contents.json
  public readonly contentKey: string = "";

  public constructor(
    public readonly uuid: string,
    public readonly path: string,
    public readonly manifest: ResourceManifest,
    private readonly packZip: Zip,
    public readonly selectedSubpack?: string,
    //private readonly zippedPack:
  ) {
    this.name = this.manifest.header.name;
    this.isRtx = this.manifest.capabilities?.includes("raytraced") ?? false;

    this.version =
      typeof this.manifest.header.version === "string"
        ? this.manifest.header.version
        : this.manifest.header.version.join(".");
  }

  /**
   * Recursively read resource pack folder
   */
  private readContents(relativePath: string): ContentEntry[] {
    const contents: ContentEntry[] = [];

    const directory = readdirSync(join(this.path, relativePath));
    for (const file of directory) {
      const filePath = join(this.path, relativePath, file);
      const fileStats = statSync(filePath);

      if (fileStats.isDirectory()) {
        // Recursively call this function to read the subdirectory
        const subItems = this.readContents(
          relativePath.length === 0 ? file : relativePath + "/" + file,
        );

        contents.push(...subItems);
      } else {
        contents.push({
          path: relativePath.length === 0 ? file : relativePath + "/" + file,
        });
      }
    }

    return contents;
  }

  /** Compress the resource pack folder into a zip file. */
  public compress(): void {
    const { data, originalSize } = this.packZip.compressPack();
    this.compressedData = data;
    this.compressedSize = BigInt(data.byteLength);
    this.originalSize = originalSize;
  }

  /** Get the SHA256 hash of the resource pack zip */
  public getHash(): Buffer {
    return createHash("sha256").update(this.compressedData).digest();
  }

  /** Get the amount of chunks that need to be sent to the client for this pack. */
  public getChunkCount(): number {
    return Math.ceil(
      this.compressedData.byteLength / ResourcePack.MAX_CHUNK_SIZE,
    );
  }

  /** Get a specific chunk of the zip file to send to the client. */
  public getChunk(index: number) {
    const start = ResourcePack.MAX_CHUNK_SIZE * index;
    const end = Math.min(
      start + ResourcePack.MAX_CHUNK_SIZE,
      this.compressedData.byteLength,
    );

    return this.compressedData.subarray(start, end);
  }
}

export { ResourcePack };
