const db = require("./db");

// TODO: réaliser un vrai scoring
/* const scoreSheet = [
  {
    pseudo: "Tramb",
    score: 28,
    color: "blue",
    date: "test",
  },
  {
    pseudo: "Aramina",
    score: 20,
    color: "pink",
    date: "test",
  },
]; */

const room = [
  {
    pseudo: "Tramb",
    color: "blue",
    uid: "1",
    readyToPlay: false,
  },
];

const chalk = require("chalk");

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
    socket.on("newPlayer", (newPlayer) => {
      const pseudo = testPseudo(newPlayer.pseudo);
      room.push({
        pseudo: pseudo,
        uid: newPlayer.uid,
        sid: socket.id,
        readyToPlay: false,
      });

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
    socket.on("playerIsReady", (playerIsReady) => {
      const player = findPlayer(playerIsReady.uid, socket.id);

      if (player) {
        player.readyToPlay = !player.readyToPlay;
        webSocketServer.emit("players", sendPlayers());

        // Si tous les joueurs sont prêt, on démarre le jeu
        if (room.every((player) => player.readyToPlay === true)) {
          webSocketServer.emit("startGame");
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
 * @param {*} uid l'identifiant généré par le client
 * @param {*} sid l'identifiant généré par la connexion WebSocket
 * @returns Un objet représentant le joueur cherché ou undefined
 */
function findPlayer(uid, sid) {
  return room.find((element) => element.sid === sid && element.uid === uid);
}
