<script lang="ts">
	export let mapData: MapData;
	import { onMount } from "svelte";
	import type { MapData } from "../../Interfaces";
	import { pieceMap, moveCount, palette } from "./GameStore";
	import Board from "./Board.svelte";
	import Counter from "./Counter.svelte";
	onMount(() => {
		pieceMap.set(mapData.pieceMap);
		palette.set(mapData.palette);
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
		align-items: center;
		flex-direction: column;
		justify-content: center;
	}
</style>
