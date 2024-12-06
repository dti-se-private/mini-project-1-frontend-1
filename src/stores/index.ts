import {combineReducers} from "redux";
import {configureStore} from "@reduxjs/toolkit";
import {persistReducer, persistStore} from "redux-persist";
import {FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE} from "redux-persist/es/constants";
import createWebStorage from "redux-persist/es/storage/createWebStorage";
import {setupListeners} from "@reduxjs/toolkit/query";
import {landingSlice} from "@/src/stores/slices/landingSlice";
import {modalSlice} from "@/src/stores/slices/modalSlice";
import {authenticationSlice} from "@/src/stores/slices/authenticationSlice";
import {authenticationApi} from "@/src/stores/apis/authenticationApi";
import {accountApi} from "@/src/stores/apis/accountApi";
import {eventApi} from "@/src/stores/apis/eventApi";
import storeRegistry from "@/src/registries/storeRegistry";
import {searchSlice} from "@/src/stores/slices/searchSlice";
import {searcherSlice} from "@/src/stores/slices/searcherSlice";
import {eventManagementSlice} from "@/src/stores/slices/eventManagementSlice";
import {organizerEventApi} from "@/src/stores/apis/organizerEventApi";

const rootReducer = combineReducers({
    [authenticationSlice.reducerPath]: authenticationSlice.reducer,
    [landingSlice.reducerPath]: landingSlice.reducer,
    [searcherSlice.reducerPath]: searcherSlice.reducer,
    [searchSlice.reducerPath]: searchSlice.reducer,
    [modalSlice.reducerPath]: modalSlice.reducer,
    [accountApi.reducerPath]: accountApi.reducer,
    [authenticationApi.reducerPath]: authenticationApi.reducer,
    [eventApi.reducerPath]: eventApi.reducer,
    [organizerEventApi.reducerPath]: organizerEventApi.reducer,
    [eventManagementSlice.reducerPath]: eventManagementSlice.reducer,
})

const createNoopStorage = () => {
    return {
        getItem(_key: string) {
            return Promise.resolve(null)
        },
        setItem(_key: string, value: string) {
            return Promise.resolve(value)
        },
        removeItem(_key: string) {
            return Promise.resolve()
        },
    }
}

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage()
const persistedReducer = persistReducer({
        key: "persist",
        whitelist: [authenticationSlice.reducerPath],
        storage,
    },
    rootReducer
);

export const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            ignoredPaths: [modalSlice.reducerPath],
        },
    }).concat(eventApi.middleware, organizerEventApi.middleware, authenticationApi.middleware, accountApi.middleware),
})

setupListeners(store.dispatch)

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

storeRegistry.setStore(store);

