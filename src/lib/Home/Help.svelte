<script lang="ts">
	import { prevent_default } from "svelte/internal";
	import { showHelp } from "../../GlobalStore";

	const hideHelp = (e: any) => {
		if (!e.target.closest(".card")) {
			showHelp.set(false);
		}
	};
</script>

<div class="screen-container" on:click={hideHelp} on:keypress={hideHelp}>
	<div class="card">
		<h2>How to play</h2>
		<br />
		<p>Kubel is like a 2d Rubiks cube. Its very simple!</p>
		<br />
		<p>
			<span>Click and drag</span> a piece to move the row or collumn. Win the game by moving
			all the pieces of the <span>same color</span> next to each other. Use as few moves as possible
			to get the best score.
		</p>
		<br />
		<p style="text-align: center; font-weight:bold">😄Good luck & have fun!😄</p>
		<p style="text-align: center; font-size: 14px; color:rgba(150, 150, 200, 0.75)">
			Feedback? Questions? Message me! <a href="mailto:jason@kubel.io" target="_blank"
				>jason@kubel.io</a
			>
		</p>
	</div>
</div>

<style>
	.screen-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background: radial-gradient(rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.2) 100%);
		z-index: 1;
		cursor: pointer;
	}

	.card {
		padding: 30px;
		position: absolute;
		width: 400px;
		max-width: 85vw;
		cursor: default;
	}

	.card h2 {
		text-align: center;
		font-size: 1.2rem;
	}

	span {
		font-weight: bold;
	}
</style>
