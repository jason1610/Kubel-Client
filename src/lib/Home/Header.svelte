<script lang="ts">
	import { onMount } from "svelte";
	import logo from "../../assets/logo.svg";
	import help from "../../assets/help-icon.svg";
	import { userCountry, changeCountry, showHelp, hasPlayedToday } from "../../GlobalStore";
	import { hasWon } from "../../lib/Game/GameStore";

	let country = localStorage.getItem("userCountry");

	const checkIfEverPlayed = () => {
		let progressData: any = localStorage.getItem("userStats");
		if (progressData === null) return false;
		progressData = JSON.parse(progressData);
		if (progressData.gamesWon > 0) return true;
		return false;
	};

	onMount(() => {
		console.log(checkIfEverPlayed());
		const unsubscribe = hasWon.subscribe((value) => {
			if (value) {
				hasPlayedToday.set(true);
			}
		});
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
		<button
			class="flag {checkIfEverPlayed() && !$hasPlayedToday ? 'glow' : ''}"
			disabled={$hasPlayedToday}
			on:click={() => changeCountry.set(true)}
		>
			<img
				src={`https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/4x3/${$userCountry.toLowerCase()}.svg`}
				alt="flag"
			/>
		</button>
	{:else if country}
		<button
			class="flag {checkIfEverPlayed() && !$hasPlayedToday ? 'glow' : ''}"
			disabled={$hasPlayedToday}
			on:click={() => changeCountry.set(true)}
		>
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
		box-sizing: border-box;
		padding: 10px 25px;
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
		width: 100%;
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

	.glow {
		animation: glow 1s ease-in-out infinite alternate;
	}
	@keyframes glow {
		0% {
			filter: drop-shadow(0 0 7px rgba(255, 255, 255, 0.5));
		}
		100% {
			filter: drop-shadow(0 0 7px rgba(255, 255, 255, 1));
		}
	}
</style>
