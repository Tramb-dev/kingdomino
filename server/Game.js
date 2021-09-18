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
    } else if (
      this.pickedDominoes.length ===
      this.numberOfDominoesInGame - this.numberOfDisplayedDominoes
    ) {
      this.lastPick = true;
    }
    this.domino = 0;
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
  }

  nextPlayer() {
    const nextPlayer = this.playersModule.nextPlayer();
    if (this.lastTurn) {
      this.playersModule.currentPlayer.canPlaceKing = false;
      this.playersModule.currentPlayer.canPlaceDomino = true;
    }
    return nextPlayer;
  }

  /**
   * Gère le démarrage du jeu où les joueurs doivent choisir leurs premiers dominos
   * @param {*} io
   * @param {*} socket
   * @param {*} room le salon du joueur
   * @param {*} numero le numéro du domino choisit avec son pion
   */
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

  /**
   * La gestion des tours suivants lors de la pose des pions
   * @param {*} io
   * @param {*} socket
   * @param {*} room le salon du joueur
   * @param {*} numero le numéro du domino choisit avec son pion
   */
  nTurnKing(io, socket, room, numero) {
    this.playerHasPickedDomino(numero, this.playersModule.currentPlayer);
    io.to(room).emit("nextPickedDominoes", this.nextPickedDominoes);
    if (!this.canYouPlaceADomino(io, socket, room)) {
      const nextPlayer = this.playersModule.nextPlayer();
      this.whosNext(io, room, nextPlayer);
    }
    this.playersModule.currentPlayer.canPlaceKing = false;
  }

  /**
   * Gestion de la pose des dominos au long de la partie
   * @param {*} io
   * @param {*} socket
   * @param {*} room le salon du joueur
   * @param {*} data les données envoyées par le client du joueur
   */
  nTurnDomino(io, socket, room, data) {
    // Test si le joueur peut poser son domino sur sa grille de jeu
    const grid = this.playersModule.currentPlayer.grid.placeDominoOnGrid(data);
    if (grid) {
      // Si le joueur peut effectivement placer son domino
      this.playerHasPlacedDomino(data);

      if (this.currentDominoes.length > 0) {
        // Si tous les dominos n'ont pas encore été posés, on envoit les dominos restant aux joueurs
        io.to(room).emit("currentDominoes", this.currentDominoes);
      }
      socket.emit("message", {
        type: "placedDomino",
        data: "ok",
      });
      const playerGrid = this.sendPlayerDominoesList(
        this.playersModule.currentPlayer.uid
      );
      socket.emit("myGrid", playerGrid);
      socket
        .to(room)
        .emit("grids", playerGrid, this.playersModule.currentPlayer.index);

      this.playersModule.currentPlayer.canPlaceDomino = false;

      if (this.domino === this.numberOfDisplayedDominoes) {
        // Les dominos sont tous placés, on passe au tour suivant
        this.newTurn();
        io.to(room).emit("logs", `${this.turn}ème tour.`);
        if (this.lastTurn) {
          // Si c'est le dernier tour
          this.lastTurnDomino(io, socket, room);
        } else {
          if (this.lastPick) {
            io.to(room).emit("lastPick");
          }
          io.to(room).emit("nextDominoes", this.changeNextToCurrent());
        }
        io.to(room).emit("playersOrder", this.playersModule.playerOrder);
      } else if (this.lastTurn) {
        this.canPlayersDropDominoes(io, socket, room);
      }
      const nextPlayer = this.nextPlayer();
      this.whosNext(io, room, nextPlayer);
    } else {
      socket.emit("message", {
        type: "placedDomino",
        data: "ko",
      });
    }
  }

  /**
   * Gère les détails du dernier tour de jeu, où les joueurs doivent poser leurs derniers dominos
   * @param {*} io
   * @param {*} socket
   * @param {*} room
   * @param {*} data
   */
  lastTurnDomino(io, socket, room) {
    io.to(room).emit("lastTurn");
    [this.currentDominoes, this.nextDominoes] = [this.nextDominoes, []];
    this.canPlayersDropDominoes(io, socket, room);
  }

  canPlayersDropDominoes(io, socket, room) {
    let nbPlayerHasToDropDomino = 0;
    while (
      !this.canYouPlaceADomino(io, socket, room) &&
      this.domino < this.numberOfDisplayedDominoes
    ) {
      this.domino++;
      nbPlayerHasToDropDomino++;
    }

    while (nbPlayerHasToDropDomino > 1) {
      this.nextPlayer();
      nbPlayerHasToDropDomino--;
    }
  }

  /**
   * Détermine si le joueur peut placer son domino, le fait défausser sinon
   * @param {*} io
   * @param {*} socket
   * @param {*} room
   */
  canYouPlaceADomino(io, socket, room) {
    console.log(chalk.blue(this.currentDominoes[0]));
    if (
      this.playersModule.currentPlayer.grid.isMovementPossible(
        this.getOneDomino(this.currentDominoes[0])
      )
    ) {
      console.log(chalk.green("Le joueur peut poser son domino"));
      // Si un mouvement est possible
      socket.emit(
        "droppables",
        this.playersModule.currentPlayer.grid.sendDroppables(
          this.getOneDomino(this.currentDominoes[0])
        )
      );
      socket.emit("moveDomino", this.playersModule.currentPlayer.uid);
      this.playersModule.currentPlayer.canPlaceDomino = true;
      return true;
    } else {
      console.log(chalk.red("Le joueur ne peut pas poser son domino"));
      io.to(room).emit(
        "logs",
        `${this.playersModule.currentPlayer.pseudo} ne peut pas poser son domino !`
      );
      socket.emit("cannotPlaceDomino", this.currentDominoes[0]);

      this.defausse();
      return false;
    }
  }

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
