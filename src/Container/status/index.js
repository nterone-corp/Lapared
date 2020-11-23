import {
    NavigationActions
  } from 'react-navigation';
  import NewFeeds from './NewFeeds';
   import { connect } from 'react-redux';
   import { bindActionCreators } from 'redux';
   import { getHomeAPI } from '../../modules/Home';
   import { getProfileAPI } from '../../modules/GetProfile';
   const mapStateToProps = state => ({
     isBusy: state.HomeReducer.isBusy,
     response: state.HomeReducer,
     isBusyGetProfile: state.GetProfileReducer.isBusy,
     responseGetProfile: state.GetProfileReducer,
  
   });
  
  
  
   export default connect(
     mapStateToProps,
     dispatch => {
       return {
         getHomeAPI: bindActionCreators(getHomeAPI, dispatch),
         getProfileAPI: bindActionCreators(getProfileAPI, dispatch),
         navigate: bindActionCreators(NavigationActions.navigate, dispatch)
       };
     }
   )(NewFeeds);

  