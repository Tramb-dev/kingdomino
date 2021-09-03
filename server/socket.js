const db = require("./db");
const uuid = require("uuid");
const Game = require("./Game");

const room = [
  {
    pseudo: "Tramb",
    color: "blue",
    uid: "1",
    readyToPlay: true,
  },
];

const chalk = require("chalk");
// Réaliser une instance du jeu par salon
game = new Game(4);

module.exports = (webSocketServer) => {
  webSocketServer.on("connection", (socket) => {
    console.log(chalk.green.italic("nouvelle connection"));

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
    socket.on("newPlayer", (pseudo) => {
      pseudo = testPseudo(pseudo);
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

      room.push(newPlayer);

      socket.emit("newPlayer", newPlayer);
      webSocketServer.emit("players", sendPlayers());
    });

    // Le joueur choisit une couleur
    socket.on("chosenColor", (chosenColor) => {
      const player = findPlayer(chosenColor.uid, socket.id);

      if (player) {
        player.color = chosenColor.color;
        webSocketServer.emit("players", sendPlayers());
      }
    });

    // Le joueur annonce qu'il est prêt à jouer
    socket.on("playerIsReady", (playerUId) => {
      const player = findPlayer(playerUId, socket.id);

      if (player) {
        player.readyToPlay = !player.readyToPlay;
        webSocketServer.emit("players", sendPlayers());

        // Si tous les joueurs sont prêts, on démarre le jeu
        if (room.every((player) => player.readyToPlay === true)) {
          webSocketServer.emit("startGame");
          webSocketServer.emit("currentDominoes", game.initDominoes());
          const playerOrder = game.sortPlayers();
        }
      }
    });

    socket.on("disconnect", () => {
      console.log(chalk.yellow.italic("connection perdue"));
      const playerToDelete = room.find((element) => {
        return element.sid === socket.id;
      });

      if (playerToDelete) {
        room.splice(room.indexOf(playerToDelete), 1);
        socket.broadcast.emit("players", sendPlayers());
      }
    });
  });
};

/**
 * Modifie le pseudo s'il est déjà pris en ajoutant des chiffres aléatoirement
 * @param {*} givenPseudo le pseudo renseigné par l'utilisateur
 * @returns le pseudo modifié ou non
 */
function testPseudo(givenPseudo) {
  room.forEach((player) => {
    if (player.pseudo === givenPseudo) {
      givenPseudo += Math.floor(Math.random() * 10);
      testPseudo(givenPseudo);
    }
  });
  return givenPseudo;
}

/**
 * Map les données à envoyer aux connexions
 * @returns Le tableau de joueurs mappé
 */
function sendPlayers() {
  return room.map(
    // N'envoie pas les identifiants pour qu'ils restent en back
    (player) =>
      (player = {
        pseudo: player.pseudo,
        color: player.color,
        readyToPlay: player.readyToPlay,
      })
  );
}

/**
 * Cherche un joueur dans le salon avec ses identifiants
 * @param {*} uid l'identifiant généré par uuid
 * @param {*} sid l'identifiant généré par la connexion WebSocket
 * @returns Un objet représentant le joueur cherché ou undefined
 */
function findPlayer(uid, sid) {
  return room.find((element) => element.sid === sid && element.uid === uid);
}
