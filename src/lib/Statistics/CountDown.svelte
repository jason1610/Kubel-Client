<script lang="ts">
	import dayjs from "dayjs";
	import { onMount, onDestroy } from "svelte";

	function hoursRemainingUntilMidnightGMT2(): number {
		const now = dayjs().utc();
		const nowGMT2 = now.tz("Europe/Paris");
		const midnightGMT2 = nowGMT2.clone().endOf("day");
		const diffInSeconds = midnightGMT2.diff(nowGMT2, "second");

		return Math.floor(diffInSeconds / 3600);
	}

	function minutesRemainingUntilMidnightGMT2(): number {
		const now = dayjs().utc();
		const nowGMT2 = now.tz("Europe/Paris");
		const midnightGMT2 = nowGMT2.clone().endOf("day");
		const diffInSeconds = midnightGMT2.diff(nowGMT2, "second");

		return Math.floor((diffInSeconds % 3600) / 60);
	}

	function secondsRemainingUntilMidnightGMT2(): number {
		const now = dayjs().utc();
		const nowGMT2 = now.tz("Europe/Paris");
		const midnightGMT2 = nowGMT2.clone().endOf("day");
		const diffInSeconds = midnightGMT2.diff(nowGMT2, "second");

		return diffInSeconds % 60;
	}

	let hoursRemaining = hoursRemainingUntilMidnightGMT2();
	let minutesRemaining = minutesRemainingUntilMidnightGMT2();
	let secondsRemaining = secondsRemainingUntilMidnightGMT2();

	let interval: number;

	onMount(() => {
		interval = setInterval(() => {
			hoursRemaining = hoursRemainingUntilMidnightGMT2();
			minutesRemaining = minutesRemainingUntilMidnightGMT2();
			secondsRemaining = secondsRemainingUntilMidnightGMT2();
		}, 1000);
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div class="card">
	<h2>
		{hoursRemaining}<span>h</span>
		{minutesRemaining}<span>m</span>
		{secondsRemaining}<span>s</span>
	</h2>
</div>

<style>
	.card {
		grid-column: 5;
		grid-row: 6;
		display: flex;
		padding: 0;
		justify-content: center;
		align-items: center;
		background: none;
		border: 5px solid rgba(255, 255, 255, 0.04);
		border-radius: 100px;
		padding: 10px 0;
	}

	h2 {
		text-align: center;
		/* font-size: 0.9rem; */
	}

	h2 span {
		text-transform: lowercase;
		font-size: 0.7rem;
		color: rgba(255, 255, 255, 0.8);
	}
</style>
