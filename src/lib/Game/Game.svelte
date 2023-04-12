<script lang="ts">
	export let mapData: MapData;
	import { onMount } from "svelte";
	import type { MapData } from "../Interfaces";
	import { pieceMap, moveCount, colorCount, colorPalette } from "./GameStore";
	import Board from "./Board.svelte";
	import Counter from "./Counter.svelte";
	onMount(() => {
		pieceMap.set(mapData.pieceMap);
		colorPalette.set(mapData.palette);
		colorCount.set(mapData.colorCount);
		moveCount.set(mapData.moves.length);
	});
</script>

<div class="game-wrapper">
	<Counter />
	<Board {mapData} />
</div>

<style>
	.game-wrapper {
		display: flex;
		align-self: start;
		align-items: center;
		flex-direction: column;
		justify-content: center;
	}
</style>
