import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {CreateEventRequest, organizerEventApi, PatchEventRequest} from "@/src/stores/apis/organizerEventApi";
import {eventManagementSlice} from "@/src/stores/slices/eventManagementSlice";
import {useParams} from "next/navigation";
import {useEffect} from "react";
import moment from "moment";

export const useOrganizerEvent = () => {
    const dispatch = useDispatch();
    const {id: eventId}: { id: string } = useParams();
    const [createEventApiTrigger] = organizerEventApi.useLazyCreateEventQuery();
    const [patchEventApiTrigger] = organizerEventApi.useLazyPatchEventQuery();
    const [deleteEventApiTrigger] = organizerEventApi.useLazyDeleteEventQuery();
    const retrieveEventApiResult = organizerEventApi.useRetrieveEventQuery({id: eventId});

    const eventManagementState = useSelector((state: RootState) => state
        .eventManagementSlice);

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
            dispatch(eventManagementSlice.actions.setEvent({
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
            dispatch(eventManagementSlice.actions.setEvent({
                event: undefined,
            }));
        }
        return patchEventApiResult;
    }

    useEffect(() => {
        retrieveEventApiResult.refetch();
    }, []);

    useEffect(() => {
        const values = retrieveEventApiResult.data?.data;
        if (values) {
            dispatch(eventManagementSlice.actions.setEvent({
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
        eventManagementState,
        retrieveEventApiResult,
        createEvent,
        deleteEvent,
        patchEvent
    };
}
