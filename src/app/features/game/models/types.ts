export enum CmdType {
    MOTION = "motion",
    OPERATOR = "operator",
    TEXTOBJ = "textobj",
    NONE = "none",
}
export enum TileType {
    EMPTY = "e",
    CHAR = "'",
    WALL = "w",

}

export enum Action {
    MOVE,
    DELETE,
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