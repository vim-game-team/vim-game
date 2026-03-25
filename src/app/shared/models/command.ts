import { CmdType } from "../../features/game/models/types.js";

export class Command {
    public key: string;
    public returns: CmdType;
    public expects: CmdType[];

    public constructor(key: string, returns: CmdType, expects: CmdType[] = []) {
        this.key = key;
        this.returns = returns
        this.expects = expects;
    }
}