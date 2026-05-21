import { isAlphaNumeric } from '../../../shared/utils';
import { Map } from '../models/map';
import { Player } from '../models/player';
import { CharType } from '../models/types';

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

  public static offsetToNextNonCharType(type: CharType, offset = 0) {
    let curTileType = this.getCharType(this.player.relativeTileAt(offset, 0).value);
    while (curTileType == type) {
      offset++;
      curTileType = this.getCharType(this.player.relativeTileAt(offset, 0).value);
    }

    return offset;
  }

  public static offsetToPrevWhitespace(offset = 0) {
    let curTileType = this.getCharType(this.player.relativeTileAt(offset, 0).value);
    while (curTileType !== CharType.WHITESPACE) {
      offset--;
      curTileType = this.getCharType(this.player.relativeTileAt(offset, 0).value);
    }

    return offset;
  }

  public static offsetToPrevNonCharType(type: CharType, offset = 0) {
    let curTileType = this.getCharType(this.player.relativeTileAt(offset, 0).value);
    while (curTileType === type) {
      offset--;
      curTileType = this.getCharType(this.player.relativeTileAt(offset, 0).value);
    }

    return offset;
  }

  public static offsetToPrevWordStart(type: CharType, offset = 0): number {
    let curType = this.getCharType(this.player.relativeTileAt(offset, 0).value);
    if (curType === type || curType === CharType.WHITESPACE) {
      while (
        this.getCharType(this.player.relativeTileAt(offset, 0).value) === CharType.WHITESPACE
      ) {
        offset--;
      }
      curType = this.getCharType(this.player.relativeTileAt(offset, 0).value);
    }

    while (this.getCharType(this.player.relativeTileAt(offset - 1, 0).value) === curType) {
      offset--;
    }

    return offset;
  }
}
