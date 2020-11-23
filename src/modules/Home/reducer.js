// @flow
import {
  GETHOME_REQUEST,
  GETHOME_FAILURE,
  GETHOME_SUCCESS,
  GET_STORIES_REQUEST,
  GET_STORIES_SUCCESS,
  GET_STORIES_FAILED,
  GET_COMMUNITY_SUCCESS,
  GET_CONTACTS_FAILED,
  GET_CONTACTS_SUCCESS
} from './types';
import type State from './types';


const INITIAL_STATE = [{
  error: null,
  response: '',
  isStoryBusy:false,
  isBusy: false,
  stories:[],
  community: [],
  contacts: []
}];



const reducer = (state: State = INITIAL_STATE, action) => {
  switch (action.type) {
    case GETHOME_REQUEST:
    return {
        ...state,
        isBusy: true

      };
      case GET_STORIES_REQUEST:
        return {
            ...state,
            isStoryBusy: true
    
          };

      
      //return state.update('isBusy', () => true);
    case GETHOME_SUCCESS:
    return {
        ...state,
        isBusy: false,
        response: action.payload,
        

      };


      case GETHOME_FAILURE:
      return {
          ...state,
          isBusy: false,
          response: null,
           
        };
  
  
        case GET_STORIES_SUCCESS:
        return {
            ...state,
            stories: action.payload,
            isStoryBusy: false,
    
          };

          case GET_STORIES_FAILED:
            return {
                ...state,
                stories: [],
                isStoryBusy: false,
        
              };
          isStoryBusy

          case GET_COMMUNITY_SUCCESS:
            return {
                ...state,
                community: action.payload,
                isBusy: false,
              };

        case GET_CONTACTS_FAILED:
                return {
                    ...state,
                    isBusy: true,
                    contacts: [],
                  };       
          case GET_CONTACTS_SUCCESS:
                return {
                    ...state,
                    contacts: action.payload,
                    isBusy: false,
                  };
          

    default:
      return state;
  }
};

export default reducer;
