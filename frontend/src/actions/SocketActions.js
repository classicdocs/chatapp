export const SET_SOCKET = '[SOCKET] SET_SOCKET';

export function setSocket(socket) {
    return {
        type: SET_SOCKET,
        payload: socket
    }
}