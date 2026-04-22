export enum CmdType {
    MOVEMENT = "movement",
    MODESWITCH = "modeswitch",
    TEXTOBJ = "textobj",
}

export enum TileType {
    EMPTY = "empty",
    GROUND = "ground",
    WALL = "wall",
}

export enum Action {
    MOVE,
    DELETE,
}
export enum InputMode {
    MOTION = "motion",
    INSERT = "insert",
}

// export function encodeTileType(typeAndVal: string) {
//     if (typeAndVal.at(0) == "'") {
//         return TileType.CHAR
//     }
//     switch (typeAndVal.at(1)) {
//         case "e": {
//             return TileType.EMPTY;
//         }
//         case "w": {
//             return TileType.WALL;
//         }
//     }
// }