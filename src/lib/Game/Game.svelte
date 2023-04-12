<script lang="ts">
	import { onMount } from "svelte";
	import type { MapData } from "../Interfaces";
	export let mapData: MapData;

	import {
		idMap,
		hasWon,
		pieceMap,
		isMoving,
		moveCount,
		colorCount,
		colorPalette,
	} from "./GameStore";

	import Board from "./Board.svelte";
	import Counter from "./Counter.svelte";

	onMount(() => {
		hasWon.set(mapData.hasWon);
		pieceMap.set(mapData.pieceMap);
		colorCount.set(mapData.colorCount);
		moveCount.set(mapData.moves.length);
		colorPalette.set(mapData.palette);
	});
</script>

<div class="game-wrapper">
	<Counter />
	<Board {mapData} />
</div>

<style>
	.game-wrapper {
		width: 100%;
		height: 100%;
		display: flex;
		align-self: start;
		align-items: center;
		flex-direction: column;
		justify-content: center;
	}
</style>
