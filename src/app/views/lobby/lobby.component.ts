import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlayerInfoService } from 'src/app/services/player-info.service';
import { Observable, Subscription } from 'rxjs';
import { Router} from '@angular/router';

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
export class LobbyComponent implements OnInit, OnDestroy {
  castles: Castles = {
    pink: false,
    green: false,
    yellow: false,
    blue: false
  };
  playerSubscription: Subscription;
  secondes: number = 5;
  displayCounter: boolean = false;
  
  constructor(
    public playerInfo: PlayerInfoService,
    private router: Router,
    ) { 
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

  ngOnInit(): void {
    this.playerInfo.startGameMessage.then(() => {
      this.displayCounter = true;
      const interval = setInterval(() => {
        this.secondes--;
        if (this.secondes === 0) {
          clearInterval(interval);
          this.router.navigate(['/', 'game']);
        }
      }, 1000);
    })
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
