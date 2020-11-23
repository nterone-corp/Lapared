// @flow
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import {
  GETPROFILE_REQUEST,
  GETPROFILE_SUCCESS,
  GETPROFILE_FAILURE
} from './types';
import {  get, put } from '../../utils/api';
import { getConfiguration } from '../../utils/configuration';



export const getProfileAPI = async (cb=null) => async (
  dispatch: ReduxDispatch
) => {
  dispatch({
    type: GETPROFILE_REQUEST
  });

  try {
    //  const user_id = getConfiguration('user_id');
     var path ='/user';
      const user = await get(path);
      if(cb){
        cb(user);
      }
     return dispatch({
       type: GETPROFILE_SUCCESS,
       payload: user
     });
   

  } catch (e) {
    dispatch({
      type: GETPROFILE_FAILURE,
      payload: e && e.message ? e.message : e
    });

    throw e;
  }
};

export const setProfileAPI = async (params, cb=null) => async (
  dispatch: ReduxDispatch
) => {
  dispatch({
    type: GETPROFILE_REQUEST
  });
   console.log("paramsparamsparams",params)
  try {
    //  const user_id = getConfiguration('user_id');
     var path ='/user';
       
      const user = await put(path, JSON.stringify(params));
      console.log("hgfhfhfhfhf",user)
      if(cb){
        cb(user);
      }
    //  return dispatch({ 
    //    type: GETPROFILE_SUCCESS,
    //    payload: user
    //  });
   

  } catch (e) {
    dispatch({
      type: GETPROFILE_FAILURE,
      payload: e && e.message ? e.message : e
    });

    throw e;
  }
};

