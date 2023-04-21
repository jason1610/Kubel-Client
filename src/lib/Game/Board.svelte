<script lang="ts">
	export let mapData: MapData;
	const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
	import {
		moveCount,
		isMoving,
		hasWon,
		restart,
		completedColors,
		newWin,
		showDashBoard,
		selectedColor,
	} from "./GameStore";

	import type { MapData, Vector, Move, UserStats } from "../../Interfaces";
	import FingerprintJS from "@fingerprintjs/fingerprintjs";
	import timezone from "dayjs/plugin/timezone";
	import utc from "dayjs/plugin/utc";
	import { onMount } from "svelte";
	import * as PIXI from "pixi.js";
	import { gsap } from "gsap";
	import dayjs from "dayjs";
	import axios from "axios";
	dayjs.extend(timezone);
	dayjs.extend(utc);

	const canvasSize = 600;
	const gap: number = 20;
	let colorCount: number[];
	let app: PIXI.Application;
	let canvas: HTMLCanvasElement;
	const pieceSpeed: number = 0.4;
	let gridSize: number = mapData.pieceMap.length;
	const cellSize: number = canvasSize / gridSize;
	const borderRadius: number = cellSize / 7;
	const pieceSize: number = (canvasSize - gap * (gridSize + 1)) / gridSize;

	let isDragging = false;
	let selectedPiece: string = "";
	let allowInput: boolean = false;
	let offset: Vector = { x: 0, y: 0 };
	let pieceMap: any = mapData.pieceMap;
	let dragStart: Vector = { x: 0, y: 0 };
	let lastOffset: Vector = { x: 0, y: 0 };
	let lockedAxis: "x" | "y" | null = null;
	let offsetDelta: Vector = { x: 0, y: 0 };
	let selectedPos: Vector = { x: 0, y: 0 };
	let pieceOffset: Vector = { x: 0, y: 0 };

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
					(lockedAxis === "x" && y !== selectedPos.y) ||
					(lockedAxis === "y" && x !== selectedPos.x)
				)
					continue;

				let newPos: Vector = calculateNewPiecePosition(x, y);
				newPieceMap[newPos.x][newPos.y] = pieceMap[x][y];
			}
		}
		return newPieceMap;
	};

	const lerpPos = (start: number, end: number) => {
		return start + (end - start) * pieceSpeed;
	};
	const lerpSize = (start: number, end: number) => {
		return start + (end - start) * pieceSpeed * 2;
	};

	const animate = () => {
		const newPieceMap = calculateNewPieceMap();
		for (let x = 0; x < gridSize; x++) {
			for (let y = 0; y < gridSize; y++) {
				if (pieceMap[x][y] === null) continue;
				const piece = app.stage.getChildByName(newPieceMap[x][y].id);
				const newPos = {
					x: x * gap + x * pieceSize + gap,
					y: y * gap + y * pieceSize + gap,
				};
				piece.position.set(
					lerpPos(piece.position.x, newPos.x),
					lerpPos(piece.position.y, newPos.y)
				);
				//get offset between old and new position
				const pieceOffset = {
					x: newPos.x - piece.position.x,
					y: newPos.y - piece.position.y,
				};

				if (
					(pieceOffset.x !== 0 && Math.sign(pieceOffset.x) !== offsetDelta.x) ||
					(pieceOffset.y !== 0 && Math.sign(pieceOffset.y) !== offsetDelta.y)
				) {
					piece.zIndex = 10;
					// piece.scale.set(0.3);
				} else {
					piece.scale.set(1);
					piece.zIndex = 0;
				}
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

	const floodFill = (posX: number, posY: number, targetColor: string) => {
		let queue = [[posX, posY]];
		let visited = [];
		let count = 0;
		while (queue.length > 0) {
			let [x, y] = queue.shift();
			if (visited.includes(x + "-" + y)) continue;
			visited.push(x + "-" + y);
			count++;

			if (x > 0 && pieceMap[x - 1][y] !== null && pieceMap[x - 1][y].color === targetColor) {
				queue.push([x - 1, y]);
			}
			if (
				x < pieceMap.length - 1 &&
				pieceMap[x + 1][y] !== null &&
				pieceMap[x + 1][y].color === targetColor
			) {
				queue.push([x + 1, y]);
			}
			if (y > 0 && pieceMap[x][y - 1] !== null && pieceMap[x][y - 1].color === targetColor) {
				queue.push([x, y - 1]);
			}
			if (
				y < pieceMap[0].length - 1 &&
				pieceMap[x][y + 1] !== null &&
				pieceMap[x][y + 1].color === targetColor
			) {
				queue.push([x, y + 1]);
			}
		}
		return count;
	};

	const findColorId = (color: string) => {
		for (let x = 0; x < pieceMap.length; x++) {
			for (let y = 0; y < pieceMap[0].length; y++) {
				if (pieceMap[x][y] === null) continue;
				if (pieceMap[x][y].color === color) return [x, y];
			}
		}
		return [0, 0];
	};

	const checkForWin = () => {
		let matchedColors = new Array(colorCount.length).fill(true);
		for (let i = 0; i < colorCount.length; i++) {
			let [x, y] = findColorId(mapData.palette[i]);
			if (floodFill(x, y, mapData.palette[i]) !== colorCount[i]) {
				matchedColors[i] = false;
			}
		}
		completedColors.set(matchedColors);
		if (matchedColors.includes(false)) return false;
		return true;
	};

	restart.subscribe((value) => {
		if (!value) return;
		const defaultPieceMap = pieceMap.map((row: any[]) => [...row]);
		for (let x = 0; x < gridSize; x++) {
			for (let y = 0; y < gridSize; y++) {
				if (pieceMap[x][y] === null) continue;
				const pos = pieceMap[x][y].id.split("-").map((n) => parseInt(n));
				defaultPieceMap[pos[0]][pos[1]] = pieceMap[x][y];
				const piece = app.stage.getChildByName(`${x}-${y}`);
				const newPos = {
					x: x * gap + x * pieceSize + gap,
					y: y * gap + y * pieceSize + gap,
				};
				piece.position.set(newPos.x, newPos.y);
			}
		}
		moveCount.set(0);
		hasWon.set(false);
		newWin.set(true);
		showDashBoard.set(false);
		completedColors.set(new Array(colorCount.length).fill(false));
		restart.set(false);
		const defaultMapData = JSON.parse(JSON.stringify(mapData));
		defaultMapData.pieceMap = defaultPieceMap;
		pieceMap = defaultPieceMap.map((row: any[]) => [...row]);
		defaultMapData.moves = [];
		localStorage.setItem("dailyData", JSON.stringify(defaultMapData));
		allowInput = true;
	});

	const animateSelectedPiece = (piece: any, color: string) => {
		const targetBorderRadius = 50; // Set the target borderRadius value
		const duration = 0.2; // Set the animation duration in seconds
		gsap.to(piece, {
			duration,
			borderRadius: targetBorderRadius,
			onUpdate: () => {
				piece.clear();
				piece.beginFill(lighterHex(color));
				piece.drawRoundedRect(0, 0, pieceSize, pieceSize, piece.borderRadius);
				const innerPieceSize = pieceSize * 0.8;
				const innerPieceX = (pieceSize - innerPieceSize) / 2;
				const innerPieceY = (pieceSize - innerPieceSize) / 2;
				piece.beginFill(color);
				piece.drawRoundedRect(
					innerPieceX,
					innerPieceY,
					innerPieceSize,
					innerPieceSize,
					piece.borderRadius * 0.8
				);
				piece.endFill();
				piece.endFill();
			},
		});
	};

	const onPointerDown = (id: string) => {
		if (!allowInput) return;
		isDragging = true;
		const piecePosition = getIdPosition(id);
		const piecePixelPosition = worldToGrid(piecePosition);
		const displayedCellSize = getDisplayedCellSize();
		const pieceCenterX = piecePixelPosition.x + displayedCellSize / 2;
		const pieceCenterY = piecePixelPosition.y + displayedCellSize / 2;
		dragStart.x = pieceCenterX;
		dragStart.y = pieceCenterY;
		selectedPos.x = piecePosition.x;
		selectedPos.y = piecePosition.y;
		selectedPiece = id;
		selectedColor.set(pieceMap[piecePosition.x][piecePosition.y].color);
		animateSelectedPiece(
			app.stage.getChildByName(id),
			pieceMap[piecePosition.x][piecePosition.y].color
		);
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
		if (offset.x === lastOffset.x && offset.y === lastOffset.y) return;
		offsetDelta.x = offset.x - lastOffset.x;
		offsetDelta.y = offset.y - lastOffset.y;
		pieceOffset = {
			x: offset.x * displayedCellSize,
			y: offset.y * displayedCellSize,
		};
		lastOffset = { x: offset.x, y: offset.y };
	};

	const saveData = () => {
		let userStatsString = localStorage.getItem("userStats");
		let userStats: any;
		const todaySeed = dayjs().tz("Etc/GMT-2").format("YYYYMMDD");
		const yesterdaySeed = dayjs().tz("Etc/GMT-2").subtract(1, "day").format("YYYYMMDD");
		if (!userStatsString) {
			localStorage.setItem(
				"userStats",
				JSON.stringify({
					gamesWon: 1,
					scoreHistory: [$moveCount],
					winStreak: 1,
					lastWin: todaySeed,
					dailyHighScore: $moveCount,
					dailyHistory: [$moveCount],
				})
			);
		} else {
			userStats = JSON.parse(userStatsString);
			userStats.gamesWon++;
			userStats.scoreHistory.push($moveCount);
			if (userStats)
				if (userStats.scoreHistory.length > 10) {
					userStats.scoreHistory.shift();
				}
			if (
				moveCount < userStats.dailyHighScore ||
				userStats.today !== todaySeed ||
				!userStats.dailyHighScore
			) {
				userStats.dailyHighScore = $moveCount;
			}
			if (userStats.lastWin === yesterdaySeed) {
				userStats.winStreak += 1;
			} else {
				userStats.winStreak = 1;
			}
			if (userStats.lastWin !== todaySeed) {
				userStats.dailyHistory = [$moveCount];
			} else {
				userStats.dailyHistory.push($moveCount);
			}

			userStats.lastWin = todaySeed;
			localStorage.setItem("userStats", JSON.stringify(userStats));
		}
	};

	const animateDeselectedPiece = (piece: any, color: string) => {
		const targetBorderRadius = borderRadius; // Set the target borderRadius value
		const duration = 0.2; // Set the animation duration in seconds
		gsap.to(piece, {
			duration,
			borderRadius: targetBorderRadius,
			onUpdate: () => {
				piece.clear();
				piece.beginFill(lighterHex(color));
				piece.drawRoundedRect(0, 0, pieceSize, pieceSize, piece.borderRadius);
				const innerPieceSize = pieceSize * 0.8;
				const innerPieceX = (pieceSize - innerPieceSize) / 2;
				const innerPieceY = (pieceSize - innerPieceSize) / 2;
				piece.beginFill(color);
				piece.drawRoundedRect(
					innerPieceX,
					innerPieceY,
					innerPieceSize,
					innerPieceSize,
					piece.borderRadius * 0.8
				);
				piece.endFill();
				piece.endFill();
			},
		});
	};

	async function sendWin(moves, iso) {
		try {
			const fpPromise = FingerprintJS.load();
			const fp = await fpPromise;
			const result = await fp.get();
			const userFingerprint = result.visitorId;
			axios.post(apiBaseUrl + "/win", { moves, iso, id: userFingerprint });
		} catch (error) {
			console.log(error);
		}
	}

	const onPointerUp = () => {
		if (!isDragging) return;
		animateDeselectedPiece(app.stage.getChildByName(selectedPiece), $selectedColor);
		selectedColor.set(null);
		pieceMap = calculateNewPieceMap().map((row: any[]) => [...row]);
		const selectedPieceNewPos = getIdPosition(selectedPiece);
		if (
			!(selectedPieceNewPos.x === selectedPos.x && selectedPieceNewPos.y === selectedPos.y)
		) {
			const newMapData = JSON.parse(JSON.stringify(mapData));
			newMapData.pieceMap = pieceMap;
			const move: Move = { offset, position: selectedPos };
			let moves = JSON.parse(localStorage.getItem("dailyData")).moves;
			moves.push(move);
			newMapData.moves = moves;
			localStorage.setItem("dailyData", JSON.stringify(newMapData));
			moveCount.update((n) => n + 1);
			if (checkForWin()) {
				hasWon.set(true);
				allowInput = false;
				const userCountry = localStorage.getItem("userCountry");
				const userStats = JSON.parse(localStorage.getItem("userStats"));
				if (
					userCountry !== null &&
					userCountry !== "XX" &&
					(userStats == null || !userStats.dailyHistory.includes(moves.length))
				) {
					sendWin(moves, userCountry);
				}
				saveData();
			} else allowInput = true;
		} else allowInput = true;

		isDragging = false;
		dragStart = { x: 0, y: 0 };
		offset = { x: 0, y: 0 };
		lockedAxis = null;
	};

	const getColorCount = () => {
		let count = new Array(mapData.palette.length).fill(0);
		for (let x = 0; x < gridSize; x++) {
			for (let y = 0; y < gridSize; y++) {
				if (pieceMap[x][y] === null) continue;
				const color = pieceMap[x][y].color;
				const index = mapData.palette.indexOf(color);
				count[index] = count[index] + 1;
			}
		}
		return count;
	};

	const lighterHex = (color) => {
		const lighten = 10;
		const hex = color.replace("#", "");
		const r = parseInt(hex.substring(0, 2), 16);
		const g = parseInt(hex.substring(2, 4), 16);
		const b = parseInt(hex.substring(4, 6), 16);
		const newR = Math.min(255, r + lighten);
		const newG = Math.min(255, g + lighten);
		const newB = Math.min(255, b + lighten);
		const newRHex = newR.toString(16).padStart(2, "0");
		const newGHex = newG.toString(16).padStart(2, "0");
		const newBHex = newB.toString(16).padStart(2, "0");
		return `#${newRHex}${newGHex}${newBHex}`;
	};

	onMount(() => {
		colorCount = getColorCount();
		app = new PIXI.Application({
			width: canvasSize,
			height: canvasSize,
			view: canvas,
			antialias: true,
			backgroundAlpha: 0,
		});
		app.ticker.add(animate);
		for (let x = 0; x < gridSize; x++) {
			for (let y = 0; y < gridSize; y++) {
				if (pieceMap[x][y] === null) continue;
				const piece: any = new PIXI.Graphics();
				piece.beginFill(lighterHex(pieceMap[x][y].color));
				piece.drawRoundedRect(0, 0, pieceSize, pieceSize, borderRadius);
				const innerPieceSize = pieceSize * 0.8;
				const innerPieceX = (pieceSize - innerPieceSize) / 2;
				const innerPieceY = (pieceSize - innerPieceSize) / 2;
				piece.beginFill(pieceMap[x][y].color);
				piece.drawRoundedRect(
					innerPieceX,
					innerPieceY,
					innerPieceSize,
					innerPieceSize,
					borderRadius * 0.8
				);
				piece.borderRadius = borderRadius;
				piece.endFill();
				piece.hitArea = new PIXI.Rectangle(
					-gap / 2,
					-gap / 2,
					cellSize - gap / 4,
					cellSize - gap / 4
				);

				// const hitAreaOutline = new PIXI.Graphics();
				// hitAreaOutline.lineStyle(1, 0xff0000, 1); // Set the line style to be 2 pixels wide, red, and fully opaque
				// hitAreaOutline.drawRect(-gap / 2, -gap / 2, cellSize - gap / 4, cellSize - gap / 4); // Draw the rectangle with the same dimensions as the hit area
				// piece.addChild(hitAreaOutline); // Add the hitAreaOutline as a child of the piece

				piece.position.set(x * gap + x * pieceSize + gap, y * gap + y * pieceSize + gap);
				piece.endFill();
				piece.name = pieceMap[x][y].id;
				piece.eventMode = "static";

				piece.on("pointerdown", (e) => {
					onPointerDown(piece.name);
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
		if (checkForWin()) {
			newWin.set(false);
			hasWon.set(true);
			allowInput = false;
		} else allowInput = true;
	});
</script>

<div class="board" style="cursor: {allowInput ? (isDragging ? 'grabbing' : 'grab') : ''}">
	<canvas bind:this={canvas} />
</div>

<style>
	.board {
		width: 550px;
		max-width: 90vw;
		aspect-ratio: 1/1;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 35px;
		background: rgba(0, 0, 0, 0.75);
	}
	canvas {
		width: 100%;
		height: 100%;
	}
</style>
