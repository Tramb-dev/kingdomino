const Dominoes = require("./dominoes/Dominoes");

module.exports = class Game extends Dominoes {
  gameLaunched = false;
  turn = 0;
  numberOfPlayers = 0;
  lastTurn = false;
  firstTurnOrder = [];

  constructor(playersModule) {
    super();
    this.playersModule = playersModule;
  }

  init() {
    this.gameLaunched = true;
    this.numberOfPlayers = this.playersModule.room.length;
    this.initDominoes(this.numberOfPlayers);
    this.playersModule.sortPlayers();
    this.firstTurnOrder = Array.from(this.playersModule.playerOrder);
    this.playersModule.nextPlayer();

    this.playersModule.room.forEach((player) => {
      player.canAccessToGame = true;
    });

    this.playersModule.nextTurnPlayerOrder = Array.from({
      length: this.numberOfDisplayedDominoes,
    });

    return this.nextDominoes;
  }

  newTurn() {
    if (
      this.pickedDominoes.length ===
      this.numberOfDominoesInGame - this.numberOfDisplayedDominoes
    ) {
      this.lastTurn = true;
    }
    this.king = 0;
    this.domino = 0;
    this.turn++;
    this.playersModule.playerOrder = this.playersModule.placePlayersForNextTurn(
      this.nextPickedDominoes
    );

    this.nextPickedDominoes = Array.from(
      {
        length: this.numberOfDisplayedDominoes,
      },
      (v, k) => false
    );
  }

  defausse() {
    if (this.currentDominoes.length > 0) {
      this.currentDominoes.shift();
    }
    return this.playersModule.nextPlayer();
  }
};
