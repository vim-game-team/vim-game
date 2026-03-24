import { Component, inject, Input } from "@angular/core";
import { GameState } from "../../services/game-state.service"
import { TileComponent } from "../tile/tile.component";

@Component({
    selector: "map-component",
    imports: [TileComponent],
    template: `
    @for(tileRow of gameState.map.tiles; track $index ) 
    {
        <div class="tile-row">
            @for(tile of tileRow; track $index)
            {
                <tile-component [tile]="tile" />
            }
        </div>
    }
    `,
    styleUrl: "./map.css"
})

export class MapComponent {
    public gameState = inject(GameState);
};