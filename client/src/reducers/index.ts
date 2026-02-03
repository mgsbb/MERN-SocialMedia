import { combineReducers } from '@reduxjs/toolkit';
import postReducer from './posts';
import modalReducer from './modal';
import authReducer from './auth';
import loadingReducer from './loading';
import alertReducer from './alert';

export default combineReducers({
    postState: postReducer,
    modalState: modalReducer,
    authState: authReducer,
    loadingState: loadingReducer,
    alertState: alertReducer,
});
