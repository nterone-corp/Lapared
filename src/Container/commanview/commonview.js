import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import color from '../common/colors';
import images from '../common/images';

export default class MainViewPro extends React.Component {
  render() {
    return (
      <View style={{backgroundColor: color.WHITE}}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={this.props.statusfeeds}
            style={{flex: 0.5, marginLeft: 14, marginTop: 10}}>
            <Image
              style={{height: 38, width: 38}}
              source={images.right_arrow}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this.props.storiesfeeds}
            style={{
              flex: 0.5,
              alignItems: 'flex-end',
              marginRight: 14,
              marginTop: 10,
            }}>
            <Image
              style={{
                height: 38,
                width: 38,
                alignItems: 'flex-end',
                justifyContent: 'space-between',
              }}
              source={images.left_arrow}
            />
          </TouchableOpacity>
        </View>
      </View>
   
   );
  }
}
