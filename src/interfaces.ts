export interface Track{
    title: string;
    artist: string;
    album: string;
    path: string;
    cover: string;
    duration: number;
    formatedLength: string | null;
    dateAdded?: string | null;
}

export interface Playlist {
    name:string;
    tracks:Array<Track>;
}

export interface Album {
    name: string;
    artist: string;
    tracks: Array<Track>;
}
export interface Artist {
    name: string;
    picture:string | null;
    tracks: Array<Track>;
    albums: Array<Album>;
}
export interface Folder {
    name: string;
    path: string;
    tracks: Array<Track>;
}
export interface AudioState {
    playing: boolean;
    repeat: boolean;
    shuffle: boolean;
}
export interface BingData {
    tracks: Array<Track>;
    artists: Array<Artist>;
    albums: Array<Album>;
}
export interface TabsData {
    addedracks: Array<Track>;   
    recentTracks: Array<Track>;   
    artists: Array<Artist>;
    albums: Array<Album>;
    playlist:Array<Playlist>;
    folders:Array<Folder>;
}
interface UIcontroller {
    showGems: boolean,
    showSettings: boolean,
    showFileImporter: boolean,
    showTagEditor: boolean,
    showPlaylistWidget: boolean,
    showPersonalInfo: boolean,
}
export interface State {
    tabsData:TabsData;
    playingQueue:Array<Track>;
    customQueue:Array<Track>;
    playingTrack:Track | null;
    selectedTracks:Array<Track>;
    playingTrackLyrics:string;
    bingData:BingData;
    UIcontroller:UIcontroller;
    currentTab:string;
}