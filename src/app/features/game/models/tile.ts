import { TileType } from "./types";

export class Tile {
    public type: TileType;
    
    public constructor(type: TileType) {
        this.type = type;
    }
}