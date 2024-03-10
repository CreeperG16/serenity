import { Uint8, VarLong } from "@serenityjs/binaryutils";
import { Proto, Serialize } from "@serenityjs/raknet";

import { Packet } from "../../enums";
import { Rotation, Vector3f } from "../data";

import { DataPacket } from "./data-packet";

@Proto(Packet.MoveEntity)
class MoveEntity extends DataPacket {
	@Serialize(VarLong) public runtimeEntityId!: bigint;
	@Serialize(Uint8) public flags!: number;
	@Serialize(Vector3f) public position!: Vector3f;
	@Serialize(Rotation) public rotation!: Rotation;
}

export { MoveEntity };
