import { Injectable } from "@angular/core"
import { InputToken } from "../models/inputToken.js";
import { addAsDigits, isType } from "../../../shared/utils.js";
import { commands } from "../../../shared/constants/commands.js";
import { fromEvent } from "rxjs";

@Injectable()
export class InputInterpreter {
    public inputArgs: InputToken[] = [];
    public tempCount: number = 0;
    public listen: boolean = true;

    public constructor() {
        fromEvent<KeyboardEvent>(document, 'keydown')
            .subscribe(event => this.handleInput(event.key))
    }
    
    public handleInput(input: string) {
        if (this.listen)
            return;
        if (!this.validateAndParse(input)) {
            this.reset();
            return;
        }

        this.executeIfPossible();
    }

    public validateAndParse(input: string): boolean {
        try {
            let tempCMD;
            if (isType(input, 'number')) {
                this.tempCount = this.tempCount == 0
                    ? Number(input)
                    : addAsDigits(this.tempCount, input);
                return true;
            }

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
        if (this.inputArgs.length == 0 && this.inputArgs.at(-1)?.cmd.expects.length != 0)
            return;

        this.reset();
    }

    public reset() {
        this.inputArgs = [];
        this.tempCount = 0;
    }
}
