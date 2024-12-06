import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {CreateEventRequest, organizerEventApi} from "@/src/stores/apis/organizerEventApi";
import {eventManagementSlice} from "@/src/stores/slices/eventManagementSlice";
import {RetrieveEventResponse} from "@/src/stores/apis/eventApi";

export const useOrganizerEventsMutation = () => {
    const dispatch = useDispatch();
    const [createEventApiTrigger] = organizerEventApi.useLazyCreateEventQuery();
    const [updateEventApiTrigger] = organizerEventApi.useLazyUpdateEventQuery();

    const eventManagementState = useSelector((state: RootState) => state
        .eventManagementSlice);

    const addVoucher = (actionType: string) => {
        dispatch(eventManagementSlice.actions.addVoucher({actionType}));
    }

    const removeVoucher = (actionType: string, voucherIndex: number) => {
        dispatch(eventManagementSlice.actions.addVoucher({actionType, voucherIndex}));
    }

    const resetCreateForm = () => {
        dispatch(eventManagementSlice.actions.resetCreateForm());
    }

    const createForm = async (request: CreateEventRequest) => {
        const createEventApiResult = await createEventApiTrigger(request).unwrap();
        setIsCreatingEvent(false);
        return createEventApiResult;
    }

    const updateForm = async (request: RetrieveEventResponse) => {
        const updateEventApiResult = await updateEventApiTrigger(request).unwrap();

        dispatch(eventManagementSlice.actions.refreshUpdateForm({
            event: updateEventApiResult.data,
        }));

        return updateEventApiResult;
    }

    const setIsCreatingEvent = (isCreatingEvent: boolean) => {
        dispatch(eventManagementSlice.actions.setIsCreatingEvent(isCreatingEvent));
    }

    return {
        state: eventManagementState,
        addVoucher,
        removeVoucher,
        resetCreateForm,
        createForm,
        updateForm,
        setIsCreatingEvent,
    };
}
