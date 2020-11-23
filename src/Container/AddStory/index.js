import {
  NavigationActions
} from 'react-navigation';
import AddStory from './AddStory';
 import { connect } from 'react-redux';
 import { bindActionCreators } from 'redux';
 import { getStoriesAPI } from '../../modules/Home';

 const mapStateToProps = state => ({
  
 });



 export default connect(
   mapStateToProps,
   dispatch => {
     return {
      
      getStoriesAPI: bindActionCreators(getStoriesAPI, dispatch),
       navigate: bindActionCreators(NavigationActions.navigate, dispatch)
     };
   }
 )(AddStory);

