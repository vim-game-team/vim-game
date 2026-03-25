import { TileType } from "./types";

export class Tile {
    public type: TileType;
    public letter: string;

    public constructor(type: TileType, letter: string = "A") {
        this.type = type;
        this.letter = letter;
    }
}