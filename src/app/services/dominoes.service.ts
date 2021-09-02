import { Injectable } from '@angular/core';
import { Domino, Case } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DominoesService {
  grille: Case[][] = [];
  selectedDomino: number = 1;
  dominoes: Domino[] = [
    {
      orientation: 0,
      rotate: 0,
      numero: 1,
      cases: {
        left: {
          contenu: "ble",
          nbCouronnes: 0,
        },
        right: {
          contenu: "ble",
          nbCouronnes: 0,
        }
      },
      imgPosition: {
        top: 100,
        left: 0
      }
    },
    {
      orientation: 0,
      rotate: 0,
      numero: 2,
      cases: {
        left: {
          contenu: "ble",
          nbCouronnes: 0,
        },
        right: {
          contenu: "ble",
          nbCouronnes: 0,
        }
      },
      imgPosition: {
        top: 200,
        left: 0
      }
    },
    {
      orientation: 0,
      rotate: 0,
      numero: 3,
      cases: {
        left: {
          contenu: "foret",
          nbCouronnes: 0,
        },
        right: {
          contenu: "foret",
          nbCouronnes: 0,
        }
      },
      imgPosition: {
        top: 300,
        left: 0
      }
    },
    {
      orientation: 0,
      rotate: 0,
      numero: 4,
      cases: {
        left: {
          contenu: "foret",
          nbCouronnes: 0,
        },
        right: {
          contenu: "foret",
          nbCouronnes: 0,
        }
      },
      imgPosition: {
        top: 400,
        left: 0
      }
    },
    {
      orientation: 0,
      rotate: 0,
      numero: 5,
      cases: {
        left: {
          contenu: "foret",
          nbCouronnes: 0,
        },
        right: {
          contenu: "foret",
          nbCouronnes: 0,
        }
      },
      imgPosition: {
        top: 500,
        left: 0
      }
    },
    {
      orientation: 0,
      rotate: 0,
      numero: 6,
      cases: {
        left: {
          contenu: "foret",
          nbCouronnes: 0,
        },
        right: {
          contenu: "foret",
          nbCouronnes: 0,
        }
      },
      imgPosition: {
        top: 600,
        left: 0
      }
    },
    {
      orientation: 0,
      rotate: 0,
      numero: 7,
      cases: {
        left: {
          contenu: "eau",
          nbCouronnes: 0,
        },
        right: {
          contenu: "eau",
          nbCouronnes: 0,
        }
      },
      imgPosition: {
        top: 700,
        left: 0
      }
    },
    {
      orientation: 0,
      rotate: 0,
      numero: 8,
      cases: {
        left: {
          contenu: "eau",
          nbCouronnes: 0,
        },
        right: {
          contenu: "eau",
          nbCouronnes: 0,
        }
      },
      imgPosition: {
        top: 800,
        left: 0
      }
    },
    {
      orientation: 0,
      rotate: 0,
      numero: 9,
      cases: {
        left: {
          contenu: "eau",
          nbCouronnes: 0,
        },
        right: {
          contenu: "eau",
          nbCouronnes: 0,
        }
      },
      imgPosition: {
        top: 900,
        left: 0
      }
    },
    {
      orientation: 0,
      rotate: 0,
      numero: 1,
      cases: {
        left: {
          contenu: "prairie",
          nbCouronnes: 0,
        },
        right: {
          contenu: "prairie",
          nbCouronnes: 0,
        }
      },
      imgPosition: {
        top: 1000,
        left: 0
      }
    },
  ];

  constructor() { }

  createGrille(): void {
    if (this.grille.length === 0) {
      for (let ligne=0; ligne<5; ligne++) {
        const ligneDeGrille = [];
        for (let colonne=0; colonne<5; colonne++) {
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
            caseDeGrille.contenu = "chateau";
          } else if ((colonne === 2 && (ligne === 0 || ligne === 1 || ligne === 3 || ligne === 4)) || (ligne === 2 && (colonne === 0 || colonne === 1 || colonne === 3 || colonne === 4)) || (colonne === 1 && (ligne === 1 || ligne === 3)) || (colonne === 3 && (ligne === 1 || ligne === 3))) {
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
