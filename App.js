/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';

import FeedStack from './src/navigation/stack';
import {API_ROOT} from './env';
import {setConfiguration} from './src/utils/configuration';

import {Provider} from 'react-redux';

class App extends React.Component {
  componentDidMount() {
    console.disableYellowBox = true;

    setConfiguration('API_ROOT', API_ROOT);
    setConfiguration('fcmToken', 'none');
  }

  render() {
    const store = require('./src/redux/store').default;
    return (
      <View style={styles.container}>
        <Provider store={store}>
          <NavigationContainer>
            <FeedStack />
          </NavigationContainer>
        </Provider>
      </View>
    );
  }
}
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
