let commands: Map<string, CMD> = new Map<string, CMD>();

commands.set('h', new CMD('h', CMDTYPE.MOTION)); // move left
commands.set('j', new CMD('j', CMDTYPE.MOTION)); // move down
commands.set('k', new CMD('k', CMDTYPE.MOTION)); // move up
commands.set('l', new CMD('l', CMDTYPE.MOTION)); // move right
commands.set('w', new CMD('w', CMDTYPE.MOTION)); // move to next non-alpabetic 
commands.set('W', new CMD('W', CMDTYPE.MOTION)); // move to next space 
commands.set('d', new CMD('d', CMDTYPE.OPERATOR, [CMDTYPE.MOTION, CMDTYPE.TEXTOBJ])); // delete