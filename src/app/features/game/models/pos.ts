export class Pos {
    public x: number;
    public y: number;

    public constructor(coords: number[] = [0, 0]) {
        this.x = coords[0];
        this.y = coords[1];
    }
}