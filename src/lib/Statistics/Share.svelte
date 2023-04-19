<script lang="ts">
	import { onMount } from "svelte";

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
		{ char: "⬛", hex: "#000000" }, // Black
		{ char: "⬜", hex: "#FFFFFF" }, // White
	];
	const empty = "⚫";

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

	const copyTextToClipboard = () => {};

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
	on:click={() => navigator.clipboard.writeText(`${shareText}\n${shareMap.flat().join("\n")}`)}
	>Copy & Share</button
>

<!-- <div class="card">
	<div class="board">
		{#each shareMap as line}
			<p>{line}</p>
		{/each}
	</div>
</div> -->

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

	button {
		grid-column: 1;
		grid-row: 4;
		width: 100%;
		padding: 10px 0;
		font-size: 12px;
		border: 0;
		border-radius: 10px;
		outline: 2px solid #319dff;
		color: #319dff;
		cursor: pointer;
		transition: background-color, color 0.2s ease-in-out, transform 0.05s ease;
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
</style>
