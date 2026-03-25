import { GameState } from "./game-state.service";
import { InputToken } from "../models/inputToken";
import { Command } from "../../../shared/models/command";

export class CommandService {
    public gameState: GameState;

    public constructor(gameState: GameState) {
        this.gameState = gameState;
    }

    public execute(tokens: InputToken[]) {
        tokens.forEach((token) => {
            const func = (this as any)["execute_" + token.cmd.key];
            func.call(this);
        });
    }

    public execute_h() {
        console.log("CALLED execute_h!!!!!!");
        this.gameState.player.move(-1, 0);
    }

    public execute_j() {
        this.gameState.player.move(0, 1);
    }

    public execute_k() {
        this.gameState.player.move(0, -1);
    }
    public execute_l() {
        this.gameState.player.move(1, 0);
    }
}