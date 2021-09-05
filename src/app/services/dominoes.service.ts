import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

import { WebsocketService } from './websocket.service';

import { Domino, Case } from '../interfaces/interfaces';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DominoesService {
  grille: Case[][] = [];
  selectedDomino: number = 1;
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
        contenu: 'blé',
      },
      right: {
        couronnes: 0,
        contenu: 'blé',
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
        contenu: 'blé',
      },
      right: {
        couronnes: 0,
        contenu: 'blé',
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
        contenu: 'forêt',
      },
      right: {
        couronnes: 0,
        contenu: 'forêt',
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
        contenu: 'forêt',
      },
      right: {
        couronnes: 0,
        contenu: 'forêt',
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
        contenu: 'forêt',
      },
      right: {
        couronnes: 0,
        contenu: 'forêt',
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
        contenu: 'forêt',
      },
      right: {
        couronnes: 0,
        contenu: 'forêt',
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
        contenu: 'blé',
      },
      right: {
        couronnes: 0,
        contenu: 'forêt',
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
        contenu: 'blé',
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
        contenu: 'blé',
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
        contenu: 'blé',
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
        contenu: 'forêt',
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
        contenu: 'forêt',
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
        contenu: 'blé',
      },
      right: {
        couronnes: 0,
        contenu: 'forêt',
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
        contenu: 'blé',
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
        contenu: 'blé',
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
        contenu: 'blé',
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
        contenu: 'blé',
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
        contenu: 'forêt',
      },
      right: {
        couronnes: 0,
        contenu: 'blé',
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
        contenu: 'forêt',
      },
      right: {
        couronnes: 0,
        contenu: 'blé',
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
        contenu: 'forêt',
      },
      right: {
        couronnes: 0,
        contenu: 'blé',
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
        contenu: 'forêt',
      },
      right: {
        couronnes: 0,
        contenu: 'blé',
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
        contenu: 'forêt',
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
        contenu: 'forêt',
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
        contenu: 'blé',
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
        contenu: 'blé',
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
        contenu: 'forêt',
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
        contenu: 'forêt',
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
        contenu: 'forêt',
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
        contenu: 'forêt',
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
        contenu: 'blé',
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
        contenu: 'blé',
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
        contenu: 'blé',
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
        contenu: 'blé',
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
        contenu: 'blé',
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
        contenu: 'blé',
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
        contenu: 'blé',
      },
      right: {
        couronnes: 3,
        contenu: 'mine',
      },
    },
  ];

  // Les dominos sur lesquels on peut jouer
  public currentDominoes: Domino[] = [];

  // Les prochains dominos à choisir
  public nextDominoes: Domino[] = [];
  public nextDominoesSubscription: Subscription;

  constructor(private websocket: WebsocketService) {
    this.nextDominoesSubscription = this.websocket.nextDominoes$
      .pipe(
        map((x: number[]) => {
          this.currentDominoes = this.nextDominoes;
          const completeNextDominoes: Domino[] = [];
          for (let i = 0; i < x.length; i++) {
            const index = x[i] - 1;
            completeNextDominoes.push(this.allDominoes[index]);
          }
          return completeNextDominoes;
        })
      )
      .subscribe((value) => {
        this.nextDominoes = value;
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
            hover: false,
            exists: true,
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
}
