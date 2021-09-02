export interface Player {
    pseudo: string;
    color: string;
    score?: number;
    canAccessToLobby?: boolean;
    canAccessToGame?: boolean;
    uid?: string;
    readyToPlay: boolean;
}
