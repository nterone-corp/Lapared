import React, { useState, Fragment } from "react";
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
} from "react-native";
import color from "../common/colors";
import { getConfiguration, setConfiguration } from "../../utils/configuration";
import { AsyncStorage } from "react-native";
import CustomButton from "../widgets/CustomButton";
import MainViewPro from "../commanview/commonview";
import images from "../common/images";
import commonData from "../common/data";
import data from "../common/data";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { BottomSheet } from "react-native-btr";
import { create } from "apisauce";
import Toast from "react-native-simple-toast";
import PTRView from "react-native-pull-to-refresh";
import Activity from "../common/ActivityIndicator";
import Video from "react-native-video";
import VideoImageComponent from "../../Components/common/VideoImageComponent";
import colors from "../common/colors";
const { height, width } = Dimensions.get("window");

import ProgressBar from "../../Components/common/ProgressBar";

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDialogAlert: false,
      itemInside: "",
      react: "",
      visible: false,
      counthappy: 0,
      countlaugh: 0,
      countangry: 0,
      countclap: 0,
      userId: "",
      commentTurn: false,
      shareTurn: false,
      editPostItem: "",
      reactiondata: [],
      postUserId: "",
      initial: "",
      postIdHide: "",
      loader: false,
      storyVisible: false,
      storyVisibleModal: false,
      storyDetail: null,
      progressStatus: 0,
      storyIndex: 0,
      substoryIndex: 0,
      dropDownShow: false,
      tempMyStories: [
        {
          profile_image: images.group_image,
          cover_image: images.second_story,
          name: "Jane Doe",
        },
      ],
      mystories: [],

      data: [],
      moreOptions: false,
      postId: "",
      community_id: "",
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.AddStory = this.AddStory.bind(this);
    this.openStoryModal = this.openStoryModal.bind(this);
    this.storyAPI = this.storyAPI.bind(this);

    const { navigation } = props;

    this.didFocusListener = navigation.addListener(
      "didFocus",
      this.componentDidFocus
    );

    this.props.navigation.addListener("willFocus", () => {
      // this.homeAPI();
    });

    this.storyAPI(true);
  }

  closestoryModal() {
    const { substoryIndex, storyIndex } = this.state;
    this.setState({ storyVisible: false, storyVisibleModal: false });
    // onEnd={()=>this.changeModalItems(((this.state.storyDetail.mediaArray.length-1) == substoryIndex) ? storyIndex+1: storyIndex, ((this.state.storyDetail.mediaArray.length-1) == substoryIndex) ? 0: substoryIndex+1)}/>
  }

  openStoryModal(index) {
    let context = this;
    this.setState({ storyVisibleModal: true });
    this.changeModalItems(index, 0);
  }

  changeModalItems = (index, substoryIndex) => {
    let { mystories } = this.state;
    this.setState({ storyVisible: false });

    if (mystories.length > index) {
      this.setState({
        storyDetail: mystories[index],
        storyIndex: index,
        substoryIndex: substoryIndex,
        storyVisible: true,
      });
    } else {
      this.closestoryModal();
    }
  };

  _toggleBottomNavigationView(item) {
    console.log("itemuserIdpost>>>>>>>>", item);
    //  this.setStateChange()
    this.setState({
      visible: true,
      postUserId: item.user.id,
      postIdHide: item.id,
      editPostItem: item,
      commentTurn: item.allow_comments,
      shareTurn: item.allow_share,
      community_id: item.community_id,
    });
  }
  _toggleBottomNavigationViewOff() {
    this.setState({ visible: false, showDialogAlert: false });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.response.response !== this.props.response.response) {
      var postData = this.props.response.response;
      // console.log('PostData>>>>>>>>', postData);
      // console.log('PostDataID>>>>>>>>', postData);
      this.setState({
        data: postData,
      });
    }
  }

  componentDidFocus() {
    // this.homeAPI();
    console.log("componentDidFocus");
  }

  componentWillMount() {
    // console.log('componentWillMount');
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }
  goToSearch() {
    this.props.navigation.navigate("Search");
  }

  handleBackButtonClick = () => {
    if (this.state.showDialogAlert) {
      this.setState({ showDialogAlert: false });
      return true;
    } else {
      if (this.props.navigation.isFocused()) {
        Alert.alert(
          "Exit",
          "Are you sure you want to exit app",
          [
            { text: "Cancel", onPress: () => {}, style: "cancel" },
            { text: "Exit", onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: false }
        );
        return true;
      } else {
        return false;
      }
    }
  };

  AddStory() {
    this.props.navigation.navigate("AddStory", {
      storyAPI: () => {
        this.storyAPI(false);
      },
    });
  }

  statusfeedsss() {
    this.props.navigation.navigate("Story");
  }

  storiesfeedsss() {
    this.props.navigation.navigate("NewFeeds");
  }
  goToShare() {
    this.props.navigation.navigate("Share", { item: this.state.itemInside });
    this.setState({
      showDialogAlert: false,
    });
  }
  setStateChange(item) {
    // console.log('itemInside>>>>>>>', item);
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
  goToCreatePost(item) {
    this.props.navigation.navigate("CreatePost", { go: item });
  }
  goCommentScreen(item) {
    console.log("Item>>>.id", item);
    this.props.navigation.navigate("Comments", {
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
    console.log("componentDidMount");
    const { navigation } = this.props;

    // this.homeAPI();
    this.getProfile();
  }

  getProfile() {
    this.props
      .getProfileAPI()
      .then(() => this.afterGetProfile())
      .catch((e) => console.log(e.message));
  }

  afterGetProfile() {
    console.log("isBusy value --- ", this.props.isBusyGetProfile);
    console.log(
      "response value getProfile --- ",
      this.props.responseGetProfile
    );

    var userProfile = this.props.responseGetProfile.response.id;

    console.log("userid>>>>>>>>", userProfile.id);
    this.setState({ userId: userProfile });
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



  showAlert(message, duration) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      alert(message);
    }, duration);
  }

  onBuffer = (data) => {
    console.log("onBufferonBufferonBuffer", data);
  };
  videoError = (error) => {
    console.log("errorerrorerror", error);
  };
  dropDown() {
    this.setState({ dropDownShow: !this.state.dropDownShow });
  }

  controlLoader(loader) {
    let { controlLoader } = this.props;
    this.setState({ loader });
    if (controlLoader) {
      controlLoader(loader);
    }
  }

  FlatListItemSeparator = () => {
    return (
      //Item Separator
      <View
        style={{
          height: 0.5,
          width: "90%",
          alignSelf: "center",
          marginVertical: 12,
          backgroundColor: "#C8C8C8",
        }}
      />
    );
  };

  
  StoriesViews(item, index) {
    console.log("ieteeteeeeteeitem.user.", item);
    return (
      <TouchableOpacity
        onPress={() => {
          this.openStoryModal(index);
        }}
      >
        <View style={{ flex: 1, left: 15 }}>
          {index == 0 ? (
            <View style={{ marginHorizontal: 5 }}>
              <Image
                source={{ uri: item.media }}
                resizeMethod={"resize"}
                resizeMode="cover"
                onLoadStart={() => this.controlLoader(true)}
                onLoad={() => this.controlLoader(false)}
                style={{
                  width: 110,
                  height: 170,
                  marginVertical: 5,
                  borderTopRightRadius: 20,
                  borderBottomLeftRadius: 20,
                }}
              />
              {this.state.loader && (
                <View
                  style={[
                    {
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",

                      opacity: 0.5,
                    },
                    this.props.displayBackgroundColor && {
                      backgroundColor: "grey",
                    },
                  ]}
                >
                  <ActivityIndicator size="large" color={color.RED_BUTTON} />
                </View>
              )}
              <Text
                style={{
                  color: "white",
                  marginLeft: 6,
                  position: "absolute",
                  bottom: 20,
                  fontSize: 12,
                }}
              >
                {commonData.string_constants.add_to_story}
              </Text>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: color.RED,
                  height: 28,
                  width: 28,
                  position: "absolute",
                  top: 25,
                  right: 0,
                  borderRadius: 15,
                  marginEnd: 12,
                }}
                onPress={() => {
                  this.AddStory();
                }}
              >
                <Image source={images.add} style={{ height: 16, width: 16 }} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ marginHorizontal: 5 }}>
              <Image
                source={{ uri: item.media }}
                resizeMethod={"resize"}
                resizeMode="cover"
                onLoadStart={() => this.controlLoader(true)}
                onLoad={() => this.controlLoader(false)}
                style={{
                  width: 110,
                  height: 170,
                  marginVertical: 5,
                  borderTopRightRadius: 20,
                  borderBottomLeftRadius: 20,
                }}
              />
              {this.state.loader && (
                <View
                  style={[
                    {
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",

                      opacity: 0.5,
                    },
                    this.props.displayBackgroundColor && {
                      backgroundColor: "grey",
                    },
                  ]}
                >
                  <ActivityIndicator size="large" color={color.RED_BUTTON} />
                </View>
              )}
              <Text
                style={{
                  color: "white",
                  marginLeft: 12,
                  position: "absolute",
                  bottom: 25,
                  fontSize: 12,
                }}
              >
                {item.user.first_name}
              </Text>
              <Text
                style={{
                  color: "white",
                  marginLeft: 12,
                  position: "absolute",
                  bottom: 12,
                  fontSize: 12,
                }}
              >
                {item.user.last_name}
              </Text>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",

                  height: 30,
                  width: 30,
                  position: "absolute",
                  top: 10,
                  right: 5,
                  borderRadius: 15,
                }}
              >
                <Image
                  source={item.profile_image}
                  style={{ height: 24, width: 24, marginRight: 12 }}
                />
              </TouchableOpacity>
              {this.state.dropDownShow == true ? (
                <View
                  style={{
                    height: "55%",
                    top: 50,
                    right: 14,
                    position: "absolute",
                    borderBottomEndRadius: 25,
                    borderBottomLeftRadius: 25,
                    width: "22%",
                  }}
                >
                  <ImageBackground
                    style={{
                      height: "100%",
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    source={images.communityStoryBack}
                  >
                    <TouchableOpacity
                      onPress={() => this.props.navigation.navigate("Profile")}
                      style={[styles.story_View, { top: -5 }]}
                    >
                      <Image
                        style={{ height: 18, width: 18 }}
                        source={images.profile}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => this.openStoryModal(index)}
                      style={[styles.story_View]}
                    >
                      <Image
                        style={{ height: 18, width: 18 }}
                        source={images.visibilitygroup}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      // onPress={() => this.goToaddmember(item.postingData)}
                      style={[styles.story_View, { top: 4 }]}
                    >
                      <Image
                        style={{ height: 18, width: 18 }}
                        source={images.messageStory}
                      />
                    </TouchableOpacity>
                  </ImageBackground>
                </View>
              ) : null}

              <TouchableOpacity
                onPress={() => this.dropDown()}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: 28,
                  width: 28,
                  position: "absolute",
                  top: 25,
                  right: 0,
                  borderRadius: 15,
                  marginEnd: 12,
                }}
              >
                <Image
                  style={{
                    height: 35,
                    width: 35,
                    alignItems: "center",
                    alignSelf: "center",
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

  

  calculateFromNow(oldDate) {
    var today = new Date();
    var Christmas = new Date(oldDate);
    var diffMs = Christmas - today; // milliseconds between now & Christmas
    var diffDays = Math.floor(diffMs / 86400000); // days
    var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    return diffHrs + " hours, " + diffMins;
  }
  back() {
    this.props.navigation.goBack();
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

  onLoadStart = (onLoadStart) => {
    console.log("onLoadStartonLoadStart", onLoadStart);
  };
  onLoad = (onLoad) => {
    console.log("onLoadonLoadonLoad", onLoad);
  };
  onProgress = (onProgress) => {
    console.log("onProgressonProgressonProgress", onProgress);
  };
  onEnd = (onEnd) => {
    console.log("onEndonEndonEndonEndonEnd", onEnd);
  };
  render() {
    const {
      itemInside,
      storyDetail,
      substoryIndex,
      storyIndex,
      storyVisible,
      storyVisibleModal,
    } = this.state;

   
    return (
      <SafeAreaView style={{flex:1,backgroundColor: color.RED}}>
      <View style={{ flex: 1, backgroundColor: color.WHITE }}>
        <StatusBar
          hidden={false}
          backgroundColor={"#BD2026"}
          barStyle="light-content"
        />
        <View
          style={{ height: Platform.OS == "android" ? '15%' : '18%', width: "100%", backgroundColor: color.RED }}
        >
          <View style={{ flex: 0.5, flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Notification")}
              style={{
                flex: 0.15,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                style={styles.notificationStyle}
                source={images.notification}
              />
            </TouchableOpacity>

            <View
              style={{
                flex: 0.7,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                resizeMode="contain"
                source={images.laparedlogo}
                style={{ height: 20, width: 150 }}
              />
            </View>

            <TouchableOpacity
              onPress={() => this.goToSearch()}
              style={{
                flex: 0.15,
                justifyContent: "center",
                alignSelf: "center",
                alignItems: "center",
              }}
            >
              <Image style={styles.notificationStyle} source={images.search} />
            </TouchableOpacity>
          </View>

          <View style={{ flex: 0.5, flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Profile")}
              style={{
                flex: 0.2,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: color.RED,
              }}
            >
              <Image
                style={[styles.userProfileStyle, { height: 40, width: 40 }]}
                source={images.user_profileimage}
              />
            </TouchableOpacity>

            <View
              style={{
                flexDirection: "row",
                flex: 0.8,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => this.goToCreatePost("Video")}
                style={{
                  flex: 0.3,
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Image style={styles.videoStyle} source={images.video_icon} />

                <Text
                  style={{
                    color: color.WHITE,
                    fontSize: 12,
                    alignSelf: "center",
                    marginStart: 6,
                  }}
                >
                  Video{" "}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.goToCreatePost("Post")}
                style={{
                  flex: 0.3,
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Image style={styles.videoStyle} source={images.post_icon} />

                <Text
                  style={{
                    color: color.WHITE,
                    fontSize: 12,
                    alignSelf: "center",
                    marginStart: 6,
                  }}
                >
                  Post{" "}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.goToCreatePost("Pic")}
                style={{
                  flex: 0.3,
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Image style={styles.videoStyle} source={images.post_photo} />

                <Text
                  style={{
                    color: color.WHITE,
                    fontSize: 12,
                    alignSelf: "center",
                    marginStart: 6,
                  }}
                >
                  Pic{" "}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ height: "90%", width: "100%" }}>
          <View style={{ backgroundColor: color.WHITE }}>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => this.back()}
                style={{ flex: 0.5, marginLeft: 14, marginTop: 10 }}
              >
                <Image
                  style={{ height: 38, width: 38 }}
                  source={images.left_arrow}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.storiesfeedsss()}
                style={{
                  flex: 0.5,
                  alignItems: "flex-end",
                  marginRight: 14,
                  marginTop: 10,
                }}
              >
                <Image
                  style={{
                    height: 38,
                    width: 38,
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                  }}
                  source={images.left_arrow}
                />
              </TouchableOpacity>
            </View>
          </View>



          <View style={{ flex: 0.95, flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              {this.state.mystories == "" ? (
                <Fragment>
                  <FlatList
                    data={this.state.tempMyStories}
                  
                    numColumns={3}
                    renderItem={({ item, index }) =>
                      this.StoriesViews(item, index)
                    }
                    keyExtractor={(item, index) => index}
                  />

                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {this.props.isStoryBusy && (
                <View style={styles.storyLoader}>
                  <Activity />
                </View>
              )}
                    
                  </View>
                </Fragment>
              ) : (
                <FlatList
                  data={this.state.mystories}
                
                  numColumns={3}
                  renderItem={({ item, index }) =>
                    this.StoriesViews(item, index)
                  }
                  keyExtractor={(item, index) => index}
                />
              )}

              {this.props.isStoryBusy && (
                <View style={styles.storyLoader}>
                  <Activity />
                </View>
              )}
            </View>

           
          </View>
        </View>
        {this.state.showDialogAlert == true ? (
          <View
            style={{
              position: "absolute",
              height: "100%",
              width: "100%",
              backgroundColor: color.TRANSPARENT,
            }}
          >
            <View style={{ flex: 1, backgroundColor: color.TRANSPARENT }}>
              <TouchableOpacity
                onPress={() => this.setStateChangee()}
                style={{
                  alignItems: "flex-end",
                  backgroundColor: color.TRANSPARENT,
                  height: "10%",
                }}
              >
                <Image
                  style={{
                    width: 18,
                    height: 18,
                    tintColor: "white",
                    marginRight: 16,
                    marginTop: 16,
                  }}
                  source={images.delete_icon}
                />
              </TouchableOpacity>

              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    backgroundColor: color.TRANSPARENT,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      // onPress={() => this.setStateChange()}
                      style={{
                        alignItems: "center",
                        marginLeft: 10,
                        marginTop: 10,
                      }}
                    >
                      {itemInside.user.avatar == null ? (
                        <View
                          style={{
                            height: 35,
                            width: 35,
                            backgroundColor: "gray",
                            borderBottomLeftRadius: 10,
                            borderTopRightRadius: 10,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text style={{ fontSize: 18 }}>
                            {this.state.initial}
                          </Text>
                        </View>
                      ) : (
                        <Image
                          style={styles.userProfileStyle}
                          source={{ uri: itemInside.user.avatar }}
                        />
                      )}
                    </TouchableOpacity>

                    <View
                      style={{
                        flexDirection: "column",
                        marginStart: 8,
                        marginTop: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 11,
                          color:
                            this.state.showDialogAlert == true
                              ? color.WHITE
                              : color.BLACK,
                        }}
                      >
                        {itemInside.user.first_name} {itemInside.user.last_name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 9,
                          color:
                            this.state.showDialogAlert == true
                              ? "#D7D7D7"
                              : color.BLACK,
                        }}
                      >
                        {itemInside.elapsed_time}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() =>
                        this._toggleBottomNavigationView(itemInside)
                      }
                      style={{
                        alignItems: "flex-end",
                        justifyContent: "flex-end",
                        width: "55%",
                      }}
                    >
                      <Image
                        style={[styles.moreStyle, { tintColor: "white" }]}
                        source={images.more_options}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={{ height: "10%" }}>
                    <Text
                      style={{
                        marginHorizontal: 12,
                        marginTop: 12,
                        color:
                          this.state.showDialogAlert == true
                            ? "#C9C9C9"
                            : color.BLACK,
                      }}
                    >
                      {" "}
                      {itemInside.content}
                    </Text>
                  </View>

                  <View style={{ width: "100%", height: "70%" }}>
                    {/* <Image
                    style={{width: '100%', height: '50%'}}
                    source={images.building}
                  /> */}

                    {itemInside.media_type && (
                      <VideoImageComponent
                        source={itemInside.media} // Can be a URL or a local file.
                        resizeMode="contain"
                        videoImageStyle={{ width: width, height: height * 0.6 }}
                        displayBackgroundColor={true}
                        media_type={itemInside.media_type}
                        mute={false}
                      />
                    )}
                  </View>

                  <View
                    style={{
                      width: "100%",
                      height: "10%",
                    }}
                  >
                    <View
                      style={{
                        width: "90%",
                        height: 0.5,
                        backgroundColor: "gray",
                        top: 10,
                        marginHorizontal: 20,
                      }}
                    ></View>
                    <View
                      style={{
                        flexDirection: "row",
                        width: "100%",
                        height: "100%",
                        top: 10,
                        backgroundColor: "black",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          width: "60%",
                          marginLeft: 10,
                        }}
                      >
                        {itemInside.reactions.happy >= 1 ? (
                          <Text
                            style={{
                              color: "white",
                              fontSize: 12,
                            }}
                          >
                            {itemInside.reactions.happy}
                          </Text>
                        ) : null}
                        <TouchableOpacity
                          onPress={() => this.reactionApi("happy")}
                        >
                          <Image
                            source={images.emojiHappy}
                            style={{ height: 25, width: 25, margin: 5 }}
                          />
                        </TouchableOpacity>

                        {itemInside.reactions.laugh >= 1 ? (
                          <Text
                            style={{
                              color: "white",
                              fontSize: 12,
                            }}
                          >
                            {itemInside.reactions.laugh}
                          </Text>
                        ) : null}
                        <TouchableOpacity
                          onPress={() => this.reactionApi("laugh")}
                        >
                          <Image
                            source={images.emojiLaughing}
                            style={{ height: 25, width: 25, margin: 5 }}
                          />
                        </TouchableOpacity>

                        {itemInside.reactions.angry >= 1 ? (
                          <Text
                            style={{
                              color: "white",
                              fontSize: 12,
                            }}
                          >
                            {itemInside.reactions.angry}
                          </Text>
                        ) : null}

                        <TouchableOpacity
                          onPress={() => this.reactionApi("angry")}
                        >
                          <Image
                            source={images.emojiAngry}
                            style={{ height: 25, width: 25, margin: 5 }}
                          />
                        </TouchableOpacity>
                        {itemInside.reactions.clap >= 1 ? (
                          <Text
                            style={{
                              color: "white",
                              fontSize: 12,
                            }}
                          >
                            {itemInside.reactions.clap}
                          </Text>
                        ) : null}
                        <TouchableOpacity
                          onPress={() => this.reactionApi("clap")}
                        >
                          <Image
                            source={images.emojiClap}
                            style={{ height: 25, width: 25, margin: 5 }}
                          />
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          width: "30%",

                          justifyContent: "space-between",
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",

                            width: "50%",
                          }}
                          disabled={
                            itemInside.allow_comments == true ? false : true
                          }
                          onPress={() => this.goCommentScreen(itemInside)}
                        >
                          <Image
                            source={images.comments}
                            style={{ height: 25, width: 25 }}
                          />
                          <Text style={{ color: "white", left: 5 }}>
                            {itemInside.comments.length}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",

                            width: "50%",
                          }}
                          disabled={
                            itemInside.allow_share == true ? false : true
                          }
                          onPress={() => this.goToShare()}
                        >
                          <Image
                            resizeMode="contain"
                            source={images.share}
                            style={{ height: 25, width: 25 }}
                          />

                          {/* <Text style={{color: 'white', margin: 5}}>10</Text> */}
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>

              
              </View>
            </View>
          </View>
        ) : null}

       

       
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
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
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
    borderColor: "white",
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  bottomNavigationView: {
    width: "95%",
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  VideoStyle: {
    width: "90%",
    height: 250,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 10,
  },
  storyHeader: {
    backgroundColor: "black",
    height: height * 0.12,
  },
  whiteText: {
    color: "white",
  },
  flexDirectionRow: {
    marginTop:5,
    flexDirection: "row",
  },
  justifyContentBetween: {
    justifyContent: "space-between",
  },
  paddingRow: {
    padding: width * 0.05,
  },
  flex1: {
    flex: 1,
  },
  videoImageIcon: {
    width: width * 0.1,
    height: width * 0.1,
    marginRight: width * 0.03,
  },
  noViewers: {
    paddingLeft: width * 0.03,
    color: "white",
    fontSize: width * 0.04,
  },

  noViewersTextContainer: {
    position: "absolute",
    bottom: width * 0.1,
    flexDirection: "row",
  },
  story_View: {
    height: "20%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  storyLoader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  iconStyle: {
    marginLeft: width * 0.03,
    height: width * 0.05,
    width: width * 0.05,
  },
});
