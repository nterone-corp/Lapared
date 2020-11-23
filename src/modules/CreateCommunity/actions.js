// @flow
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import axios from 'react-native-axios';
import {
  CREATE_COMMUNITY_REQUEST,
  CREATE_COMMUNITY_SUCCESS,
  CREATE_COMMUNITY_FAILURE
} from './types';
import {  postAPI } from '../../utils/api';



export const CreateCommunityAPI = async (name: string,description: string) => async (
  dispatch: ReduxDispatch
) => {
  dispatch({
    type:CREATE_COMMUNITY_REQUEST
  });

  try {
     let details = {
      "name": name,
      "description": description,
      
    };

      const user = await postAPI('/communities', JSON.stringify(details));

     return dispatch({
       type: CREATE_COMMUNITY_SUCCESS,
       payload: user
     });
  } catch (e) {
    dispatch({
      type:CREATE_COMMUNITY_FAILURE,
      payload: e && e.message ? e.message : e
    });

    throw e;
  }
};

