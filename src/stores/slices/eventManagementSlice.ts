import {createSlice} from "@reduxjs/toolkit"
import {RetrieveEventResponse} from "@/src/stores/apis/eventApi";

export interface OrganizerManagementState {
    prevPage: number;
    currentPage: number;
    size: number;
    event?: RetrieveEventResponse;
}

export const eventManagementSlice = createSlice({
    name: 'eventManagementSlice',
    initialState: {
        prevPage: 0,
        currentPage: 0,
        size: 10,
        event: undefined,
    } as OrganizerManagementState,
    reducers: {
        setPage: (state, action) => {
            const {prevPage, currentPage} = action.payload;
            state.prevPage = prevPage ?? state.currentPage;
            state.currentPage = currentPage;
        },
        setEvent: (state, action) => {
            const {event} = action.payload;
            state.event = event;
        },
    }
});
