<template>
	<div class="Discover">
		<button
			class="tool"
			@click="reloadWebview"
			data-tip="Reload Deezer"
			id="refreshWebview"
		>
			<img
				class="animated infinite fast"
				src="@/assets/images/refresh.svg"
				alt=""
			/>
		</button>
		<webview
			src="https://open.spotify.com"
			useragent="Chrome/79.0.3945.130 Safari/537.36"
			style="height:100%;width:100%"
		>
		</webview>
	</div>
</template>

<script>
export default {
	methods: {
		reloadWebview() {
			document.querySelector("webview").reload();
			document.querySelector("#refreshWebview img").classList.add("rotateOut");
			setTimeout(() => {
				document
					.querySelector("#refreshWebview img")
					.classList.remove("rotateOut");
			}, 5000);
		},
	},
};
</script>

<style scoped lang="scss">
.Discover {
	height: 100vh;
	min-width: 93vw;
	display: flex;
	#refreshWebview {
		position: absolute;
		right: 10px;
		width: 40px;
		height: 40px;
		background: rgb(10, 10, 10);
		border-radius: 50%;
		top: 0;
		transform: translateY(-50%);
	}
	#refreshWebview:hover {
		background: #0062ff;
	}
}
</style>
