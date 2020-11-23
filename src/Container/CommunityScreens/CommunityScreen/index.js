import {
    NavigationActions
  } from 'react-navigation';
  import CommunityScreen from './CommunityScreen';
   import { connect } from 'react-redux';
   import { bindActionCreators } from 'redux';
   import { PostingAsAPI } from '../../../modules/PostingAs';
   import { getStoriesAPI } from '../../../modules/Home';
   import { getProfileAPI } from '../../../modules/GetProfile';
   const mapStateToProps = state => ({
     isBusy: state.PostingAsReducer.isBusy,
     responsePostingAs: state.PostingAsReducer,
     isBusyGetProfile: state.GetProfileReducer.isBusy,
     responseGetProfile: state.GetProfileReducer,
     stories: state.HomeReducer.stories,
    //  isBusy: state.HomeReducer.isBusy,
    //  response: state.HomeReducer,
  
   });
  
  
  
   export default connect(
     mapStateToProps,
     dispatch => {
       return {
         PostingAsAPI: bindActionCreators(PostingAsAPI, dispatch),
         getStoriesAPI: bindActionCreators(getStoriesAPI, dispatch),
         getProfileAPI: bindActionCreators(getProfileAPI, dispatch),
         navigate: bindActionCreators(NavigationActions.navigate, dispatch)
       };
     }
   )(CommunityScreen);

  