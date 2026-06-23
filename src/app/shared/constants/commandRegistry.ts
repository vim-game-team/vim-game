import { Command } from "../models/command.js";
import { CmdType } from "../../features/game/models/types.js";
import { required } from "@angular/forms/signals";

export const commands: Map<string, Command> = new Map<string, Command>();
commands.set('i', new Command('i', CmdType.MODESWITCH)); // switch to insert mode at left side
commands.set('a', new Command('a', CmdType.MODESWITCH)); // switch to insert mode at right side
commands.set('h', new Command('h', CmdType.MOVEMENT, CmdType.AREA)); // move left
commands.set('j', new Command('j', CmdType.MOVEMENT, CmdType.AREA)); // move down
commands.set('k', new Command('k', CmdType.MOVEMENT, CmdType.AREA)); // move up
commands.set('l', new Command('l', CmdType.MOVEMENT, CmdType.AREA)); // move right
commands.set('w', new Command('w', CmdType.MOVEMENT, CmdType.AREA)); // move to next non-alpabetic 
commands.set('b', new Command('b', CmdType.MOVEMENT, CmdType.AREA)); // move to beginning of current or previous word(symbols count as words)
commands.set('B', new Command('B', CmdType.MOVEMENT, CmdType.AREA)); // move to beginning of current or previous word(symbols dont count as words)
commands.set('e', new Command('e', CmdType.MOVEMENT, CmdType.AREA)); // move end of word
commands.set('E', new Command('E', CmdType.MOVEMENT, CmdType.AREA)); // move end of WORD ignoring symbols 
commands.set('$', new Command('$', CmdType.MOVEMENT, CmdType.AREA)); // move to end of line
commands.set('x', new Command('x', CmdType.DELETE)); // delete char and copy to clip board
commands.set('p', new Command('p', CmdType.WRITE)); // paste and reset clipboard
commands.set('d', new Command('d', CmdType.OPERATOR, undefined, CmdType.AREA)); // delete text area returned by second command and copy to clipboard 