<script lang="ts">
	import loadingIcon from "../../assets/loading-icon.gif";
</script>

<div class="loading">
	<img src={loadingIcon} alt="Loading" />
</div>

<style>
	.loading {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.loading img {
		width: 60px;
		aspect-ratio: 1;
		filter: drop-shadow(0 0 50px rgba(255, 255, 255, 0.25));
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
