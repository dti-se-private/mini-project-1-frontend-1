import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery, ResponseBody} from "@/src/stores/apis";

export interface Event {
    id: string;
    accountId: string;
    name: string;
    description: string;
    location: string;
    category: string;
    time: string;
    price: number;
    slots: number;
    vouchers: Voucher[];
}

export interface Voucher {
    id: string;
    accountId: string;
    name: string;
    description: string;
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
        baseUrl: "http://localhost:8080/events"
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
        getEventDetails: builder.query<ApiResponse<Event>, {id: string}>({
            query: ({id}) => `/events/${id}`,
        }),
    })
});
