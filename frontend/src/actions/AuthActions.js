import {getUserFromLocalStorage} from "../base/Auth";

export const LOGIN = '[AUTH] LOGIN';
export const LOGOUT = '[AUTH] LOGOUT';
export const LOAD_USER = '[AUTH] LOAD';

export function login(user) {
    return {
        type: LOGIN,
        payload: user
    }
}

export function logout() {
    return {
        type: LOGOUT
    }
}

export function loadUser() {
    return {
        type: LOAD_USER,
        payload: getUserFromLocalStorage()
    }
}