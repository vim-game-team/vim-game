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
        this.tryExecute();
    }

    private validateAndParse(input: string): boolean {
        let tempCMD;
        input = this.translateSynonyms(input)!;
        if (isNumeric(input)) {
            this.tempCount = this.tempCount == 0
                ? Number(input)
                : addAsDigits(this.tempCount, input);
            return true;
        }

        tempCMD = commands.get(input);
        if (tempCMD === undefined)
            return false;

        if (this.inputArgs.length >= 0 &&
            this.inputArgs.at(0)?.cmd.requires != undefined &&
            this.inputArgs.at(0)?.cmd.requires != tempCMD.returns &&
            this.inputArgs.at(0)?.cmd.key != tempCMD.key
        )
            return false;

        this.inputArgs.push(new InputToken(input, this.tempCount));
        this.tempCount = 0;
        return true;
    }


    private tryExecute() {
        if (this.inputArgs.at(0)?.cmd.requires == undefined ||
            this.inputArgs.length == 2) {
            this.executor.execute(this.inputArgs);
            this.reset();
        }
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

    public reset() {
        this.inputArgs = [];
        this.tempCount = 0;
    }
}
