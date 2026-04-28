import { TileType } from "../models/types";

export class GameConfig {
    public static chunkSize: number = 24;
    public static chunkLoadDistance: number = 1;
    public static tileSize = 64;
    public static walkableTiles = [TileType.GROUND, TileType.DANGER];
    public static movableTiles = [TileType.GROUND, TileType.DANGER];
    public static immovableTiles = [TileType.WALL];
}