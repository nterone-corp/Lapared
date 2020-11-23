import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  StatusBar,
  Platform,
  Linking,
  ImageBackground,
  AsyncStorage,
  AppState,
  TouchableOpacity,
} from 'react-native';
import color from '../common/colors';
import CustomButton from '../widgets/CustomButton';
import images from '../common/images';
import commonData from '../common/data';
import { getConfiguration , setConfiguration} from '../../utils/configuration';
class Introduction extends React.Component {



  componentDidMount() {
    AppState.addEventListener('change', 
   this.handleAppStateChange);
    if (Platform.OS === 'android') {
      Linking.getInitialURL().then(url => {
        console.log('url>>>>>>>>>>',url)
        this.navigate(url);
      });
    } else {
      Linking.addEventListener('url', this.handleOpenURL);
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  // Check Background //////////////
  handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'inactive') {
    console.log('the app is closed');
   }    
  }

  handleOpenURL = (event) => {
    console.log('urlevent>>>>>>>>>>',event.url)
    this.navigate(event.url);
  }

  navigate = (url) => {
    console.log('navigateurl>>>>>>>>>>',url)
    const { navigate } = this.props.navigation;

    const route = url.replace(/.*?:\/\//g, '');
    // const id = route.match(/\/([^\/]+)\/?$/)[1];
    const routeName = route.split('=')[1];
    console.log('routeName',routeName)
    if(url != null){
      navigate('Createnewpassword', { resettoken: routeName})
    }
  
    
  }


  signIn() {
    console.log('bjhxcghgj')
  this.props.navigation.navigate('Login')
  }
  signUp() {
    this.props.navigation.navigate('SignUp')
    }


  render() {
    return (
      <SafeAreaView style={{flex:1,backgroundColor: 'gray'}}>
      <View style={styles.parentstyle}>
          
        <ImageBackground
          source={images.introhome}
          style={styles.back_imagestyle}>
          <View style={styles.text_styles}>
            <Image resizeMode='contain' source={images.logo} style={{height:'20%',width:'68%'}} />
          </View>

          <View
            style={styles.button_viewstyle}>
            <CustomButton next={()=> this.signIn()} name={commonData.string_constants.sign_in} color={color.WHITE} textcolor={color.RED_BUTTON} />

            <CustomButton next={()=> this.signUp()} name={commonData.string_constants.sing_out} color={color.RED_BUTTON} textcolor={color.WHITE} />

            <Image style={styles.logoStyle} 
            source={images.company_logo} /> 
 
            <Text style={{color:color.WHITE,marginTop:12}}>{commonData.string_constants.licence_date}</Text>

          </View>
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
  button_textstyle: {
    color: 'white',
  },
  back_imagestyle:{
    width: '100%', height: '100%'
  },
  text_styles:{
    height: '50%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appname_styles:{
    color: 'white', 
    fontSize: 45
  },
  tag_line_styles:{
    color: 'white', 
    fontSize: 18
  },
  button_viewstyle:{
    height: '50%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoStyle:{
    height:'20%',width:'20%',marginTop:22
  }
});

export default Introduction;
