class InputArg {
    public count: number;
    public cmd: CMD;
    
    public constructor(key: string, count: number) {
        this.cmd = new CMD(key, CMDTYPE.STANDALONE);
        this.count =
            count == 0
                ? 1
                : count;
    }
}