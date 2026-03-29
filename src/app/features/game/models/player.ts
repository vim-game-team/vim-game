import { signal, effect } from "@angular/core";
import { max, min } from "../../../shared/utils";
import { GameConfig } from "../services/game-config.service"

export class Player {
    public posX = 0;
    public posY = 0;

    public constructor() {
        console.log("CONSTRUCTING PLAYER");
        this.drawPlayer();
    }

    public move(x: number = 0, y: number = 0) {
        let moveX = x > 0
            ? min(this.posX + x, GameConfig.chunkSize - 1)
            : max(x, 0);
        let moveY = y > 0
            ? min(this.posY + y, GameConfig.chunkSize - 1)
            : max(x, 0);

        this.posX =this.posX + x;
        this.posY = this.posY + y;
        this.drawPlayer();
    }

    public drawPlayer() {
        document.getElementsByClassName("player")[0]?.classList.remove("player");
        console.log("drawing?");
        let curTileId = "tile-" + this.posX + "-" + this.posY;
        console.log(curTileId);
        let playerTile = document.getElementById(curTileId);
        playerTile?.classList.add("player");
    }
}