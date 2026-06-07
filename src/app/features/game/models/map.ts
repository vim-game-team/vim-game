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

        let lineEnd = this.getLineEnd(posX, posY);

        this.tiles.update(t => {
            let row = [...t[posY]];
            row.copyWithin(posX - 1, posX, lineEnd);
            row[lineEnd - 1] = new Tile("$ ");
            t[posY] = row;
            return [...t];
        });
    }

    public write(posX: number, posY: number, chars: string): boolean {
        if (chars.length == 0)
            return true;

        let toWrap: string = this.getOverflowingChars(posX, posY, chars);
        if (toWrap.length > 0) {
            if (!this.tryWrap(posX, posY, toWrap))
                return false;
        }

        this.insertCharsAt(posX, posY, chars)
        return true;
    }

    public insertCharsAt(posX: number, posY: number, chars: string) {
        let lineEnd = this.getLineEnd(posX, posY);

        this.tiles.update(t => {
            let row = [...t[posY]];
            row.copyWithin(posX + chars.length, posX, lineEnd);

            for (let i = 0; i < chars.length; i++)
                if (true)
                    row[posX + i] = new Tile("'" + chars[i]);

            t[posY] = row;
            return [...t];
        });
    }

    private getLineStart(posX: number, posY: number): number {
        let offset = 0;
        let curTile = this.tileAt(posX + offset, posY);
        if (curTile.type == TileType.WALL) {
            do {
                offset++;
                curTile = this.tileAt(posX + offset, posY);
            }
            while (curTile.type == TileType.WALL)
                offset--;
        }
        else {
            do {
                offset--;
                curTile = this.tileAt(posX + offset, posY);
            }
            while (posX + offset >= 0 && curTile.type != TileType.WALL)
            console.log("offset to start: " + offset);
        }
        return posX + offset;

    }

    private getLineEnd(posX: number, posY: number): number {
        let curTile;
        let offset = -1;
        do {
            offset++;
            curTile = this.tileAt(posX + offset, posY);
        }
        while (!curTile.type.isStatic)
        return posX + offset;
    }

    private nextLineExists(posX: number, posY: number): boolean {
        let limit = this.getLineEnd(posX, posY);
        let lineStart = this.getLineStart(posX, posY + 1)
        return lineStart <= limit;
    }

    private getOverflowingChars(posX: number, posY: number, chars: string): string {
        let lineEnd = this.getLineEnd(posX, posY);
        for (let i = 0; i < chars.length; i++) {
            if (
                this.tileAt(lineEnd + i, posY).type != TileType.EMPTY
                // must check if is newLine char
            ) {
                let overflow = this.getCharsAt(lineEnd - i - 1, lineEnd - 1, posY);
                return overflow;
            }
        }
        return "";
    }

    private tryWrap(posX: number, posY: number, chars: string): boolean {
        if (this.nextLineExists(posX, posY)) {
            let lineEnd = this.getLineEnd(posX, posY);

            for (let i = 0; i < chars.length; i++) {
                this.deleteCharAt(lineEnd - i, posY);
            }

            let start = this.getLineStart(posX, posY + 1);
            this.write(start + 1, posY + 1, chars);
            return true;
        }
        else
            return false;
    }

    public getCharsAt(xStart: number, xEnd: number, y: number) {
        let str = "";
        for (let x = xStart; x <= xEnd; x++)
            str += this.tileAt(x, y).value;
        return str;
    }
}      