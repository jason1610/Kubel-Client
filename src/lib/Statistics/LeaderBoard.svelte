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

	const countryName = getCountryName("US");

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
		{#each groupedCountries as { score, countries }}
			{#each countries as country}
				<div class="country">
					<p>{score}</p>
					<img
						src={`https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/4x3/${country.toLowerCase()}.svg`}
						alt={getCountryName(country)}
						title={getCountryName(country)}
					/>
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
		justify-content: center;
		gap: 10px;
	}

	h2 {
		/* font: var(--card-title-font); */
		text-align: center;
	}

	.board {
		border-radius: 0.6rem;
		height: 100%;
		overflow: scroll;
		flex-direction: column;
		display: grid;
		gap: 10px;
	}

	.country {
		height: 75px;
		display: flex;
		overflow: hidden;
		align-items: center;
		border-radius: 10px;
		position: relative;
	}

	.country p {
		font-size: 2rem;
		text-align: right;
		width: 100%;
		padding: 15px;
		/* font-family: "JURA", sans-serif; */
		font-weight: 700;
		color: rgb(160, 154, 160);
		z-index: 5;
		pointer-events: none;
	}

	.country img {
		position: absolute;
		mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0) 95%);
		-webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0) 95%);
		width: 80%;
		z-index: 4;
		margin-left: -1px;
	}
</style>
