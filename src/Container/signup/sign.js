import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
  TextInput,
  Text,
  Alert,
  ImageBackground,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import color from '../common/colors';
import Activity from '../common/ActivityIndicator';

import Toast from 'react-native-simple-toast';
import images from '../common/images';
import commonData from '../common/data';
import {setConfiguration} from '../../utils/configuration';

export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      password_confirmation: '',
      show: true,
      showReP: true,
      emailerror: false,
      first_nameerror: false,
      last_nameerror: false,
      passworderror: false,
      password_confirmationerror: false,
    };

    const {navigation} = props;

    this.didFocusListener = navigation.addListener(
      'didFocus',
      this.componentDidFocus,
    );
  }

  showAlert(message, duration) {
    this.setState({autoLogin: false});
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      alert(message);
    }, duration);
  }

  passwordShow() {
    this.setState({show: !this.state.show});
  }
  passwordShowRep() {
    this.setState({showReP: !this.state.showReP});
  }

  goToNextScreen() {
    Keyboard.dismiss();
    // var message = "";
    //first name validation------------------------------
    if (this.state.first_name.trim().length == 0) {
      this.setState({first_nameerror: true});
    } else if (
      commonData.regex.firstname.test(this.state.first_name) == false
    ) {
      this.setState({first_nameerror: true});
    } else {
      this.setState({first_nameerror: false});
    }

    //email validation-----------------------
    if (this.state.last_name.trim().length == 0) {
      this.setState({last_nameerror: true});
    } else if (commonData.regex.firstname.test(this.state.last_name) == false) {
      this.setState({last_nameerror: true});
    } else {
      this.setState({last_nameerror: false});
    }

    //email name validation------------------------
    if (this.state.email.trim().length == 0) {
      this.setState({emailerror: true});
    } else if (commonData.regex.email.test(this.state.email) == false) {
      this.setState({emailerror: true});
    } else {
      this.setState({emailerror: false});
    }

    //password validation----------------------
    if (this.state.password.trim().length < 6) {
      this.setState({passworderror: true});
    } else {
      this.setState({passworderror: false});
    }

    // confirm password validation---------------------
    if (this.state.password_confirmation.trim().length == 0) {
      this.setState({password_confirmationerror: true});
    } else if (this.state.password != this.state.password_confirmation) {
      this.setState({password_confirmationerror: true});
    } else {
      if (commonData.regex.firstname.test(this.state.first_name) == true) {
        if (commonData.regex.firstname.test(this.state.last_name) == true) {
          if (commonData.regex.email.test(this.state.email) == true) {
            this.register();
          }
        }
      }

      this.setState({password_confirmationerror: false});
    }
  }

  afterRegister() {
    console.log('isBusy value --- ', this.props.isBusy);
    console.log('response value --- ', this.props.response);
    Toast.show('Your account has been created');
    Alert.alert(
      'Alert',
      'A confirmation email has been sent to your account ',
      [
        {
          text: 'OK',
          onPress: () => this.props.navigation.navigate('Introduction'),
        },
      ],
    );
    // this.props.navigation.navigate('Login');
  }

  register() {
    setConfiguration('Token', '');
    this.props
      .registerAPI(
        this.state.email,
        this.state.first_name,
        this.state.last_name,
        this.state.password,
        this.state.password_confirmation,
      )

      .then(() => this.afterRegister())
      .catch((e) => this.errorMessage(e.message, 300));
  }
  errorMessage(message) {
    if (message == 'Email has already been taken') {
      this.showAlert('Email id already exists - please enter another email id');
    }
  }
  signIn() {
    this.props.navigation.navigate('Login');
  }
  TermAndCondition(item) {
    console.log('term>>>>>', item);
    this.props.navigation.navigate('TermAndCondition', {item: item});
  }
  back() {
    this.props.navigation.goBack();
  }

  cleanText = (text) => {
    text = text.replace(/[^A-Za-z]/g, '');
    this.setState({first_name: text});
  };

  cleanTextLst = (textLst) => {
    textLst = textLst.replace(/[^A-Za-z]/g, '');
    this.setState({last_name: textLst});
  };
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'gray'}}>
        <View style={{height: '100%', width: '100%'}}>
          <ImageBackground
            source={require('../../assests/image/login_background.png')}
            style={{width: '100%', height: '100%'}}>
            <TouchableOpacity
              style={{left: 20, height: '8%', justifyContent: 'center'}}
              onPress={() => this.back()}>
              <Image
                style={styles.backbuttonStyle}
                source={require('../../assests/image/back.png')}
              />
            </TouchableOpacity>
            <ScrollView>
              <View
                style={{
                  height: '25%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <Image
                  resizeMode="contain"
                  source={images.logo}
                  style={{height: '35%', width: '68%', marginTop: 30}}
                />

                <Text style={{color: 'white', marginTop: 28, fontSize: 20}}>
                  Create a new account
                </Text>

                {/* True Privacy */}

                <View style={{flexDirection: 'row', marginTop: 8}}>
                  <Text style={{color: 'white', fontSize: 24}}> True</Text>
                  <Text style={{color: color.RED, fontSize: 24, marginLeft: 4}}>
                    Privacy{' '}
                  </Text>
                </View>

                <Text
                  style={{
                    color: color.Grey,
                    fontSize: 14,
                    marginTop: 12,
                    bottom: 10,
                  }}>
                  {' '}
                  Family , non-profit and kid friendly{' '}
                </Text>
              </View>
              <View style={{height: '45%'}}>
                <TextInput
                  placeholder="First name"
                  style={[
                    styles.textinputStyle,
                    {
                      borderWidth: this.state.first_nameerror == false ? 0 : 2,
                      borderColor: color.RED_BUTTON,
                    },
                  ]}
                  onChangeText={(first_name) => this.setState({first_name})}
                  value={this.state.first_name}
                  maxLength={20}
                />
                {this.state.first_nameerror == true ? (
                  <Text
                    style={{left: 30, color: color.RED_BUTTON, fontSize: 15}}>
                    Please enter vaild first name
                  </Text>
                ) : null}
                <TextInput
                  placeholder="Last name"
                  style={[
                    styles.textinputStyle,
                    {
                      borderWidth: this.state.last_nameerror == false ? 0 : 2,
                      borderColor: color.RED_BUTTON,
                    },
                  ]}
                  onChangeText={(last_name) => this.setState({last_name})}
                  value={this.state.last_name}
                  maxLength={20}
                />
                {this.state.last_nameerror == true ? (
                  <Text
                    style={{left: 30, color: color.RED_BUTTON, fontSize: 15}}>
                    Please enter vaild last name
                  </Text>
                ) : null}
                <TextInput
                  placeholder="Email"
                  style={[
                    styles.textinputStyle,
                    {
                      borderWidth: this.state.emailerror == false ? 0 : 2,
                      borderColor: color.RED_BUTTON,
                    },
                  ]}
                  onChangeText={(email) => this.setState({email})}
                  value={this.state.email}
                />
                {this.state.emailerror == true ? (
                  <Text
                    style={{left: 30, color: color.RED_BUTTON, fontSize: 15}}>
                    Please enter vaild email address
                  </Text>
                ) : null}
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
                  <Text
                    style={{left: 30, color: color.RED_BUTTON, fontSize: 15}}>
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
                  <Text
                    style={{left: 30, color: color.RED_BUTTON, fontSize: 15}}>
                    Password and Confirm Password do not match
                  </Text>
                ) : null}

                <TouchableOpacity
                  onPress={() => this.goToNextScreen()}
                  style={{
                    height: '12%',
                    top: 24,
                    width: '90%',
                    marginStart: 22,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: color.RED,
                    borderRadius: 5,
                    elevation: 12,
                  }}>
                  <Text
                    style={{
                      color: color.WHITE,
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                    Create Account
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  height: 300,
                  flexDirection: 'column',
                  top: this.state.password_confirmationerror == true ? 60 : 0,

                  alignItems: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '90%',
                    top: this.state.emailerror == true ? 40 : 0,
                  }}>
                  <Text
                    style={{
                      fontSize: 13,
                      color: color.Grey,
                      marginTop: 14,
                    }}>
                    {commonData.string_constants.by_creating_newaccount}{' '}
                  </Text>
                  <Text
                    onPress={() => this.TermAndCondition('Terms of Service')}
                    allowFontScaling={false}
                    style={{
                      fontSize: 13,
                      fontWeight: 'bold',
                      color: color.WHITE,
                      marginTop: 14,
                    }}>
                    {commonData.string_constants.terms_use}
                  </Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    top: this.state.first_nameerror == true ? 40 : 0,
                  }}>
                  <Text
                    style={{
                      color: color.Grey,
                      fontSize: 13,
                    }}>
                    {' '}
                    {commonData.string_constants.and_our}
                  </Text>
                  <Text
                    onPress={() => this.TermAndCondition('Privacy policy')}
                    style={{
                      fontWeight: 'bold',
                      fontSize: 13,
                      color: color.WHITE,
                    }}>
                    {' '}
                    {commonData.string_constants.privacy_policy}
                  </Text>
                </View>

                <View
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    top: this.state.password_confirmationerror == true ? 20 : 0,
                  }}>
                  <Text
                    style={{
                      color: color.Grey,
                      marginTop: 50,
                    }}>
                    {' '}
                    {commonData.string_constants.AlreadyHaveAnAccount}
                  </Text>
                  <Text
                    onPress={() => this.signIn()}
                    style={{
                      fontWeight: 'bold',

                      color: color.WHITE,
                      marginTop: 50,
                    }}>
                    {' '}
                    {commonData.string_constants.sign_in}
                  </Text>
                </View>

                <View
                  style={{
                    width: '100%',
                    height: '50%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    bottom:
                      this.state.password_confirmationerror == true ? 20 : 0,
                  }}>
                  <Text
                    style={{
                      fontWeight: 'bold',

                      color: color.Grey,
                      marginTop: 14,
                    }}>
                    {' '}
                    {commonData.string_constants.licence_date}
                  </Text>
                </View>
              </View>
            </ScrollView>
          </ImageBackground>
          {this.props.isBusy || this.props.isBusySocial ? <Activity /> : null}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  parentstyle: {
    flex: 1,
  },
  email_field_style: {
    flexDirection: 'row',
    height: 50,
    paddingLeft: 12,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 6,
    marginLeft: 24,
    marginTop: 26,
    marginRight: 24,
    color: color.BLACK,
  },
  textinputStyle: {
    width: '90%',
    height: '12%',
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
  backbuttonStyle: {
    width: 20,
    height: 20,
  },
});
