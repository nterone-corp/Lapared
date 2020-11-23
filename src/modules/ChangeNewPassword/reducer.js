// @flow
import { Map } from 'immutable';
import {
  CHANGE_New_PASSWORD_REQUEST,
  CHANGE_New_PASSWORD_SUCCESS,
  CHANGE_New_PASSWORD_FAILURE
} from './types';
import type State from './types';
import { setAuthenticationToken } from './actions';




const INITIAL_STATE = [{
  error: null,
  response: null,
  isBusy: false
}];



const reducer = (state: State = INITIAL_STATE, action) => {
  switch (action.type) {
    case CHANGE_New_PASSWORD_REQUEST:
    return {
        ...state,
        isBusy: true,
        response: null
      };
      //return state.update('isBusy', () => true);
    case CHANGE_New_PASSWORD_SUCCESS:
    return {
        ...state,
        isBusy: false,
        response: action.payload
      };


      case CHANGE_New_PASSWORD_FAILURE:
      return {
          ...state,
          isBusy: false,
          response: null
        };
    default:
      return state;
  }
};

export default reducer;
