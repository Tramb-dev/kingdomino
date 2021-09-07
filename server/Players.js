module.exports = class Players {
  playerOrder = [];
  nextTurnPlayerOrder = [];
  currentPlayer = {};

  room = [];

  /*
  player = {
    pseudo: string;
    color: string;
    index: number;
    uid: string;
    sid: string;
    readyToPlay: boolean;
    canAccessToLobby: boolean;
    canAccessToGame: boolean;
    score: number;
    canPlaceKing: boolean;
  }

  */
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
      (player) =>
        // N'envoie pas les identifiants pour qu'ils restent en back
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
    // TODO: décommenter
    let players = [];
    if (this.room.length > 2) {
      players = Array.from({ length: this.room.length }, (v, k) => k);
    } else {
      players = Array.from({ length: 4 }, (v, k) => k % 2);
    }
    for (let i = players.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [players[i], players[j]] = [players[j], players[i]];
    }
    this.playerOrder = players;
    //this.playerOrder = [1, 1, 1, 1];
  }

  /**
   * Renvoi le prochain joueur à jouer
   */
  nextPlayer() {
    this.currentPlayer.canPlaceKing = false;

    const index = this.playerOrder.shift();
    this.currentPlayer = this.room[index];
    this.currentPlayer.index = index;
    this.currentPlayer.canPlaceKing = true;
    return this.currentPlayer;
  }

  /**
   * Garde en mémoire la position des joueurs via leurs pions pour le prochain tour, uen fois qu'ils ont tous sélectionné leurs dominos
   * @param {*} pickedDominoes
   * @returns
   */
  placePlayersForNextTurn(pickedDominoes) {
    for (let i = 0; i < pickedDominoes.length; i++) {
      this.nextTurnPlayerOrder[i] = pickedDominoes[i].player;
    }
    return this.nextTurnPlayerOrder;
  }
};
