import { Command } from "../models/command.js";
import { CmdType } from "../../features/game/models/types.js";

export const commands: Map<string, Command> = new Map<string, Command>(); 
commands.set('h', new Command('h', CmdType.MOTION)); // move left
commands.set('j', new Command('j', CmdType.MOTION)); // move down
commands.set('k', new Command('k', CmdType.MOTION)); // move up
commands.set('l', new Command('l', CmdType.MOTION)); // move right
commands.set('w', new Command('w', CmdType.MOTION)); // move to next non-alpabetic 
commands.set('W', new Command('W', CmdType.MOTION)); // move to next space 
commands.set('d', new Command('d', CmdType.OPERATOR, [CmdType.MOTION, CmdType.TEXTOBJ])); // delete

