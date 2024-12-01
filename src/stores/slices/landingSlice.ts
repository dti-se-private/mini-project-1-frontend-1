import {createSlice} from "@reduxjs/toolkit";
import {RetrieveEventResponse} from "@/src/stores/apis/eventApi";

export interface LandingState {
    events: RetrieveEventResponse[];
    category: string;
    page: number;
    prevPage: number,
    size: number;
    search: string;
    filter: string[];
}

export const landingSlice = createSlice({
    name: 'landingSlice',
    initialState: {
        events: [],
        category: 'All',
        page: 0,
        prevPage: 0,
        size: 10,
        search: '',
        filter: [],
    } as LandingState,
    reducers: {
        setCategory: (state, action) => {
            const {category} = action.payload;
            state.events = [];
            state.prevPage = 0;
            state.page = 0;
            state.category = category;
        },
        setPage: (state, action) => {
            const {page} = action.payload;
            state.prevPage = state.page;
            state.page = page;
        },
        setEvents: (state, action) => {
            const {events} = action.payload;
            const arrayEvents = Object.values(events) as RetrieveEventResponse[];
            state.events = [...state.events, ...arrayEvents];
        }
    },
});
