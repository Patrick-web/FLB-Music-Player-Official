const fs = require("fs");
const crypto = require("crypto");
const https = require("https");
// downloadTrack(process.argv[2], process.argv[3], "./test.mp3")
// 	.then((result) => {
// 		console.log(result);
// 	})
// 	.catch((err) => {
// 		console.error("error");
// 		console.log(err);
// 	});

export function downloadTrack(trackID: any, url: any, saveLocation: string) {
	return new Promise((resolve) => {
		const fileStream = fs.createWriteStream(saveLocation);
		https.get(url, function (response: { on: (arg0: string, arg1: { (): void; (): void; }) => void; read: (arg0: number) => any; headers: { [x: string]: number; }; }) {
			let i = 0;
			let percent = 0;
			response.on("readable", () => {
				const bfKey = getBlowfishKey(trackID);

				let chunk;
				while ((chunk = response.read(2048))) {
					if (
						(100 * 2048 * i) / response.headers["content-length"] >=
						percent + 1
					) {
						percent++;
					}
					if (i % 3 > 0 || chunk.length < 2048) {
						fileStream.write(chunk);
					} else {
						const bfDecrypt = crypto.createDecipheriv(
							"bf-cbc",
							bfKey,
							"\x00\x01\x02\x03\x04\x05\x06\x07"
						);
						bfDecrypt.setAutoPadding(false);

						let chunkDec = bfDecrypt.update(
							chunk.toString("hex"),
							"hex",
							"hex"
						);
						chunkDec += bfDecrypt.final("hex");
						fileStream.write(chunkDec, "hex");
					}
					i++;
					// console.log("Chunk written");
				}
			});
			response.on("end", () => {
				fileStream.end();
				console.log("Track Downloaded 🚀");
				resolve(`Track saved to ${saveLocation}`);
			});
		});
	});
}

function getBlowfishKey(trackID: any) {
	const SECRET = "g4el58wc0zvf9na1";

	const idMd5 = crypto
		.createHash("md5")
		.update(trackID, "ascii")
		.digest("hex");
	let bfKey = "";

	for (let i = 0; i < 16; i++) {
		bfKey += String.fromCharCode(
			idMd5.charCodeAt(i) ^ idMd5.charCodeAt(i + 16) ^ SECRET.charCodeAt(i)
		);
	}
	console.log(bfKey);
	return bfKey;
}
