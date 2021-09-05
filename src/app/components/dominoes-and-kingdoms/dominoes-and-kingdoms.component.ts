import { Component, OnInit } from '@angular/core';
import { DominoesService } from 'src/app/services/dominoes.service';

import { Domino } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-dominoes-and-kingdoms',
  templateUrl: './dominoes-and-kingdoms.component.html',
  styleUrls: ['./dominoes-and-kingdoms.component.scss'],
})
export class DominoesAndKingdomsComponent implements OnInit {
  currentDominoes: Domino[] = [];

  constructor(public dominoService: DominoesService) {}

  ngOnInit(): void {
    this.currentDominoes = this.dominoService.currentDominoes;
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
