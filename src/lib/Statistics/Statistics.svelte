<script lang="ts">
	import { restart } from "../Game/GameStore";
	import UserSats from "./UserSats.svelte";
	import Restart from "./Restart.svelte";
</script>

<div class="satistics-container">
	<UserSats />
	<Restart />
</div>

<style>
	.satistics-container {
		justify-self: center;
		display: flex;
		align-self: center;
		align-items: center;
		flex-direction: column;
		background: rgba(20, 20, 30, 0.5);
		background: linear-gradient(20deg, rgba(4, 4, 4, 0.7), rgba(17, 23, 38, 0.7));
		padding: 20px;
		border-radius: 10px;
		gap: 20px;
		width: 700px;
		height: 500px;
	}

	:root {
		--card-background-flat: rgba(20, 20, 30, 0.5);
		--card-background-gradient: linear-gradient(
			20deg,
			rgba(4, 4, 4, 0.5),
			rgba(24, 26, 32, 0.5)
		);
		--card-border-radius: 10px;
		--card-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
		--card-padding: 20px;
	}
</style>
