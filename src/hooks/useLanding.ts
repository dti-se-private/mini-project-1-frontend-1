import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {eventApi} from "@/src/stores/apis/eventApi";
import {useEffect} from "react";
import {searcherSlice} from "@/src/stores/slices/searcherSlice";
import {landingSlice} from "@/src/stores/slices/landingSlice";

export const useLanding = () => {
    const dispatch = useDispatch();

    const landingState = useSelector((state: RootState) => state.landingSlice);

    const searcherState = useSelector((state: RootState) => state.searcherSlice);

    const eventApiResult = eventApi.useSearchEventsQuery(searcherState.request)

    const setCategory = (category: string) => {
        dispatch(landingSlice.actions.setPage({
            prevPage: 0,
            currentPage: 0,
        }));
        dispatch(searcherSlice.actions.setRequest({
            page: 0,
            search: category === "all" ? "" : category,
            filters: ["category"]
        }));
    }

    const setPage = (page: number) => {
        if (page >= 0) {
            dispatch(landingSlice.actions.setPage({
                currentPage: page
            }));
            dispatch(searcherSlice.actions.setRequest({
                page: page,
            }));
        }
    }

    useEffect(() => {
        const newEvents = eventApiResult.data?.data ?? [];
        dispatch(searcherSlice.actions.setEvents({events: newEvents}));
    }, [eventApiResult.data]);

    useEffect(() => {
        eventApiResult.refetch();
    }, [landingState.prevPage, landingState.currentPage]);

    useEffect(() => {
        eventApiResult.refetch();
    }, []);

    return {
        eventApiResult,
        searcherState,
        setCategory,
        setPage
    };
}
