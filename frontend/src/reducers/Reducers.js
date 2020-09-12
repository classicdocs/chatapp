import { combineReducers } from 'redux';
import authReducers from './AuthReducers';
import socketReducers from "./SocketReducers";

const appReducers = combineReducers({
    authReducers,
    socketReducers
});

export default appReducers;