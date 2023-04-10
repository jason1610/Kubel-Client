import { writable } from "svelte/store";

export const moveCount = writable(0);
export const isMoving = writable(false);
export const hasWon = writable(false);
