import { ipcRenderer } from "electron";
import axios from "axios";

export function removeDuplicates(targetArray: any, prop: any) {
	return targetArray.filter((obj: any, index: number, arr: any) => {
		return arr.map((mapObj: any) => mapObj[prop]).indexOf(obj[prop]) === index;
	});
}
export function sendMessageToNode(message: string, payload: any) {
	ipcRenderer.send(message, payload);
}

export function shuffle(array: Array<any>) {
	const arrayCopy = [...array]
	let currentIndex = arrayCopy.length,
		temporaryValue,
		randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = arrayCopy[currentIndex];
		arrayCopy[currentIndex] = arrayCopy[randomIndex];
		arrayCopy[randomIndex] = temporaryValue;
	}

	return arrayCopy;
}

export function sortArrayOfObjects(targetArray: any, param: any) {
	function compare(a: any, b: any) {
		if (a[`${param}`] < b[`${param}`]) {
			return -1;
		}
		if (a[`${param}`] > b[`${param}`]) {
			return 1;
		}
		return 0;
	}
	targetArray.sort(compare);
}

export function searchArtistPicture(artist: string | null) {
	return new Promise<object | null>((resolve) => {
		if (!artist) {
			resolve(null);
		}

		axios({
			method: "get",
			url:
				"https://apiflbdeezer.herokuapp.com/search/?category=artists&query=alessia cara",
			headers: {},
		})
			.then(function (response: any) {
				console.log(JSON.stringify(response.data));
				const pic = response.data.results[0].picture;
				resolve({ picture: pic, artistName: artist });
			})
			.catch(function () {
				resolve(null);
			});
	});
}

// export function convertSecondsToTime(sec: number) {
// 	if (sec) {
// 		let sec_num = parseInt(JSON.stringify(sec), 10); // don't forget the second param
// 		let hours: string | number = Math.floor(sec_num / 3600);
// 		let minutes: string | number = Math.floor((sec_num - hours * 3600) / 60);
// 		let seconds: string | number = sec_num - hours * 3600 - minutes * 60;

// 		if (hours < 10) {
// 			hours = "0" + hours;
// 		}
// 		if (minutes < 10) {
// 			minutes = "0" + minutes;
// 		}
// 		if (seconds < 10) {
// 			seconds = "0" + seconds;
// 		}
// 		return hours + ":" + minutes + ":" + seconds;
// 	}
// 	return "_ _ : _ _";
// }

export function extractTitleAndArtist(trackName: string): any {
	const split = trackName.split("-");
	let artist;
	let title;
	if (trackName.includes("_-")) {
		artist = split[0];
		title = split[1];
	} else if (trackName.includes("-")) {
		artist = split[1];
		title = split[0];
	} else {
		return { artist: "unknown", title: null };
	}
	artist = artist.replace(/_/g, " ").trim();
	title = title
		.replace(/_/g, " ")
		.replace(/\(.*\).*/gi, "")
		.replace(/\[.*\].*/gi, "")
		.replace(/\)/, "")
		.trim();
	return { artist, title };
}

export function removeMIME(str: string) {
	return str.replace(/(\.mp3)|(\.m4a)|(\.ogg)|(\.wav)/gi, "");
}
export function isValidFileType(path: string) {
	return path.match(/\.mp3|\.webm|\.m4a|\.ogg/gi);
}
