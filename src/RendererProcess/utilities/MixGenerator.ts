import { shuffleArray, sortArrayOfObjects } from "@/sharedUtilities";
import { TrackType, mixTyping } from "@/types";

export class MixGenerator {
    mostPlayedTracks: TrackType[];
    allTracks: TrackType[];
    mixes: mixTyping[] = [];
    recentlyPlayedTracks: TrackType[];
    constructor(mostPlayedTracks: Array<TrackType>, allTracks: Array<TrackType>, recentlyPlayedTracks: Array<TrackType>) {
        this.mostPlayedTracks = [...mostPlayedTracks]
        this.allTracks = [...allTracks]
        this.recentlyPlayedTracks = [...recentlyPlayedTracks]
        this.favoriteTracks()
        this.twoArtistMashUp()
        this.tenForgottenTracks()
        this.recentlyAddedTracks()
    }
    favoriteTracks() {
        if (this.mostPlayedTracks[1]) {
            const mix: mixTyping = {
                name: "Tracks you've fallen for 💘💘",
                info: `Your Most Played tracks like 👉 💖${this.mostPlayedTracks[0].defaultTitle}💖  and  💖${this.mostPlayedTracks[1].defaultTitle}💖`,
                tracks: this.mostPlayedTracks
            }
            this.mixes.push(mix)
        }
    }
    twoArtistMashUp() {
        const favoriteArtists = this.mostPlayedTracks.map(track => track.defaultArtist);
        const twoRandomArtists = shuffleArray(favoriteArtists).slice(0, 2)
        if (twoRandomArtists[1] && twoRandomArtists[1] != twoRandomArtists[0]) {
            const firstArtistTracks = this.allTracks.filter(track => track.defaultArtist == twoRandomArtists[0])
            const secondArtistTracks = this.allTracks.filter(track => track.defaultArtist == twoRandomArtists[1])
            const mashedTracks = shuffleArray([...firstArtistTracks, ...secondArtistTracks])
            const mix: mixTyping = {
                name: 'Power Duo 🎭',
                info: `Bangers from 🎤 ${twoRandomArtists[0]} and 🎤${twoRandomArtists[1]}`,
                tracks: mashedTracks
            }
            this.mixes.push(mix)
        }
    }
    tenForgottenTracks() {
        const titlesOfRecentlyPlayedTracks = this.recentlyPlayedTracks.map(track => track.defaultTitle)
        const shuffledTracks = shuffleArray(this.allTracks);
        let forgottenTracks: TrackType[] = []
        shuffledTracks.forEach(track => {
            if (!titlesOfRecentlyPlayedTracks.includes(track.defaultTitle)) {
                forgottenTracks.push(track)
            }
        })
        forgottenTracks = forgottenTracks.splice(0, 10)
        console.log(forgottenTracks);
        const mix: mixTyping = {
            name: 'Tracks you might have forgotten 🤯',
            info: `Remember 👉 ${forgottenTracks[0].defaultTitle}, ${forgottenTracks[1].defaultTitle} and others...`,
            tracks: forgottenTracks
        }
        this.mixes.push(mix)
    }
    recentlyAddedTracks() {
        const allTracksCopy = [...this.allTracks]
        sortArrayOfObjects(allTracksCopy, 'dateAdded')
        allTracksCopy.reverse()
        const topTenRecentlyAddedTracks = allTracksCopy.splice(0, 10)
        const mix: mixTyping = {
            name: 'Fresh and Juicy 🧃🧃',
            info: `Newly added tracks like 👉 ${topTenRecentlyAddedTracks[0].defaultTitle}, ${topTenRecentlyAddedTracks[1].defaultTitle} and others...`,
            tracks: topTenRecentlyAddedTracks
        }
        this.mixes.push(mix)
    }
    clearDataToSaveRam() {
        setTimeout(() => {
            this.mostPlayedTracks = []
            this.recentlyPlayedTracks = []
            this.allTracks = []
        }, 1000);
    }
    public get allMixes(): mixTyping[] {
        this.clearDataToSaveRam()
        return this.mixes
    }


}