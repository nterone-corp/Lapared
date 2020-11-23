import { NavigationActions } from 'react-navigation';
import CreateCommunityScreen from './CreateCommunityScreen';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CreateCommunityAPI } from '../../../modules/CreateCommunity';
import { PostingAsAPI } from '../../../modules/PostingAs';
 const mapStateToProps = state => ({
   isBusy: state.CreateCommunityReducer.isBusy,
   response: state.CreateCommunityReducer,
   isBusy: state.PostingAsReducer.isBusy,
   responsePostingAs: state.PostingAsReducer,
 });



 export default connect(
   mapStateToProps,
   dispatch => {
     return {
       CreateCommunityAPI: bindActionCreators(CreateCommunityAPI, dispatch),
       PostingAsAPI: bindActionCreators(PostingAsAPI, dispatch),
       navigate: bindActionCreators(NavigationActions.navigate, dispatch)
     };
   }
)(CreateCommunityScreen);

//export default ChangePassword;
