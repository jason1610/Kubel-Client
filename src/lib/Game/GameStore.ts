import { readable, writable } from "svelte/store";

export const idMap = writable(null);
export const moveCount = writable(0);
export const hasWon = writable(false);
export const colorCount = writable([]);
export const pieceMap = writable([[]]);
export const isMoving = writable(false);
export const colorPalette = writable([]);
export const selectedColor = writable("white");
export const completedColrs = writable([]);
