import { effect, signal } from "@angular/core";
import { Map } from "./map";
import { TileType } from "./types";
import { Tile } from "./tile";
import { Pos } from "./pos";


export class Player {
  public pos = signal(new Pos());
  public map: Map;

  public constructor(map: Map) {
    this.map = map;
  }

  public move(moveX: number = 0, moveY: number = 0) {
    if (
      !this.canMoveVertically(moveY) ||
      !this.canMoveHorizontally(moveX)
    )
      return;

    if (moveY != 0)
      moveX = this.offsetToLineStart(0, moveY);

    this.addPos(new Pos(moveX, moveY));
  }

  public curTile(): Tile {
    return this.map.tileAt(this.pos().x, this.pos().y);
  }

  public deleteChar() {
    let toDeletePos = this.map.moveOnText(this.pos().x, this.pos().y, -1);
    let deleted = this.map.deleteCharAt(toDeletePos.x, toDeletePos.y);
    if (deleted != "")
      this.setPos(toDeletePos);

  }

  public writeChar(char: string) {
    this.map.write(this.pos().x, this.pos().y, char);
    let newPos = this.map.moveOnText(this.pos().x, this.pos().y, char.length);
    this.setPos(newPos);
  }

  private canMoveHorizontally(xOffset: number): boolean {
    if (xOffset == 0) return true;

    let sign = xOffset > 0 ? 1 : -1;
    for (let i = 1; i <= Math.abs(xOffset); i++) {
      if (!this.relativeTileAt(i * sign, 0).type.isWalkable) {
        return false;
      }
    }
    return true;
  }

  private canMoveVertically(yOffset: number): boolean {
    if (yOffset == 0) return true;

    let sign = yOffset > 0 ? 1 : -1;
    let xSteps = 0;
    let ySteps = 0;

    let curTile = this.relativeTileAt(0, ySteps * sign)
    while (ySteps < Math.abs(yOffset)
      && (curTile.type.isWalkable || curTile.type == TileType.EMPTY)
    ) {
      ySteps++;
      curTile = this.relativeTileAt(0, ySteps * sign);
    }

    curTile = this.relativeTileAt(xSteps, ySteps * sign);
    while (curTile!.type == TileType.EMPTY) {
      xSteps--;
      curTile = this.relativeTileAt(xSteps, ySteps * sign);
    }
    return curTile.type.isWalkable;
  }

  private offsetToLineStart(posX: number, posY: number): number {
    let offset = 0;
    let curTile = this.relativeTileAt(posX + offset, posY);
    while (curTile!.type == TileType.EMPTY) {
      offset--;
      curTile = this.relativeTileAt(posX + offset, posY);
    }
    return offset;
  }

  public relativeTileAt(x: number, y: number): Tile {
    let tempTile = this.map.tileAt(this.pos().x + x, this.pos().y + y);
    return tempTile;
  }

  private addPos(pos: Pos) {
    this.pos.update(p => {
      p.x += pos.x;
      p.y += pos.y;
      return new Pos(p.x, p.y);
    });
  }

  private setPos(pos: Pos) {
    this.pos.update(p => {
      p.x = pos.x;
      p.y = pos.y;
      return new Pos(p.x, p.y);
    });
  }
}