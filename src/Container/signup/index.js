import {NavigationActions} from 'react-navigation';
import Signup from './sign';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {registerAPI} from '../../modules/Register';

const mapStateToProps = (state) => ({
  isBusy: state.RegisterReducer.isBusy,
  response: state.RegisterReducer,
});

export default connect(mapStateToProps, (dispatch) => {
  return {
    registerAPI: bindActionCreators(registerAPI, dispatch),

    navigate: bindActionCreators(NavigationActions.navigate, dispatch),
  };
})(Signup);
