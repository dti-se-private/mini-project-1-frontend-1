import {createSlice} from "@reduxjs/toolkit"
import {CreateEventRequest, CreateEventVoucherRequest} from "@/src/stores/apis/organizerEventApi";
import {RetrieveEventResponse} from "@/src/stores/apis/eventApi";

export interface OrganizerManagementState {
    prevPage: number;
    currentPage: number;
    size: number;
    createForm: CreateEventRequest;
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
        createForm: {
            name: "",
            description: "",
            location: "",
            category: "",
            time: "",
            bannerImageUrl: "",
            vouchers: [] as CreateEventVoucherRequest[],
        } as CreateEventRequest,
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
        resetCreateForm: (state) => {
            state.createForm = {
                name: "",
                description: "",
                location: "",
                category: "",
                time: "",
                bannerImageUrl: "",
                vouchers: [] as CreateEventVoucherRequest[],
            };
        },
        refreshCreateForm: (state, action) => {
            const {event} = action.payload;
            state.createForm = event;
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
