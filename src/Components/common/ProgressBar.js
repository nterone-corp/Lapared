

import React, {Component} from 'react';  
import {Platform, StyleSheet, Text, View, Animated} from 'react-native';  
import colors from '../../Container/common/colors';

  
export default class ProgressBar extends Component {  
    
    constructor(props){
      super(props)
      let {filled} = this.props;
      this.state={  
        progressStatus: filled  ? 100:  0,  
    }  
    this.anim = new Animated.Value(0);  
    }
  
   
    componentDidMount(){  
        // this.onAnimate();  

        if (this.props.onRef != null) {
          this.props.onRef(this)
      }
    }  
    onAnimate = () =>{  
      console.log("loadssssss")
        this.anim.addListener(({value})=> {  
            this.setState({progressStatus: parseInt(value,10)});  
        });  
        Animated.timing(this.anim,{  
             toValue: 100,  
             duration: 10000,  
        }).start(({ finished }) => {
          console.log("jdgfjdsfjhsfhkshflshfhsfk",finished)
          if(finished){
            this.props.onEnd();
          }        

        });
    }  

    componentWillUnmount(){

      this.anim.stopAnimation(({value}) => console.log("Final Value: " + value))

    }
  render() {  
    let {innerStyle} = this.props;
    // console.log("innerStyleinnerStyle",innerStyle)
    return (  
      <View style={[styles.container, innerStyle]}   ref={input => this.textInput = input}>  
            <Animated.View  
                style={[  
                    styles.inner,{width: this.state.progressStatus +"%"},  
                ]}  
            />  
            {/* <Animated.Text style={styles.label}>  
                    {this.state.progressStatus }%  
            </Animated.Text>   */}
      </View>  
    );  
  }  
}  
const styles = StyleSheet.create({  
    container: {  
    width: "100%",  
    // height: 1,  
    // paddingTop: 30,
    // borderColor: "#FAA",  
    borderWidth: 3,  
    borderRadius: 30,  
    zIndex: 99,
     backgroundColor : "#F0F8FF"
  },  
  inner:{  
 
    width: "100%",  
    height: 5,  
    borderRadius: 15,  
    backgroundColor:colors.RED,  
    zIndex: 10
  },  
  label:{  
    fontSize:23,  
    color: "black",  
    position: "absolute",  
    zIndex: 1,  
    alignSelf: "center",  
  }  
});  