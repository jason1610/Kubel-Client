<script lang="ts">
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";

	let messageVisible = false;
	const dailyData = JSON.parse(localStorage.getItem("dailyData"));
	const pieceMap = dailyData.pieceMap;
	const palette = dailyData.palette;
	const emojis = [
		{ char: "🟥", hex: "#FF0000" }, // Red
		{ char: "🟧", hex: "#FFA500" }, // Orange
		{ char: "🟨", hex: "#FFFF00" }, // Yellow
		{ char: "🟩", hex: "#008000" }, // Green
		{ char: "🟦", hex: "#0000FF" }, // Blue
		{ char: "🟪", hex: "#800080" }, // Purple
		{ char: "🟫", hex: "#A52A2A" }, // Brown
		// { char: "⬛", hex: "#000000" }, // Black
		{ char: "⬜", hex: "#FFFFFF" }, // White
	];
	const empty = "⬛";
	const randomEmoji = [
		"😎",
		"😎",
		"😎",
		"😎",
		"😎",
		"😁",
		"😁",
		"😁",
		"😃",
		"😃",
		"😃",
		"🌟",
		"🌟",
		"🌟",
		"🌟",
		"✨",
		"✨",
		"✨",
		"⚡",
		"⚡",
		"⚡",
		"⚡",
		"⚡",
		"⚡",
		"🦍",
		"🦧",
	];

	function hexToRgb(hex) {
		const bigint = parseInt(hex.slice(1), 16);
		const r = (bigint >> 16) & 255;
		const g = (bigint >> 8) & 255;
		const b = bigint & 255;
		return [r, g, b];
	}

	function showMessage() {
		const message = document.createElement("div");
		message.classList.add("bubble-message");
		message.textContent = "Copied to clipboard!";
		document.body.appendChild(message);
		setTimeout(() => {
			message.remove();
		}, 3000); // Adjust the duration as needed (currently 3 seconds)
	}

	function colorDistance(color1, color2) {
		const [r1, g1, b1] = color1;
		const [r2, g2, b2] = color2;

		return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
	}

	function findClosestEmoji(color) {
		let minDistance = Infinity;
		let closestEmoji = null;

		for (const emoji of emojis) {
			const distance = colorDistance(hexToRgb(color), hexToRgb(emoji.hex));

			if (distance < minDistance) {
				minDistance = distance;
				closestEmoji = emoji;
			}
		}
		return closestEmoji;
	}

	function mapPaletteToEmojis(palette) {
		const emojiMap = [];
		for (const color of palette) {
			const closestEmoji = findClosestEmoji(color);
			emojiMap.push(closestEmoji.char);
			emojis.splice(emojis.indexOf(closestEmoji), 1);
		}

		return emojiMap;
	}

	let shareText: string =
		"Solved in " +
		dailyData.moves.length +
		" moves " +
		randomEmoji[Math.floor(Math.random() * randomEmoji.length)];
	let shareMap: string[] = [];

	onMount(() => {
		const mappedEmojis = mapPaletteToEmojis(palette);
		for (let y = 0; y < pieceMap.length; y++) {
			let row = "";
			for (let x = 0; x < pieceMap[y].length; x++) {
				let emoji = "";
				if (pieceMap[x][y]) {
					emoji = mappedEmojis[palette.indexOf(pieceMap[x][y].color)];
				} else {
					emoji = empty;
				}
				row += emoji;
			}
			shareMap = [...shareMap, row];
		}
	});
</script>

<button
	on:click={() => {
		navigator.clipboard.writeText(`${shareText}\n${shareMap.flat().join("\n")}`);
		showMessage();
	}}>Copy & Share</button
>

<style>
	.card {
		grid-column: 1;
		grid-row: 3 / span 2;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 10px;
	}

	.board {
		height: 100%;
		width: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		/* justify-content: center; */
		align-items: center;
		/* --webkit-mask-image: radial-gradient(rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0) 100%);
		mask-image: radial-gradient(rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0) 100%); */
	}

	:global(.bubble-message) {
		position: fixed;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		background-color: #319dff;
		color: #fff;
		padding: 10px 20px;
		border-radius: 4px;
		box-sizing: border-box;
		font-size: 14px;
		z-index: 1000;
		opacity: 0;
		animation: spawn 3s ease-in-out;
	}

	@keyframes spawn {
		0% {
			transform: translate(-50%, 50px);
			opacity: 0;
		}
		10% {
			transform: translate(-50%, 0);

			opacity: 1;
		}
		75% {
			transform: translate(-50%, 0);
			opacity: 1;
		}
		100% {
			transform: translate(-50%, 0);
			opacity: 0;
		}
	}

	button {
		grid-column: 1;
		grid-row: 4;
		width: 100%;
		padding: 10px 0;
		font-size: 12px;
		border: 0;
		border-radius: 10px;
		/* outline: 2px solid #319dff; */
		box-shadow: 0 0 0 2px #319dff;
		color: #319dff;
		cursor: pointer;
		background-color: #319bff18;
		transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out, transform 0.05s ease;
	}

	button:hover {
		background-color: #319dff;
		color: white;
	}
	button:active {
		transform: scale(0.9);
		/* color: #319dff; */
		/* outline: 2px solid #ffffff; */
		/* background-color: #ffffff; */
	}
	p {
		text-align: center;
		font-size: 0.65rem;
		white-space: nowrap;
	}

	@media (max-width: 1500px) {
		button {
			grid-column: 2;
			grid-row: 6;
		}
	}
	@media (max-width: 700px) {
		button {
			grid-column: 1;
			grid-row: 8;
		}
	}
</style>
