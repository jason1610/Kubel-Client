<script lang="ts">
	import loadingIcon from "../assets/loading-icon.gif";
</script>

<div class="loading">
	<img src={loadingIcon} alt="Loading" />
</div>

<style>
	.loading img {
		width: 60px;
		aspect-ratio: 1;
		filter: drop-shadow(0 0 50px #ffffffad);
		animation: loader-spawn 1s ease;
	}

	@keyframes loader-spawn {
		0% {
			opacity: 0;
			transform: scale(0.5);
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>
