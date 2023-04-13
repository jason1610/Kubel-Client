<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { restart } from "../Game/GameStore";
	import { Chart, registerables } from "chart.js";
	Chart.register(...registerables);

	const userStats = JSON.parse(localStorage.getItem("userStats"));
	let chartRef: HTMLCanvasElement;
	let chart: Chart;

	const getGradient = (ctx, chartArea) => {
		let width, height, gradient;
		const chartWidth = chartArea.right - chartArea.left;
		const chartHeight = chartArea.bottom - chartArea.top;
		if (!gradient || width !== chartWidth || height !== chartHeight) {
			width = chartWidth;
			height = chartHeight;
			gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
			gradient.addColorStop(0, "#57ff54");
			gradient.addColorStop(0.5, "#f7ff54");
			gradient.addColorStop(1, "#d60626");
		}

		return gradient;
	};

	let chartData: any = {
		labels: userStats.scoreHistory.map((_, index) => index),
		datasets: [
			{
				type: "line",
				data: userStats.scoreHistory,
				fill: false,
				tension: 0.5,
				backgroundColor: "rgba(255, 255, 255, 0.2)",
				borderColor: function (context) {
					const chart = context.chart;
					const { ctx, chartArea } = chart;

					if (!chartArea) {
						// This case happens on initial chart load
						return;
					}
					return getGradient(ctx, chartArea);
				},
			},
		],
	};

	const chartOptions: any = {
		responsive: true,
		maintainAspectRatio: false,
		interaction: {
			intersect: false,
			mode: "nearest",
			includeInivisible: false,
		},
		layout: {
			padding: {
				top: 20,
				bottom: 10,
				left: 5,
				right: 15,
			},
		},
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				displayColors: false,
				xAlign: "center",
				titleMarginBottom: 0,
				margin: 10,
				yAlign: "bottom",
				titleAlign: "center",
				lineHeight: -5,
				backgroundColor: "white",
				titleColor: "black",
				titleFont: {
					weight: "bold",
				},
				callbacks: {
					title: (context) => {
						return `${context[0].raw}`;
					},
					label: (context) => {
						return "";
					},
				},
			},
		},
		scales: {
			x: {
				grid: {
					display: false,
				},
				border: {
					display: false,
				},
				ticks: {
					display: false,
				},
			},
			y: {
				grid: {
					display: false,
				},
				border: {
					display: false,
				},
				beginAtZero: false,
				ticks: {
					autoSkip: false,
					maxTicksLimit: 5,
					maxRotation: 0,
					color: "rgba(255, 255, 255, 0.75)",
					font: {
						size: 15,
						family: "sans-serif",
						weight: "bold",
					},
				},
			},
		},
	};

	onMount(() => {
		chart = new Chart(chartRef.getContext("2d"), {
			type: "line",
			data: chartData,
			options: chartOptions,
		});
	});

	onDestroy(() => {
		chart.destroy();
	});
</script>

<div class="card">
	<canvas bind:this={chartRef} />
</div>

<style>
	.card {
		background: var(--card-background-flat);
		background: var(--card-background-gradient);
		border-radius: var(--card-border-radius);
		box-shadow: var(--card-shadow);
	}
</style>
