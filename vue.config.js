module.exports = {
	pluginOptions: {
		electronBuilder: {
			nodeIntegration: true,
			builderOptions: {
				appId: "com.flb.flbmusic",
				productName: "FLB Music",
				copyright: "MIT",
				publish: ["github"],
			},
		},
	},
};
