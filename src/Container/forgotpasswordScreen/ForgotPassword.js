import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
  TextInput,
  Text,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  ColorPropType,
  Keyboard,
} from 'react-native';
import color from '../common/colors';
import commonData from '../common/data';
import Activity from '../common/ActivityIndicator'
import { getConfiguration , setConfiguration} from '../../utils/configuration';


export default class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailblank:false
    };

    const {navigation} = props;

    this.didFocusListener = navigation.addListener(
      'didFocus',
      this.componentDidFocus,
    );
  }
  resetPassword() {
    this.props.navigation.navigate('Checkyouremail');
  }

  goToNextScreen() {
    Keyboard.dismiss()
     if (commonData.regex.email.test(this.state.email) == false){
      this.setState({emailblank:true})
      // message += "\n'Please enter vaild email";
    }
    else{
     this.changePassword()
      this.setState({emailblank:false})
    }
  }

  changePassword() {
    setConfiguration('Token', '');
    this.props.ForgotPasswordAPI(this.state.email)
      .then(() => this.afterChangePasswordAPI())
      .catch((e) => this.showAlert(e.message, 300));
  }

  afterChangePasswordAPI() {
    console.log('isBusy value --- ', this.props.isBusy);
    console.log('response value --- ', this.props.response);
    this.resetPassword()
  }
  back() {
    this.props.navigation.goBack();
  }

 
 showAlert(message, duration) {
  this.setState({autoLogin: false});
 clearTimeout(this.timer);
 this.timer = setTimeout(() => {
   alert(message);
 }, duration);
}

  render() {
    return (
      <SafeAreaView style={{flex:1,backgroundColor: 'gray'}}>
      <View>
        
        <ImageBackground
          source={require('../../assests/image/login_background.png')}
          style={{width: '100%', height: '100%'}}>
          {/* Back Button */}
          <TouchableOpacity style={{height:50,width:50}} onPress={()=>this.back()}>

     
          <Image
            style={styles.backbuttonStyle}
            source={require('../../assests/image/back.png')}
          />
     </TouchableOpacity>
     <View style={{top:30}}>

    
          <Text
            style={{
              color: color.WHITE,
              alignSelf: 'center',
              fontSize: 23,
              color: color.WHITE,
              fontWeight: '600',
            }}>
            {commonData.string_constants.forgot_password}
          </Text>

          <Text
            style={{
              color: color.WHITE,
              alignSelf: 'center',
              marginStart: 16,
              marginRight: 16,
              marginTop: 12,
              textAlign: 'center',
              fontSize: 16,
              color: color.Grey,
            }}>
            {commonData.string_constants.please_enter_email}
          </Text>

          <TextInput
            placeholder="jane.doe@lap#BD2026.com"
            placeholderTextColor="gray"
            style={[styles.textinputStyle,{ borderWidth:this.state.emailblank == false ? 0:2,
              borderColor:color.RED_BUTTON}]}
            onChangeText={(email) => this.setState({email})}
            value={this.state.email}
          />
             {
                this.state.emailblank == true ?
                <Text style={{left:30,color:color.RED_BUTTON,fontSize:15}}>
                Please enter vaild email address
              </Text>
              :null

              }
          <TouchableOpacity
            onPress={() => this.goToNextScreen()}
            style={{
              height: 50,
              width: '90%',
              marginTop: 24,
              marginStart: 22,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#BD2026',
              borderRadius: 5,
              elevation: 12,
            }}>
            <Text
              style={{
                color: color.WHITE,
                fontSize: 18,
                fontWeight: 'bold',
              }}>
              {' '}
              Reset Password{' '}
            </Text>
          </TouchableOpacity>

          <Text onPress={()=>this.back()} style={styles.waitmessagestyle}>
            {' '}
            {commonData.string_constants.wait_message}{' '}
          </Text>

          <Text style={styles.lecencestyle}>
            {' '}
            {commonData.string_constants.licence_date}{' '}
          </Text>
          </View>
        </ImageBackground>
        {this.props.isBusy || this.props.isBusySocial  ? <Activity /> : null}

      </View>
    </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  parentstyle: {
    flex: 1,
  },
  backbuttonStyle: {
    width: 20,
    height: 20,
    margin: 24,
  },
  textinputStyle: {
    width: '90%',
    height: 50,
    paddingLeft: 12,
    borderColor: 'gray',
    borderWidth: 1,
    color: 'black',
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 8,
    marginTop: 16,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  waitmessagestyle: {
    color: color.WHITE,
    textAlign: 'center',
    marginTop: 16,
  },

  lecencestyle: {
    color: color.WHITE,
    textAlign: 'center',
    marginTop: 70,
  },
});
