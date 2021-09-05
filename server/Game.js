const Dominoes = require("./dominoes/Dominoes");

module.exports = class Game extends Dominoes {
  gameLaunched = false;
  turn = 0;
  numberOfPlayers = 0;

  constructor(playerModule) {
    super();
    this.playerModule = playerModule;
  }

  init() {
    this.gameLaunched = true;
    this.numberOfPlayers = this.playerModule.room.length;
    this.initDominoes(this.numberOfPlayers);
    this.playerModule.sortPlayers();

    this.playerModule.room.forEach((player) => {
      player.canAccessToGame = true;
    });

    return this.nextDominoes;
  }

  destroy() {
    this.gameLaunched = false;
    this.turn = 0;
  }
};
