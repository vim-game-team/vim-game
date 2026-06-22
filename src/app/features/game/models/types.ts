export enum CmdType {
    MOVEMENT = "movement",
    MODESWITCH = "modeswitch",
    TEXTOBJ = "textobj",
    WRITE = "write",
    DELETE = "delete",
}

export const TileType = {
    EMPTY: { value: "empty", isWalkable: false, isStatic: true, charCode: '$' },
    GROUND: { value: "ground", isWalkable: true, isStatic: false, charCode: "'" },
    WALL: { value: "wall", isWalkable: false, isStatic: true, charCode: '|' },
    DANGER: { value: "danger", isWalkable: true, isStatic: false, charCode: '-' },
} as const;
export type TileTypeName = keyof typeof TileType;

export enum Action {
    MOVE,
    DELETE,
}

export enum InputMode {
    VIM = "VIM",
    INSERT = "insert",
}

export enum CharType {
    ALPHANUM = "alphanum",
    WHITESPACE = "whitespace",
    SYMBOL = "symbol",
}
