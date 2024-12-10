import {createSlice} from "@reduxjs/toolkit"

export interface ProfileState {
    feedbackPrevPage: number;
    feedbackCurrentPage: number;
    size: number;
}

export const participantSlice = createSlice({
    name: 'profileSlice',
    initialState: {
        feedbackPrevPage: 0,
        feedbackCurrentPage: 0,
        size: 10,
    } as ProfileState,
    reducers: {
        setFeedbackPage: (state, action) => {
            const {prevPage, currentPage} = action.payload;
            state.feedbackPrevPage = prevPage ?? state.feedbackCurrentPage;
            state.feedbackCurrentPage = currentPage;
        },
    }
});
