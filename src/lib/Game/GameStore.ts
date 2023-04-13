import { readable, writable } from "svelte/store";

export const palette = writable(null);
export const idMap = writable(null);
export const moveCount = writable(0);
export const hasWon = writable(false);
export const restart = writable(false);
export const pieceMap = writable([[]]);
export const isMoving = writable(false);
export const completedColors = writable();
export const selectedColor = writable("white");
