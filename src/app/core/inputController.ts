import { InputToken } from "../shared/models/inputToken.ts";
import { addAsDigits, isType } from "../shared/utils.ts";
import { commands } from "../assets/commands.ts";

export class InputController {
    public inputArgs: InputToken[] = [];
    public tempCount: number = 0;

    public handleInput(input: string) {

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
enum InputState {
    IDLE,
    OPERATOR
}