import {createApi} from "@reduxjs/toolkit/query/react";
import {ApiResponse, rootBaseQuery} from "@/src/stores/apis/index";

export interface Account {
    id: string;
    email: string;
    password: string;
    name: string;
    phone: string;
    dob: string;
    referralCode: string;
    profileImageUrl: string;
}

export interface RetrieveOneAccountRequest {
    id: string;
}

export const accountApi = createApi({
    reducerPath: "accountApi",
    baseQuery: rootBaseQuery,
    endpoints: (builder) => ({
        retrieveOneById: builder.query<ApiResponse<Account>, RetrieveOneAccountRequest>({
            query: ({id}) => `/accounts/${id}`,
        }),
    })
});
