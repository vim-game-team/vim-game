import { signal, Signal } from "@angular/core";
import { Tile } from "./tile";
import { GameConfig } from "../constants/game-config";
import { chunks } from "../constants/map-data";
import { min, max } from "../../../shared/utils";
import { TileType } from "./types";

export class Map {
    public tiles = signal<Tile[][]>([]);
    private chunkLength: number;

    public constructor(curPosX: number = 0, curPosY = 0) {
        let chunkDist = GameConfig.chunkLoadDistance;
        let startChunkPosX = max(curPosX / GameConfig.chunkSize - chunkDist, 0);
        let startChunkPosY = max(curPosY / GameConfig.chunkSize - chunkDist, 0);

        this.chunkLength = (chunkDist * 2) + 1;
        this.tiles = signal(new Array(this.chunkLength * GameConfig.chunkSize)
            .fill(false)
            .map(() => new Array(this.chunkLength * GameConfig.chunkSize)
                .fill(new Tile("L "))));

        for (let chunkX = startChunkPosX; chunkX <= startChunkPosX + chunkDist; chunkX++) {
            for (let chunkY = startChunkPosY; chunkY <= startChunkPosY + chunkDist; chunkY++) {
                this.loadChunk(chunkX, chunkY, curPosX, curPosY);
            }
        }
    }

    private loadChunk(chunkX: number, chunkY: number, curPosX: number, curPosY: number) {
        let curChunkId = chunkX + "-" + chunkY;
        console.log("checking chunk: " + curChunkId);
        if (chunks.has(curChunkId)) {
            let borderY, borderX: number;
            let chunkData = chunks.get(curChunkId)!;
            borderY = curPosY / GameConfig.chunkSize + min(chunkData.length, GameConfig.chunkSize);

            console.log("found chunk: " + curChunkId);

            for (let y = 0; y < borderY; y++) {
                borderX = curPosX / GameConfig.chunkSize + chunkData[y].length / 2;

                for (let x = 0; x < borderX; x++) {

                    let curTileData = chunkData[y].substring(x * 2, x * 2 + 2);

                    this.tiles.update(t => {
                        t[y + chunkY * GameConfig.chunkSize][x + chunkX * GameConfig.chunkSize]
                            = new Tile(curTileData);
                        return [...t];
                    });
                }
            }
        }
    }

    public tileAt(x: number, y: number): Tile {
        return this.tiles().at(x)!.at(y)!;
    }
    public insertCharAt(posX: number, posY: number, char: string) {
        // this.tiles().at(posY)?.copyWithin(posX + 1, posX, lineEnd - 1);
        // this.tiles().at(posY)!.at(posX)!.value = char;
        this.tiles.update(t => {
            let row = [...t[posY]];
            let lineEnd = this.findLineEnd(posX, posY);
            row.copyWithin(posX + 1, posX, lineEnd - 1);
            row[posX] = new Tile("'" + char);
            t[posY] = row;
            return [...t];
        });
    }
    public findLineEnd(posX: number, posY: number): number {
        let curTile;
        let offset = 0;
        do {
            curTile = this.tileAt(posY, posX + offset);
            console.log("curtile: " + curTile.type);
            console.log("val: " + curTile.value);
            offset++;
        }
        while (curTile.type == TileType.GROUND)
        switch (curTile.type) {
            case TileType.EMPTY: {
                return offset;
            }
            default: {
                throw "line full, unable to write";
            }
        }
    }
}   