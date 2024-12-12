import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery, ResponseBody} from "@/src/stores/apis";

export interface RetrieveOrganizerAccountResponse {
    id: string;
    name: string;
    email: string;
    phone: string;
    dob: string;
    profileImageUrl: string;
}

export interface RetrieveEventTicketFieldResponse {
    id: string;
    key: string;
}

export interface RetrieveEventTicketResponse {
    id: string;
    name: string;
    description: string;
    price: number;
    slots: number;
    fields: RetrieveEventTicketFieldResponse[];
}

export interface RetrieveEventVoucherResponse {
    id: string;
    code: string;
    name: string;
    description: string;
    variableAmount: number;
    startedAt: string;
    endedAt: string;
}

export interface RetrieveEventResponse {
    id: string;
    name: string;
    description: string;
    location: string;
    category: string;
    time: string;
    bannerImageUrl: string;
    organizerAccount: RetrieveOrganizerAccountResponse;
    eventTickets: RetrieveEventTicketResponse[];
    eventVouchers: RetrieveEventVoucherResponse[];
    participantCount: number;
}

export interface SearchEventRequest {
    page: number;
    size: number;
    search: string;
    filters: string[];
}

export const eventApi = createApi({
    reducerPath: "eventApi",
    baseQuery: axiosBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_1_URL}/events`
    }),
    endpoints: (builder) => ({
        searchEvents: builder.query<ResponseBody<RetrieveEventResponse[]>, SearchEventRequest>({
            // @ts-expect-error: Still compatible even in type lint error.
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const queryParams = [
                    `page=${args.page}`,
                    `size=${args.size}`,
                    `search=${args.search}`,
                    ...args.filters.map(filter => `filters=${filter}`)
                ];
                return baseQuery({
                    url: `?${queryParams.join("&")}`,
                    method: "GET"
                });
            }
        }),
        retrieveEvent: builder.query<ResponseBody<RetrieveEventResponse>, { id: string }>({
            query: ({id: id}) => ({
                url: `/${id}`,
                method: "GET"
            }),
        }),
    })
});
