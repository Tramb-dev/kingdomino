module.exports = class Dominoes {
  #allDominoes = require("./dominoes.json");
  remainingDominoes = Array.from({ length: 48 }, (v, k) => k + 1);
  currentDominoes = [];
  nextDominoes = [];
  //pickedDominoes = [];
  #numberOfDisplayedDominoes = 4;

  constructor() {}

  getAllDominoes() {
    return this.#allDominoes;
  }

  getOneDomino(number) {
    return this.#allDominoes[number];
  }

  initDominoes(numberOfPlayers) {
    if (numberOfPlayers === 3) {
      this.#numberOfDisplayedDominoes = 3;
    }

    this.shuffleDominoes();
    this.pickNextDominoes();
    this.changeNextToCurrent();
    return this.currentDominoes;
  }

  changeNextToCurrent() {
    this.currentDominoes = Array.from(this.nextDominoes);
    this.pickNextDominoes();
  }

  pickNextDominoes() {
    this.nextDominoes = [];

    this.nextDominoes = this.remainingDominoes.splice(
      0,
      this.#numberOfDisplayedDominoes
    );
    this.nextDominoes.sort((a, b) => a - b);
  }

  shuffleDominoes() {
    for (let i = this.remainingDominoes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.remainingDominoes[i], this.remainingDominoes[j]] = [
        this.remainingDominoes[j],
        this.remainingDominoes[i],
      ];
    }
  }
};
