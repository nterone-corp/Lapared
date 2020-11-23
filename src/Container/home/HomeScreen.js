import React, {useState, Fragment} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
  TextInput,
  Text,
  StatusBar,
  Alert,
  RefreshControl,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  BackHandler,
  Dimensions,
  ActivityIndicator,
  Platform
} from 'react-native';
import color from '../common/colors';
import {getConfiguration, setConfiguration} from '../../utils/configuration';
import {AsyncStorage} from 'react-native';
import CustomButton from '../widgets/CustomButton';
import MainViewPro from '../commanview/commonview';
import images from '../common/images';
import commonData from '../common/data';
import data from '../common/data';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {BottomSheet} from 'react-native-btr';
import {create} from 'apisauce';
import Toast from 'react-native-simple-toast';
import PTRView from 'react-native-pull-to-refresh';
import Activity from '../common/ActivityIndicator';
import Video from 'react-native-video';
import VideoImageComponent from "../../Components/common/VideoImageComponent"
import colors from '../common/colors';
const { height, width } = Dimensions.get("window");

import ProgressBar from "../../Components/common/ProgressBar"


export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDialogAlert: false,
      itemInside: '',
      react: '',
      visible: false,
      counthappy: 0,
      countlaugh: 0,
      countangry: 0,
      countclap: 0,
      userId: '',
      commentTurn:false,
      shareTurn:false,
      editPostItem: '',
      reactiondata: [],
      postUserId: '',
      initial:'',
      postIdHide: '',
      loader: false,
      storyVisible: false,
      storyVisibleModal: false,
      storyDetail: null,
      progressStatus: 0,
      storyIndex: 0,
      substoryIndex:0,
      dropDownShow: false,
      tempMyStories:  [
         {
          profile_image: images.group_image,
          cover_image: images.second_story,
          name: 'Jane Doe',
        }, 
      ],
      mystories: [],
      indexNoView:0,
      data: [],
      feed:true,
      moreOptions: false,
      postId: '',
      community_id: ''
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.AddStory = this.AddStory.bind(this);
    this.openStoryModal = this.openStoryModal.bind(this);
    this.storyAPI= this.storyAPI.bind(this);

    const {navigation} = props;

    this.didFocusListener = navigation.addListener(
      'didFocus',
      this.componentDidFocus,
    );

    this.props.navigation.addListener('willFocus', () => {
      this.homeAPI();
    });
    
    this.storyAPI(true)

  }

  closestoryModal() {
    const {substoryIndex, storyIndex} = this.state;
    this.setState({storyVisible: false , storyVisibleModal: false})
    // onEnd={()=>this.changeModalItems(((this.state.storyDetail.mediaArray.length-1) == substoryIndex) ? storyIndex+1: storyIndex, ((this.state.storyDetail.mediaArray.length-1) == substoryIndex) ? 0: substoryIndex+1)}/>
  }
  
  openStoryModal(index) {
    let context = this;
    this.setState({storyVisibleModal: true,indexNoView:index})
    this.changeModalItems(index,0);
  
  }

  changeModalItems = (index, substoryIndex) => {
    let {mystories} = this.state;
    this.setState({storyVisible: false})
    
    if(mystories.length > index ){
      this.setState({storyDetail: mystories[index], storyIndex : index,substoryIndex: substoryIndex, storyVisible: true})
    }else{
      this.closestoryModal();
    }
  }

  _toggleBottomNavigationView(item) {
    console.log('itemuserIdpost>>>>>>>>', item);
    //  this.setStateChange()
    this.setState({
      visible: true,
      postUserId: item.user.id,
      postIdHide: item.id,
      editPostItem: item,
      commentTurn: item.allow_comments,
      shareTurn: item.allow_share,
      community_id: item.community_id

    });
  }
  _toggleBottomNavigationViewOff() {
  

    this.setState({visible: false,showDialogAlert:false});
  }

  componentDidUpdate(prevProps) {
    if (prevProps.response.response !== this.props.response.response) {
      var postData = this.props.response.response.data;
this.setState({data:postData})
    //   var dataPO = postData.slice(0, 10);
    // this.setState({
    //   data: dataPO,
    // });
   
    }
  }

  componentDidFocus() {
   
    // this.homeAPI();
    console.log('componentDidFocus');
  }

  componentWillMount() {
    // console.log('componentWillMount');
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }
  goToSearch() {
    this.props.navigation.navigate('Search');
  }


  handleBackButtonClick = () => {
   
    if(this.state.showDialogAlert){
      this.setState({showDialogAlert:false})
      return true;
    }

else{
  if (this.props.navigation.isFocused()) {
       
    Alert.alert(
      'Exit',
      'Are you sure you want to exit app',
      [
      {text: 'Cancel', onPress: () => {}, style: 'cancel'},
      {text: 'Exit', onPress: () => BackHandler.exitApp()},
      ],
      {cancelable: false},
      );
      return true;

} else {
return false;
}
}

   
    };



    AddStory() {
      this.props.navigation.navigate('AddStory',{
        storyAPI: ()=>{this.storyAPI(false)}
      });
    }



  statusfeedsss() {
    this.props.navigation.navigate('Story');
  }

  storiesfeedsss() {
    this.props.navigation.navigate('NewFeeds');
  }
  goToShare() {
    this.props.navigation.navigate('Share', {item: this.state.itemInside});
    this.setState({
      showDialogAlert: false,
      
    });
  }
  setStateChange(item) {
    // console.log('itemInside>>>>>>>', item);
    var first_nam = item.user.first_name
    var initial= first_nam.substring(0,1)
    this.setState({
      showDialogAlert: true,
      itemInside: item,
      postId: item,
      initial:initial
    });
  }
  setStateChangee() {
    // console.log('itemInside>>>>>>>', item);
    
    this.setState({
      showDialogAlert: false,
     
    });
  }
  goToCreatePost(item) {
    this.props.navigation.navigate('CreatePost', {go: item});
  }
  goCommentScreen(item) {
    console.log('Item>>>.id', item);
    this.props.navigation.navigate('Comments', {
      postId: item.id,
      id: item.community_id,
    });
    this.setState({
      showDialogAlert: false,
    });
  }
