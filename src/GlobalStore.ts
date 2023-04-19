import { writable } from "svelte/store";

export const userCountry = writable(null);
export const changeCountry = writable(false);
export const showHelp = writable(false);
