import { GameState } from './game-state.service';
import { InputToken } from '../models/inputToken';
import { Command } from '../../../shared/models/command';
import { CharType, CmdType, InputMode } from '../models/types';
import { CmdUtils } from './command-utils.service';
import { Pos } from '../models/pos';
import { TextArea } from '../models/textarea';

export class CommandService {
  public gameState: GameState;
  private clipBoard: string;

  public constructor(gameState: GameState) {
    this.gameState = gameState;
    this.clipBoard = "";
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
          result[0] *= tokens[0].count;
          result[1] *= tokens[0].count;
          this.gameState.player.move(result[0], result[1]);
          break;
        }
        case CmdType.MODESWITCH: {
          let result: any = executeFunction.call(this);
          break;
        }
        case CmdType.WRITE: {
          executeFunction.call(this);
          this.clipBoard = "";
          break;
        }
        case CmdType.DELETE: {
          this.clipBoard = executeFunction.call(this);
          break;
        }
        case CmdType.OPERATOR: {
          executeFunction.call(this, tokens[1].cmd!);
          break;
        }
      }
    } catch (e: any) { console.log("error") }
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

  private execute_b() {
    let offset = CmdUtils.offsetToPrevNonWhitespace();
    offset = CmdUtils.offsetToPrevWordStart(offset);

    return [offset, 0];
  }

  private execute_B() {
    let offset = CmdUtils.offsetToPrevNonWhitespace();
    offset = CmdUtils.offsetToPrevWORDStart(offset);

    return [offset, 0];
  }

  private execute_e() {
    let curChar = this.gameState.player.curTile().value;
    let nextChar = CmdUtils.player.relativeTileAt(1, 0).value;

    let curType = CmdUtils.getCharType(curChar);
    let nextType = CmdUtils.getCharType(nextChar);

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
    let nextType = CmdUtils.getCharType(nextChar);

    let offset = 0;

    if (curType === CharType.WHITESPACE || nextType === CharType.WHITESPACE) {
      offset = CmdUtils.offsetToNextNonCharType(CharType.WHITESPACE, 1);
      curType = CmdUtils.getCharType(CmdUtils.player.relativeTileAt(offset, 0).value);
    }

    while (curType != CharType.WHITESPACE) {
      offset++;
      curType = CmdUtils.getCharType(CmdUtils.player.relativeTileAt(offset, 0).value);
    }

    return [offset - 1, 0];
  }

  private execute_x() {
    return this.gameState.player.deleteTiles();
  }

  private execute_p() {
    this.gameState.player.write(this.clipBoard);
  }

  private execute_d(cmd: Command) {
    let textArea: TextArea;
    let pPos = this.gameState.player.pos();
    switch (cmd.key) {
      case "d": {
        let lineStart = this.gameState.map.getLineStart(pPos.x, pPos.y);
        let lineEnd = this.gameState.map.getLineEnd(pPos.x, pPos.y);
        textArea = new TextArea(new Pos(lineStart, pPos.y), new Pos(lineEnd, pPos.y));
        break;
      }
      default: {
        const argFunc = (this as any)["execute_" + cmd.key];
        let offset = argFunc.call(this);
        let offsetPos = new Pos(offset[0], offset[1]);
        let endPos = new Pos(pPos.x, pPos.y).offset(offsetPos);
        textArea = new TextArea(pPos, endPos);
        break;
      }
    }

    this.clipBoard = this.gameState.map.deleteChars(textArea.start.x + 1, textArea.end.x + 1, pPos.y, true)
    let newPlayerPos = this.gameState.map.nextWalkableLeft(pPos.x, pPos.y);
    this.gameState.player.setPos(newPlayerPos);
  }
}
