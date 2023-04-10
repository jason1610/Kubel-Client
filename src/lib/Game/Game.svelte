<script lang="ts">
	import { onMount } from "svelte";

	import type { DailyData, ProgressData } from "../Interfaces";
	export let dailyData: DailyData;
	export let progressData: ProgressData;

	import { moveCount, isMoving, hasWon } from "./GameStore";

	import Board from "./Board.svelte";
	import Counter from "./Counter.svelte";

	onMount(() => {
		hasWon.set(progressData.hasWon);
		moveCount.set(progressData.moves.length);
	});
</script>

<div class="game-wrapper">
	<Counter />
	<Board />
</div>

<style>
	.game-wrapper {
		width: 100%;
		height: 100%;
		align-self: start;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
</style>
