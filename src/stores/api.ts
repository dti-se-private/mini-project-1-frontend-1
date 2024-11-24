import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export interface Interface {
    id: string;
}

export const interfaceApi = createApi({
    reducerPath: "interface",
    baseQuery: fetchBaseQuery({baseUrl: "https://url.com/api/interfaces"}),
    endpoints: (builder) => ({
        getInterface: builder.query<Interface, string>({
            query: (id) => `interfaces/${id}`,
        }),
    })
});
