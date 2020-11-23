// @flow
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import axios from 'react-native-axios';
import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE
} from './types';
import {  postAPI } from '../../utils/api';


export const registerAPI = async (email: string, first_name: string, last_name: string, password: string,password_confirmation:string) => async (
  dispatch: ReduxDispatch
) => {
  dispatch({
    type: REGISTER_REQUEST
  });

  try {


       let details = {
        "email": email,
        "first_name": first_name,
        "last_name": last_name,
        "password": password,
        "password_confirmation": password_confirmation

     };

console.log('data request',details );





      const user = await postAPI('/users', JSON.stringify(details));

     return dispatch({
       type: REGISTER_SUCCESS,
       payload: user
     });
  } catch (e) {
    dispatch({
      type: REGISTER_FAILURE,
      payload: e && e.message ? e.message : e
    });

    throw e;
  }
};
