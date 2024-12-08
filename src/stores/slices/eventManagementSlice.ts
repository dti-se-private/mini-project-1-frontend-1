import {createSlice} from "@reduxjs/toolkit"
import {UpdateEventResponse} from "@/src/stores/apis/organizerEventApi";

export interface OrganizerManagementState {
    prevPage: number;
    currentPage: number;
    size: number;
    updateForm?: UpdateEventResponse;
    isLoading: boolean;
}

export const eventManagementSlice = createSlice({
    name: 'eventManagementSlice',
    initialState: {
        prevPage: 0,
        currentPage: 0,
        size: 10,
        updateForm: undefined,
        isLoading: false,
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
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    }
});
