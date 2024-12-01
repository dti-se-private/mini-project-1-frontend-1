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

export interface RetrieveEventTicketResponse {
    id: string;
    name: string;
    description: string;
    price: number;
    slots: number;
    fields: string[];
}

export interface RetrieveEventVoucherResponse {
    id: string;
    code: string;
    name: string;
    description: string;
    variableAmount: number;
    startedAt: Date;
    endedAt: Date;
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
        getEventsByCategory: builder.query<ResponseBody<RetrieveEventResponse[]>, SearchEventRequest>({
            // @ts-expect-error: Still compatible even in type lint error.
            queryFn: async (args, api, extraOptions, baseQuery) => {
                return baseQuery({
                    url: `?page=${args.page}&size=${args.size}&search=${args.category}&filters=category`,
                    method: "GET"
                });
            }
        }),
    })
});
