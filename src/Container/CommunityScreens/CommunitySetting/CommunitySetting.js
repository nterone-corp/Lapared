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
  TouchableOpacity,
  Image,
  FlatList,
  Keyboard,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import images from '../../common/images';
import {create} from 'apisauce';
import {getConfiguration, setConfiguration} from '../../../utils/configuration';
import colors from '../../common/colors';

export default class CommunitySetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      leaveView: true,
      item: this.props.route.params.item,
      name: '',
      members: [],
      admin: [],
      communityId: '',
      communityAdmin: '',
    };
  }

  leaveCommunity() {
   this.leaveCommunityApi()
    // this.setState({leaveView: !this.state.leaveView})
  }

  componentDidMount() {
    console.log('itemCommunity>>>>>>', this.state.item);
    var members = this.state.item.members;
    var admin = this.state.item.admins;
    var name = this.state.item.name;
    var communityId = this.state.item.id;
    var communityAdmin = this.state.item.admins[0].id;
    this.setState({
      members: members,
      admin: admin,
      name: name,
      communityId: communityId,
      communityAdmin: communityAdmin,
    });
    this.getProfile();
  }
  goToUpdate() {
    this.props.navigation.navigate('EditCommunity', {
      communityId: this.state.communityId,
    });
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
    this.props.navigation.navigate('CommunityScreen');
  }
  showAlert(message, duration) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      alert(message);
    }, duration);
  }
  ////////////////////////////////////User Profile/////////////////////////
  getProfile() {
    this.props
      .getProfileAPI()
      .then(() => this.afterGetProfile())
      .catch((e) => console.log(e.message));
  }

  afterGetProfile() {
    console.log('isBusy value --- ', this.props.isBusyGetProfile);
    console.log(
      'response value getProfile --- ',
      this.props.responseGetProfile,
    );
    var userProfile = this.props.responseGetProfile.response;
    if (userProfile.id != this.state.communityAdmin) {
      this.setState({leaveView: false});
      console.log('kekekekekekekekekekekekekekekekekek');
    }
    console.log('userid>>>>>>>>', userProfile.id);
  }

  deleteCommunityApi() {
    Keyboard.dismiss();
    // this.setState({isBusy: true});
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

    // post your data.
    api.delete('/communities/' + this.state.communityId + '', {}).then((res) =>
      this.afterDelete(res).catch((err) => {
        console.log('e  d ', err);
      }),
    );
  }

  afterDelete(res) {
    console.log('upload post succes======', res);
    console.log('response value Delete --- ', res.data);
    this.back()
    {
      res.data != null ? this.postingAsAPI() : null;
    }
  }

// leaveCommunity//////////////////////
leaveCommunityApi() {
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
  // post your data.
  api.post('/communities/' + this.state.communityId + '/abandon', {}).then((res) =>
    this.afterLeave(res).catch((err) => {
      console.log('e  d ', err);
    }),
  );
}

