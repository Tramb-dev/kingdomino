export interface Case {
    position: {
        ligne: number;
        colonne: number;
    }
    isDroppable: boolean;
    contenu: string | null; // chateau, ble, marais, pre, mine, foret, eau, null
    nbCouronnes: number; // [0-3]
    hover: boolean;
    exists: boolean;
}

export interface CaseDomino {
    contenu: string;
    nbCouronnes: number;
}

export interface Domino {
    orientation: number;
    rotate?: number;
    numero: number;
    cases: {
        left: CaseDomino;
        right: CaseDomino;
    };
    imgPosition?: {
        top: number;
        left: number;
    }
}