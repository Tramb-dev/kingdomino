const Dominoes = require("./dominoes/Dominoes");

module.exports = class Game extends Dominoes {
  gameLaunched = false;
  gameFinished = false;
  turn = 0;
  numberOfPlayers = 0;
  lastPick = false;
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
    // Vérifie si c'est le dernier tour
    if (this.pickedDominoes.length === this.numberOfDominoesInGame) {
      this.lastTurn = true;
    } else {
      if (
        this.pickedDominoes.length ===
        this.numberOfDominoesInGame - this.numberOfDisplayedDominoes
      ) {
        this.lastPick = true;
      }
      this.domino = 0;
    }
    this.king = 0;
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

  // TODO: vérifier s'il y a bien un prochain joueur
  defausse() {
    if (this.currentDominoes.length > 0) {
      this.currentDominoes.shift();
    }
    return this.playersModule.nextPlayer();
  }

  nextPlayer() {
    const nextPlayer = this.playersModule.nextPlayer();
    if (this.lastTurn) {
      this.playersModule.currentPlayer.canPlaceKing = false;
      this.playersModule.currentPlayer.canPlaceDomino = true;
    }
    return nextPlayer;
  }

  firstTurnKing(io, socket, room, numero) {
    this.playerHasPickedDomino(numero, this.playersModule.currentPlayer);
    if (this.king === this.numberOfDisplayedDominoes) {
      // S'il n'y a plus de pion à placer lors du premier tour de jeu, on passe au premier tour de jeu
      this.newTurn();
      io.to(room).emit("logs", `1er tour.`);
      io.to(room).emit("nextDominoes", this.changeNextToCurrent());
      io.to(room).emit("playersOrder", this.playersModule.playerOrder);
    } else {
      io.to(room).emit("nextPickedDominoes", this.nextPickedDominoes);
    }
    const nextPlayer = this.nextPlayer();
    this.whosNext(io, room, nextPlayer);
  }

  nTurnKing(io, socket, room, numero) {
    this.playerHasPickedDomino(numero, this.playersModule.currentPlayer);
    io.to(room).emit("nextPickedDominoes", this.nextPickedDominoes);
    if (
      this.playersModule.currentPlayer.grid.isMovementPossible(
        this.getOneDomino(this.currentDominoes[0])
      )
    ) {
      // Si un mouvement est possible

      socket.emit(
        "droppables",
        this.playersModule.currentPlayer.grid.sendDroppables(
          this.getOneDomino(this.currentDominoes[0])
        )
      );
      socket.emit("moveDomino", this.playersModule.currentPlayer.uid);
      this.playersModule.currentPlayer.canPlaceDomino = true;
    } else {
      // Si le joueur ne peut pas déposer son domino, il doit le défausser
      io.to(room).emit(
        "logs",
        `${this.playersModule.currentPlayer.pseudo} ne peut pas poser son domino !`
      );
      socket.emit("cannotPlaceDomino", this.currentDominoes[0]);

      const nextPlayer = this.defausse();
      this.whosNext(io, room, nextPlayer);
    }

    this.playersModule.currentPlayer.canPlaceKing = false;
  }

  nTurnDomino(io, socket, room, data) {}

  /**
   * Envoi des messages permettant de connaître le joueur dont c'est le tour de jeu
   * @param {*} io
   * @param {*} nextPlayer l'objet représentant le joueur dont c'est le tour
   */
  whosNext(io, room, nextPlayer) {
    io.to(room).emit("message", {
      type: "turnOf",
      data: nextPlayer.pseudo,
    });

    io.to(nextPlayer.sid).emit("message", {
      type: "yourTurn",
      data: nextPlayer.pseudo,
    });
  }
};
