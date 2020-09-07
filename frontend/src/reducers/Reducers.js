import { combineReducers } from 'redux';
import authReducers from './AuthReducers';

const appReducers = combineReducers({
    authReducers
});

export default appReducers;