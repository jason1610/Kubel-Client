export interface MapData {
	pieceMap: Array<Array<Piece>>;
	colorCount: Array<number>;
	palette: Array<string>;
	seed: string;
	version: number;
	moves: Move[];
	hasWon: boolean;
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
