<script lang="ts">
	import { restart } from "./Game/GameStore";
</script>

<div class="satistics-container">
	<button
		on:click={() => {
			restart.set(true);
		}}>Play Again</button
	>
</div>

<style>
	.satistics-container {
		justify-self: center;
		display: flex;
		align-self: center;
		align-items: center;
		flex-direction: column;
		background-color: red;
		justify-content: center;
	}

	.card {
		background-color: black;
	}
</style>
