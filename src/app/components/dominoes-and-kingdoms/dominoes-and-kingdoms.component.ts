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

  chooseNextDomino(numero: number, index: number): void {
    if (
      this.playerInfo.player.isTurn &&
      this.playerInfo.player.canPlaceKing &&
      !this.playerInfo.nextPickedDominoes[index]
    ) {
      this.playerInfo.sendChosenDomino(numero);
    }
  }

  rotate(direction: number): void {
    if (
      direction < 0 &&
      this.dominoService.currentDominoes[0].orientation === 0
    ) {
      this.dominoService.currentDominoes[0].orientation = 3;
    } else {
      this.dominoService.currentDominoes[0].orientation += direction;
    }
    this.dominoService.currentDominoes[0].rotate += direction * 90;
  }
}
