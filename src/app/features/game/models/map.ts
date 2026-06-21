import { signal, Signal } from "@angular/core";
import { Tile } from "./tile";
import { GC } from "../constants/game-config";
import { chunks } from "../constants/map-data";
import { min, max } from "../../../shared/utils";
import { TileType } from "./types";
import { empty, Subject } from "rxjs";
import { Pos } from "./pos";

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

    public moveOnText(x: number, y: number, offset: number): Pos {
        let tempTile;
        let curPos = new Pos(x, y);
        let sign = offset >= 0
            ? 1
            : -1;
        for (let i = 1; i <= Math.abs(offset); i++) {
            tempTile = this.tileAt(curPos.x + (i * sign), curPos.y);
            if (tempTile.type.isWalkable)
                curPos.x += sign;
            else {
                curPos = sign == 1
                    ? this.getNextLineStart(curPos.x, curPos.y)
                    : this.getPrevLineEnd(curPos.x, curPos.y);
            }
        }
        return curPos;
    }

    public deleteChars(xStart: number, xEnd: number, y: number, autoWrap: boolean = false): string {
        let deleted = "";
        for (let x = xStart; x < xEnd; x++) {
            let tempDeleted = this.deleteCharAt(x, y, autoWrap);
            if (tempDeleted == "")
                return deleted;
            deleted += tempDeleted;
        }
        return deleted;
    }

    //Fix remove posX -1 offset
    public deleteCharAt(posX: number, posY: number, autoWrap: boolean = true): string {
        let lineEnd = this.getLineEnd(posX, posY);
        let deleted = "";

        if (this.tileAt(posX - 1, posY).type != TileType.GROUND)
            return deleted;

        deleted = this.tileAt(posX - 1, posY).value;
        this.shiftTiles(posX, lineEnd - 1, posY, -1);

        if (autoWrap)
            this.wrapUpwards(posX, posY, 0);

        return deleted;
    }

    public shiftTiles(startX: number, endX: number, y: number, offset: number) {
        let sign = offset >= 0
            ? 1
            : -1;
        let fillStart = offset >= 0
            ? startX
            : endX;
        this.tiles.update(t => {
            let row = [...t[y]];
            row.copyWithin(startX + offset, startX, endX + 1);

            for (let i = 0; i < Math.abs(offset); i++)
                row[fillStart + (i * sign)] = new Tile("$ ");

            t[y] = row;
            return [...t];
        });

    }

    public write(posX: number, posY: number, chars: string): boolean {
        if (chars.length == 0)
            return true;

        let overflow = this.getOverflowingChars(posX, posY, chars);
        let writableTiles = this.countWritableTilesFrom(posX, posY);

        if (chars.length > writableTiles) {
            overflow = chars.substring(writableTiles,) + overflow;
            chars = chars.substring(0, writableTiles);
        }

        if (chars.at(-1) == "\n") {
            let wrappingChars = this.getCharsAt(posX, this.getLineEnd(posX, posY) -1, posY);
            console.log("wrapping after newLine: " + wrappingChars );
            this.tryWrapDown(
                posX + chars.length - 1,
                posY,
                wrappingChars)
        }
        else if (overflow.length > 0) {
            if (!this.tryWrapDown(posX, posY, overflow))
                return false;
        }
        this.insertCharsAt(posX, posY, chars);

        return true;
    }

    public insertCharsAt(posX: number, posY: number, chars: string) {
        let lineEnd = this.getLineEnd(posX, posY);

        this.tiles.update(t => {
            let row = [...t[posY]];
            row.copyWithin(posX + chars.length, posX, lineEnd);

            for (let i = 0; i < chars.length; i++) {
                if (row[posX + i].type == TileType.WALL)
                    break;
                row[posX + i] = new Tile("'" + chars[i]);
                // if (chars[i] == "\n")
                //     break;
            }

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
        }
        else {
            do {
                offset--;
                curTile = this.tileAt(posX + offset, posY);
            }
            while (posX + offset >= 0
                && curTile.type != TileType.WALL)
            offset++;
        }

        return posX + offset;
    }

    private getPrevLineStart(x: number, y: number): Pos {
        let lineStart = this.getLineStart(x, y);
        let lineEnd = this.getLineEnd(x, y);
        let prevLineStart = this.getLineStart(lineStart, y - 1);

        if (prevLineStart > lineEnd)
            throw "no prev line";
        return new Pos(prevLineStart, y - 1);
    }

    private getPrevLineEnd(x: number, y: number): Pos {
        let lineStart = this.getLineStart(x, y);
        let prevLineEnd = this.getLineEnd(lineStart, y - 1);

        return new Pos(prevLineEnd - 1, y - 1);
    }

    private getNextLineStart(x: number, y: number): Pos {
        let lineStart = this.getLineStart(x, y);
        let lineEnd = this.getLineEnd(x, y);
        let nextLineStart = this.getLineStart(lineStart, y + 1);

        if (nextLineStart > lineEnd)
            throw "no next line";
        return new Pos(nextLineStart, y + 1);
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
        let count = this.countWritableTilesFrom(lineEnd, posY);
        let overflow = "";

        if (chars.length > count) {
            overflow = this.getCharsAt(lineEnd - count - 1, lineEnd - 1, posY);
            // if (chars.length > count + (lineEnd - posX)) {
            //     overflow = chars.substring((lineEnd - posX - count) * -1) + overflow;
            // }
            // console.log("LINE " + posY + " - OVERFLOWW: " + overflow);
        }
        return overflow;
    }
    private countWritableTilesFrom(posX: number, posY: number) {
        let tempTile;
        let count = -1;

        do {
            count++;
            tempTile = this.tileAt(posX + count, posY);
        }
        while (tempTile != undefined && tempTile.type != TileType.WALL)

        return count;
    }

    private wrapUpwards(posX: number, posY: number, count: number): string {
        let lineStart = this.getLineStart(posX, posY);
        let deletedChars = "";
        let lineEnd = this.getLineEnd(posX, posY);
        let emptyCount = 0;

        deletedChars = this.deleteChars(lineStart + 1, lineStart + 1 + count, posY, false);
        lineEnd = this.getLineEnd(posX, posY);

        if (deletedChars.length != count
            || this.tileAt(lineEnd - 1, posY).value == "\n") {
            return deletedChars;
        }

        while (this.tileAt(lineEnd + emptyCount, posY).type == TileType.EMPTY)
            emptyCount++;

        let nextLineStart = this.getNextLineStart(posX, posY).x;
        let toWrite = this.wrapUpwards(nextLineStart, posY + 1, emptyCount);
        this.write(lineEnd, posY, toWrite);

        return deletedChars;
    }

    private tryWrapDown(posX: number, posY: number, chars: string): boolean {
        if (!this.nextLineExists(posX, posY)) {
            console.log("no next line from: " + posX + "-" + posY);
            return false
        }

        let lineEnd = this.getLineEnd(posX, posY);
        let nextLineStart = this.getNextLineStart(posX, posY).x;

        for (let i = 0; i < chars.length; i++) {
            this.deleteCharAt(lineEnd - i, posY, false);
        }

        console.log("wrap writing: " + chars);
        this.write(nextLineStart, posY + 1, chars);

        return true;
    }

    public getCharsAt(xStart: number, xEnd: number, y: number) {
        let str = "";
        for (let x = xStart; x <= xEnd; x++)
            str += this.tileAt(x, y).value;
        return str;
    }
}      