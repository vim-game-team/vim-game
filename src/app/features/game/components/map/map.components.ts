import { Component, inject, signal } from "@angular/core";
import { GameState } from "../../services/game-state.service"
import { TileComponent } from "../tile/tile.component";
import { UiManager } from "../../core/UiManager";
import { GC } from "../../constants/game-config";
import { Tile } from "../../models/tile";
@Component({
    selector: "map-component",
    providers: [UiManager],
    imports: [TileComponent],
    template: `
    <div class="map-container">
    @for(tileRow of buffer(); track $index; let yIndex = $index ) 
    {
        <div id class="tile-row">
            @for(tile of tileRow; track $index; let xIndex = $index)
            {   
                <tile-component id="tile-{{ xIndex }}-{{yIndex}}"
                [tile]="buffer()[(headY + yIndex) % chunkSize][(headX + xIndex)]" 
                />
            }
        </div>  
    }
    <!-- 
    @for(tileRow of gameState.map.tiles(); track $index; let yIndex = $index) 
    {
        <div id="row-yIndex" class="tile-row">
            @for(tile of tileRow; track $index; let xIndex = $index)
            {   
                <tile-component id="tile-{{ xIndex }}-{{yIndex}}"
                [tile]="gameState.map.tiles()[yIndex][xIndex]" 
                />  
            }
        </div>
    } -->
    `,
    styleUrl: "./map.css"
})
export class MapComponent {
    public buffer = signal<Tile[][]>([]);
    public viewportX: number;
    public viewportY: number;
    public headX: number;
    public headY: number;

    public gameState = inject(GameState);
    public uiManager = inject(UiManager);
    public chunkSize = GC.CHUNKSIZE;

    public constructor() {
        this.buffer = new Array(
            GC.CHUNKSIZE + GC.VIEWPORTBUFF * 2)
            .fill(new Array(GC.CHUNKSIZE + GC.VIEWPORTBUFF * 2).fill(null));
        
        this.loadTiles();
        this.viewportX = this.gameState.player.posX;
        this.viewportY = this.gameState.player.posY;
        this.headX = this.viewportX % GC.CHUNKSIZE;
        this.headY = this.viewportY % GC.CHUNKSIZE;
    }

    private loadTiles() {

    }
};
