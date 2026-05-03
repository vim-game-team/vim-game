import { Component, computed, inject, input, Input } from '@angular/core';
import { GameState } from '../../services/game-state.service';
import { Tile } from '../../models/tile';

@Component({
  selector: 'tile-component',
  template: `
    <div id="tile-{{x()}}-{{y()}}" class="tile" [class]="tile().type" [class.player]="isPlayerHere()">
      {{ tile().value }}
    </div>
  `,
  styleUrl: './tile.css',
})
export class TileComponent {
  // @Input() x!: number;
  // @Input() y!: number;
  tile = input.required<Tile>();
  x = input.required<number>();
  y = input.required<number>();

  public gameState = inject(GameState);
  public isPlayer = computed(() =>
    this.gameState.player.pos().x === this.x() &&
    this.gameState.player.pos().y === this.y());

  public constructor() {
  }
  public isPlayerHere() {
    // console.log("tile(" + this.x!() + ", " + this.y!() + ").value = " + this.tile!().value)
    let result = this.gameState.player.pos().x === this.x() &&
      this.gameState.player.pos().y === this.y()

    if (result)
      console.log("PLAYER IS HERE: " + this.x() + "-" + this.y())

    return result;
  }

}
