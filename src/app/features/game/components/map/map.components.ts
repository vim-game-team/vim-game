import { Component, inject, effect, signal, Injectable, Signal } from "@angular/core";
import { GameState } from "../../services/game-state.service"
import { TileComponent } from "../tile/tile.component";
import { UiManager } from "../../core/UiManager";
import { GC } from "../../constants/game-config";
import { max, min } from "../../../../shared/utils";
import { Pos } from "../../models/pos";
import { Tile } from "../../models/tile";
import { ViewportScroller } from "@angular/common";


@Component({
    selector: "map-component",
    providers: [UiManager],
    imports: [TileComponent],
    template: `
    <div 
    class="map-container"
    [style.margin-top.px] ="tileSize * -2"
    [style.margin-left.px] ="tileSize * -2"
    >
    @for(tileRow of buffer(); track $index; let yIndex = $index ) 
    {
        <div class="tile-row">
            @for(tile of tileRow; track tile.x-tile.y; let xIndex = $index )
            {   
                <tile-component 
                [x]="buffStart.x + headX() + xIndex"
                [y]="buffStart.y + headY() + yIndex"
                [tile]="logicalTileOf(xIndex, yIndex)"
                />
            }
        </div> 
    }
    `,
    styleUrl: "./map.css"
})
export class MapComponent {
    public buffer = signal<Pos[][]>([]);
    public vpStart: Pos;
    public buffStart: Pos;
    public headX = signal<number>(0);
    public headY = signal<number>(0);

    public gameState = inject(GameState);
    public uiManager = inject(UiManager);

    public maxTilesHor: number;
    public maxTilesVer: number;
    public tileSize = GC.TILESIZE;

    public constructor() {
        this.vpStart = this.getVpStart();
        this.buffStart = this.getBuffStart();
        this.headX = signal<number>(this.vpStart.x);
        this.headY = signal<number>(this.vpStart.y);
        this.maxTilesHor = this.uiManager.calcMaxTilesHor() + GC.VIEWPORTBUFF * 2;
        this.maxTilesVer = this.uiManager.calcMaxTilesVer() + GC.VIEWPORTBUFF * 2;

        effect(() => {
            this.gameState.player.pos();
            this.updateViewport();
        });
        this.loadTiles();
    }

    public logicalTileOf(x: number, y: number): Tile {
        let tilePos: Pos = this.buffer()[(this.headY() + y) % this.maxTilesVer][(this.headX() + x) % this.maxTilesHor];
        let logTile;
        try {
            logTile = this.gameState.map.tileAt(tilePos.x, tilePos.y);
        }
        catch (e) {
            logTile = new Tile("|w");
        }
        return logTile!;
    }

    private loadTiles() {
        this.buffer.update(b => {
            let tempBuff = [...b];
            for (let y = 0; y < this.maxTilesVer; y++) {
                tempBuff.push([]);
                for (let x = 0; x < this.maxTilesHor; x++) {
                    tempBuff[y].push(new Pos([(this.buffStart.x + x), (this.buffStart.y + y)]));
                }
            }
            return tempBuff;
        });
    }

    private updateViewport() {
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
        this.vpStart.x += viewportMove[0];
        this.vpStart.y += viewportMove[1];
    }

    private shiftVerticallyBy(offset: number) {
        let index: number;
        let sign = offset >= 0
            ? 1
            : -1;
        for (let y = 0; y < Math.abs(offset); y++) {
            index = sign == 1
                ? (this.headY()) % this.maxTilesVer
                : (this.headY() - 1) % this.maxTilesVer;

            this.buffer.update(b => {
                let tempLine: Pos[] = [...b[index]];
                for (let i = 0; i < this.maxTilesHor; i++)
                    tempLine[i].y += (this.maxTilesVer) * sign;

                b[index] = tempLine;
                return [...b];
            });
            this.headY.update(h => { return h + sign });
        }
    }

    private shiftHorizontallyBy(offset: number) {
        let index: number;
        let sign = offset > 0
            ? 1
            : -1;
        for (let x = 0; x < Math.abs(offset); x++) {
            this.buffer.update(b => {
                for (let i = 0; i < this.maxTilesVer; i++) {
                    index = sign == 1
                        ? this.headX() % this.maxTilesHor
                        : (this.headX() - 1) % this.maxTilesHor;
                    console.log("i: " + i);
                    let tempLine: Pos[] = [...b[i]];
                    tempLine[index].x += (this.maxTilesHor - 1) * sign;
                    b[i] = tempLine;
                }
                return [...b];
            });
            this.headX.update(h => { return h + sign });
        }
    }

    public getViewportMoveOffsets(relX: number, relY: number): number[] {

        const maxVisTilesHor = this.maxTilesHor - (GC.VIEWPORTBUFF * 2);
        const maxVisTilesVer = this.maxTilesVer - (GC.VIEWPORTBUFF * 2);
        const rightLimit = (maxVisTilesHor / 2) - GC.VIEWPORTMOVETHRESHHOLD;
        const botLimit = (maxVisTilesVer / 2) - GC.VIEWPORTMOVETHRESHHOLD;
        const leftLimit = GC.VIEWPORTMOVETHRESHHOLD - (maxVisTilesHor / 2);
        const topLimit = GC.VIEWPORTMOVETHRESHHOLD - (maxVisTilesVer / 2);

        let normPos = new Pos([
            relX + (maxVisTilesHor / -2),
            relY + (maxVisTilesVer / -2)
        ])

        let moveX = normPos.x > 0
            ? Math.max(normPos.x - rightLimit, 0)
            : Math.min(normPos.x - leftLimit, 0);
        let moveY = normPos.y > 0
            ? Math.max(normPos.y - botLimit, 0)
            : Math.min(normPos.y - topLimit, 0);
        console.log("move: " + moveX + "-" + moveY);

        moveX = this.vpStart.x + moveX < 0
            ? 0
            : moveX;
        moveY = this.vpStart.y + moveY < 0
            ? 0
            : moveY;

        console.log("cleaned: " + moveX + "-" + moveY);

        return [Math.round(moveX), Math.round(moveY)];
    }

    public getRelativePlayerPos(): number[] {
        let relativeX = this.gameState.player.pos().x - this.vpStart.x;
        let relativeY = this.gameState.player.pos().y - this.vpStart.y;
        // console.log("relative pos: " + relativeX + "-" + relativeY);
        return [relativeX, relativeY];
    }

    public mustMoveViewport() {
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
        return new Pos([startX, startY]);
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
        return new Pos([startX, startY]);

    }
};
