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
      if (game.gameState === "waiting") {
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
        game.gameState === "launching" &&
        socket.id === playersModule.currentPlayer.sid
      ) {
        game.gameState = "launched";
        setTimeout(() => {
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
        }, 1200);
      }
    });

    // Réception d'un choix de domino en positionnant un roi
    socket.on("chosenDomino", (numero) => {
      if (
        socket.id === playersModule.currentPlayer.sid &&
        game.findDominoToPick(numero) &&
        playersModule.currentPlayer.canPlaceKing
      ) {
        if (game.turn === 0) {
          game.firstTurnKing(io, socket, rooms[0], numero);
        } else {
          game.nTurnKing(io, socket, rooms[0], numero);
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
        game.nTurnDomino(io, socket, rooms[0], data);
      } else {
        console.log("placedDomino is false");
      } /*  else if () {
        // Dernier tour
      } */
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
        if (game.gameState === "launched" || game.gameState === "launching") {
          socket.broadcast.emit("lostConnection", playerToDelete.pseudo);
          playersModule = new Players();
          game = new Game(playersModule);
        }
      }
    });
  });
};
