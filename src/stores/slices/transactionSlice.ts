import {createSlice} from "@reduxjs/toolkit";
import {TransactionCheckoutResponse} from "@/src/stores/apis/transactionApi";
import {RetrieveEventResponse} from "@/src/stores/apis/eventApi";

export interface TransactionState {
    triedCheckout?: TransactionCheckoutResponse
    finalizedCheckout?: TransactionCheckoutResponse
    event?: RetrieveEventResponse
}

export const transactionSlice = createSlice({
    name: 'transactionSlice',
    initialState: {
        triedCheckout: undefined,
        finalizedCheckout: undefined,
        event: undefined,
    } as TransactionState,
    reducers: {
        setEvent: (state, action) => {
            const {event} = action.payload;
            state.event = event;
        },
        setTriedCheckout: (state, action) => {
            const {triedCheckout} = action.payload;
            state.triedCheckout = triedCheckout;
        },
        setFinalizedCheckout: (state, action) => {
            const {finalizedCheckout} = action.payload;
            state.finalizedCheckout = finalizedCheckout;
        }
    },
});
