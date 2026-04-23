import { Command } from "../models/command.js";
import { CmdType } from "../../features/game/models/types.js";

export const commands: Map<string, Command> = new Map<string, Command>();
commands.set('h', new Command('h', CmdType.MOVEMENT)); // move left
commands.set('j', new Command('j', CmdType.MOVEMENT)); // move down
commands.set('k', new Command('k', CmdType.MOVEMENT)); // move up
commands.set('l', new Command('l', CmdType.MOVEMENT)); // move right
commands.set('i', new Command('i', CmdType.MODESWITCH)); // switch to insert mode at left side
commands.set('w', new Command('w', CmdType.MOVEMENT)); // move to next non-alpabetic 
// commands.set('W', new Command('W', CmdType.MOVEMENT)); // move to next space 
// commands.set('a', new Command('a', CmdType.STANDALONE)); // switch to insert mode at right side
// commands.set('d', new Command('d', CmdType.OPERATOR, [CmdType.MOVEMENT, CmdType.TEXTOBJ])); // delete