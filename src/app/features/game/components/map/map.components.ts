import { Component, inject} from "@angular/core";
import { GameState } from "../../services/game-state.service"
import { TileComponent } from "../tile/tile.component";
@Component({
    selector: "map-component",
    imports: [TileComponent],
    template: `
    <div class="map-container">

    @for(tileRow of gameState.map.tiles; track $index; let rowIndex = $index ) 
    {
        <div class="tile-row">
            @for(tile of tileRow; track $index; let colIndex = $index)
            {
                <tile-component id="tile-{{ rowIndex }}-{{colIndex}}"
                [tile]="tile" 
                />
            }
        </div>
    }
    </div>
    `,
    styleUrl: "./map.css"
})

export class MapComponent{
    public gameState = inject(GameState);


};