import { HostListener, Injectable, signal } from "@angular/core";
import { GC } from "../constants/game-config";
import { Player } from "../models/player";
import { Tile } from "../models/tile";
import { GameState } from "../services/game-state.service";

@Injectable()
export class UiManager {
    public tilesBuffer: Tile[][];
    public cameraX: number = 0;
    public cameraY: number = 0;
    public maxTilesVer: number;
    public maxTilesHor: number;
    private gameState: GameState;


    public constructor(gameState: GameState) {
        this.gameState = gameState;
        this.maxTilesVer = this.calcMaxTilesVer();
        this.maxTilesHor = this.calcMaxTilesHor();

        this.tilesBuffer = new Array(
            GC.CHUNKSIZE + GC.VIEWPORTBUFF)
            .fill(new Array(GC.CHUNKSIZE + GC.VIEWPORTBUFF).fill(null)); 
    }

    private calcMaxTilesVer() {
        return window.innerHeight / GC.TILESIZE;
    }

    private calcMaxTilesHor() {
        return window.innerWidth / GC.TILESIZE;
    }

    private getRenderedTiles() {
        // let topLeftTile: [] = this.visibleTilesStart();
    }

    private getVisibleTilesStart() {
        let startX = this.gameState.player.posX - (this.maxTilesHor / 2) + 1;
        let startY = this.gameState.player.posY - (this.maxTilesVer / 2) + 1;
        return [startX, startY];
    }

    @HostListener('window:resize', ['$event'])
    private onResize() {
        this.maxTilesVer = this.calcMaxTilesVer();
        this.maxTilesHor = this.calcMaxTilesHor();
    }
}