import { Component, inject, effect, signal } from "@angular/core";
import { GameState } from "../../services/game-state.service"
import { TileComponent } from "../tile/tile.component";
import { UiManager } from "../../core/UiManager";
import { GC } from "../../constants/game-config";
import { max } from "../../../../shared/utils";
import { Pos } from "../../models/pos";


@Component({
    selector: "map-component",
    providers: [UiManager, GameState],
    imports: [TileComponent],
    template: `
    <div class="map-container">
    @for(tileRow of buffer(); track $index; let yIndex = $index ) 
    {
        <div id class="tile-row">
            @for(tile of tileRow; track $index; let xIndex = $index )
            {   
                <tile-component id="tile-{{ xIndex }}-{{yIndex}}"
                [tile]="gameState.map.tileAt(buffer()[(headY + yIndex) % maxTilesVer][(headX + xIndex) % maxTilesHor].x,
                buffer()[(headY + yIndex) % maxTilesVer][(headX + xIndex) % maxTilesHor].y)" 
                />
            }
        </div> 
    }
    `,
    styleUrl: "./map.css"
})
export class MapComponent {
    public buffer = signal<Pos[][]>([]);
    public viewportX: number;
    public viewportY: number;
    public headX: number;
    public headY: number;

    public gameState = inject(GameState);
    public uiManager = inject(UiManager);

    public chunkSize = GC.CHUNKSIZE;
    public maxTilesHor = this.uiManager.calcMaxTilesHor();
    public maxTilesVer = this.uiManager.calcMaxTilesVer();


    public constructor() {
        this.viewportX = this.gameState.player.pos().x;
        this.viewportY = this.gameState.player.pos().y;
        this.headX = this.viewportX % GC.CHUNKSIZE;
        this.headY = this.viewportY % GC.CHUNKSIZE;

        effect(() => {
            this.gameState.player.pos();
            this.updateViewport();
        });

        this.loadTiles();
    }


    public loadTiles() {
        let startCoords = this.getStartTilePos();

        for (let y = 0; y < this.maxTilesVer; y++) {
            this.buffer().push([]);
            for (let x = 0; x < this.maxTilesHor; x++) {
                this.buffer()[y].push(new Pos([(x + startCoords[0]), (y + startCoords[1])]));
            }
        }
    }

    public updateViewport() {
        console.log("updating viewport");
        if (this.mustMoveViewport())
            this.moveViewportToPlayer();
    }

    private moveViewportToPlayer() {
        let relativePos = this.getRelativePlayerPos();
        let viewportMove = this.getViewportMoveOffsets(relativePos[0], relativePos[1]);

        if (Math.abs(viewportMove[0]) > 0)
            this.viewportX += viewportMove[0];
        else if (Math.abs(viewportMove[1]) > 0)
            this.viewportY += viewportMove[1];

        for (let y = 0; y <= viewportMove[1]; y++)
            for (let x = 0; x <= viewportMove[0]; x++) {

            }
    }

    private moveViewportTo() {

    }

    public getViewportMoveOffsets(relX: number, relY: number): number[] {
        let moveX = relX > this.maxTilesHor / 2
            ? relX - GC.VIEWPORTMOVETHRESHHOLD - this.maxTilesHor / 2
            : relX - GC.VIEWPORTMOVETHRESHHOLD;
        let moveY = relY > this.maxTilesVer / 2
            ? relY - GC.VIEWPORTMOVETHRESHHOLD - this.maxTilesVer / 2
            : relY - GC.VIEWPORTMOVETHRESHHOLD;
        return [moveX, moveY];
    }

    public getRelativePlayerPos(): number[] {
        let relativeX = this.gameState.player.pos().x - this.viewportX;
        let relativeY = this.gameState.player.pos().y - this.viewportY;
        return [relativeX, relativeY];
    }

    public mustMoveViewport() {
        let relativePos = this.getRelativePlayerPos();
        let offset = this.getViewportMoveOffsets(relativePos[0], relativePos[1]);
        console.log("offset: " + offset[0] + "-" + offset[1]);
        return Math.abs(offset[0]) > 0
            || Math.abs(offset[1]) > 0;
    }

    private getStartTilePos(): number[] {
        let startX = max(
            this.gameState.player.pos().x - (this.uiManager.calcMaxTilesHor() + GC.VIEWPORTBUFF) / 2,
            0
        );
        let startY = max(
            this.gameState.player.pos().y - (this.uiManager.calcMaxTilesVer() + GC.VIEWPORTBUFF) / 2,
            0
        );
        return [startX, startY];
    }


};
