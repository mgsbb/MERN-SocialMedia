import {
    SHOW_MODAL,
    HIDE_MODAL,
    CONFIRM_MODAL,
} from '../constants/actionTypes';

// ============================================================================================
export const showModal = (context: any) => {
    return { type: SHOW_MODAL, payload: context };
};

// ============================================================================================
// Home (page)
export const hideModal = () => {
    return { type: HIDE_MODAL };
};

// ============================================================================================
// Home (page)
export const confirmModal = () => {
    return { type: CONFIRM_MODAL };
};

// ============================================================================================
// EXCEPTION
export const setPostId = (postId: string) => {
    return { type: 'SET_POST_ID', payload: postId };
};
