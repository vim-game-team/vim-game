import { signal, effect } from "@angular/core";
import { max, min } from "../../../shared/utils";
import { GameConfig } from "../services/game-config.service"

export class Player {
    public posX = signal(0);
    public posY = signal(0);
    public curTileId = "tile-0-0";
    public constructor() {
        console.log("CONSTRUCTING PLAYER");
        this.drawPlayer();
    }
    public move(x: number = 0, y: number = 0) {
        let moveX = x > 0
            ? min(this.posX() + x, GameConfig.chunkSize - 1)
            : max(x, 0);
        let moveY = y > 0
            ? min(this.posY() + y, GameConfig.chunkSize - 1)
            : max(x, 0);

        this.posX.set(this.posX() + x);
        this.posY.set(this.posY() + y);
        this.drawPlayer();
    }
    public drawPlayer() {
        document.getElementById(this.curTileId)?.classList.remove("player");
        this.curTileId = "tile-" + this.posX() + "-" + this.posY();
        console.log(this.curTileId);
        let playerTile = document.getElementById(this.curTileId);
        playerTile?.classList.add("player");
    }

}