import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {useEffect} from "react";
import {useParams} from "next/navigation";
import {transactionApi, TransactionCheckoutRequest} from "@/src/stores/apis/transactionApi";
import {eventApi} from "@/src/stores/apis/eventApi";
import {transactionSlice} from "@/src/stores/slices/transactionSlice";

export const useTransaction = () => {
    const dispatch = useDispatch();

    const {id: eventId}: { id: string } = useParams();
    const eventApiResult = eventApi.useRetrieveEventQuery({id: eventId});
    const [checkoutApiTrigger, checkoutApiResult] = transactionApi.useCheckoutMutation();
    const [tryCheckoutApiTrigger, tryCheckoutApiResult] = transactionApi.useTryCheckoutMutation();
    const state = useSelector((state: RootState) => state.transactionSlice);

    const tryCheckout = async (request: TransactionCheckoutRequest) => {
        const tryCheckoutApiResult = await tryCheckoutApiTrigger(request).unwrap();
        dispatch(transactionSlice.actions.setTriedCheckout({
            triedCheckout: tryCheckoutApiResult.data,
        }));
        return tryCheckoutApiResult;
    }

    const checkout = async (request: TransactionCheckoutRequest) => {
        const checkoutApiResult = await checkoutApiTrigger(request).unwrap();
        dispatch(transactionSlice.actions.setFinalizedCheckout({
            finalizedCheckout: checkoutApiResult.data,
        }));
        return checkoutApiResult;
    }

    useEffect(() => {
        eventApiResult.refetch();
        return () => {
            dispatch(transactionSlice.actions.setEvent({
                event: undefined,
            }))
        }
    }, [])

    useEffect(() => {
        dispatch(transactionSlice.actions.setEvent({
            event: eventApiResult.data?.data,
        }));
    }, [eventApiResult.data])

    return {
        eventId,
        eventApiResult,
        checkoutApiResult,
        tryCheckoutApiResult,
        state,
        tryCheckout,
        checkout,
    };
}