import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {feedbackModalSlice} from "@/src/stores/slices/feedbackModalSlice";
import {CreateFeedbackRequest, RetrieveFeedbackResponse} from "@/src/stores/apis/participantApi";

export const useFeedbackModal = () => {
    const dispatch = useDispatch();

    const state = useSelector((state: RootState) => state.feedbackModalSlice);

    const setContent = (content: {
        header: string,
        body: string,
        bodyType: string,
    }) => {
        dispatch(feedbackModalSlice.actions.setContent(content));
    }

    const onOpenChange = (isOpen: boolean) => {
        dispatch(feedbackModalSlice.actions.onOpenChange(isOpen));
    }

    const setFeedbackRequest = (
        feedbackRequest: CreateFeedbackRequest) => {
        dispatch(feedbackModalSlice.actions.setFeedbackRequest(feedbackRequest));
    }

    const setTransaction = (transaction: RetrieveFeedbackResponse) => {
        dispatch(feedbackModalSlice.actions.setTransaction(transaction));
    }

    const setFeedbackId = (feedbackId: string) => {
        dispatch(feedbackModalSlice.actions.setFeedbackId(feedbackId));
    }

    return {
        state,
        setContent,
        onOpenChange,
        setFeedbackRequest,
        setTransaction,
        setFeedbackId,
    };
}
