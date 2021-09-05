const Dominoes = require("./dominoes/Dominoes");

module.exports = class Game extends Dominoes {
  gameLaunched = false;

  constructor() {
    super();
  }

  init() {
    /* this.dominoes.getAllDominoes().then((value) => {
      this.allDominoes = JSON.parse(value);
    }); */
  }
};
