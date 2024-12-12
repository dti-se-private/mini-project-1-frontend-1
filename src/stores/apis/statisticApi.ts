import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery, ResponseBody} from "@/src/stores/apis";

export interface EventStatisticRequest {
    type: string
    aggregation: string
    period: string
}

export interface EventStatisticSeriesResponse {
    x: string
    y: number
}

export const statisticApi = createApi({
    reducerPath: "statisticApi",
    baseQuery: axiosBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_1_URL}/statistics`
    }),
    endpoints: (builder) => ({
        retrieveEventStatistic: builder.query<ResponseBody<EventStatisticSeriesResponse[]>, EventStatisticRequest>({
            // @ts-expect-error: Still compatible even in type lint error.
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const queryParams = [
                    `type=${args.type}`,
                    `aggregation=${args.aggregation}`,
                    `period=${args.period}`,
                ];
                return baseQuery({
                    url: `/events?${queryParams.join("&")}`,
                    method: "GET"
                });
            }
        }),
    })
});
