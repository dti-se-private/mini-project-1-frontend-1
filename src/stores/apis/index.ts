import {BaseQueryApi, FetchArgs, fetchBaseQuery, QueryReturnValue} from "@reduxjs/toolkit/query/react";
import {RootState} from "@/src/stores";
import {Session} from "@/src/stores/apis/authenticationApi";
import {authenticationSlice} from "@/src/stores/slices/authenticationSlice";

export interface ApiResponse<T> {
    data: T | null;
    message: string;
}

export const rawBaseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:8080",
    prepareHeaders: (headers, api) => {
        const rootState: RootState = api.getState() as RootState;
        const authenticationState = rootState.authenticationSlice;
        if (authenticationState.session?.accessToken) {
            headers.set("Authorization", `Bearer ${authenticationState.session?.accessToken}`);
        }
        return headers;
    }
});

export const rootBaseQuery = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: object) => {
    const result = await rawBaseQuery(args, api, extraOptions);
    if (result.error?.status === 401) {
        const rootState: RootState = api.getState() as RootState;
        const authenticationState = rootState.authenticationSlice;
        if (authenticationState.session?.refreshToken) {
            const refreshSessionResult = await rawBaseQuery({
                url: "/authentications/refreshes/session",
                method: "POST",
                body: {
                    refreshToken: authenticationState.session
                }
            }, api, extraOptions) as QueryReturnValue<ApiResponse<Session>>;
            if (refreshSessionResult.data?.data?.accessToken) {
                api.dispatch(authenticationSlice.actions.refreshSession({
                    session: refreshSessionResult.data
                }));
                return rawBaseQuery(args, api, extraOptions);
            } else {
                api.dispatch(authenticationSlice.actions.logout({}));
            }
        }
    }
    return result;
}