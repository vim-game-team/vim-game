import { Routes } from '@angular/router';
import { GameComponent } from "./features/game/game";
import { CommandsComponent } from "./features/game/components/commands/commands";
import { ProfileComponent } from "./features/game/components/profile/profile";
import { LoginComponent } from "./features/game/components/login/login";
export const routes: Routes = [
  { path: "", component: GameComponent },
  { path: "commands", component: CommandsComponent },
  { path: "profile", component: ProfileComponent },
  { path: "login", component: LoginComponent },
];