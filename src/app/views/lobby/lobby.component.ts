import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router} from '@angular/router';

import { PlayerInfoService } from 'src/app/services/player-info.service';
import { WebsocketService } from 'src/app/services/websocket.service';

import { Castles } from 'src/app/interfaces/castles';


@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit, OnDestroy {
  castles: Castles;
  secondes: number = 1; // TODO: remettre à 5 après tests
  displayCounter: boolean = false;
  
  constructor(
    public playerInfo: PlayerInfoService,
    private router: Router,
    private websocket: WebsocketService
  ) { 
     this.castles = playerInfo.castles;
  }

  /**
   * Envoi le message de début de partie à la récéption du signal du serveur
   */
  ngOnInit(): void {
    this.websocket.startGameMessage.then(() => {
      this.displayCounter = true;
      const interval = setInterval(() => {
        this.secondes--;
        if (this.secondes === 0) {
          clearInterval(interval);
          this.websocket.startGame();
          this.router.navigate(['/', 'game']);
        }
      }, 1000);
    })
  }
  
  /**
   * Détruit les souscription aux observables
   */
  ngOnDestroy(): void {
    /* if(this.playerInfo.myPlayerSubscription) {
      this.playerInfo.myPlayerSubscription.unsubscribe();
    }

    if(this.playerInfo.allPlayersSubscription) {
      this.playerInfo.allPlayersSubscription.unsubscribe();
    } */
  }

  /**
   * Au click sur un château, vérifie qu'il n'est pas déjà pris avant envoi au serveur
   * @param color la couleur choisit
   */
  selectCastle(color: string): void {
    if(!this.castles[color]) {
      this.playerInfo.chosenColor(color);
    }
  }

  /**
   * Lorsque le joueur click sur "Prêt", on envoi l'info au serveur
   */
  isReady(): void {
    this.playerInfo.playerIsReady();
  }

}
