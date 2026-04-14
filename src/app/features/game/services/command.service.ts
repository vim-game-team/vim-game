import { GameState } from "./game-state.service";
import { InputToken } from "../models/inputToken";
import { Command } from "../../../shared/models/command";
import { CmdType, InputMode } from "../models/types";

export class CommandService {
    public gameState: GameState;

    public constructor(gameState: GameState) {
        this.gameState = gameState;
    }
    public writeChar(input: string){
        this.gameState.player.writeChar(input);
    }

    public execute(tokens: InputToken[]) {
        let action: CmdType = tokens[0].cmd.returns as CmdType;
        const executeFunction = (this as any)["execute_" + tokens[0].cmd.key];

        switch (action) {
            case CmdType.MOTION: {
                let result: any = executeFunction.call(this);
                for (let i = 0; i < tokens[0].count; i++)
                    this.gameState.player.move(result[1], result[0]);
                break;
            }
            case CmdType.STANDALONE:{
                executeFunction.call(this);
                break
            }
            case CmdType.OPERATOR:
            case CmdType.TEXTOBJ:
            case CmdType.NONE:
        }
    }

    public execute_h() {
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
    public execute_i(){
        console.log("SWITCHING MODE");
        this.gameState.inputMode = InputMode.INSERT;
    }
    public execute_a(){
        this.gameState.inputMode = InputMode.INSERT;
    }
}
