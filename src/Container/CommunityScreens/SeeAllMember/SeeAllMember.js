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
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';
import colors from '../../common/colors';



import images from '../../common/images';
// import SectionListModule from 'react-native-sectionlist-contacts'


export default class SeeAllMember extends React.Component {

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
            {key: '#'}, 
           
          
          ],
          dataArray: [],
          dataAdmin:[],
          item: this.props.route.params.item,
        };
      }
      componentDidMount(){
          console.log("communitiID>>>>>>>>>>>.",this.state.item)
          var members =this.state.item.members
          var admins =this.state.item.admins
          this.setState({dataArray:members,dataAdmin:admins})
      }
      renderItem = (item) => {
      
        return (
          <View style={{flex:1,flexDirection:'row',marginLeft:20,margin:10}}>
           <View style={{height:'100%',width:'10%',justifyContent:'center',alignItems:'center'}}>
           <TouchableOpacity
          // onPress={()=> this.back()}
            style={{
             
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image style={{height:45,width:45}} 
            source={images.dummyPerson} />
          </TouchableOpacity>

          <TouchableOpacity
          // onPress={()=> this.back()}
            style={{
            
             position:'absolute'
            }}>
            <Image style={{height:10,width:10, top:20,left:20}} 
            source={images.statusGreen} />
          </TouchableOpacity>

           </View>
            
           <View style={{height:'100%',width:'73%',left:20,justifyContent:'center'}}>
           <Text style={{fontWeight:'bold'}}>{item.first_name} {item.last_name} </Text>
          

            </View>
 
            <TouchableOpacity style={{height:'65%',width:'17%',justifyContent:'center',alignItems:'flex-end'}}>
            <Image
              style={{
              height: 12,
              width: 12,
              resizeMode: 'contain',
            }}
            source={images.more_options}
          />
          
           </TouchableOpacity>
            
         
          </View>
        );
      };

      adminItem = (item) => {
      
        return (
          <View style={{flex:1,flexDirection:'row',margin:10}}>
           <View style={{height:'100%',width:'10%',justifyContent:'center',alignItems:'center'}}>
           <TouchableOpacity
          // onPress={()=> this.back()}
            style={{
             
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image style={{height:45,width:45}} 
            source={images.dummyPerson} />
          </TouchableOpacity>

          <TouchableOpacity
          // onPress={()=> this.back()}
            style={{
            
             position:'absolute'
            }}>
            <Image style={{height:10,width:10, top:20,left:20}} 
            source={images.statusGreen} />
          </TouchableOpacity>

           </View>
            
           <View style={{height:'100%',width:'80%',left:20,justifyContent:'center'}}>
           <Text style={{fontWeight:'bold'}}>{item.first_name} {item.last_name} </Text>
          

            </View>
 
            <TouchableOpacity style={{height:'65%',width:'10%',justifyContent:'center',alignItems:'flex-end'}}>
            <Image
              style={{
              height: 12,
              width: 12,
              resizeMode: 'contain',
            }}
            source={images.more_options}
          />
          
           </TouchableOpacity>
            
         
          </View>
        );
      };

      alphabetView = (item) => {
       
        return (
          <View style={{alignSelf:'center',justifyContent:'center',alignItems:'center'}}>
            <Text style={{color:'black'}}>{item.key}</Text>
          </View>
        );
      };
      back() {
        this.props.navigation.goBack();
      }
    

  render() {
    return (
      <SafeAreaView style={{flex:1,backgroundColor: colors.RED}}>
      <View style={{flex: 1,backgroundColor:'white'}}>
          <StatusBar
            hidden={false}
            backgroundColor={'#BD2026'}
            barStyle="light-content"
            
        />
        {/* Header View */}
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
              <Text style={{color: 'white', fontSize: 15}}>Community Name Members</Text>
            </View>

            <TouchableOpacity
            onPress={()=> this.back()}
              style={{
                flex: 0.15,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image style={styles.notificationStyle} source={images.unfriend} />
            </TouchableOpacity>

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

        {/* Admin  View */}
        <View style={{height: '17%', width: '100%'}}>
          
          <View style={{height:'30%',width:'100%',justifyContent:'flex-end',left:15}}>
          <Text style={{color:'#BD2026',fontSize:16,fontWeight:'bold'}}>Admins</Text>
          </View>
 
          <View style={{height:'70%',width:'100%',flexDirection:'row'}}>
             
          <TouchableOpacity style={{height:'100%',width:'85%',marginHorizontal:15,alignItems:'center',flexDirection:'row'}}>
             
          <FlatList
           data={this.state.dataAdmin.sort((a, b) => a.first_name.localeCompare(b.first_name))}
          renderItem={({item}) => this.adminItem(item)}
          // ItemSeparatorComponent={this.renderSeparator}
         />

          </TouchableOpacity>



          </View>
      
       </View>
      
        <View style={{height:1,width:'100%',backgroundColor:'lightgrey'}}>

        </View>
       
       {/* Members Name View */}
        <View style={{height:'5%',width:'100%',left:15,justifyContent:'flex-end'}}>
          <Text style={{color:'#BD2026',fontSize:16,fontWeight:'bold'}}>
          Members</Text>
          </View>
         
          <View style={{height:'63%',width:'100%',flexDirection:'row'}}>

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
    );
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
    tintColor:'white'
   
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
    height: '70%',
    flexDirection:'row',
    borderColor: 'gray',
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
  },
  moreStyle: {
    height: 20,
    width: 20,
    marginBottom: 12,
  },
});