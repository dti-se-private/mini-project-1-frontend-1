import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery, ResponseBody} from "@/src/stores/apis";
import {RetrieveEventResponse} from "@/src/stores/apis/eventApi";

export interface CreateEventVoucherRequest {
    name: string;
    description: string;
    variableAmount: number;
    startedAt: Date;
    endedAt: Date;
}

export interface CreateEventRequest {
    name: string;
    description: string;
    location: string;
    category: string;
    time: Date;
    bannerImageUrl: string;
    price: number;
    slots: number;
    vouchers: CreateEventVoucherRequest[];
}

export interface SearchOrganizerEventRequest {
    page: number;
    size: number;
}

export const organizerEventApi = createApi({
    reducerPath: "organizerEventApi",
    baseQuery: axiosBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_1_URL}/organizer/events`
    }),
    endpoints: (builder) => ({
        getEvents: builder.query<ResponseBody<RetrieveEventResponse[]>, SearchOrganizerEventRequest>({
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
        getEventDetails: builder.query<ResponseBody<RetrieveEventResponse>, { id: string }>({
            query: ({id: id}) => ({
                url: `/${id}`,
                method: "GET"
            }),
        }),
        createEvent: builder.query<ResponseBody<RetrieveEventResponse>, CreateEventRequest>({
            // @ts-expect-error: Still compatible even in type lint error.
            queryFn: async (args, api, extraOptions, baseQuery) => {
                return baseQuery({
                    url: "/",
                    method: "POST",
                    data: args,
                });
            }
        }),
        updateEvent: builder.query<ResponseBody<RetrieveEventResponse>, RetrieveEventResponse>({
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