import { TileType, TileTypeName } from "./types";

export class Tile {
    public type;
    public value: string = " ";

    public constructor(typeAndVal: string = "$e") {
        if (typeAndVal.length < 2)
            typeAndVal = "$e";

        this.type = this.typeFromCode(typeAndVal.at(0)!);
        this.value = typeAndVal.at(1)!;
    }

    public typeFromCode(code: string) {
        switch (code) {
            case TileType.GROUND.charCode: return TileType.GROUND;
            case TileType.WALL.charCode: return TileType.WALL;
            case TileType.DANGER.charCode: return TileType.DANGER;
            default: return TileType.EMPTY;
        }
    }
}