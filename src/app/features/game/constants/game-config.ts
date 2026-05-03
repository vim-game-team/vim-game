import { Injectable } from "@angular/core";
import { TileType } from "../models/types";

@Injectable()
export class GC {
    public static CHUNKSIZE: number = 24;
    public static VIEWPORTBUFF: number = 2;
    public static WALKABLETILES = [TileType.GROUND, TileType.DANGER];
    public static TILESIZE = 64;
    public static VIEWPORTMOVETHRESHHOLD = 4;
    public static chunkLoadDistance: number = 1;
    public static movableTiles = [TileType.GROUND, TileType.DANGER];
    public static immovableTiles = [TileType.WALL];
}