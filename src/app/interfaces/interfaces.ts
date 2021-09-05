export interface Case {
  position: {
    ligne: number;
    colonne: number;
  };
  isDroppable: boolean;
  contenu: string | null; // chateau, ble, marais, pre, mine, foret, eau, null
  nbCouronnes: number; // [0-3]
  hover: boolean;
  exists: boolean;
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
