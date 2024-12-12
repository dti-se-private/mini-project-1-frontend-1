import {createSlice} from "@reduxjs/toolkit"
import {RetrieveEventResponse} from "@/src/stores/apis/eventApi";
import {RetrieveEventParticipantResponse} from "@/src/stores/apis/organizerApi";

export interface OrganizerManagementState {
    prevPage: number;
    currentPage: number;
    size: number;
    event?: RetrieveEventResponse
    eventParticipants: RetrieveEventParticipantResponse[]
}

export const organizerSlice = createSlice({
    name: 'organizerSlice',
    initialState: {
        prevPage: 0,
        currentPage: 0,
        size: 10,
        event: undefined,
        eventParticipants: []
    } as OrganizerManagementState,
    reducers: {
        setEvent: (state, action) => {
            const {event} = action.payload;
            state.event = event;
        },
        setEventParticipants: (state, action) => {
            const {eventParticipants} = action.payload;
            state.eventParticipants = eventParticipants;
        },
        setPage: (state, action) => {
            const {prevPage, currentPage} = action.payload;
            state.prevPage = prevPage ?? state.currentPage;
            state.currentPage = currentPage;
        },
    }
});
