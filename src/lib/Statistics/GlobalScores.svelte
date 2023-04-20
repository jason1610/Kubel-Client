<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { Chart, registerables } from "chart.js";
	Chart.register(...registerables);

	export let globalScores: any = null;

	let chartRef: HTMLCanvasElement;
	let chart: Chart;

	const myScore = JSON.parse(localStorage.getItem("dailyData")).moves.length;

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
		labels: globalScores.map((_, index) => index),
		datasets: [
			{
				type: "bar",
				data: globalScores,
				fill: false,
				tension: 0.5,
				backgroundColor: (context) => {
					return context.index === myScore ? "#f1d324" : "rgba(255, 255, 255, 0.75)";
				},
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
	let delayed;
	const chartOptions: any = {
		responsive: true,
		maintainAspectRatio: false,
		interaction: {
			intersect: false,
			mode: "nearest",
			includeInivisible: false,
		},
		animation: {
			onComplete: () => {
				delayed = true;
			},
			delay: (context) => {
				let delay = 0;
				if (context.type === "data" && context.mode === "default" && !delayed) {
					delay = context.dataIndex * 10 + context.datasetIndex * 100;
				}
				return delay;
			},
		},
		layout: {
			padding: {
				top: 45,
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
				backgroundColor: "#586A84",
				titleColor: "white",
				titleFont: {
					weight: "bold",
				},
				callbacks: {
					title: (context) => {
						return `Score: ${context[0].label}`;
					},
					afterTitle: (context) => {
						return `People: ${context[0].raw}`;
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
					precision: 0,
					maxTicksLimit: 5,
					maxRotation: 0,
					color: "rgba(255, 255, 255, 0.25)",
					font: {
						size: 12,
						// family: "Inter",
						// weight: "bold",
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
	<h2>Global Scores</h2>
	<div class="container">
		<canvas bind:this={chartRef} />
	</div>
</div>

<style>
	.card {
		grid-row: 5 / span 2;
		grid-column: 1 / span 4;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.card h2 {
		position: absolute;
	}
	.container {
		z-index: 1;
		height: 100%;
		width: 100%;
		overflow: hidden;
	}
	canvas {
		width: 100%;
		height: 100%;
	}
</style>
