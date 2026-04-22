import { Map } from "../models/map";
import { Player } from "../models/player";
import { InputMode } from "../models/types";

export class GameState {
    public player: Player;
    public map: Map;
    public inputMode: InputMode;

    public constructor() {
        this.map = new Map();
        this.player = new Player(this.map);
        this.inputMode = InputMode.VIM;
    }
}