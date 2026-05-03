import { Component, inject, Input } from '@angular/core';
import { GameState } from '../../services/game-state.service';
import { Tile } from '../../models/tile';

@Component({
  selector: 'tile-component',
  template: `
    <div [id]="id" class="tile" [class]="tile.type" [class.player]="isPlayerHere()">
      {{ tile.value }}
    </div>
  `,
  styleUrl: './tile.css',
})
export class TileComponent {
  @Input() tile!: Tile;
  @Input() id!: string;
  @Input() x!: number;
  @Input() y!: number;

  public gameState = inject(GameState);
  
  public constructor() {
    console.log("CONSTRUCTING TILE: " + this.x + "-" + this.y);
  }

  isPlayerHere(): boolean {
    // console.log("checking for player");
    return this.gameState.player.pos().x === this.x && this.gameState.player.pos().y === this.y;
  }
}
