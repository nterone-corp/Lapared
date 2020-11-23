import {NavigationActions} from 'react-navigation';
import Share from './Share';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {getContactAPI} from '../../modules/GetContact';
const mapStateToProps = (state) => ({
  isBusyGetContact: state.GetContactReducer.isBusy,
  responseGetContact: state.GetContactReducer,
});

export default connect(mapStateToProps, (dispatch) => {
  return {
    getContactAPI: bindActionCreators(getContactAPI, dispatch),
    navigate: bindActionCreators(NavigationActions.navigate, dispatch),
  };
})(Share);
