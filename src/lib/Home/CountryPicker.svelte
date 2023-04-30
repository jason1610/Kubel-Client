<script lang="ts">
	import { onMount, createEventDispatcher } from "svelte";
	import { userCountry } from "../../GlobalStore";
	import countries from "i18n-iso-countries";
	import Select from "svelte-select";
	// import spinningEarth from "../../assets/spinning-earth.gif";
	import logo from "../../assets/share-image.png";
	const dispatch = createEventDispatcher();
	let localCountry: string;
	$: selectedCountry = "";
	let countryList = [];

	onMount(async () => {
		const enLocaleData = await import("i18n-iso-countries/langs/en.json");
		countries.registerLocale(enLocaleData.default);
		countryList = Object.entries(countries.getNames("en")).map(([code, name]) => ({
			value: code,
			label: name,
		}));
		localCountry = localStorage.getItem("userCountry");
		selectedCountry = localCountry;
	});

	const countryCodeToEmoji = (countryCode) => {
		const OFFSET = 127397; // Unicode regional indicator symbols offset
		const codePoints = countryCode
			.toUpperCase()
			.split("")
			.map((char) => char.charCodeAt(0) + OFFSET);
		return String.fromCodePoint(...codePoints);
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

<div class="container">
	{#if selectedCountry}
		<img
			class="flag"
			src={`https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/4x3/${selectedCountry.toLowerCase()}.svg`}
			alt={getCountryName(selectedCountry)}
			title={getCountryName(selectedCountry)}
		/>
	{:else}
		<div class="title">
			<h1>Welcome to Kubel!</h1>
			<h2>Pick the country you want to play for.</h2>
			<br />
		</div>
		<!-- <img class="flag" src={logo} alt={"Earth"} title={"Flag of Earth"} /> -->
	{/if}
	<div class="search">
		<Select
			items={countryList}
			placeholder="Pick a country 🌎"
			searchable={true}
			clearable={false}
			on:change={(e) => {
				selectedCountry = e.detail.value;
			}}
			closeListOnChange={true}
			inputAttributes={{ autocomplete: "on" }}
			value={selectedCountry}
		/>
		<button on:click={handlePlay}>Play!</button>
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
		gap: 20px;
		min-height: 200px;
	}

	.container .flag {
		width: 150px;
		border-radius: 15px;
		box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.4);
	}

	.search {
		display: flex;
		flex-direction: row;
		color: black;
		width: 400px;
		gap: 10px;
		max-width: 80vw;
	}
	.title {
		/* display: flex; */
		/* padding: 0 100px; */
		/* max-width: 180px; */
		/* width: 400px; */
		/* max-width: 100%; */
	}
	.title h1 {
		font-size: 2rem;
		font-weight: 600;
		text-align: center;
	}
	.title h2 {
		font-size: 1.1rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.425);
		text-align: center;
	}

	button {
		font: "system-ui";
		border-radius: 6px;
		padding: 0 20px;
		border: none;
		cursor: pointer;
		color: white;
		background: radial-gradient(circle at 10% -40%, #87e53a 0%, #08d334 90%);
	}
</style>
