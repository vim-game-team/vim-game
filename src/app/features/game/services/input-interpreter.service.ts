import { Injectable } from "@angular/core"
import { InputToken } from "../models/inputToken.js";
import { addAsDigits, isNumeric } from "../../../shared/utils.js";
import { commands } from "../../../shared/constants/commands.js";
import { fromEvent } from "rxjs";
import { CommandService } from "./command.service.js";
import { GameState } from "../services/game-state.service";
import { CmdType, InputMode } from "../models/types.js";

@Injectable()
export class InputInterpreter {
    public inputArgs: InputToken[] = [];
    public tempCount: number = 0;
    public listen: boolean = true;
    public executor: CommandService;

    public constructor(gameState: GameState) {
        this.executor = new CommandService(gameState);

        fromEvent<KeyboardEvent>(document, 'keydown')
            .subscribe(event => this.handleInput(event.key))
    }

    public handleInput(input: string) {
        console.log("input: " + input);
        if (!this.listen)
            return;

        try {
            console.log("input mode: " + this.executor.gameState.inputMode);
            this.parseInput(input);
        }
        catch (e) {
            console.log("FAILED: " + e);
        }
    }
    private parseInput(input: string) {

        switch (this.executor.gameState.inputMode) {
            case InputMode.MOTION: {
                this.parseMotionInput(input);
                break;
            }
            case InputMode.INSERT: {
                this.insertChar(input);
                break;
            }
        }
    }
    private insertChar(input: string) {
        this.executor.writeChar(input);
    }

    private parseMotionInput(input: string) {
        if (!this.validateAndParse(input)) {
            this.reset();
            return;
        }
        console.log("TOKENS: " + JSON.stringify(this.inputArgs));
        this.executeIfPossible();

    }
    private validateAndParse(input: string): boolean {
        let tempCMD;
        if (isNumeric(input)) {
            this.tempCount = this.tempCount == 0
                ? Number(input)
                : addAsDigits(this.tempCount, input);
            return true;
        }

        tempCMD = commands.get(input);
        if (tempCMD === undefined)
            return false;

        if (this.inputArgs.length > 0
            && !this.inputArgs.at(-1)?.cmd.expects.includes(tempCMD.type))
            return false;

        this.inputArgs.push(new InputToken(input, this.tempCount));
        this.tempCount = 0;
        return true;
    }


    private executeIfPossible() {
        if (this.inputArgs.at(-1)?.cmd.expects.length != 0)
            return

        console.log("EXECUTING: ");
        this.executor.execute(this.inputArgs);
        this.reset();
    }

    private reset() {
        this.inputArgs = [];
        this.tempCount = 0;
    }
}
