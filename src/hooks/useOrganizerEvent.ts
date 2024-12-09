import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {
    CreateEventRequest,
    organizerEventApi,
    PatchEventRequest,
    PatchEventResponse
} from "@/src/stores/apis/organizerEventApi";
import {eventManagementSlice} from "@/src/stores/slices/eventManagementSlice";

export const useOrganizerEvents = () => {
    const dispatch = useDispatch();
    const [createEventApiTrigger] = organizerEventApi.useLazyCreateEventQuery();
    const [updateEventApiTrigger] = organizerEventApi.useLazyPatchEventQuery();

    const eventManagementState = useSelector((state: RootState) => state
        .eventManagementSlice);

    const refreshPatchForm = (event: PatchEventResponse) => {
        dispatch(eventManagementSlice.actions.refreshUpdateForm({
            event: event,
        }));
    }

    const createEvent = async (request: CreateEventRequest) => {
        const createEventApiResult = await createEventApiTrigger(request).unwrap();
        setIsLoading(false);
        return createEventApiResult;
    }

    const patchEvent = async (request: PatchEventRequest) => {
        const updateEventApiResult = await updateEventApiTrigger(request).unwrap();

        dispatch(eventManagementSlice.actions.refreshUpdateForm({
            event: updateEventApiResult.data,
        }));

        return updateEventApiResult;
    }

    const setIsLoading = (isLoading: boolean) => {
        dispatch(eventManagementSlice.actions.setIsLoading(isLoading));
    }

    return {
        state: eventManagementState,
        createEvent,
        patchEvent,
        setIsLoading,
        refreshUpdateForm: refreshPatchForm,
    };
}
