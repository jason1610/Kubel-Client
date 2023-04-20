<script lang="ts">
	import { onMount } from "svelte";
	import logo from "../../assets/logo.svg";
	import help from "../../assets/help-icon.svg";
	import { userCountry, changeCountry, showHelp } from "../../GlobalStore";
	import { hasWon } from "../../lib/Game/GameStore";

	let country = localStorage.getItem("userCountry");
	let hasPlayedToday: boolean = false;

	const checkIfPlayed = () => {
		let userStats: any = localStorage.getItem("userStats");
		if (userStats) {
			userStats = JSON.parse(userStats);
			if (userStats.dailyHistory.length > 0) {
				hasPlayedToday = true;
			}
		}
	};

	onMount(() => {
		const unsubscribe = hasWon.subscribe((value) => {
			if (value) {
				hasPlayedToday = true;
			}
		});
		checkIfPlayed();
		return () => {
			unsubscribe();
		};
	});
</script>

<header>
	<div class="logo">
		<img src={logo} alt="Kubel" />
		<h1>KUBEL.io</h1>
	</div>
	{#if $userCountry}
		<button class="flag" disabled={hasPlayedToday} on:click={() => changeCountry.set(true)}>
			<img
				src={`https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/4x3/${$userCountry.toLowerCase()}.svg`}
				alt="flag"
			/>
		</button>
	{:else if country}
		<button class="flag" disabled={hasPlayedToday} on:click={() => changeCountry.set(true)}>
			<img
				src={`https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/4x3/${country.toLowerCase()}.svg`}
				alt="flag"
			/>
		</button>
	{/if}
	<button
		class="help"
		on:click={() => {
			showHelp.set(true);
		}}
	>
		<img src={help} alt="help" />
	</button>
</header>

<style>
	header {
		height: 70px;
		padding: 10px 30px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		animation: header-spawn 2s ease;
	}

	@keyframes header-spawn {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	.logo {
		display: flex;
		margin-right: auto;
	}
	.logo img {
		width: 40px;
		aspect-ratio: 1;
		margin-right: 10px;
	}
	.logo h1 {
		font-family: "Jura", sans-serif;
		font-weight: 700;
		font-size: 1.8rem;
	}

	.flag {
		width: 40px;
		height: 40px;
		border: 0;
		background: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.flag img {
		border-radius: 4px;
		opacity: 0.75;
		transition: opacity 0.2s ease;
	}

	.flag:hover img {
		opacity: 1;
	}
	.flag:disabled:hover img {
		opacity: 0.75;
	}
	.flag:disabled:hover {
		cursor: default;
	}
	.help {
		margin-left: 20px;
		background: none;
		border: none;
		cursor: pointer;
		width: 40px;
		aspect-ratio: 1;
	}
	.help img {
		width: 70%;
		aspect-ratio: 1;
		opacity: 0.6;
		transition: opacity 0.2s ease;
	}
	.help:hover img {
		opacity: 1;
	}
</style>
