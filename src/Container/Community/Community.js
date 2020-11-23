import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Image,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  TextInput,
  StatusBar
} from 'react-native';
import colors from '../common/colors';
import data from '../common/data';

import images from '../common/images';
const { height, width } = Dimensions.get('window');

class SelectCommunity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      communities: [],
      selectedCommunity: [],
      copyed:[],

    };
    this.getCommunityAPI = this.getCommunityAPI.bind(this);
    this.afterCallingStoriesAPI = this.afterCallingStoriesAPI.bind(this);
    this.communityRender = this.communityRender.bind(this);
    this.selectedCommunityRender = this.selectedCommunityRender.bind(this);
    this.pushCommunityToSelectedOne = this.pushCommunityToSelectedOne.bind(
      this,
    );
    this.deleteCommunity = this.deleteCommunity.bind(this);
  }
  componentDidMount() {
    this.getCommunityAPI();
  }


  deleteCommunity(index) {
    let { communities, selectedCommunity } = this.state;
    let removedItem = selectedCommunity.splice(index, 1);
    console.log('removedItemremovedItem', removedItem);

    communities.push(removedItem[0]);


    this.setState({ communities, selectedCommunity });

  }

  pushCommunityToSelectedOne(index) {
    let { communities, selectedCommunity } = this.state;
    let removedItem = communities.splice(index, 1);
    console.log('removedItemremovedItem', removedItem);

    selectedCommunity.push(removedItem[0]);
    this.setState({ communities, selectedCommunity });
  }
  getCommunityAPI() {
    // setConfiguration('Token', '');
    this.props
      .getCommunityAPI()
      .then(
        () => {
          this.afterCallingStoriesAPI();
        },
        // {setRefreshing(false)
        // setDataSource(this.afterCallingHomeAPI());}
      )
      .catch((e) => this.afterErrorHomeApi(e));
  }

  afterCallingStoriesAPI() {
    var postData = this.props.community;
    console.log('PostData>>>>>>>>123313', postData);

    this.setState({
      communities: postData,copyed:postData
    });
    
this.searhFun('')

  }

  afterErrorHomeApi(e){
    console.log('response Error message --- ', e);
    console.log('response Code message --- ', e.code);
   
    if(e.code == data.status.code){
      this.showAlert(e.message, 300)
      this.props.navigation.navigate('Login')

    }else{
      this.showAlert(e.message, 300)
    }
  
}


  back() {
    this.props.navigation.goBack();
  }

  searhFun(textsearch){
    var data2 = this.state.copyed
console.log('searchcallll',data2)
console.log('texserch',textsearch)
var copyPostData = []
    if(textsearch.length == 0){
      this.setState({communities:data2})
    }else{
      for (var i=0; i < data2.length; i++){
        console.log('dada2name',data2[i].name)
        if(data2[i].name.toLowerCase().indexOf(textsearch.toLowerCase()) > -1){
          copyPostData.push(data2[i])
        }
      }
      this.setState({communities:copyPostData})

    }
    
  }

  communityRender(item, index) {
    console.log('fgddfgdfgdg.user.', item);
    return (
      <TouchableOpacity
        onPress={() => {
          this.pushCommunityToSelectedOne(index);
        }}>
        <View style={styles.communityContainer}>
          <Image source={images.dummyPerson} style={styles.image} />
          <Text>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  selectedCommunityRender(item, index) {
    console.log('fgddfgdfgdg.user.', item);
    return (
      <View style={styles.selectedCommunityContainer}>
        <View>
          <Image source={images.dummyPerson} style={styles.image} />
          <TouchableOpacity style={styles.closeButtonContainer} onPress={() => { this.deleteCommunity(index) }}>
            <Image
              resizeMode="contain"
              source={images.cross}
              style={styles.closeIcon}
            />
          </TouchableOpacity>
        </View>
        <Text numberOfLine={2} style={styles.selectedCommunityTextName}>{item.name}</Text>
      </View>
    );
  }

  render() {
    let { selectedCommunity } = this.state;
    console.log(' this.props.community;', this.props.community);
    return (
      <SafeAreaView style={{flex:1,backgroundColor:colors.RED}}>
      <View style={[styles.container,{backgroundColor: colors.WHITE}]}>
          <StatusBar
            hidden={false}
            backgroundColor={'#BD2026'}
            barStyle="light-content"
            
        />
        <View style={{ marginTop: 20 }}>
          <View style={{ flexDirection: 'row', marginTop: width * 0.03 }}>
            <TouchableOpacity
              onPress={() => this.back()}
              style={{
                flex: 0.1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image style={styles.notificationStyle} source={images.back} />
            </TouchableOpacity>

            <View
              style={{
                flex: 0.8,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{ color: colors.BLACK, fontSize: 16 }}>
                Select Community's
              </Text>
            </View>
            {
              this.state.selectedCommunity != '' ?
              <TouchableOpacity
              onPress={() => {
                this.props.route.params.addcommunity(selectedCommunity);

                this.back();
              }}
              style={{
                flex: 0.1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image style={styles.notificationStyle} source={images.tick} />
            </TouchableOpacity>
            :
            null
            }
         
          </View>

          <View style={styles.textinputStyle}>
            <Image
              style={{
                tintColor: 'gray',
                height:19,
                width: 19,
                marginHorizontal: 10,
              }}
              source={images.search}
            />
            <TextInput
              placeholder="Search"

            onChangeText={text => this.searhFun(text)}
            // value={textInputValue}
            />
          </View>
        </View>
<View>
<FlatList
          data={this.state.selectedCommunity}
          //    ItemSeparatorComponent = {this.FlatListItemSeparator}
          horizontal={true}
          renderItem={({ item, index }) =>
            this.selectedCommunityRender(item, index)
          }
        // keyExtractor={(item, index) => index}
        />
        <FlatList
          data={this.state.communities}
          //    ItemSeparatorComponent = {this.FlatListItemSeparator}

          renderItem={({ item, index }) => this.communityRender(item, index)}
        // keyExtractor={(item, index) => index}
        />
</View>
        
      </View>
   </SafeAreaView>
    );
  }
}

export default SelectCommunity;

const styles = StyleSheet.create({
  container: { flex:1},
  image: {
    height: 50,
    width: 50,
    margin: 5,
  },
  communityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    left:10,
    flex:1
   
  },
  selectedCommunityContainer: {
    alignItems: 'center',
    width: width * 0.2,
    left:10,
    paddingRight:8
    
  },
  selectedCommunityTextName: {
    textAlign: 'center',
    width: width * 0.2
  },
  notificationStyle: {
    height: 18,
    width: 18,
    tintColor: colors.BLACK,
  },
  textinputStyle: {
    width: '90%',
    height: 40,
    flexDirection: 'row',
    borderColor: 'gray',
    backgroundColor:'lightgrey',
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    margin: 10,
  },
  closeIcon: { height: width * .07, width: width * .07 },
  closeButtonContainer: { position: "absolute", bottom: 0, right: 0, zIndex: 99 }
});
