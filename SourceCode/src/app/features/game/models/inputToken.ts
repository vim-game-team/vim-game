import { Command } from "../../../shared/models/command.js";
import { commands } from "../../../shared/constants/commandRegistry.js";
import { CmdType } from "./types.js";

export class InputToken {
    public count: number;
    public cmd: Command;

    public constructor(key: string, count: number) {
        this.cmd = commands.get(key)!;

        this.count =
            count == 0
                ? 1
                : count;
    }
}