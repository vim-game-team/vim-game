import { Component, inject } from '@angular/core'
import { GameState } from './services/game-state.service';
import { MapComponent } from "./components/map/map.components";
import { Subject } from 'rxjs';
import { InputRouter } from './services/input/input-router.service';

@Component({
    selector: "game",
    standalone: true,
    providers: [InputRouter, GameState],
    imports: [MapComponent],
    templateUrl: "./game.html"
})
export class GameComponent {
    onExecuteCommand = new Subject<void>();
    onWriteChar = new Subject<void>();

    public gameState = inject(GameState);
    public inputRouter = inject(InputRouter);
    
};