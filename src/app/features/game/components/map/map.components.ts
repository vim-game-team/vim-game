import { Component, inject, effect, signal, Injectable, Signal, WritableSignal } from "@angular/core";
import { GameState } from "../../services/game-state.service"
import { TileComponent } from "../tile/tile.component";
import { UiManager } from "../../core/UiManager";
import { GC } from "../../constants/game-config";
import { max, min } from "../../../../shared/utils";
import { Pos } from "../../models/pos";
import { Tile } from "../../models/tile";


@Component({
    selector: "map-component",
    imports: [TileComponent],
    template: `
     <div
    class="map-container">
    <div 
    class="vp"
    [style.margin-left.px]="gc.TILESIZE * -gc.VIEWPORTBUFF"
    [style.margin-top.px]="gc.TILESIZE * -gc.VIEWPORTBUFF"
    [style.transform]= "'translate(' 
    + ( buffStart().x * gc.TILESIZE * -1 ) + 'px,' 
    + ( buffStart().y * gc.TILESIZE * -1) + 'px)'"
    >
    @for(tileRow of buffer; track $index; let yIndex = $index ) 
    {
        <div class="tile-row">
            @for(tile of tileRow; track $index; let xIndex = $index )
            {   
                <tile-component 
                [x]="tile().x"
                [y]="tile().y"
                />
            }
        </div> 
    }
</div>
    </div>
    `,
    styleUrl: "./map.css"
})
export class MapComponent {
    public gameState = inject(GameState);
    public uiManager = inject(UiManager);
    public gc = GC;

    public buffer: WritableSignal<Pos>[][] = [[]];
    public buffStart = signal(new Pos);
    public head = signal(new Pos);
    public vpStart: Pos;

    public maxTilesHor: number;
    public maxTilesVer: number;
    public tileSize = GC.TILESIZE;

    public constructor() {
        this.vpStart = this.getVpStart();
        this.buffStart.set(this.getBuffStart());
        this.head.set(this.getVpStart());
        this.maxTilesHor = this.uiManager.calcMaxTilesHor() + GC.VIEWPORTBUFF * 2;
        this.maxTilesVer = this.uiManager.calcMaxTilesVer() + GC.VIEWPORTBUFF * 2;

        effect(() => {
            this.gameState.player.pos();
            this.updateViewport();
        });

        this.loadTiles();
    }

    private loadTiles() {
        for (let y = 0; y < this.maxTilesVer; y++) {
            this.buffer.push([]);
            for (let x = 0; x < this.maxTilesHor; x++) {
                let tilePos = new Pos(this.buffStart().x + x, this.buffStart().y + y)
                this.buffer[y].push(signal(tilePos));
            }
        }
    }

    private updateViewport() {
        if (this.mustMoveViewport()) {
            this.moveViewportToPlayer();
        }
    }

    private moveViewportToPlayer() {
        let relativePos = this.getRelativePlayerPos();
        let viewportMove = this.getViewportMoveOffsets(relativePos[0], relativePos[1]);

        this.shiftHorizontallyBy(viewportMove[0])
        this.shiftVerticallyBy(viewportMove[1])
        this.vpStart.x += viewportMove[0];
        this.vpStart.y += viewportMove[1];
        this.buffStart.update(b => {
            let x = b.x + viewportMove[0];
            let y = b.y + viewportMove[1];
            return new Pos(x, y);
        })
    }

    private shiftVerticallyBy(offset: number) {
        let index: number;
        let sign = offset >= 0
            ? 1
            : -1;

        for (let y = 0; y < Math.abs(offset); y++) {
            index = sign == 1
                ? this.head().y + y % this.maxTilesVer
                : (this.head().y + y - 1) % this.maxTilesVer;
            for (let x = 0; x < this.maxTilesHor; x++) {
                this.buffer[index][x].update((b) => {
                    return new Pos(b.x, b.y + this.maxTilesVer * sign);
                });
            }
        }
        this.head.update(h => { return new Pos(h.x, h.y + offset) });
    }

    private shiftHorizontallyBy(offset: number) {
        let index: number;
        let sign = offset > 0
            ? 1
            : -1;
        for (let x = 0; Math.abs(x) < Math.abs(offset); x += sign) {
            index = sign == 1
                ? this.head().x + x % this.maxTilesHor
                : (this.head().x + x - 1) % this.maxTilesHor;
            for (let y = 0; y < this.maxTilesVer; y++) {
                this.buffer[y][index].update((b) => {
                    return new Pos(b.x + this.maxTilesHor * sign, b.y);
                });
            }
        }
        this.head.update(h => { return new Pos(h.x + offset, h.y) });
    }

    private getViewportMoveOffsets(relX: number, relY: number): number[] {
        const maxVisTilesHor = this.maxTilesHor - (GC.VIEWPORTBUFF * 2);
        const maxVisTilesVer = this.maxTilesVer - (GC.VIEWPORTBUFF * 2);
        const rightLimit = (maxVisTilesHor / 2) - GC.VIEWPORTMOVETHRESHHOLD;
        const botLimit = (maxVisTilesVer / 2) - GC.VIEWPORTMOVETHRESHHOLD;
        const leftLimit = GC.VIEWPORTMOVETHRESHHOLD - (maxVisTilesHor / 2);
        const topLimit = GC.VIEWPORTMOVETHRESHHOLD - (maxVisTilesVer / 2);

        let normPos = new Pos(
            relX + (maxVisTilesHor / -2),
            relY + (maxVisTilesVer / -2)
        )

        let moveX = normPos.x > 0
            ? Math.max(normPos.x - rightLimit, 0)
            : Math.min(normPos.x - leftLimit, 0);
        let moveY = normPos.y > 0
            ? Math.max(normPos.y - botLimit, 0)
            : Math.min(normPos.y - topLimit, 0);
        console.log("move: " + moveX + "-" + moveY);

        moveX = this.vpStart.x + moveX < 0
            ? moveX - (this.vpStart.x + moveX)
            : moveX;
        moveY = this.vpStart.y + moveY < 0
            ? moveY - (this.vpStart.y + moveY)
            : moveY;

        console.log("cleaned: " + moveX + "-" + moveY);

        return [Math.round(moveX), Math.round(moveY)];
    }

    public getRelativePlayerPos(): number[] {
        let relativeX = this.gameState.player.pos().x - this.vpStart.x;
        let relativeY = this.gameState.player.pos().y - this.vpStart.y;

        return [relativeX, relativeY];
    }

    private mustMoveViewport() {
        let relativePos = this.getRelativePlayerPos();
        let offset = this.getViewportMoveOffsets(relativePos[0], relativePos[1]);

        return offset[0] != 0
            || offset[1] != 0;
    }

    private getVpStart(): Pos {
        let startX = max(
            this.gameState.player.pos().x - (this.maxTilesHor / 2),
            0
        );
        let startY = max(
            this.gameState.player.pos().y - (this.maxTilesVer / 2),
            0
        );
        return new Pos(startX, startY);
    }
    private getBuffStart() {
        let startX = max(
            this.gameState.player.pos().x - (this.maxTilesHor / 2),
            0
        );
        let startY = max(
            this.gameState.player.pos().y - (this.maxTilesVer / 2),
            0
        );
        startX -= GC.VIEWPORTBUFF;
        startY -= GC.VIEWPORTBUFF;
        return new Pos(startX, startY);
    }
};
