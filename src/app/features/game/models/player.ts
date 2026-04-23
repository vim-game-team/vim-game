import { signal, effect } from "@angular/core";
import { max, min } from "../../../shared/utils";
import { GameConfig } from "../constants/game-config"
import { Map } from "./map";
import { TileType } from "./types";
import { Tile } from "./tile";

export class Player {
    public posX = 0;
    public posY = 0;
    public map: Map;

    public constructor(map: Map) {
        this.map = map;
        this.drawPlayer();
    }

    public move(moveX: number = 0, moveY: number = 0) {
        if (!this.canMoveVertically(moveY) ||
            !this.canMoveHorizontally(moveX))
            return;

        if (moveY != 0) {
            moveX = this.offsetToLineStart(0, moveY);
        }

        this.posX += moveX;
        this.posY += moveY;

        this.drawPlayer();
    }

    public curTile(): Tile {
        return this.map.tileAt(this.posX, this.posY);
    }

    public deleteChar() {
        this.map.deleteCharAt(this.posX, this.posY);
        this.move(-1, 0);
    }

    public writeChar(char: string) {
        this.map.insertCharAt(this.posX, this.posY, char);
        this.move(1, 0);
    }

    private canMoveHorizontally(xOffset: number): boolean {
        if (xOffset == 0) return true;

        let walkable = GameConfig.walkableTiles;
        let sign = xOffset > 0 ? 1 : -1;
        for (let i = 1; i <= Math.abs(xOffset); i++) {
            if (!walkable.includes(this.relativeTileAt(i * sign, 0).type)) {
                return false;
            }
        }
        return true;
    }

    private canMoveVertically(yOffset: number): boolean {
        if (yOffset == 0) return true;

        let walkable = GameConfig.walkableTiles;
        let sign = yOffset > 0 ? 1 : -1;
        let xSteps = 0;
        let ySteps = 1;
        let curTile = this.relativeTileAt(0, ySteps * sign)

        while (
            ySteps < Math.abs(yOffset) &&
            (walkable.includes(curTile.type) ||
                curTile.type == TileType.EMPTY)
        ) {
            ySteps++;
            curTile = this.relativeTileAt(0, ySteps * sign)
        }

        curTile = this.relativeTileAt(xSteps, ySteps * sign)
        while (curTile!.type == TileType.EMPTY) {
            xSteps++;
            curTile = this.relativeTileAt(xSteps, ySteps * sign)
        }
        return walkable.includes(curTile.type);
    }

    private offsetToLineStart(posX: number, posY: number): number {
        let offset = 0;
        let curTile = this.relativeTileAt((posX + offset), posY);
        while (curTile!.type == TileType.EMPTY) {
            offset--;
            curTile = this.relativeTileAt((posX + offset), posY)
        }
        return offset;
    }

    public relativeTileAt(x: number, y: number): Tile {
        let tempTile = this.map.tileAt(this.posX + x, this.posY + y);
        return tempTile;
    }

    private drawPlayer() {
        document.getElementsByClassName("player")[0]?.classList.remove("player");
        let curTileId = "tile-" + this.posX + "-" + this.posY;
        let playerTile = document.getElementById(curTileId);
        playerTile?.classList.add("player");
    }
}