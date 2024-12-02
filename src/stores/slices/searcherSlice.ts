import {createSlice} from "@reduxjs/toolkit";
import {RetrieveEventResponse, SearchEventRequest} from "@/src/stores/apis/eventApi";

export interface SearcherState {
    events: RetrieveEventResponse[];
    request: SearchEventRequest;
}

export const searcherSlice = createSlice({
    name: 'searcherSlice',
    initialState: {
        events: [],
        request: {
            page: 0,
            size: 10,
            search: '',
            filters: [],
        }
    } as SearcherState,
    reducers: {
        setRequest: (state, action) => {
            state.request = {...state.request, ...action.payload};
        },
        setEvents: (state, action) => {
            const {events} = action.payload;
            state.events = events;
        }
    },
});
