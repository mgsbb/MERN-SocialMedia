import { START_LOADING, END_LOADING } from '../constants/actionTypes';

// ============================================================================================

const loadingReducer = (loadingState = { isLoading: false }, action: any) => {
    switch (action.type) {
        case START_LOADING:
            return { ...loadingState, isLoading: true };
        case END_LOADING:
            return { ...loadingState, isLoading: false };
        default:
            return loadingState;
    }
};
// ============================================================================================

export default loadingReducer;
