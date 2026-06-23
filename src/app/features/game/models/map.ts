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

    public moveAlongText(x: number, y: number, offset: number): Pos {
        let tempTile;
        let curPos = new Pos(x, y);
        let sign = offset >= 0
            ? 1
            : -1;
        for (let i = 1; i <= Math.abs(offset); i++) {
            tempTile = this.tileAt(curPos.x + sign, curPos.y);
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
            let tempDeleted = this.deleteCharAt(xStart - 1, y, autoWrap);
            if (tempDeleted == "")
                return deleted;
            deleted += tempDeleted;
        }

        return deleted;
    }

    public deleteCharAt(posX: number, posY: number, autoWrap: boolean = true): string {
        let lineEnd = this.getLineEnd(posX, posY);
        let deleted = this.tileAt(posX, posY);

        if (deleted.type != TileType.GROUND)
            return "";

        deleted = this.tileAt(posX, posY);
        this.shiftTiles(posX + 1, lineEnd - 1, posY, -1);

        if (autoWrap)
            if (deleted.value == "\n")
                this.wrapUpwards(posX, posY, 0);
            else
                this.wrapUpwards(posX + 1, posY, 0);

        return deleted.value;
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
        let writableTileCount = this.countWritableTilesFrom(posX, posY);
        let str = chars + this.getCharsAt(posX, this.getLineEnd(posX, posY) - 1, posY);
        let newlIndex = chars.indexOf("\n");
        let overflow = "";
        let wrapIndex = -1;

        if (str.length > writableTileCount)
            wrapIndex = writableTileCount;

        if (newlIndex != -1 && newlIndex < writableTileCount)
            wrapIndex = newlIndex + 1;

            if (wrapIndex >= 0) {
            overflow = str.substring(wrapIndex);
            chars = chars.substring(0, wrapIndex);
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
            }

            t[posY] = row;
            return [...t];
        });
    }

    public getLineStart(posX: number, posY: number): number {
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

    public getPrevLineEnd(x: number, y: number): Pos {
        let lineStart = this.getLineStart(x, y);
        let lineEnd = this.getLineEnd(lineStart, y);
        let prevLineEnd = this.getLineEnd(lineEnd, y - 1);

        return new Pos(prevLineEnd - 1, y - 1);
    }

    public getNextLineStart(x: number, y: number): Pos {
        let lineStart = this.getLineStart(x, y);
        let limit = this.countWritableTilesFrom(lineStart, y);
        let nextLineStart = this.getLineStart(lineStart, y + 1);

        if (nextLineStart > limit - lineStart)
            throw "no next line";
        return new Pos(nextLineStart, y + 1);
    }

    public getLineEnd(posX: number, posY: number): number {
        let curTile = this.tileAt(posX, posY);
        let offset = 0;

        if (curTile.type == TileType.GROUND) {
            do {
                offset++;
                if (posX + offset < 0)
                    break;
                curTile = this.tileAt(posX + offset, posY);
            }
            while (curTile.type == TileType.GROUND)
        }
        else {
            offset++;
            do {
                offset--;
                if (posX + offset < 0) {
                    offset = -1;
                    break;
                }
                curTile = this.tileAt(posX + offset, posY);

            }
            while (curTile.type != TileType.GROUND)
            offset++;
        }
        return posX + offset;
    }

    public nextLineExists(posX: number, posY: number, limit: number = 0): boolean {
        try {
            let limit = this.countWritableTilesFrom(posX, posY) + posX;
            let nextLineStart = this.getNextLineStart(posX, posY).x;
            return nextLineStart <= limit;
        }
        catch (e: any) {
            return false;
        }
    }

    public nextWalkableLeft(posX: number, posY: number): Pos {
        let curPos = new Pos(posX, posY);
        let tempTile = this.tileAt(curPos.x, curPos.y);
        while (tempTile.type != TileType.GROUND) {
            if (tempTile.type == TileType.WALL) {
                curPos = this.getPrevLineEnd(curPos.x, curPos.y);
            }
            else
                curPos.x--;
            tempTile = this.tileAt(curPos.x, curPos.y);
        }
        // tempTile = this.tileAt(curPos.x + sign, curPos.y);
        // if (tempTile.type.isWalkable)
        //     curPos.x += sign;
        // else {
        //     curPos = sign == 1
        //         ? this.getNextLineStart(curPos.x, curPos.y)
        //         : this.getPrevLineEnd(curPos.x, curPos.y);
        // }
        return curPos;
    }

    public countWritableTilesFrom(posX: number, posY: number) {
        let tempTile;
        let count = -1;

        do {
            count++;
            tempTile = this.tileAt(posX + count, posY);
        }
        while (tempTile != undefined && tempTile.type != TileType.WALL)

        return count;
    }

    public wrapUpwards(posX: number, posY: number, count: number, wrapFullLine: boolean = false): string {
        let lineStart = this.getLineStart(posX, posY);
        let lineEnd = this.getLineEnd(posX, posY);
        let emptyCount = this.countWritableTilesFrom(lineEnd, posY);
        let limit = Math.min(count, lineEnd - lineStart);
        let deletedChars = "";
        let wrapFullNextLine: boolean;
        let nextLineStart: number;
        let toWrite: string;

        deletedChars = this.deleteChars(lineStart + 1, lineStart + 1 + limit, posY, false);
        wrapFullNextLine = deletedChars.at(-1) == "\n";

        if (!this.nextLineExists(posX, posY) ||
            (this.tileAt(lineEnd - 1 - deletedChars.length, posY).value == "\n" && !wrapFullNextLine))
            return deletedChars;

        nextLineStart = this.getNextLineStart(posX, posY).x;
        toWrite = this.wrapUpwards(nextLineStart, posY + 1, emptyCount + deletedChars.length);
        this.write(Math.max(lineEnd - deletedChars.length, 0), posY, toWrite);

        if (this.mustWrapUpwards(posX, posY))
            this.wrapUpwards(this.getLineEnd(posX, posY) - 1, posY, 0);

        return deletedChars;
    }

    public tryWrapDown(posX: number, posY: number, chars: string): boolean {
        if (chars == "")
            return true;
        if (!this.nextLineExists(posX, posY))
            return false

        let lineStart = this.getLineStart(posX, posY);
        let lineEnd = this.getLineEnd(lineStart, posY);
        let nextLineStart = this.getNextLineStart(posX, posY).x;
        let deleted = "";
        for (let i = 1; i <= chars.length; i++)
            deleted += this.deleteCharAt(lineEnd - i, posY, false);

        this.write(nextLineStart, posY + 1, chars);
        return true;
    }

    public getCharsAt(xStart: number, xEnd: number, y: number) {
        let str = "";
        for (let x = xStart; x <= xEnd; x++)
            str += this.tileAt(x, y).value;
        return str;
    }

    public getLineChars(posX: number, posY: number) {
        let lineStart = this.getLineStart(posX, posY);
        let lineEnd = this.getLineEnd(posX, posY);
        return this.getCharsAt(lineStart, lineEnd, posY);
    }

    public getLastTileOfLine(posX: number, posY: number): Tile {
        let lineStart = this.getLineStart(posX, posY);
        let lineEnd = this.getLineEnd(posX, posY);
        let lastTile = this.tileAt(lineEnd - 1, posY);
        return lastTile;
    }

    private mustWrapUpwards(posX: number, posY: number): boolean {
        return this.getLastTileOfLine(posX, posY).value != "\n"
            && this.tileAt(this.getLineEnd(posX, posY,), posY).type == TileType.EMPTY
            && this.tileAt(this.getNextLineStart(posX, posY).x, posY + 1).type == TileType.GROUND
    }
}       
