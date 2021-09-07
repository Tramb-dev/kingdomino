import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

import { WebsocketService } from './websocket.service';

import {
  Domino,
  Case,
  PlacedDomino,
  GridFromServer,
} from '../interfaces/interfaces';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DominoesService {
  grille: Case[][] = [];
  public myPlacedDominoes: PlacedDomino[] = [];
  private allDominoes: Domino[] = [
    {
      numero: 1,
      orientation: 0,
      rotate: 0,
      position: {
        left: 0,
        top: 0,
      },
      left: {
        couronnes: 0,
        contenu: 'ble',
      },
      right: {
        couronnes: 0,
        contenu: 'ble',
      },
    },
    {
      numero: 2,
      orientation: 0,
      rotate: 0,
      position: {
        left: 0,
        top: -110,
      },
      left: {
        couronnes: 0,
        contenu: 'ble',
      },
      right: {
        couronnes: 0,
        contenu: 'ble',
      },
    },
    {
      numero: 3,
      orientation: 0,
      rotate: 0,
      position: {
        left: 0,
        top: -220,
      },
      left: {
        couronnes: 0,
        contenu: 'foret',
      },
      right: {
        couronnes: 0,
        contenu: 'foret',
      },
    },
    {
      numero: 4,
      orientation: 0,
      rotate: 0,
      position: {
        left: 0,
        top: -330,
      },
      left: {
        couronnes: 0,
        contenu: 'foret',
      },
      right: {
        couronnes: 0,
        contenu: 'foret',
      },
    },
    {
      numero: 5,
      orientation: 0,
      rotate: 0,
      position: {
        left: 0,
        top: -440,
      },
      left: {
        couronnes: 0,
        contenu: 'foret',
      },
      right: {
        couronnes: 0,
        contenu: 'foret',
      },
    },
    {
      numero: 6,
      orientation: 0,
      rotate: 0,
      position: {
        left: 0,
        top: -550,
      },
      left: {
        couronnes: 0,
        contenu: 'foret',
      },
      right: {
        couronnes: 0,
        contenu: 'foret',
      },
    },
    {
      numero: 7,
      orientation: 0,
      rotate: 0,
      position: {
        left: 0,
        top: -660,
      },
      left: {
        couronnes: 0,
        contenu: 'eau',
      },
      right: {
        couronnes: 0,
        contenu: 'eau',
      },
    },
    {
      numero: 8,
      orientation: 0,
      rotate: 0,
      position: {
        left: 0,
        top: -770,
      },
      left: {
        couronnes: 0,
        contenu: 'eau',
      },
      right: {
        couronnes: 0,
        contenu: 'eau',
      },
    },
    {
      numero: 9,
      orientation: 0,
      rotate: 0,
      position: {
        left: 0,
        top: -880,
      },
      left: {
        couronnes: 0,
        contenu: 'eau',
      },
      right: {
        couronnes: 0,
        contenu: 'eau',
      },
    },
    {
      numero: 10,
      orientation: 0,
      rotate: 0,
      position: {
        left: 0,
        top: -990,
      },
      left: {
        couronnes: 0,
        contenu: 'prairie',
      },
      right: {
        couronnes: 0,
        contenu: 'prairie',
      },
    },
    {
      numero: 11,
      orientation: 0,
      rotate: 0,
      position: {
        left: -210,
        top: 0,
      },
      left: {
        couronnes: 0,
        contenu: 'prairie',
      },
      right: {
        couronnes: 0,
        contenu: 'prairie',
      },
    },
    {
      numero: 12,
      orientation: 0,
      rotate: 0,
      position: {
        left: -210,
        top: -110,
      },
      left: {
        couronnes: 0,
        contenu: 'marais',
      },
      right: {
        couronnes: 0,
        contenu: 'marais',
      },
    },
    {
      numero: 13,
      orientation: 0,
      rotate: 0,
      position: {
        left: -210,
        top: -220,
      },
      left: {
        couronnes: 0,
        contenu: 'ble',
      },
      right: {
        couronnes: 0,
        contenu: 'foret',
      },
    },
    {
      numero: 14,
      orientation: 0,
      rotate: 0,
      position: {
        left: -210,
        top: -330,
      },
      left: {
        couronnes: 0,
        contenu: 'ble',
      },
      right: {
        couronnes: 0,
        contenu: 'eau',
      },
    },
    {
      numero: 15,
      orientation: 0,
      rotate: 0,
      position: {
        left: -210,
        top: -440,
      },
      left: {
        couronnes: 0,
        contenu: 'ble',
      },
      right: {
        couronnes: 0,
        contenu: 'prairie',
      },
    },
    {
      numero: 16,
      orientation: 0,
      rotate: 0,
      position: {
        left: -210,
        top: -550,
      },
      left: {
        couronnes: 0,
        contenu: 'ble',
      },
      right: {
        couronnes: 0,
        contenu: 'marais',
      },
    },
    {
      numero: 17,
      orientation: 0,
      rotate: 0,
      position: {
        left: -210,
        top: -660,
      },
      left: {
        couronnes: 0,
        contenu: 'foret',
      },
      right: {
        couronnes: 0,
        contenu: 'eau',
      },
    },
    {
      numero: 18,
      orientation: 0,
      rotate: 0,
      position: {
        left: -210,
        top: -770,
      },
      left: {
        couronnes: 0,
        contenu: 'foret',
      },
      right: {
        couronnes: 0,
        contenu: 'prairie',
      },
    },
    {
      numero: 19,
      orientation: 0,
      rotate: 0,
      position: {
        left: -210,
        top: -880,
      },
      left: {
        couronnes: 1,
        contenu: 'ble',
      },
      right: {
        couronnes: 0,
        contenu: 'foret',
      },
    },
    {
      numero: 20,
      orientation: 0,
      rotate: 0,
      position: {
        left: -210,
        top: -990,
      },
      left: {
        couronnes: 1,
        contenu: 'ble',
      },
      right: {
        couronnes: 0,
        contenu: 'eau',
      },
    },
    {
      numero: 21,
      orientation: 0,
      rotate: 0,
      position: {
        left: -415,
        top: 0,
      },
      left: {
        couronnes: 1,
        contenu: 'ble',
      },
      right: {
        couronnes: 0,
        contenu: 'prairie',
      },
    },
    {
      numero: 22,
      orientation: 0,
      rotate: 0,
      position: {
        left: -415,
        top: -110,
      },
      left: {
        couronnes: 1,
        contenu: 'ble',
      },
      right: {
        couronnes: 0,
        contenu: 'marais',
      },
    },
    {
      numero: 23,
      orientation: 0,
      rotate: 0,
      position: {
        left: -415,
        top: -220,
      },
      left: {
        couronnes: 1,
        contenu: 'ble',
      },
      right: {
        couronnes: 0,
        contenu: 'mine',
      },
    },
    {
      numero: 24,
      orientation: 0,
      rotate: 0,
      position: {
        left: -415,
        top: -330,
      },
      left: {
        couronnes: 1,
        contenu: 'foret',
      },
      right: {
        couronnes: 0,
        contenu: 'ble',
      },
    },
    {
      numero: 25,
      orientation: 0,
      rotate: 0,
      position: {
        left: -415,
        top: -440,
      },
      left: {
        couronnes: 1,
        contenu: 'foret',
      },
      right: {
        couronnes: 0,
        contenu: 'ble',
      },
    },
    {
      numero: 26,
      orientation: 0,
      rotate: 0,
      position: {
        left: -415,
        top: -550,
      },
      left: {
        couronnes: 1,
        contenu: 'foret',
      },
      right: {
        couronnes: 0,
        contenu: 'ble',
      },
    },
    {
      numero: 27,
      orientation: 0,
      rotate: 0,
      position: {
        left: -415,
        top: -660,
      },
      left: {
        couronnes: 1,
        contenu: 'foret',
      },
      right: {
        couronnes: 0,
        contenu: 'ble',
      },
    },
    {
      numero: 28,
      orientation: 0,
      rotate: 0,
      position: {
        left: -415,
        top: -770,
      },
      left: {
        couronnes: 1,
        contenu: 'foret',
      },
      right: {
        couronnes: 0,
        contenu: 'eau',
      },
    },
    {
      numero: 29,
      orientation: 0,
      rotate: 0,
      position: {
        left: -415,
        top: -880,
      },
      left: {
        couronnes: 1,
        contenu: 'foret',
      },
      right: {
        couronnes: 0,
        contenu: 'prairie',
      },
    },
    {
      numero: 30,
      orientation: 0,
      rotate: 0,
      position: {
        left: -415,
        top: -990,
      },
      left: {
        couronnes: 1,
        contenu: 'eau',
      },
      right: {
        couronnes: 0,
        contenu: 'ble',
      },
    },
    {
      numero: 31,
      orientation: 0,
      rotate: 0,
      position: {
        left: -622,
        top: 0,
      },
      left: {
        couronnes: 1,
        contenu: 'eau',
      },
      right: {
        couronnes: 0,
        contenu: 'ble',
      },
    },
    {
      numero: 32,
      orientation: 0,
      rotate: 0,
      position: {
        left: -622,
        top: -110,
      },
      left: {
        couronnes: 1,
        contenu: 'eau',
      },
      right: {
        couronnes: 0,
        contenu: 'foret',
      },
    },
    {
      numero: 33,
      orientation: 0,
      rotate: 0,
      position: {
        left: -622,
        top: -220,
      },
      left: {
        couronnes: 1,
        contenu: 'eau',
      },
      right: {
        couronnes: 0,
        contenu: 'foret',
      },
    },
    {
      numero: 34,
      orientation: 0,
      rotate: 0,
      position: {
        left: -622,
        top: -330,
      },
      left: {
        couronnes: 1,
        contenu: 'eau',
      },
      right: {
        couronnes: 0,
        contenu: 'foret',
      },
    },
    {
      numero: 35,
      orientation: 0,
      rotate: 0,
      position: {
        left: -622,
        top: -440,
      },
      left: {
        couronnes: 1,
        contenu: 'eau',
      },
      right: {
        couronnes: 0,
        contenu: 'foret',
      },
    },
    {
      numero: 36,
      orientation: 0,
      rotate: 0,
      position: {
        left: -622,
        top: -550,
      },
      left: {
        couronnes: 0,
        contenu: 'ble',
      },
      right: {
        couronnes: 1,
        contenu: 'prairie',
      },
    },
    {
      numero: 37,
      orientation: 0,
      rotate: 0,
      position: {
        left: -622,
        top: -660,
      },
      left: {
        couronnes: 0,
        contenu: 'eau',
      },
      right: {
        couronnes: 1,
        contenu: 'prairie',
      },
    },
    {
      numero: 38,
      orientation: 0,
      rotate: 0,
      position: {
        left: -622,
        top: -770,
      },
      left: {
        couronnes: 0,
        contenu: 'ble',
      },
      right: {
        couronnes: 1,
        contenu: 'marais',
      },
    },
    {
      numero: 39,
      orientation: 0,
      rotate: 0,
      position: {
        left: -622,
        top: -880,
      },
      left: {
        couronnes: 0,
        contenu: 'prairie',
      },
      right: {
        couronnes: 1,
        contenu: 'marais',
      },
    },
    {
      numero: 40,
      orientation: 0,
      rotate: 0,
      position: {
        left: -622,
        top: -990,
      },
      left: {
        couronnes: 1,
        contenu: 'mine',
      },
      right: {
        couronnes: 0,
        contenu: 'ble',
      },
    },
    {
      numero: 41,
      orientation: 0,
      rotate: 0,
      position: {
        left: -832,
        top: 0,
      },
      left: {
        couronnes: 0,
        contenu: 'ble',
      },
      right: {
        couronnes: 2,
        contenu: 'prairie',
      },
    },
    {
      numero: 42,
      orientation: 0,
      rotate: 0,
      position: {
        left: -832,
        top: -110,
      },
      left: {
        couronnes: 0,
        contenu: 'eau',
      },
      right: {
        couronnes: 2,
        contenu: 'prairie',
      },
    },
    {
      numero: 43,
      orientation: 0,
      rotate: 0,
      position: {
        left: -832,
        top: -220,
      },
      left: {
        couronnes: 0,
        contenu: 'ble',
      },
      right: {
        couronnes: 2,
        contenu: 'marais',
      },
    },
    {
      numero: 44,
      orientation: 0,
      rotate: 0,
      position: {
        left: -832,
        top: -330,
      },
      left: {
        couronnes: 0,
        contenu: 'prairie',
      },
      right: {
        couronnes: 2,
        contenu: 'marais',
      },
    },
    {
      numero: 45,
      orientation: 0,
      rotate: 0,
      position: {
        left: -832,
        top: -440,
      },
      left: {
        couronnes: 2,
        contenu: 'mine',
      },
      right: {
        couronnes: 0,
        contenu: 'ble',
      },
    },
    {
      numero: 46,
      orientation: 0,
      rotate: 0,
      position: {
        left: -832,
        top: -550,
      },
      left: {
        couronnes: 0,
        contenu: 'marais',
      },
      right: {
        couronnes: 2,
        contenu: 'mine',
      },
    },
    {
      numero: 47,
      orientation: 0,
      rotate: 0,
      position: {
        left: -832,
        top: -660,
      },
      left: {
        couronnes: 0,
        contenu: 'marais',
      },
      right: {
        couronnes: 2,
        contenu: 'mine',
      },
    },
    {
      numero: 48,
      orientation: 0,
      rotate: 0,
      position: {
        left: -832,
        top: -770,
      },
      left: {
        couronnes: 0,
        contenu: 'ble',
      },
      right: {
        couronnes: 3,
        contenu: 'mine',
      },
    },
  ];

  // Les dominos sur lesquels on peut jouer
  // TODO: pour test
  public currentDominoes: Domino[] = [];
  private currentDominoesSubscription: Subscription;

  // Les prochains dominos à choisir
  public nextDominoes: Domino[] = [];
  private nextDominoesSubscription: Subscription;
  private lastTurnSubscription: Subscription;

  private myGridSubscription: Subscription;
  private myDroppablesSubscription: Subscription;

  private cannotPlaceDominoSubscription: Subscription;

  constructor(private websocket: WebsocketService) {
    this.currentDominoesSubscription = this.websocket.currentDominoes$
      .pipe(map((x: number[]) => this.completeDominoes(x)))
      .subscribe((value) => {
        this.currentDominoes = value;
      });

    this.nextDominoesSubscription = this.websocket.nextDominoes$
      .pipe(
        map((x: number[]) => {
          this.currentDominoes = this.nextDominoes;
          return this.completeDominoes(x);
        })
      )
      .subscribe((value) => {
        this.nextDominoes = value;
      });

    this.lastTurnSubscription = this.websocket.lastTurn$.subscribe(() => {
      this.currentDominoes = this.nextDominoes;
      this.lastTurnSubscription.unsubscribe();
    });

    this.myGridSubscription = this.websocket.myGrid$
      .pipe(map((value: GridFromServer[]) => this.completeGrid(value)))
      .subscribe((value: PlacedDomino[]) => {
        this.myPlacedDominoes = value;
      });

    this.myDroppablesSubscription = this.websocket.myDroppable$.subscribe(
      (value: boolean[][]) => {
        for (let row = 0; row < 5; row++) {
          for (let col = 0; col < 5; col++) {
            this.grille[row][col].isDroppable = value[row][col];
          }
        }
      }
    );

    this.cannotPlaceDominoSubscription =
      this.websocket.cannotPlaceDomino$.subscribe((value: number) => {
        if (this.currentDominoes[0].numero === value) {
          this.currentDominoes.shift;
        }
      });
  }

  createGrille(): void {
    if (this.grille.length === 0) {
      for (let ligne = 0; ligne < 5; ligne++) {
        const ligneDeGrille = [];
        for (let colonne = 0; colonne < 5; colonne++) {
          const caseDeGrille: Case = {
            position: {
              colonne: colonne,
              ligne: ligne,
            },
            isDroppable: false,
            contenu: null,
            nbCouronnes: 0,
          };
          if (ligne === 2 && colonne === 2) {
            // La case au milieu de la grille est un chateau
            caseDeGrille.contenu = 'chateau';
          } else if (
            (colonne === 2 &&
              (ligne === 0 || ligne === 1 || ligne === 3 || ligne === 4)) ||
            (ligne === 2 &&
              (colonne === 0 ||
                colonne === 1 ||
                colonne === 3 ||
                colonne === 4)) ||
            (colonne === 1 && (ligne === 1 || ligne === 3)) ||
            (colonne === 3 && (ligne === 1 || ligne === 3))
          ) {
            // Les cases orthogonales du chateau sont droppables
            caseDeGrille.isDroppable = true;
          }
          ligneDeGrille.push(caseDeGrille);
        }
        this.grille.push(ligneDeGrille);
      }
    }
  }

  completeDominoes(arrayOfDisplayedDominoes: number[]) {
    const completeDominoes: Domino[] = [];
    for (let i = 0; i < arrayOfDisplayedDominoes.length; i++) {
      const index = arrayOfDisplayedDominoes[i] - 1;
      completeDominoes.push(this.allDominoes[index]);
    }
    return completeDominoes;
  }

  completeGrid(arrayOfDominoesPlaced: GridFromServer[]): PlacedDomino[] {
    return arrayOfDominoesPlaced.map((element) => {
      const domino = this.allDominoes.find((x) => x.numero === element.numero);
      this.grille[element.gridPosition.row][
        element.gridPosition.col
      ].isDroppable = false;

      return {
        numero: element.numero,
        orientation: element.orientation,
        rotate: element.orientation * 90,
        position: domino
          ? domino.position
          : {
              left: 0,
              top: 0,
            },
        gridPosition: {
          row: element.gridPosition.row,
          col: element.gridPosition.col,
          left:
            element.orientation % 2 === 0
              ? element.gridPosition.col * 100
              : element.gridPosition.col * 100 - 50,
          top:
            element.orientation % 2 === 0
              ? element.gridPosition.row * 100
              : element.gridPosition.row * 100 + 50,
        },
      };
    });
  }
}
