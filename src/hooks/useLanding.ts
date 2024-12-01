import {useDispatch, useSelector} from "react-redux";
import {landingSlice} from "@/src/stores/slices/landingSlice";
import {RootState} from "@/src/stores";
import {eventApi} from "@/src/stores/apis/eventApi";
import {useEffect} from "react";

export const useLanding = () => {
    const dispatch = useDispatch();

    const state = useSelector((state: RootState) => state.landingSlice);

    const api = eventApi.useGetEventsByCategoryQuery(
        {
            category: state.category,
            page: state.page,
            size: state.size,
            search: state.search,
            filter: state.filter,
        }
    )

    const setCategory = (category: string) => {
        dispatch(landingSlice.actions.setCategory({category}));
    }

    const setPage = (page: number) => {
        dispatch(landingSlice.actions.setPage({page}));
    }

    useEffect(() => {
        api.refetch();
    }, [state.category, api.refetch]);

    useEffect(() => {
        if (state.page > state.prevPage) {
            api.refetch();
        }
    }, [state.page, state.prevPage, api.refetch]);

    useEffect(() => {
        if (api.data) {
            dispatch(landingSlice.actions.setEvents({events: api.data.data}));
        }
    }, [api.data, dispatch]);

    return {
        api,
        state,
        setCategory,
        setPage
    };
}
