<script lang="ts">
	import { onMount } from "svelte";
	import axios from "axios";

	import dayjs from "dayjs";
	import utc from "dayjs/plugin/utc";
	import timezone from "dayjs/plugin/timezone";
	dayjs.extend(utc);
	dayjs.extend(timezone);

	import Background from "./lib/Background.svelte";
	import Header from "./lib/Header.svelte";
	import Error from "./lib/Error.svelte";
	import Loading from "./lib/Loading.svelte";
	import Game from "./lib/Game/Game.svelte";

	let loadingState: String = "Loading";
	const version: number = 1;

	import type { DailyData, ProgressData } from "./lib/Interfaces";
	let dailyData: DailyData;
	let progressData: ProgressData;

	const progressDataTemplate: ProgressData = {
		version: version,
		seed: dayjs().tz("Etc/GMT-2").format("YYYYMMDD"),
		moves: [{ offset: { x: 0, y: 0 }, position: { x: 0, y: 0 } }],
		idMap: [[{ x: 0, y: 0 }]],
		hasWon: false,
	};

	const fetchProgressData = () => {
		let data: any = localStorage.getItem("progressData");
		if (data) {
			data = JSON.parse(data);
			const currentDate: String = dayjs().tz("Etc/GMT-2").format("YYYYMMDD");
			if (data.version && data.version === version && data.seed === currentDate) {
				progressData = data;
				return;
			}
		}
		progressData = progressDataTemplate;
		localStorage.setItem("progressData", JSON.stringify(progressDataTemplate));
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
			.get("http://127.0.0.1:3000/daily")
			.then((res) => {
				if (res.status === 200) {
					dailyData = res.data;
					localStorage.setItem("dailyData", JSON.stringify(res.data));
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
			fetchProgressData();
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
			<Game {dailyData} {progressData} />
		{:else if loadingState === "Error"}
			<Error />
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
</style>