afterLeave(res) {
  console.log('upload post succes======', res);
  console.log('response value Delete --- ', res.data);
  {
    res.data != null ? this.postingAsAPI() : null;
  }
}



  seeAllMember() {
    // alert("jhkjkk")
    this.props.navigation.navigate('SeeAllMember', {item: this.state.item});
  }

  membersList() {
    return (
      <View>
        <Image
          resizeMode="contain"
          style={{height: 45, width: 45, top: 5}}
          source={images.dummyPerson}
        />
      </View>
    );
  }

  adminView() {
    return (
      <View style={{flex: 1, marginLeft: 15, flexDirection: 'row'}}>
        <Image
          resizeMode="contain"
          style={{height: 45, width: 45, top: 5}}
          source={images.dummyPerson}
        />
      </View>
    );
  }

  back() {
    this.props.navigation.goBack();
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
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => this.back()}
            style={{
              height: '100%',
              width: '10%',
              left: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={{resizeMode: 'contain', position: 'absolute'}}
              source={images.back}
            />
          </TouchableOpacity>

          <View
            style={{
              height: '100%',
              width: '90%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: 'white',right:15, fontSize: 18}}>
              Community Settings
            </Text>
          </View>
        </View>

        {this.state.leaveView == true ? (
          <View
            style={{
              height: '92%',
              width: '100%',
              backgroundColor: 'lightgrey',
              alignItems: 'center',
            }}>
            <View
              style={{
                height: '35%',
                width: '90%',
                borderRadius: 5,
                margin: 10,
                backgroundColor: 'white',
                top: 10,
              }}>
              <View style={{height: '50%', width: '100%'}}>
                <View
                  style={{
                    height: '30%',
                    width: '100%',
                    top: 15,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{fontSize: 15, fontWeight: 'bold', left: 15}}>
                    Members
                  </Text>
                  <Text
                    onPress={() => this.seeAllMember()}
                    style={{
                      fontSize: 13,
                      fontWeight: 'bold',
                      color: colors.RED,
                      right: 15,
                    }}>
                    SEE ALL
                  </Text>
                </View>

                <View
                  style={{
                    height: '70%',
                    width: '100%',
                    left: 15,
                    top: 8,
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      height: '100%',
                      width: '70%',
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                    }}>
                    <FlatList
                      horizontal={true}
                      data={this.state.members}
                      // ItemSeparatorComponent={this.FlatListItemSeparator}
                      renderItem={({item}) => this.membersList(item)}
                    />
                  </View>

                  {/* <View style={{height:'100%',width:'30%',top:15,left:10}}>
<Text style={{color:'grey'}}>+5</Text>
</View> */}
                </View>
              </View>

              <View
                style={{
                  height: 1,
                  width: '90%',
                  backgroundColor: 'grey',
                  marginHorizontal: 20,
                }}></View>

              <View style={{height: '50%', width: '100%', top: 15}}>
                <Text style={{fontSize: 15, fontWeight: 'bold', left: 15}}>
                  Admin(s)
                </Text>

                <FlatList
                  horizontal={true}
                  data={this.state.admin}
                  // ItemSeparatorComponent={this.FlatListItemSeparator}
                  renderItem={({item}) => this.adminView(item)}
                />
              </View>
            </View>

            <View
              style={{
                height: '16%',
                width: '90%',
                borderRadius: 5,
                margin: 10,
                backgroundColor: 'white',
                top: 10,
              }}>
              <View
                style={{
                  height: '50%',
                  width: '100%',
                  top: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={{fontSize: 15, fontWeight: 'bold', left: 15}}>
                  About
                </Text>

                <Text
                  onPress={() => this.goToUpdate()}
                  style={{
                    fontSize: 13,
                    fontWeight: 'bold',
                    color: '#BD2026',
                    right: 15,
                  }}>
                  UPDATE
                </Text>
              </View>

              <View style={{height: '50%', width: '100%', left: 15}}>
                <Text style={{color: 'grey', fontSize: 13}}>Name</Text>

                <Text style={{fontSize: 14}}>{this.state.name}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => this.leaveCommunity()}
              style={{
                height: '8%',
                width: '90%',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
                margin: 10,
                flexDirection: 'row',
                backgroundColor: 'white',
                top: 10,
              }}>
              <Image
                style={{resizeMode: 'contain', tintColor: '#BD2026'}}
                source={images.logout}
              />
              <Text
                style={{
                  color: '#BD2026',
                  fontWeight: 'bold',
                  fontSize: 15,
                  left: 8,
                }}>
                Leave Community
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.deleteCommunityApi()}
              style={{
                height: '8%',
                width: '90%',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
                margin: 10,
                flexDirection: 'row',
                backgroundColor: 'white',
                top: 10,
              }}>
              <Image
                style={{resizeMode: 'contain', tintColor: '#BD2026'}}
                source={images.bin}
              />
              <Text
                style={{
                  color: '#BD2026',
                  fontWeight: 'bold',
                  fontSize: 15,
                  left: 8,
                }}>
                Delete Community
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              height: '92%',
              width: '100%',
              backgroundColor: 'lightgrey',
              alignItems: 'center',
            }}>
            <View
              style={{
                height: '20%',
                width: '90%',
                borderRadius: 5,
                margin: 10,
                backgroundColor: 'white',
                top: 10,
              }}>
              <View style={{height: '100%', width: '100%'}}>
                <View
                  style={{
                    height: '30%',
                    width: '100%',
                    top: 15,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{fontSize: 15, fontWeight: 'bold', left: 15}}>
                    Members
                  </Text>
                  <Text
                    onPress={() => this.seeAllMember()}
                    style={{
                      fontSize: 13,
                      fontWeight: 'bold',
                      color: '#BD2026',
                      right: 15,
                    }}>
                    SEE ALL
                  </Text>
                </View>

                <View
                  style={{
                    height: '70%',
                    width: '100%',
                    left: 15,
                    top: 8,
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      height: '100%',
                      width: '70%',
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                    }}>
                    <FlatList
                      horizontal={true}
                      data={this.state.members}
                      // ItemSeparatorComponent={this.FlatListItemSeparator}
                      renderItem={({item}) => this.membersList(item)}
                    />
                  </View>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => this.leaveCommunity()}
              style={{
                height: '8%',
                width: '90%',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
                margin: 10,
                flexDirection: 'row',
                backgroundColor: 'white',
                top: 10,
              }}>
              <Image
                style={{resizeMode: 'contain', tintColor: '#BD2026'}}
                source={images.logout}
              />
              <Text
                style={{
                  color: '#BD2026',
                  fontWeight: 'bold',
                  fontSize: 15,
                  left: 8,
                }}>
                Leave Community
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
   </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    height: '8%',
    width: '100%',
    backgroundColor: '#BD2026',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
