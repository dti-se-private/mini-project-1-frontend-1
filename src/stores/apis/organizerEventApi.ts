import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery, ResponseBody} from "@/src/stores/apis";
import {RetrieveEventResponse} from "@/src/stores/apis/eventApi";

export interface CreateEventTicketRequest {
    name: string;
    description: string;
    price: number;
    slots: number;
    fields: string[];
}

export interface CreateEventVoucherRequest {
    name: string;
    description: string;
    code: string;
    variableAmount: number;
    startedAt: string;
    endedAt: string;
}

export interface CreateEventRequest {
    name: string;
    description: string;
    location: string;
    category: string;
    time: string;
    bannerImageUrl: string;
    eventTickets: CreateEventTicketRequest[];
    eventVouchers: CreateEventVoucherRequest[];
}

export interface SearchOrganizerEventRequest {
    page: number;
    size: number;
}

export interface PatchEventTicketFieldRequest {
    id: string;
    key: string;
}

export interface PatchEventTicketRequest {
    id: string;
    name: string;
    description: string;
    price: number;
    slots: number;
    fields: PatchEventTicketFieldRequest[];
}

export interface PatchEventVoucherRequest {
    id: string;
    code: string;
    name: string;
    description: string;
    variableAmount: number;
    startedAt: string;
    endedAt: string;
}

export interface PatchEventRequest {
    id: string;
    name: string;
    description: string;
    location: string;
    category: string;
    time: string;
    bannerImageUrl: string;
    eventTickets: PatchEventTicketRequest[];
    eventVouchers: PatchEventVoucherRequest[];
}

export const organizerEventApi = createApi({
    reducerPath: "organizerEventApi",
    baseQuery: axiosBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_1_URL}/organizer/events`
    }),
    endpoints: (builder) => ({
        retrieveEvents: builder.query<ResponseBody<RetrieveEventResponse[]>, SearchOrganizerEventRequest>({
            // @ts-expect-error: Still compatible even in type lint error.
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const queryParams = [
                    `page=${args.page}`,
                    `size=${args.size}`
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
        createEvent: builder.query<ResponseBody<RetrieveEventResponse>, CreateEventRequest>({
            // @ts-expect-error: Still compatible even in type lint error.
            queryFn: async (args, api, extraOptions, baseQuery) => {
                return baseQuery({
                    url: "",
                    method: "POST",
                    data: args,
                });
            }
        }),
        patchEvent: builder.query<ResponseBody<RetrieveEventResponse>, PatchEventRequest>({
            // @ts-expect-error: Still compatible even in type lint error.
            queryFn: async (args, api, extraOptions, baseQuery) => {
                return baseQuery({
                    url: `/${args.id}`,
                    method: "PATCH",
                    data: args,
                });
            }
        }),
    })
});