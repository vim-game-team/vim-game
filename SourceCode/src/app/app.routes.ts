import { Routes } from '@angular/router';
import { GameComponent } from "./features/game/game";
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Profile } from './features/profile/profile';
import { Commands } from './features/commands/commands';
import { Intro } from './features/intro/intro';
import { NotFound } from './not-found/not-found';
import { authGuard } from './shared/guards/auth.guard'; 

export const routes: Routes = [
    { path: "", component: GameComponent, canActivate: [authGuard] },
    { path: "login", component: Login },
    { path: "register", component: Register },
    { path: "profile", component: Profile, canActivate:[authGuard] },
    { path: "commands", component: Commands, canActivate: [authGuard] },
    { path: "intro", component: Intro },
    { path: "**", component: NotFound }

];