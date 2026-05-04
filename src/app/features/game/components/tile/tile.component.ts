import { Component, computed, inject, input, Input } from '@angular/core';
import { GameState } from '../../services/game-state.service';
import { Tile } from '../../models/tile';

@Component({
  selector: 'tile-component',
  template: `
    <div id="tile-{{x()}}-{{y()}}" class="tile" [class]="tile().type" [class.player]="isPlayer()">
      {{ tile().value }}
    </div>
  `,
  styleUrl: './tile.css',
})
export class TileComponent {
  public x = input.required<number>();
  public y = input.required<number>();
  public gameState = inject(GameState);
  public tile = computed(() =>
    this.gameState.map.tileAt(this.x(), this.y())
  );

  public isPlayer = computed(() =>
    this.gameState.player.pos().x === this.x() &&
    this.gameState.player.pos().y === this.y());
}
