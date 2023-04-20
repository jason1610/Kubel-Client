<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { restart } from "../Game/GameStore";
	import { Chart, registerables } from "chart.js";
	Chart.register(...registerables);

	const userStats = JSON.parse(localStorage.getItem("userStats"));
	let chartRef: HTMLCanvasElement;
	let chart: Chart;

	const dataLineGradient = (ctx, chartArea) => {
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

	const dataFillGradient = (ctx, chartArea) => {
		let width, height, gradient;
		const chartWidth = chartArea.right - chartArea.left;
		const chartHeight = chartArea.bottom - chartArea.top;
		if (!gradient || width !== chartWidth || height !== chartHeight) {
			width = chartWidth;
			height = chartHeight;
			gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
			gradient.addColorStop(0, "rgba(87, 255, 84, 0)");
			gradient.addColorStop(0.5, "rgba(247, 255, 84, 0.25)");
			gradient.addColorStop(1, "rgba(214, 6, 38, 0.5)");
		}
		return gradient;
	};

	const axisLineGradient = (ctx, chartArea) => {
		const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
		gradient.addColorStop(0, "rgba(59, 71, 88, 0.2)");
		gradient.addColorStop(0.5, "rgba(59, 71, 88, 0.5)");
		gradient.addColorStop(1, "rgba(59, 71, 88, 0.2)");
		return gradient;
	};

	let chartData: any = {
		labels: userStats.scoreHistory.map((_, index) => index),
		datasets: [
			{
				type: "line",
				data: userStats.scoreHistory,
				fill: {
					target: "origin",
					above: function (context) {
						const chart = context.chart;
						const { ctx, chartArea } = chart;

						if (!chartArea) {
							// This case happens on initial chart load
							return;
						}

						return dataFillGradient(ctx, chartArea);
					},
				},
				tension: 0.5,
				backgroundColor: "rgba(255, 255, 255, 0.2)",
				borderColor: function (context) {
					const chart = context.chart;
					const { ctx, chartArea } = chart;

					if (!chartArea) {
						// This case happens on initial chart load
						return;
					}
					return dataLineGradient(ctx, chartArea);
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
					color: function (context) {
						const chart = context.chart;
						const { ctx, chartArea } = chart;

						if (!chartArea) {
							// This case happens on initial chart load
							return;
						}
						return axisLineGradient(ctx, chartArea);
					},
					lineWidth: 1.5,
				},
				border: {
					display: false,
				},
				beginAtZero: false,
				ticks: {
					autoSkip: false,
					maxTicksLimit: 5,
					precision: 0,
					maxRotation: 0,
					color: "#3B4758",
					font: {
						size: 12,
						// family: "JURA",
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
	<h2>My Stats</h2>
	<div class="container">
		<canvas bind:this={chartRef} />
	</div>
</div>

<style>
	.card {
		grid-column: 2 / span 3;
		grid-row: 2 / span 3;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.card h2 {
		position: absolute;
	}

	.container {
		overflow: hidden;
		width: 100%;
		height: 100%;
	}
	canvas {
		width: 100%;
		height: 100%;
	}
</style>
