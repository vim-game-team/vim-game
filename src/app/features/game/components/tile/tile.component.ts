import { Component, inject, Input } from "@angular/core";
import { GameState } from "../../services/game-state.service"
import { Tile } from "../../models/tile";

@Component({
    selector: "tile-component",
    template: `<div id="{{id}}"class="tile {{ tile.type }}">{{tile.value}}</div> `,
    styleUrl: "./tile.css"
})

export class TileComponent {
    @Input() tile!: Tile;
    @Input() id!: string;
    public gameState = inject(GameState);
    
};