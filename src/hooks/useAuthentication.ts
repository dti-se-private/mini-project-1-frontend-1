import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {
    authenticationApi,
    LoginByEmailAndPasswordRequest,
    RegisterByEmailAndPasswordRequest,
    Session
} from "@/src/stores/apis/authenticationApi";
import {authenticationSlice} from "@/src/stores/slices/authenticationSlice";
import {accountApi} from "@/src/stores/apis/accountApi";

export const useAuthentication = () => {
    const dispatch = useDispatch();
    const state = useSelector((state: RootState) => state.authenticationSlice);
    const [loginApiTrigger] = authenticationApi.useLazyLoginByEmailAndPasswordQuery();
    const [registerApiTrigger] = authenticationApi.useRegisterByEmailAndPasswordMutation();
    const [logoutApiTrigger] = authenticationApi.useLazyLogoutQuery();
    const [refreshSessionApiTrigger] = authenticationApi.useLazyRefreshSessionQuery();
    const [accountApiTrigger] = accountApi.useLazyRetrieveOneByIdQuery();

    const login = async (request: LoginByEmailAndPasswordRequest) => {
        const loginApiResult = await loginApiTrigger(request).unwrap();
        const accountApiResult = await accountApiTrigger({id: loginApiResult.data!.accountId}).unwrap();
        dispatch(authenticationSlice.actions.login({
            account: accountApiResult.data,
            session: loginApiResult.data,
        }));
    }

    const register = async (request: RegisterByEmailAndPasswordRequest) => {
        const registerApiResult = await registerApiTrigger(request).unwrap();
        dispatch(authenticationSlice.actions.register({
            account: registerApiResult.data,
        }));
    }

    const logout = async () => {
        await logoutApiTrigger(state.session!).unwrap();
        dispatch(authenticationSlice.actions.logout({}));
    }

    const refreshSession = async (request: Session) => {
        const refreshSessionApiResult = await refreshSessionApiTrigger(request).unwrap();
        dispatch(authenticationSlice.actions.refreshSession({
            session: refreshSessionApiResult.data,
        }));
    }

    return {
        state,
        login,
        register,
        logout,
        refreshSession,
    };
}
