<script lang="ts">
</script>

<div class="card">
	<h1>🎉 Victory! 🎉</h1>
</div>

<style>
	.card {
		grid-column: 1 / span 5;
		grid-row: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.card h1 {
		text-align: center;
		font-size: 1.4rem;
		font-weight: 600;
	}

	@media (max-width: 1500px) {
		.card {
			grid-column: 1 / span 3;
			grid-row: 1;
		}
	}

	@media (max-width: 700px) {
		.card {
			grid-column: 1 / span 2;
			grid-row: 1;
		}
	}
</style>
