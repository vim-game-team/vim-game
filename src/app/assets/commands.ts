import { Command } from "../shared/models/command.ts";
import { CMDTYPE } from "../shared/types.ts";

export let commands: Map<string, Command> = new Map<string, Command>();
commands.set('h', new Command('h', CMDTYPE.MOTION)); // move left
commands.set('j', new Command('j', CMDTYPE.MOTION)); // move down
commands.set('k', new Command('k', CMDTYPE.MOTION)); // move up
commands.set('l', new Command('l', CMDTYPE.MOTION)); // move right
commands.set('w', new Command('w', CMDTYPE.MOTION)); // move to next non-alpabetic 
commands.set('W', new Command('W', CMDTYPE.MOTION)); // move to next space 
commands.set('d', new Command('d', CMDTYPE.OPERATOR, [CMDTYPE.MOTION, CMDTYPE.TEXTOBJ])); // delete
