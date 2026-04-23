import { Command } from "../../../../shared/models/command";
import { InputMode } from "../../models/types";
import { CommandParser } from "./command-parser.service";
import { GameState } from "../game-state.service";
import { Injectable } from "@angular/core";
import { fromEvent } from "rxjs";

@Injectable()
export class InputRouter {
    gameState: GameState;
    commandParser: CommandParser;

    public constructor(gameState: GameState) {
        this.gameState = gameState;
        this.commandParser = new CommandParser(gameState);

        fromEvent<KeyboardEvent>(document, 'keydown')
            .subscribe(event => this.handleInput(event.key))
    }

    public handleInput(input: string) {
        if (!this.isInputValid(input))
            return;

        switch (this.gameState.inputMode) {
            case InputMode.VIM: {
                let translatedInput = this.translateSynonyms(input)!;
                this.commandParser.parse(translatedInput);
                break;
            }

            case InputMode.INSERT: {
                switch (input) {
                    case "Backspace": {
                        this.gameState.player.deleteChar();
                        break;
                    }
                    case "Escape": {
                        this.gameState.inputMode = InputMode.VIM;
                        break;
                    }
                    default: {
                        this.gameState.player.writeChar(input);
                    }
                }
            }
        }
    }

    private isInputValid(input: string) {

        switch (this.gameState.inputMode) {
            case InputMode.INSERT: {
                return this.isValidInInsertMode(input);
                break;
            }
            case InputMode.VIM: {
                return this.isValidInVimMode(input);
                break;
            }

        }
    }

    private isValidInVimMode(input: string) {
        let validSpecialKeys = [
            ""
        ];

        return input.length == 1
            || validSpecialKeys.includes(input);

    }

    private translateSynonyms(input: string) {
        let synonyms: Map<string, string> = new Map();
        synonyms.set("ArrowUp", "k");
        synonyms.set("ArrowDown", "j");
        synonyms.set("ArrowLeft", "h");
        synonyms.set("ArrowRight", "l");
        synonyms.set("Backspace", "h");

        return synonyms.has(input)
            ? synonyms.get(input)
            : input;
    }

    private isValidInInsertMode(input: string) {
        let validSpecialKeys = [
            "Backspace",
            "Escape"
        ];

        return input.length == 1
            || validSpecialKeys.includes(input);

    }

}