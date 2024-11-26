import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export interface Interface {
    id: string;
}

export interface EventOverview {
    id: string;
    accountId: string;
    name: string;
    location: string;
    category: string;
    time: string;
    price: number;
    slots: number;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    exception: string;
}

export const interfaceApi = createApi({
    reducerPath: "interface",
    baseQuery: fetchBaseQuery({baseUrl: "http://localhost:8080"}),
    endpoints: (builder) => ({
        getInterface: builder.query<Interface, string>({
            query: (id) => `interfaces/${id}`,
        }),
        getEventsByCategory: builder.query<EventOverview[], { category?: string, page?: number, size?: number }>({
            query: ({ category, page, size }) => `/events?category=${category}&page=${page}&size=${size}`,
            transformResponse: (response: ApiResponse<EventOverview[]>) => {
                if (response.exception === null) {
                    return response.data;
                }
                return [];
            },
        }),
    })
});
