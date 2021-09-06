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

    this.playerModule.nextTurnPlayerOrder = Array.from({
      length: this.numberOfDisplayedDominoes,
    });

    return this.nextDominoes;
  }

  newTurn() {
    this.king = 0;
    this.domino = 0;
    this.turn++;
    this.playerModule.playerOrder = this.playerModule.placePlayersForNextTurn(
      this.nextPickedDominoes
    );

    this.nextPickedDominoes = Array.from(
      {
        length: this.numberOfDisplayedDominoes,
      },
      (v, k) => false
    );
  }

  destroy() {
    this.gameLaunched = false;
    this.turn = 0;
    this.king = 0;
    this.domino = 0;
  }
};
