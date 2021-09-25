import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppRoutingModule } from './app-routing.module';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { DominoComponent } from './components/domino/domino.component';
import { DominoesAndKingdomsComponent } from './components/dominoes-and-kingdoms/dominoes-and-kingdoms.component';
import { GameArenaComponent } from './components/game-arena/game-arena.component';
import { GameLogsComponent } from './components/game-logs/game-logs.component';
import { ModalComponent } from './components/modal/modal.component';
import { OtherKingdomsComponent } from './components/other-kingdoms/other-kingdoms.component';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { PlayersBoardComponent } from './components/players-board/players-board.component';
import { PlayerGridComponent } from './components/player-grid/player-grid.component';
import { RulesExplainedComponent } from './components/rules-explained/rules-explained.component';
import { ScoreComponent } from './components/score/score.component';
import { GameViewComponent } from './views/game-view/game-view.component';
import { HomeComponent } from './views/home/home.component';
import { LobbyComponent } from './views/lobby/lobby.component';
import { FinalScoreComponent } from './components/final-score/final-score.component';

const config: SocketIoConfig = {
  url: environment.socketUrl,
  options: {
    transports: ['websocket']
  }
}

@NgModule({
  declarations: [
    AppComponent,
    DominoComponent,
    DominoesAndKingdomsComponent,
    GameArenaComponent,
    GameLogsComponent,
    ModalComponent,
    OtherKingdomsComponent,
    PageTitleComponent,
    PlayersBoardComponent,
    PlayerGridComponent,
    RulesExplainedComponent,
    ScoreComponent,
    GameViewComponent,
    HomeComponent,
    LobbyComponent,
    FinalScoreComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
