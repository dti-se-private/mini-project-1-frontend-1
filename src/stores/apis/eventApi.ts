import {createApi} from "@reduxjs/toolkit/query/react";
import {ApiResponse, rootBaseQuery} from "@/src/stores/apis";

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
    baseQuery: rootBaseQuery,
    endpoints: (builder) => ({
        getEventsByCategory: builder.query<ApiResponse<Event[]>, SearchEventRequest>({
            query: ({category, page, size}) => `/events?category=${category}&page=${page}&size=${size}`,
        }),
        getEventDetails: builder.query<ApiResponse<Event>, {id: string}>({
            query: ({id}) => `/events/${id}`,
        }),
    })
});
