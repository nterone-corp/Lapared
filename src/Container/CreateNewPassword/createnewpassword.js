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
} from 'react-native';
import color from '../common/colors';
import commonData from '../common/data';
import {getConfiguration, setConfiguration} from '../../utils/configuration';
export default class CreateNewPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      passworderror: false,
      password_confirmationerror: false,
      show: true,
      showReP: true,
      password: '',
      password_confirmation: '',
      resettoken: this.props.route.params.resettoken,
    };
  }

  componentDidMount() {
    console.log('tokenrest', this.state.resettoken);
  }

  resetPassword() {
    console.log('newPassword', this.state.newPassword);
    console.log('confirmPassword', this.state.confirmPassword);
    console.log('resettoken', this.state.resettoken);
    //password validation----------------------
    if (this.state.password.trim().length < 6) {
      this.setState({passworderror: true});
      // message += "\nPlease enter valid password.";
    } else {
      this.setState({passworderror: false});
    }

    // confirm password validation---------------------
    if (this.state.password_confirmation.trim().length == 0) {
      this.setState({password_confirmationerror: true});
      // message += "\nPlease enter valid confirm password.";
    } else if (this.state.password != this.state.password_confirmation) {
      this.setState({password_confirmationerror: true});
      // message += "\n'Password' and ‘Confirm Password' do not match.";
    } else {
      if (commonData.regex.firstname.test(this.state.first_name) == true) {
        if (commonData.regex.firstname.test(this.state.last_name) == true) {
          this.resetPasswordApi();
        }
      }

      this.setState({password_confirmationerror: false});
    }
  }
  resetPasswordApi() {
    console.log('newPassword', this.state.password);
    console.log('confirmPassword', this.state.password_confirmation);
    console.log('resettoken', this.state.resettoken);
    setConfiguration('Token', '');
    this.props
      .CreateNewPasswordAPI(
        this.state.resettoken,
        this.state.password,
        this.state.password_confirmation,
      )
      .then(() => this.afterChangePasswordAPI())
      .catch((e) => this.showAlert(e.message, 300));
  }

  afterChangePasswordAPI() {
    console.log('isBusy value --- ', this.props.isBusy);
    console.log('response value --- ', this.props.response);
    this.props.navigation.navigate('Introduction');
  }
  back() {
    this.props.navigation.goBack();
  }
  passwordShow() {
    this.setState({show: !this.state.show});
  }
  passwordShowRep() {
    this.setState({showReP: !this.state.showReP});
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
      <View style={{flex: 1}}>
          <StatusBar
            hidden={false}
            backgroundColor={'#BD2026'}
            barStyle="light-content"
            
        />
        <ImageBackground
          source={require('../../assests/image/login_background.png')}
          style={{width: '100%', height: '100%'}}>
          {/* Back Button */}
          <TouchableOpacity onPress={() => this.back()}>
            <Image
              style={styles.backbuttonStyle}
              source={require('../../assests/image/back.png')}
            />
          </TouchableOpacity>

          <Text style={styles.cretepassword_style}>
            {commonData.string_constants.create_new_password}{' '}
          </Text>

          <Text style={styles.enterpass_style}>
            {commonData.string_constants.enter_password}{' '}
          </Text>

          {/* TextInput for Password */}
          <View
            style={[
              styles.textinputStyle,
              {
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: this.state.passworderror == false ? 0 : 2,
                borderColor: color.RED_BUTTON,
              },
            ]}>
            <TextInput
              placeholder="Password"
              style={{
                width: '90%',
                placeholderTextColor: 'gray',
                color: 'black',
              }}
              onChangeText={(password) => this.setState({password})}
              value={this.state.password}
              secureTextEntry={this.state.show}
            />

            <TouchableOpacity
              onPress={() => this.passwordShow()}
              style={{
                width: 50,
                right: 10,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              {this.state.show == true ? (
                <Image
                  style={{
                    width: 22,
                    height: 22,
                    alignSelf: 'center',
                  }}
                  source={require('../../assests/image/password_show.png')}
                />
              ) : (
                <Image
                  style={{
                    width: 22,
                    height: 22,
                    alignSelf: 'center',
                  }}
                  source={require('../../assests/image/password_hide.png')}
                />
              )}
            </TouchableOpacity>
          </View>
          {this.state.passworderror == true ? (
            <Text style={{left: 30, color: color.RED_BUTTON, fontSize: 15}}>
              Please enter atleast six characters
            </Text>
          ) : null}
          <View
            style={[
              styles.textinputStyle,
              {
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth:
                  this.state.password_confirmationerror == false ? 0 : 2,
                borderColor: color.RED_BUTTON,
              },
            ]}>
            <TextInput
              placeholder="Re-enter password"
              style={{
                width: '90%',
                placeholderTextColor: 'gray',
                color: 'black',
              }}
              onChangeText={(password_confirmation) =>
                this.setState({password_confirmation})
              }
              value={this.state.password_confirmation}
              secureTextEntry={this.state.showReP}
            />

            <TouchableOpacity
              onPress={() => this.passwordShowRep()}
              style={{
                width: 50,
                right: 10,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              {this.state.showReP == true ? (
                <Image
                  style={{
                    width: 22,
                    height: 22,
                    alignSelf: 'center',
                  }}
                  source={require('../../assests/image/password_show.png')}
                />
              ) : (
                <Image
                  style={{
                    width: 22,
                    height: 22,
                    alignSelf: 'center',
                  }}
                  source={require('../../assests/image/password_hide.png')}
                />
              )}
            </TouchableOpacity>
          </View>
          {this.state.password_confirmationerror == true ? (
            <Text style={{left: 30, color: color.RED_BUTTON, fontSize: 15}}>
              Password and Confirm Password do not match
            </Text>
          ) : null}

          <TouchableOpacity
            onPress={() => this.resetPassword()}
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
              Set Password{' '}
            </Text>
          </TouchableOpacity>

          <Text style={styles.lecencestyle}>
            {commonData.string_constants.licence_date}{' '}
          </Text>
        </ImageBackground>
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
  cretepassword_style: {
    color: color.WHITE,
    textAlign: 'center',
    fontSize: 20,
    marginTop: 24,
  },
  enterpass_style: {
    color: color.Grey,
    textAlign: 'center',
    fontSize: 15,
    marginTop: 24,
  },
  lecencestyle: {
    color: color.Grey,
    textAlign: 'center',
    marginTop: 26,
  },
  textinputStyle: {
    width: '90%',
    height: 50,
    paddingLeft: 12,
    borderColor: 'gray',
    borderWidth: 1,
    color: 'gray',
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 8,
    marginTop: 16,
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
