export interface DailyData {
	colorMap: Array<Array<number>>;
	colorCount: Array<number>;
	seed: string;
	version: number;
}

export interface ProgressData {
	moves: Move[];
	idMap: Array<Array<Position>>;
	hasWon: boolean;
	seed: string;
	version: number;
}

export interface Move {
	offset: Position;
	position: Position;
}

export interface Position {
	x: number;
	y: number;
}
