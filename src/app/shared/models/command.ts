import { CmdType } from "../../features/game/models/types.js";

export class Command {
    public key: string;
    public type: CmdType;
    public expects: CmdType[];

    public constructor(
        key: string,
        type: CmdType,
        expects: CmdType[] = []
    ) {
        this.key = key;
        this.type = type;
        this.expects = expects;
    }
}