
//import { createStore, combineReducers, applyMiddleware } from 'redux';
import AuthReducer from '../modules/auth';
import RegisterReducer from '../modules/Register'
import ForgotPasswordReducer from '../modules/ChangePassword'
import CreateNewPasswordReducer from '../modules/ChangeNewPassword'
import HomeReducer from '../modules/Home'
import PostingAsReducer from '../modules/PostingAs'
import GetProfileReducer from '../modules/GetProfile'
import GetContactReducer from '../modules/GetContact'
import {applyMiddleware, createStore, compose, combineReducers} from 'redux';
import * as reduxLoop from 'redux-loop-symbol-ponyfill';
import middleware from './middleware';
import reducer from './reducer';
import CreateCommunityReducer from '../modules/CreateCommunity'

const enhancers = [
  applyMiddleware(...middleware),
  reduxLoop.install()
];



const rootReducer = combineReducers({
  AuthReducer,
  RegisterReducer,
  ForgotPasswordReducer,
  HomeReducer,
  PostingAsReducer,
  GetProfileReducer,
  GetContactReducer,
  CreateNewPasswordReducer,
  CreateCommunityReducer

})


const store = createStore(rootReducer,
                          applyMiddleware(...middleware));


console.log(store.getState());
// /* Enable redux dev tools only in development.
//  * We suggest using the standalone React Native Debugger extension:
//  * https://github.com/jhen0409/react-native-debugger
//  */
// /* eslint-disable no-undef */
const composeEnhancers = (
	__DEV__ &&
	typeof (window) !== 'undefined' &&
	window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
	) || compose;
// /* eslint-enable no-undef */
//
const enhancer = composeEnhancers(...enhancers);

export default store;
