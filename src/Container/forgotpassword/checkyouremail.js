import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
  TextInput,
  Text,
  Linking,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  ColorPropType,
} from 'react-native';
import color from '../common/colors';
import commonData from '../common/data';

export default class CheckYourEmail extends React.Component {



  back() {
    this.props.navigation.navigate('Introduction');
  }

  render() {
    return (
      <SafeAreaView style={{flex:1,backgroundColor: 'gray'}}>
      <View>
        
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

          <Text style={styles.check_email_style}>
            {commonData.string_constants.check_email}{' '}
          </Text>

          <Image
            style={styles.circle_button_style}
            source={require('../../assests/image/circle_tick.png')}
          />

          <Text style={styles.send_password_style}>
            {commonData.string_constants.send_password_message}{' '}
          </Text>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Introduction')}
            style={{
              height: '7%',
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
              Go to Email{' '}
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
  circle_button_style: {
    width: 90,
    height: 90,
    alignSelf: 'center',
    marginTop: 16,
  },
  check_email_style: {
    color: color.WHITE,
    textAlign: 'center',
    fontSize: 20,
    marginTop: 24,
  },
  send_password_style: {
    color: color.Grey,
    textAlign: 'center',
    fontSize: 14,
    marginTop: 12,
    marginStart: 26,
    marginEnd: 26,
  },
  lecencestyle: {
    color: color.Grey,
    textAlign: 'center',
    marginTop: 26,
  },
});
