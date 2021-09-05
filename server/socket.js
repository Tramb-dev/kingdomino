const db = require("./db");
const uuid = require("uuid");
const Game = require("./Game");
const Players = require("./Players");

const chalk = require("chalk");

const rooms = [0, 1, 2, 3];

// Réaliser une instance du jeu par salon
playersModule = new Players();
game = new Game(playersModule);

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
        };

        playersModule.room.push(newPlayer);

        socket.emit("myPlayer", newPlayer);
        io.to(rooms[0]).emit("allPlayers", playersModule.sendPlayers());
      }
    });

    // Le joueur choisit une couleur
    socket.on("chosenColor", (chosenColor) => {
      const player = playersModule.findPlayer(chosenColor.uid, socket.id);

      if (player) {
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
      console.log("startGame", game.gameLaunched);
      if (
        // TODO: pour debogage
        game.gameLaunched //&&
        //socket.id === playersModule.currentPlayer.sid
      ) {
        io.to(rooms[0]).emit("nextDominoes", game.nextDominoes);

        io.to(rooms[0]).emit("playersOrder", playersModule.playerOrder);

        playersModule.nextPlayer();

        socket.to(rooms[0]).emit("message", {
          type: "isTurnOf",
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
        game.findDomino(numero)
      ) {
        game.playerHasPickedDomino(numero, playersModule.currentPlayer);

        if (game.king === game.numberOfDisplayedDominoes) {
          game.newTurn();
          io.to(rooms[0]).emit("newTurn", game.turn);
          io.to(rooms[0]).emit("nextDominoes", game.changeNextToCurrent());
          io.to(rooms[0]).emit("playersOrder", playersModule.playerOrder);
          playersModule.nextPlayer();
        } else {
          io.to(rooms[0]).emit("nextPickedDominoes", game.nextPickedDominoes);
          const nextPlayer = playersModule.nextPlayer();
          io.to(rooms[0]).emit("message", {
            type: "turnOf",
            data: nextPlayer.pseudo,
          });
          io.to(nextPlayer.sid).emit("message", {
            type: "yourTurn",
            data: nextPlayer.pseudo,
          });
        }
      }
    });

    // Réception d'un positionnement de domino
    //socket.on("placedDomino");

    socket.on("disconnect", () => {
      console.log(chalk.yellow.italic("connection perdue"));
      game.destroy();

      const playerToDelete = playersModule.room.find((element) => {
        return element.sid === socket.id;
      });

      if (playerToDelete) {
        playersModule.room.splice(
          playersModule.room.indexOf(playerToDelete),
          1
        );
        socket.broadcast.emit("allPlayers", playersModule.sendPlayers());
      }
    });
  });
};
