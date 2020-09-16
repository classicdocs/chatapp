import * as Actions from '../actions/Actions';

const initialState = {
  socket: undefined,
  newMessage: null
};

const socketReducers = (state = initialState, action) => {

  switch (action.type) {
    case Actions.SET_SOCKET: {
      return {
        ...state,
        socket: action.payload
      }
    }
    case Actions.NEW_MESSAGE: {
      return {
        ...state, newMessage: action.payload
      }
    }
    default: return state;
  }
};

export default socketReducers;