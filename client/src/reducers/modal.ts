import {
    SHOW_MODAL,
    HIDE_MODAL,
    CONFIRM_MODAL,
} from '../constants/actionTypes';

// ============================================================================================

const modalReducer = (
    modalState = {
        isShowModal: false,
        isConfirmModal: false,
        context: '',
        postId: '',
    },
    action: any,
) => {
    if (action.type === SHOW_MODAL) {
        return { ...modalState, isShowModal: true, context: action.payload };
    }

    if (action.type === HIDE_MODAL) {
        return {
            ...modalState,
            isShowModal: false,
            context: '',
            isConfirmModal: false,
        };
    }

    if (action.type === CONFIRM_MODAL) {
        return { ...modalState, isConfirmModal: true };
    }

    // EXCEPTION
    if (action.type === 'SET_POST_ID') {
        return { ...modalState, postId: action.payload };
    }

    return modalState;
};
// ============================================================================================

export default modalReducer;
