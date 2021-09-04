import { Component, OnInit } from '@angular/core';
import { DominoesService } from 'src/app/services/dominoes.service';

@Component({
  selector: 'app-dominoes-and-kingdoms',
  templateUrl: './dominoes-and-kingdoms.component.html',
  styleUrls: ['./dominoes-and-kingdoms.component.scss']
})
export class DominoesAndKingdomsComponent implements OnInit {
  currentDominoes: number[] = [];

  constructor(public dominoService: DominoesService) {
    this.currentDominoes = dominoService.currentDominoes;
  }

  ngOnInit(): void {
  }

  rotate(direction: number): void {
    const domino = this.dominoService.dominoes[this.dominoService.selectedDomino];
    domino.orientation += direction;
    if(!domino.rotate) {
      domino.rotate = 0;
    }
    domino.rotate += direction * 90;
  }

}
