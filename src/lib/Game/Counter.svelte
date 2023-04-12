<script lang="ts">
	import { onMount } from "svelte";
	import { moveCount, isMoving, hasWon } from "./GameStore";
</script>

<div class="counter {$hasWon ? 'win' : ''}">
	<p>{$moveCount}</p>
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
	.win {
		background: rgb(201, 26, 26);
		background: linear-gradient(to bottom, rgb(225, 189, 81), rgb(248, 221, 18));
		box-shadow: 0 7.5px 0 0 rgb(227, 134, 5);
	}
	.counter p {
		font-size: 56px;
		font-weight: 700;
		color: rgb(41, 43, 38);
		text-align: center;
		font-family: "Jura", sans-serif;
	}
</style>
