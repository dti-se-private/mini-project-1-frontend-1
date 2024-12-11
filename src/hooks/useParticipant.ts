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

    useEffect(() => {
        feedbackApiResult.refetch();
    }, [state.feedbackCurrentPage]);

    return {
        state,
        feedbackApiResult,
        createFeedback,
        createFeedbackApiResult,
        deleteFeedback,
        deleteFeedbackApiResult,
        setFeedbackPage,
    };
}