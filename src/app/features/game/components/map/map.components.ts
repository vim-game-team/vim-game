import { Component, inject, effect, signal, Injectable, Signal } from "@angular/core";
import { GameState } from "../../services/game-state.service"
import { TileComponent } from "../tile/tile.component";
import { UiManager } from "../../core/UiManager";
import { GC } from "../../constants/game-config";
import { max, min } from "../../../../shared/utils";
import { Pos } from "../../models/pos";


@Component({
    selector: "map-component",
    providers: [UiManager],
    imports: [TileComponent],
    template: `
    <div class="map-container">
    @for(tileRow of buffer(); track $index; let yIndex = $index ) 
    {
        <div id class="tile-row">
            @for(tile of tileRow; track $index; let xIndex = $index )
            {   
                <tile-component 
                id="tile-{{ xIndex + vpStart[0] }}-{{ yIndex + vpStart[1] }}"
                [x]="xIndex + vpStart[0]"
                [y]="yIndex + vpStart[1]"
                [tile]="gameState.map.tileAt(
                    buffer()[(headY() + yIndex) % maxTilesVer][(headX() + xIndex) % maxTilesHor].x,
                    buffer()[(headY() + yIndex) % maxTilesVer][(headX() + xIndex) % maxTilesHor].y)" 
                />
            }
        </div> 
    }
    `,
    styleUrl: "./map.css"
})
export class MapComponent {
    public buffer = signal<Pos[][]>([]);
    public vpStart: number[];
    public headX = signal<number>(0);
    public headY = signal<number>(0);

    public gameState = inject(GameState);
    public uiManager = inject(UiManager);

    public maxVisTilesHor: number
    public maxTilesHor: number;
    public maxVisTilesVer: number;
    public maxTilesVer: number;

    public constructor() {
        this.vpStart = this.getVpStart();
        this.headX = signal<number>(this.vpStart[0]);
        this.headY = signal<number>(this.vpStart[1]);

        this.maxTilesHor = this.uiManager.calcMaxTilesHor() + GC.VIEWPORTMOVETHRESHHOLD * 2;
        this.maxTilesVer = this.uiManager.calcMaxTilesVer() + GC.VIEWPORTMOVETHRESHHOLD * 2;
        this.maxVisTilesHor = this.uiManager.calcMaxTilesHor();
        this.maxVisTilesVer = this.uiManager.calcMaxTilesVer();

        effect(() => {
            this.gameState.player.pos();
            this.updateViewport();
        });

        this.loadTiles();
    }

    public loadTiles() {
        this.buffer.update(b => {
            let tempBuff = [...b];
            for (let y = 0; y < this.maxTilesVer; y++) {
                tempBuff.push([]);
                for (let x = 0; x < this.maxTilesHor; x++) {
                    tempBuff[y].push(new Pos([(x + this.vpStart[0]), (y + this.vpStart[1])]));
                }
            }
            return tempBuff;
        });
    }

    public updateViewport() {
        if (this.mustMoveViewport()) {
            console.log("MOVING VIEWPORT");
            this.moveViewportToPlayer();
        }
    }

    private moveViewportToPlayer() {
        let relativePos = this.getRelativePlayerPos();
        let viewportMove = this.getViewportMoveOffsets(relativePos[0], relativePos[1]);

        this.shiftHorizontallyBy(viewportMove[0])
        this.shiftVerticallyBy(viewportMove[1])
        this.vpStart[0] += viewportMove[0];
        this.vpStart[1] += viewportMove[1];
    }

    private shiftVerticallyBy(offset: number) {
        let index;
        let sign = offset > 0
            ? 1
            : -1;
        for (let y = 0; y < Math.abs(offset); y++) {
            this.buffer.update(b => {
                index = sign == 1
                    ? (this.headY()) % this.maxTilesVer
                    : (this.headY() - 1) % this.maxTilesVer;
                let tempLine: Pos[] = [...b[index]];
                for (let i = 0; i < this.maxTilesHor; i++) {
                    tempLine[i].y += (this.maxTilesVer - 1) * sign;
                }

                b[index] = tempLine;
                return [...b];
            });
            this.headY.update(h => { return (h + sign) % this.maxTilesVer });
        }
    }

    private shiftHorizontallyBy(offset: number) {
        let index: number;
        let sign = offset > 0
            ? 1
            : -1;
        for (let x = 0; x < Math.abs(offset); x++) {

            for (let i = 0; i < this.maxTilesVer; i++) {
                this.buffer.update(b => {
                    index = sign == 1
                        ? (this.headX() + 1) % this.maxTilesHor
                        : (this.headX() - 1) % this.maxTilesHor;
                    let tempLine: Pos[] = [...b[i]];
                    tempLine[index].x += (this.maxTilesHor - 1) * sign;
                    b[i] = tempLine;
                    return [...b];
                });
                this.headX.update(h => { return (h + sign) % this.maxTilesHor });
            }
            console.log("SHIFTING DOWN LINE");
        }
    }

    public getViewportMoveOffsets(relX: number, relY: number): number[] {
        let moveX: number = relX > this.maxTilesHor / 2
            ? max((relX - GC.VIEWPORTMOVETHRESHHOLD  + GC.VIEWPORTBUFF- (this.maxTilesHor / 2)), 0)
            : min(relX - GC.VIEWPORTMOVETHRESHHOLD + GC.VIEWPORTBUFF, 0);

        let moveY: number = relY > this.maxTilesVer / 2
            ? max((relY - GC.VIEWPORTMOVETHRESHHOLD + GC.VIEWPORTBUFF) - (this.maxTilesVer / 2), 0)
            : min(relY - GC.VIEWPORTMOVETHRESHHOLD + GC.VIEWPORTBUFF, 0);

        if (this.gameState.player.pos().x <= GC.VIEWPORTBUFF)
            moveX = 0;
        if (this.gameState.player.pos().y <= GC.VIEWPORTBUFF)
            moveY = 0;
        
        return [Math.round(moveX), Math.round(moveY)];
    }

    public getRelativePlayerPos(): number[] {
        let relativeX = this.gameState.player.pos().x - this.vpStart[0];
        let relativeY = this.gameState.player.pos().y - this.vpStart[1];
        // console.log("relative pos: " + relativeX + "-" + relativeY);
        return [relativeX, relativeY];
    }

    public mustMoveViewport() {
        let relativePos = this.getRelativePlayerPos();
        let offset = this.getViewportMoveOffsets(relativePos[0], relativePos[1]);
        console.log("offset: " + offset[0] + "-" + offset[1]);

        return offset[0] != 0
            || offset[1] != 0;
    }

    private getVpStart(): number[] {
        let startX = max(
            this.gameState.player.pos().x - (this.maxTilesHor / 2),
            0
        );
        let startY = max(
            this.gameState.player.pos().y - (this.maxTilesVer / 2),
            0
        );
        return [startX, startY];
    }
};
