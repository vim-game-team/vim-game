import { Component, inject } from '@angular/core'
import { GameState } from './services/game-state.service';
import { InputInterpreter } from './services/input-interpreter.service';
import { MapComponent } from "./components/map/map.components";
@Component({
    selector: "game",
    standalone: true,
    providers: [InputInterpreter, GameState],
    imports: [MapComponent],
    templateUrl: "./game.html"
})
export class GameComponent {
    public gameState = inject(GameState);
    public inputInterpreter = inject(InputInterpreter);
};