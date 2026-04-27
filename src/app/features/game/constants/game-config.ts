import { TileType } from "../models/types";

export class GC {
    public static CHUNKSIZE: number = 24;
    public static VIEWPORTBUFF: number = 2;
    public static TILESIZE = 64;
    public static chunkLoadDistance: number = 1;
    public static walkableTiles = [TileType.GROUND, TileType.DANGER];
    public static movableTiles = [TileType.GROUND, TileType.DANGER];
    public static immovableTiles = [TileType.WALL];
}