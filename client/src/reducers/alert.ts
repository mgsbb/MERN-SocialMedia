import { SET_ALERT, CLEAR_ALERT } from '../constants/actionTypes';

// ============================================================================================

const alertReducer = (
    alertState = { alertMessage: '', alertColor: '' },
    action: any,
) => {
    switch (action.type) {
        case SET_ALERT:
            return {
                ...alertState,
                alertMessage: action.payload.message,
                alertColor: action.payload.color,
            };
        case CLEAR_ALERT:
            return { ...alertState, alertMessage: '', alertColor: '' };
        default:
            return alertState;
    }
};
// ============================================================================================

export default alertReducer;
