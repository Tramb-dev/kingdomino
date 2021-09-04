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
        if (playersModule.room.every((player) => player.readyToPlay === true)) {
          // Les joueurs sont trié aléatoirement puis le premier joueur est tiré
          playersModule.sortPlayers();
          playersModule.nextPlayer();
          io.to(rooms[0]).emit("startGame");
          io.to(rooms[0]).emit(
            "currentDominoes",
            game.initDominoes(playersModule.room.length)
          );
          /* 
          io.to(rooms[0]).emit("firstPlayer", ); */
        }
      }
    });

    socket.on("startGame", () => {
      if (
        socket.id === playersModule.room[playersModule.currentPlayerNumber].sid
      ) {
        socket.to(rooms[0]).emit("message", {
          type: "isTurnOf",
          data: playersModule.room[playersModule.currentPlayerNumber].pseudo,
        });
        socket.emit("message", {
          type: "yourTurn",
          data: playersModule.room[playersModule.currentPlayerNumber].pseudo,
        });
        socket.emit("yourTurn", (data) => {
          console.log(data);
        });
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
        socket.broadcast.emit("allPlayers", playersModule.sendPlayers());
      }
    });
  });
};
