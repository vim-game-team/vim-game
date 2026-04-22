import { Injectable } from "@angular/core"
import { InputToken } from "../../models/inputToken.js";
import { addAsDigits, isNumeric } from "../../../../shared/utils.js";
import { commands } from "../../../../shared/constants/commands.js";
import { CommandService } from "../command.service.js";
import { GameState } from "../game-state.service.js";
import { CmdType, InputMode } from "../../models/types.js";

@Injectable()
export class CommandParser {
    public inputArgs: InputToken[] = [];
    public tempCount: number = 0;
    private executor: CommandService;

    public constructor(gameState: GameState) {
        this.executor = new CommandService(gameState);
    }

    public parse(input: string) {
        if (!this.validateAndParse(input)) {
            this.reset();
            return;
        }
        // console.log("TOKENS: " + JSON.stringify(this.inputArgs));
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
