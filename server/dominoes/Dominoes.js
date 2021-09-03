//const fs = require("fs/promises");

module.exports = class Dominoes {
  #allDominoes = require("./dominoes.json");
  remainingDominoes = Array.from({ length: 48 }, (v, k) => k + 1);
  currentDominoes = [];
  nextDominoes = [];
  //pickedDominoes = [];

  constructor(numberOfPlayers) {
    this.numberOfDisplayedDominoes = numberOfPlayers === 3 ? 3 : 4;
  }

  getAllDominoes() {
    return this.#allDominoes;
    //return fs.readFile("dominoes/dominoes.json");
  }

  getOneDomino(number) {
    return this.#allDominoes[number];
  }

  initDominoes() {
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

    for (let i = 0; i < this.numberOfDisplayedDominoes; i++) {
      const domino = this.pickOneDomino();
      this.nextDominoes.push(domino);
      this.remainingDominoes.splice(this.remainingDominoes.indexOf(domino), 1);
    }
    this.nextDominoes.sort((a, b) => a - b);
  }

  pickOneDomino() {
    const randomNumber = Math.ceil(Math.random() * 48);
    if (this.remainingDominoes.find((domino) => domino === randomNumber)) {
      return randomNumber;
    } else {
      return this.pickOneDomino();
    }
  }
};
