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

    const refreshUpdateForm = (event: RetrieveEventResponse) => {
        dispatch(eventManagementSlice.actions.refreshUpdateForm({
            event: event,
        }));
    }

    const createEvent = async (request: CreateEventRequest) => {
        const createEventApiResult = await createEventApiTrigger(request).unwrap();
        console.log("Creating event...");
        setIsCreatingEvent(false);
        return createEventApiResult;
    }

    const setEventId = (eventId: string) => {
        dispatch(eventManagementSlice.actions.setEventId(eventId));
    }

    const updateEvent = async (request: RetrieveEventResponse) => {
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
        createEvent,
        updateEvent,
        setIsCreatingEvent,
        setEventId,
        refreshUpdateForm,
    };
}
