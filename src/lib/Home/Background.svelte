<script lang="ts">
	import { onMount } from "svelte";
	import { createNoise3D } from "simplex-noise";
	import { palette, completedColors } from "../Game/GameStore";
	const noise3D = createNoise3D();

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
	const blur = 5;
	const brightness = 0.6;
	const noiseDensity = 50;
	const colorChangeRate = 0.05;
	const paleteChangeRate = 0.01;
	const animationSpeed = 0.0005;
	const defaultPalette: number[][] = [
		[5, 5, 5],
		[55, 55, 55],
		[5, 5, 5],
		[50, 50, 50],
		[15, 15, 15],
		[15, 15, 15],
	];
	let targetPalette: number[][] = [...defaultPalette.map((color) => [...color])];
	let currentPalette: number[][] = [...defaultPalette.map((color) => [...color])];

	const hexToRgb = (hex) => {
		let r = parseInt(hex.substring(1, 3), 16);
		let g = parseInt(hex.substring(3, 5), 16);
		let b = parseInt(hex.substring(5, 7), 16);
		return [r, g, b];
	};

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

	const lerpCurrentPalette = () => {
		for (let i = 0; i < targetPalette.length; i++) {
			for (let j = 0; j < targetPalette[i].length; j++) {
				currentPalette[i][j] =
					currentPalette[i][j] +
					(targetPalette[i][j] - currentPalette[i][j]) * paleteChangeRate;
			}
		}
	};
	const getTargetColor = (noiseValue: number) => {
		const index = Math.floor(((noiseValue + 1) / 2) * currentPalette.length);
		const clampedIndex = Math.min(index, currentPalette.length - 1);
		const targetColor = currentPalette[clampedIndex];
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
					return color + (targetColor[i] - color) * colorChangeRate;
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
		lerpCurrentPalette();
		requestAnimationFrame(animate);
	};

	onMount(() => {
		ctx = canvas.getContext("2d");
		updateCanvasSize();
		animate();
		window.addEventListener("resize", updateCanvasSize);
		completedColors.subscribe(() => {
			if ($palette && $completedColors) {
				targetPalette = $palette.map((color) => hexToRgb(color));
				for (let i = 0; i < targetPalette.length; i++) {
					if (!$completedColors[i]) {
						targetPalette[i] = defaultPalette[i];
					}
				}
				currentPalette = currentPalette.slice(0, targetPalette.length);
			} else {
				targetPalette = [...defaultPalette.map((color) => [...color])];
			}
		});
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
		animation: background-spawn 4s ease;
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
