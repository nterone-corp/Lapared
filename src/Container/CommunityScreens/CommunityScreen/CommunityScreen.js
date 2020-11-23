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
  TouchableOpacity,
  Image,
  onPress,
  View,
  Text,
  FlatList,
  Dimensions,
  StatusBar,
  Alert,
  BackHandler,
  ActivityIndicator,
  ImageBackground,
  Platform
} from 'react-native';
import color from '../../common/colors';
import commonData from '../../common/data';
import images from '../../common/images';
import Activity from '../../common/ActivityIndicator';
import {create} from 'apisauce';
import {getConfiguration, setConfiguration} from '../../../utils/configuration';
import {BottomSheet} from 'react-native-btr';
import Video from 'react-native-video';
import VideoImageComponent from '../../../Components/common/VideoImageComponent';
import ProgressBar from "../../../Components/common/ProgressBar"
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import data from '../../common/data';

const {height, width} = Dimensions.get('window');
export default class CommunityScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mystoriesData: [],
      mystatusData: [],
      mediaImageData: [],
      mediaVideoData: [],
      visible: false,
      Show: 0,
      loader: false,
      pictureViewShow: false,
      VideoViewShow: false,
      TaggedViewShow: false,
      settingView: false,
      communityIDPost: 0,
      userId: '',
      commColorRed: false,
      commentTurn: false,
      shareTurn: false,
      editPostItem: '',
      isBusy: false,
      reactiondata: [],
      showDialogAlert: false,
      itemInside: '',
      postId: '',
      initial: '',
      data: [],
      mystories: [],
      moreOptions: false,
      ShowImageVideo:false,
      typeImage:'',
      bigImageVideo:'',
      storyVisible: false,
      storyVisibleModal: false,
      storyDetail: null,
      progressStatus: 0,
      storyIndex: 0,
      substoryIndex:0,
      // isFetching:false
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.openStoryModal = this.openStoryModal.bind(this);
    this.storyAPI= this.storyAPI.bind(this);

  }

  controlLoader(loader) {
    let {controlLoader} = this.props;
    this.setState({loader});
    if (controlLoader) {
      controlLoader(loader);
    }
  }

  componentDidMount() {
    this.postingAsAPI();
    this.getProfile();
    this.storyAPI();
  }
  // onRefresh = () => {
  //   this.setState({isFetching: true}, () => this.postingAsAPI());
  // };

  closestoryModal() {
    const {substoryIndex, storyIndex} = this.state;
    this.setState({storyVisible: false , storyVisibleModal: false})
    // onEnd={()=>this.changeModalItems(((this.state.storyDetail.mediaArray.length-1) == substoryIndex) ? storyIndex+1: storyIndex, ((this.state.storyDetail.mediaArray.length-1) == substoryIndex) ? 0: substoryIndex+1)}/>
  }
  
  openStoryModal(index) {
    let context = this;
    this.setState({storyVisibleModal: true})
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

  handleBackButtonClick = () => {
    if (this.state.showDialogAlert) {
      this.setState({showDialogAlert: false});
      return true;
    } else {
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

  componentDidUpdate(prevProps) {
    console.log('kllklklklklklkkllllkl', this.props.responsePostingAs);

    if (prevProps.responsePostingAs != this.props.responsePostingAs) {

      var postingData = this.props.responsePostingAs.responsePostingAs;
      console.log('posting dat>>>>>>>>>>>', postingData);
      var temp = [];

      if (postingData != undefined) {

        for (var i = 0; i < postingData.length; i++) {
          var obj = postingData[i];
          temp.push({postingData: obj, selected: false});
        }

        if (postingData[0] != undefined) {
          if (this.state.communityIDPost == '') {
            this.setState({
              communityIDPost: postingData[0].id,
            });
          }
        }


        this.setState({
          mystoriesData: temp,
        });
      }

      this.getCommunityPost();
      // this.storyAPI();
    }

  }

  // shouldComponentUpdate(nextProps,nextState){
  //   console.log('hellloooooooo')
  //   if(nextProps.responsePostingAs.postingData == this.props.responsePostingAs.postingData){
  //     return true;
  //   }else{
  //     return false;
  //   }
  // }

  storyAPI() {
    console.log('communityPostStories>>>>>>>>', this.state.communityIDPost);

    var apiRoot = getConfiguration('API_ROOT');

    var acces_token = getConfiguration('Token');
    // var customerid = getConfiguration('user_id');
    // create api.
    const api = create({
      baseURL: apiRoot,
      // headers: { 'Content-Type': 'multipart/form-data', },
      headers: {Authorization: 'Bearer ' + acces_token},
    });

    console.log('api>>>>>>>', api);
    // https://api.lapared.com/api/v1/user/stories?community_id=8
    api
      .get('/user/stories?community_id=' + this.state.communityIDPost + '', {})
      .then((res) => this.afterCallingStoriesAPI(res));
  }

  
  afterCallingStoriesAPI(res) {

    console.log('Stories>>>>>>>>>', res);
    console.log('StoriesData>>>>>>>>>', res.data);
    var postData = res.data
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
  //  var otup = output.slice(0, 10)
  //  this.setState({
  //    mystories: otup,
  //  });
  this.setState({
    mystories:output
  })

  }




  goToNotification() {
    this.props.navigation.navigate('Notification');
    this.setState({
      showDialogAlert: false,
    });
  }
  goToProfile() {
    this.props.navigation.navigate('Profile');
    this.setState({
      showDialogAlert: false,
    });
  }

  goToSearch() {
    this.props.navigation.navigate('Search');
  }

  communityFeed() {
    this.setState({Show: 0});
  }
  pictureView() {
    this.setState({Show: 1});
    this.getImage();
  }
  VideoView() {
    this.setState({Show: 2});
    this.getVideo();
  }
  TaggedView() {
    this.setState({Show: 3});
  }
  createCommunityScreen() {
    this.props.navigation.navigate('CreateCommunityScreen');
  }
  settingScreen(item) {
    this.props.navigation.navigate('CommunitySetting', {item, item});
  }

  goToShare(item) {
    this.props.navigation.navigate('Share', {item: item});
    this.setState({
      showDialogAlert: false,
    });
  }

  FlatListItemSeparator = () => {
    return (
      //Item Separator
      <View
        style={{
          height: 0.5,
          width: '100%',
          alignSelf: 'center',
          marginVertical: 12,
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };

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

  // CommunityShow in stories View/////////////////
  postingAsAPI() {
    // setConfiguration('Token', '');
    this.props
      .PostingAsAPI()
      .then(() => this.afterCallingPostingAsAPI())
      .catch((e) => this.afterErrorHomeApi(e));
  }

  afterCallingPostingAsAPI() {
    console.log('isBusy value --- ', this.props.isBusy);
    console.log('response value PostingAs --- ', this.props.responsePostingAs);
    var postingData = this.props.responsePostingAs.responsePostingAs;
    var temp = [];
    for (var i = 0; i < postingData.length; i++) {
      var obj = postingData[i];
      temp.push({postingData: obj, selected: false});
    }
    console.log('setstate___is donein ifffpppppppp',postingData[0].id)
    if (postingData[0] != undefined) {
      console.log('setstate___is donein ifff',postingData[0].id)
      if (this.state.communityIDPost == '') {
        console.log('setstate___is done',postingData[0].id)
        this.setState({
          communityIDPost: postingData[0].id,
        });
      }
    }

    this.setState({
      mystoriesData: temp,
    });
    this.getCommunityPost();
    this.storyAPI();
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

  showAlert(message, duration) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      alert(message);
    }, duration);
  }

  settingShow(item) {
    console.log('posssss>>>>>>', item);
    var data = this.state.mystoriesData;
    var temp = [];
    for (var i = 0; i < data.length; i++) {
      var obj = data[i];
      console.log('obj>>>>>>>', obj);
      console.log('objpostingData>>>>>>>', obj.postingData);
      if (obj.postingData.id == item.postingData.id) {
        if (item.selected == true) {
          temp.push({postingData: obj.postingData, selected: false});
        } else {
          temp.push({postingData: obj.postingData, selected: true});
        }
      } else {
        temp.push({postingData: obj.postingData, selected: false});
      }
    }

    this.setState({communityIDPost: item.postingData.id, mystoriesData: temp});
    this.getCommunityPost();
    this.storyAPI();
  }

  communityShowPost(item) {
    this.setState({communityIDPost: item.postingData.id});
    this.getCommunityPost();
    this.storyAPI();
  }

  goToaddmember(item) {
    this.props.navigation.navigate('AddMember', {item, item});
  }
  seeAllMember(item) {
    // alert("jhkjkk")
    this.props.navigation.navigate('SeeAllMember', {item, item});
  }
  ///////////// Get Community Post //////////////////////

  getCommunityPost() {
    // console.log('postdtttttttt>>>>>>>>>>>>>>>>>',postingDa)
    console.log('communityPost>>>>>>>>', this.state.communityIDPost);

    var apiRoot = getConfiguration('API_ROOT');

    var acces_token = getConfiguration('Token');
    // var customerid = getConfiguration('user_id');
    // create api.
    const api = create({
      baseURL: apiRoot,
      // headers: { 'Content-Type': 'multipart/form-data', },
      headers: {Authorization: 'Bearer ' + acces_token},
    });

    console.log('api>>>>>>>', api);

    // api
    //   .get('/communities/' + this.state.communityIDPost + '/posts', {})
    //   .then((res) => this.afterPostget(res));
    api
    .get('/posts?community_id=' + this.state.communityIDPost + '', {})
    .then((res) => this.afterPostget(res));
  }

  afterPostget(res) {
    console.log('upload post succes======', res);
    console.log('response value getCommunity --- ', res.data.data);

    var datagetpost = res.data.data;
  this.setState({mystatusData: datagetpost})
    // var dataget = datagetpost.slice(0, 10)
    // this.setState({mystatusData: dataget});
  }

  // image and video //////////////////////

  getImage() {
    console.log('communityPost>>>>>>>>', this.state.communityIDPost);

    var apiRoot = getConfiguration('API_ROOT');

    var acces_token = getConfiguration('Token');

    // create api.
    const api = create({
      baseURL: apiRoot,
      // headers: { 'Content-Type': 'multipart/form-data', },
      headers: {Authorization: 'Bearer ' + acces_token},
    });

    console.log('api>>>>>>>', api);
    // https://api.lapared.com/api/v1/communities/8/all_media?media_type=videos

    api
      .get(
        '/communities/' +
          this.state.communityIDPost +
          '/all_media?media_type=pictures',
        {},
      )
      .then((res) => this.afterImage(res));
  }

  afterImage(res) {
    console.log('upload post succes======', res);
    console.log('response value getimagevideo --- ', res.data);

    var datagetpost = res.data;

    this.setState({mediaImageData: datagetpost});
  }

  //////////////////////////////////////////

  getVideo() {
    console.log('communityPost>>>>>>>>', this.state.communityIDPost);

    var apiRoot = getConfiguration('API_ROOT');

    var acces_token = getConfiguration('Token');

    // create api.
    const api = create({
      baseURL: apiRoot,
      // headers: { 'Content-Type': 'multipart/form-data', },
      headers: {Authorization: 'Bearer ' + acces_token},
    });

    console.log('api>>>>>>>', api);
    // https://api.lapared.com/api/v1/communities/8/all_media?media_type=videos

    api
      .get(
        '/communities/' +
          this.state.communityIDPost +
          '/all_media?media_type=videos',
        {},
      )
      .then((res) => this.afterVideo(res));
  }

  afterVideo(res) {
    console.log('upload post succes======', res);
    console.log('response value getimagevideo --- ', res.data);

    var datagetpost = res.data;

    this.setState({mediaVideoData: datagetpost});
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

  _toggleBottomNavigationView(item) {
    console.log('itemmmmmmmmmmm>>>>>>>>', item);
    //  this.setStateChange()
    this.setState({
      visible: true,
      postUserId: item.user.id,
      postIdHide: item.id,
      editPostItem: item,
      commentTurn: item.allow_comments,
      shareTurn: item.allow_share,
    });
  }
  _toggleBottomNavigationViewOff() {
    this.setState({visible: false});
  }

  goToCreatePost(item) {
    this.props.navigation.navigate('CreatePost', {go: item});
  }
  editPost(item) {
    // console.log('itemPOst>>>>>>>>>>', item);
    this.props.navigation.navigate('CreateUpdatePost', {itempost: item});
    this._toggleBottomNavigationViewOff();
  }
  // Reaction post
  reactionApi(item, name) {
    console.log('itemmrtrtrtrtmm>>>>>>', item);
    // console.log('postIdddddddd>>>>>>',this.state.postId.id)
    this.setState({postId: item});

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
        user_id: item.user.id,
        community_id: this.state.communityIDPost,
      },
    };
    console.log('apiPOstId>>>>', item.id);
    api
      .put('/reactions/' + item.id + '', JSON.stringify(details), {})
      .then((res) => this.afterReactions(res));
  }

  afterReactions(res) {
    console.log('upload share succes======', res);
    console.log('response value PostReaction --- ', res.data);
    var react = res.data;

    this.setState({itemInside: react});
    this.reactionGetApi();
    this.postingAsAPI();
  }
  // Turn On/off Comments///////////
  turnOnOffComment() {
    console.log('commentTurn>>>>>>', this.state.commentTurn);
    console.log('postId>>>>>>', this.state.postIdHide);
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
    if (this.state.commentTurn == true) {
      let details = {
        allow_comments: false,
        community_id: this.state.communityIDPost,
      };
      api
        .put('/posts/' + this.state.postIdHide + '', details)
        .then((res) => this.afterturncomment(res));
    } else {
      let details = {
        allow_comments: true,
        community_id: this.state.communityIDPost,
      };
      api
        .put('/posts/' + this.state.postIdHide + '', details)
        .then((res) => this.afterturncomment(res));
    }
  }

  afterturncomment(res) {
    console.log('upload rply succes======', res);
    console.log('response value comments --- ', res.data);
    this.postingAsAPI();
    this._toggleBottomNavigationViewOff();
  }

  // Turn On/off Share///////////
  turnOnOffShare() {
    console.log('ShearTurn>>>>>>>>', this.state.shareTurn);
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
    if (this.state.shareTurn == true) {
      let details = {
        allow_share: false,
        community_id: this.state.communityIDPost,
      };
      api
        .put('/posts/' + this.state.postIdHide + '', details)
        .then((res) => this.afterturncomment(res));
    } else {
      let details = {
        allow_share: true,
        community_id: this.state.communityIDPost,
      };
      api
        .put('/posts/' + this.state.postIdHide + '', details)
        .then((res) => this.afterturncomment(res));
    }
  }
  // Delete post///////////////////

  deletePost() {
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
      .delete('/posts/' + this.state.postIdHide + '')
      .then((res) => this.afterturncomment(res));
  }

   // hide api /////////////////////////////////
   hideApi() {
    this._toggleBottomNavigationViewOff();
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
    this.postingAsAPI();
    this._toggleBottomNavigationViewOff();
    // this.props.navigation.navigate('HomeTab')

    // this.setState({data:res.data})
  }

  unfriendApi() {
    this._toggleBottomNavigationViewOff();
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
    this.postingAsAPI();
    this._toggleBottomNavigationViewOff();
    Toast.show('Contact removed successfully.');
    // this.props.navigation.navigate('HomeTab')

    // this.setState({data:res.data})
  }



  story_ViewScreen(item, index) {
    console.log('iinnnnnnnn', item.postingData);
    return (
      <View style={{paddingRight: 10, left: 10}}>
        {item.postingData != undefined ? (
          <TouchableOpacity
            onPress={() => this.communityShowPost(item)}
            style={{
              width: 100,
              height: 150,
              justifyContent: 'center',
              alignItems: 'flex-end',
              borderWidth: 3,
              borderColor: 'white',
              borderTopRightRadius: 20,
              borderBottomLeftRadius: 20,
            }}>
{this.state.loader && (
          <View
            style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',

                opacity: 0.5,
              },
              this.props.displayBackgroundColor && {backgroundColor: 'grey'},
            ]}>
            <ActivityIndicator size="large" color={color.RED_BUTTON} />


          </View>
        )}

              {item.postingData.cover != null ?   
             
                <Image
              source={{uri:item.postingData.cover}}
              resizeMode="stretch"
              onLoadStart={() => this.controlLoader(true)}
          onLoad={() => this.controlLoader(false)}
              style={{
                borderTopRightRadius:70,
                borderBottomLeftRadius:70,
                width: '100%',
                height: '100%',
                position: 'absolute',
                alignSelf: 'center',
              }}
            />
              
            
           
          :
          <Image
          source={images.dummyCommunityStories}
          resizeMode="stretch"
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            alignSelf: 'center',
          }}
        />
        }
           {item.postingData.cover == null ?  <Image
              source={images.post_photo}
              style={{
                alignSelf: 'center',
                position: 'absolute',
                height: 25,
                width: 25,
                tintColor: 'black',
              }}
            />
          :
          null}
           
            <Text
              style={{
                color: 'white',
                alignSelf: 'flex-start',
                bottom: 10,
                left: 8,
                position: 'absolute',
                fontSize: 12,
                width: '90%',
              }}>
              {item.postingData.name}
            </Text>
            <View
              style={{
                flexDirection: 'column',
                height: '85%',
                width: '25%',
                right: 15,
              }}>
              {item.selected == true ? (
                <View
                  style={{
                    height: '80%',
                    top: 28,
                    position: 'absolute',
                    borderBottomEndRadius: 20,
                    borderBottomLeftRadius: 20,
                    width: '100%',
                  }}>
                  <ImageBackground
                    style={{height: '100%', width: '100%'}}
                    source={images.communityStoryBack}>
                    <TouchableOpacity
                      onPress={() => this.seeAllMember(item.postingData)}
                      style={[styles.story_View, {marginVertical: 4, top: 5}]}>
                      <Image
                        style={{height: 18, width: 18}}
                        source={images.profile}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => this.goToaddmember(item.postingData)}
                      style={[styles.story_View, {top: 4}]}>
                      <Image
                        style={{height: 18, width: 18}}
                        source={images.addfriend}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                    onPress={()=>  this.openStoryModal(0)}
                    style={[styles.story_View, {top: 6}]}>
                      <Image
                        style={{height: 18, width: 18}}
                        source={images.visibilitygroup}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => this.settingScreen(item.postingData)}
                      style={[styles.story_View, {top: 8}]}>
                      <Image
                        style={{height: 18, width: 18}}
                        source={images.setting}
                      />
                    </TouchableOpacity>
                  </ImageBackground>
                </View>
              ) : null}

              <TouchableOpacity
                onPress={() => this.settingShow(item)}
                style={{height: '24%', width: '100%'}}>
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
            {this.props.isBusy ? <Activity /> : null}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
          onPress={() => this.communityShowPost(item)}
            style={{
              width: 100,
              height: 150,
              justifyContent: 'center',
              alignItems: 'flex-end',
              borderWidth: 3,
              borderColor: 'white',
              borderTopRightRadius: 20,
              borderBottomLeftRadius: 20,
            }}>
            <Image
              source={images.dummyCommunityStories}
              resizeMode="stretch"
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                alignSelf: 'center',
              }}
            />
            <Image
              source={images.post_photo}
              style={{
                alignSelf: 'center',
                position: 'absolute',
                height: 25,
                width: 25,
                tintColor: 'black',
              }}
            />
            <Text
              style={{
                color: 'white',
                alignSelf: 'flex-start',
                bottom: 10,
                left: 8,
                position: 'absolute',
                fontSize: 12,
                width: '90%',
              }}>
              {item.name}
            </Text>
            <View
              style={{
                flexDirection: 'column',
                height: '85%',
                width: '25%',
                right: 15,
              }}>
              {item.selected == true ? (
                <View
                  style={{
                    height: '80%',
                    top: 28,
                    position: 'absolute',
                    borderBottomEndRadius: 20,
                    borderBottomLeftRadius: 20,
                    width: '100%',
                  }}>
                  <ImageBackground
                    style={{height: '100%', width: '100%'}}
                    source={images.communityStoryBack}>
                    <TouchableOpacity
                      onPress={() => this.seeAllMember(item)}
                      style={[styles.story_View, {marginVertical: 4, top: 5}]}>
                      <Image
                        style={{height: 18, width: 18}}
                        source={images.profile}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => this.goToaddmember(item)}
                      style={[styles.story_View, {top: 4}]}>
                      <Image
                        style={{height: 18, width: 18}}
                        source={images.addfriend}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.story_View, {top: 6}]}>
                      <Image
                        style={{height: 18, width: 18}}
                        source={images.visibilitygroup}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => this.settingScreen(item)}
                      style={[styles.story_View, {top: 8}]}>
                      <Image
                        style={{height: 18, width: 18}}
                        source={images.setting}
                      />
                    </TouchableOpacity>
                  </ImageBackground>
                </View>
              ) : null}

              <TouchableOpacity
                onPress={() => this.settingShow(item)}
                style={{height: '24%', width: '100%'}}>
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
            {this.props.isBusy ? <Activity /> : null}
          </TouchableOpacity>
        )}
      </View>
    );
  }

  setStateChange(item) {
    console.log('itemInside>>>>>>>', item);
    var first_nam = item.user.first_name;
    var initial = first_nam.substring(0, 1);
    this.setState({
      showDialogAlert: true,
      itemInside: item,
      postId: item,
      initial: initial,
    });
  }

  setStateChangee() {
    // console.log('itemInside>>>>>>>', item);

    this.setState({
      showDialogAlert: false,
    });
  }

  setStateChangeImage() {
    this.setState({
      ShowImageVideo: false,
    });
  }

  statusViewScreen(item) {
    var first_name = item.user.first_name;

    var initials = first_name.substring(0, 1);
    console.log('itemStatus>>>>>>>', item);
    return (
      <View>
        <TouchableOpacity
          onPress={() => this.setStateChange(item)}
          style={{width: '100%', alignSelf: 'center'}}>
          <View style={{height: 45, flexDirection: 'row', left: 10}}>
            <View
              style={{
                height: '100%',
                flexDirection: 'row',
                top: 7,
              }}>
              <TouchableOpacity
                // onPress={() => this.setStateChange()}
                style={{
                  alignItems: 'center',
                }}>
                {item.user.avatar == null ? (
                  <View
                    style={{
                      height: 35,
                      width: 35,
                      backgroundColor: 'gray',
                      borderBottomLeftRadius: 10,
                      borderTopRightRadius: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{fontSize: 18}}>{initials}</Text>
                  </View>
                ) : (
                  <Image
                    style={styles.userProfileStyle}
                    source={{uri: item.user.avatar}}
                  />
                )}
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text style={{left: 5}}>
                  {item.user.first_name} {item.user.last_name}{' '}
                </Text>
                <Text style={{left: 5, fontSize: 10, color: 'grey'}}>
                  {item.elapsed_time}
                </Text>
              </View>
            </View>

            <View
              style={{
                top: 7,
                left: 5,
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

            <TouchableOpacity
              onPress={() => this._toggleBottomNavigationView(item)}
              style={{
                justifyContent: 'center',
                alignItems: 'flex-end',
                alignSelf: 'flex-end',
                height: '100%',
                width: '5%',
              }}>
              <Image
                style={{tintColor: 'grey', height: 15, width: 15}}
                source={images.more_options}
              />
            </TouchableOpacity>
          </View>

          <View style={{width: '100%', left: 10, marginTop: 5}}>
            <Text style={{justifyContent: 'center', alignItems: 'center'}}>
              {item.content}
            </Text>
          </View>
          <View style={{width: '100%'}}>
            {item.media_type && (
              <VideoImageComponent
                source={item.media} // Can be a URL or a local file.
                resizeMode="contain"
                displayBackgroundColor={false}
                videoImageStyle={styles.VideoStyle}
                media_type={item.media_type}
                mute={true}
              />
            )}
          </View>
          <View
            style={{height: 45, width: '100%', flexDirection: 'row', left: 10}}>
            <View
              style={{
                flexDirection: 'row',
                width: '60%',
                alignItems: 'center',
              }}>
              <TouchableOpacity onPress={() => this.reactionApi(item, 'happy')}>
                <Image
                  source={images.emojiHappy}
                  style={{
                    height: 25,
                    width: 25,
                    marginVertical: 5,
                    marginRight: 5,
                  }}
                />
                {item.reactions.happy >= 1 ? (
                  <Text
                    style={{
                      fontSize: 12,
                      position: 'absolute',
                    }}>
                    {item.reactions.happy}
                  </Text>
                ) : null}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.reactionApi(item, 'laugh')}>
                <Image
                  source={images.emojiLaughing}
                  style={{height: 25, width: 25, margin: 5}}
                />
                {item.reactions.laugh >= 1 ? (
                  <Text
                    style={{
                      fontSize: 12,
                      position: 'absolute',
                    }}>
                    {item.reactions.laugh}
                  </Text>
                ) : null}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.reactionApi(item, 'angry')}>
                <Image
                  source={images.emojiAngry}
                  style={{height: 25, width: 25, margin: 5}}
                />
                {item.reactions.angry >= 1 ? (
                  <Text
                    style={{
                      fontSize: 12,
                      position: 'absolute',
                    }}>
                    {item.reactions.angry}
                  </Text>
                ) : null}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.reactionApi(item, 'clap')}>
                <Image
                  source={images.emojiClap}
                  style={{height: 25, width: 25, margin: 5}}
                />
                {item.reactions.clap >= 1 ? (
                  <Text
                    style={{
                      fontSize: 12,
                      position: 'absolute',
                    }}>
                    {item.reactions.clap}
                  </Text>
                ) : null}
              </TouchableOpacity>
            </View>

            <View
              style={{
                height: '100%',
                justifyContent: 'flex-end',
                width: '40%',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'flex-end',

                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  onPress={() => this.goCommentScreen(item)}
                  style={{
                    // flex: 0.15,
                   
                    flexDirection: 'row',
                  }}>
                  <Image
                    style={{height: 20, width: 20, tintColor: 'black'}}
                    source={images.comments}
                  />
                    <Text style={{left: 5}}>{item.comments.length}</Text>
                </TouchableOpacity>
              
              </View>

              <View
                style={{
                  height: '100%',
                  width: '50%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  onPress={() => this.goToShare(item)}
                  style={{
                    // flex: 0.15,
                    flexDirection: 'row',
                  }}>
                  <Image
                    style={{height: 20, width: 20, tintColor: 'black'}}
                    source={images.share}
                  />
                </TouchableOpacity>
                {/* <Text style={{left: 5}}>10</Text> */}
              </View>
            </View>
          </View>
        </TouchableOpacity>
        {this.props.isBusy ? <Activity /> : null}
      </View>
    );
  }

  showImageVideoClick(item,type){
    this.setState({ShowImageVideo:true,typeImage:type,bigImageVideo:item})
  }


  mediaView(item) {
    console.log('imageItem>>>>', item);
    return (
      <View>
        <TouchableOpacity style={{borderColor:'white',borderWidth:1}} onPress={()=> this.showImageVideoClick(item,'image')}>

        <Image
          source={{uri: item}}
          style={{height: 100, width: 90}}
          resizeMode="cover"
          onLoadStart={() => this.controlLoader(true)}
          onLoad={() => this.controlLoader(false)}
        />
        </TouchableOpacity>
        {this.state.loader && (
          <View
            style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',

                opacity: 0.5,
              },
              this.props.displayBackgroundColor && {backgroundColor: 'grey'},
            ]}>
            <ActivityIndicator size="large" color={color.RED_BUTTON} />


          </View>
        )}
      </View>
    );
  }

  mediaViewVideo(item) {
    console.log('imageItem>>>>', item);
    return (
      <View>
         <TouchableOpacity onPress={()=> this.showImageVideoClick(item,'video')}>
        <Video
          source={{uri: item}} // Can be a URL or a local file.
          ref={(ref) => {
            this.player = ref;
          }} // Store reference
          onBuffer={this.onBuffer} // Callback when remote video is buffering
          onError={this.videoError} // Callback when video cannot be loaded
          muted={true}
          repeat={true}
          paused={false}
          style={{height: 100, width: 90}}
          onLoadStart={() => this.controlLoader(true)}
          onLoad={() => this.controlLoader(false)}
          resizeMode="cover"
        />
         </TouchableOpacity>

        {this.state.loader && (
          <View
            style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',

                opacity: 0.5,
              },
              this.props.displayBackgroundColor && {backgroundColor: 'grey'},
            ]}>
            <ActivityIndicator size="large" color={color.RED_BUTTON} />
          </View>
        )}
      </View>
    );
  }

  render() {
    const {Show, itemInside,typeImage,bigImageVideo, storyDetail, substoryIndex, storyIndex, storyVisible, storyVisibleModal} = this.state;
    return (
      <SafeAreaView style={{flex:1,backgroundColor: color.RED}}>
      <View style={{flex: 1,backgroundColor:'white'}}>
          <StatusBar
            hidden={false}
            backgroundColor={'#BD2026'}
            barStyle="light-content"
            
        />
        <View
          style={{height: Platform.OS == "android" ? '15%' : '18%', width: '100%', backgroundColor: color.RED}}>
          <View style={{flex: 0.5, flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => this.goToNotification()}
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
              <Image
                resizeMode="contain"
                source={images.laparedlogo}
                style={{height: 20, width: 150, left: 12}}
              />
            </View>

            <TouchableOpacity
              onPress={() => this.createCommunityScreen()}
              style={[styles.header_profile_View, {flex: 0.08}]}>
              <Image style={styles.notificationStyle} source={images.add} />
            </TouchableOpacity>

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
              onPress={() => this.goToProfile()}
              style={{
                flex: 0.2,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: color.RED,
              }}>
              <Image
                style={[styles.userProfileStyle, {height: 40, width: 40}]}
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

        <ScrollView>
          {/* Stories view */}
          <View style={{height: 200, width: '100%'}}>
            <ImageBackground
              resizeMode="cover"
              style={{height: '100%', width: '100%'}}
              source={images.common_background}>
              <View
                style={{
                  height: '20%',
                  width: '100%',
                  justifyContent: 'center',
                }}>
                <Text style={{color: 'white', left: 15}}>Community</Text>
              </View>

              <FlatList
                horizontal={true}
                data={this.state.mystoriesData}
                // ItemSeparatorComponent={this.FlatListItemSeparator}
                renderItem={({item, index}) =>
                  this.story_ViewScreen(item, index)
                }
                //         extraData={this.state.isFetching}
                // onRefresh={() => this.onRefresh()}
                // refreshing={this.state.isFetching}
              />
            </ImageBackground>
          </View>

          {/* Community Bar  */}

          <View
            style={{height: 50, width: '100%', flexDirection: 'row', left: 5}}>
            <TouchableOpacity
              onPress={() => this.communityFeed()}
              style={[styles.header_profile_View, {width: '42%', borderBottomColor: color.RED,
              borderBottomWidth: Show == 0 ? 2 : null}]}>
              <Text
              allowFontScaling={false}
                style={{
                  fontSize: 17,
                  fontWeight: 'bold',
                  color: Show == 0 ? color.RED : 'black',
                  // borderBottomColor: color.RED,
                  // borderBottomWidth: Show == 0 ? 2 : null,
                }}>
                Community feed
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.pictureView()}
              style={[styles.header_profile_View, {width: '16%', borderBottomColor: color.RED,
              borderBottomWidth: Show == 1 ? 2 : null,}]}>
              <Text
               allowFontScaling={false}
                style={{
                  fontSize: 17,
                  fontWeight: 'bold',
                  color: Show == 1 ? color.RED : 'black',
                  // borderBottomColor: color.RED,
                  // borderBottomWidth: Show == 1 ? 2 : null,
                }}>
                Picture
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.VideoView()}
              style={[styles.header_profile_View, {width: '18%',borderBottomColor: color.RED,
              borderBottomWidth: Show == 2 ? 2 : null,}]}>
              <Text
               allowFontScaling={false}
                style={{
                  fontSize: 17,
                  fontWeight: 'bold',
                  color: Show == 2 ? color.RED : 'black',
                  // borderBottomColor: color.RED,
                  // borderBottomWidth: Show == 2 ? 2 : null,
                }}>
                Video
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.TaggedView()}
              style={[styles.header_profile_View, {width: '18%',borderBottomColor: color.RED,
              borderBottomWidth: Show == 3 ? 2 : null,}]}>
              <Text
               allowFontScaling={false}
                style={{
                  fontSize: 17,
                  fontWeight: 'bold',
                  color: Show == 3 ? color.RED : 'black',
                  // borderBottomColor: color.RED,
                  // borderBottomWidth: Show == 3 ? 2 : null,
                }}>
                Tagged
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{height: 1, width: '100%', backgroundColor: 'grey'}}></View>

          {/* community feed  */}

          {Show == 0 ? (
            <FlatList
              data={this.state.mystatusData}
              ItemSeparatorComponent={this.FlatListItemSeparator}
              initialNumToRender={5}
                  updateCellsBatchingPeriod={5}
                  maxToRenderPerBatch={5}
                  windowSize={5}
              renderItem={({item, index}) => this.statusViewScreen(item, index)}
            />
          ) : null}
          {Show == 1 ? (
            <FlatList
              data={this.state.mediaImageData}
              initialNumToRender={5}
                  updateCellsBatchingPeriod={5}
                  maxToRenderPerBatch={5}
                  windowSize={5}
              // ItemSeparatorComponent={this.FlatListItemSeparator}
              renderItem={({item, index}) => this.mediaView(item, index)}
              numColumns={4}
            />
          ) : null}

          {Show == 2 ? (
            <FlatList
              data={this.state.mediaVideoData}
              // ItemSeparatorComponent={this.FlatListItemSeparator}
              renderItem={({item, index}) => this.mediaViewVideo(item, index)}
              numColumns={4}
            />
          ) : null}

          {Show == 3 ? <Text>Tagged</Text> : null}
        </ScrollView>

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
                    width: 15,
                    height: 15,
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
                        <View
                          style={{
                            height: 35,
                            width: 35,
                            backgroundColor: 'gray',
                            borderBottomLeftRadius: 10,
                            borderTopRightRadius: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text style={{fontSize: 18}}>
                            {this.state.initial}
                          </Text>
                        </View>
                      ) : (
                        <Image
                          style={styles.userProfileStyle}
                          source={{uri: itemInside.user.avatar}}
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
                        width: '50%',
                      }}>
                      <Image
                        style={{height: 15, width: 15, tintColor: 'white'}}
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
                    {/* <Image
                    style={{width: '100%', height: '50%'}}
                    source={images.building}
                  
                  /> */}

                    {itemInside.media_type && (
                      <VideoImageComponent
                        source={itemInside.media} // Can be a URL or a local file.
                        resizeMode="contain"
                        videoImageStyle={{width: width, height: height * 0.6}}
                        displayBackgroundColor={true}
                        media_type={itemInside.media_type}
                        mute={false}
                      />
                    )}
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
                        <TouchableOpacity
                          onPress={() => this.reactionApi(itemInside, 'happy')}>
                          <Image
                            source={images.emojiHappy}
                            style={{height: 25, width: 25, margin: 5}}
                          />
                          {itemInside.reactions.happy >= 1 ? (
                            <Text
                              style={{
                                color: 'white',
                                fontSize: 12,
                                position: 'absolute',
                              }}>
                              {itemInside.reactions.happy}
                            </Text>
                          ) : null}
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => this.reactionApi(itemInside, 'laugh')}>
                          <Image
                            source={images.emojiLaughing}
                            style={{height: 25, width: 25, margin: 5}}
                          />
                          {itemInside.reactions.laugh >= 1 ? (
                            <Text
                              style={{
                                color: 'white',
                                fontSize: 12,
                                position: 'absolute',
                              }}>
                              {itemInside.reactions.laugh}
                            </Text>
                          ) : null}
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => this.reactionApi(itemInside, 'angry')}>
                          <Image
                            source={images.emojiAngry}
                            style={{height: 25, width: 25, margin: 5}}
                          />

                          {itemInside.reactions.angry >= 1 ? (
                            <Text
                              style={{
                                color: 'white',
                                fontSize: 12,
                                position: 'absolute',
                              }}>
                              {itemInside.reactions.angry}
                            </Text>
                          ) : null}
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => this.reactionApi(itemInside, 'clap')}>
                          <Image
                            source={images.emojiClap}
                            style={{height: 25, width: 25, margin: 5}}
                          />
                          {itemInside.reactions.clap >= 1 ? (
                            <Text
                              style={{
                                color: 'white',
                                fontSize: 12,
                                position: 'absolute',
                              }}>
                              {itemInside.reactions.clap}
                            </Text>
                          ) : null}
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
                          onPress={() => this.goToShare(itemInside)}>
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
        {this.state.ShowImageVideo == true ?
         <View
         style={{
           position: 'absolute',
           height: '100%',
           width: '100%',
           backgroundColor: color.TRANSPARENT,
         }}>
         <View style={{flex: 1, backgroundColor: color.TRANSPARENT}}>
           <TouchableOpacity
             onPress={() => this.setStateChangeImage()}
             style={{
               alignItems: 'flex-end',
               backgroundColor: color.TRANSPARENT,
               height: '10%',
             }}>
             <Image
               style={{
                 width: 15,
                 height: 15,
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
                 backgroundColor: color.TRANSPARENT,
                 justifyContent:'center',
                 alignItems:'center'
               }}>
               
                   <VideoImageComponent
                     source={bigImageVideo} // Can be a URL or a local file.
                     resizeMode="cover"
                     videoImageStyle={{width: width, height: height * 0.4}}
                     displayBackgroundColor={true}
                     media_type={typeImage}
                     mute={false}
                   />
               
               </View>

       

           
           </View>
         </View>
       </View>
    
      :
        null
      }

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
                    onPress={() => this.turnOnOffComment()}
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

                    {this.state.commentTurn == true ? (
                      <Text style={{left: 30, fontSize: 18, fontWeight: '400'}}>
                        Turn off comments
                      </Text>
                    ) : (
                      <Text style={{left: 30, fontSize: 18, fontWeight: '400'}}>
                        Turn on comments
                      </Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => this.turnOnOffShare()}
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

                    {this.state.shareTurn == true ? (
                      <Text style={{left: 30, fontSize: 18, fontWeight: '400'}}>
                        Turn off sharing
                      </Text>
                    ) : (
                      <Text style={{left: 30, fontSize: 18, fontWeight: '400'}}>
                        Turn on sharing
                      </Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => this.deletePost()}
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
    return(
      <ProgressBar 
                  filled={ substoryIndex > index ? true: false} 
                  innerStyle={{width :""+ (100/this.state.storyDetail.mediaArray.length)+"%"}}
                  onRef={(ref) => {
                    this["progressBar"+ index] = ref;
                }}
                  onEnd={()=>this.changeModalItems(((this.state.storyDetail.mediaArray.length-1) == substoryIndex) ? storyIndex+1: storyIndex, ((this.state.storyDetail.mediaArray.length-1) == substoryIndex) ? 0: substoryIndex+1)}/>
    )
  })
  
}


             </View>
                
              <View  
                style={[styles.flexDirectionRow,styles.justifyContentBetween, styles.paddingRow]}  
            >  
               <View  style={[styles.flexDirectionRow]}>
                 <Image source={images.dummyPerson} style={styles.videoImageIcon} />
               {/* <VideoImageComponent 
              source={storyDetail.mediaArray[substoryIndex].media}   // Can be a URL or a local file.
              resizeMode="cover"
              videoImageStyle={styles.videoImageIcon}
              displayBackgroundColor={true}
              media_type={"image"}
              mute={false}
              /> */}

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
              <TouchableOpacity style={styles.noViewersTextContainer} onPress={()=>{
                 
                    this.closestoryModal()
                    this.props.navigation.navigate('Viewers');
              }}>
           
                <Image style={styles.iconStyle} source={images.showEye} />
               <View>
                <Text style={styles.noViewers}>
                  No Viewers yet
                </Text> 
               </View>  
               </TouchableOpacity>

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
    height: 18,
    width: 18,
    tintColor: 'white',
  },
  videoStyle: {
    height: 20,
    width: 20,
  },
  story_View: {
    height: '19%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header_profile_View: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  userProfileStyle: {
    height: 40,
    width: 39,
    borderWidth: 1,
    borderColor: 'white',
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  
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
    width: '100%',
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
