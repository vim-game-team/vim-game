import { Component, inject, Input, computed } from "@angular/core";
import { GameState } from "../../services/game-state.service"
import { Tile } from "../../models/tile";

@Component({
    selector: "tile-component",
    template: `<div id="{{id}}"class="tile {{ tile.type }}">{{tile.letter}}</div> `,
    styleUrl: "./tile.css"
})

export class TileComponent {
    @Input() tile!: Tile;
    @Input() id!: string;

    // public isPlayer: boolean = computed(()=>{
        
    // });
    public gameState = inject(GameState);
};