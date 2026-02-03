import { SET_ALERT, CLEAR_ALERT } from '../constants/actionTypes.ts';

export const setAlert = (message: string, color: string) => ({
    type: SET_ALERT,
    payload: { message, color },
});

export const clearAlert = () => ({ type: CLEAR_ALERT });
