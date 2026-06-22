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
            case "Enter": {
                input = '\n';
                this.gameState.player.writeChar(input);
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
            "Escape",
            "Enter"
        ];

        return input.length == 1
            || validSpecialKeys.includes(input);

    }

}