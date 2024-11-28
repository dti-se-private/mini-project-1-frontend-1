import { createSlice } from "@reduxjs/toolkit";
import { Event } from "@/src/stores/apis/eventApi";

export interface LandingState {
    events: Event[];
    fetchedEvents: Event[];
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
        fetchedEvents: [],
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
            state.category = category;
            state.page = 0;
        },
        setPage: (state, action) => {
            const {page} = action.payload;
            state.prevPage = state.page;
            if(state.fetchedEvents.length > 0) {
                state.page = page;
            }
        },
        setEvents: (state, action) => {
            const {events} = action.payload;
            state.fetchedEvents = events;
            if(state.page === 0) {
                state.events = events;
            } else {
                state.events = state.events.concat(events);
            }
        }
    },
});
