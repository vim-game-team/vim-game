import { GameState } from "./game-state.service";
import { InputToken } from "../models/inputToken";
import { Command } from "../../../shared/models/command";
import { CharType, CmdType, InputMode } from "../models/types";
import { CmdUtils } from "./command-utils.service";

export class CommandService {
    public gameState: GameState;

    public constructor(gameState: GameState) {
        this.gameState = gameState;
        CmdUtils.map = gameState.map;
        CmdUtils.player = gameState.player;
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
        let curChar = this.gameState.player.curTile().value;
        let curCharType: CharType = CmdUtils.getCharType(curChar);

        let offset = CmdUtils.offsetToNextNonCharType(curCharType);
        offset = CmdUtils.offsetToNextNonCharType(CharType.WHITESPACE, offset);

        return [offset, 0];
    }

    private execute_i() {
        this.gameState.inputMode = InputMode.INSERT;
    }

    private execute_a() {
        this.gameState.inputMode = InputMode.INSERT;
    }

    private execute_e() {
        let curChar = this.gameState.player.curTile().value;
        let nextChar = CmdUtils.player.relativeTileAt(1, 0).value;

        let curType = CmdUtils.getCharType(curChar);
        let nextType = CmdUtils.getCharType(nextChar)

        let offset = 0;

        if (curType !== nextType || curType === CharType.WHITESPACE) {
            offset = CmdUtils.offsetToNextNonCharType(CharType.WHITESPACE, 1);
            curType = CmdUtils.getCharType(CmdUtils.player.relativeTileAt(offset, 0).value);
        }

        offset = CmdUtils.offsetToNextNonCharType(curType, offset);

        return [offset - 1, 0];
    }

    private execute_E() {
        let curChar = this.gameState.player.curTile().value;
        let nextChar = CmdUtils.player.relativeTileAt(1, 0).value;

        let curType = CmdUtils.getCharType(curChar);
        let nextType = CmdUtils.getCharType(nextChar)

        let offset = 0;

        if (curType === CharType.WHITESPACE || nextType === CharType.WHITESPACE) {
            offset = CmdUtils.offsetToNextNonCharType(CharType.WHITESPACE, 1);
            curType = CmdUtils.getCharType(CmdUtils.player.relativeTileAt(offset, 0).value);
        }

        while (curType != CharType.WHITESPACE) {
            offset++;
            curType = CmdUtils.getCharType(CmdUtils.player.relativeTileAt(offset, 0).value);
        }

        return [offset - 1, 0]
    }

}
