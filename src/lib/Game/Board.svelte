<script lang="ts">
	import type { MapData, Vector } from "../Interfaces";
	export let mapData: MapData;

	import { onMount } from "svelte";
	import { moveCount, isMoving, hasWon } from "./GameStore";
	import * as PIXI from "pixi.js";
	let app: PIXI.Application;
	let canvas: HTMLCanvasElement;

	const canvasSize = 700;
	const gap: number = 20;
	const borderRadius: number = 30;
	let gridSize: number = mapData.pieceMap.length;
	const cellSize: number = canvasSize / gridSize;
	const pieceSize: number = (canvasSize - gap * (gridSize + 1)) / gridSize;

	let isDragging = false;
	let allowInput: boolean = false;
	let offset: Vector = { x: 0, y: 0 };
	let pieceMap: any = mapData.pieceMap;
	let dragStart: Vector = { x: 0, y: 0 };
	let lockedAxis: "x" | "y" | null = null;
	let lastOffset: Vector = { x: 0, y: 0 };
	let selectedPiece: Vector = { x: 0, y: 0 };

	const getDisplayedCellSize = () => {
		const currentCanvasWidth = canvas.clientWidth;
		const currentCanvasHeight = canvas.clientHeight;
		const scaleX = currentCanvasWidth / app.view.width;
		const scaleY = currentCanvasHeight / app.view.height;
		const scale = (scaleX + scaleY) / 2;
		const displayedCellSize = cellSize * scale;
		return displayedCellSize;
	};

	const worldToGrid = (pos: any) => {
		const displayedCellSize = getDisplayedCellSize();
		const canvasBounds = canvas.getBoundingClientRect();
		const canvasOffsetX = canvasBounds.left;
		const canvasOffsetY = canvasBounds.top;
		const pixelX = pos.x * displayedCellSize + canvasOffsetX;
		const pixelY = pos.y * displayedCellSize + canvasOffsetY;
		return { x: pixelX, y: pixelY };
	};

	const calculateNewPiecePosition = (x: number, y: number) => {
		let newPosition = { x, y };
		let count: number = !offset.x ? Math.abs(offset.y) : Math.abs(offset.x);
		const direction = {
			x: Math.sign(offset.x),
			y: Math.sign(offset.y),
		};
		while (count > 0) {
			newPosition.x += direction.x;
			newPosition.y += direction.y;
			if (newPosition.x < 0) {
				newPosition.x = pieceMap.length - 1;
			}
			if (newPosition.x >= pieceMap.length) {
				newPosition.x = 0;
			}
			if (newPosition.y < 0) {
				newPosition.y = pieceMap[0].length - 1;
			}
			if (newPosition.y >= pieceMap[0].length) {
				newPosition.y = 0;
			}
			if (pieceMap[newPosition.x][newPosition.y] !== null) {
				count--;
			}
		}
		return newPosition;
	};

	const calculateNewPieceMap = () => {
		const newPieceMap = pieceMap.map((row: any[]) => [...row]);
		for (let x = 0; x < gridSize; x++) {
			for (let y = 0; y < gridSize; y++) {
				if (
					pieceMap[x][y] === null ||
					(lockedAxis === "x" && y !== selectedPiece.y) ||
					(lockedAxis === "y" && x !== selectedPiece.x)
				)
					continue;

				let newPos: Vector = calculateNewPiecePosition(x, y);
				newPieceMap[newPos.x][newPos.y] = pieceMap[x][y];
			}
		}
		return newPieceMap;
	};

	const animate = () => {
		const newPieceMap = calculateNewPieceMap();
		lastOffset = offset;
		for (let x = 0; x < gridSize; x++) {
			for (let y = 0; y < gridSize; y++) {
				if (pieceMap[x][y] === null) continue;
				const piece = app.stage.getChildByName(newPieceMap[x][y].id);
				const newPos = {
					x: x * gap + x * pieceSize + gap,
					y: y * gap + y * pieceSize + gap,
				};
				piece.position.set(newPos.x, newPos.y);
			}
		}
	};

	const getIdPosition = (id: string) => {
		for (let x = 0; x < gridSize; x++) {
			for (let y = 0; y < gridSize; y++) {
				if (pieceMap[x][y] === null) continue;
				if (pieceMap[x][y].id === id) return { x, y };
			}
		}
		return { x: 0, y: 0 };
	};

	const onPointerDown = (x: number, y: number, e: any) => {
		isDragging = true;
		const piecePosition = getIdPosition(`${x}-${y}`);
		const piecePixelPosition = worldToGrid(piecePosition);
		const displayedCellSize = getDisplayedCellSize();
		const pieceCenterX = piecePixelPosition.x + displayedCellSize / 2;
		const pieceCenterY = piecePixelPosition.y + displayedCellSize / 2;
		dragStart.x = pieceCenterX;
		dragStart.y = pieceCenterY;
		selectedPiece.x = piecePosition.x;
		selectedPiece.y = piecePosition.y;
		console.log(selectedPiece);
		app.ticker.add(animate);
	};

	const onPointerMove = (e: any) => {
		if (!isDragging) return;
		const dx = e.clientX - dragStart.x;
		const dy = e.clientY - dragStart.y;
		const displayedCellSize = getDisplayedCellSize();
		const gridOffsetX = Math.round(dx / displayedCellSize);
		const gridOffsetY = Math.round(dy / displayedCellSize);
		if (gridOffsetX === 0 && gridOffsetY === 0) lockedAxis = null;
		if (!lockedAxis) lockedAxis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
		if (lockedAxis === "x") {
			offset.x = gridOffsetX;
			offset.y = 0;
		} else {
			offset.x = 0;
			offset.y = gridOffsetY;
		}
	};

	const onPointerUp = () => {
		if (!isDragging) return;
		isDragging = false;
		app.ticker.remove(animate);
		pieceMap = calculateNewPieceMap().map((row: any[]) => [...row]);
		dragStart = { x: 0, y: 0 };
		offset = { x: 0, y: 0 };
		lockedAxis = null;
	};

	onMount(() => {
		app = new PIXI.Application({
			width: canvasSize,
			height: canvasSize,
			view: canvas,
			antialias: true,
			backgroundAlpha: 0,
		});
		for (let x = 0; x < gridSize; x++) {
			for (let y = 0; y < gridSize; y++) {
				if (pieceMap[x][y] === null) continue;
				const piece = new PIXI.Graphics();
				piece.beginFill(pieceMap[x][y].color);
				piece.drawRoundedRect(0, 0, pieceSize, pieceSize, borderRadius);
				piece.hitArea = new PIXI.Rectangle(0, 0, cellSize, cellSize);
				piece.position.set(x * gap + x * pieceSize + gap, y * gap + y * pieceSize + gap);
				piece.endFill();
				piece.name = pieceMap[x][y].id;
				piece.eventMode = "static";
				piece.on("pointerdown", (e) => {
					onPointerDown(x, y, e);
				});
				app.stage.addChild(piece);
			}
		}
		app.stage.eventMode = "static";
		window.addEventListener("pointermove", (e) => {
			onPointerMove(e);
		});
		window.addEventListener("pointerup", (e) => {
			onPointerUp();
		});
	});
</script>

<div class="board">
	<canvas bind:this={canvas} />
</div>

<style>
	.board {
		/* width: min(90vw, 60vh); */
		width: 100%;
		max-width: min(600px, 90vw);
		aspect-ratio: 1/1;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 35px;
		background: rgba(0, 0, 0, 0.5);
		/* overflow: hidden; */
		/* pointer-events: pass-through; */
	}
	canvas {
		width: 100%;
		height: 100%;
		/* border-radius: 10px; */
	}
</style>
