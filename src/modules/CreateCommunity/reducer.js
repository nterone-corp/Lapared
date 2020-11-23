// @flow
import { Map } from 'immutable';
import {
  CREATE_COMMUNITY_REQUEST,
  CREATE_COMMUNITY_SUCCESS,
  CREATE_COMMUNITY_FAILURE
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
    case CREATE_COMMUNITY_REQUEST:
    return {
        ...state,
        isBusy: true,
        response: null
      };
      //return state.update('isBusy', () => true);
    case CREATE_COMMUNITY_SUCCESS:
    return {
        ...state,
        isBusy: false,
        response: action.payload
      };


      case CREATE_COMMUNITY_FAILURE:
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
