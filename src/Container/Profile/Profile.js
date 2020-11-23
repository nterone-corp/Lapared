import React from 'react';
import {View, Text} from 'react-native';

export default class Profile extends React.Component {
  back() {
    this.props.navigation.goBack();
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>In Progress</Text>
      </View>
    );
  }
}
