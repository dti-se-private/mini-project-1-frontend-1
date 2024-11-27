import { createSlice } from "@reduxjs/toolkit";
import { interfaceApi } from "@/src/stores/api";
import { EventOverview } from "@/src/stores/api";

export const rootSlice = createSlice({
    name: 'root',
    initialState: {
        events: [] as EventOverview[],
        category: 'All',
        page: 0,
        size: 10,
    },
    reducers: {
        setCategory: (state, action) => {
            state.category = action.payload;
            state.page = 0;
        },
        setPage: (state, action) => {
            state.page = action.payload;
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
            },
        );
    },
});