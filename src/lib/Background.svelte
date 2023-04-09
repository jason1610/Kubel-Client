<script lang="ts">
	import { onMount } from "svelte";
	import { createNoise3D } from "simplex-noise";

	let miniCanvas: HTMLCanvasElement = document.createElement("canvas");
	const miniCtx: CanvasRenderingContext2D = miniCanvas.getContext("2d");
	const miniSize: number = 50;
	let miniWidth: number;
	let miniHeight: number;

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	const canvasSize: number = 200;
	let canvasWidth: number;
	let canvasHeight: number;
	let prevImageData: Uint8ClampedArray;

	let time = 0;
	const noise3D = createNoise3D();
	const noiseDensity = 50;
	const animationSpeed = 0.0005;
	const blur = 5;
	const brightness = 0.6;
	const colorChangeRate = 0.05;
	const pixelChangeRate = 0.5;
	const defaultPalette: number[][] = [
		[25, 25, 25],
		[50, 50, 50],
		[5, 5, 5],
		[55, 55, 55],
		[15, 15, 15],
		[15, 15, 15],
	];
	let mapPalette: number[][];
	let palette: number[][] = defaultPalette;

	const updateCanvasSize = () => {
		const screenWidth: number = window.innerWidth;
		const screenHeight: number = window.innerHeight;
		const aspectRatio: number = screenWidth / screenHeight;

		if (aspectRatio >= 1) {
			miniWidth = miniSize;
			miniHeight = Math.floor(miniSize / aspectRatio);
			canvasWidth = canvasSize;
			canvasHeight = Math.floor(canvasSize / aspectRatio);
		} else {
			miniWidth = miniSize;
			miniHeight = miniSize;
			canvasWidth = Math.floor(canvasSize * aspectRatio);
			canvasHeight = canvasSize;
		}
	};

	const getTargetColor = (noiseValue: number) => {
		const index = Math.floor(((noiseValue + 1) / 2) * (palette.length - 1));
		const targetColor = palette[index];
		return targetColor;
	};

	const drawNoise = () => {
		const imageData = miniCtx.createImageData(miniWidth, miniHeight);
		const data = imageData.data;

		for (let x = 0; x < miniWidth; x++) {
			for (let y = 0; y < miniHeight; y++) {
				const index = (x + y * miniWidth) * 4;
				const currentColor = prevImageData // Use the previous frame's colors as the currentColor
					? [prevImageData[index], prevImageData[index + 1], prevImageData[index + 2]]
					: [0, 0, 0]; // If there's no previous frame, use black as the initial color
				const noiseValue = noise3D(x / noiseDensity, y / noiseDensity, time);
				const targetColor = getTargetColor(noiseValue);

				const newColor = currentColor.map((color, i) => {
					const diff = targetColor[i] - color;
					const change = diff * colorChangeRate;
					return color + change;
				});

				data[index] = newColor[0]; // Red
				data[index + 1] = newColor[1]; // Green
				data[index + 2] = newColor[2]; // Blue
				data[index + 3] = 255; // Alpha
			}
		}
		prevImageData = data;
		time += animationSpeed;
		miniCtx.putImageData(imageData, 0, 0);
		ctx.drawImage(miniCanvas, 0, 0, miniWidth, miniHeight, 0, 0, canvasWidth, canvasHeight);
		ctx.filter = `blur(${blur}px) brightness(${brightness})`;
	};

	const animate = () => {
		drawNoise();
		requestAnimationFrame(animate);
	};

	onMount(() => {
		ctx = canvas.getContext("2d");
		updateCanvasSize();
		animate();
		window.addEventListener("resize", updateCanvasSize);
	});
</script>

<canvas bind:this={canvas} width={canvasWidth} height={canvasHeight} />

<style>
	canvas {
		z-index: -100;
		position: fixed;
		top: -125px;
		left: -125px;
		display: block;
		background-color: red;
		height: calc(100vh + 250px);
		height: calc(100lvh + 250px);
		width: calc(100vw + 250px);
		animation: background-spawn 2s ease;
	}
	@keyframes background-spawn {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>
