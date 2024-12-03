import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {eventApi, RetrieveEventResponse, SearchEventRequest} from "@/src/stores/apis/eventApi";
import {useEffect} from "react";
import {searcherSlice} from "@/src/stores/slices/searcherSlice";
import {searchSlice} from "@/src/stores/slices/searchSlice";

export const useSearch = () => {
    const dispatch = useDispatch();

    const searchState = useSelector((state: RootState) => state.searchSlice);

    const searcherState = useSelector((state: RootState) => state.searcherSlice);

    const eventApiResult = eventApi.useSearchEventsQuery(searcherState.request)

    const setRequest = (request: SearchEventRequest) => {
        dispatch(searchSlice.actions.setPage({
            prevPage: 0,
            currentPage: 0,
        }));
        dispatch(searcherSlice.actions.setRequest(request));
    }


    const setPage = (page: number) => {
        if (page >= 0) {
            dispatch(searchSlice.actions.setPage({
                currentPage: page
            }));
            dispatch(searcherSlice.actions.setRequest({
                page: page,
            }));
        }
    }

    useEffect(() => {
        let newEvents: RetrieveEventResponse[] = [];
        if (searcherState.request.filters.length > 0) {
            newEvents = eventApiResult.data?.data ?? [];
        }
        dispatch(searcherSlice.actions.setEvents({events: newEvents}));
    }, [dispatch, eventApiResult.data]);

    useEffect(() => {
        eventApiResult.refetch();
    }, [searchState.prevPage, searchState.currentPage]);

    useEffect(() => {
        setRequest({
            page: 0,
            size: 10,
            search: '',
            filters: ["name", "description", "category", "location", "time"]
        });
        eventApiResult.refetch();
    }, []);


    return {
        eventApiResult,
        searcherState,
        setRequest,
        setPage
    };
}
