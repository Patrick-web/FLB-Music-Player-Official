import { UIcontrollerPropertiesType } from "@/types";

interface PropertyPayload {
    property: string | number;
    newValue: any;
}
interface UIControllerStateInterface {
    UIProperties: {
        showSettings: boolean;
        showTagEditor: boolean;
        showPlaylistWidget: boolean;
        currentMainTab: 'Tracks' | 'Recents' | 'Playlists' | 'Home' | 'Albums' | 'Artists';
        currentSidePaneTab: 'TrackInfo' | 'Lyrics' | 'CustomQueue';
    };
}
const state: UIControllerStateInterface = {
    UIProperties: {
        showSettings: false,
        showTagEditor: false,
        showPlaylistWidget: false,
        currentMainTab: 'Tracks',
        currentSidePaneTab: 'TrackInfo'
    },
};
const mutations = {
    UIcontrollerToggleProperty: (
        state: any,
        property: UIcontrollerPropertiesType
    ) => {
        state.UIProperties[property] = !state.UIProperties[property];
    },
    UIcontrollerSetPropertyValue: (
        state: any,
        payload: PropertyPayload
    ) => {
        state.UIProperties[payload.property] = payload.newValue;
    },
};

export default {
    state,
    mutations,
};
