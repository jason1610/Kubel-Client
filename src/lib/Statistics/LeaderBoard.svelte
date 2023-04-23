<!-- LeaderBoard.svelte -->
<script lang="ts">
	export let leaderBoard: string[][] = [];
	import { onMount } from "svelte";
	import countries from "i18n-iso-countries";
	import en from "i18n-iso-countries/langs/en.json";
	countries.registerLocale(en);

	let groupedCountries: { score: number; countries: string[] }[] = [];

	function getCountryName(isoCode) {
		return countries.getName(isoCode, "en", { select: "official" });
	}

	$: {
		groupedCountries = [];
		for (let i = 0; i < leaderBoard.length; i++) {
			if (leaderBoard[i].length > 0) {
				groupedCountries.push({ score: i, countries: leaderBoard[i] });
			}
		}
	}
</script>

<div class="card">
	<h2>Leader Board</h2>
	<div class="board">
		{#each groupedCountries as { score, countries }, i}
			{#each countries as country, j}
				<div class="country">
					<img
						src={`https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/4x3/${country.toLowerCase()}.svg`}
						alt={getCountryName(country)}
						title={getCountryName(country)}
					/>
					{#if i === 0}
						<p style="color:gold">{score}</p>
					{:else if i === 1}
						<p style="color:silver">{score}</p>
					{:else if i === 2}
						<p style="color:#CD7F32">{score}</p>
					{:else}
						<p>{score}</p>
					{/if}
				</div>
			{/each}
		{/each}
	</div>
</div>

<style>
	.card {
		grid-column: 5;
		grid-row: 2 / span 4;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		gap: 10px;
		/* padding-left: 0;
		padding-right: 0; */
	}

	h2 {
		text-align: center;
		/* font-size: 0.8rem; */
	}

	.board {
		overflow: scroll;
		display: grid;
		gap: 10px;
		width: 100%;
		max-width: 150px;
		overflow-x: hidden;
		align-self: center;
		scrollbar-width: thin;
		scrollbar-color: #586a84 #586a8400;
	}

	.board::-webkit-scrollbar {
		width: 4px;
	}
	.board ::-webkit-scrollbar-track {
		background: #586a8400;
	}
	.board::-webkit-scrollbar-thumb {
		background-color: #586a84;
		border-radius: 20px;
		border: 4px solid #586a8400;
	}
	.board::-webkit-scrollbar-thumb:hover {
		background-color: #6f84a0;
	}

	.country {
		/* height: 75px; */
		width: 100%;
		display: flex;
		align-items: center;
		flex-grow: 0;
		flex-shrink: 1;
	}

	.country p {
		width: 100%;
		color: #586a84;
		text-align: center;
	}

	.country img {
		border-radius: 7px;
		box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
		width: 50px;
	}

	@media (max-width: 1500px) {
		.card {
			grid-column: 3;
			grid-row: 4 / span 5;
		}
	}
	@media (max-width: 700px) {
		.card {
			grid-column: 2;
			grid-row: 6 / span 4;
		}
	}
</style>
