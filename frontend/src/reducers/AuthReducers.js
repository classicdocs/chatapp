import * as Actions from '../actions/Actions';

const initialState = {
  user: undefined
};

const authReducers = (state = initialState, action) => {

  switch (action.type) {
    case Actions.LOGIN:
      return {
        ...state,
        user: action.payload
      }
    case Actions.LOAD_USER:
      return {
        ...state,
        user: action.payload
      };
    case Actions.LOGOUT:
      return {
        ...state,
        user: undefined
      };
    default: return state;
  }
};

export default authReducers;