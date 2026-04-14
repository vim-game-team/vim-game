import { Map } from "../models/map";
import { Player } from "../models/player";
export class GameState {
    public player: Player;
    public map: Map;

    public constructor() {
        console.log("CREATING GAME STATE")
        this.map = new Map();
        this.player = new Player(this.map);
    }

    // currChunk
    // loadedChunks
}