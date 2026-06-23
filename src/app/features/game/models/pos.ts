export class Pos {
    public x: number;
    public y: number;

    public constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }
    public toString(): string {
        return "[" + this.x + "-" + this.y + "]";
    }
    public offset(p: Pos): Pos {
        
        this.x += p.x;
        this.y += p.y;
        return this;
    }
}