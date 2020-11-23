// @flow
import {
  POSTINGAS_REQUEST,
  POSTINGAS_FAILURE,
  POSTINGAS_SUCCESS
} from './types';
import type State from './types';


const INITIAL_STATE = [{
  error: null,
  responsePostingAs: '',
  isBusy: false
  
}];



const reducer = (state: State = INITIAL_STATE, action) => {
  switch (action.type) {
    case POSTINGAS_REQUEST:
    return {
        ...state,
        isBusy: true

      };
      //return state.update('isBusy', () => true);
    case POSTINGAS_SUCCESS:
    return {
        ...state,
        isBusy: false,
        responsePostingAs: action.payload,
        

      };


      case POSTINGAS_FAILURE:
      return {
          ...state,
          isBusy: false,
          responsePostingAs: null,
           
        };
    default:
      return state;
  }
};

export default reducer;
