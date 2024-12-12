import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery, ResponseBody} from "@/src/stores/apis";
import {RetrieveEventTicketResponse, RetrieveEventVoucherResponse} from "@/src/stores/apis/eventApi";

export interface TransactionEventDetailResponse {
    id: string;
    name: string;
    description: string;
    time: string;
    location: string;
    category: string;
    eventTickets: RetrieveEventTicketResponse[];
    eventVouchers: RetrieveEventVoucherResponse[];
}

export interface TransactionDetailResponse {
    transactionId: string;
    eventId: string;
    time: string;
    usedPoints: UsedPointResponse[];
    usedVouchers: UsedVoucherResponse[];
}

export interface UsedPointResponse {
    fixedAmount: number;
    endedAt: string;
}

export interface UsedVoucherResponse {
    name: string;
    description: string;
    code: string;
    variableAmount: number;
    endedAt: string;
}

export interface RetrieveAllTransactionResponse {
    transactionId: string;
    eventId: string;
    eventName: string;
    time: Date;
}

export interface RetrieveAllPointResponse {
    fixedAmount: number;
    endedAt: Date;
}

export interface RetrieveAllVoucherResponse {
    name: string;
    description: string;
    code: string;
    variableAmount: number;
    endedAt: Date;
}

export interface RetrieveAllFeedbackResponse {
    transactionId: string;
    eventId: string;
    eventName: string;
    time: Date;
    feedback: RetrieveFeedbackResponse;
}

export interface RetrieveFeedbackResponse {
    id: string;
    rating: number;
    review: string;
}

export interface CreateFeedbackRequest {
    transactionId: string;
    rating: number;
    review: string;
}

export interface CreateFeedbackResponse {
    id: string;
    transactionId: string;
    rating: number;
    review: string;
}

export interface SearchRequest {
    page: number;
    size: number;
}

export const participantApi = createApi({
    reducerPath: "participantApi",
    baseQuery: axiosBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_1_URL}/participant`
    }),
    endpoints: (builder) => ({
        getTransactions: builder.query<ResponseBody<RetrieveAllTransactionResponse[]>, SearchRequest>({
            // @ts-expect-error: Still compatible even in type lint error.
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const queryParams = [
                    `page=${args.page}`,
                    `size=${args.size}`
                ];
                return baseQuery({
                    url: `/transactions?${queryParams.join("&")}`,
                    method: "GET"
                });
            }
        }),
        getPoints: builder.query<ResponseBody<RetrieveAllPointResponse[]>, SearchRequest>({
            // @ts-expect-error: Still compatible even in type lint error.
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const queryParams = [
                    `page=${args.page}`,
                    `size=${args.size}`
                ];
                return baseQuery({
                    url: `/points?${queryParams.join("&")}`,
                    method: "GET"
                });
            }
        }),
        getVouchers: builder.query<ResponseBody<RetrieveAllVoucherResponse[]>, SearchRequest>({
            // @ts-expect-error: Still compatible even in type lint error.
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const queryParams = [
                    `page=${args.page}`,
                    `size=${args.size}`
                ];
                return baseQuery({
                    url: `/vouchers?${queryParams.join("&")}`,
                    method: "GET"
                });
            }
        }),
        getFeedbacks: builder.query<ResponseBody<RetrieveAllFeedbackResponse[]>, SearchRequest>({
            // @ts-expect-error: Still compatible even in type lint error.
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const queryParams = [
                    `page=${args.page}`,
                    `size=${args.size}`
                ];
                return baseQuery({
                    url: `/feedbacks?${queryParams.join("&")}`,
                    method: "GET"
                });
            }
        }),
        createFeedback: builder.mutation<ResponseBody<CreateFeedbackResponse>, CreateFeedbackRequest>({
            // @ts-expect-error: Still compatible even in type lint error.
            queryFn: async (args, api, extraOptions, baseQuery) => {
                return baseQuery({
                    url: `/feedbacks`,
                    method: "POST",
                    data: args,
                });
            }
        }),
        deleteFeedback: builder.mutation<ResponseBody<void>, { id: string }>({
            // @ts-expect-error: Still compatible even in type lint error.
            queryFn: async (args, api, extraOptions, baseQuery) => {
                return baseQuery({
                    url: `/feedbacks/${args.id}`,
                    method: "DELETE",
                    data: args,
                });
            }
        }),
        getTransactionDetail: builder.query<ResponseBody<TransactionDetailResponse>, { id: string }>({
            // @ts-expect-error: Still compatible even in type lint error.
            queryFn: async (args, api, extraOptions, baseQuery) => {
                return baseQuery({
                    url: `/transactions/${args.id}`,
                    method: "GET"
                });
            }
        }),
        getTransactionEventDetail: builder.query<ResponseBody<TransactionEventDetailResponse>, {
            id: string,
            eventId: string,
        }>({
            // @ts-expect-error: Still compatible even in type lint error.
            queryFn: async (args, api, extraOptions, baseQuery) => {
                return baseQuery({
                    url: `/transactions/${args.id}/${args.eventId}`,
                    method: "GET"
                });
            }
        }),
    })
});
