import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery, ResponseBody} from "@/src/stores/apis";

export interface Event {
    id: string;
    accountId: string;
    name: string;
    location: string;
    category: string;
    time: string;
    price: number;
    slots: number;
}

export interface SearchEventRequest {
    category: string;
    page: number;
    size: number;
    search: string;
    filter: string[];
}

export const eventApi = createApi({
    reducerPath: "eventApi",
    baseQuery: axiosBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_1_URL}/events`
    }),
    endpoints: (builder) => ({
        getEventsByCategory: builder.query<ResponseBody<Event[]>, SearchEventRequest>({
            // @ts-expect-error: Still compatible even in type lint error.
            queryFn: async (args, api, extraOptions, baseQuery) => {
                return baseQuery({
                    url: `?category=${args.category}&page=${args.page}&size=${args.size}`,
                    method: "GET"
                });
            }
        }),
    })
});
