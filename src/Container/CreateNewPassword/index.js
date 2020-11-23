import { NavigationActions } from 'react-navigation';
import CreateNewPassword from './createnewpassword';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CreateNewPasswordAPI } from '../../modules/ChangeNewPassword';

 const mapStateToProps = state => ({
   isBusy: state.CreateNewPasswordReducer.isBusy,
   response: state.CreateNewPasswordReducer
 });



 export default connect(
   mapStateToProps,
   dispatch => {
     return {
       CreateNewPasswordAPI: bindActionCreators(CreateNewPasswordAPI, dispatch),
       navigate: bindActionCreators(NavigationActions.navigate, dispatch)
     };
   }
)(CreateNewPassword);

//export default ChangePassword;
