import { CustomEnum } from "@serenityjs/command";

class GamemodeEnum extends CustomEnum {
	public static readonly name = "gamemode";
	public static readonly options = [
		"s",
		"c",
		"a",
		"sp",
		"survival",
		"creative",
		"adventure",
		"spectator"
	];
}

export { GamemodeEnum };
