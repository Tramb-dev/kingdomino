export interface Player {
  pseudo: string;
  color: string;
  score?: number;
  canAccessToLobby: boolean;
  canAccessToGame: boolean;
  uid?: string;
  sid?: string;
  readyToPlay: boolean;
  canPlaceDomino: boolean;
  canPlaceKing: boolean;
  isTurn: boolean;
  grid?: Object[];
}
