import { Injectable } from "@angular/core";

@Injectable()
export class UiManager {
    public cameraX: number;
    public cameraY: number;

    public constructor() {
        this.cameraX = 0;
        this.cameraY = 0;
    }
}