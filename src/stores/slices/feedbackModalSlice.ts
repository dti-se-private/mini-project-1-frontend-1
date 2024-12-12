import {createSlice} from "@reduxjs/toolkit";
import {ReactNode} from "react";
import {CreateFeedbackRequest, RetrieveFeedbackResponse} from "@/src/stores/apis/participantApi";

export interface ModalState {
    isOpen: boolean;
    header?: ReactNode;
    body?: ReactNode;
    bodyType?: string;
    transaction?: RetrieveFeedbackResponse;
    feedbackRequest?: CreateFeedbackRequest;
    feedbackId?: string;
}

export const feedbackModalSlice = createSlice({
    name: 'feedbackModalSlice',
    initialState: {
        isOpen: false,
        header: undefined,
        body: undefined,
        bodyType: undefined,
        transaction: undefined,
        feedbackRequest: undefined,
        feedbackId: undefined,
    } as ModalState,
    reducers: {
        setContent: (state, action) => {
            const {header, body, bodyType} = action.payload;
            state.header = header;
            state.body = body;
            state.bodyType = bodyType;
        },
        onOpenChange: (state, action) => {
            state.isOpen = action.payload;
        },
        setFeedbackRequest: (state, action) => {
            state.feedbackRequest = action.payload;
        },
        setTransaction: (state, action) => {
            state.transaction = action.payload
        },
        setFeedbackId: (state, action) => {
            state.feedbackId = action.payload;
        }
    }
});
