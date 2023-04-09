<script lang="ts">
	import { onMount } from "svelte";
	import logo from "../assets/logo.svg";
	import help from "../assets/help-icon.svg";
</script>

<header>
	<div class="logo">
		<img src={logo} alt="Kubel" />
		<h1>KUBEL.io</h1>
	</div>
	<button>
		<img src={help} alt="help" />
	</button>
</header>

<style>
	header {
		height: 70px;
		padding: 10px 30px;
		display: flex;
		align-items: center;
		animation: header-spawn 2s ease;
	}

	@keyframes header-spawn {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	.logo {
		display: flex;
	}
	.logo img {
		width: 40px;
		aspect-ratio: 1;
		margin-right: 10px;
	}
	.logo h1 {
		font-family: "Jura", sans-serif;
		font-weight: 700;
		font-size: 1.8rem;
	}

	button {
		margin-left: auto;
		background: none;
		border: none;
		cursor: pointer;
		width: 40px;
		aspect-ratio: 1;
	}

	button img {
		width: 70%;
		aspect-ratio: 1;
		opacity: 0.6;
		transition: opacity 0.2s;
	}
	button:hover img {
		opacity: 1;
	}
</style>
