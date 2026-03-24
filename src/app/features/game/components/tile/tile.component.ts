import { Component, inject, Input } from "@angular/core";
import { GameState } from "../../services/game-state.service"
import { Tile } from "../../models/tile";

@Component({
    selector: "tile-component",
    template: `<div class="tile {{ tile.type }}"></div> `,
    styleUrl: "./tile.css"
})

export class TileComponent {
    @Input() tile!: Tile;
    public gameState = inject(GameState);
};