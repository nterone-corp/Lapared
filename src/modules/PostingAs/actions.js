// @flow
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import {
  POSTINGAS_REQUEST,
  POSTINGAS_SUCCESS,
  POSTINGAS_FAILURE
} from './types';
import {  get } from '../../utils/api';
import { getConfiguration } from '../../utils/configuration';

export const PostingAsAPI = async () => async (
  dispatch: ReduxDispatch
) => {
  dispatch({
    type: POSTINGAS_REQUEST
  });

  try {
    //  const Token = getConfiguration('Token');
     var path ='/user/communities';
      const user = await get(path);

     return dispatch({
       type: POSTINGAS_SUCCESS,
       payload: user
     });
  } catch (e) {
    dispatch({
      type: POSTINGAS_FAILURE,
      payload: e && e.message ? e.message : e
    });

    throw e;
  }
};
