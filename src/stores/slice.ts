import { createSlice } from "@reduxjs/toolkit";
import { interfaceApi } from "@/src/stores/api";
import { EventOverview } from "@/src/stores/api";

export const rootSlice = createSlice({
    name: 'root',
    initialState: {
        events: [] as EventOverview[],
        prevEvents: [] as EventOverview[],
        category: 'All',
        page: 0,
        size: 10,
    },
    reducers: {
        setCategory: (state, action) => {
            state.page = 0;
            state.category = action.payload;
        },
        setPage: (state, action) => {
            if (state.prevEvents.length > 0) {
                state.page = action.payload;
            }
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            interfaceApi.endpoints.getEventsByCategory.matchFulfilled,
            (state, { payload }) => {
                if (state.page === 0) {
                    state.events = payload;
                } else {
                    state.events = [...state.events, ...payload];
                }
                state.prevEvents = payload;
            },
        );
    },
});