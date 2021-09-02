import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToLobbyGuard } from './guards/to-lobby.guard';
import { GameViewComponent } from './views/game-view/game-view.component';
import { HomeComponent } from './views/home/home.component';
import { LobbyComponent } from './views/lobby/lobby.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'game', component: GameViewComponent },
  { path: 'lobby', component: LobbyComponent, canActivate: [ToLobbyGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
