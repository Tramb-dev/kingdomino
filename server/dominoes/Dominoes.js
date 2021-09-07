module.exports = class Dominoes {
  #allDominoes = require("./dominoes.json");
  currentDominoes = [];
  nextDominoes = [];
  pickedDominoes = [];
  nextPickedDominoes = [];
  numberOfDisplayedDominoes = 4;
  numberOfDominoesInGame = 0;
  king = 0;
  domino = 0;

  constructor() {} /* 

  getAllDominoes() {
    return this.#allDominoes;
  }

  getOneDomino(number) {
    return this.#allDominoes[number];
  } */

  /**
   * Initialise la pile de dominos et renvoi le premier tirage
   * @param {*} numberOfPlayers le tirage dépend du nombre de joueurs
   * @returns le premier tirage de dominos
   */
  initDominoes(numberOfPlayers) {
    this.remainingDominoes = Array.from({ length: 48 }, (v, k) => k + 1);

    switch (numberOfPlayers) {
      case 2:
        this.numberOfDominoesInGame = 24;
        break;

      case 3:
        this.numberOfDominoesInGame = 36;
        this.numberOfDisplayedDominoes = 3;
        break;

      case 4:
        this.numberOfDominoesInGame = 48;
        break;
    }

    this.shuffleDominoes();
    this.pickNextDominoes();
    return this.nextDominoes;
  }

  /**
   * Passe les dominos du tour suivant en actif
   */
  changeNextToCurrent() {
    this.currentDominoes = Array.from(this.nextDominoes);
    this.pickNextDominoes();
    return this.nextDominoes;
  }

  /**
   * Prend les 3 ou 4 prochains dominos de la pile
   */
  pickNextDominoes() {
    this.nextDominoes = [];

    this.nextDominoes = this.remainingDominoes.splice(
      0,
      this.numberOfDisplayedDominoes
    );
    this.nextDominoes.sort((a, b) => a - b);
    this.nextPickedDominoes = Array.from(
      {
        length: this.numberOfDisplayedDominoes,
      },
      (v, k) => false
    );
  }

  /**
   * Tri aléatoirement le tableau de dominos
   */
  shuffleDominoes() {
    for (let i = this.remainingDominoes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.remainingDominoes[i], this.remainingDominoes[j]] = [
        this.remainingDominoes[j],
        this.remainingDominoes[i],
      ];
    }
  }

  /**
   * Cherche si le domino choisit pour poser le pion se trouve bien dans les prochains dominos à jouer et qu'il n'a pas déjà été sélectionné
   * @param {*} number le numéro du domino
   * @returns si vrai, le domino demandé est au bon endroit, faux sinon
   */
  findDominoToPick(number) {
    if (
      this.nextDominoes.find((x) => x === number) &&
      !this.pickedDominoes.find((x) => x.numero === number)
    ) {
      return true;
    }
    return false;
  }

  /**
   * Cherche si le domino placé sur la grille de jeu se trouve bien dans la liste de dominos à jouer
   * @param {*} number le numéro du domino
   * @returns si vrai, le domino demandé est au bon endroit, faux sinon
   */
  findDominoToPlace(number) {
    if (this.currentDominoes.find((x) => x === number)) {
      return true;
    }
    return false;
  }

  /**
   * Ajoute le domino dans le tableau des domino choisit, vient le retirer de ceux restants et place le joueur pour le prochain tour
   * @param {*} number le numéro du domino choisit
   */
  playerHasPickedDomino(number, player) {
    this.pickedDominoes.push({
      numero: number,
      pseudo: player.pseudo,
      orientation: 0,
      playerIndex: player.index,
      uid: player.uid,
      gridPosition: {
        row: 0,
        col: 0,
      },
      placed: false,
    });

    this.remainingDominoes.splice(number - 1, 1);

    const index = this.nextDominoes.findIndex((element) => element === number);
    this.nextPickedDominoes[index] = {
      player: player.index,
      king: this.king,
    };
    this.king++;
  }

  playerHasPlacedDomino(data) {
    this.domino++;
    const indexOfPlacedDomino = this.pickedDominoes.findIndex(
      (element) => element.numero === data.numero
    );
    this.pickedDominoes[indexOfPlacedDomino].orientation = data.orientation;
    this.pickedDominoes[indexOfPlacedDomino].gridPosition = data.gridPosition;
    this.pickedDominoes[indexOfPlacedDomino].placed = true;
    this.currentDominoes.shift();
  }

  sendPlayerDominoesList(uid) {
    return this.pickedDominoes
      .filter((element) => element.uid === uid && element.placed)
      .map((domino) => {
        return {
          numero: domino.numero,
          orientation: domino.orientation,
          gridPosition: domino.gridPosition,
        };
      });
  }
};
