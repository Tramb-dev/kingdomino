module.exports = class Players {
  playerOrder = [];
  nextTurnPlayerOrder = [];
  currentPlayerNumber;

  room = [
    {
      pseudo: "Tramb",
      color: "blue",
      uid: "1",
      readyToPlay: true,
    },
  ];

  constructor() {}
  /**
   * Modifie le pseudo s'il est déjà pris en ajoutant des chiffres aléatoirement
   * @param {*} givenPseudo le pseudo renseigné par l'utilisateur
   * @returns le pseudo modifié ou non
   */
  testPseudo(givenPseudo) {
    this.room.forEach((player) => {
      if (player.pseudo === givenPseudo) {
        givenPseudo += Math.floor(Math.random() * 10);
        this.testPseudo(givenPseudo);
      }
    });
    return givenPseudo;
  }

  /**
   * Map les données à envoyer aux connexions
   * @returns Le tableau de joueurs mappé
   */
  sendPlayers() {
    return this.room.map(
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
  findPlayer(uid, sid) {
    return this.room.find(
      (element) => element.sid === sid && element.uid === uid
    );
  }
  /**
   * Tri aléatoirement les joueurs pour le premier tour
   */
  sortPlayers() {
    const players = Array.from({ length: this.room.length }, (v, k) => k);
    for (let i = this.room.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [players[i], players[j]] = [players[j], players[i]];
    }
    this.playerOrder = players;
  }

  /**
   * Renvoi le prochain joueur à jouer
   */
  nextPlayer() {
    this.currentPlayerNumber = this.playerOrder.pop();
    return this.currentPlayerNumber;
  }
};
