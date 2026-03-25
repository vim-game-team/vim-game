import { GameState } from "./game-state.service";
import { InputToken } from "../models/inputToken";
import { Command } from "../../../shared/models/command";
import { CmdType } from "../models/types";

export class CommandService {
    public gameState: GameState;

    public constructor(gameState: GameState) {
        this.gameState = gameState;
    }

    public execute(tokens: InputToken[]) {
        let action: CmdType = tokens[0].cmd.returns as CmdType;
        const executeFunction = (this as any)["execute_" + tokens[0].cmd.key];

        switch (action) {
            case CmdType.MOTION: {
                let result: any = executeFunction.call(this);
                for (let i = 0; i < tokens[0].count; i++)
                    this.gameState.player.move(result[0], result[1]);
                break;
            }
            case CmdType.OPERATOR:
            case CmdType.TEXTOBJ:
            case CmdType.NONE:
        }
    }

    public execute_h() {
        console.log("CALLED execute_h!!!!!!");
        return [-1, 0];
    }

    public execute_j() {
        return [0, 1];
    }

    public execute_k() {
        return [0, -1];
    }

    public execute_l() {
        return [1, 0];
    }

    public execute_w(count1: number, cmd: Command) {
        const func = (this as any)["execute_" + cmd.key];
        let motion: CmdType.MOTION = func.call(this);


    }
}
