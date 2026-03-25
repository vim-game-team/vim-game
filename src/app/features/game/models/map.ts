import { Tile } from "./tile";
import { TileType } from "./types";
import { GameConfig } from "../services/game-config.service";

export class Map {
    public tiles: Tile[][];
    private chunkLength: number;

    public constructor() {
        this.chunkLength = (GameConfig.chunkLoadDistance * 2) + 1;
        let i = 0;
        this.tiles = new Array(this.chunkLength * GameConfig.chunkSize)
            .fill(false)
            .map(() => new Array(this.chunkLength * GameConfig.chunkSize)
                .fill(new Tile(TileType.GROUND)));
        console.log("creating chunk: " + i++);
    }
    public loadChunks() {
        // let toLoadPosY = GameState.player.posX / GameConfig.chunkSize;
        // let toLoadPosX = GameState.player.posY / GameConfig.chunkSize;

        for (let i = 0; i < this.chunkLength; i++) {
            // tempChunkData = DATA;
            // this.chunks[toLoadPosY + i][toLoadPosX + i] = assign tempChunkData;
        }
    }
    
}