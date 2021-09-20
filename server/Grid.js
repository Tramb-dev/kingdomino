module.exports = class Grid {
  grid = [];
  droppables = Array.from({ length: 5 }, (v, k) => {
    return (k = Array.from({ length: 5 }, (v, k) => (k = false)));
  });
  score = 0;

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
  sendDroppables(domino) {
    this.droppables = Array.from({ length: 5 }, (v, k) => {
      return (k = Array.from({ length: 5 }, (v, k) => (k = false)));
    });

    const testAdjacentCells = (row, col) => {
      const gridCase = this.testOccupiedCell(row, col);
      if (gridCase.contenu === null) {
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
          if (testAdjacentCells(row - 1, col)) {
            if (testAdjacentCells(row - 2, col)) {
              this.droppables[row - 2][col] = true;
              this.droppables[row - 1][col] = true;
            }
            if (testAdjacentCells(row - 1, col - 1)) {
              this.droppables[row - 1][col - 1] = true;
              this.droppables[row - 1][col] = true;
            }
            if (testAdjacentCells(row - 1, col + 1)) {
              this.droppables[row - 1][col + 1] = true;
              this.droppables[row - 1][col] = true;
            }
          }
          if (testAdjacentCells(row + 1, col)) {
            if (testAdjacentCells(row + 2, col)) {
              this.droppables[row + 2][col] = true;
              this.droppables[row + 1][col] = true;
            }
            if (testAdjacentCells(row + 1, col - 1)) {
              this.droppables[row + 1][col - 1] = true;
              this.droppables[row + 1][col] = true;
            }
            if (testAdjacentCells(row + 1, col + 1)) {
              this.droppables[row + 1][col + 1] = true;
              this.droppables[row + 1][col] = true;
            }
          }
          if (testAdjacentCells(row, col - 1)) {
            if (testAdjacentCells(row, col - 2)) {
              this.droppables[row][col - 2] = true;
              this.droppables[row][col - 1] = true;
            }
            if (testAdjacentCells(row - 1, col - 1)) {
              this.droppables[row - 1][col - 1] = true;
              this.droppables[row][col - 1] = true;
            }
            if (testAdjacentCells(row + 1, col - 1)) {
              this.droppables[row + 1][col - 1] = true;
              this.droppables[row][col - 1] = true;
            }
          }
          if (testAdjacentCells(row, col + 1)) {
            if (testAdjacentCells(row, col + 2)) {
              this.droppables[row][col + 2] = true;
              this.droppables[row][col + 1] = true;
            }
            if (testAdjacentCells(row - 1, col + 1)) {
              this.droppables[row - 1][col + 1] = true;
              this.droppables[row][col + 1] = true;
            }
            if (testAdjacentCells(row + 1, col + 1)) {
              this.droppables[row + 1][col + 1] = true;
              this.droppables[row][col + 1] = true;
            }
          }
        }
      }
    }
    return this.droppables;
  }

  /**
   * Test si une cellule est bien dans le tableau et si elle contient quelque chose
   * @param {*} row la ligne du tableau
   * @param {*} col la colonne du tableau
   * @returns la cellule si elle contient quelque chose
   */
  testOccupiedCell(row, col) {
    if (row >= 0 && col >= 0 && row < 5 && col < 5) {
      return this.grid[row][col];
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
      if (gridCase.contenu === contenu || gridCase.contenu === "chateau") {
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
    const testAdjacentCells = (row, col) => {
      const gridCase = this.testOccupiedCell(row, col);
      if (gridCase.contenu === null) {
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

  getScore() {
    const scoringObj = {
      ble: [],
      prairie: [],
      marais: [],
      mine: [],
      foret: [],
      eau: [],
    };
    this.score = 0;

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        const left = this.testOccupiedCell(row, col - 1);
        const top = this.testOccupiedCell(row - 1, col);
        const gridCase = this.grid[row][col];
        const currentContent = gridCase.contenu;

        if (currentContent !== null && currentContent !== "chateau") {
          // Si c'est la première case de la grille à avoir ce contenu alors on inscrit directement la case dans le tableau
          if (scoringObj[currentContent].length === 0) {
            scoringObj[currentContent].push({
              nbCouronnes: gridCase.nbCouronnes,
              positions: [{ row: row, col: col }],
            });
          } else {
            let leftIndex = -1;
            let topIndex = -1;

            // Si la case de gauche a le même contenu, on cherche son index dans le tableau, et on ajoute la case courante dans ce tableau et on additionne les couronnes
            for (let i = 0; i < scoringObj[currentContent].length; i++) {
              if (
                leftIndex === -1 &&
                left &&
                left.contenu === currentContent &&
                this.searchIndex(scoringObj[currentContent][i].positions, left)
              ) {
                leftIndex = i;
              }
              if (
                topIndex === -1 &&
                top &&
                top.contenu === currentContent &&
                this.searchIndex(scoringObj[currentContent][i].positions, top)
              ) {
                topIndex = i;
              }
            }

            if (topIndex > -1 && leftIndex > -1 && topIndex !== leftIndex) {
              // On regarde si les cases du dessus et à gauche ont le même contenu et dans des tableaux séparés, dans ce cas on fusionne les tableaux
              scoringObj[currentContent][leftIndex].positions.concat(
                scoringObj[currentContent][topIndex].positions
              );
              scoringObj[currentContent][leftIndex].nbCouronnes +=
                scoringObj[currentContent][topIndex].nbCouronnes;
              scoringObj[currentContent][topIndex] = [];
              this.addToTab(scoringObj[currentContent][leftIndex], gridCase);
            } else if (
              // Si les cases ont le même contenu mais sont dans le même tableau, ou alors la case de gauche n'a pas le même contenu, on ajoute la case courante au tableau du haut
              (topIndex > -1 && leftIndex > -1 && topIndex === leftIndex) ||
              leftIndex === -1
            ) {
              this.addToTab(scoringObj[currentContent][topIndex], gridCase);
            } else if (leftIndex > -1 && topIndex === -1) {
              // Sinon on ajoute au tableau de la case de gauche
              this.addToTab(scoringObj[currentContent][leftIndex], gridCase);
            }
          }
        }
      }
    }

    for (let content of scoringObj) {
      content.forEach((group) => {
        this.score += group.nbCouronnes;
      });
    }
    console.log(scoringObj, this.score);
    return this.score;
  }

  addToTab(tab, gridCase) {
    tab.positions.push({
      row: gridCase.position.ligne,
      col: gridCase.position.colonne,
    });
    tab.nbCouronnes += gridCase.nbCouronnes;
  }

  searchIndex(scoringElements, cell) {
    if (!cell) return false;

    return scoringElements.some(
      (element) =>
        element.row === cell.position.ligne &&
        element.col === cell.position.colonne
    );
  }
};
