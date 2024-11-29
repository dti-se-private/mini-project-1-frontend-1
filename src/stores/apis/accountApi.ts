import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery, ResponseBody} from "@/src/stores/apis";

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
    baseQuery: axiosBaseQuery({
        baseUrl: "http://localhost:8080/accounts"
    }),
    endpoints: (builder) => ({
        retrieveOneById: builder.query<ResponseBody<Account>, RetrieveOneAccountRequest>({
            // @ts-expect-error: Still compatible even in type lint error.
            queryFn: async (args, api, extraOptions, baseQuery) => {
                return baseQuery({
                    url: `/${args.id}`,
                    method: "GET",
                });
            }
        }),
    })
});
