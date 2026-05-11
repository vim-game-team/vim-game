import { signal, Signal } from "@angular/core";
import { Tile } from "./tile";
import { GC } from "../constants/game-config";
import { chunks } from "../constants/map-data";
import { min, max } from "../../../shared/utils";
import { TileType } from "./types";
import { Subject } from "rxjs";

export class Map {
    public tiles = signal<Tile[][]>([]);
    private chunkLength: number;
    onMap = new Subject<void>();

    public constructor(curPosX: number = 0, curPosY = 0) {
        let chunkDist = GC.CHUNK_LOAD_DIST;
        let startChunkPosX = max(curPosX / GC.CHUNK_SIZE - chunkDist, 0);
        let startChunkPosY = max(curPosY / GC.CHUNK_SIZE - chunkDist, 0);

        this.chunkLength = (chunkDist * 2) + 1;
        this.tiles = signal(new Array(this.chunkLength * GC.CHUNK_SIZE)
            .fill(false)
            .map(() => new Array(this.chunkLength * GC.CHUNK_SIZE)
                .fill(new Tile("L "))));

        for (let chunkX = startChunkPosX; chunkX <= startChunkPosX + chunkDist; chunkX++) {
            for (let chunkY = startChunkPosY; chunkY <= startChunkPosY + chunkDist; chunkY++) {
                this.loadChunk(chunkX, chunkY, curPosX, curPosY);
            }
        }
    }

    private loadChunk(chunkX: number, chunkY: number, curPosX: number, curPosY: number) {
        let curChunkId = chunkX + "-" + chunkY;
        if (chunks.has(curChunkId)) {
            let borderY, borderX: number;
            let chunkData = chunks.get(curChunkId)!;
            borderY = curPosY / GC.CHUNK_SIZE + min(chunkData.length, GC.CHUNK_SIZE);

            for (let y = 0; y < borderY; y++) {
                borderX = curPosX / GC.CHUNK_SIZE + chunkData[y].length / 2;

                for (let x = 0; x < borderX; x++) {
                    let curTileData = chunkData[y].substring(x * 2, x * 2 + 2);
                    this.tiles.update(t => {
                        t[y + chunkY * GC.CHUNK_SIZE][x + chunkX * GC.CHUNK_SIZE]
                            = new Tile(curTileData);
                        return [...t];
                    });
                }
            }
        }
    }

    public tileAt(x: number, y: number): Tile {
        return this.tiles().at(y)!.at(x)!;
    }

    public deleteCharAt(posX: number, posY: number) {
        if (this.tileAt(posX - 1, posY).type != TileType.GROUND)
            return;

        let lineEnd = this.findLineEnd(posX, posY);

        this.tiles.update(t => {
            let row = [...t[posY]];
            row.copyWithin(posX - 1, posX, posX + lineEnd);
            row[posX + lineEnd - 1] = new Tile("$ ");
            t[posY] = row;
            return [...t];
        });

    }

    public insertCharAt(posX: number, posY: number, char: string) {
        if (!this.canWriteAt(posX, posY))
            throw "can't write, line full";

        let lineEnd = this.findLineEnd(posX, posY);

        this.tiles.update(t => {
            let row = [...t[posY]];
            row.copyWithin(posX + 1, posX, lineEnd + posX);
            row[posX] = new Tile("'" + char);
            t[posY] = row;
            return [...t];
        });
    }

    public findLineEnd(posX: number, posY: number): number {
        let curTile;
        let offset = -1;
        do {
            offset++;
            curTile = this.tileAt(posX + offset, posY);
        }
        while (!curTile.type.isStatic)
        return offset;
    }

    public canWriteAt(posX: number, posY: number): boolean {
        let lineEnd = this.findLineEnd(posX, posY);
        return this.tileAt(posX + lineEnd, posY).type == TileType.EMPTY;
    }
}   