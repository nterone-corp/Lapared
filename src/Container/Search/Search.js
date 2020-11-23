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
import Activity from '../common/ActivityIndicator';
import {getConfiguration} from '../../utils/configuration';

import {create} from 'apisauce';
import images from '../common/images';
import colors from '../common/colors';

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: '',
      searchData: [],
      isbusy: false,
    };
  }

  searchDone() {
    this.setState({isbusy: true});
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
    if (this.state.searchInput.length >= 2) {
      api
        .get('/users?search=' + this.state.searchInput + '', {})
        .then((res) => this.afterPost(res));
    }
  }

  afterPost(res) {
    console.log('upload search succes======', res.data);
    console.log('response value search --- ', res.data.message);
    this.setState({isbusy: false});
    this.setState({
      searchData: res.data,
    });
  }

  back() {
    this.props.navigation.goBack();
  }

  UserList(item) {
    return (
      <View>
        <View style={styles.communityContainer}>
          {item.avtar == null ? (
            <Image source={images.dummyPerson} style={styles.image} />
          ) : (
            <Image source={item.avtar} style={styles.image} />
          )}
          <Text>{item.first_name}</Text>
        </View>
        {this.state.isbusy ? <Activity /> : null}
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: color.RED}}>
        <View style={{flex: 1, backgroundColor: color.WHITE}}>
          <StatusBar
            hidden={false}
            backgroundColor={colors.RED}
            barStyle="light-content"
          />
          <View style={styles.header}>
            <View style={{flex: 0.5, flexDirection: 'row'}}>
              <TouchableOpacity onPress={() => this.back()} style={styles.back}>
                <Image style={styles.notificationStyle} source={images.back} />
              </TouchableOpacity>

              <View
                style={{
                  flex: 0.85,
                  justifyContent: 'center',
                }}>
                <Text style={{color: 'white', fontSize: 18}}>Search</Text>
              </View>
            </View>
            <View style={{flex: 0.5}}>
              <View style={styles.textinputStyle}>
                <Image style={styles.searchImage} source={images.search} />
                <TextInput
                  placeholder="Search"
                  returnKeyType={'search'}
                  style={{width: '100%', height: 50}}
                  onChangeText={(text) => this.setState({searchInput: text})}
                  value={this.state.searchInput}
                  onSubmitEditing={() => this.searchDone()}
                />
              </View>
            </View>
          </View>

          <View style={searchViewWhiteback}>
            <View style={styles.searchView}>
              {this.state.searchData.length > 0 ? (
                <FlatList
                  data={this.state.searchData}
                  renderItem={({item, index}) => this.UserList(item, index)}
                />
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: colors.Grey,
                      textAlign: 'center',
                      fontSize: 16,
                    }}>
                    No search results
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  header: {height: 100, width: '100%', backgroundColor: colors.RED},
  notificationStyle: {
    height: 18,
    width: 18,
    tintColor: 'white',
  },
  back: {
    flex: 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textinputStyle: {
    width: '90%',
    height: '70%',
    flexDirection: 'row',
    borderColor: 'gray',
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
  },
  communityContainer: {
    flexDirection: 'row',
    margin: 5,
    alignItems: 'center',
  },
  image: {
    height: 50,
    width: 50,
    margin: 5,
  },
  searchView: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    backgroundColor: color.WHITE,
  },
  searchImage: {
    tintColor: 'gray',
    height: 20,
    width: 20,
    marginHorizontal: 10,
  },
  searchViewWhiteback: {
    height: '85%',
    width: '100%',
    backgroundColor: color.WHITE,
  },
});
