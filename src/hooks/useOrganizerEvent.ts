import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {CreateEventRequest, organizerApi, PatchEventRequest} from "@/src/stores/apis/organizerApi";
import {organizerSlice} from "@/src/stores/slices/organizerSlice";
import {useParams} from "next/navigation";
import {useEffect} from "react";
import moment from "moment";

export const useOrganizerEvent = () => {
    const dispatch = useDispatch();
    const {eventId}: { eventId: string } = useParams();
    const [createEventApiTrigger] = organizerApi.useLazyCreateEventQuery();
    const [patchEventApiTrigger] = organizerApi.useLazyPatchEventQuery();
    const [deleteEventApiTrigger] = organizerApi.useLazyDeleteEventQuery();
    const retrieveEventApiResult = organizerApi.useRetrieveEventQuery({id: eventId});

    const organizerState = useSelector((state: RootState) => state.organizerSlice);

    const retrieveEventParticipantsApiResult = organizerApi.useRetrieveEventParticipantsQuery({
        eventId: eventId,
        page: organizerState.currentPage,
        size: organizerState.size
    });

    const setPage = (page: number) => {
        if (page >= 0) {
            dispatch(organizerSlice.actions.setPage({
                currentPage: page
            }));
        }
    }

    useEffect(() => {
        const newEventParticipants = retrieveEventParticipantsApiResult.data?.data ?? [];
        dispatch(organizerSlice.actions.setEventParticipants({eventParticipants: newEventParticipants}));
    }, [retrieveEventParticipantsApiResult.data]);

    useEffect(() => {
        retrieveEventParticipantsApiResult.refetch();
    }, [organizerState.prevPage, organizerState.currentPage]);

    useEffect(() => {
        setPage(0);
        retrieveEventApiResult.refetch();
        retrieveEventParticipantsApiResult.refetch();
    }, []);

    const createEvent = async (request: CreateEventRequest) => {
        const createEventApiResult = await createEventApiTrigger(request).unwrap();
        return createEventApiResult;
    }

    const deleteEvent = async (request: { id: string }) => {
        const deleteEventApiResult = await deleteEventApiTrigger(request).unwrap();
        return deleteEventApiResult;
    }

    const patchEvent = async (request: PatchEventRequest) => {
        const patchEventApiResult = await patchEventApiTrigger(request).unwrap();
        const values = patchEventApiResult.data;
        if (values) {
            dispatch(organizerSlice.actions.setEvent({
                event: {
                    ...values,
                    time: moment(values.time).format('YYYY-MM-DDTHH:mm'),
                    eventVouchers: values.eventVouchers.map((voucher) => ({
                        ...voucher,
                        startedAt: moment(voucher.startedAt).format('YYYY-MM-DDTHH:mm'),
                        endedAt: moment(voucher.endedAt).format('YYYY-MM-DDTHH:mm'),
                    }))
                }
            }));
        } else {
            dispatch(organizerSlice.actions.setEvent({
                event: undefined,
            }));
        }
        return patchEventApiResult;
    }

    useEffect(() => {
        const values = retrieveEventApiResult.data?.data;
        if (values) {
            dispatch(organizerSlice.actions.setEvent({
                event: {
                    ...values,
                    time: moment(values.time).format('YYYY-MM-DDTHH:mm'),
                    eventVouchers: values.eventVouchers.map((voucher) => ({
                        ...voucher,
                        startedAt: moment(voucher.startedAt).format('YYYY-MM-DDTHH:mm'),
                        endedAt: moment(voucher.endedAt).format('YYYY-MM-DDTHH:mm'),
                    }))
                },
            }));
        }
    }, [retrieveEventApiResult.data]);

    return {
        eventId,
        eventManagementState: organizerState,
        retrieveEventApiResult,
        setPage,
        createEvent,
        deleteEvent,
        patchEvent
    };
}
