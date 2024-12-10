import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery, ResponseBody} from "@/src/stores/apis";

export interface RetrieveAllFeedbackResponse {
    transactionId: string;
    eventId: string;
    eventName: string;
    time: string;
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

export interface SearchFeedbacks {
    page: number;
    size: number;
}

export const participantApi = createApi({
    reducerPath: "participantApi",
    baseQuery: axiosBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_1_URL}/participant`
    }),
    endpoints: (builder) => ({
        getFeedbacks: builder.query<ResponseBody<RetrieveAllFeedbackResponse[]>, SearchFeedbacks>({
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
    })
});
