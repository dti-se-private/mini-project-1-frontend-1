import {createApi} from "@reduxjs/toolkit/query/react";
import {ApiResponse, rawBaseQuery} from "@/src/stores/apis";
import {Account} from "@/src/stores/apis/accountApi";


export interface RegisterByEmailAndPasswordRequest {
    email: string;
    password: string;
    name: string;
    phone: string;
    dob: string;
    referralCode: string;
}

export interface LoginByEmailAndPasswordRequest {
    email: string;
    password: string;
}

export interface Session {
    accountId: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiredAt: string;
    refreshTokenExpiredAt: string;
}

export const authenticationApi = createApi({
    reducerPath: "authenticationApi",
    baseQuery: rawBaseQuery,
    endpoints: (builder) => ({
        registerByEmailAndPassword: builder.mutation<ApiResponse<Account>, RegisterByEmailAndPasswordRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                return baseQuery({
                    url: "/authentications/registers/email-password",
                    method: "POST",
                    body: args,
                });
            }
        }),
        loginByEmailAndPassword: builder.query<ApiResponse<Session>, LoginByEmailAndPasswordRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                return baseQuery({
                    url: "/authentications/logins/email-password",
                    method: "POST",
                    body: args,
                });
            }
        }),
        logout: builder.query<ApiResponse<null>, Session>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                return baseQuery({
                    url: "/authentications/logouts/session",
                    method: "POST",
                    body: args,
                });
            }
        }),
        refreshSession: builder.query<ApiResponse<Session>, Session>({
            query: () => `/authentications/refreshes/session`,
        }),
    })
});

