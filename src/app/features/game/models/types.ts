export enum CmdType {
    MOVEMENT = "movement",
    MODESWITCH = "modeswitch",
    TEXTOBJ = "textobj",
}

export enum TileType {
    EMPTY = "empty",
    GROUND = "ground",
    WALL = "wall",
    DANGER = "danger",
}

export enum Action {
    MOVE,
    DELETE,
}

export enum InputMode {
    VIM = "VIM",
    INSERT = "insert",
}

export enum CharType{
    ALPHANUM = "alphanum",
    WHITESPACE = "whitespace",
    SYMBOL = "symbol",
}
