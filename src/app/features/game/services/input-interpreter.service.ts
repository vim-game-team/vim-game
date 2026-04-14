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
        catch (e) {
            console.log("FAILED: " + e);
        }
    }

    public insertChar(input: string) {
        this.executor.writeChar(input);
    }

    public parseMotionInput(input: string) {
        if (!this.validateAndParse(input)) {
            this.reset();
            return;
        }
        console.log("TOKENS: " + JSON.stringify(this.inputArgs));
        this.executeIfPossible();

    }
    public validateAndParse(input: string): boolean {
        try {
            let tempCMD;
            if (isNumeric(input)) {
                this.tempCount = this.tempCount == 0
                    ? Number(input)
                    : addAsDigits(this.tempCount, input);
                return true;
            }
            console.log("not numeric");
            tempCMD = commands.get(input);
            if (tempCMD === undefined)
                return false;

            if (this.inputArgs.length > 0
                && !this.inputArgs.at(-1)?.cmd.expects.includes(tempCMD.returns))
                return false;

            this.inputArgs.push(new InputToken(input, this.tempCount));
            this.tempCount = 0;
            return true;
        }
        catch (e: any) {
            console.log("validation or parsing error: " + e)
            return false;
        }
    }

    public executeIfPossible() {
        if (this.inputArgs.length == 0 || this.inputArgs.at(-1)?.cmd.expects.length != 0)
            return;

        this.executor.execute(this.inputArgs);
        this.reset();
    }

    public reset() {
        this.inputArgs = [];
        this.tempCount = 0;
    }
}
