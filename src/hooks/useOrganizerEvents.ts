import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {organizerEventApi} from "@/src/stores/apis/organizerEventApi";
import {useEffect} from "react";
import {eventManagementSlice} from "@/src/stores/slices/eventManagementSlice";

export const useOrganizerEvents = () => {
    const dispatch = useDispatch();

    const eventManagementState = useSelector((state: RootState) => state
        .eventManagementSlice);

    const organizerEventApiResult = organizerEventApi.useRetrieveEventsQuery({
        page: eventManagementState.currentPage,
        size: eventManagementState.size
    });

    const setPage = (page: number) => {
        if (page >= 0) {
            dispatch(eventManagementSlice.actions.setPage({
                currentPage: page
            }));
        }
    }

    useEffect(() => {
        organizerEventApiResult.refetch();
    }, [eventManagementState.currentPage]);

    return {
        organizerEventApiResult,
        eventManagementState,
        setPage
    };
}
