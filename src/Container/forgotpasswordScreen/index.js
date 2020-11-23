import { NavigationActions } from 'react-navigation';
import ForgotPassword from './ForgotPassword';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ForgotPasswordAPI } from '../../modules/ChangePassword';

 const mapStateToProps = state => ({
   isBusy: state.ForgotPasswordReducer.isBusy,
   response: state.ForgotPasswordReducer
 });



 export default connect(
   mapStateToProps,
   dispatch => {
     return {
       ForgotPasswordAPI: bindActionCreators(ForgotPasswordAPI, dispatch),
       navigate: bindActionCreators(NavigationActions.navigate, dispatch)
     };
   }
)(ForgotPassword);

//export default ChangePassword;
