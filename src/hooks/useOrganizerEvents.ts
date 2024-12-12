import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {organizerApi} from "@/src/stores/apis/organizerApi";
import {useEffect} from "react";
import {organizerSlice} from "@/src/stores/slices/organizerSlice";

export const useOrganizerEvents = () => {
    const dispatch = useDispatch();

    const organizerState = useSelector((state: RootState) => state.organizerSlice);

    const organizerEventApiResult = organizerApi.useRetrieveEventsQuery({
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
        setPage(0);
        organizerEventApiResult.refetch();
    }, []);

    useEffect(() => {
        organizerEventApiResult.refetch();
    }, [organizerState.currentPage]);

    return {
        organizerEventApiResult,
        organizerState,
        setPage
    };
}
