import {
  NavigationActions
} from 'react-navigation';
import HomeScreen from './HomeScreen';
 import { connect } from 'react-redux';
 import { bindActionCreators } from 'redux';
 import { getHomeAPI, getStoriesAPI } from '../../modules/Home';
 import { getProfileAPI } from '../../modules/GetProfile';
 const mapStateToProps = state => ({
   isBusy: state.HomeReducer.isBusy,
   response: state.HomeReducer,
  //  status: state.HomeReducer,
   isBusyGetProfile: state.GetProfileReducer.isBusy,
   responseGetProfile: state.GetProfileReducer,
   stories: state.HomeReducer.stories,
 });



 export default connect(
   mapStateToProps,
   dispatch => {
     return {
      
      getStoriesAPI: bindActionCreators(getStoriesAPI, dispatch),
       getHomeAPI: bindActionCreators(getHomeAPI, dispatch),
       getProfileAPI: bindActionCreators(getProfileAPI, dispatch),
       navigate: bindActionCreators(NavigationActions.navigate, dispatch)
     };
   }
 )(HomeScreen);

