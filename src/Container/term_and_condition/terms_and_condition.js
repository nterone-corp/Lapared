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

// import CustomButton from '../widgets/CustomButton';
// import data from '../../src/common/data';
import images from '../common/images';

export default class TermsAndCondtions extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      To: false,
      comment:'',
      scrollPadding: 0,
      name: this.props.route.params.item,
      // communityid: this.props.route.params.item,
      filepath: {
        data: '',
        uri: ''
      },
      fileData: '',
      fileUri: ''

    }
    };
  
  // state = {
  //   name: this.props.route.params.item,
  // };
  back() {
    this.props.navigation.goBack();
  }

  render() {
    console.log('name>>>>', this.state.name);
    return (
      <SafeAreaView style={{flex:1,backgroundColor: 'gray'}}>
      <View>
        <ImageBackground
          source={images.common_background}
          style={{width: '100%', height: '100%'}}>
          {/* Back Button */}
          <View style={{justifyContent: 'center', height: '4%'}}>
            <TouchableOpacity
              onPress={() => this.back()}
              style={{justifyContent: 'center', left: 20, top: 20}}>
              <Image style={styles.backbuttonStyle} source={images.back} />
            </TouchableOpacity>

            <Text style={styles.headerstyle}>{this.state.name}</Text>
          </View>

          <ScrollView style={{marginVertical: 20}}>
            <View>
              <Text style={styles.date_style}>
                {commonData.string_constants.date_and_time}{' '}
              </Text>

              <Text style={styles.servicestyle}>
                {commonData.string_constants.my_service}{' '}
              </Text>

              <Text style={styles.dummytextstyle}>
                {commonData.string_constants.lorem_ipsum}{' '}
              </Text>

              <Text style={styles.servicestyle}>
                {commonData.string_constants.your_account}{' '}
              </Text>

              <Text style={styles.dummytextstyle}>
                {commonData.string_constants.lorem_ipsum}{' '}
              </Text>

              <Text style={styles.servicestyle}>
                {commonData.string_constants.callencation_policy}{' '}
              </Text>

              <Text style={styles.dummytextstyle}>
                {commonData.string_constants.lorem_ipsum}{' '}
              </Text>

              <Text style={styles.servicestyle}>
                {commonData.string_constants.money_back}{' '}
              </Text>

              <Text style={styles.dummytextstyle}>
                {commonData.string_constants.lorem_ipsum}{' '}
              </Text>
            </View>
          </ScrollView>
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
  },
  headerstyle: {
    textAlign: 'center',
    color: color.WHITE,
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    textAlignVertical: 'center',
    alignItems: 'center',
  },
  date_style: {
    color: color.Grey,
    marginStart: 24,
    fontSize: 12,
  },
  servicestyle: {
    color: color.WHITE,
    marginStart: 24,
    marginTop: 16,
    fontSize: 14,
  },
  dummytextstyle: {
    color: color.Grey,
    marginStart: 24,
    fontSize: 12,
    marginEnd: 12,
    marginTop: 12,
  },
});
