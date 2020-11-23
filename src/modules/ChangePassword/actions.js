// @flow
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import axios from 'react-native-axios';
import {
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAILURE
} from './types';
import {  postAPI } from '../../utils/api';



export const ForgotPasswordAPI = async (email: string) => async (
  dispatch: ReduxDispatch
) => {
  dispatch({
    type:CHANGE_PASSWORD_REQUEST
  });

  try {
     let details = {
       'email': email       
     };
console.log('email>>>>>>>>>>>>>>>>>>',email)

      const user = await postAPI('/users/forgot_password', JSON.stringify(details));

     return dispatch({
       type: CHANGE_PASSWORD_SUCCESS,
       payload: user
     });
  } catch (e) {
    dispatch({
      type:CHANGE_PASSWORD_FAILURE,
      payload: e && e.message ? e.message : e
    });

    throw e;
  }
};

