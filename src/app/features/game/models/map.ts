import { Tile } from "./tile";
import { GameConfig } from "../services/game-config.service";
import { chunks } from "../constants/map-data";
import { min, max } from "../../../shared/utils";

export class Map {
    public tiles: Tile[][];
    private chunkLength: number;

    public constructor(curPosX: number = 0, curPosY = 0) {
        let chunkDist = GameConfig.chunkLoadDistance;
        let startChunkPosX = max(curPosX / GameConfig.chunkSize - chunkDist, 0);
        let startChunkPosY = max(curPosY / GameConfig.chunkSize - chunkDist, 0);

        this.chunkLength = (chunkDist * 2) + 1;
        this.tiles = new Array(this.chunkLength * GameConfig.chunkSize)
            .fill(false)
            .map(() => new Array(this.chunkLength * GameConfig.chunkSize)
                .fill(new Tile("L ")));

        for (let chunkX = startChunkPosX; chunkX <= startChunkPosX + chunkDist; chunkX++) {
            for (let chunkY = startChunkPosY; chunkY <= startChunkPosY + chunkDist; chunkY++) {
                this.loadChunk(chunkX, chunkY, curPosX, curPosY);
            }
        }
    }

    public loadChunk(chunkX: number, chunkY: number, curPosX: number, curPosY: number) {
        let curChunkId = chunkX + "-" + chunkY;
        console.log("checking chunk: " + curChunkId);
        if (chunks.has(curChunkId)) {
            let borderY, borderX: number;
            let chunkData = chunks.get(curChunkId)!;
            borderY = curPosY / GameConfig.chunkSize + min(chunkData.length, GameConfig.chunkSize);

            console.log("found chunk: " + curChunkId);

            for (let y = 0; y < borderY; y++) {
                console.log("line: " + y);
                borderX = curPosX / GameConfig.chunkSize + chunkData[y].length / 2;

                for (let x = 0; x < borderX; x++) {

                    let curTileData = chunkData[y].substring(x * 2, x * 2 + 2);
                    console.log("tiledata: " + curTileData);
                    this.tiles[x + chunkX * GameConfig.chunkSize][y + chunkY * GameConfig.chunkSize] = new Tile(curTileData);
                }
            }
        }
    }
}