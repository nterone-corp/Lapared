import {
    NavigationActions
  } from 'react-navigation';
  import EditCommunity from './EditCommunity';
   import { connect } from 'react-redux';
   import { bindActionCreators } from 'redux';
   import { PostingAsAPI } from '../../../modules/PostingAs';
//    import { getHomeAPI } from '../../modules/Home';
//    import { getProfileAPI } from '../../modules/GetProfile';
   const mapStateToProps = state => ({
     isBusy: state.PostingAsReducer.isBusy,
     responsePostingAs: state.PostingAsReducer,
    //  isBusyGetProfile: state.GetProfileReducer.isBusy,
    //  responseGetProfile: state.GetProfileReducer,
    //  isBusy: state.HomeReducer.isBusy,
    //  response: state.HomeReducer,
  
   });
  
  
  
   export default connect(
     mapStateToProps,
     dispatch => {
       return {
         PostingAsAPI: bindActionCreators(PostingAsAPI, dispatch),
        //  getHomeAPI: bindActionCreators(getHomeAPI, dispatch),
        //  getProfileAPI: bindActionCreators(getProfileAPI, dispatch),
         navigate: bindActionCreators(NavigationActions.navigate, dispatch)
       };
     }
   )(EditCommunity);

  