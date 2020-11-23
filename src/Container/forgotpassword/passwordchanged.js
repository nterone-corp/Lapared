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
} from 'react-native';
import color from '../common/colors';
import commonData from '../common/data';

export default class PasswordChangedSucessFully extends React.Component {
  render() {
    return (
      <View>
        
        <ImageBackground
          source={require('../../assests/image/login_background.png')}
          style={{width: '100%', height: '100%'}}>
          {/* Back Button */}
          <Image
            style={styles.backbuttonStyle}
            source={require('../../assests/image/back.png')}
          />

          <Text style={styles.check_email_style}>
            {commonData.string_constants.password_chamged}{' '}
          </Text>

          <Image
            style={styles.circle_button_style}
            source={require('../../assests/image/circle_tick.png')}
          />

          <Text style={styles.send_password_style}>
            {commonData.string_constants.you_can_now}{' '}
          </Text>

          <TouchableOpacity
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
              Login{' '}
            </Text>
          </TouchableOpacity>

          <Text style={styles.lecencestyle}>
            {commonData.string_constants.licence_date}{' '}
          </Text>
        </ImageBackground>
      </View>
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
  check_email_style: {
    color: color.WHITE,
    textAlign: 'center',
    fontSize: 20,
    marginTop: 24,
  },

  circle_button_style: {
    width: 90,
    height: 90,
    alignSelf: 'center',
    marginTop: 16,
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
