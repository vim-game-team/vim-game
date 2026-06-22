import { Command } from '../../../shared/models/command';
import { isAlphaNumeric } from '../../../shared/utils';
import { Map } from '../models/map';
import { Player } from '../models/player';
import { CharType, CmdType } from '../models/types';

export class CmdUtils {
  public static map: Map;
  public static player: Player;

  public static getCharType(char: string): CharType {
    switch (true) {
      case char == ' ':
        return CharType.WHITESPACE;
      case isAlphaNumeric(char):
        return CharType.ALPHANUM;
      default:
        return CharType.SYMBOL;
    }
  }
  
  // public static getExecuteFunction(cmd: Command): any {
  //   return (this as any)["execute_" + cmd.key];
  // }

  public static offsetToNextNonCharType(type: CharType, offset = 0) {
    let curTileType = this.getCharType(this.player.relativeTileAt(offset, 0).value);
    while (curTileType == type && this.player.relativeTileAt(offset, 0).value != "\n" ) {
      offset++;
      curTileType = this.getCharType(this.player.relativeTileAt(offset, 0).value);
    }

    return offset;
  }

  public static offsetToPrevNonWhitespace(offset = -1) {
    let curTileType = this.getCharType(this.player.relativeTileAt(offset, 0).value);

    while (curTileType === CharType.WHITESPACE) {
      offset--;
      curTileType = this.getCharType(this.player.relativeTileAt(offset, 0).value);
    }

    return offset;
  }

  public static offsetToPrevWordStart(offset: number) {
    const curType = this.getCharType(this.player.relativeTileAt(offset, 0).value);

    while (this.getCharType(this.player.relativeTileAt(offset - 1, 0).value) === curType) {
      offset--;
    }

    return offset;
  }

  public static offsetToPrevWORDStart(offset: number) {
    while (this.getCharType(this.player.relativeTileAt(offset - 1, 0).value) !== CharType.WHITESPACE) {
      offset--;
    }

    return offset;
  }
}
