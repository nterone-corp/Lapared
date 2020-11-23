import {
    NavigationActions
  } from 'react-navigation';
  import AddMember from './AddMember';
   import { connect } from 'react-redux';
   import { bindActionCreators } from 'redux';
//    import { PostingAsAPI } from '../modules/PostingAs';
   import { getContactAPI } from '../../../modules/GetContact';
   const mapStateToProps = state => ({
    //  isBusy: state.PostingAsReducer.isBusy,
    //  response: state.PostingAsReducer,
     isBusyGetContact: state.GetContactReducer.isBusy,
     responseGetContact: state.GetContactReducer,
  
   });
  
  
  
   export default connect(
     mapStateToProps,
     dispatch => {
       return {
        //  PostingAsAPI: bindActionCreators(PostingAsAPI, dispatch),
         getContactAPI: bindActionCreators(getContactAPI, dispatch),
         navigate: bindActionCreators(NavigationActions.navigate, dispatch)
       };
     }
   )(AddMember);

  