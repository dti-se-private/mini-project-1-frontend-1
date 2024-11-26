import {
    useDispatch,
    useSelector
} from "react-redux";
import {rootSlice} from "@/src/stores/slice";
import {RootState} from "@/src/stores";
import {EventOverview, interfaceApi} from "@/src/stores/api";

export interface BasicEventContextType {
    data: EventOverview[];
    isLoading: boolean;
    error: unknown;
    category: string;
    page: number;
    size: number;
    setCategory: (category: string) => void;
    setPage: (page: number) => void;
}

const useBasicEvent = (): BasicEventContextType => {
    const dispatch = useDispatch();
    const { events, category, page, size } = useSelector((state: RootState) => state.root);

    const { isLoading, error } = interfaceApi.useGetEventsByCategoryQuery({
        category,
        page,
        size,
    })

    const setCategory = (category: string) => {
        dispatch(rootSlice.actions.setCategory(category));
    }

    const setPage = (page: number) => {
        dispatch(rootSlice.actions.setPage(page));
    }

    return {
        data: events ?? [],
        isLoading,
        error,
        category,
        page,
        size,
        setCategory,
        setPage
    };
}

export default useBasicEvent;