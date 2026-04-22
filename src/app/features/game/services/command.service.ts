import { GameState } from "./game-state.service";
import { InputToken } from "../models/inputToken";
import { Command } from "../../../shared/models/command";
import { CmdType, InputMode } from "../models/types";

export class CommandService {
    public gameState: GameState;

    public constructor(gameState: GameState) {
        this.gameState = gameState;
    }


    public execute(tokens: InputToken[]) {
        let action: CmdType = tokens[0].cmd.type as CmdType;
        const executeFunction = (this as any)["execute_" + tokens[0].cmd.key];

        try {
            switch (action) {
                case CmdType.MOVEMENT: {
                    let result: any = executeFunction.call(this);
                    for (let i = 0; i < tokens[0].count; i++)
                        this.gameState.player.move(result[0], result[1]);
                    break;
                }
                case CmdType.MODESWITCH: {
                    let result: any = executeFunction.call(this);
                    break;
                }
            }
        }
        catch (e) {
            
        }
    }

    private execute_h() {
        return [-1, 0];
    }

    private execute_j() {
        return [0, 1];
    }

    private execute_k() {
        return [0, -1];
    }

    private execute_l() {
        return [1, 0];
    }

    private execute_w(count1: number, cmd: Command) {
        const func = (this as any)["execute_" + cmd.key];
        let motion: CmdType.MOVEMENT = func.call(this);
    }

    private execute_i() {
        this.gameState.inputMode = InputMode.INSERT;    
    }

    private execute_a() {
        this.gameState.inputMode = InputMode.INSERT;
    }
}
