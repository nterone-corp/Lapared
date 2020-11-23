import {
    NavigationActions
  } from 'react-navigation';
  import Community from './Community';
   import { connect } from 'react-redux';
   import { bindActionCreators } from 'redux';
   import { getCommunityAPI } from '../../modules/Home';
   const mapStateToProps = state => ({
    community: state.HomeReducer.community,
   });
  
  
  
   export default connect(
     mapStateToProps,
     dispatch => {
       return {
        getCommunityAPI: bindActionCreators(getCommunityAPI, dispatch),
        navigate: bindActionCreators(NavigationActions.navigate, dispatch)
       };
     }
   )(Community);

  