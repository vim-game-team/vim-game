import { Component, computed, inject, input, Input } from '@angular/core';
import { GameState } from '../../services/game-state.service';
import { Tile } from '../../models/tile';
import { GC } from '../../constants/game-config';

@Component({
  selector: 'tile-component',
  template: `
    <div id="tile-{{x()}}-{{y()}}" 
    class="tile" 
    [class]="tile().type" 
    [class.player]="isPlayer()"
    [style.left.px] = "x() * size"
    [style.top.px] = "y() * size"
                >
      {{ tile().value }}
    </div>
  `,
  styleUrl: './tile.css',
})
export class TileComponent {
  x = input.required<number>();
  y = input.required<number>();
  public size = GC.TILESIZE;
  public gameState = inject(GameState);

  public tile = computed(() => {
    return this.gameState.map.tileAt(this.x(), this.y());
  });

  public isPlayer = computed(() =>
    this.gameState.player.pos().x === this.x() &&
    this.gameState.player.pos().y === this.y());
}
