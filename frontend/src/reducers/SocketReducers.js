import * as Actions from '../actions/Actions';

const initialState = {
  socket: undefined
};

const socketReducers = (state = initialState, action) => {

  switch (action.type) {
    case Actions.SET_SOCKET: {
      return {
        ...state,
        socket: action.payload
      }
    }
    default: return state;
  }
};

export default socketReducers;