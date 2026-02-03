import {
    SIGN_UP,
    SIGN_IN,
    LOGOUT,
    DELETE_USER,
    UPDATE_USER,
    GET_USER,
    GET_USERS,
} from '../constants/actionTypes.ts';
import { setAlert, clearAlert } from './alert';
import * as api from '../api/index.ts';
import { endLoading, startLoading } from './loading.ts';
import { type AuthFormData } from '../pages/Auth.tsx';
import { type NavigateFunction } from 'react-router-dom';
import type { AppDispatch } from '../store.ts';
import type { UpdateUserFormData } from '../types/index.ts';

// ============================================================================================
// Auth (page)
export const signUp =
    (authData: AuthFormData, navigate: NavigateFunction) =>
    async (dispatch: AppDispatch) => {
        try {
            dispatch(setAlert('Authenticating. Please wait...', 'green'));
            const { data } = await api.signUp(authData);
            dispatch({ type: SIGN_UP, payload: data });
            navigate(`/home`);
            dispatch(clearAlert());
        } catch (error: any) {
            dispatch(setAlert(error.response.data.message, 'red'));
            console.log(error);
        }
    };

// ============================================================================================
// Auth (page)
export const signIn =
    (authData: AuthFormData, navigate: NavigateFunction) =>
    async (dispatch: AppDispatch) => {
        try {
            dispatch(setAlert('Authenticating. Please wait...', 'green'));
            const { data } = await api.signIn(authData);
            dispatch({ type: SIGN_IN, payload: data });
            navigate(`/home`);
            dispatch(clearAlert());
        } catch (error: any) {
            dispatch(setAlert(error.response.data.message, 'red'));
            console.log(error);
        }
    };

// ============================================================================================
// Navbar (component)
export const logout = () => {
    return { type: LOGOUT };
};

// ============================================================================================
// Navbar (component)
export const deleteUser = () => async (dispatch: AppDispatch) => {
    try {
        const { data } = await api.deleteUser();
        dispatch({ type: DELETE_USER, payload: data });
    } catch (error) {
        console.log(error);
    }
};

// ============================================================================================
// User (page)
export const updateUser =
    (formData: UpdateUserFormData | undefined) =>
    async (dispatch: AppDispatch) => {
        try {
            dispatch(startLoading());
            const { data } = await api.updateUser(formData);
            dispatch({ type: UPDATE_USER, payload: data });
            dispatch(endLoading());
            dispatch(setAlert(data.message, 'green'));
            setTimeout(() => dispatch(clearAlert()), 3000);
        } catch (error: any) {
            console.log(error);
            dispatch(endLoading());
            console.log(error.response.data.message);
            dispatch(setAlert(error.response.data.message, 'red'));
        }
    };

// ============================================================================================
// User (page)
export const getUser =
    (userId: string | undefined) => async (dispatch: AppDispatch) => {
        try {
            dispatch(startLoading());
            const { data } = await api.getUser(userId);
            dispatch({ type: GET_USER, payload: data.userDetails });
            dispatch(endLoading());
        } catch (error) {
            console.log(error);
            dispatch(endLoading());
        }
    };

// ============================================================================================
// User (page)
export const getUsers =
    (userName: string | null) => async (dispatch: AppDispatch) => {
        try {
            dispatch(startLoading());
            const { data } = await api.getUsers(userName);
            dispatch({ type: GET_USERS, payload: data.users });
            dispatch(endLoading());
        } catch (error) {
            console.log(error);
            dispatch(endLoading());
        }
    };
