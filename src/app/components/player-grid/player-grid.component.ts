import { Component, OnInit } from '@angular/core';
import { DominoesService } from 'src/app/services/dominoes.service';

@Component({
  selector: 'app-player-grid',
  templateUrl: './player-grid.component.html',
  styleUrls: ['./player-grid.component.scss']
})
export class PlayerGridComponent implements OnInit {
  playerColor: string = 'jaune'; // jaune, vert, rouge, bleu

  constructor(public dominoService: DominoesService) { }

  ngOnInit(): void {
    if (this.dominoService.grille.length === 0) {
      this.dominoService.createGrille();
    }
  }

  /**
   * Test si la tuile peut se placer sur la case en regardant les cases orthogonalement adjacentes
   * @param ligne la ligne de la case à tester
   * @param colonne la colonne de la case à tester
   * @returns un objet indiquant si les 4 cases adjacentes peuvent accueillir ou non le reste de la tuile
   */
  testOrthogonale(ligne: number, colonne: number) {
    return {
      left: (colonne > 0) ? this.dominoService.grille[ligne][colonne-1].isDroppable : false,
      right: (colonne < 4) ? this.dominoService.grille[ligne][colonne+1].isDroppable : false,
      top: (ligne > 0) ? this.dominoService.grille[ligne-1][colonne].isDroppable : false,
      bottom: (ligne < 4) ? this.dominoService.grille[ligne+1][colonne].isDroppable : false,
    }
  }

  /**
   * Propose au joueur un placement de sa tuile lorsque sa souris survole la grille de jeu
   * @param event 
   */
  mouseOver(event: any): void {
    const colonne: number = parseInt(event.target.dataset.col);
    const ligne: number = parseInt(event.target.dataset.row);
    const test = this.testOrthogonale(ligne, colonne);

    if (Math.abs(this.dominoService.dominoes[this.dominoService.selectedDomino].orientation) % 2 === 0){
      if(test.right) {
        this.dominoService.grille[ligne][colonne].hover = true;
        this.dominoService.grille[ligne][colonne+1].exists = false;
      } else if(test.left) {
        this.dominoService.grille[ligne][colonne].hover = true;
        this.dominoService.grille[ligne][colonne-1].exists = false;
      }
    } else if (Math.abs(this.dominoService.dominoes[this.dominoService.selectedDomino].orientation) % 2 === 1) {
      if(test.bottom) {
        this.dominoService.grille[ligne][colonne].hover = true;
        this.dominoService.grille[ligne+1][colonne].exists = false;
      } else if (test.top) {
        this.dominoService.grille[ligne][colonne].hover = true;
        this.dominoService.grille[ligne-1][colonne].exists = false;
      }
    }
  }  
  
  /**
   * Vide la case de la suggestion de placement de tuile
   * @param event 
   */
  mouseLeave(event: any): void {
    const colonne: number = parseInt(event.target.dataset.col);
    const ligne: number = parseInt(event.target.dataset.row);
    const test = this.testOrthogonale(ligne, colonne);

    if (this.dominoService.dominoes[this.dominoService.selectedDomino].orientation % 2 === 0){
      if(test.right) {
        this.dominoService.grille[ligne][colonne].hover = false;
        this.dominoService.grille[ligne][colonne+1].exists = true;
      } else if(test.left) {
        this.dominoService.grille[ligne][colonne].hover = false;
        this.dominoService.grille[ligne][colonne-1].exists = true;
      }
    } else if (Math.abs(this.dominoService.dominoes[this.dominoService.selectedDomino].orientation) % 2 === 1) {
      if(test.bottom) {
        this.dominoService.grille[ligne][colonne].hover = false;
        this.dominoService.grille[ligne+1][colonne].exists = true;
      } else if (test.top) {
        this.dominoService.grille[ligne][colonne].hover = false;
        this.dominoService.grille[ligne-1][colonne].exists = true;
      }
    }
  }

}
