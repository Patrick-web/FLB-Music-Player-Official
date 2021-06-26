import { ipcRenderer } from "electron";

export function sendMessageToNode(message: string, payload: any) {
    ipcRenderer.send(message, payload);
}
export function remappedDeezerTracks(deezerTracks: Array<any>, setAlbum: string) {
    console.log("Tracks to remap");
    console.log(deezerTracks[0]);
    interface AcceptedNetworkTrackInterface {
        id: string;
        title: string;
        artist: string;
        album: string;
        albumArt: string;
        previewURL: string;
    }
    const acceptedNetworkTracks: Array<AcceptedNetworkTrackInterface> = []
    deezerTracks.forEach(dTrack => {
        const acceptedNetworkTrack: AcceptedNetworkTrackInterface = {
            id: dTrack.id,
            title: dTrack.title,
            artist: dTrack.artist?.name || dTrack.artist_name,
            album: dTrack.album?.title || setAlbum || 'unknown album',
            albumArt: dTrack.album?.cover_small || dTrack.album_cover,
            previewURL: dTrack.preview || null,
        }
        acceptedNetworkTracks.push(acceptedNetworkTrack)
    })
    console.log("Remapped tracks 👇");
    console.log(acceptedNetworkTracks[0]);
    return acceptedNetworkTracks
}