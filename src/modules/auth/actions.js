// @flow
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import axios from 'react-native-axios';
import {
  LOGIN_WITH_PHONE_REQUEST,
  LOGIN_WITH_PHONE_SUCCESS,
  LOGIN_WITH_PHONE_FAILURE
} from './types';
import {  postAPI } from '../../utils/api';


export const loginWithPhone = async (email: string, password: string) => async (
  dispatch: ReduxDispatch
) => {
  dispatch({
    type: LOGIN_WITH_PHONE_REQUEST
  });

  try {
     let details = {
       'email': email,
       'password': password
     };


      const user = await postAPI('/users/sign_in', JSON.stringify(details));

     return dispatch({
       type: LOGIN_WITH_PHONE_SUCCESS,
       payload: user
     });
  } catch (e) {
    dispatch({
      type: LOGIN_WITH_PHONE_FAILURE,
      payload: e && e.message ? e.message : e
    });

    throw e;
  }
};
