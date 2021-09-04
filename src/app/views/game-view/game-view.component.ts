import { Component, HostListener } from '@angular/core';
import { PlayerInfoService } from 'src/app/services/player-info.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.scss']
})
export class GameViewComponent {
 /*  myPlayerSubscription: Subscription;
  allPlayersSubscription: Subscription; */

  constructor(public playerInfo: PlayerInfoService) {
    /* this.myPlayerSubscription = this.playerInfo.player$.subscribe();  
    this.allPlayersSubscription = this.playerInfo.playersFromServer$.subscribe(); */
  }

  // TODO: désactivé pour déboggage
  /**
   * Permet d'éviter que le joueur quitte la partie involontairement
   * @param $event 
   */
  /* @HostListener('window:beforeunload', ['$event'])
  beforeLeaving($event: BeforeUnloadEvent): void {
    $event.preventDefault();
    $event.returnValue = "Voulez-vous vraiment quitter la partie ?";
  } */
}
