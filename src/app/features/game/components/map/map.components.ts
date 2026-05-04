import { Component, inject, effect, signal, Injectable, Signal } from "@angular/core";
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
    <div 
    class="map-container"
    [style.margin-top.px] ="gc.TILESIZE * -2"
    [style.margin-left.px] ="gc.TILESIZE * -2"
    >
    @for(y of rowIndices; track $index; let yIndex = $index ) 
    {
        <div class="tile-row">
            @for(x of colIndices; track $index; let xIndex = $index )
            {   
                <tile-component 
                [x]="tileStart().x + xIndex"
                [y]="tileStart().y + yIndex"
                />
            }
        </div> 
    }
    `,
    styleUrl: "./map.css"
})
export class MapComponent {
    public gameState = inject(GameState);
    public uiManager = inject(UiManager);
    public gc = GC;

    public tileStart = signal(new Pos);

    public maxTilesHor: number;
    public maxTilesVer: number;
    public rowIndices: number[];
    public colIndices: number[];

    public constructor() {
        this.tileStart.set(this.getBuffStart());
        this.maxTilesHor = this.uiManager.calcMaxTilesHor() + GC.VIEWPORTBUFF * 2;
        this.maxTilesVer = this.uiManager.calcMaxTilesVer() + GC.VIEWPORTBUFF * 2;
        this.rowIndices = Array.from({ length: this.maxTilesVer }, (_, i) => i);
        this.colIndices = Array.from({ length: this.maxTilesHor }, (_, i) => i);

        effect(() => {
            this.gameState.player.pos();
            this.updateViewport();
        });
    }


    private updateViewport() {
        let cartPlayerPos = this.cartesianCoordsOf(this.gameState.player.pos());
        let offset = this.getViewportMoveOffsets(cartPlayerPos[0], cartPlayerPos[1]);
        console.log("offset: (" + offset[0] + ", " + offset[1] + ")" )
        if (offset[0] != 0 ||
            offset[1] != 0
        ) {
            this.tileStart.update(h => {
                return new Pos(
                    h.x + offset[0],
                    h.y + offset[1])
            });
        }
    }

    private getViewportMoveOffsets(relX: number, relY: number): number[] {
        const maxVisTilesHor = this.maxTilesHor - (GC.VIEWPORTBUFF * 2);
        const maxVisTilesVer = this.maxTilesVer - (GC.VIEWPORTBUFF * 2);
        const rightLimit = (maxVisTilesHor / 2) - GC.VIEWPORTMOVETHRESHHOLD;
        const botLimit = (maxVisTilesVer / 2) - GC.VIEWPORTMOVETHRESHHOLD;
        const leftLimit = GC.VIEWPORTMOVETHRESHHOLD - (maxVisTilesHor / 2);
        const topLimit = GC.VIEWPORTMOVETHRESHHOLD - (maxVisTilesVer / 2);
        let vpStart = this.getVpStart();

        let moveX = relX > 0
            ? Math.max(relX - rightLimit, 0)
            : Math.min(relX - leftLimit, 0);
        let moveY = relY > 0
            ? Math.max(relY - botLimit, 0)
            : Math.min(relY - topLimit, 0);

        console.log("move: (" +moveX + ", " + moveY + ")" )
        moveX = vpStart.x + moveX < 0
            ? moveX - (vpStart.x + moveX)
            : moveX;
        moveY = vpStart.y + moveY < 0
            ? moveY -(vpStart.y + moveY)
            : moveY;

        return [Math.round(moveX), Math.round(moveY)];
    }

    public cartesianCoordsOf(pos: Pos): number[] {
        let vpStart = this.getVpStart();
        const maxVisTilesHor = this.maxTilesHor - (GC.VIEWPORTBUFF * 2);
        const maxVisTilesVer = this.maxTilesVer - (GC.VIEWPORTBUFF * 2);
        let relativeX = pos.x - vpStart.x + (maxVisTilesHor / -2);
        let relativeY = pos.y - vpStart.y + (maxVisTilesVer / -2);

        return [relativeX, relativeY];
    }

    private getVpStart(): Pos {
        let startX = this.tileStart().x + GC.VIEWPORTBUFF;
        let startY = this.tileStart().y + GC.VIEWPORTBUFF;

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
