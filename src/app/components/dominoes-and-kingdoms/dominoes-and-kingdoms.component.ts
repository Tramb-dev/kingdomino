import { Component, OnInit } from '@angular/core';
import { DominoesService } from 'src/app/services/dominoes.service';

@Component({
  selector: 'app-dominoes-and-kingdoms',
  templateUrl: './dominoes-and-kingdoms.component.html',
  styleUrls: ['./dominoes-and-kingdoms.component.scss']
})
export class DominoesAndKingdomsComponent implements OnInit {

  constructor(public dominoService: DominoesService) { }

  ngOnInit(): void {
  }

  rotate(direction: number): void {
    this.dominoService.dominoes[this.dominoService.selectedDomino].orientation += direction;
    this.dominoService.dominoes[this.dominoService.selectedDomino].rotate += direction * 90;
  }

}
