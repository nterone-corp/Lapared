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

import images from '../common/images';
const {height, width} = Dimensions.get('window');

class Contacts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        contacts: [],
      selectedContact: [],
      selectContactsIdArray: []
    };
    this.getCommunityAPI = this.getCommunityAPI.bind(this);
    this.afterCallingStoriesAPI = this.afterCallingStoriesAPI.bind(this);
    this.storyRender = this.storyRender.bind(this);
    this.selectedContactsRender = this.selectedContactsRender.bind(this);
    this.pushContactToSelectedOne = this.pushContactToSelectedOne.bind(
      this,
    );
    this.deleteContact = this.deleteContact.bind(this);
  }
  componentDidMount() {
    this.getCommunityAPI();
  }

  pushContactToSelectedOne(index) {
    let {contacts, selectedContact, selectContactsIdArray} = this.state;
    let removedItem = contacts.splice(index, 1);
    console.log('removedItemremovedItem', removedItem);

    selectedContact.push(removedItem[0]);
    selectContactsIdArray.push(removedItem[0].id)
    this.setState({contacts, selectedContact, selectContactsIdArray});
  }

  deleteContact(index){
    let {contacts, selectedContact, selectContactsIdArray} = this.state;
    let removedItem = selectedContact.splice(index, 1);
    console.log('removedItemremovedItem', removedItem);

    contacts.push(removedItem[0]);
    selectContactsIdArray.splice(index, 1);
  
    this.setState({contacts, selectedContact, selectContactsIdArray});
  
  }
  getCommunityAPI() {
    // setConfiguration('Token', '');
    this.props
      .getContactsAPI()
      .then(
        () => {
          this.afterCallingStoriesAPI();
        },
        // {setRefreshing(false)
        // setDataSource(this.afterCallingHomeAPI());}
      )
      .catch((e) => {console.log("catchcatchcatchcatch",e)});
  }

  afterCallingStoriesAPI() {
    var contactsData = this.props.contacts, {hideContacts} = this.props.route.params;

  let contactsNew = [], SelectedContactsNew = [];
    if(contactsData.length>0){
      contactsData.map((a)=>{
        if(hideContacts.includes(a.id)){
          SelectedContactsNew.push(a)
        }else{
          contactsNew.push(a)
        }
  
      })
    }
  
 
    this.setState({
        contacts: contactsNew,
        selectedContact: SelectedContactsNew,
        selectContactsIdArray: hideContacts
    });
  }
  back() {
    this.props.navigation.goBack();
  }

  storyRender(item, index) {
    console.log('fgddfgdfgdg.user.', item);
    return (
      <TouchableOpacity
        onPress={() => {
          this.pushContactToSelectedOne(index);
        }}>
        <View style={styles.communityContainer}>
          <Image source={images.dummyPerson} style={styles.image} />
          <Text>{item.first_name  + " " + item.last_name}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  selectedContactsRender(item, index) {
    console.log('fgddfgdfgdg.user.', item);
    return (
      <View style={styles.selectedCommunityContainer}>
        <View>
        <Image source={images.dummyPerson} style={styles.image} />
        <TouchableOpacity style={styles.closeButtonContainer} onPress={()=>{
          this.deleteContact(index)}}>
          <Image
                    resizeMode="contain"
                    source={images.cross}
                    style={styles.closeIcon}
                  />
         </TouchableOpacity>         
        </View>
  
        <Text style={styles.selectedCommunityTextName}>{item.first_name + " " + item.last_name}</Text>
       
      </View>
    );
  }

  render() {
    let {contacts, selectContactsIdArray} = this.state;
    console.log(' contacts', contacts);
    return (
      <SafeAreaView style={{flex:1,backgroundColor:colors.RED}}>
          <StatusBar
            hidden={false}
            backgroundColor={'#BD2026'}
            barStyle="light-content"
            
        />
      
      <View style={[styles.container]}>
        
        <View style={{marginTop:20}}>
          <View style={{flexDirection: 'row', marginTop: width * 0.03}}>
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
              <Text style={{color:colors.BLACK, fontSize: 16}}>
                Select Contacts
              </Text>
            </View>
            {this.state.selectedContact != '' ?   <TouchableOpacity
              onPress={() => {
                  console.log("hideContactshideContacts",selectContactsIdArray)
                 
                this.props.route.params.addContacts(selectContactsIdArray);

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

              // onChangeText={text => setTextInputValue(text)}
              // value={textInputValue}
            />
          </View>
        </View>
<View>
<FlatList
          data={this.state.selectedContact}
          //    ItemSeparatorComponent = {this.FlatListItemSeparator}
          horizontal={true}
          renderItem={({item, index}) =>
            this.selectedContactsRender(item, index)
          }
          // keyExtractor={(item, index) => index}
        />
        <FlatList
          data={this.state.contacts}
          //    ItemSeparatorComponent = {this.FlatListItemSeparator}

          renderItem={({item, index}) => this.storyRender(item, index)}
          // keyExtractor={(item, index) => index}
        />
</View>
       
      </View>
   
    </SafeAreaView>
    );
  }
}

export default Contacts;

const styles = StyleSheet.create({
  container: {flex:1, backgroundColor:'white'},
  image: {
    height: 50,
    width: 50,
    margin: 5,
  },
  communityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedCommunityContainer: {
    alignItems: 'center',
    width: width * 0.2,
  },
  selectedCommunityTextName: {
    textAlign: 'center',
  },
  notificationStyle: {
    height: 18,
    width: 18,
    tintColor:colors.BLACK,
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
    marginVertical: 10,
  },
  closeIcon: {height: width*.07, width: width*.07},
  closeButtonContainer: {position: "absolute", bottom: 0, right: 0,zIndex : 99}
});
