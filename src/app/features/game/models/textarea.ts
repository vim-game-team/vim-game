import { Pos } from "./pos";

export class TextArea {
    public start: Pos;
    public end: Pos;

    public constructor(start: Pos, end: Pos) {
        this.start = start;
        this.end = end;
    }
}