import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery, ResponseBody} from "@/src/stores/apis";

export interface TransactionTicketFieldCheckoutRequest {
    key: string;
    value: string;
}

export interface TransactionTicketCheckoutRequest {
    eventTicketId: string;
    fields: TransactionTicketFieldCheckoutRequest[];
}

export interface TransactionCheckoutRequest {
    eventId: string;
    transactionTickets: TransactionTicketCheckoutRequest[];
    voucherCodes: string[];
    points: number;
}

export interface TransactionTicketFieldCheckoutResponse {
    key: string;
    value: string;
}

export interface TransactionTicketCheckoutResponse {
    id: string;
    eventTicketId: string;
    fields: TransactionTicketFieldCheckoutResponse[];
}

export interface TransactionCheckoutResponse {
    id: string;
    eventId: string;
    transactionTickets: TransactionTicketCheckoutResponse[];
    voucherCodes: string[];
    points: number;
    finalPrice: number;
}

export const transactionApi = createApi({
    reducerPath: "transactionApi",
    baseQuery: axiosBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_1_URL}/transactions`
    }),
    endpoints: (builder) => ({
        checkout: builder.mutation<ResponseBody<TransactionCheckoutResponse>, TransactionCheckoutRequest>({
            // @ts-expect-error: Still compatible even in type lint error.
            queryFn: async (args, api, extraOptions, baseQuery) => {
                return baseQuery({
                    url: `/checkout`,
                    method: "POST",
                    data: args,
                });
            }
        }),
        tryCheckout: builder.mutation<ResponseBody<TransactionCheckoutResponse>, TransactionCheckoutRequest>({
            // @ts-expect-error: Still compatible even in type lint error.
            queryFn: async (args, api, extraOptions, baseQuery) => {
                return baseQuery({
                    url: `/try-checkout`,
                    method: "POST",
                    data: args,
                });
            }
        }),
    })
});
