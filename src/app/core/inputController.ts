import "../shared/models/inputArg";
import "../shared/utils.ts";
import "../assets/commands.ts";

class InputController {
    public inputArgs: InputArg[] = [];
    public tempCount: number = 0;

    public parseInputChar(input: string) {

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

            this.inputArgs.push(new InputArg(input, this.tempCount));
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