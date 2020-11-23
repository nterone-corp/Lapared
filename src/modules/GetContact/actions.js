// @flow
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import {
  GETCONTACT_REQUEST,
  GETCONTACT_SUCCESS,
  GETCONTACT_FAILURE
} from './types';
import {  get } from '../../utils/api';
import { getConfiguration } from '../../utils/configuration';



export const getContactAPI = async () => async (
  dispatch: ReduxDispatch
) => {
  dispatch({
    type: GETCONTACT_REQUEST
  });

  try {
    //  const user_id = getConfiguration('user_id');
     var path ='/user/contacts';
      const user = await get(path);

     return dispatch({
       type: GETCONTACT_SUCCESS,
       payload: user
     });
  } catch (e) {
    dispatch({
      type: GETCONTACT_FAILURE,
      payload: e && e.message ? e.message : e
    });

    throw e;
  }
};
