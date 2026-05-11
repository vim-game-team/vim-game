import { InputMode } from "../models/types";
import { GameState } from "./game-state.service";

export class WriterService {
    public gameState: GameState;

    public constructor(gameState: GameState) {
        this.gameState = gameState;
    }

    public write(input: string) {
        switch (input) {
            case "Escape": {
                this.gameState.inputMode = InputMode.VIM;
                break;
            }
            case "Backspace": {
                this.gameState.player.deleteChar();
                break;
            }
            default: {
                this.gameState.player.writeChar(input);
            }
        }
    }
    public validate(input: string) {
        let validSpecialKeys = [
            "Backspace",
            "Escape"
        ];

        return input.length == 1
            || validSpecialKeys.includes(input);

    }

}