import {createSlice} from "@reduxjs/toolkit"
import {RetrieveEventResponse} from "@/src/stores/apis/eventApi";

export interface OrganizerManagementState {
    prevPage: number;
    currentPage: number;
    size: number;
    eventId?: string;
    updateForm?: RetrieveEventResponse;
    isCreatingEvent: boolean;
}

export const eventManagementSlice = createSlice({
    name: 'eventManagementSlice',
    initialState: {
        prevPage: 0,
        currentPage: 0,
        size: 10,
        eventId: undefined,
        updateForm: undefined,
        isCreatingEvent: false,
    } as OrganizerManagementState,
    reducers: {
        setPage: (state, action) => {
            const {prevPage, currentPage} = action.payload;
            state.prevPage = prevPage ?? state.currentPage;
            state.currentPage = currentPage;
        },
        refreshUpdateForm: (state, action) => {
            const {event} = action.payload;
            state.updateForm = event;
        },
        setIsCreatingEvent: (state, action) => {
            state.isCreatingEvent = action.payload;
        },
        setEventId: (state, action) => {
            state.eventId = action.payload;
        }
    }
});
