import {
    NavigationActions
  } from 'react-navigation';
  import Contacts from './Contacts';
   import { connect } from 'react-redux';
   import { bindActionCreators } from 'redux';
   import { getContactsAPI } from '../../modules/Home';
   const mapStateToProps = state => ({
    contacts: state.HomeReducer.contacts,
   });
  
  
  
   export default connect(
     mapStateToProps,
     dispatch => {
       return {
        getContactsAPI: bindActionCreators(getContactsAPI, dispatch),
        navigate: bindActionCreators(NavigationActions.navigate, dispatch)
       };
     }
   )(Contacts);

  