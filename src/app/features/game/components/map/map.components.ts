import { Component, inject, effect, signal, Injectable, Signal, WritableSignal } from "@angular/core";
import { GameState } from "../../services/game-state.service"
import { TileComponent } from "../tile/tile.component";
import { UiManager } from "../../core/UiManager";
import { GC } from "../../constants/game-config";
import { max, min } from "../../../../shared/utils";
import { Pos } from "../../models/pos";


@Component({
    selector: "map-component",
    imports: [TileComponent],
    template: `
    <div class="map-container">
        <div class="vp"
        [style.margin-left.px]="gc.TILE_SIZE * -gc.VP_BUFF"
        [style.margin-top.px]="gc.TILE_SIZE * -gc.VP_BUFF"
        [style.transform]= "'translate(' 
        + ( buffHead().x * -gc.TILE_SIZE ) + 'px,' 
        + ( buffHead().y * -gc.TILE_SIZE ) + 'px)'" >
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
    public buffHead: WritableSignal<Pos>;

    public maxTilesHor: number;
    public maxTilesVer: number;

    public constructor() {
        this.maxTilesHor = this.uiManager.calcMaxTilesHor() + GC.VP_BUFF * 2;
        this.maxTilesVer = this.uiManager.calcMaxTilesVer() + GC.VP_BUFF * 2;
        this.buffHead = signal(this.getBuffHead());

        effect(() => {
            this.updateViewport();
        });

        this.loadTiles();
    }

    private loadTiles() {
        for (let y = 0; y < this.maxTilesVer; y++) {
            this.buffer.push([]);
            for (let x = 0; x < this.maxTilesHor; x++) {
                let tilePos = new Pos(this.buffHead().x + x, this.buffHead().y + y)
                this.buffer[y].push(signal(tilePos));
            }
        }
    }

    private updateViewport() {
        let cartPlayerPos = this.cartesianCoordsOf(this.gameState.player.pos());
        let offset = this.getViewportMoveOffsets(cartPlayerPos[0], cartPlayerPos[1]);

        if (offset[0] != 0 ||
            offset[1] != 0
        ) {
            this.shiftHorizontallyBy(offset[0]);
            this.shiftVerticallyBy(offset[1]);
        }
    }
    private shiftVerticallyBy(offset: number) {
        let vpStart = this.getVpStart();
        let sign = offset >= 0
            ? 1
            : -1;
        for (let y = 0; y < Math.abs(offset); y++) {
            let index = sign == 1
                ? vpStart.y + y % this.maxTilesVer
                : (vpStart.y + y - 1) % this.maxTilesVer;
            for (let x = 0; x < this.maxTilesHor; x++) {
                this.buffer[index][x].update((b) => {
                    return new Pos(b.x, b.y + this.maxTilesVer * sign);
                });
            }
        }
        this.buffHead.update(b => { return new Pos(b.x, b.y + offset) });
    }

    private shiftHorizontallyBy(offset: number) {
        let vpStart = this.getVpStart();
        let sign = offset > 0
            ? 1
            : -1;
        for (let x = 0; Math.abs(x) < Math.abs(offset); x += sign) {
            let index = sign == 1
                ? vpStart.x + x % this.maxTilesHor
                : (vpStart.x + x - 1) % this.maxTilesHor;
            for (let y = 0; y < this.maxTilesVer; y++) {
                this.buffer[y][index].update((b) => {
                    return new Pos(b.x + this.maxTilesHor * sign, b.y);
                });
            }
        }
        this.buffHead.update(b => { return new Pos(b.x + offset, b.y) });
    }

    private getViewportMoveOffsets(relX: number, relY: number): number[] {
        const maxVisTilesHor = this.maxTilesHor - (GC.VP_BUFF * 2);
        const maxVisTilesVer = this.maxTilesVer - (GC.VP_BUFF * 2);
        const rightLimit = (maxVisTilesHor / 2) - GC.VP_MOVE_THRESHHOLD;
        const botLimit = (maxVisTilesVer / 2) - GC.VP_MOVE_THRESHHOLD;
        const leftLimit = GC.VP_MOVE_THRESHHOLD - (maxVisTilesHor / 2);
        const topLimit = GC.VP_MOVE_THRESHHOLD - (maxVisTilesVer / 2);
        let vpStart = this.getVpStart();

        let moveX = relX > 0
            ? Math.max(relX - rightLimit, 0)
            : Math.min(relX - leftLimit, 0);
        let moveY = relY > 0
            ? Math.max(relY - botLimit, 0)
            : Math.min(relY - topLimit, 0);

        moveX = vpStart.x + moveX < 0
            ? moveX - (vpStart.x + moveX)
            : moveX;
        moveY = vpStart.y + moveY < 0
            ? moveY - (vpStart.y + moveY)
            : moveY;

        return [Math.round(moveX), Math.round(moveY)];
    }

    public cartesianCoordsOf(pos: Pos): number[] {
        let vpStart = this.getVpStart();
        const maxVisTilesHor = this.maxTilesHor - (GC.VP_BUFF * 2);
        const maxVisTilesVer = this.maxTilesVer - (GC.VP_BUFF * 2);
        let relativeX = pos.x - vpStart.x + (maxVisTilesHor / -2);
        let relativeY = pos.y - vpStart.y + (maxVisTilesVer / -2);

        return [relativeX, relativeY];
    }

    private getVpStart(): Pos {
        let startX = this.buffHead().x + GC.VP_BUFF;
        let startY = this.buffHead().y + GC.VP_BUFF;

        return new Pos(startX, startY);
    }

    private getBuffHead() {
        let startX = max(
            this.gameState.player.pos().x - (this.maxTilesHor / 2),
            0
        );
        let startY = max(
            this.gameState.player.pos().y - (this.maxTilesVer / 2),
            0
        );
        startX -= GC.VP_BUFF;
        startY -= GC.VP_BUFF;

        return new Pos(startX, startY);
    }
};
