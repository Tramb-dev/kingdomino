module.exports = class Dominoes {
  #allDominoes = require("./dominoes.json");
  currentDominoes = [];
  nextDominoes = [];
  pickedDominoes = [];
  nextPickedDominoes = [];
  numberOfDisplayedDominoes = 4;
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

    if (numberOfPlayers === 3) {
      this.numberOfDisplayedDominoes = 3;
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

  findDomino(number) {
    if (
      this.nextDominoes.find((x) => x === number) &&
      !this.pickedDominoes.find((x) => x.numero === number)
    ) {
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
      position: {
        row: 0,
        col: 0,
      },
    });

    this.remainingDominoes.splice(number - 1, 1);

    const index = this.nextDominoes.findIndex((element) => element === number);
    this.nextPickedDominoes[index] = {
      player: player.index,
      king: this.king,
    };
    this.king++;
  }

  playerHasPlacedDomino() {
    this.domino++;
  }
};
