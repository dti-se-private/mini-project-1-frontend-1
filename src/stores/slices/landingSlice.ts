import { createSlice } from "@reduxjs/toolkit";
import { Event, eventApi } from "@/src/stores/apis/eventApi";

export interface LandingState {
    events: Event[];
    prevEvents: Event[],
    category: string;
    page: number;
    size: number;
    search: string;
    filter: string[];
}

export const landingSlice = createSlice({
    name: 'landingSlice',
    initialState: {
        events: [],
        prevEvents: [],
        category: 'All',
        page: 0,
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
            if (state.prevEvents.length > 0) {
                state.page = page;
            }
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            eventApi.endpoints.getEventsByCategory.matchFulfilled,
            (state, { payload }) => {
                if (state.page === 0) {
                    state.events = payload.data as Event[];
                } else {
                    state.events = [...state.events, ...payload.data as Event[]];
                }
                state.prevEvents = payload.data as Event[];
            },
        );
    },
});
