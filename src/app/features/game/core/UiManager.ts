import { HostListener, Injectable, signal } from "@angular/core";
import { GC } from "../constants/game-config";
import { Player } from "../models/player";
import { Tile } from "../models/tile";
import { GameState } from "../services/game-state.service";

@Injectable({providedIn: "root"})
export class UiManager {
    public cameraX: number = 0;
    public cameraY: number = 0;
    private gameState: GameState;


    public constructor(gameState: GameState) {
        this.gameState = gameState;
    }

    public calcMaxTilesVer() {
        return window.innerHeight / GC.TILESIZE;
    }

    public calcMaxTilesHor() {
        return window.innerWidth / GC.TILESIZE;
    }

    private getRenderedTiles() {
        // let topLeftTile: [] = this.visibleTilesStart();
    }

    // @HostListener('window:resize', ['$event'])
    // private onResize() {
    //     this.maxTilesVer = this.calcMaxTilesVer();
    //     this.maxTilesHor = this.calcMaxTilesHor();
    // }
}