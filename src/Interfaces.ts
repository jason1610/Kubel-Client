export interface MapData {
	pieceMap: Array<Array<Piece>>;
	palette: Array<string>;
	seed: string;
	version: number;
	moves: Move[];
}

export interface Move {
	offset: Vector;
	position: Vector;
}

export interface Vector {
	x: number;
	y: number;
}

export interface Piece {
	color: string;
	id: string;
}

export interface UserStats {
	gamesWon: number;
	scoreHistory: number[];
	winStreak: number;
	lastWin: string;
	dailyHighScore: number;
	dailyHistory: number[];
}
