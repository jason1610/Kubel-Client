<script lang="ts">
	import { prevent_default } from "svelte/internal";
	import { showHelp } from "../../GlobalStore";
	import tutorialVideo from "../../assets/tutorial-solve.mp4";
	import closeIcon from "../../assets/close-icon.svg";

	const hideHelp = (e: any) => {
		if (!e.target.closest(".card-container")) {
			showHelp.set(false);
		}
	};
</script>

<div class="screen-container" on:click={hideHelp} on:keypress={hideHelp}>
	<div class="card-container">
		<button on:click={() => showHelp.set(false)}>
			<img src={closeIcon} alt="" />
		</button>
		<video src={tutorialVideo} preload="auto" autoplay loop />
		<h2>How to play</h2>
		<p>
			<span>Click and drag</span> a piece to move the row or collumn. Win the game by moving
			all the pieces of the <span>same color</span> next to each other. Use as few moves as possible
			to get the best score. New puzzles every day!
		</p>
		<br />
		<p style="text-align: center; font-weight:bold">😄Good luck & have fun!😄</p>
		<p style="text-align: center; font-size: 14px; color:rgba(100, 100, 100, 0.85)">
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
		width: 100vw;
		height: 100vh;
		height: 100lvh;
		display: flex;
		justify-content: center;
		align-items: center;
		background: rgba(0, 0, 0, 0.75);
		z-index: 1;
		cursor: pointer;
		box-sizing: border-box;
		padding: 0 5vw;
	}

	.card-container {
		padding: 30px;
		width: 400px;
		cursor: default;
		background: #d7d7d7;
		border-radius: 10px;
		box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.3);
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		gap: 20px;
		color: black;
		position: relative;
		animation: spawn 0.25s ease-out forwards;
	}

	@keyframes spawn {
		from {
			transform: translateY(200px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	button {
		position: absolute;
		top: 10px;
		right: 10px;
		background: none;
		border: none;
		cursor: pointer;
		width: 35px;
		aspect-ratio: 1/1;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	button img {
		width: 80%;
		opacity: 0.5;
		transition: opacity 0.2s ease-in-out;
	}

	button:hover img {
		opacity: 1;
	}

	video {
		width: 80%;
		border-radius: 15%;
	}
	h2 {
		font-size: 1.7rem;
		font-weight: bold;
	}
	span {
		font-weight: bold;
	}
</style>
