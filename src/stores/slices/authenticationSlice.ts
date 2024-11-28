import {createSlice} from "@reduxjs/toolkit";
import {Session} from "@/src/stores/apis/authenticationApi";
import {Account} from "@/src/stores/apis/accountApi";
import storage from "redux-persist/lib/storage";

export interface AuthenticationState {
    isLoggedIn: boolean;
    account: Account | undefined;
    session: Session | undefined;
}

export const authenticationSlice = createSlice({
    name: 'authenticationSlice',
    initialState: {
        isLoggedIn: false,
        account: undefined,
        session: undefined
    } as AuthenticationState,
    reducers: {
        login: (state, action) => {
            const {account, session} = action.payload;
            state.account = account;
            state.session = session;
            state.isLoggedIn = true;
        },
        register: (state, action) => {
            const {account} = action.payload;
            state.account = account;
        },
        logout: (state, action) => {
            state.account = undefined;
            state.session = undefined;
            state.isLoggedIn = false;
            storage
                .removeItem('persist')
                .then(() => {
                    console.log('Persisted state has been removed.');
                })
                .catch(() => {
                    console.log('Failed to remove persisted state.');
                });
        },
        refreshSession: (state, action) => {
            const {session} = action.payload;
            state.session = session;
        }
    }
});
