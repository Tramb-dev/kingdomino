module.exports = class Grid {
  grid = [];

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
        }
      }
    }
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
      if (
        typeof this.grid[ligne] === "undefined" ||
        typeof this.grid[ligne][colonne] === "undefined"
      ) {
        return false;
      } else {
        const gridCase = this.grid[ligne][colonne];
        if (gridCase.contenu === contenu || gridCase.contenu === "chateau") {
          return true;
        }
        return false;
      }
    };

    if (data.orientation % 4 === 2 || data.orientation % 4 === 3) {
      [data.left, data.right] = [data.right, data.left];
    }

    if (data.orientation % 2 === 0) {
      if (
        this.grid[ligne][colonne].contenu === null &&
        this.grid[ligne][colonne + 1].contenu === null &&
        (testCase(ligne - 1, colonne, data.left) ||
          testCase(ligne, colonne - 1, data.left) ||
          testCase(ligne + 1, colonne, data.left) ||
          testCase(ligne - 1, colonne + 1, data.right) ||
          testCase(ligne, colonne + 2, data.right) ||
          testCase(ligne + 1, colonne + 1, data.right))
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      if (
        this.grid[ligne][colonne].contenu === null &&
        this.grid[ligne + 1][colonne].contenu === null &&
        (testCase(ligne, colonne + 1, data.left) ||
          testCase(ligne - 1, colonne, data.left) ||
          testCase(ligne, colonne - 1, data.left) ||
          testCase(ligne + 1, colonne + 1, data.right) ||
          testCase(ligne + 2, colonne, data.right) ||
          testCase(ligne + 1, colonne - 1, data.right))
      ) {
        return true;
      } else {
        return false;
      }
    }
  }

  placeDominoOnGrid(data) {
    if (this.testOrthogonale(data)) {
      if (data.orientation % 4 === 2 || data.orientation % 4 === 3) {
        [data.left, data.right] = [data.right, data.left];
      }

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
};
