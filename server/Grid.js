module.exports = class Grid {
  grid = [];
  droppables = Array.from({ length: 5 }, (v, k) => {
    return (k = Array.from({ length: 5 }, (v, k) => (k = false)));
  });

  constructor() {
    for (let ligne = 0; ligne < 5; ligne++) {
      this.grid[ligne] = [];
      for (let colonne = 0; colonne < 5; colonne++) {
        this.grid[ligne][colonne] = {
          contenu: null,
          nbCouronnes: 0,
          orientation: 0,
          dominoNumber: 0,
          isDroppable: false,
          position: {
            ligne: ligne,
            colonne: colonne,
          },
        };
        if (ligne === 2 && colonne === 2) {
          this.grid[2][2].contenu = "chateau";
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
          this.grid[ligne][colonne].isDroppable = true;
          this.droppables[ligne][colonne] = true;
        }
      }
    }
  }

  /**
   * Réalise une grille définissant où les dominos peuvent se poser
   * @returns la grille de booléens
   */
  sendDroppables() {
    const makeACellDroppable = (row, col) => {
      if (this.testOccupiedCell(row, col) === null) {
        this.droppables[row][col] = true;
        return true;
      }
      return false;
    };

    const testAdjacentCells = (row, col) => {
      if (
        this.testOccupiedCell(row, col) === null &&
        (makeACellDroppable(row - 1, col) ||
          makeACellDroppable(row + 1, col) ||
          makeACellDroppable(row, col - 1) ||
          makeACellDroppable(row, col + 1))
      ) {
        this.droppables[row][col] = true;
      }
    };

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        const contenu = this.testOccupiedCell(row, col);
        if (contenu) {
          this.droppables[row][col] = false;
          testAdjacentCells(row - 1, col);
          testAdjacentCells(row + 1, col);
          testAdjacentCells(row, col - 1);
          testAdjacentCells(row, col + 1);
        }
      }
    }
    return this.droppables;
  }

  /**
   * Test si une cellule est bien dans le tableau et si elle contient quelque chose
   * @param {*} row la ligne du tableau
   * @param {*} col la colonne du tableau
   * @returns le contenu/vrai si la cellule contient quelque chose
   */
  testOccupiedCell(row, col) {
    if (row >= 0 && col >= 0 && row < 5 && col < 5) {
      return this.grid[row][col].contenu;
    }
    return false;
  }

  /**
   * Permet de connaitre si le domino peut être placé sur la grille du joueur. Il faut soit un lien avec le chateau ou avec un contenu similaire
   * @param {*} data les données envoyées par le client
   * @returns vrai si le domino peut être placé, faux sinon
   */
  testOrthogonale(data) {
    const ligne = data.gridPosition.row;
    const colonne = data.gridPosition.col;

    // Retourne true si la case testée est le chateau ou si le contenu est le même que la case du domino adjacent
    const testCase = (ligne, colonne, contenu) => {
      const gridCase = this.testOccupiedCell(ligne, colonne);
      if (gridCase === contenu || gridCase === "chateau") {
        return true;
      }
      return false;
    };

    if (data.orientation % 2 === 0) {
      if (
        this.grid[ligne][colonne].contenu === null &&
        this.grid[ligne][colonne + 1].contenu === null &&
        (testCase(ligne - 1, colonne, data.left.contenu) ||
          testCase(ligne, colonne - 1, data.left.contenu) ||
          testCase(ligne + 1, colonne, data.left.contenu) ||
          testCase(ligne - 1, colonne + 1, data.right.contenu) ||
          testCase(ligne, colonne + 2, data.right.contenu) ||
          testCase(ligne + 1, colonne + 1, data.right.contenu))
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      if (
        this.grid[ligne][colonne].contenu === null &&
        this.grid[ligne + 1][colonne].contenu === null &&
        (testCase(ligne, colonne + 1, data.left.contenu) ||
          testCase(ligne - 1, colonne, data.left.contenu) ||
          testCase(ligne, colonne - 1, data.left.contenu) ||
          testCase(ligne + 1, colonne + 1, data.right.contenu) ||
          testCase(ligne + 2, colonne, data.right.contenu) ||
          testCase(ligne + 1, colonne - 1, data.right.contenu))
      ) {
        return true;
      } else {
        return false;
      }
    }
  }

  /**
   * Ajoute le domino sur la grille du joueur si les conditions sont réunies
   * @param {*} data les données du domino et de son placement
   * @returns la grille du joueur ou faux
   */
  placeDominoOnGrid(data) {
    if (data.orientation % 4 === 2 || data.orientation % 4 === 3) {
      [data.left, data.right] = [data.right, data.left];
    }

    if (this.testOrthogonale(data)) {
      if (data.orientation % 2 === 0) {
        this.grid[data.gridPosition.row][data.gridPosition.col] = {
          contenu: data.left.contenu,
          nbCouronnes: data.left.couronnes,
          orientation: data.orientation % 4,
          dominoNumber: data.numero,
        };
        this.grid[data.gridPosition.row][data.gridPosition.col + 1] = {
          contenu: data.right.contenu,
          nbCouronnes: data.right.couronnes,
          orientation: data.orientation % 4,
          dominoNumber: data.numero,
        };
      } else {
        this.grid[data.gridPosition.row][data.gridPosition.col] = {
          contenu: data.left.contenu,
          nbCouronnes: data.left.couronnes,
          orientation: data.orientation % 4,
          dominoNumber: data.numero,
        };
        this.grid[data.gridPosition.row + 1][data.gridPosition.col] = {
          contenu: data.right.contenu,
          nbCouronnes: data.right.couronnes,
          orientation: data.orientation % 4,
          dominoNumber: data.numero,
        };
      }
      return this.grid;
    }
    return false;
  }

  /**
   * Test si le joueur peut poser un domino (s'il reste de la place et qu'il a le droit de le poser).
   * @param {*} domino
   * @returns
   */
  isMovementPossible(domino) {
    console.log(domino);
    const testAdjacentCells = (row, col) => {
      if (this.testOccupiedCell(row, col) === null) {
        return true;
      }
      return false;
    };

    const leftContent = domino.left.contenu;
    const rightContent = domino.right.contenu;

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (
          this.grid[row][col].contenu === "chateau" ||
          this.grid[row][col].contenu === leftContent ||
          this.grid[row][col].contenu === rightContent
        ) {
          if (
            (testAdjacentCells(row - 1, col) &&
              (testAdjacentCells(row - 2, col) ||
                testAdjacentCells(row - 1, col - 1) ||
                testAdjacentCells(row - 1, col + 1))) ||
            (testAdjacentCells(row + 1, col) &&
              (testAdjacentCells(row + 2, col) ||
                testAdjacentCells(row + 1, col - 1) ||
                testAdjacentCells(row + 1, col + 1))) ||
            (testAdjacentCells(row, col - 1) &&
              (testAdjacentCells(row, col - 2) ||
                testAdjacentCells(row - 1, col - 1) ||
                testAdjacentCells(row + 1, col - 1))) ||
            (testAdjacentCells(row, col + 1) &&
              (testAdjacentCells(row, col + 2) ||
                testAdjacentCells(row - 1, col + 1) ||
                testAdjacentCells(row + 1, col + 1)))
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }
};
