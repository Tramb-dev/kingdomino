import { Component, OnInit } from '@angular/core';
import { PlayerInfoService } from 'src/app/services/player-info.service';
import { DominoesService } from 'src/app/services/dominoes.service';

@Component({
  selector: 'app-player-grid',
  templateUrl: './player-grid.component.html',
  styleUrls: ['./player-grid.component.scss'],
})
export class PlayerGridComponent implements OnInit {
  playerColor: string = 'castle-yellow';
  gridPosition = {
    left: 0,
    top: 0,
  };
  displayDomino: boolean = false;

  constructor(
    public playerInfo: PlayerInfoService,
    public dominoService: DominoesService
  ) {}

  ngOnInit(): void {
    if (this.dominoService.grille.length === 0) {
      this.dominoService.createGrille();
    }
    this.playerColor = 'castle-' + this.playerInfo.player.color;
  }

  /**
   * Test si la tuile peut se placer sur la case en regardant les cases orthogonalement adjacentes
   * @param ligne la ligne de la case à tester
   * @param colonne la colonne de la case à tester
   * @returns un objet indiquant si les 4 cases adjacentes peuvent accueillir ou non le reste de la tuile
   */
  testOrthogonale(ligne: number, colonne: number) {
    return {
      left:
        colonne > 0
          ? this.dominoService.grille[ligne][colonne - 1].isDroppable
          : false,
      right:
        colonne < 4
          ? this.dominoService.grille[ligne][colonne + 1].isDroppable
          : false,
      top:
        ligne > 0
          ? this.dominoService.grille[ligne - 1][colonne].isDroppable
          : false,
      bottom:
        ligne < 4
          ? this.dominoService.grille[ligne + 1][colonne].isDroppable
          : false,
    };
  }

  /**
   * Propose au joueur un placement de sa tuile lorsque sa souris survole la grille de jeu
   * @param event
   */
  mouseOver(event: any): void {
    if (this.playerInfo.player.canPlaceDomino) {
      const colonne: number = parseInt(event.target.dataset.col);
      const ligne: number = parseInt(event.target.dataset.row);
      const test = this.testOrthogonale(ligne, colonne);
      this.displayDomino = true;

      if (
        Math.abs(this.dominoService.currentDominoes[0].orientation) % 2 ===
        0
      ) {
        if (test.right) {
          this.gridPosition = {
            left: colonne * 100,
            top: ligne * 100,
          };
        } else if (test.left) {
          this.gridPosition = {
            left: (colonne - 1) * 100,
            top: ligne * 100,
          };
        }
      } else if (
        Math.abs(this.dominoService.currentDominoes[0].orientation) % 2 ===
        1
      ) {
        if (test.bottom) {
          this.gridPosition = {
            left: colonne * 100 - 50,
            top: ligne * 100 + 50,
          };
        } else if (test.top) {
          this.gridPosition = {
            left: colonne * 100 - 50,
            top: (ligne - 1) * 100 + 50,
          };
        }
      }
    }
  }
}
