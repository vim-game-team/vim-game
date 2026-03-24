import { Command } from "../../../shared/models/command.js";
import { CMDTYPE } from "./types.js";

export class InputToken {
    public count: number;
    public cmd: Command;

    public constructor(key: string, count: number) {
        this.cmd = new Command(key, CMDTYPE.STANDALONE);
        this.count =
            count == 0
                ? 1
                : count;
    }
}