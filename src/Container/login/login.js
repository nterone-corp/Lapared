import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TextInput,
  Animated,
  ImageBackground,
  TouchableOpacity,
  Keyboard,
  AsyncStorage,
} from 'react-native';
import color from '../common/colors';
import Activity from '../common/ActivityIndicator';
import images from '../common/images';
import commonData from '../common/data';
import {getConfiguration, setConfiguration} from '../../utils/configuration';
import Toast from 'react-native-simple-toast';

export default class Login extends React.Component {
  that = this;
  constructor(props) {
    super(props);
    this.state = {
      email: 'shubham2396@yopmail.com',
      password: '123456',
      mainViewTop: 0,
      autoLogin: false,
      show: true,
      emailblank: false,
      passblank: false,
      screenHeight: 0,
      fadeAnim: new Animated.Value(0), // init opacity 0
    };

    const {navigation} = props;

    this.didFocusListener = navigation.addListener(
      'didFocus',
      this.componentDidFocus,
    );
  }

  componentDidFocus = (payload) => {
    const {params} = payload.action;
    this.getToken();
  };


  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    setConfiguration('fcmToken', fcmToken);
  }

  componentWillMount() {
    this.setState({autoLogin: true});
  }

  componentDidMount() {
    this.getData();

    Animated.timing(
      // Uses easing functions
      this.state.fadeAnim, // The value to drive
      {toValue: 1}, // Configuration
    ).start(); // Don't forget start!
  }

  async getData() {
    const tokk = await AsyncStorage.getItem('Tokenn');

    setConfiguration('token', tokk);

    const tokkk = getConfiguration('Tokenn');

    let userId = '';
    console.log('ukkkkkk', tokk);

    if (tokkk != '' && tokkk != null) {
      console.log('login ho gya');
      setTimeout(() => this.getProfile(), 10);
    } else {
      console.log('login nahi hoiya');
      this.setState({autoLogin: false});
    }
  }
  getProfile() {
    this.props.navigation.navigate('Home');
  }

  goToNextScreen() {
    Keyboard.dismiss();

    if (
      this.state.email == '' &&
      commonData.regex.email.test(this.state.email) == false
    ) {
      this.setState({emailblank: true});
    } else if (commonData.regex.email.test(this.state.email) == false) {
      this.setState({emailblank: true});
    } else {
      this.setState({emailblank: false});
    }

    if (this.state.password == '') {
      this.setState({passblank: true});
    } else {
      if (commonData.regex.email.test(this.state.email) == true) {
        this.login();
      }
      this.setState({passblank: false});
    }
  }

  showAlert(message, duration) {
    this.setState({autoLogin: false});
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      alert(message);
    }, duration);
  }

  afterLogin() {
    console.log('isBusy value --- ', this.props.isBusy);
    console.log('response value --- ', this.props.response);

    let tok = this.props.response.response.access_token;

    if (tok) {
      Toast.show('You’ve logged in successfully.');
      let reftok = this.props.response.response.refresh_token;
      setConfiguration('Token', tok);

      setConfiguration('token', reftok);
      this.storeData();
      this.props.navigation.navigate('Home');
    } else {
      Toast.show('Something went wrong. Please try again!!');
    }
  }

  login() {
    setConfiguration('token', '');
    setConfiguration('Token', '');

    console.log('password', this.state.password);
    this.props
      .loginWithPhone(this.state.email, this.state.password)
      .then(() => this.afterLogin())
      .catch((e) => this.showAlert(e.message));
  }

  profileFailed() {
    this.setState({autoLogin: false});
    this.showAlertError(e.message, 300);
  }

  goToSignup() {
    this.props.navigation.navigate('SignUp');
  }

  storeData = async () => {
    console.log('storedatataaa');
    try {
      const Token = getConfiguration('Token');
      await AsyncStorage.setItem('Token', Token);

      console.log('success in storage');
    } catch (e) {
      // saving error
      console.log('error in storage', e);
    }
  };

  forgotPassword() {
    this.props.navigation.navigate('ForgotPassword');
  }

  passwordShow() {
    this.setState({show: !this.state.show});
  }
  back() {
    this.props.navigation.goBack();
  }

  GoToHome() {
    this.props.navigation.navigate('Home');
  }
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'gray'}}>
        <View style={styles.parentstyle}>
          <ImageBackground
            source={images.common_background}
            style={styles.background_style}>
            {/* Back Press */}
            <TouchableOpacity
              onPress={() => this.back()}
              style={{
                justifyContent: 'center',
                left: 20,

                height: '8%',
                width: 70,
              }}>
              <Image
                resizeMode="contain"
                style={styles.backbuttonStyle}
                source={images.back}
              />
            </TouchableOpacity>

            {/* Login From */}
            <ScrollView>
              <View style={{height: 700, top: -50}}>
                <View style={styles.logo_text_style}>
                  <Image
                    source={images.logo}
                    style={{height: '40%', width: '68%'}}
                  />
                </View>

                <Text style={styles.login_textstyle}>
                  {' '}
                  {commonData.string_constants.login}{' '}
                </Text>

                <Text style={styles.enter_text_style}>
                  {commonData.string_constants.enter_email}
                </Text>

                <View style={{color: color.WHITE}}>
                  <View>
                    <TextInput
                      placeholder="Email"
                      style={[
                        styles.email_field_style,
                        {
                          borderWidth: this.state.emailblank == false ? 0 : 2,
                          borderColor: color.RED_BUTTON,
                        },
                      ]}
                      onChangeText={(email) => this.setState({email})}
                      value={this.state.email}
                    />
                    {this.state.emailblank == true ? (
                      <Text
                        style={{
                          left: 30,
                          color: color.RED_BUTTON,
                          fontSize: 15,
                        }}>
                        Please enter vaild email address
                      </Text>
                    ) : null}
                  </View>

                  <View
                    style={[
                      styles.email_field_style,
                      {
                        borderWidth: this.state.passblank == false ? 0 : 2,
                        borderColor: color.RED_BUTTON,
                        bottom: 10,
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
                        right: 20,
                        height: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                      }}>
                      {this.state.show == true ? (
                        <Animated.Image
                          style={{
                            width: 22,
                            height: 22,
                            alignSelf: 'center',
                            opacity: this.state.fadeAnim,
                          }}
                          source={require('../../assests/image/password_show.png')}
                        />
                      ) : (
                        <Animated.Image
                          style={{
                            width: 22,
                            height: 22,
                            alignSelf: 'center',
                            opacity: this.state.fadeAnim,
                          }}
                          source={require('../../assests/image/password_hide.png')}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                  {this.state.passblank == true ? (
                    <Text
                      style={{
                        left: 30,
                        color: color.RED_BUTTON,
                        fontSize: 15,
                        top: -10,
                      }}>
                      Please enter vaild password
                    </Text>
                  ) : null}
                  <TouchableOpacity
                    onPress={() => this.goToNextScreen()}
                    style={styles.goToNext}>
                    <Text
                      style={{
                        color: color.WHITE,
                        fontSize: 18,
                        fontWeight: 'bold',
                      }}>
                      Sign In
                    </Text>
                  </TouchableOpacity>

                  <Text
                    onPress={() => this.forgotPassword()}
                    style={styles.forgetstyle}>
                    Forgot Password?
                  </Text>

                  <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                    <Text
                      onPress={() => this.goToSignup()}
                      style={styles.forgetstyle}>
                      Don't have an account?
                    </Text>
                    <Text
                      onPress={() => this.goToSignup()}
                      style={[styles.forgetstyle, {fontWeight: 'bold'}]}>
                      {' '}
                      Create account
                    </Text>
                  </View>

                  <Text style={styles.forgetstyle}> @ 2020 Lapared, LLC </Text>
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
  scrollview: {
    height: '100%',
  },
  backbuttonStyle: {
    left: 10,
    width: 20,
    height: 20,
  },
  login_textstyle: {
    alignSelf: 'center',
    color: color.WHITE,

    fontSize: 20,
  },
  logo_text_style: {
    height: '25%',
    width: '100%',
    marginTop: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  email_field_style: {
    flexDirection: 'row',
    height: 50,
    paddingLeft: 12,
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 6,
    marginLeft: 24,
    marginTop: 26,
    marginRight: 24,
    color: color.BLACK,
  },
  background_style: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  forgetstyle: {
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 25,
    color: '#FFFFFF',
  },

  enter_text_style: {
    marginTop: 10,
    alignSelf: 'center',
    marginLeft: 32,
    marginRight: 32,
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: color.Grey,
    fontSize: 14,
  },
  goToNext: {
    height: '13%',
    top: 10,
    width: '90%',
    marginStart: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.RED,
    borderRadius: 5,
    elevation: 12,
  },
});
