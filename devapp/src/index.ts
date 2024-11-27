import { Serenity, LevelDBProvider } from "@serenityjs/core";
import { Pipeline } from "@serenityjs/plugins";
import { Packet } from "@serenityjs/protocol";

// Create a new Serenity instance
const serenity = new Serenity({
  port: 19142,
  permissions: "./permissions.json",
  resourcePacks: "./resource_packs",
  debugLogging: true
});

// Create a new plugin pipeline
const pipeline = new Pipeline(serenity, { path: "./plugins" });

// Initialize the pipeline
void pipeline.initialize(() => {
  // Register the LevelDBProvider
  serenity.registerProvider(LevelDBProvider, { path: "./worlds" });

  // Start the server
  serenity.start();
});

serenity.network.on(Packet.PlayerAuthInput, ({ packet }) => {
  const size = packet.binary.length;
  const offset = packet.offset;

  // Check if data is available
  if (size > offset) return console.log("remaining data");
});
