// @flow
import {
  GETCONTACT_REQUEST,
  GETCONTACT_FAILURE,
  GETCONTACT_SUCCESS
} from './types';
import type State from './types';


const INITIAL_STATE = [{
  error: null,
  response: '',
  isBusy: false
}];



const reducer = (state: State = INITIAL_STATE, action) => {
  switch (action.type) {
    case GETCONTACT_REQUEST:
    return {
        ...state,
        isBusy: true

      };
      //return state.update('isBusy', () => true);
    case GETCONTACT_SUCCESS:
    return {
        ...state,
        isBusy: false,
        response: action.payload,
      

      };


      case GETCONTACT_FAILURE:
      return {
          ...state,
          isBusy: false,
          response: null,
          
        };
    default:
      return state;
  }
};

export default reducer;
