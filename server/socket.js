// TODO: réaliser un vrai scoring
const scoreSheet = [
  {
    pseudo: "Tramb",
    score: 28,
    color: "blue",
  },
  {
    pseudo: "Aramina",
    score: 20,
    color: "red",
  },
];

const room = [
  {
    pseudo: "Tramb",
    color: "blue",
  },
];

const chalk = require("chalk");

module.exports = (webSocketServer) => {
  webSocketServer.on("connection", (socket) => {
    console.log(chalk.green.italic("nouvelle connection"));

    // Envoi le tableau de score
    socket.on("getScore", () => {
      socket.emit("getScore", scoreSheet);
    });

    // Lors de l'arrivée d'un nouveau joueur, vérifie si le nom est déjà pris
    // et le modifie si nécessaire avant de renvoyer la liste des joueurs
    socket.on("newPlayer", (pseudo) => {
      pseudo = testPseudo(pseudo);
      room.push({ pseudo: pseudo });
      webSocketServer.emit("players", room);
    });

    socket.on("disconnect", () => {
      console.log(chalk.yellow.italic("connection perdue"));
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
