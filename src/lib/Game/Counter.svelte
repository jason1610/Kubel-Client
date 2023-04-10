<script lang="ts">
	import { onMount } from "svelte";

	import type { DailyData, ProgressData } from "../Interfaces";

	import { moveCount, isMoving, hasWon } from "./GameStore";

	import Board from "./Board.svelte";
	import Counter from "./Counter.svelte";

	let countValue: number = 0;
	moveCount.subscribe((value) => {
		countValue = value;
	});
</script>

<div class="counter">
	<p>{countValue}</p>
</div>

<style>
	.counter {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: rgb(240, 236, 236);
		background: linear-gradient(to bottom, rgb(255, 255, 255), rgb(210, 181, 181));
		box-shadow: 0 7.5px 0 0 rgb(218, 175, 175);
		min-width: 75px;
		height: 75px;
		border-radius: 20px;
		margin-bottom: 50px;
		padding: 10px;
	}
	.counter p {
		font-size: 56px;
		font-weight: 700;
		color: rgb(41, 43, 38);
		font-family: "Jura", sans-serif;
	}
</style>
