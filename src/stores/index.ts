import {combineReducers} from "redux";
import {configureStore} from "@reduxjs/toolkit";
import {persistReducer, persistStore} from "redux-persist";
import {rootSlice} from "@/src/stores/slice";
import {FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE} from "redux-persist/es/constants";
import createWebStorage from "redux-persist/es/storage/createWebStorage";
import {interfaceApi} from "@/src/stores/api";
import {setupListeners} from "@reduxjs/toolkit/query";


const rootReducer = combineReducers({
    [rootSlice.name]: rootSlice.reducer,
    [interfaceApi.reducerPath]: interfaceApi.reducer,
})

const createNoopStorage = () => {
    return {
        getItem() {
            return Promise.resolve(null)
        },
        setItem(value: string) {
            return Promise.resolve(value)
        },
        removeItem() {
            return Promise.resolve()
        },
    }
}

const isServer = typeof window === 'undefined'
const storage = isServer ? createNoopStorage() : createWebStorage('local')
const persistedReducer = persistReducer({
        key: "persist",
        whitelist: [],
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
        },
    }).concat(interfaceApi.middleware),
})

setupListeners(store.dispatch)

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
