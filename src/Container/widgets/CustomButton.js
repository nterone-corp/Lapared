import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import color from '../common/colors'
export default class CustomButton extends React.Component{

    render(){

        return(

  <TouchableOpacity onPress={this.props.next} style={{height:'15%',width:'90%',marginTop:12,
    justifyContent:'center',alignItems:'center',backgroundColor:this.props.color,
    borderRadius:5,elevation:12}}>
    <Text style={{color:this.props.textcolor,fontSize:18,fontWeight:'bold'}}>
     {this.props.name}
      </Text>
    </TouchableOpacity>

        )
    }
}

const styles = StyleSheet.create({
    parentstyle: {
      flex: 1,
    },
  });
