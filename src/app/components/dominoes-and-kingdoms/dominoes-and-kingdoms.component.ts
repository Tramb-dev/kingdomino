import { Component, OnInit } from '@angular/core';

import { DominoesService } from 'src/app/services/dominoes.service';
import { PlayerInfoService } from 'src/app/services/player-info.service';

@Component({
  selector: 'app-dominoes-and-kingdoms',
  templateUrl: './dominoes-and-kingdoms.component.html',
  styleUrls: ['./dominoes-and-kingdoms.component.scss'],
})
export class DominoesAndKingdomsComponent implements OnInit {
  constructor(
    public dominoService: DominoesService,
    public playerInfo: PlayerInfoService
  ) {}

  ngOnInit(): void {}

  chooseNextDomino(numero: number): void {
    if (this.playerInfo.myTurn) {
      this.playerInfo.sendChosenDomino(numero);
    }
  }

  rotate(direction: number): void {
    /* const domino = this.dominoService.allDominoes[this.dominoService.selectedDomino];
    if(!domino.orientation) {
      domino.orientation = 0;
    }
    domino.orientation += direction;

    if(!domino.rotate) {
      domino.rotate = 0;
    }
    domino.rotate += direction * 90; */
  }
}
