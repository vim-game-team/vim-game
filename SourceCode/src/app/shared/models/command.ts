import { CmdType } from "../../features/game/models/types.js";

export class Command {
    public key: string;
    public type: CmdType;
    public returns: CmdType | undefined;
    public requires: CmdType | undefined;

    public constructor(
        key: string,
        type: CmdType,
        returns: CmdType | undefined = undefined,
        requires: CmdType | undefined = undefined,
    ) {
        this.key = key;
        this.type = type;
        this.returns = returns;
        this.requires = requires;
    }
}