<script>
	import { userCountry } from "../GlobalStore";
	import { onMount, createEventDispatcher } from "svelte";
	import countries from "i18n-iso-countries";

	const localCountry = localStorage.getItem("userCountry");
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
			userCountry.set(selectedCountry);
			dispatch("play", selectedCountry);
		}
	};

	function getCountryName(isoCode) {
		return countries.getName(isoCode, "en", { select: "official" });
	}
</script>

<div class="card">
	{#if selectedCountry}
		<img
			src={`https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/4x3/${selectedCountry.toLowerCase()}.svg`}
			alt={getCountryName(selectedCountry)}
			title={getCountryName(selectedCountry)}
		/>
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
		align-items: center;
		gap: 20px;
		position: absolute;
		bottom: 50%;
	}

	.card img {
		width: 150px;
		border-radius: 15px;
		box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.4);
	}

	.search {
		display: flex;
		flex-direction: row;
	}

	button {
		width: 100px;
		border: none;
		cursor: pointer;
	}
	select {
		width: 200px;
	}
</style>
