import { mixTyping, TrackType } from "@/store/types";
import { shuffle, sortArrayOfObjects } from "../SharedUtilityFunctions";

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
        const mix: mixTyping = {
            name: 'Most Played Tracks',
            info: `Your favorites like ${this.mostPlayedTracks[0].defaultTitle} and ${this.mostPlayedTracks[1].defaultTitle}`,
            tracks: this.mostPlayedTracks
        }
        this.mixes.push(mix)
    }
    twoArtistMashUp() {
        const favoriteArtists = this.mostPlayedTracks.map(track => track.defaultArtist);
        const twoRandomArtists = shuffle(favoriteArtists).slice(0, 2)
        if (twoRandomArtists[1] && twoRandomArtists[1] != twoRandomArtists[0]) {
            const firstArtistTracks = this.allTracks.filter(track => track.defaultArtist == twoRandomArtists[0])
            const secondArtistTracks = this.allTracks.filter(track => track.defaultArtist == twoRandomArtists[1])
            const mashedTracks = shuffle([...firstArtistTracks, ...secondArtistTracks])
            const mix: mixTyping = {
                name: '2 artist Mashup',
                info: `Bangers from ${twoRandomArtists[0]} and ${twoRandomArtists[1]}`,
                tracks: mashedTracks
            }
            this.mixes.push(mix)
        }
    }
    tenForgottenTracks() {
        const titlesOfRecentlyPlayedTracks = this.recentlyPlayedTracks.map(track => track.defaultTitle)
        const shuffledTracks = shuffle(this.allTracks);
        let forgottenTracks: TrackType[] = []
        shuffledTracks.forEach(track => {
            if (!titlesOfRecentlyPlayedTracks.includes(track.defaultTitle)) {
                forgottenTracks.push(track)
            }
        })
        forgottenTracks = forgottenTracks.splice(0, 10)
        const mix: mixTyping = {
            name: 'Tracks you might have forgotten',
            info: `${forgottenTracks[0].defaultTitle}, ${forgottenTracks[1].defaultTitle} and others...`,
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
            name: 'Fresh and Juicy',
            info: `${topTenRecentlyAddedTracks[0].defaultTitle}, ${topTenRecentlyAddedTracks[1].defaultTitle} and others...`,
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