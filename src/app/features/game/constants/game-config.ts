import { Injectable } from "@angular/core";
import { TileType } from "../models/types";

@Injectable()
export class GC {
    public static CHUNK_SIZE: number = 24;
    public static TILE_SIZE = 64;
    public static VP_BUFF: number = 4;  
    public static VP_MOVE_THRESHHOLD = 5;
    public static CHUNK_LOAD_DIST: number = 1;
}