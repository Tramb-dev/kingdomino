import { Component, OnInit } from '@angular/core';

import { DominoesService } from 'src/app/services/dominoes.service';
import { PlayerInfoService } from 'src/app/services/player-info.service';

import { Domino } from 'src/app/interfaces/interfaces';
import { Player } from 'src/app/interfaces/player';

interface King {
  left: string;
  top: string;
}

@Component({
  selector: 'app-dominoes-and-kingdoms',
  templateUrl: './dominoes-and-kingdoms.component.html',
  styleUrls: ['./dominoes-and-kingdoms.component.scss'],
})
export class DominoesAndKingdomsComponent implements OnInit {
  left: string = '81.5px';
  kingsPosition: King[] = [
    {
      left: '81.5px',
      top: '25px',
    },
    {
      left: '81.5px',
      top: '132px',
    },
    {
      left: '81.5px',
      top: '238px',
    },
    {
      left: '81.5px',
      top: '344px',
    },
  ];

  constructor(
    public dominoService: DominoesService,
    public playerInfo: PlayerInfoService
  ) {}

  ngOnInit(): void {}

  chooseNextDomino(numero: number): void {
    if (this.playerInfo.myTurn) {
      this.playerInfo.sendChosenDomino(numero);
      console.log(numero);
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
