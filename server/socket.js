const db = require("./db");
const uuid = require("uuid");
const Game = require("./Game");
const Players = require("./Players");
const Grid = require("./Grid");

const chalk = require("chalk");

const rooms = [0, 1, 2, 3];

// Réaliser une instance du jeu par salon
var playersModule = new Players();
var game = new Game(playersModule);

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(chalk.green.italic("nouvelle connection"));

    socket.join(rooms[0]);

    // Envoi le tableau de score
    socket.on("getScore", () => {
      db.getScore()
        .then((result) => {
          socket.emit("getScore", result);
        })
        .catch((err) => {
          console.error(`Something went wrong ${err}`);
        });
    });

    // Lors de l'arrivée d'un nouveau joueur, vérifie si le nom est déjà pris
    // et le modifie si nécessaire avant de renvoyer la liste des joueurs
    // TODO: vérifier si le joueur n'existe pas déjà en mémoire avec son socket.id pour éviter les soucis de navigation
    socket.on("newPlayer", (pseudo) => {
      if (!game.gameLaunched) {
        pseudo = playersModule.testPseudo(pseudo);
        const newPlayer = {
          pseudo: pseudo,
          color: "",
          uid: uuid.v4(),
          sid: socket.id,
          readyToPlay: false,
          canAccessToLobby: true,
          canAccessToGame: false,
          score: 0,
          canPlaceKing: false,
          canPlaceDomino: false,
          grid: new Grid(),
        };

        playersModule.room.push(newPlayer);

        socket.emit("myPlayer", newPlayer);
        io.to(rooms[0]).emit("allPlayers", playersModule.sendPlayers());
      }
    });

    // Le joueur choisit une couleur
    socket.on("chosenColor", (chosenColor) => {
      const player = playersModule.findPlayer(chosenColor.uid, socket.id);

      if (player && !player.readyToPlay) {
        player.color = chosenColor.color;
        socket.emit("myPlayer", player);
        io.to(rooms[0]).emit("allPlayers", playersModule.sendPlayers());
      }
    });

    // Le joueur annonce qu'il est prêt à jouer
    socket.on("playerIsReady", (playerUId) => {
      const player = playersModule.findPlayer(playerUId, socket.id);

      if (player) {
        player.readyToPlay = !player.readyToPlay;
        socket.emit("myPlayer", player);
        io.to(rooms[0]).emit("allPlayers", playersModule.sendPlayers());

        // Si tous les joueurs sont prêts, on démarre le jeu
        if (
          playersModule.room.every((player) => player.readyToPlay === true) &&
          playersModule.room.length > 1
        ) {
          game.init();
          io.to(rooms[0]).emit("startGame");
        }
      }
    });

    socket.on("startGame", () => {
      if (
        // TODO: pour debogage
        game.gameLaunched &&
        socket.id === playersModule.currentPlayer.sid
      ) {
        io.to(rooms[0]).emit("nextDominoes", game.nextDominoes);

        io.to(rooms[0]).emit("playersOrder", game.firstTurnOrder);

        socket.to(rooms[0]).emit("message", {
          type: "turnOf",
          data: playersModule.currentPlayer.pseudo,
        });

        socket.emit("message", {
          type: "yourTurn",
          data: playersModule.currentPlayer.pseudo,
        });
      }
    });

    // Réception d'un choix de domino
    socket.on("chosenDomino", (numero) => {
      if (
        socket.id === playersModule.currentPlayer.sid &&
        game.findDominoToPick(numero) &&
        playersModule.currentPlayer.canPlaceKing
      ) {
        game.playerHasPickedDomino(numero, playersModule.currentPlayer);

        if (game.turn === 0) {
          if (game.king === game.numberOfDisplayedDominoes) {
            // S'il n'y a plus de pion à placer lors du premier tour de jeu, on passe au premier tour de jeu
            game.newTurn();
            io.to(rooms[0]).emit("logs", `1er tour.`);
            io.to(rooms[0]).emit("nextDominoes", game.changeNextToCurrent());
            io.to(rooms[0]).emit("playersOrder", playersModule.playerOrder);
          } else {
            io.to(rooms[0]).emit("nextPickedDominoes", game.nextPickedDominoes);
          }
          const nextPlayer = playersModule.nextPlayer();
          io.to(rooms[0]).emit("message", {
            type: "turnOf",
            data: nextPlayer.pseudo,
          });
          io.to(nextPlayer.sid).emit("message", {
            type: "yourTurn",
            data: nextPlayer.pseudo,
          });
        } else {
          // Tour de jeu normal
          io.to(rooms[0]).emit("nextPickedDominoes", game.nextPickedDominoes);
          console.log("current", game.currentDominoes);
          if (
            playersModule.currentPlayer.grid.isMovementPossible(
              game.getOneDomino(game.currentDominoes[0])
            )
          ) {
            // Si un mouvement est possible

            socket.emit(
              "droppables",
              playersModule.currentPlayer.grid.sendDroppables(
                game.getOneDomino(game.currentDominoes[0])
              )
            );
            socket.emit("moveDomino", playersModule.currentPlayer.uid);
            playersModule.currentPlayer.canPlaceDomino = true;
          } else {
            // Si le joueur ne peut pas déposer son domino, il doit le défausser
            io.to(rooms[0]).emit(
              "logs",
              `${playersModule.currentPlayer.pseudo} ne peut pas poser son domino !`
            );
            socket.emit("cannotPlaceDomino", game.currentDominoes[0]);

            const nextPlayer = game.defausse();
            io.to(rooms[0]).emit("message", {
              type: "turnOf",
              data: nextPlayer.pseudo,
            });
            io.to(nextPlayer.sid).emit("message", {
              type: "yourTurn",
              data: nextPlayer.pseudo,
            });
          }

          playersModule.currentPlayer.canPlaceKing = false;
        }
      }
    });

    // Réception d'un positionnement de domino
    socket.on("placedDomino", (data) => {
      if (
        socket.id === playersModule.currentPlayer.sid &&
        game.findDominoToPlace(data.numero) &&
        playersModule.currentPlayer.canPlaceDomino
      ) {
        const grid = playersModule.currentPlayer.grid.placeDominoOnGrid(data);
        if (grid) {
          // Si le joueur peut effectivement placer son domino
          game.playerHasPlacedDomino(data);
          if (game.currentDominoes.length > 0) {
            io.to(rooms[0]).emit("currentDominoes", game.currentDominoes);
          }
          socket.emit("message", {
            type: "placedDomino",
            data: "ok",
          });
          const playerGrid = game.sendPlayerDominoesList(
            playersModule.currentPlayer.uid
          );
          socket.emit("myGrid", playerGrid);
          socket
            .to(rooms[0])
            .emit("grids", playerGrid, playersModule.currentPlayer.index);

          playersModule.currentPlayer.canPlaceDomino = false;

          if (game.domino === 4) {
            // Les dominos sont tous placés, on passe au tour suivant
            game.newTurn();
            io.to(rooms[0]).emit("logs", `${game.turn}ème tour.`);
            if (game.lastTurn) {
              io.to(rooms[0]).emit("lastTurn");
            } else {
              io.to(rooms[0]).emit("nextDominoes", game.changeNextToCurrent());
            }
            io.to(rooms[0]).emit("playersOrder", playersModule.playerOrder);
          }

          const nextPlayer = playersModule.nextPlayer();
          io.to(rooms[0]).emit("message", {
            type: "turnOf",
            data: nextPlayer.pseudo,
          });
          io.to(nextPlayer.sid).emit("message", {
            type: "yourTurn",
            data: nextPlayer.pseudo,
          });
        } else {
          socket.emit("message", {
            type: "placedDomino",
            data: "ko",
          });
        }
      }
    });

    socket.on("disconnect", () => {
      console.log(chalk.yellow.italic("connection perdue"));

      const playerToDelete = playersModule.room.find((element) => {
        return element.sid === socket.id;
      });

      if (playerToDelete) {
        playersModule.room.splice(
          playersModule.room.indexOf(playerToDelete),
          1
        );
        if (game.gameLaunched) {
          socket.broadcast.emit("lostConnection", playerToDelete.pseudo);
          playersModule = new Players();
          game = new Game(playersModule);
        }
      }
    });
  });
};
