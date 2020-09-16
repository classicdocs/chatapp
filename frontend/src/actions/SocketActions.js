export const SET_SOCKET = '[SOCKET] SET_SOCKET';
export const NEW_MESSAGE = '[SOCKET] NEW_MESSAGE';

export function setSocket(socket) {
    return {
        type: SET_SOCKET,
        payload: socket
    }
}

export function newMessage(message) {
    return {
        type: NEW_MESSAGE,
        payload: message
    }
}