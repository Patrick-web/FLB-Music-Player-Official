import { Settings } from "electron/main";

export interface TrackType {
    r_fileLocation:string;
    fileLocation: string;
    albumArt:string;
    album:string;
    title:string | null;
    artist:string | null;
    extractedTitle:string | null;
    defaultTitle: string;
    extractedArtist:string;
    defaultArtist:string,
    fileName:string;
    formattedLength: string;
    duration: any;
    dateAdded: number;
    folderInfo: FolderInfoType;
    isCurrentlyPlaying:boolean;
}
export interface geniusSongType {
    id: any; url: any; albumArt: any; lyrics: any;
  }

export interface PlaylistType {
    name:string;
    tracks:Array<TrackType>;
}

export interface AlbumType {
    name: string;
    artist: string;
    tracks: Array<TrackType>;
}
export interface ArtistType {
    name: string ;
    picture:string | null;
    tracks: Array<TrackType>;
    albums: Array<AlbumType>;
}
export interface FolderParsedType {
    name: string;
    path: string;
    tracks: Array<TrackType>;
}
export interface FolderType {
    name: string;
    path: string;
    tracks: Array<string>;
}
export interface FolderInfoType {
    name: string;
    path: string;
}
export interface processedFolderType {
    name: string;
    path: string;
    tracks: Array<TrackType>
    videos: Array<TrackType>
}
export interface TagChangesType {
    title?:string,
    artist?:string,
    album?:string,
    imageUrl?:string,

}
export interface AudioStateType {
    playing: boolean;
    repeat: boolean;
    shuffle: boolean;
}
export type audioStateType = "playing" | "repeat" | "shuffle";
export type tabType = "Tracks" | "Recents" | "Folders" | "Playlists" | "Discover" | "Albums" | "Artists";
export interface BingDataType {
    tracks: Array<TrackType>;
    artists: Array<ArtistType>;
    albums: Array<AlbumType>;
}
export interface TabsDataType {
    addedTracks: Array<TrackType>;   
    recentTracks: Array<TrackType>;   
    artists: Array<ArtistType>;
    albums: Array<AlbumType>;
    playlists:Array<PlaylistType>;
    folders:Array<FolderParsedType>;
}
interface UIcontrollerType {
    showSettings: boolean;
    showTagEditor: boolean;
    showPlaylistWidget: boolean;
}

interface SearchResultsType {
    tracks:Array<TrackType>;
    artists:Array<ArtistType>;
    albums:Array<AlbumType>;
}

export interface TrackerDataType {
    processedFiles: Array<TrackType>;
    recentlyPlayed: Array<TrackType>;
    playlists: Array<PlaylistType>;
}


export type UIcontrollerPropertiesType =  "showSettings" |  "showTagEditor" | "showPlaylistWidget"  
export interface RootStateType {
    tabsData:TabsDataType;
    renderedTracks:Array<TrackType>;
    customQueue:Array<TrackType>;
    playingTrack:TrackType | null;
    playingNext:TrackType | null;
    selectedTracks:Array<TrackType>;
    playingTrackLyrics:Array<string> | null;
    bingData:BingDataType;
    UIcontroller:UIcontrollerType;
    audioState:AudioStateType;
    currentTab: tabType;
    searchResults:SearchResultsType;
    selectedGroup:ArtistType | AlbumType | FolderParsedType | null;
    sidePaneActiveTab:string;
    scannedFolders:Array<FolderInfoType>
    settings:SettingsType | any
}

export interface SettingsType {
    includeVideo: boolean;
    desktopNotifications: boolean;
    defaultTab: tabType;
    theme: 'fancy' | "dark" | "light";
    accentColor: 'accent_blue' | "accent_white" | "accent_orange" | "accent_purple" | "accent_magenta";
    volume:1;
    foldersToScan: Array<string>;
}

export type SettingsPropertiesType = 'includeVideo' | 'desktopNotifications' | 'defaulTab' | 'theme' | 'accentColor' |'volume' ;