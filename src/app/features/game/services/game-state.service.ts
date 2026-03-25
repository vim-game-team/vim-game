import { Map } from "../models/map";
import { Player } from "../models/player";
export class GameState {
    public player: Player;
    public map: Map;

    public constructor() {
        console.log("CREATING GAME STATE")
        this.player = new Player();
        this.map = new Map();
    }

    // currChunk
    // loadedChunks
}