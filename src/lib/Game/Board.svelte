<script lang="ts">
	import * as PIXI from "pixi.js";
	import { onMount } from "svelte";
</script>

<div class="board" />

<style>
	.board {
		/* width: min(90vw, 60vh); */
		width: 100%;
		max-width: min(600px, 90vw);
		aspect-ratio: 1/1;

		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 10px;
		background: rgba(0, 0, 0, 0.5);
		z-index: -5;
	}
</style>
