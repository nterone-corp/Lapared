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
  RefreshControl,
  Alert,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  BackHandler,
  Dimensions
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
const { height, width } = Dimensions.get("window");

export default class NewFeeds extends React.Component {
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
      postIdHide: '',
      data: [],
      initial:'',
      moreOptions: false,
      postId: '',
      community_id: ''
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    const {navigation} = props;

    this.didFocusListener = navigation.addListener(
      'didFocus',
      this.componentDidFocus,
    );

    this.props.navigation.addListener('willFocus', () => {
      this.homeAPI();
    });
    //Settin up an interval for the counter
    // this.t = setInterval(() => {
    //   this.setState({ count: this.state.count + 1 });
    // }, 1000);
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
    // console.log('itemuserId>>>>>>>>',item)

    this.setState({visible: false});
  }

  componentDidUpdate(prevProps) {
    if (prevProps.response.response !== this.props.response.response) {
      var postData = this.props.response.response.data;
      console.log('PostData>>>>>>>>', postData);
      console.log('PostDataID>>>>>>>>', postData);
      this.setState({
        data: postData,
      });
    }
  }

  componentDidFocus() {
    // const { params } = payload.action;
    this.homeAPI();
    console.log('componentDidFocus');
  }

  componentWillMount() {
    console.log('componentWillMount');
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  componentWillUnmount() {
    // Remove the event listener before removing the screen from the stack
    // this.focusListener.remove();
    // clearTimeout(this.t);

    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
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
  statusfeedsss() {
    this.props.navigation.navigate('Story');
  }

  storiesfeedsss() {
    this.props.navigation.goBack();
  }
  goToShare() {
    this.props.navigation.navigate('Share', {item: this.state.itemInside});
  }
  setStateChange(item) {
    console.log('itemInside>>>>>>>', item);
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
    
    this.setState({
      showDialogAlert: false,
      
    });
  }

  
  goToSearch() {
    this.props.navigation.navigate('Search');
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

  componentDidMount() {
    console.log('componentDidMount');
    const {navigation} = this.props;
  
    this.homeAPI();
    this.getProfile();
  }

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

    var userProfile = this.props.responseGetProfile.response.id;

    console.log('userid>>>>>>>>', userProfile.id);
    this.setState({userId: userProfile});
  }

  // hide api /////////////////////////////////
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
// Turn On/off Comments///////////
turnOnOffComment(){
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


  homeAPI() {
    // setConfiguration('Token', '');
    this.props
      .getHomeAPI()
      .then(
        () => this.afterCallingHomeAPI(),
        // {setRefreshing(false)
        // setDataSource(this.afterCallingHomeAPI());}
      )
      .catch((e) => this.showAlert(e.message, 300));
  }

  afterCallingHomeAPI() {
    console.log('isBusy value --- ', this.props.isBusy);
    console.log('response value home --- ', this.props.response);

    var postData = this.props.response.response.data;
    console.log('PostData>>>>>>>>', postData);
    console.log('PostDataID>>>>>>>>', postData);
    // var dataPO = postData.slice(0, 10);
    // this.setState({
    //   data: dataPO,
    // });
     this.setState({
      data: postData,
    });
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
   

  FlatListItemSeparator = () => {
    return (
      //Item Separator
      <View
        style={{
          height: 0.5,
          width: '96%',
          alignSelf:'center',
          marginVertical: 12,
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  }; 

  StatusView(item, index) {
    console.log('item>>>', item);
    // this.setState({postId:item.id})
    var first_name = item.user.first_name

    var initials= first_name.substring(0,1)
    return (
      <TouchableOpacity
        onPress={() => this.setStateChange(item)}
        style={{flexDirection: 'column', backgroundColor: 'white',left:10,bottom:15}}>
        {item.media != null ? (
          <View>
            <View style={{flexDirection: 'row'}}>
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

              <View style={{flexDirection: 'column', marginStart: 8, width: '35%',}}>
                <Text
                  style={{fontWeight: 'bold', fontSize: 11, color: 'black'}}>
                  {item.user.first_name} {item.user.last_name}
                </Text>
                <Text style={{fontSize: 9,color:'gray'}}>{item.elapsed_time} </Text>
              </View>
            
              <TouchableOpacity
                onPress={() => this._toggleBottomNavigationView(item)}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '85%',
                }}>
                <Image style={styles.moreStyle} source={images.more_options} />
              </TouchableOpacity>
            </View>
           
            <View>
            {item.community != null ? (
                 <View
                 style={{
                   top: 7,
                   width: '40%',
                   justifyContent: 'flex-start',
                   alignSelf: 'flex-start',
                 }}>
                 <Text
                   style={{
                     fontSize: 10,
                     color: 'white',
                     backgroundColor: color.RED,
                     padding: 2,
                     alignSelf: 'flex-start',
                     borderRadius: 5,
                   }}>
                   {item.community.name}
                 </Text>
               </View>
              ) : null}
              <Text
                style={{     
                  marginTop: 8,
                }}>{item.content}</Text>

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
            <View style={{flexDirection: 'row'}}>
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

              <View style={{flexDirection: 'column', marginStart: 8,width:'35%'}}>
                <Text
                  style={{fontWeight: 'bold', fontSize: 11, color: 'black'}}>
                  {item.user.first_name} {item.user.last_name}
                </Text>
                <Text style={{fontSize: 9,color:'gray'}}>{item.elapsed_time} </Text>
              </View>
              
              <TouchableOpacity
                onPress={() => this._toggleBottomNavigationView(item)}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '85%',
                }}>
                <Image style={styles.moreStyle} source={images.more_options} />
              </TouchableOpacity>
            </View>

            <View>
            {item.community != null ? (
                 <View
                 style={{
                   top: 7,
                   width: '40%',
                   justifyContent: 'flex-start',
                   alignSelf: 'flex-start',
                 }}>
                 <Text
                   style={{
                     fontSize: 10,
                     color: 'white',
                     backgroundColor: color.RED,
                     padding: 2,
                     alignSelf: 'flex-start',
                     borderRadius: 5,
                   }}>
                   {item.community.name}
                 </Text>
               </View>
              ) : null}
              <Text
                style={{marginTop: 12, color: 'black'}}>{item.content}</Text>
             
            </View>
          </View>
        )}
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
   
    // create api.
    const api = create({
      baseURL: apiRoot,
     
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
    console.log("onEndonEndonEndonEndonEnd",onEnd)
   }
  render() {
    const {itemInside, react} = this.state;

    console.log('itemInside>>>>>>', this.state.itemInside);
  
    return (
      <SafeAreaView style={{flex:1,backgroundColor: color.RED,marginBottom:10}}>
      <View style={{flex: 1, backgroundColor: color.WHITE}}>
          <StatusBar
            hidden={false}
            backgroundColor={'#BD2026'}
            barStyle="light-content"
            
        />
        <View
          style={{height: Platform.OS == "android" ? '15%' : '18%', width: '100%', backgroundColor: color.RED}}>
          <View style={{flex: 0.5, flexDirection: 'row'}}>
            <View
              style={{
                flex: 0.15,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={styles.notificationStyle}
                source={images.notification}
              />
            </View>

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
            <View
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
            </View>

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


        <View style={{backgroundColor: color.WHITE}}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={()=> this.statusfeedsss()}
            style={{flex: 0.5, marginLeft: 14, marginTop: 10}}>
            <Image
              style={{height: 38, width: 38}}
              source={images.right_arrow}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={()=> this.storiesfeedsss()}
            style={{
              flex: 0.5,
              alignItems: 'flex-end',
              marginRight: 14,
              marginTop: 10,
            }}>
            <Image
              style={{
                height: 38,
                width: 38,
                alignItems: 'flex-end',
                justifyContent: 'space-between',
              }}
              source={images.right_arrow}
            />
          </TouchableOpacity>
        </View>
      </View>
   
          {/* <MainViewPro
            statusfeeds={() => this.statusfeedsss()}
            storiesfeeds={() => this.storiesfeedsss()}
          /> */}

          <View style={{flex: 0.95, marginTop: 16, flexDirection: 'row'}}>
           
          
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
                  renderItem={({item, index}) => this.StatusView(item, index)}
                />
              )}
              
            
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
                        }}>{itemInside.elapsed_time}
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
                        marginHorizontal:12,
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
                    {/* <Image
                    style={{width: '100%', height: '50%'}}
                    source={images.building}
                  /> */}

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
                      height: '10%',
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
                            itemInside.allow_share == true ? false : true
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

                            width: '55%',
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

        {/* {
          this.state.moreOptions == false ?
          <View style={{backgroundColor:color.TRANSPARENTView,height:'100%',width:'100%',position:'absolute'}}>
            <View style={{height:'60%',width:'100%'}}>

              </View>
            <View style={{height:'25%',width:'95%',backgroundColor:'white',margin:10,borderRadius:10}}>

              </View>
            <View style={{height:'15%',width:'95%',backgroundColor:'white',margin:10,borderRadius:10}}>

              </View>
            </View>
            :
           null
        } */}
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
    width: 15,
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
    width: '95%',
    height: 224,
    alignItems: 'center',
    
    marginTop: 12,
  }
});
