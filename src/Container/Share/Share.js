import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  TextInput,
  Text,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import color from '../common/colors';
import {getConfiguration} from '../../utils/configuration';
import images from '../common/images';
import {create} from 'apisauce';
import colors from '../common/colors';
export default class Share extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      To: false,
      userProfile: '',
      message: '',
      userId: '',
      first_name: '',
      last_name: '',
      item: this.props.route.params.item,
      data: [],
    };
  }

  componentDidMount() {
    console.log('itemshare>>>>>>>>', this.state.item);
    this.getProfile();
  }
  getProfile() {
    this.props
      .getContactAPI()
      .then(() => this.afterGetProfile())
      .catch((e) => console.log(e.message));
  }

  afterGetProfile() {
    console.log('isBusy value --- ', this.props.isBusyGetContact);
    console.log(
      'response value getProfile --- ',
      this.props.responseGetContact,
    );

    var userProfile = this.props.responseGetContact.response;

    console.log('userprofile>>>>>>>>', userProfile);
    this.setState({data: userProfile});
  }

  back() {
    this.props.navigation.goBack();
  }
  UserList(item) {
    console.log('item>>>>>>', item);
    return (
      <TouchableOpacity
        onPress={() => this.userId(item)}
        style={{flexDirection: 'row'}}>
        <View style={styles.userViewStyle}>
          {item.avatar != null ? (
            <Image source={item.avatar} style={styles.userProfileimage} />
          ) : (
            <Image
              source={images.dummyPerson}
              style={styles.userProfileimage}
            />
          )}
          {item.status != 'online' ? null : (
            <Image
              source={images.statusGreen}
              style={styles.statusGreenstyle}
            />
          )}
        </View>

        <View style={{flex: 0.8, justifyContent: 'center'}}>
          <Text>
            {item.first_name} {item.last_name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  userId(item) {
    console.log('userId', item);
    this.setState({
      userId: item.id,
      To: false,
      first_name: item.first_name,
      last_name: item.last_name,
    });
  }

  shareDone() {
    console.log('message', this.state.message);
    console.log('itemId', this.state.item.id);
    console.log('userID', this.state.userId);

    var apiRoot = getConfiguration('API_ROOT');

    var acces_token = getConfiguration('Token');

    // create api.
    const api = create({
      baseURL: apiRoot,

      headers: {
        Authorization: 'Bearer ' + acces_token,
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('api>>>>>>>', api);
    let details = {
      message: this.state.message,
      post_id: this.state.item.id,
    };

    api
      .put('/user/conversations/' + this.state.userId + '', details, {})
      .then((res) => this.afterPost(res));
  }

  afterPost(res) {
    console.log('upload share succes======', res);
    console.log('response value createpost --- ', res.data.message);
    this.props.navigation.navigate('HomeTab');
  }

  clickTo() {
    this.setState({
      To: true,
    });
  }

  render() {
    const shareItem = this.state.item;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: color.RED}}>
        <View style={styles.container}>
          <StatusBar
            hidden={false}
            backgroundColor={colors.RED}
            barStyle="light-content"
          />
          <View style={styles.firstView}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => this.back()}
                style={styles.headerleft}>
                <Image style={styles.notificationStyle} source={images.back} />
              </TouchableOpacity>

              <View style={styles.headerCenter}>
                <Text style={{color: 'white', fontSize: 18}}>Share</Text>
              </View>

              <TouchableOpacity
                onPress={() => this.shareDone()}
                style={styles.headerleft}>
                <Image style={styles.notificationStyle} source={images.tick} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.secondView}>
            <View style={{height: '20%', width: '100%'}}>
              <View style={styles.UserListStyle}>
                <Text style={styles.textTo}>To:</Text>
                <TouchableOpacity
                  onPress={() => this.clickTo()}
                  style={{width: '100%', justifyContent: 'center'}}>
                  {this.state.To == true ? (
                    <TextInput
                      placeholder="Type a name"
                      onPress={() => this.clickTo()}
                    />
                  ) : (
                    <Text style={{color: 'gray'}}>
                      {this.state.userId != '' ? (
                        <Text style={{color: 'gray'}}>
                          {' '}
                          {this.state.first_name} {this.state.last_name}{' '}
                        </Text>
                      ) : (
                        'Type a name'
                      )}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              <View style={{flex: 0.5}}>
                <TextInput
                  placeholder="What'a on your mind, Jane Doe"
                  style={styles.textinputStyle}
                  onChangeText={(message) => this.setState({message})}
                  value={this.state.message}
                />
              </View>
            </View>

            <View style={styles.userViewBottom}>
              <View style={{flexDirection: 'row', left: 20, top: 10}}>
                <Image
                  style={styles.userProfileStyle}
                  source={images.user_profileimage}
                />

                <View
                  style={{
                    flexDirection: 'column',
                    marginStart: 8,
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 14,
                      color:
                        this.state.showDialogAlert == true
                          ? color.WHITE
                          : color.BLACK,
                    }}>
                    {shareItem.user.first_name} {shareItem.user.last_name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color:
                        this.state.showDialogAlert == true
                          ? '#D7D7D7'
                          : color.BLACK,
                    }}>
                    {' '}
                    {shareItem.created_at}
                  </Text>
                </View>
              </View>

              <View style={{flex: 1, justifyContent: 'space-between'}}>
                <Text
                  style={{
                    marginHorizontal: 12,
                    marginTop: 12,
                    color:
                      this.state.showDialogAlert == true
                        ? '#C9C9C9'
                        : color.BLACK,
                  }}>
                  {shareItem.content}
                </Text>
                {shareItem.media != null ? (
                  <Image
                    resizeMode="contain"
                    style={{width: '100%', height: '50%'}}
                    source={{uri: shareItem.media}}
                  />
                ) : null}
              </View>
            </View>

            {this.state.To == true ? (
              <View style={styles.userListshow}>
                <FlatList
                  data={this.state.data}
                  renderItem={({item}) => this.UserList(item)}
                />
              </View>
            ) : null}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: color.WHITE},
  headerleft: {
    flex: 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userListshow: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    backgroundColor: color.WHITE,
    top: 60,
  },
  userViewBottom: {
    height: '75%',
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'column',
    backgroundColor: color.WHITE,
    borderColor: 'gray',
    borderWidth: 0.5,
  },
  textTo: {
    fontSize: 15,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginHorizontal: 15,
  },
  UserListStyle: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationStyle: {
    height: 18,
    width: 18,
    tintColor: 'white',
  },
  userProfileStyle: {
    height: 40,
    width: 40,
    borderWidth: 1,
    borderColor: 'white',
    alignSelf: 'center',
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  textinputStyle: {
    left: 10,
  },
  userViewStyle: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  firstView: {height: '8%', width: '100%', backgroundColor: colors.RED},
  userProfileimage: {height: 50, width: 50},
  statusGreenstyle: {
    height: 15,
    width: 15,
    alignSelf: 'flex-end',
    position: 'absolute',
    top: 40,
    right: 10,
  },
  secondView: {
    height: '92%',
    width: '100%',
    backgroundColor: color.WHITE,
  },
});
