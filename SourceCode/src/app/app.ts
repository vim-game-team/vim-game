import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './features/game/components/navBar/navBar.components';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavBarComponent, RouterOutlet],
  //imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App{}
/*export class App {
  protected readonly title = signal('vim-game');
}*/