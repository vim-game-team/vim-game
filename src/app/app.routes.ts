import { Routes } from '@angular/router';
import { GameComponent } from "./features/game/game";
import { Login } from './features/login/login';
import { Register } from './features/register/register';
import { Profile } from './features/profile/profile';
import { Commands } from './features/commands/commands';
import { Intro } from './features/intro/intro';

export const routes: Routes = [
    { path: "", component: GameComponent },
    { path: "login", component: Login },
    { path: "register", component: Register },
    { path: "profile", component: Profile },
    { path: "commands", component: Commands },
    { path: "intro", component: Intro }

];
