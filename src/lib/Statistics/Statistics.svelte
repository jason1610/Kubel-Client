<script lang="ts">
	import axios from "axios";
	import { onMount } from "svelte";

	import PlayAgain from "./PlayAgain.svelte";
	import UserHistory from "./UserHistory.svelte";
	import GlobalScores from "./GlobalScores.svelte";
	import LeaderBoard from "./LeaderBoard.svelte";
	import CountDown from "./CountDown.svelte";
	import Share from "./Share.svelte";
	import Title from "./Title.svelte";

	const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
	let dailyStats: any = null;
	let globalScores: any = null;
	let leaderBoard: any = null;

	onMount(() => {
		console.log("LETS GOOOO");
		axios
			.get(apiBaseUrl + "/statistics")
			.then((res) => {
				if (res.status === 200) {
					dailyStats = res.data;
					globalScores = dailyStats.globalScores;
					leaderBoard = dailyStats.leaderBoard;
					console.log(dailyStats);
				} else {
					console.log("Error");
				}
			})
			.catch((err) => {
				console.error(err);
			});
	});
</script>

<div class="satistics-container">
	{#if !dailyStats}
		<h1>Loading...</h1>
	{:else}
		<Title />
		<GlobalScores {globalScores} />
		<LeaderBoard {leaderBoard} />
		<UserHistory />
		<PlayAgain />
		<CountDown />
		<Share />
	{/if}
</div>

<style>
	.satistics-container {
		align-self: center;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		grid-template-rows: repeat(6, 1fr);
		gap: 20px;
		background: #161b21;
		padding: 20px;
		border-radius: 10px;
		max-width: 95vw;
		box-sizing: border-box;
		width: 700px;
		height: 525px;
		animation: spawn 0.5s ease forwards;
	}

	@keyframes spawn {
		0% {
			opacity: 0;
			transform: scale(0.5);
			transform: translate(0, 200px);
		}
		100% {
			opacity: 1;
			transform: translate(0, 0);
			transform: scale(1);
		}
	}

	:global(.card) {
		background: #1d232c;
		border-radius: 10px;
		box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.3);
		padding: 10px;
		overflow: hidden;
	}

	:global(.card h2) {
		font-family: "Roboto", sans-serif;
		text-align: left;
		font-size: 0.9rem;
		font-weight: 500;
		text-transform: uppercase;
	}

	@media (orientation: portrait), (max-width: 1400px) {
		.satistics-container {
			display: flex;
			flex-direction: column;
			max-width: 100vw; /* set max width to full viewport width */
			height: auto; /* let height adjust to content */
		}
	}
</style>