// /** 
//  * Add Story functionlity
//  * export ANDROID_HOME=/Users/parshant.nagpal/Library/Android/sdk
// export PATH=$ANDROID_HOME/platform-tools:$PATH
// export PATH=$ANDROID_HOME/tools:$PATH

  componentDidMount() {
    
    console.log('componentDidMount');
    const {navigation} = this.props;

    // var statusCode = getConfiguration('statusCode')
    // console.log('status code mmmmmm --- ', statusCode);

    this.homeAPI();
    this.getProfile();
  }

  getProfile() {
    this.props
      .getProfileAPI()
      .then(() => this.afterGetProfile())
      .catch((e) => this.afterErrorHomeApi(e));
  }

  afterGetProfile() {
    console.log('isBusy value --- ', this.props.isBusyGetProfile);
    console.log(
      'response value getProfile --- ',
      this.props.responseGetProfile,
    );

    var userProfile = this.props.responseGetProfile.response.id;

    console.log('userid>>>>>>>>', userProfile.id);
    this.setState({userId: userProfile});
  }

  // hide api /////////////////////////////////
  hideApi() {
    var apiRoot = getConfiguration('API_ROOT');

    var acces_token = getConfiguration('Token');

    console.log("acces_tokenacces_token",acces_token)
    // var customerid = getConfiguration('user_id');
    // create api.
    const api = create({
      baseURL: apiRoot,
      // headers: { 'Content-Type': 'multipart/form-data', },
      headers: {
        Authorization: 'Bearer ' + acces_token,
        'Content-Type': 'application/json',
      },
    });

    console.log('api>>>>>>>', api);
    // let details = {
    //   "content": this.state.contentRply,
    //   "comment_id":this.state.replyId
    // };

    api
      .put('/posts/' + this.state.postIdHide + '/hide', {})
      .then((res) => this.afterhide(res));
  }

  afterhide(res) {
    console.log('upload rply succes======', res);
    console.log('response value hide --- ', res.data);
    this.homeAPI()
    this._toggleBottomNavigationViewOff();
    // this.props.navigation.navigate('HomeTab')

    // this.setState({data:res.data})
  }

  unfriendApi() {
    var apiRoot = getConfiguration('API_ROOT');

    var acces_token = getConfiguration('Token');
    // var customerid = getConfiguration('user_id');
    // create api.
    const api = create({
      baseURL: apiRoot,
      // headers: { 'Content-Type': 'multipart/form-data', },
      headers: {
        Authorization: 'Bearer ' + acces_token,
        'Content-Type': 'application/json',
      },
    });

    console.log('api>>>>>>>', api);
    // let details = {
    //   "content": this.state.contentRply,
    //   "comment_id":this.state.replyId
    // };

    api
      .delete('/user/contacts/' + this.state.postUserId + '', {})
      .then((res) => this.afterdelete(res));
  }

  afterdelete(res) {
    console.log('upload rply succes======', res);
    console.log('response value delete --- ', res);
    this._toggleBottomNavigationViewOff();
    this.homeAPI()
    Toast.show('Contact removed successfully.');
    // this.props.navigation.navigate('HomeTab')

    // this.setState({data:res.data})
  }

  editPost(item) {
    console.log('itemPOst>>>>>>>>>>', item);
    this.props.navigation.navigate('CreateUpdatePost', {itempost: item});
    this._toggleBottomNavigationViewOff();
  }

  homeAPI() {
    // setConfiguration('Token', '');
    this.props
      .getHomeAPI()
      .then(
        () => this.afterCallingHomeAPI())
      .catch((e) => this.afterErrorHomeApi(e));
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

  storyAPI(load) {
    // setConfiguration('Token', '');
    this.props
      .getStoriesAPI(load)
      .then(
        () => {
          this.afterCallingStoriesAPI()
        },
        // {setRefreshing(false)
        // setDataSource(this.afterCallingHomeAPI());}
      )
      .catch((e) => this.afterErrorHomeApi(e));
  }

  
  afterCallingStoriesAPI() {

    var postData = this.props.stories;
    console.log('PostDatastories>>>>>>>>', postData);
    
    var output = [];
    
    postData.forEach(function(item) {
      var existing = output.filter(function(v, i) {
        return v.user_id == item.user_id;
      });
      if (existing.length) {
        var existingIndex = output.indexOf(existing[0]);
        output[existingIndex].mediaArray = output[existingIndex].mediaArray.concat(item);
      } else {
        if (typeof item.media == 'string')
          item.mediaArray = [item];
        output.push(item);
      }
    });

   console.log("outputoutputoutput",output)


    this.setState({
      mystories: output,
    });
    // var otup = output.slice(0, 10)
    // this.setState({
    //   mystories: otup,
    // });
  }


  afterCallingHomeAPI() {
    console.log('isBusy value --- ', this.props.isBusy);
    console.log('response value home --- ', this.props.response);
    // var statusCode = getConfiguration('statusCode')
    // console.log('status code mmmmmm --- ', statusCode);

    var postData = this.props.response.response.data;
    console.log('PostData>>>>>>>>', postData);
    console.log('PostDataID>>>>>>>>', postData);
  //  var dataPO = postData.slice(0, 10);
  //   this.setState({
  //     data: dataPO,
  //   });
   this.setState({data:postData})
   
  }

  showAlert(message, duration) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      alert(message);
    }, duration);
  }

  onBuffer= (data) =>{
  console.log("onBufferonBufferonBuffer",data)
  }     
  videoError= (error) =>{
    console.log("errorerrorerror",error)
  }         
   dropDown(){
     this.setState({dropDownShow: !this.state.dropDownShow})
   }

   controlLoader(loader) {
    let {controlLoader} = this.props;
    this.setState({ loader })
    if(controlLoader){
      controlLoader(loader)
    }
  }



  FlatListItemSeparator = () => {
    return (
      //Item Separator
      <View
        style={{
          height: 0.5,
          width: '90%',
          alignSelf:'center',
          marginVertical: 12,
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };

  StatusView(item, index) {
   var first_name = item.user.first_name

   var initials= first_name.substring(0,1)
    return (
      <TouchableOpacity
        onPress={() => this.setStateChange(item)}
        style={{flexDirection: 'column', backgroundColor: 'white',marginBottom:20}}>
        {item.media != null ? (
          <View>
            <View style={{flexDirection: 'row',left:10}}>
              <View style={{alignItems: 'center'}}>
                {item.user.avatar == null ? (
                 <View style={{height:35,width:35,backgroundColor:'gray',borderBottomLeftRadius:10,borderTopRightRadius:10,justifyContent:'center',alignItems:'center'}}>
                     <Text style={{fontSize:18}}>
                       
                  {initials}
                  </Text>
                   </View>
                ) : (
                  <Image
                    resizeMode="contain"
                    style={styles.userProfileStyle}
                    source={{uri:item.user.avatar}}
                  />
                )}
              </View>
              

              <View style={{marginStart: 8}}>
                <Text
                  style={{fontWeight: 'bold', fontSize: 11, color: 'black'}}>
                   {item.user.first_name} {item.user.last_name}
                </Text>
                <Text style={{fontSize: 9,color:'gray'}}>{item.elapsed_time} </Text>
              </View>
              <TouchableOpacity
                onPress={() => this._toggleBottomNavigationView(item)}
                style={{
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  width: '25%',
                }}>
                <Image style={styles.moreStyle} source={images.more_options} />
              </TouchableOpacity>
            </View>
           
            <View>
              {item.community != null ? (
            <View style={{ backgroundColor: color.RED_BUTTON,borderRadius:5,padding:5,marginTop:10,left:10,alignSelf:'flex-start'}}>
            <Text style={{fontSize: 10, color: 'white',}}>
         {item.community.name}
            </Text>
          </View>
              ) : null}
              <Text
                style={{
                  marginHorizontal: 12,
                  marginTop: 8,
                }}>
                {item.content}
              </Text>

              {item.media_type && <VideoImageComponent 
              source={item.media}   // Can be a URL or a local file.
              resizeMode="contain"
              displayBackgroundColor={false}
              videoImageStyle={styles.VideoStyle}
              media_type={item.media_type}
              mute={true}
              />}
              
            
            </View>
          </View>
        ) : (
          <View>
            <View style={{flexDirection: 'row',left:10}}>
              <View style={{alignItems: 'center'}}>
                {item.user.avatar == null ? (
                   <View style={{height:35,width:35,backgroundColor:'gray',borderBottomLeftRadius:10,borderTopRightRadius:10,justifyContent:'center',alignItems:'center'}}>
                  <Text style={{fontSize:18}}>
                  {initials}
                  </Text>
                   </View>
                ) : (
                  <Image
                    resizeMode="contain"
                    style={styles.userProfileStyle}
                    source={item.user.avatar}
                  />
                )}
              </View>

              <View style={{flexDirection: 'column', marginStart: 8}}>
                <Text
                  style={{fontWeight: 'bold', fontSize: 11, color: 'black'}}>
                   {item.user.first_name} {item.user.last_name}
                </Text>
                <Text style={{fontSize: 9,color:'gray'}}>{item.elapsed_time} </Text>
              </View>

              <TouchableOpacity
                onPress={() => this._toggleBottomNavigationView(item)}
                style={{
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  width: '25%'
                }}>
                <Image style={styles.moreStyle} source={images.more_options} />
              </TouchableOpacity>
            </View>

            <View style={{margin: 12}}>
              {item.community != null ? (
                <View style={{ backgroundColor: color.RED_BUTTON,borderRadius:5,padding:5,alignSelf:'flex-start'}}>
                  <Text style={{fontSize: 10, color: 'white',}}>
               {item.community.name}
                  </Text>
                </View>
              ) : null}

              <Text
                style={{marginTop: 12, color: 'black'}}>
                {' '}
                {item.content}
              </Text>
              {/* {item.media != null ? (
                <Image
                  style={{width: '100%', height: '60%'}}
                  source={item.media}
                />
              ) : null} */}
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  StoriesViews(item, index) {
    // console.log("ieteeteeeeteeitem.user.",item)
    return (
      <TouchableOpacity onPress={()=>{
        this.openStoryModal(index)
       }}>
        <View style={{flex: 1, left: 15}}>
          {index == 0 ? (
            <View> 
                 <Image
            source={ {uri: item.media}}
              resizeMethod={"resize"}
              resizeMode="cover"
              onLoadStart={() => this.controlLoader(true)}
              onLoad={() => this.controlLoader(false)}
              style={{
                width: 110,
                height: 170,
                marginVertical:5,
                borderTopRightRadius:20,
                borderBottomLeftRadius:20
              }}/>
                 {this.state.loader && <View style={[{

position: 'absolute',
top: 0,
left: 0,
right: 0,
bottom: 0,
flexDirection: 'row',
justifyContent: 'center',
alignItems: 'center',

opacity: 0.5
}, this.props.displayBackgroundColor && { backgroundColor: "grey" }]}>
<ActivityIndicator size="large" color={color.RED_BUTTON} />

</View>}
              <Text
                style={{
                  color: 'white',
                  marginLeft: 6,
                  position: 'absolute',
                  bottom: 20,
                  fontSize: 12,
                }}>
                {commonData.string_constants.add_to_story}
              </Text>
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: color.RED,
                  height: 28,
                  width: 28,
                  position: 'absolute',
                  top: 25,
                  right: 15,
                  borderRadius: 15,
                  marginEnd: 12,
                }}
                onPress={()=>{this.AddStory()}}
                >
                <Image source={images.add} style={{height: 16, width: 16}} />
              </TouchableOpacity>
           
          
              </View>
         
          ) : (
            <View>
   <Image
              source={ {uri: item.media}}
              resizeMethod={"resize"}
              resizeMode="cover"
              onLoadStart={() => this.controlLoader(true)}
              onLoad={() => this.controlLoader(false)}
              style={{
                width: 110,
                height: 170,
                marginVertical:5,
                borderTopRightRadius:20,
                borderBottomLeftRadius:20
              }}/>
               {this.state.loader && <View style={[{

position: 'absolute',
top: 0,
left: 0,
right: 0,
bottom: 0,
flexDirection: 'row',
justifyContent: 'center',
alignItems: 'center',

opacity: 0.5
}, this.props.displayBackgroundColor && { backgroundColor: "grey" }]}>
<ActivityIndicator size="large" color={color.RED_BUTTON} />

</View>}
              <Text
                style={{
                  color: 'white',
                  marginLeft: 12,
                  position: 'absolute',
                  bottom: 25,
                  fontSize: 12,
                }}>
                {item.user.first_name}
              </Text>
              <Text
                style={{
                  color: 'white',
                  marginLeft: 12,
                  position: 'absolute',
                  bottom: 12,
                  fontSize: 12,
                }}>
                {item.user.last_name}
              </Text>
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',

                  height: 30,
                  width: 30,
                  position: 'absolute',
                  top: 10,
                  right: 5,
                  borderRadius: 15,
                }}>
                <Image
                  source={item.profile_image}
                  style={{height: 24, width: 24, marginRight: 12}}
                />
              </TouchableOpacity>
              {this.state.dropDownShow == true ? (
                <View
                  style={{
                    height: '55%',
                    top: 50,
                    right:25,
                    position: 'absolute',
                    borderBottomEndRadius: 25,
                    borderBottomLeftRadius: 25,
                    width:'20%'                    
                  }}>
                  <ImageBackground
                    style={{height: '100%', width: '100%',justifyContent:'center',
                    alignItems:'center',}}
                    source={images.communityStoryBack}>
                    <TouchableOpacity
                      onPress={() =>  this.props.navigation.navigate('Profile')}
                      style={[styles.story_View,{top:-5}]}>
                      <Image
                        style={{height: 18, width: 18}}
                        source={images.profile}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                    onPress={()=>  this.openStoryModal(index)}
                    style={[styles.story_View]}>
                      <Image
                        style={{height: 18, width: 18}}
                        source={images.visibilitygroup}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      // onPress={() => this.goToaddmember(item.postingData)}
                      style={[styles.story_View, {top: 4} ]}>
                      <Image
                        style={{height: 18, width: 18}}
                        source={images.messageStory}
                      />
                    </TouchableOpacity>

                  </ImageBackground>
                </View>
              ) : null}

              <TouchableOpacity
                onPress={() => this.dropDown()}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 28,
                  width: 28,
                  position: 'absolute',
                  top: 25,
                  right: 20,
                  borderRadius: 15,
                  marginEnd: 12,
                }}>
                <Image
                  style={{
                    height: 35,
                    width: 35,
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}
                  source={images.group_image}
                />
              </TouchableOpacity>
           
         
              </View>
         
         )}
        </View>
     
      </TouchableOpacity>
    );
  }

  // Reaction Get
  reactionGetApi() {
    var apiRoot = getConfiguration('API_ROOT');
    var acces_token = getConfiguration('Token');
    // create api.
    const api = create({
      baseURL: apiRoot,
      headers: {
        Authorization: 'Bearer ' + acces_token,
        'Content-Type': 'application/json',
      },
    });

    console.log('api>>>>>>>', api);
    // let details = {
    //   reaction: {
    //     name: name,
    //     user_id: this.state.itemInside.user.id,
    //   },
    // };

    api
      .get('/reactions/' + this.state.postId.id + '', {})
      .then((res) => this.afterGetReactions(res));
  }

  afterGetReactions(res) {
    console.log('upload share succes======', res);
    console.log('response value GetReaction --- ', res.data);
    var reactiondata = rea.data;
    this.setState({reactiondata: reactiondata});
  }

  // Reaction post
  reactionApi(name) {
  
    var apiRoot = getConfiguration('API_ROOT');

    var acces_token = getConfiguration('Token');
    // var customerid = getConfiguration('user_id');
    // create api.
    const api = create({
      baseURL: apiRoot,
      // headers: { 'Content-Type': 'multipart/form-data', },
      headers: {
        Authorization: 'Bearer ' + acces_token,
        'Content-Type': 'application/json',
      },
    });

    console.log('api>>>>>>>', api);
    let details = {
      reaction: {
        name: name,
        user_id: this.state.itemInside.user.id,
      },
    };

    api
      .put(
        '/reactions/' + this.state.postId.id + '',
        JSON.stringify(details),
        {},
      )
      .then((res) => this.afterReactions(res));
  }

  afterReactions(res) {
    console.log('upload share succes======', res);
    console.log('response value PostReaction --- ', res.data);
    var react = res.data;

    this.setState({itemInside: react});
    this.reactionGetApi();
    this.homeAPI();
  }
// Turn On/off Comments///////////
turnOnOffComment(){
  this._toggleBottomNavigationViewOff()
  console.log('commentTurn>>>>>>',this.state.commentTurn)
  console.log('postId>>>>>>',this.state.postIdHide)
  var apiRoot = getConfiguration('API_ROOT');

  var acces_token = getConfiguration('Token');
  // var customerid = getConfiguration('user_id');
  // create api.
  const api = create({
    baseURL: apiRoot,
    // headers: { 'Content-Type': 'multipart/form-data', },
    headers: {
      Authorization: 'Bearer ' + acces_token,
      'Content-Type': 'application/json',
    },
  });

  console.log('api>>>>>>>', api);
if(this.state.community_id != ''){
  if(this.state.commentTurn == true)  {
    let details = {
      "allow_comments": false,
      "community_id": this.state.community_id
    };
    api
    .put('/posts/'+this.state.postIdHide+'',details)
    .then((res) => this.afterturncomment(res));
  }else{
    let details = {
      "allow_comments": true,
      "community_id": this.state.community_id
    };
    api
    .put('/posts/'+this.state.postIdHide+'',details)
    .then((res) => this.afterturncomment(res));
  }

}else{
  if(this.state.commentTurn == true)  {
    let details = {
      "allow_comments": false
    };
    api
    .put('/posts/'+this.state.postIdHide+'',details)
    .then((res) => this.afterturncomment(res));
  }else{
    let details = {
      "allow_comments": true
    };
    api
    .put('/posts/'+this.state.postIdHide+'',details)
    .then((res) => this.afterturncomment(res));
  }

}

 
}

afterturncomment(res) {
  console.log('upload rply succes======', res);
  console.log('response value comments --- ', res.data);
  this.homeAPI()
 this._toggleBottomNavigationViewOff()

}

// Turn On/off Share///////////
turnOnOffShare(){
  this._toggleBottomNavigationViewOff()
  console.log('ShearTurn>>>>>>>>',this.state.shareTurn)
  var apiRoot = getConfiguration('API_ROOT');

  var acces_token = getConfiguration('Token');
  // var customerid = getConfiguration('user_id');
  // create api.
  const api = create({
    baseURL: apiRoot,
    // headers: { 'Content-Type': 'multipart/form-data', },
    headers: {
      Authorization: 'Bearer ' + acces_token,
      'Content-Type': 'application/json',
    },
  });
if(this.state.community_id != ''){
  console.log('api>>>>>>>', api);
  if(this.state.shareTurn == true)  {
    let details = {
      "allow_share": false,
      "community_id": this.state.community_id
    };
    api
    .put('/posts/'+this.state.postIdHide+'',details)
    .then((res) => this.afterturncomment(res));
  }else{
    let details = {
      "allow_share": true,
      "community_id": this.state.community_id
    };
    api
    .put('/posts/'+this.state.postIdHide+'',details)
    .then((res) => this.afterturncomment(res));
  }

}else{
  console.log('api>>>>>>>', api);
  if(this.state.shareTurn == true)  {
    let details = {
      "allow_share": false
    };
    api
    .put('/posts/'+this.state.postIdHide+'',details)
    .then((res) => this.afterturncomment(res));
  }else{
    let details = {
      "allow_share": true
    };
    api
    .put('/posts/'+this.state.postIdHide+'',details)
    .then((res) => this.afterturncomment(res));
  }

}
  
}
// Delete post///////////////////

deletePost(){
  var apiRoot = getConfiguration('API_ROOT');

  var acces_token = getConfiguration('Token');
  // var customerid = getConfiguration('user_id');
  // create api.
  const api = create({
    baseURL: apiRoot,
    // headers: { 'Content-Type': 'multipart/form-data', },
    headers: {
      Authorization: 'Bearer ' + acces_token,
      'Content-Type': 'application/json',
    },
  });

  console.log('api>>>>>>>', api);
  
    api
    .delete('/posts/'+this.state.postIdHide+'')
    .then((res) => this.afterturncomment(res));
  
}
  calculateFromNow(oldDate){
    var today = new Date();
    var Christmas = new Date(oldDate);
    var diffMs = (Christmas - today); // milliseconds between now & Christmas
    var diffDays = Math.floor(diffMs / 86400000); // days
    var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    return(diffHrs + " hours, " + diffMins);

  }

  onRefresh() {
    // You can either return a promise or a callback
    this.homeAPI();
  }
  _refresh() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.homeAPI());
      }, 1000);
    });
  }

  onLoadStart=(onLoadStart)=>{
   console.log("onLoadStartonLoadStart",onLoadStart)
  }
  onLoad=(onLoad)=>{
    console.log("onLoadonLoadonLoad",onLoad)
   }
   onProgress=(onProgress)=>{
    console.log("onProgressonProgressonProgress",onProgress)
   }
   onEnd=(onEnd)=>{
    console.log("onEndonEndonEndonEnd",onEnd)
   }
  render() {
    const {itemInside, storyDetail, substoryIndex, storyIndex, storyVisible, storyVisibleModal} = this.state;

    // console.log('react>>>>', this.state.react);
    // console.log('itemInside>>>>>>>>', this.state.itemInside);
    return (
      <SafeAreaView style={{flex:1,backgroundColor: color.RED}}>

      <View style={{flex: 1, backgroundColor: color.WHITE}}>
         <StatusBar
            hidden={false}
            backgroundColor={'#BD2026'}
            barStyle="light-content"
            
        />
        <View style={{height: Platform.OS == "android" ? '15%' : '18%', width: '100%', backgroundColor: color.RED}}>
          <View style={{flex: 0.5, flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() =>  this.props.navigation.navigate('Notification')}
              style={{
                flex: 0.15,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={styles.notificationStyle}
                source={images.notification}
              />
            </TouchableOpacity>

            <View
              style={{
                flex: 0.7,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
             <Image resizeMode='contain' source={images.laparedlogo} style={{height:20,width:150}} />
            </View>

            <TouchableOpacity
              onPress={() => this.goToSearch()}
              style={{
                flex: 0.15,
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
              }}>
              <Image style={styles.notificationStyle} source={images.search} />
            </TouchableOpacity>
          </View>

          <View style={{flex: 0.5, flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() =>  this.props.navigation.navigate('Profile')}
              style={{
                flex: 0.2,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: color.RED,
              }}>
              <Image
                style={[styles.userProfileStyle,{height:40,width:40}]}
                source={images.user_profileimage}
              />
            </TouchableOpacity>

            <View
              style={{
                flexDirection: 'row',
                flex: 0.8,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => this.goToCreatePost('Video')}
                style={{
                  flex: 0.3,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <Image style={styles.videoStyle} source={images.video_icon} />

                <Text
                  style={{
                    color: color.WHITE,
                    fontSize: 12,
                    alignSelf: 'center',
                    marginStart: 6,
                  }}>
                  Video{' '}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
               onPress={() => this.goToCreatePost('Post')}
                style={{
                  flex: 0.3,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <Image style={styles.videoStyle} source={images.post_icon} />

                <Text
                  style={{
                    color: color.WHITE,
                    fontSize: 12,
                    alignSelf: 'center',
                    marginStart: 6,
                  }}>
                  Post{' '}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
               onPress={() => this.goToCreatePost('Pic')}
                style={{
                  flex: 0.3,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <Image style={styles.videoStyle} source={images.post_photo} />

                <Text
                  style={{
                    color: color.WHITE,
                    fontSize: 12,
                    alignSelf: 'center',
                    marginStart: 6,
                  }}>
                  Pic{' '}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{height: '90%', width: '100%'}}>
          <MainViewPro
            statusfeeds={() => this.statusfeedsss()}
            storiesfeeds={() => this.storiesfeedsss()}
          />

          <View style={{flex: 0.95,flexDirection: 'row'}}>
            <View style={{flex: 0.35}}>
              {this.state.mystories == '' ? (
                <Fragment>
                
                
                <FlatList
                  data={this.state.tempMyStories}
                  //    ItemSeparatorComponent = {this.FlatListItemSeparator}

                  renderItem={({item, index}) => this.StoriesViews(item, index)}
                  keyExtractor={(item, index) => index}
                />



                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
                    No story available
                  </Text>
                  
                </View>

                 
                 
                </Fragment>
              ) : (
                <FlatList
                  data={this.state.mystories}
                  //    ItemSeparatorComponent = {this.FlatListItemSeparator}

                  renderItem={({item, index}) => this.StoriesViews(item, index)}
                  keyExtractor={(item, index) => index}
                />
              )}

{this.props.isStoryBusy&& <View
                  style={styles.storyLoader}>
                   <Activity />
                </View>
  }
            </View>

            <View style={{flex: 0.65,marginTop:15}}>
              {this.state.data == '' ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                   {this.props.isBusy ? <Activity /> : null}
                </View>
              ) : (
                <FlatList
                  data={this.state.data}
                  ItemSeparatorComponent={this.FlatListItemSeparator}
                  initialNumToRender={5}
                  updateCellsBatchingPeriod={5}
                  maxToRenderPerBatch={5}
                  windowSize={5}
                  renderItem={({item, index}) => this.StatusView(item, index)}
                />
              )}
             
            </View>
          </View>
        </View>
        {this.state.showDialogAlert == true ? (
          <View
            style={{
              position: 'absolute',
              height: '100%',
              width: '100%',
              backgroundColor: color.TRANSPARENT,
            }}>
            <View style={{flex: 1, backgroundColor: color.TRANSPARENT}}>
              <TouchableOpacity
                onPress={() => this.setStateChangee()}
                style={{
                  alignItems: 'flex-end',
                  backgroundColor: color.TRANSPARENT,
                  height: '10%',
                }}>
                <Image
                  style={{
                    width: 18,
                    height: 18,
                    tintColor: 'white',
                    marginRight: 16,
                    marginTop: 16,
                  }}
                  source={images.delete_icon}
                />
              </TouchableOpacity>

              <View style={{flex: 1}}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    backgroundColor: color.TRANSPARENT,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      // onPress={() => this.setStateChange()}
                      style={{
                        alignItems: 'center',
                        marginLeft: 10,
                        marginTop: 10,
                      }}>
                      {itemInside.user.avatar == null ? (
                      <View style={{height:35,width:35,backgroundColor:'gray',borderBottomLeftRadius:10,borderTopRightRadius:10,justifyContent:'center',alignItems:'center'}}>
                      <Text style={{fontSize:18}}>
                        
               {this.state.initial}
                   </Text>
                    </View>
                      ) : (
                        <Image
                          style={styles.userProfileStyle}
                          source={{uri:itemInside.user.avatar}}
                        />
                      )}
                    </TouchableOpacity>

                    <View
                      style={{
                        flexDirection: 'column',
                        marginStart: 8,
                        marginTop: 10,
                      }}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 11,
                          color:
                            this.state.showDialogAlert == true
                              ? color.WHITE
                              : color.BLACK,
                        }}>
                        {itemInside.user.first_name} {itemInside.user.last_name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 9,
                          color:
                            this.state.showDialogAlert == true
                              ? '#D7D7D7'
                              : color.BLACK,
                        }}>
                        {itemInside.elapsed_time}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() =>
                        this._toggleBottomNavigationView(itemInside)
                      }
                      style={{
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                        width: '55%',
                      }}>
                      <Image
                        style={[styles.moreStyle, {tintColor: 'white'}]}
                        source={images.more_options}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={{height: '10%'}}>
                    <Text
                      style={{
                        marginHorizontal: 12,
                        marginTop: 12,
                        color:
                          this.state.showDialogAlert == true
                            ? '#C9C9C9'
                            : color.BLACK,
                      }}>
                      {' '}
                      {itemInside.content}
                    </Text>
                  </View>

                  <View style={{width: '100%', height: '70%'}}>
                   

              {itemInside.media_type && <VideoImageComponent 
              source={itemInside.media}   // Can be a URL or a local file.
              resizeMode="contain"
              videoImageStyle={{width: width, height: height*.60}}
              displayBackgroundColor={true}
              media_type={itemInside.media_type}
              mute={false}
              />}

                  </View>

                  <View
                    style={{
                      width: '100%',
                      height: '12%',
                    }}>
                    <View
                      style={{
                        width: '90%',
                        height: 0.5,
                        backgroundColor: 'gray',
                        top: 10,
                        marginHorizontal: 20,
                      }}></View>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        height: '100%',
                        top: 10,
                        backgroundColor: 'black',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '60%',
                          marginLeft: 10,
                        }}>
                        {itemInside.reactions.happy >= 1 ? (
                          <Text
                            style={{
                              color: 'white',
                              fontSize: 12,
                            }}>
                            {itemInside.reactions.happy}
                          </Text>
                        ) : null}
                        <TouchableOpacity
                          onPress={() => this.reactionApi('happy')}>
                          <Image
                            source={images.emojiHappy}
                            style={{height: 25, width: 25, margin: 5}}
                          />
                        </TouchableOpacity>

                        {itemInside.reactions.laugh >= 1 ? (
                          <Text
                            style={{
                              color: 'white',
                              fontSize: 12,
                            }}>
                            {itemInside.reactions.laugh}
                          </Text>
                        ) : null}
                        <TouchableOpacity
                          onPress={() => this.reactionApi('laugh')}>
                          <Image
                            source={images.emojiLaughing}
                            style={{height: 25, width: 25, margin: 5}}
                          />
                        </TouchableOpacity>

                        {itemInside.reactions.angry >= 1 ? (
                          <Text
                            style={{
                              color: 'white',
                              fontSize: 12,
                            }}>
                            {itemInside.reactions.angry}
                          </Text>
                        ) : null}

                        <TouchableOpacity
                          onPress={() => this.reactionApi('angry')}>
                          <Image
                            source={images.emojiAngry}
                            style={{height: 25, width: 25, margin: 5}}
                          />
                        </TouchableOpacity>
                        {itemInside.reactions.clap >= 1 ? (
                          <Text
                            style={{
                              color: 'white',
                              fontSize: 12,
                            }}>
                            {itemInside.reactions.clap}
                          </Text>
                        ) : null}
                        <TouchableOpacity
                          onPress={() => this.reactionApi('clap')}>
                          <Image
                            source={images.emojiClap}
                            style={{height: 25, width: 25, margin: 5}}
                          />
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          width: '30%',

                          justifyContent: 'space-between',
                        }}>
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',

                            width: '50%',
                          }}
                          disabled={
                            itemInside.allow_comments == true ? false : true
                          }
                          onPress={() => this.goCommentScreen(itemInside)}>
                          <Image
                            source={images.comments}
                            style={{height: 25, width: 25}}
                          />
                          <Text style={{color: 'white', left: 5}}>
                            {itemInside.comments.length}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',

                            width: '50%',
                          }}
                          disabled={
                            itemInside.allow_share == true ? false : true
                          }
                          onPress={() => this.goToShare()}>
                          <Image
                            resizeMode="contain"
                            source={images.share}
                            style={{height: 25, width: 25}}
                          />

                          {/* <Text style={{color: 'white', margin: 5}}>10</Text> */}
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
              
                </View>

                {/* <FlatList
                data={this.state.data}
                ItemSeparatorComponent={this.FlatListItemSeparator}
                renderItem={({item}) => this.StatusView(item)}
              /> */}
              </View>
            </View>
          </View>
        ) : null}

        {/* BottomSheet */}

        <BottomSheet
          visible={this.state.visible}
          onBackButtonPress={() => this._toggleBottomNavigationViewOff()}
          onBackdropPress={() => this._toggleBottomNavigationViewOff()}>
          <View
            style={[
              styles.bottomNavigationView,
              {height: this.state.userId == this.state.postUserId ? 345 : 250},
            ]}>
            {this.state.userId == this.state.postUserId ? (
              <View style={{height: '100%', width: '100%'}}>
                <View
                  style={{
                    height: '80%',
                    width: '100%',
                    backgroundColor: 'white',
                    borderRadius: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() => this.editPost(this.state.editPostItem)}
                    style={{
                      flexDirection: 'row',
                      height: '20%',
                      width: '100%',
                      alignItems: 'center',
                      borderBottomColor: 'grey',
                      borderBottomWidth: 0.2,
                    }}>
                    <Image
                      source={images.edit}
                      style={{
                        width: 20,
                        height: 20,
                        resizeMode: 'contain',
                        left: 10,
                      }}
                    />

                    <Text style={{left: 30, fontSize: 18, fontWeight: '400'}}>
                      Edit
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity

onPress={()=> this.turnOnOffComment()}
    style={{
      height: '20%',
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomColor: 'grey',
      borderBottomWidth: 0.2,
    }}>
    <Image
      source={images.Groupmsg}
      style={{
        width: 20,
        height: 20,
        resizeMode: 'contain',
        left: 10,
      }}
    />

   
      {
        this.state.commentTurn == true ?
        <Text style={{left: 30, fontSize: 18, fontWeight: '400'}}>
          Turn off comments
          </Text>
        :
        <Text style={{left: 30, fontSize: 18, fontWeight: '400'}}>
           Turn on comments
        </Text>
      }
      
 
  </TouchableOpacity>

  <TouchableOpacity

onPress={()=> this.turnOnOffShare()}
    style={{
      height: '20%',
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomColor: 'grey',
      borderBottomWidth: 0.2,
    }}>
    <Image
      source={images.share}
      style={{
        width: 20,
        height: 20,
        tintColor: 'gray',
        resizeMode: 'contain',
        left: 10,
      }}
    />

{
        this.state.shareTurn == true ?
        <Text style={{left: 30, fontSize: 18, fontWeight: '400'}}>
          Turn off sharing
          </Text>
        :
        <Text style={{left: 30, fontSize: 18, fontWeight: '400'}}>
           Turn on sharing
        </Text>
      }
  </TouchableOpacity>

  <TouchableOpacity
  onPress={()=> this.deletePost()}
    style={{
      height: '20%',
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomColor: 'grey',
      borderBottomWidth: 0.2,
    }}>
    <Image
      source={images.Vector}
      style={{
        width: 20,
        height: 20,
        resizeMode: 'contain',
        left: 10,
      }}
    />

    <Text
      style={{
        left: 30,
        fontSize: 18,
        justifyContent: 'flex-start',
        alignItems: 'center',
        fontWeight: '400',
      }}>
      Delete
    </Text>
  </TouchableOpacity>

                  <View
                    style={{
                      height: '20%',
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={images.copylink}
                      style={{
                        width: 20,
                        height: 20,
                        resizeMode: 'contain',
                        left: 10,
                      }}
                    />

                    <Text
                      style={{
                        left: 30,
                        fontSize: 18,
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        fontWeight: '400',
                      }}>
                      Copy Link
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => this._toggleBottomNavigationViewOff()}
                  style={{
                    height: '18%',
                    borderRadius: 10,
                    width: '100%',
                    backgroundColor: 'white',
                    marginTop: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{fontWeight: 'bold', fontSize: 20}}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{height: '100%', width: '100%'}}>
                <View
                  style={{
                    height: '70%',
                    width: '100%',
                    backgroundColor: 'white',
                    borderRadius: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() => this.hideApi()}
                    style={{
                      flexDirection: 'row',
                      height: '33%',
                      width: '100%',
                      alignItems: 'center',
                      borderBottomColor: 'grey',
                      borderBottomWidth: 0.2,
                    }}>
                    <Image
                      source={images.hide}
                      style={{
                        width: 20,
                        height: 20,
                        resizeMode: 'contain',
                        left: 10,
                      }}
                    />

                    <Text style={{left: 30, fontSize: 18, fontWeight: '400'}}>
                      Hide
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => this.unfriendApi()}
                    style={{
                      height: '34%',
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderBottomColor: 'grey',
                      borderBottomWidth: 0.2,
                    }}>
                    <Image
                      source={images.unfriend}
                      style={{
                        width: 20,
                        height: 20,
                        resizeMode: 'contain',
                        left: 10,
                      }}
                    />

                    <Text style={{left: 30, fontSize: 18, fontWeight: '400'}}>
                      Unfriend
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      height: '33%',
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={images.copylink}
                      style={{
                        width: 20,
                        height: 20,
                        resizeMode: 'contain',
                        left: 10,
                      }}
                    />

                    <Text
                      style={{
                        left: 30,
                        fontSize: 18,
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        fontWeight: '400',
                      }}>
                      Copy Link
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => this._toggleBottomNavigationViewOff()}
                  style={{
                    height: '22%',
                    borderRadius: 10,
                    width: '100%',
                    backgroundColor: 'white',
                    marginTop: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{fontWeight: 'bold', fontSize: 20}}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </BottomSheet>

{/* Stoiy View */}

<BottomSheet
          visible={this.state.storyVisibleModal}
          onBackButtonPress={() => this.closestoryModal()}
          onBackdropPress={() => this.closestoryModal()}>
  
  {storyVisible && (<View style={{height: '100%', width: '100%'}}>
   
              <View style={styles.storyHeader}>
             <View style={{width : width,
            top:Platform.OS == "android" ? 0:19,
                flexDirection : "row"
               }}>
{
  storyVisible && this.state.storyDetail.mediaArray.map((item, index)=>{
    console.log('checkProfile>>>>',this.state.storyDetail.mediaArray.length)
    return(
      // <SafeAreaView style={{height:'100%'}}>
      <ProgressBar 
                  filled={ substoryIndex > index ? true: false} 
                  innerStyle={{width :""+ (100/this.state.storyDetail.mediaArray.length)+"%"}}
                  onRef={(ref) => {
                    this["progressBar"+ index] = ref;
                }}
                  onEnd={()=>this.changeModalItems(((this.state.storyDetail.mediaArray.length-1) == substoryIndex) ? storyIndex+1: storyIndex, ((this.state.storyDetail.mediaArray.length-1) == substoryIndex) ? 0: substoryIndex+1)}/>
    // </SafeAreaView>
    )
  })
  
}



         
             </View>
                
              <View  
                style={[styles.flexDirectionRow,styles.justifyContentBetween, styles.paddingRow]}  
            >  
               <View  style={[styles.flexDirectionRow]}>

               <Image source={images.dummyPerson} style={styles.videoImageIcon} />
      

              <View> 
              <Text style={styles.whiteText}>{storyDetail.mediaArray[substoryIndex].user.first_name + " " + storyDetail.mediaArray[substoryIndex].user.last_name}</Text>
              <Text style={styles.whiteText}>{storyDetail.mediaArray[substoryIndex].elapsed_time}</Text>

              </View>  
              </View>
              <View  style={[styles.flexDirectionRow]}>
                     <TouchableOpacity
                onPress={() => this.closestoryModal()}
                style={{
                //  alignItems: 'flex-end',
                //   backgroundColor: color.TRANSPARENT,
                //   height: '10%',
                }}>
                <Image
                  style={{
                    width: 18,
                    height: 18,
                    tintColor: 'white',
                    marginRight: 16,
                    marginTop: 5,
                  }}
                  source={images.delete_icon}
                />
              </TouchableOpacity>
              </View>  
              </View>  
              </View>
              

              {storyDetail.mediaArray[substoryIndex] && <VideoImageComponent 
              source={storyDetail.mediaArray[substoryIndex].media}   // Can be a URL or a local file.
              resizeMode="cover"
              videoImageStyle={{width: width, height: height*.90}}
              displayBackgroundColor={true}
              media_type={"image"}
              mute={false}
              controlLoader={(val)=>{
                console.log("valvalvalval",val)
                if(!val){
                   this['progressBar'+ substoryIndex].onAnimate()
                }
               
              }}
              />}
              {
                this.state.indexNoView == 0 ? 
                <TouchableOpacity style={styles.noViewersTextContainer} onPress={()=>{
                 
                  this.closestoryModal()
                  this.props.navigation.navigate('Viewers',{
                    storyAPI: ()=>{this.storyAPI(false)}
                  });
            }}>
         
              <Image style={styles.iconStyle} source={images.showEye} />
             <View>
              <Text style={styles.noViewers}>
                No Viewers yet
              </Text> 
             </View>  
             </TouchableOpacity>
             :
             null
              }
              

                  </View>)}
 
  </BottomSheet>
     

     
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
    height: 20,
    width: 20,
  },

  videoStyle: {
    height: 20,
    width: 20,
  },
  moreStyle: {
    height: 15,
    width: 15
  },
  userProfileStyle: {
    height: 30,
    width: 29,
    borderWidth: 1,
    borderColor: 'white',
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  bottomNavigationView: {
    width: '95%',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  VideoStyle: {
    width: '90%',
    height: 250,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  storyHeader: {
    backgroundColor : "black",
    height: height*.12
  },
  whiteText : {
    color:"white"
  },
  flexDirectionRow: {
    marginTop:5,
    flexDirection: "row",
  },
  justifyContentBetween: {
    justifyContent: "space-between"
  },
  paddingRow: {
   padding: width*.05
  },
  flex1 : {
    flex: 1
  },
  videoImageIcon : {
    width: width*.10, 
    height: width*.10, 
    marginRight: width*.03
  },
  noViewers:{
    paddingLeft: width*.03,
    color:"white",
    fontSize : width*.04
  },

  noViewersTextContainer: {
    position: "absolute",
    bottom: width*.10,
    flexDirection : "row"
  },
  story_View: {
    height: '20%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyLoader: {
    position : "absolute",
    top: "50%",
    left: "50%",
    justifyContent: 'center',
    alignItems: 'center',

  },
  iconStyle: {
    marginLeft: width*.03,
    height: width * .05,
    width: width * .05,
},

});
