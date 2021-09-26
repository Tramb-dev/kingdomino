export interface Score {
  pseudo: string;
  score: number;
  color: string;
  date: string;
}

export interface CurrentScore {
  pseudo: string;
  score: number;
}

export interface ScoreSheet {
  lastScores: Score[];
  bestScores: Score[];
}
