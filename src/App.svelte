<script lang="ts">
	import axios from "axios";
	import dayjs from "dayjs";
	import { onMount } from "svelte";
	import utc from "dayjs/plugin/utc";
	import timezone from "dayjs/plugin/timezone";

	dayjs.extend(utc);
	dayjs.extend(timezone);

	import Error from "./lib/Home/Error.svelte";
	import Header from "./lib/Home/Header.svelte";
	import Game from "./lib/Game/Game.svelte";
	import Loading from "./lib/Home/Loading.svelte";
	import { showDashBoard } from "./lib/Game/GameStore";
	import Background from "./lib/Home/Background.svelte";
	import CountryPicker from "./lib/Home/CountryPicker.svelte";
	import { changeCountry, showHelp, hasPlayedToday } from "./GlobalStore";
	import Help from "./lib/Home/Help.svelte";
	const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
	let loadingState: String = "Loading";

	import type { MapData } from "./Interfaces";
	import DashBoard from "./lib/Statistics/DashBoard.svelte";
	let dailyData: MapData;
	let hasCountry = false;

	const isLocalDataValid = (data: any) => {
		let localDailyData: any = localStorage.getItem("dailyData");
		if (!localDailyData) return false;
		localDailyData = JSON.parse(localDailyData);
		if (localDailyData.seed !== data.seed) return false;
		if (localDailyData.version !== data.version) return false;
		// if (localDailyData.pieceMap.length !== data.pieceMap.length) return false;
		// if (localDailyData.pieceMap[0].length !== data.pieceMap[0].length) return false;
		// for (let x = 0; x < data.pieceMap.length; x++) {
		// 	for (let y = 0; y < data.pieceMap[x].length; y++) {
		// 		if (
		// 			(data.pieceMap[x][y] === 0 && localDailyData.pieceMap[x][y] !== null) ||
		// 			(data.pieceMap[x][y] !== 0 && localDailyData.pieceMap[x][y] === null)
		// 		) {
		// 			return false;
		// 		}
		// 	}
		// }
		return true;
	};

	const setDailyData = (data: any) => {
		localStorage.removeItem("dailyData");
		dailyData = data;
		for (let x = 0; x < data.pieceMap.length; x++) {
			for (let y = 0; y < data.pieceMap[x].length; y++) {
				if (data.pieceMap[x][y] === 0) {
					data.pieceMap[x][y] = null;
				} else {
					const id: string = `${x}-${y}`;
					const obj = { id, color: data.palette[data.pieceMap[x][y] - 1] };
					data.pieceMap[x][y] = obj;
				}
			}
		}

		dailyData.moves = [];
		localStorage.setItem("dailyData", JSON.stringify(dailyData));
	};

	const fetchDailyData = () => {
		axios
			.get(apiBaseUrl + "/daily")
			.then((res) => {
				if (res.status === 200) {
					if (!isLocalDataValid(res.data)) {
						setDailyData(res.data);
						let userStatsString = localStorage.getItem("userStats");
						let userStats: any;
						if (userStatsString) {
							userStats = JSON.parse(userStatsString);
							userStats.dailyHistory = [];
							localStorage.setItem("userStats", JSON.stringify(userStats));
							let dailyHistory = JSON.parse(localStorage.getItem("userStats")).dailyHistory;
							if (dailyHistory.length === 0) {
								hasPlayedToday.set(false);
							}
							console.log("No user stats found");
						} else {
							hasPlayedToday.set(false);
						}
					} else {
						let userStatsString = localStorage.getItem("userStats");
						let userStats: any;
						if (userStatsString) {
							userStats = JSON.parse(userStatsString);
							userStats.dailyHistory = [];
							localStorage.setItem("userStats", JSON.stringify(userStats));
							let dailyHistory = JSON.parse(localStorage.getItem("userStats")).dailyHistory;
							if (dailyHistory.length === 0) {
								hasPlayedToday.set(false);
							}
							console.log("No user stats found");
						} else {
							hasPlayedToday.set(false);
						}
					}
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
		console.log(
			"   __ ____  _____  ______     _    \n  / //_/ / / / _ )/ __/ /    (_)__ \n / ,< / /_/ / _  / _// /___ / / _ \\\n/_/|_|\\____/____/___/____(_)_/\\___/"
		);

		const userCountry = localStorage.getItem("userCountry");
		if (userCountry) {
			hasCountry = true;
		}
		setTimeout(() => {
			fetchDailyData();
		}, 1000);
	});
</script>

<main id="app">
	<Header />
	{#if $showHelp}
		<Help />
	{/if}
	<div class="layout">
		{#if loadingState === "Loading"}
			<Loading />
		{:else if loadingState === "Loaded"}
			{#if !hasCountry || $changeCountry}
				<CountryPicker
					on:play={() => {
						hasCountry = true;
						changeCountry.set(false);
					}}
				/>
			{:else}
				<Game mapData={JSON.parse(localStorage.getItem("dailyData"))} />
				{#if $showDashBoard}
					<DashBoard />
				{/if}
			{/if}
		{:else if loadingState === "Error"}
			<Error />
		{/if}
	</div>
	<Background />
</main>

<style>
	.layout {
		gap: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		padding: 0 5vw;
		max-width: 100vw;
		padding-bottom: 50px;
		box-sizing: border-box;
		min-height: calc(100vh - 70px);
		min-height: calc(100svh - 70px);
	}
</style>
