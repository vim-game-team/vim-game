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
        if (!this.canMoveVertically(moveY)
            || !this.canMoveHorizontally)
            return;

        this.posX += moveX;
        this.posY += moveY;

        console.log("MOVING PLAYER");
        this.drawPlayer();
    }
    public writeChar(char: string) {
        console.log("posX: " + this.posX);
        this.map.insertCharAt(this.posX, this.posY, char);
        this.move(1, 0);
    }

    private canMoveHorizontally(xOffset: number): boolean {
        let walkable = GameConfig.walkableTiles;
        let sign = xOffset > 0 ? 1 : -1;
        for (let i = 1; i <= Math.abs(xOffset); i++) {
            if (!walkable.includes(this.relativeTileAt(i * sign, 0).type)) {
                console.log("can't move horizontally");
                return false;
            }
        }
        console.log("can move");
        return true;
    }

    private canMoveVertically(yOffset: number): boolean {
        let walkable = GameConfig.walkableTiles;
        let sign = yOffset > 0 ? 1 : -1;
        for (let i = 1; i <= Math.abs(yOffset); i++) {
            if (!walkable.includes(this.relativeTileAt(0, i * sign).type)) {
                console.log("can't move vertically");
                return false;
            }
        }
        console.log("can move");
        return true;
    }

    private relativeTileAt(x: number, y: number): Tile {
        let tempTile = this.map.tileAt(this.posX + x, this.posY + y);
        console.log("tile value: " + tempTile.value);
        return tempTile;
    }
    private drawPlayer() {
        document.getElementsByClassName("player")[0]?.classList.remove("player");
        let curTileId = "tile-" + this.posX + "-" + this.posY;
        console.log("DRAWING PLAYER" + curTileId);
        let playerTile = document.getElementById(curTileId);
        playerTile?.classList.add("player");
    }
}