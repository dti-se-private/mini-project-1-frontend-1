import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {
    authenticationApi,
    LoginByEmailAndPasswordRequest,
    RegisterByEmailAndPasswordRequest,
    Session
} from "@/src/stores/apis/authenticationApi";
import {authenticationSlice} from "@/src/stores/slices/authenticationSlice";
import {accountApi, RetrieveOneAccountRequest} from "@/src/stores/apis/accountApi";
import {useEffect} from "react";

export const useAuthentication = () => {
    const dispatch = useDispatch();
    const state = useSelector((state: RootState) => state.authenticationSlice);
    const [loginApiTrigger] = authenticationApi.useLazyLoginByEmailAndPasswordQuery();
    const [registerApiTrigger] = authenticationApi.useRegisterByEmailAndPasswordMutation();
    const [logoutApiTrigger] = authenticationApi.useLazyLogoutQuery();
    const [refreshSessionApiTrigger] = authenticationApi.useLazyRefreshSessionQuery();
    const [accountApiTrigger] = accountApi.useLazyRetrieveOneByIdQuery();

    const retrieveAccount = async (request: RetrieveOneAccountRequest) => {
        const accountApiResult = await accountApiTrigger(request).unwrap();
        dispatch(authenticationSlice.actions.setAccount({
            account: accountApiResult.data,
        }))
        return accountApiResult;
    }

    const login = async (request: LoginByEmailAndPasswordRequest) => {
        const loginApiResult = await loginApiTrigger(request).unwrap();
        dispatch(authenticationSlice.actions.login({
            session: loginApiResult.data,
        }));
        return loginApiResult;
    }

    const register = async (request: RegisterByEmailAndPasswordRequest) => {
        const registerApiResult = await registerApiTrigger(request).unwrap();
        dispatch(authenticationSlice.actions.register({
            account: registerApiResult.data,
        }));
        return registerApiResult;
    }

    const logout = async () => {
        let logoutApiResult = undefined;
        if (state.session) {
            logoutApiResult = await logoutApiTrigger(state.session).unwrap();
        }
        dispatch(authenticationSlice.actions.logout({}));
        return logoutApiResult;
    }

    const refreshSession = async (request: Session) => {
        const refreshSessionApiResult = await refreshSessionApiTrigger(request).unwrap();
        dispatch(authenticationSlice.actions.refreshSession({
            session: refreshSessionApiResult.data,
        }));
        return refreshSessionApiResult
    }

    useEffect(() => {
        if (state.session) {
            retrieveAccount({
                id: state.session.accountId,
            }).then()
        }
    }, [retrieveAccount, state.session])

    return {
        state,
        login,
        register,
        logout,
        refreshSession,
    };
}
