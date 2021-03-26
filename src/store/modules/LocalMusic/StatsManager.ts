import { TrackType } from "@/store/types";

const state = {
    stats: {
        mostPlayedTracks: []
    }
};
const mutations = {
    setMostPlayedTracks(state: any, payload: TrackType[]) {
        state.stats.mostPlayedTracks = payload
    }
};

export default {
    state,
    mutations,
};
