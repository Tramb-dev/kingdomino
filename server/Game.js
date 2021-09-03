const Dominoes = require("./dominoes/Dominoes");
module.exports = class Game extends Dominoes {
  constructor(numberOfPlayers) {
    super(numberOfPlayers);
    this.numberOfPlayers = numberOfPlayers;
  }

  init() {
    /* this.dominoes.getAllDominoes().then((value) => {
      this.allDominoes = JSON.parse(value);
    }); */
  }

  sortPlayers() {
    const players = Array.from({ length: this.numberOfPlayers }, (v, k) => k);
    for (let i = this.numberOfPlayers - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [players[i], players[j]] = [players[j], players[i]];
    }
    return players;
  }
};
