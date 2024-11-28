import {createSlice} from "@reduxjs/toolkit";
import {Event} from "@/src/stores/apis/eventApi";

export interface LandingState {
    events: Event[];
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
            state.page = page;
        },
    }
});
