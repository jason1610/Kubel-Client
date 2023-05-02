<script lang="ts">
	import { onMount } from "svelte";
	import { createNoise3D } from "simplex-noise";
	import { palette, completedColors } from "../Game/GameStore";
	const noise3D = createNoise3D();

	let isSafari: boolean = false;
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
	let lastFrameTime = 0;
	let nextFrameTime = 0;
	const brightness = 0.6;
	const noiseDensity = 50;
	const colorChangeRate = 0.2;
	const paleteChangeRate = 0.015;
	const animationSpeed = 0.0015;
	const frameRate = 1000 / 24;
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

		let currentColor = [0, 0, 0];
		let newColor = [0, 0, 0];

		const xDividedByNoiseDensity = new Array(miniWidth);
		const yDividedByNoiseDensity = new Array(miniHeight);

		for (let x = 0; x < miniWidth; x++) {
			xDividedByNoiseDensity[x] = x / noiseDensity;
		}

		for (let y = 0; y < miniHeight; y++) {
			yDividedByNoiseDensity[y] = y / noiseDensity;
		}

		for (let x = 0; x < miniWidth; x++) {
			for (let y = 0; y < miniHeight; y++) {
				const index = (x + y * miniWidth) * 4;

				if (prevImageData) {
					currentColor[0] = prevImageData[index];
					currentColor[1] = prevImageData[index + 1];
					currentColor[2] = prevImageData[index + 2];
				} else {
					currentColor[0] = 0;
					currentColor[1] = 0;
					currentColor[2] = 0;
				}

				const noiseValue = noise3D(xDividedByNoiseDensity[x], yDividedByNoiseDensity[y], time);
				const targetColor = getTargetColor(noiseValue);

				for (let i = 0; i < 3; i++) {
					newColor[i] = currentColor[i] + (targetColor[i] - currentColor[i]) * colorChangeRate;
				}

				data[index] = newColor[0];
				data[index + 1] = newColor[1];
				data[index + 2] = newColor[2];
				data[index + 3] = 255;
			}
		}

		prevImageData = data;
		time += animationSpeed;
		miniCtx.putImageData(imageData, 0, 0);
		ctx.drawImage(miniCanvas, 0, 0, miniWidth, miniHeight, 0, 0, canvasWidth, canvasHeight);
		ctx.filter = `blur(${blur}px) brightness(${brightness})`;
	};

	const animate = (currentTime) => {
		if (currentTime >= nextFrameTime) {
			drawNoise();
			lerpCurrentPalette();
			lastFrameTime = currentTime;
			nextFrameTime = currentTime + frameRate;
		}
		requestAnimationFrame(animate);
	};

	onMount(() => {
		const userAgent = window.navigator.userAgent.toLowerCase();
		if (userAgent.indexOf("safari") !== -1 && userAgent.indexOf("chrome") === -1) {
			isSafari = true;
		}
		ctx = canvas.getContext("2d");
		updateCanvasSize();
		requestAnimationFrame(animate);
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

<div class="container" style={isSafari ? "filter: blur(20px)" : ""}>
	<canvas bind:this={canvas} width={canvasWidth} height={canvasHeight} />
</div>

<style>
	.container {
		/* z-index: -1; */
		/* background-color: #090909; */
		/* position: fixed;
		height: 100vh;
		height: 100lvh;
		width: 100vw; */
		/* opacity: 1; */
		/* overflow: hidden; */
		/* position: fixed; */
		/* -webkit-transform: translate3d(0, 0, 0); */
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		height: 100lvh;
		overflow: hidden;
		background-color: rgb(0, 0, 0);
		z-index: -1;
	}
	canvas {
		position: absolute;
		z-index: -1;
		top: -125px;
		left: -125px;
		height: calc(100vh + 250px);
		height: calc(100lvh + 250px);
		width: calc(100vw + 250px);
		animation: background-spawn 4s ease forwards;
		/* animation: background-spawn 4s ease forwards;
		position: fixed;
		-webkit-transform: translateZ(1px);
		-moz-transform: translateZ(1px);
		-o-transform: translateZ(1px);
		transform: translateZ(1px);
		z-index: 10;
		overflow: hidden; */
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
