<script lang="ts">
	import { restart } from "../Game/GameStore";
</script>

<button
	on:click={() => {
		restart.set(true);
	}}>PLAY AGAIN</button
>

<style>
	button {
		grid-row: 2 / span 2;
		grid-column: 1;
		/* font-size: 25px; */
		font-weight: 900;
		text-shadow: 0 0 10px rgba(0, 0, 0, 0.35);
		color: white;
		background: radial-gradient(circle at 10% -40%, #87e53a 0%, #08d334 90%);
		border-radius: 10px;
		border: 5px solid rgba(255, 255, 255, 0.04);
		cursor: pointer;
		transition: all 0.2s;
		padding: 10px 0;
		letter-spacing: 1.5px;
	}

	button:hover {
		transform: scale(1.05) translate(0, -0.15rem);
		box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.35);
	}

	button:active {
		transform: scale(1) translate(0, 0.15rem);
		box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
	}

	@media (max-width: 1500px) {
		button {
			grid-column: 1;
			grid-row: 6 / span 2;
		}
	}
</style>
