<script>
	import { onMount, createEventDispatcher } from "svelte";
	import countries from "i18n-iso-countries";

	const dispatch = createEventDispatcher();
	let countryList = [];
	let selectedCountry = "";
	let filteredCountryList = [];
	let searchText = "";

	onMount(async () => {
		const enLocaleData = await import("i18n-iso-countries/langs/en.json");
		countries.registerLocale(enLocaleData.default);
		countryList = Object.entries(countries.getNames("en")).map(([code, name]) => ({
			code,
			name,
		}));
		countryList.sort((a, b) => a.name.localeCompare(b.name));
		filteredCountryList = countryList;
	});

	const countryCodeToEmoji = (countryCode) => {
		const OFFSET = 127397; // Unicode regional indicator symbols offset
		const codePoints = countryCode
			.toUpperCase()
			.split("")
			.map((char) => char.charCodeAt(0) + OFFSET);
		return String.fromCodePoint(...codePoints);
	};

	const handleChange = (event) => {
		selectedCountry = event.target.value;
	};

	const handlePlay = () => {
		if (selectedCountry) {
			localStorage.setItem("userCountry", selectedCountry);
			dispatch("play", selectedCountry);
		}
	};
</script>

<div class="card">
	{#if selectedCountry}
		<p class="flag">{countryCodeToEmoji(selectedCountry)}</p>
	{/if}
	<div class="search">
		<select bind:value={selectedCountry} on:change={handleChange}>
			<option value="">Select a country</option>
			{#each countryList as country (country.code)}
				<option value={country.code}>
					<span class="name"> {country.name}</span>
				</option>
			{/each}
		</select>

		<button on:click={handlePlay}>Play!</button>
	</div>
</div>

<style>
	.card {
		display: flex;
		flex-direction: column;
		justify-content: center;
		background: rgba(20, 20, 30, 0.5);
		background: linear-gradient(20deg, rgba(4, 4, 4, 0.5), rgba(24, 26, 32, 0.5));
		border-radius: 10px;
		box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
		padding: 20px;
	}

	.search {
		display: flex;
		flex-direction: row;
		margin-bottom: 1rem;
	}

	.flag {
		text-align: center;
		font-size: 3rem;
		margin-bottom: 1rem;
	}
	select option {
		max-height: 10px; /* set the maximum height of the dropdown list */
		overflow-y: auto; /* enable vertical scrolling if needed */
	}
</style>
