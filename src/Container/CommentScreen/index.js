import {
    NavigationActions
  } from 'react-navigation';
  import Comments from './Comments';
   import { connect } from 'react-redux';
   import { bindActionCreators } from 'redux';
   import { getHomeAPI } from '../../modules/Home';
   import { PostingAsAPI } from '../../modules/PostingAs';
   const mapStateToProps = state => ({
     isBusy: state.HomeReducer.isBusy,
     response: state.HomeReducer,
     isBusy: state.PostingAsReducer.isBusy,
     responsePostingAs: state.PostingAsReducer,
  
   });
  
  
  
   export default connect(
     mapStateToProps,
     dispatch => {
       return {
         getHomeAPI: bindActionCreators(getHomeAPI, dispatch),
         PostingAsAPI: bindActionCreators(PostingAsAPI, dispatch),
         navigate: bindActionCreators(NavigationActions.navigate, dispatch)
       };
     }
   )(Comments);

  