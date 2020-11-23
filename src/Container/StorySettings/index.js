import {
    NavigationActions
  } from 'react-navigation';

   import { connect } from 'react-redux';
   import { bindActionCreators } from 'redux';
   import { getContactsAPI } from '../../modules/Home';
   import { getProfileAPI, setProfileAPI } from '../../modules/GetProfile';
   
   import StorySettings from "./StorySettings";
   const mapStateToProps = state => ({
    contacts: state.HomeReducer.contacts,
    responseGetProfile: state.GetProfileReducer
   });
  
  
  
   export default connect(
     mapStateToProps,
     dispatch => {
       return {
        setProfileAPI: bindActionCreators(setProfileAPI, dispatch),
        getContactsAPI: bindActionCreators(getContactsAPI, dispatch),
        navigate: bindActionCreators(NavigationActions.navigate, dispatch),
        getProfileAPI: bindActionCreators(getProfileAPI, dispatch),

       };
     }
   )(StorySettings);

  