
import React from "react";
import {
  Container,
  ActivityIndicator,
  Content,
  Text,
  View,
  Image
} from "react-native";
import color from '../colors'
const Activity = props => (


<View style={{
   flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:  'center',
    
  }}>
        <ActivityIndicator size="large" color={color.RED_BUTTON} />

      </View>




);

export default Activity;
