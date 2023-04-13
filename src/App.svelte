<script lang="ts">
	import axios from "axios";
	import dayjs from "dayjs";
	import { onMount } from "svelte";
	import utc from "dayjs/plugin/utc";
	import timezone from "dayjs/plugin/timezone";

	dayjs.extend(utc);
	dayjs.extend(timezone);

	import Error from "./lib/Error.svelte";
	import Header from "./lib/Header.svelte";
	import Game from "./lib/Game/Game.svelte";
	import Loading from "./lib/Loading.svelte";
	import { hasWon } from "./lib/Game/GameStore";
	import Background from "./lib/Background.svelte";

	const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
	let loadingState: String = "Loading";
	const version: number = 1;

	import type { MapData } from "./lib/Interfaces";
	import Statistics from "./lib/Statistics.svelte";
	let dailyData: MapData;

	const setDailyData = (data: any) => {
		dailyData = data;
		for (let x = 0; x < dailyData.pieceMap.length; x++) {
			for (let y = 0; y < dailyData.pieceMap[x].length; y++) {
				if (data.pieceMap[x][y] === 0) {
					dailyData.pieceMap[x][y] = null;
				} else {
					const id: string = `${x}-${y}`;
					const obj = { id, color: dailyData.palette[data.pieceMap[x][y] - 1] };
					dailyData.pieceMap[x][y] = obj;
				}
			}
		}
		dailyData.moves = [];
		localStorage.setItem("dailyData", JSON.stringify(dailyData));
	};

	const fetchDailyData = () => {
		let data: any = localStorage.getItem("dailyData");
		if (data) {
			data = JSON.parse(data);
			const currentDate: String = dayjs().tz("Etc/GMT-2").format("YYYYMMDD");
			if (data.version && data.version === version && data.seed === currentDate) {
				dailyData = data;
				loadingState = "Loaded";
				return;
			} else {
				localStorage.removeItem("dailyData");
			}
		}
		axios
			.get(apiBaseUrl + "/daily")
			.then((res) => {
				if (res.status === 200) {
					setDailyData(res.data);
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
		setTimeout(() => {
			fetchDailyData();
		}, 1000);
	});
</script>

<main id="app">
	<Header />
	<div class="layout">
		{#if loadingState === "Loading"}
			<Loading />
		{:else if loadingState === "Loaded"}
			<Game mapData={dailyData} />
			{#if $hasWon}
				<Statistics />
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
		min-height: 80vh;
		min-height: 80lvh;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
