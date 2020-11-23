// @flow
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import axios from 'react-native-axios';
import {
  CHANGE_New_PASSWORD_REQUEST,
  CHANGE_New_PASSWORD_SUCCESS,
  CHANGE_New_PASSWORD_FAILURE
} from './types';
import {  postAPI } from '../../utils/api';



export const CreateNewPasswordAPI = async (reset_password_token: string,password: string,password_confirmation: string) => async (
  dispatch: ReduxDispatch
) => {
  dispatch({
    type:CHANGE_New_PASSWORD_REQUEST
  });

  try {
     let details = {
      "reset_password_token": reset_password_token,
      "password": password,
      "password_confirmation": password_confirmation
    };
// console.log('email>>>>>>>>>>>>>>>>>>',email)

      const user = await postAPI('/users/reset_password', JSON.stringify(details));

     return dispatch({
       type: CHANGE_New_PASSWORD_SUCCESS,
       payload: user
     });
  } catch (e) {
    dispatch({
      type:CHANGE_New_PASSWORD_FAILURE,
      payload: e && e.message ? e.message : e
    });

    throw e;
  }
};

