import { ZigZong } from "@serenityjs/binaryutils";
import { Proto, Serialize } from "@serenityjs/raknet";

import { Packet } from "../../enums";

import { DataPacket } from "./data-packet";

@Proto(Packet.RemoveEntity)
class RemoveEntity extends DataPacket {
	@Serialize(ZigZong) public uniqueEntityId!: bigint;
}

export { RemoveEntity };
