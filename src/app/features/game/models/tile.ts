import { TileType } from "./types";

export class Tile {
    public type: TileType;
    public value: string = " ";

    public constructor(typeAndVal: string = "$e") {
        if (typeAndVal.length < 2)
            typeAndVal = "$e";

        this.type = this.typeFromCode(typeAndVal.at(0)!);
        this.value = typeAndVal.at(1)!;

    }
    
    public typeFromCode(code: string): TileType {
        switch (code) {
            case "'": return TileType.GROUND;
            case "|": return TileType.WALL;
            case "-": return TileType.DANGER;
            default: return TileType.EMPTY;
        }
    }
}