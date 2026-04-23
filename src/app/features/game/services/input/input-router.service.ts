import { Command } from "../../../../shared/models/command";
import { InputMode } from "../../models/types";
import { CommandParser } from "./command-parser.service";
import { GameState } from "../game-state.service";
import { Injectable } from "@angular/core";
import { fromEvent } from "rxjs";
import { WriterService } from "./writer.service";

@Injectable()
export class InputRouter {
    gameState: GameState;
    commandParser: CommandParser;
    writerService: WriterService;
    public constructor(gameState: GameState) {
        this.gameState = gameState;
        this.commandParser = new CommandParser(gameState);
        this.writerService = new WriterService(gameState);

        fromEvent<KeyboardEvent>(document, 'keydown')
            .subscribe(event => this.handleInput(event.key))
    }

    public handleInput(input: string) {
        switch (this.gameState.inputMode) {
            case InputMode.VIM: {
                this.commandParser.parse(input);
                break;
            }
            case InputMode.INSERT: {
                if (this.writerService.validate(input))
                    this.writerService.write(input);
            }
        }
    }
}