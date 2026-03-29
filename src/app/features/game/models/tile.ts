import { TileType } from "./types";

export class Tile {
    public type: TileType;
    public value: string = " ";

    public constructor(typeAndVal: string = "$e") {
        if (typeAndVal.length < 2)
            typeAndVal = "$e";

        if (typeAndVal.at(0) == "'") {
            this.type = TileType.CHAR;
            this.value = typeAndVal.at(1)!;
            return;
        }

        switch (typeAndVal.at(1)) {
            case "e": {
                this.type = TileType.EMPTY;
                break;
            }
            case "w": {
                this.type = TileType.WALL;
                break;
            }
            default: {
                this.type = TileType.EMPTY;
            }
        }
    }
}