// @flow
import {
  GETPROFILE_REQUEST,
  GETPROFILE_FAILURE,
  GETPROFILE_SUCCESS
} from './types';
import type State from './types';


const INITIAL_STATE = [{
  error: null,
  response: '',
  isBusy: false
}];



const reducer = (state: State = INITIAL_STATE, action) => {
  switch (action.type) {
    case GETPROFILE_REQUEST:
    return {
        ...state,
        isBusy: true

      };
      //return state.update('isBusy', () => true);
    case GETPROFILE_SUCCESS:
    return {
        ...state,
        isBusy: false,
        response: action.payload,
      

      };


      case GETPROFILE_FAILURE:
      return {
          ...state,
          isBusy: false,
          response: null,
           name: '',
           mobileNumber: '',
           profileImage: '',
           email: '',
           commodity: '',
           address: ''
        };
    default:
      return state;
  }
};

export default reducer;
