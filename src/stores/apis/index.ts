import type {BaseQueryFn} from '@reduxjs/toolkit/query'
import type {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios'
import axios from 'axios'
import {authenticationSlice, AuthenticationState} from "@/src/stores/slices/authenticationSlice";
import storeRegistry from "@/src/registries/storeRegistry";
import _ from "lodash";
import applyCaseMiddleware from "axios-case-converter";

export interface ResponseBody<T> {
    data?: T;
    message: string;
}

export interface Session {
    accountId: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiredAt: string;
    refreshTokenExpiredAt: string;
}

export const axiosBaseQuery =
    (
        {baseUrl}: { baseUrl: string } = {baseUrl: ''}
    ): BaseQueryFn<
        {
            url: string
            method?: AxiosRequestConfig['method']
            data?: AxiosRequestConfig['data']
            params?: AxiosRequestConfig['params']
            headers?: AxiosRequestConfig['headers']
        },
        unknown,
        unknown
    > =>
        async ({url, method, data, params, headers}) => {
            const instance = applyCaseMiddleware(axios.create())
            const store = storeRegistry.getStore()!
            const authenticationState: AuthenticationState = store.getState().authenticationSlice

            console.log('authenticationState', authenticationState)
            instance.interceptors.request.use(
                async config => {
                    config.headers['Access-Control-Allow-Origin'] = '*'
                    if (authenticationState.session?.accessToken) {
                        config.headers.Authorization = `Bearer ${authenticationState.session.accessToken}`
                    }

                    console.log('config', config)

                    return config
                }
            )
            instance.interceptors.response.use(
                response => {
                    return response
                },
                async error => {
                    const originalRequest = error.config
                    if (error.response.status === 401 && authenticationState.session?.refreshToken) {
                        const refreshSessionResponse: AxiosResponse<ResponseBody<Session>> = await instance.request(
                            {
                                url: 'http://localhost:8080/authentications/refreshes/session',
                                method: 'POST',
                                data: authenticationState.session,
                            }
                        )
                        if (refreshSessionResponse.status === 200) {
                            store.dispatch(authenticationSlice.actions.refreshSession(refreshSessionResponse.data?.data))
                            return await instance(originalRequest)
                        }
                    } else {
                        // store.dispatch(authenticationSlice.actions.logout({}))
                        // window.location.href = '/login'
                    }
                    return await Promise.reject(error)
                }
            )

            try {
                const result = await instance.request({
                    url: baseUrl + url,
                    method,
                    data,
                    params,
                    headers
                });

                if (result.data) {
                    result.data = _.omit(result.data, ['new'])
                    if (result.data?.data) {
                        result.data.data = _.omit(result.data.data, ['new'])
                    }
                }

                return {
                    data: result.data
                }
            } catch (axiosError) {
                const err = axiosError as AxiosError
                return {
                    error: {
                        status: err.response?.status,
                        data: err.response?.data || err.message,
                    }
                }
            }
        }
