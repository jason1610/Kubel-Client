<script lang="ts">
	import { restart } from "../Game/GameStore";
</script>

<button
	on:click={() => {
		restart.set(true);
	}}>Play Again</button
>
