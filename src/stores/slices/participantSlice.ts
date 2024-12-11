import {createSlice} from "@reduxjs/toolkit"

export interface ParticipantState {
    feedbackPrevPage: number;
    feedbackCurrentPage: number;
    pointPrevPage: number;
    pointCurrentPage: number;
    voucherPrevPage: number;
    voucherCurrentPage: number;
    size: number;
}

export const participantSlice = createSlice({
    name: 'profileSlice',
    initialState: {
        feedbackPrevPage: 0,
        feedbackCurrentPage: 0,
        pointPrevPage: 0,
        pointCurrentPage: 0,
        voucherPrevPage: 0,
        voucherCurrentPage: 0,
        size: 10,
    } as ParticipantState,
    reducers: {
        setFeedbackPage: (state, action) => {
            const {prevPage, currentPage} = action.payload;
            state.feedbackPrevPage = prevPage ?? state.feedbackCurrentPage;
            state.feedbackCurrentPage = currentPage;
        },
        setPointPage: (state, action) => {
            const {prevPage, currentPage} = action.payload;
            state.pointPrevPage = prevPage ?? state.pointCurrentPage;
            state.pointCurrentPage = currentPage;
        },
        setVoucherPage: (state, action) => {
            const {prevPage, currentPage} = action.payload;
            state.voucherPrevPage = prevPage ?? state.voucherCurrentPage;
            state.voucherCurrentPage = currentPage;
        }
    }
});
