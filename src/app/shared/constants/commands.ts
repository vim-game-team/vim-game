import { Command } from "../models/command.js";
import { CmdType } from "../../features/game/models/types.js";

export const commands: Map<string, Command> = new Map<string, Command>();
commands.set('h', new Command('h', CmdType.MOVEMENT)); // move left
commands.set('j', new Command('j', CmdType.MOVEMENT)); // move down
commands.set('k', new Command('k', CmdType.MOVEMENT)); // move up
commands.set('l', new Command('l', CmdType.MOVEMENT)); // move right
commands.set('i', new Command('i', CmdType.MODESWITCH)); // switch to insert mode at left side
commands.set('w', new Command('w', CmdType.MOVEMENT)); // move to next non-alpabetic
commands.set('b', new Command('b', CmdType.MOVEMENT)); // move to beginning of current or previous word(symbols count as words)
commands.set('B', new Command('B', CmdType.MOVEMENT)); // move to beginning of current or previous word(symbols dont count as words)
