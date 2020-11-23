// @flow
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import {
  GETHOME_REQUEST,
  GETHOME_SUCCESS,
  GETHOME_FAILURE,
  GET_STORIES_SUCCESS,
  GET_COMMUNITY_SUCCESS,
  GET_CONTACTS_SUCCESS,
  GET_CONTACTS_FAILED,
  GET_STORIES_REQUEST
} from './types';
import {  get } from '../../utils/api';
import { getConfiguration } from '../../utils/configuration';


export const getHomeAPI = async () => async (
  dispatch: ReduxDispatch
) => {
  dispatch({
    type: GETHOME_REQUEST
  });
var feed = true
  try {
    //  const Token = getConfiguration('Token');
     var path ='/posts?feed='+feed+'';
      const user = await get(path);

     return dispatch({
       type: GETHOME_SUCCESS,
       payload: user
     });
  } catch (e) {
    dispatch({
      type: GETHOME_FAILURE,
      payload: e && e.message ? e.message : e
    });

    throw e;
  }
};




export const getStoriesAPI = async (load) => async (
  dispatch: ReduxDispatch
) => {
  if(load){
    dispatch({
      type: GET_STORIES_REQUEST
    });
  }


  try {
    //  const Token = getConfiguration('Token');
     var path ='/user/stories';
      const data = await get(path);
      console.log("useruseruser",data)
     return dispatch({
       type: GET_STORIES_SUCCESS,
       payload: data
     });
  } catch (e) {
    dispatch({
      type: GETHOME_FAILURE,
      payload: e && e.message ? e.message : e
    });

    throw e;
  }
};


export const getCommunityAPI = async () => async (
  dispatch: ReduxDispatch
) => {
  dispatch({
    type: GETHOME_REQUEST
  });

  try {
    //  const Token = getConfiguration('Token');
     var path ='/user/communities';
      const data = await get(path);
      console.log("communitiescommunities",data)
     return dispatch({
       type: GET_COMMUNITY_SUCCESS,
       payload: data
     });
  } catch (e) {
    dispatch({
      type: GETHOME_FAILURE,
      payload: e && e.message ? e.message : e
    });

    throw e;
  }
};

export const getContactsAPI = async () => async (
  dispatch: ReduxDispatch
) => {
  dispatch({
    type: GETHOME_REQUEST
  });

  try {
    //  const Token = getConfiguration('Token');
     var path ='/user/contacts';
      const data = await get(path);
      console.log("getContactsAPIgetContactsAPI",data)
     return dispatch({
       type: GET_CONTACTS_SUCCESS,
       payload: data
     });
  } catch (e) {
    dispatch({
      type: GET_CONTACTS_FAILED,
      payload: e && e.message ? e.message : e
    });

    throw e;
  }
};