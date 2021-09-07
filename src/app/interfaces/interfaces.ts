export interface Case {
  position: {
    ligne: number;
    colonne: number;
  };
  isDroppable: boolean;
  contenu: string | null; // chateau, ble, marais, prairie, mine, foret, eau, null
  nbCouronnes: number; // [0-3]
}

export interface CaseDomino {
  contenu: string;
  couronnes: number;
}

export interface Domino {
  numero: number;
  orientation: number;
  rotate: number;
  left: CaseDomino;
  right: CaseDomino;
  position: {
    left: number;
    top: number;
  };
}

export interface PlacedDomino {
  numero: number;
  orientation: number;
  rotate: number;
  position: {
    left: number;
    top: number;
  };
  gridPosition: {
    left: number;
    top: number;
  };
}

export interface GridPosition {
  left: number;
  top: number;
  col: number;
  row: number;
}

export interface GridFromServer {
  numero: number;
  orientation: number;
  gridPosition: {
    row: number;
    col: number;
  };
}
