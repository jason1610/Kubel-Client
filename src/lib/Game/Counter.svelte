<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import {
		moveCount,
		isMoving,
		hasWon,
		newWin,
		showDashBoard,
		selectedColor,
	} from "./GameStore";
	import confetti from "canvas-confetti";
	$: counterRef = null;

	function getReadableFontColor(hexColor) {
		// Convert the hex color to RGB
		const rgbColor = hexToRgb(hexColor);

		// Calculate the relative luminance of the color
		const luminance = (0.299 * rgbColor.r + 0.587 * rgbColor.g + 0.114 * rgbColor.b) / 255;

		// Return either black or white depending on the luminance
		return luminance > 0.5 ? "#000000" : "#FFFFFF";
	}

	function hexToRgb(hex) {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

		return result
			? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16),
			  }
			: null;
	}

	onMount(() => {
		const handleConfetti = () => {
			const rect = counterRef.getBoundingClientRect();
			const originXLeft = rect.left / window.innerWidth; // Set originXLeft to be the left edge of the counter
			const originYBottom = (rect.top + rect.height) / window.innerHeight; // Set originYBottom to be the bottom edge of the counter
			const originXRight = (rect.left + rect.width) / window.innerWidth; // Set originXRight to be the right edge of the counter

			confetti({
				particleCount: 50,
				spread: 70,
				startVelocity: 20,
				gravity: 0.5,
				scalar: 0.75,
				zIndex: -1,
				angle: 135,
				origin: { x: originXLeft, y: originYBottom }, // Set origin to bottom left corner
			});
			confetti({
				particleCount: 50,
				spread: 70,
				startVelocity: 20,
				gravity: 0.5,
				scalar: 0.75,
				zIndex: -1,
				angle: 45,
				origin: { x: originXRight, y: originYBottom }, // Set origin to bottom right corner
			});
		};

		const unsubscribe = hasWon.subscribe((value) => {
			if (value) {
				if ($newWin) {
					handleConfetti();
					setTimeout(() => {
						newWin.set(false);
						showDashBoard.set(true);
					}, 1500);
				} else {
					showDashBoard.set(true);
				}
			}
		});
		return () => {
			unsubscribe();
		};
	});

	onDestroy(() => {
		confetti.reset();
	});
</script>

<div
	bind:this={counterRef}
	class="counter {$newWin && $hasWon ? 'new-win' : ''} {$hasWon ? 'win' : ''} {$isMoving
		? 'moving'
		: ''}"
	style={$selectedColor !== null ? `background: ${$selectedColor};` : ""}
>
	<p style={$selectedColor !== null ? `color: ${getReadableFontColor($selectedColor)}` : ""}>
		{$isMoving ? $moveCount + 1 : $moveCount}
	</p>
</div>

<style>
	.counter {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: rgb(240, 236, 236);
		/* background: linear-gradient(to bottom, rgb(255, 255, 255), rgb(205, 194, 194)); */
		min-width: 50px;
		height: 50px;
		border-radius: 20px;
		margin-bottom: 50px;
		padding: 10px;
		transition: background 0.2s ease-out;
	}
	.win {
		background: rgb(236, 203, 54);
		background: linear-gradient(to bottom, rgb(255, 218, 106), rgb(246, 219, 18));
	}
	.new-win {
		animation: win 0.5s ease;
	}
	.counter.moving p {
		color: grey;
		font-size: 30px;
	}

	@keyframes win {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
		}
	}

	.counter p {
		font-size: 45px;
		font-weight: 700;
		color: rgb(41, 43, 38);
		text-align: center;
		font-family: "Jura", sans-serif;
		transition: color 0.2s ease-out, font-size 0.2s ease;
	}
</style>
