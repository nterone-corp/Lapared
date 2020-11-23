import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import images from '../common/images';
import {getConfiguration} from '../../utils/configuration';
import {create} from 'apisauce';
import colors from '../common/colors';

export default class ReactionView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ' ',
      data: [],
      nextData: [],
      postId: this.props.route.params.postId,
      valueAngry: 0,
      valueHappy: 0,
      valueLaugh: 0,
      valueClap: 0,
      show: 0,
      emojiData: false,
    };
  }
  componentDidMount() {
    this.reactionGetApi();
  }
  //  Reaction Api //////////////
  reactionGetApi() {
    var apiRoot = getConfiguration('API_ROOT');
    var acces_token = getConfiguration('Token');
    // create api. //////////////////////
    const api = create({
      baseURL: apiRoot,
      headers: {
        Authorization: 'Bearer ' + acces_token,
        'Content-Type': 'application/json',
      },
    });

    console.log('api>>>>>>>', api);

    api
      .get('/reactions/' + this.state.postId + '', {})
      .then((res) => this.afterGetReactions(res));
  }

  afterGetReactions(res) {
    console.log('upload share succes======', res);
    console.log('response value GetReaction --- ', res.data);
    var reactiondata = res.data;
    this.setState({data: reactiondata});

    for (var i = 0; i < reactiondata.length; i++) {
      if (reactiondata[i].name == 'angry') {
        this.setState({
          valueAngry: this.state.valueAngry + 1,
        });
      } else if (reactiondata[i].name == 'happy') {
        this.setState({
          valueHappy: this.state.valueHappy + 1,
        });
      } else if (reactiondata[i].name == 'clap') {
        this.setState({
          valueClap: this.state.valueClap + 1,
        });
      } else if (reactiondata[i].name == 'laugh') {
        this.setState({
          valueLaugh: this.state.valueLaugh + 1,
        });
      }
    }
  }

  clickCollection(item, ss) {
    this.setState({show: ss});
    if (item == 0) {
      this.setState({emojiData: false});
    } else {
      this.setState({emojiData: true});
    }

    console.log('datada>>>>>', this.state.data);
    console.log('tejkbvd>>>>>', item);
    var allData = this.state.data;
    var newData = [];

    for (var i = 0; i < allData.length; i++) {
      console.log('dataname', allData[i]);
      if (allData[i].name == item) {
        newData.push(allData[i]);
      } else if (item == 0) {
        newData.push(allData[i]);
      }
    }
    console.log('newData>>>>>>>>', newData);
    this.setState({nextData: newData});
  }
  back() {
    this.props.navigation.goBack();
  }

  reactView(item) {
    return (
      <TouchableOpacity style={styles.emojiView}>
        <View style={{width: '25%'}}>
          <Image
            style={{
              height: 50,
              width: 50,
              left: 15,

              resizeMode: 'contain',
            }}
            source={images.dummyPerson}
          />
          {item.name == 'happy' ? (
            <Image style={styles.emojiStyle} source={images.emojiHappy} />
          ) : item.name == 'angry' ? (
            <Image style={styles.emojiStyle} source={images.emojiAngry} />
          ) : item.name == 'laugh' ? (
            <Image style={styles.emojiStyle} source={images.emojiLaughing} />
          ) : item.name == 'clap' ? (
            <Image style={styles.emojiStyle} source={images.emojiClap} />
          ) : null}
        </View>

        <View style={{width: '40%'}}>
          <Text style={{fontSize: 17}}>
            {item.user.first_name} {item.user.last_name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const {valueAngry, valueHappy, valueLaugh, valueClap, data} = this.state;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: colors.RED}}>
        <View style={{flex: 1, backgroundColor: colors.WHITE}}>
          <StatusBar
            hidden={false}
            backgroundColor={colors.RED}
            barStyle="light-content"
          />
          <View style={styles.header}>
            <TouchableOpacity onPress={() => this.back()} style={styles.back}>
              <Image
                style={{resizeMode: 'contain', position: 'absolute'}}
                source={images.back}
              />
            </TouchableOpacity>

            <View style={styles.peopleWhoreactStyle}>
              <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
                People Who Reacted
              </Text>
            </View>
            <View style={styles.blank}></View>
          </View>

          <View style={styles.collectionStyle}>
            <TouchableOpacity
              onPress={() => this.clickCollection(0, 0)}
              style={[
                styles.clickCollection,
                {borderBottomWidth: this.state.show == 0 ? 2 : 0},
              ]}>
              <Text style={{color: colors.RED}}>All {data.length}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.clickCollection('happy', 1)}
              style={[
                styles.clickCollection,
                {borderBottomWidth: this.state.show == 1 ? 2 : 0},
              ]}>
              <Image
                style={{
                  height: 22,
                  width: 22,
                  resizeMode: 'contain',
                }}
                source={images.emojiHappy}
              />

              <Text style={{left: 10, fontSize: 17}}>{valueHappy}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.clickCollection('laugh', 2)}
              style={[
                styles.clickCollection,
                {borderBottomWidth: this.state.show == 2 ? 2 : 0},
              ]}>
              <Image
                style={{
                  height: 22,
                  width: 22,
                  resizeMode: 'contain',
                }}
                source={images.emojiLaughing}
              />

              <Text style={{left: 10, fontSize: 17}}>{valueLaugh}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.clickCollection('angry', 3)}
              style={[
                styles.clickCollection,
                {borderBottomWidth: this.state.show == 3 ? 2 : 0},
              ]}>
              <Image
                style={{
                  height: 22,
                  width: 22,
                  resizeMode: 'contain',
                }}
                source={images.emojiAngry}
              />

              <Text style={{left: 10, fontSize: 17}}>{valueAngry}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.clickCollection('clap', 4)}
              style={[
                styles.clickCollection,
                {borderBottomWidth: this.state.show == 4 ? 2 : 0},
              ]}>
              <Image
                style={{
                  height: 22,
                  width: 22,
                  resizeMode: 'contain',
                }}
                source={images.emojiClap}
              />

              <Text style={{left: 10, fontSize: 17}}>{valueClap}</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: '100%',
              height: 0.5,
              backgroundColor: 'gray',
            }}></View>
          <View style={{height: '85%', width: '100%'}}>
            {this.state.emojiData == true ? (
              <FlatList
                data={this.state.nextData}
                renderItem={({item}) => this.reactView(item)}
              />
            ) : (
              <FlatList
                data={this.state.data}
                renderItem={({item}) => this.reactView(item)}
              />
            )}
          </View>
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
  back: {
    height: '100%',
    width: '10%',
    left: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blank: {
    height: '100%',
    width: '10%',
    left: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clickCollection: {
    height: '100%',
    width: '20%',
    borderBottomColor: colors.RED,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  collectionStyle: {
    height: '7%',
    width: '95%',
    flexDirection: 'row',
    marginLeft: 12,
    alignItems: 'center',
  },
  emojiStyle: {
    height: 30,
    width: 30,
    left: 45,
    top: 30,
    position: 'absolute',
    resizeMode: 'contain',
  },
  peopleWhoreactStyle: {
    height: '100%',
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiView: {
    flex: 1,
    height: '15%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
});
