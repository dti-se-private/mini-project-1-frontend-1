import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {CreateEventRequest, organizerEventApi, UpdateEventResponse} from "@/src/stores/apis/organizerEventApi";
import {eventManagementSlice} from "@/src/stores/slices/eventManagementSlice";

export const useOrganizerEventsMutation = () => {
    const dispatch = useDispatch();
    const [createEventApiTrigger] = organizerEventApi.useLazyCreateEventQuery();
    const [updateEventApiTrigger] = organizerEventApi.useLazyUpdateEventQuery();

    const eventManagementState = useSelector((state: RootState) => state
        .eventManagementSlice);

    const refreshUpdateForm = (event: UpdateEventResponse) => {
        dispatch(eventManagementSlice.actions.refreshUpdateForm({
            event: event,
        }));
    }

    const createEvent = async (request: CreateEventRequest) => {
        const createEventApiResult = await createEventApiTrigger(request).unwrap();
        setIsLoading(false);
        return createEventApiResult;
    }

    const updateEvent = async (request: UpdateEventResponse) => {
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
        updateEvent,
        setIsLoading,
        refreshUpdateForm,
    };
}
