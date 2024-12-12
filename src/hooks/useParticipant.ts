import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {useEffect} from "react";
import {CreateFeedbackRequest, participantApi} from "@/src/stores/apis/participantApi";
import {participantSlice} from "@/src/stores/slices/participantSlice";

export const useParticipant = () => {
    const dispatch = useDispatch();
    const state = useSelector((state: RootState) => state.profileSlice);

    const feedbackApiResult = participantApi.useGetFeedbacksQuery({
        page: state.feedbackCurrentPage,
        size: state.size,
    })
    const pointApiResult = participantApi.useGetPointsQuery({
        page: state.pointCurrentPage,
        size: state.size,
    })
    const voucherApiResult = participantApi.useGetVouchersQuery({
        page: state.voucherCurrentPage,
        size: state.size,
    })
    const transactionApiResult = participantApi.useGetTransactionsQuery({
        page: state.transactionCurrentPage,
        size: state.size,
    })
    const [createFeedbackApiTrigger, createFeedbackApiResult] = participantApi.useCreateFeedbackMutation();
    const [deleteFeedbackApiTrigger, deleteFeedbackApiResult] = participantApi.useDeleteFeedbackMutation();

    const createFeedback = async (request: CreateFeedbackRequest) => {
        return await createFeedbackApiTrigger(request).unwrap();
    }

    const deleteFeedback = async (request: { id: string }) => {
        return await deleteFeedbackApiTrigger(request).unwrap();
    }

    const setFeedbackPage = (page: number) => {
        if (page >= 0) {
            dispatch(participantSlice.actions.setFeedbackPage({
                currentPage: page
            }));
        }
    }
    const setPointPage = (page: number) => {
        if (page >= 0) {
            dispatch(participantSlice.actions.setPointPage({
                currentPage: page
            }));
        }
    }
    const setVoucherPage = (page: number) => {
        if (page >= 0) {
            dispatch(participantSlice.actions.setVoucherPage({
                currentPage: page
            }));
        }
    }
    const setTransactionPage = (page: number) => {
        if (page >= 0) {
            dispatch(participantSlice.actions.setTransactionPage({
                currentPage: page
            }));
        }
    }

    useEffect(() => {
        feedbackApiResult.refetch();
    }, [state.feedbackCurrentPage]);
    useEffect(() => {
        pointApiResult.refetch();
    }, [state.pointCurrentPage]);
    useEffect(() => {
        voucherApiResult.refetch();
    }, [state.voucherCurrentPage]);
    useEffect(() => {
        transactionApiResult.refetch();
    }, [state.transactionCurrentPage]);

    return {
        state,
        feedbackApiResult,
        pointApiResult,
        voucherApiResult,
        transactionApiResult,
        createFeedback,
        createFeedbackApiResult,
        deleteFeedback,
        deleteFeedbackApiResult,
        setFeedbackPage,
        setPointPage,
        setVoucherPage,
        setTransactionPage,
    };
}