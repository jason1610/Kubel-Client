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

	onMount(() => {
		console.log(counterRef);
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
	class="counter {$newWin && $hasWon ? 'new-win' : ''} {$hasWon ? 'win' : ''}"
	style={$selectedColor !== null
		? `box-shadow: 0 0 25px 0 ${$selectedColor}; border-radius: 50%`
		: ""}
>
	<p>{$moveCount}</p>
</div>

<style>
	.counter {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: rgb(240, 236, 236);
		background: linear-gradient(to bottom, rgb(255, 255, 255), rgb(205, 194, 194));
		min-width: 75px;
		height: 75px;
		border-radius: 20px;
		margin-bottom: 50px;
		padding: 10px;
		transition: box-shadow 0.5s ease, border-radius 0.2s ease-out;
	}
	.win {
		background: rgb(236, 203, 54);
		background: linear-gradient(to bottom, rgb(255, 218, 106), rgb(246, 219, 18));
	}
	.new-win {
		animation: win 0.5s ease;
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
		font-size: 56px;
		font-weight: 700;
		color: rgb(41, 43, 38);
		text-align: center;
		font-family: "Jura", sans-serif;
	}
</style>
