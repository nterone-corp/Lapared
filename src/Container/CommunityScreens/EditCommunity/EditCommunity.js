/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Keyboard,
  StatusBar,
} from 'react-native';

import images from '../../common/images';
import {create} from 'apisauce';
import {getConfiguration, setConfiguration} from '../../../utils/configuration';
import colors from '../../common/colors';

export default class EditCommunity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     name:'',
     description:'',
     communityId: this.props.route.params.communityId,
    };
  }

  componentDidMount(){
    console.log('communityId>>>>>>>>>>',this.state.communityId)
  }
  back() {
    this.props.navigation.goBack();
  }
    // CommunityShow in stories View/////////////////
    postingAsAPI() {
      // setConfiguration('Token', '');
      this.props
        .PostingAsAPI()
        .then(() => this.afterCallingPostingAsAPI())
        .catch((e) => this.showAlert(e.message, 300));
    }
  
    afterCallingPostingAsAPI() {
      console.log('isBusy value --- ', this.props.isBusy);
      console.log('response value PostingAs --- ', this.props.responsePostingAs);
      this.props.navigation.navigate('CommunityScreen')
    
    }
    showAlert(message, duration) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        alert(message);
      }, duration);
    }
  
  editCommunityApi() {
    Keyboard.dismiss();
    this.setState({isBusy: true});
    let apiRoot = getConfiguration('API_ROOT'),
      acces_token = getConfiguration('Token');

    // create api.

    console.log('apiRootapiRootapiRoot', apiRoot, acces_token);
    const api = create({
      baseURL: apiRoot,

      headers: {
        Authorization: 'Bearer ' + acces_token,
        'Content-Type': 'application/json',
      },
    });

    console.log('api>>>>>>>', api);

  

    let data = {   
      'name': this.state.name
    };

    // post your data.
    api.put('/communities/'+this.state.communityId+'',JSON.stringify(data))
    .then((res) =>
      this.afterEdit(res).catch((err) => {
       
        console.log('e  d ', err);
      }),
    );
  }

  afterEdit(res) {
    console.log('upload post succes======', res);
    console.log('response value Edit --- ', res.data);
    {
      res.data != null ?
      this.postingAsAPI()
      :
      null
    }
 
 
  }




  render() {
    return (
      <SafeAreaView style={{flex:1,backgroundColor: colors.RED}}>
      <View style={{flex: 1, backgroundColor: colors.WHITE}}>
          <StatusBar
            hidden={false}
            backgroundColor={'#BD2026'}
            barStyle="light-content"
            
        />
        <View
          style={{
            height: '8%',
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#BD2026',
          }}>
          <TouchableOpacity onPress={()=> this.back()} style={{left: 15, position: 'absolute'}}>
            <Image
              style={{
                height: 20,
                width: 20,
                resizeMode: 'contain',
              }}
              source={images.back}
            />
          </TouchableOpacity>

          <Text style={{fontSize: 16, color: 'white'}}>
            Edit Community Name
          </Text>
        </View>

        <View
          style={{height: '92%', width: '100%', backgroundColor: 'lightgrey'}}>
          <Text style={{fontWeight: 'bold', left: 20, top: 15}}>
            Community Name
          </Text>

          <View
            style={{
              height: '10%',
              width: '90%',
              alignSelf: 'center',
              top: 22,
              marginHorizontal: 10,
            }}>
            <TextInput
              placeholder="Enter community name"
              style={{
                backgroundColor: 'white',
                color: 'grey',
                height: 50,
                padding:10,
                width: '100%',
                borderRadius: 5,
                borderWidth: 0.5,
              }}
              onChangeText={(name) => this.setState({name})}
              value={this.state.name}
              
            />
          </View>

          <TouchableOpacity
          onPress={()=> this.editCommunityApi()}
            style={{
              height: 50,
              width: '90%',
              justifyContent: 'center',
              top: 32,
              backgroundColor: '#BD2026',
              alignSelf: 'center',
              borderRadius: 5,
            }}>
            <Text style={{alignSelf: 'center', color: 'white', fontSize: 15}}>
              Update
            </Text>
          </TouchableOpacity>
        </View>
      </View>
   </SafeAreaView>
    );
  }
}
