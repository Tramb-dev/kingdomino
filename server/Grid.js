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
   * @returns un booléen si un movement est possible ou non
   */
  createDroppables(domino) {
    this.droppables = Array.from({ length: 5 }, (v, k) => {
      return (k = Array.from({ length: 5 }, (v, k) => (k = false)));
    });
    let isMovementPossible = false;

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
              isMovementPossible = true;
            }
            if (testAdjacentCells(row - 1, col - 1)) {
              this.droppables[row - 1][col - 1] = true;
              this.droppables[row - 1][col] = true;
              isMovementPossible = true;
            }
            if (testAdjacentCells(row - 1, col + 1)) {
              this.droppables[row - 1][col + 1] = true;
              this.droppables[row - 1][col] = true;
              isMovementPossible = true;
            }
          }
          if (testAdjacentCells(row + 1, col)) {
            if (testAdjacentCells(row + 2, col)) {
              this.droppables[row + 2][col] = true;
              this.droppables[row + 1][col] = true;
              isMovementPossible = true;
            }
            if (testAdjacentCells(row + 1, col - 1)) {
              this.droppables[row + 1][col - 1] = true;
              this.droppables[row + 1][col] = true;
              isMovementPossible = true;
            }
            if (testAdjacentCells(row + 1, col + 1)) {
              this.droppables[row + 1][col + 1] = true;
              this.droppables[row + 1][col] = true;
              isMovementPossible = true;
            }
          }
          if (testAdjacentCells(row, col - 1)) {
            if (testAdjacentCells(row, col - 2)) {
              this.droppables[row][col - 2] = true;
              this.droppables[row][col - 1] = true;
              isMovementPossible = true;
            }
            if (testAdjacentCells(row - 1, col - 1)) {
              this.droppables[row - 1][col - 1] = true;
              this.droppables[row][col - 1] = true;
              isMovementPossible = true;
            }
            if (testAdjacentCells(row + 1, col - 1)) {
              this.droppables[row + 1][col - 1] = true;
              this.droppables[row][col - 1] = true;
              isMovementPossible = true;
            }
          }
          if (testAdjacentCells(row, col + 1)) {
            if (testAdjacentCells(row, col + 2)) {
              this.droppables[row][col + 2] = true;
              this.droppables[row][col + 1] = true;
              isMovementPossible = true;
            }
            if (testAdjacentCells(row - 1, col + 1)) {
              this.droppables[row - 1][col + 1] = true;
              this.droppables[row][col + 1] = true;
              isMovementPossible = true;
            }
            if (testAdjacentCells(row + 1, col + 1)) {
              this.droppables[row + 1][col + 1] = true;
              this.droppables[row][col + 1] = true;
              isMovementPossible = true;
            }
          }
        }
      }
    }
    return isMovementPossible;
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

    const addDominoOnGrid = (row, col, gridCase, orientation, number) => {
      this.grid[row][col] = {
        contenu: gridCase.contenu,
        nbCouronnes: gridCase.couronnes,
        orientation: orientation % 4,
        dominoNumber: number,
        position: {
          ligne: row,
          colonne: col,
        },
      };
    };

    if (this.testOrthogonale(data)) {
      if (data.orientation % 2 === 0) {
        addDominoOnGrid(
          data.gridPosition.row,
          data.gridPosition.col,
          data.left,
          data.orientation,
          data.numero
        );
        addDominoOnGrid(
          data.gridPosition.row,
          data.gridPosition.col + 1,
          data.right,
          data.orientation,
          data.numero
        );
      } else {
        addDominoOnGrid(
          data.gridPosition.row,
          data.gridPosition.col,
          data.left,
          data.orientation,
          data.numero
        );
        addDominoOnGrid(
          data.gridPosition.row + 1,
          data.gridPosition.col,
          data.right,
          data.orientation,
          data.numero
        );
      }
      return this.grid;
    }
    return false;
  }

  getScore() {
    const plots = {
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
        // Regarde les cellules de gauche et du haut, si elles ont du contenu on passe la cellule, false sinon
        let left = this.testOccupiedCell(row, col - 1);
        if (left.contenu === null || left.contenu === "chateau") {
          left = false;
        }
        let top = this.testOccupiedCell(row - 1, col);
        if (top.contenu === null || top.contenu === "chateau") {
          top = false;
        }
        const gridCase = this.grid[row][col];
        const currentContent = gridCase.contenu;

        if (currentContent !== null && currentContent !== "chateau") {
          // Si c'est la première case de la grille à avoir ce contenu alors on inscrit directement la case dans le tableau
          if (plots[currentContent].length === 0) {
            plots[currentContent].push({
              nbCouronnes: gridCase.nbCouronnes,
              positions: [{ row: row, col: col }],
            });
          } else {
            let leftIndex = -1;
            let topIndex = -1;

            // Si la case de gauche/haut a le même contenu, on cherche son index dans le tableau
            for (let i = 0; i < plots[currentContent].length; i++) {
              if (
                leftIndex === -1 &&
                left &&
                left.contenu === currentContent &&
                this.searchIndex(plots[currentContent][i].positions, left)
              ) {
                leftIndex = i;
              }
              if (
                topIndex === -1 &&
                top &&
                top.contenu === currentContent &&
                this.searchIndex(plots[currentContent][i].positions, top)
              ) {
                topIndex = i;
              }
            }

            if (topIndex > -1 && leftIndex > -1 && topIndex !== leftIndex) {
              // On regarde si les cases du dessus et à gauche ont le même contenu et dans des tableaux séparés, dans ce cas on fusionne les tableaux
              plots[currentContent][topIndex].positions.concat(
                plots[currentContent][leftIndex].positions
              );
              plots[currentContent][topIndex].nbCouronnes +=
                plots[currentContent][leftIndex].nbCouronnes;
              plots[currentContent].splice(leftIndex, 1);
              this.addToTab(plots[currentContent][topIndex], gridCase);
            } else if (
              // Si les cases ont le même contenu mais sont dans le même tableau, on ajoute la case courante au tableau du haut
              topIndex > -1 &&
              leftIndex > -1 &&
              topIndex === leftIndex
            ) {
              this.addToTab(plots[currentContent][topIndex], gridCase);
            } else if (topIndex > -1 && leftIndex === -1) {
              // Si la case de gauche n'a pas le même contenu, mais celle du haut si, on ajoute avec celle du haut
              this.addToTab(plots[currentContent][topIndex], gridCase);
            } else if (leftIndex > -1 && topIndex === -1) {
              // Si la case du haut n'a pas le même contenu, mais celle de gauche si, on ajoute avec celle de gauche
              this.addToTab(plots[currentContent][leftIndex], gridCase);
            } else {
              // Sinon, c'est une nouvelle parcelle, on crée un nouveau tableau
              plots[currentContent].push({
                nbCouronnes: gridCase.nbCouronnes,
                positions: [
                  {
                    row: gridCase.position.ligne,
                    col: gridCase.position.colonne,
                  },
                ],
              });
            }
          }
        }
      }
    }

    for (let content in plots) {
      plots[content].forEach((group) => {
        this.score += group.nbCouronnes * group.positions.length;
      });
    }
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
