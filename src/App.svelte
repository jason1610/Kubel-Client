<script lang="ts">
	import { onMount } from "svelte";
	import axios from "axios";
	import Background from "./lib/Background.svelte";
	import Header from "./lib/Header.svelte";
	import loadingIcon from "./assets/loading-icon.gif";

	let loadingState: String = "Loading";
	let dailyData: JSON;

	const fetchDailyData = () => {
		axios
			.get("https://api.kubel.io/daily")
			.then((res) => {
				if (res.status === 200) {
					console.log(res.data);
					dailyData = res.data;
					loadingState = "Loaded";
				} else {
					loadingState = "Error";
				}
			})
			.catch((err) => {
				loadingState = "Error";
				console.error(err);
			});
	};

	onMount(() => {
		setTimeout(() => {
			fetchDailyData();
		}, 1000);
	});
</script>

<main id="app">
	<Header />
	<div class="layout">
		{#if loadingState === "Loading"}
			<div class="loading">
				<img src={loadingIcon} alt="Loading" />
			</div>
		{:else if loadingState === "Loaded"}
			<div class="loaded">
				<h1>Loaded</h1>
			</div>
		{:else if loadingState === "Error"}
			<div class="error">
				<h1>💀</h1>
				<h1>Uh oh...</h1>
				<p>Something went wrong.</p>
				<p>Try refreshing the page.</p>
			</div>
		{/if}
	</div>
	<Background />
</main>

<style>
	.layout {
		min-height: 80vh;
		min-height: 80lvh;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.loading img {
		width: 60px;
		aspect-ratio: 1;
		filter: drop-shadow(0 0 50px #ffffffad);
		animation: loader-spawn 1s ease;
	}

	@keyframes loader-spawn {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	.error {
		text-align: center;
	}

	.error p {
		font-size: 1.2rem;
		color: #ffffffad;
	}
</style>
