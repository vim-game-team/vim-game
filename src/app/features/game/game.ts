import { Component, inject } from '@angular/core'
import { GameState } from './services/game-state.service';
import { MapComponent } from "./components/map/map.components";
import { Subject } from 'rxjs';
import { InputRouter } from './services/input/input-router.service';
import { UiManager } from './core/UiManager';

@Component({
    selector: "game",
    standalone: true,
    providers: [InputRouter, UiManager],
    imports: [MapComponent],
    templateUrl: "./game.html"
})
export class GameComponent {
    public gameState = inject(GameState);
    public inputRouter = inject(InputRouter);
    public uiManager = inject(UiManager);
};