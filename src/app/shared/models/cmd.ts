import "../types.ts"

class CMD {
    public key: string;
    public returns: CMDTYPE;
    public expects: CMDTYPE[];

    public constructor(key: string, returns: CMDTYPE, expects: CMDTYPE[] = []) {
        this.key = key;
        this.returns = returns
        this.expects = expects;
    }
}