import { Component, OnDestroy } from '@angular/core';
import { PlayerInfoService } from 'src/app/services/player-info.service';
import { Player } from 'src/app/interfaces/player';
import { Subscription } from 'rxjs';

interface Castles {
  [pink: string]: string | boolean;
  green: string | boolean;
  yellow: string | boolean;
  blue: string | boolean;
}

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnDestroy {
  castles: Castles = {
    pink: false,
    green: false,
    yellow: false,
    blue: 'Tramb'
  };
  playerSubscription: Subscription;
  
  constructor(public playerInfo: PlayerInfoService) { 
    this.playerSubscription = this.playerInfo.playersFromServer$.subscribe(
      value => {
        for(let castle in this.castles) {
          this.castles[castle] = false;
        }
        value.forEach(player => {
          if(player.color) {
            this.castles[player.color] = player.pseudo;
          }
        })
      }
    );
  }
  
  ngOnDestroy(): void {
    this.playerSubscription.unsubscribe();
  }

  selectCastle(color: string): void {
    if(!this.castles[color]) {
      this.playerInfo.chosenColor(color);
    }
  }

  isReady(): void {
    this.playerInfo.playerIsReady();
  }

}
