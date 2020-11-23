
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  Text,
  Keyboard,
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
import Toast from 'react-native-simple-toast';
import colors from '../../common/colors';

export default class AddMember extends React.Component{

  constructor(props) {
    super(props);
    
        
        this.state = {
          alphabet: [
            {key: 'A'},
            {key: 'B'},
            {key: 'C'},
            {key: 'D'},
            {key: 'E'},
            {key: 'F'},
            {key: 'G'},
            {key: 'H'},
            {key: 'I'},
            {key: 'J'},
            {key: 'K'},
            {key: 'L'},
            {key: 'M'},
            {key: 'N'},
            {key: 'O'},
            {key: 'P'},
            {key: 'Q'},
            {key: 'R'},
            {key: 'S'},
            {key: 'T'},
            {key: 'U'},
            {key: 'V'},
            {key: 'W'},
            {key: 'X'},
            {key: 'Y'},
            {key: 'Z'},
            
           
          
          ],
          dataArray: [],
          item: this.props.route.params.item,
          communityId:''
        };
      }
      componentDidMount(){
          this.getContactAPI()
          var communityId = this.state.item.id
          this.setState({communityId:communityId})
      }


      getContactAPI() {
        this.props
          .getContactAPI()
          .then(() => this.afterGetContact())
          .catch((e) => console.log(e.message));
      }
    
      afterGetContact() {
        console.log('isBusy value --- ', this.props.isBusyGetContact);
        console.log('response value getContact --- ',this.props.responseGetContact);
    
        var userProfile = this.props.responseGetContact.response;
    
        console.log('userprofile>>>>>>>>', userProfile);
        this.setState({dataArray: userProfile});
      }


      addMemberApi(id) {
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
    
      let details = {
        "user_id": id
      }
    
        // post your data.
        api.post('/communities/'+this.state.communityId+'/join',details)
        .then((res) =>
          this.afterAdd(res).catch((err) => {
           
            console.log('e  d ', err);
          }),
        );
      }
    
      afterAdd(res) {
        console.log('upload post succes======', res);
        console.log('response value Delete --- ', res.data);
       {
        res.data.message != null ?
        Toast.show(res.data.message)
        :
        Toast.show('Successfully Added')
       }
      

        this.back()
     
      }
    
      back() {
        this.props.navigation.goBack();
      }


      renderItem = (item) => {
       
        return (
          <View style={{flex:1,flexDirection:'row',marginVertical:15}}>

           <View style={{height:'100%',width:'10%',justifyContent:'center',alignItems:'center'}}>
           <TouchableOpacity
          // onPress={()=> this.back()}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image style={{height:45,width:35}} 
            resizeMode='contain'
            source={images.dummyPerson} />
          </TouchableOpacity>

          <TouchableOpacity
          // onPress={()=> this.back()}
            style={{
            
             position:'absolute'
            }}>
            <Image style={{height:10,width:10, top:15,left:10}} 
            source={images.statusGreen} />
          </TouchableOpacity>

           </View>
            
           <View style={{height:'100%',width:'73%',left:10,top:10}}>
        <Text style={{fontWeight:'bold'}}>{item.first_name} {item.last_name}</Text>
          

            </View>
 
            <TouchableOpacity onPress={()=> this.addMemberApi(item.id)} style={{top:10,height:'65%',width:'17%',borderColor:'black',borderRadius:5,borderWidth:1,justifyContent:'center',alignItems:'center'}}>
           <Text style={{fontSize:12}}> + Add </Text>
           </TouchableOpacity>
            
         
          </View>
        );
      };
      alphabetView = (item) => {
        console.log('---custom-renderItem--', item);
        return (
          <View style={{alignSelf:'center',justifyContent:'center',alignItems:'center'}}>
            <Text style={{color:'black'}}>{item.key}</Text>
          </View>
        );
      };

  render(){
    return(
      <SafeAreaView style={{flex:1,backgroundColor: colors.RED}}>
      <View style={{flex: 1, backgroundColor: colors.WHITE}}>
         <StatusBar
            hidden={false}
            backgroundColor={'#BD2026'}
            barStyle="light-content"
        />
      <View style={{height: 100, width: '100%', backgroundColor: '#BD2026'}}>
        <View style={{flex: 0.5, flexDirection: 'row'}}>
          <TouchableOpacity
          onPress={()=> this.back()}
            style={{
              flex: 0.15,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image style={styles.notificationStyle} source={images.back} />
          </TouchableOpacity>

          <View
            style={{
              flex: 0.70,
              justifyContent: 'center',
              alignItems:'center',
            }}>
            <Text style={{color: 'white', fontSize: 18}}>Add Members to Community </Text>
          </View>

        

        </View>
        <View style={{flex:0.5}}>
            <View  style={styles.textinputStyle}>
            <Image style={{tintColor:'gray',height:20,width:20,marginHorizontal:10}} source={images.search} />
            <TextInput
              placeholder="Search by names"
             
              // onChangeText={text => setTextInputValue(text)}
              // value={textInputValue}
            />
            </View>
       
        </View>
      </View>

   


      <View style={{height:'100%',width:'100%',flexDirection:'row',margin:10}}>

       <View style={{flex:0.9}}>
         <FlatList
          data={this.state.dataArray.sort((a, b) => a.first_name.localeCompare(b.first_name))}
          renderItem={({item}) => this.renderItem(item)}
          // ItemSeparatorComponent={this.renderSeparator}
        />
        </View> 
        <View style={{flex:0.1}}>
        <FlatList
          data={this.state.alphabet}
          renderItem={({item}) => this.alphabetView(item)}
          // ItemSeparatorComponent={this.renderSeparator}
        />
        </View>
      

  
        </View>  
    
      </View>
   </SafeAreaView>
    )
  }
}


const styles = StyleSheet.create({
  firsthaderstyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
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
    width: '90%',
    height: 40,
    flexDirection:'row',
    borderColor: 'gray',
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
  },
 
});