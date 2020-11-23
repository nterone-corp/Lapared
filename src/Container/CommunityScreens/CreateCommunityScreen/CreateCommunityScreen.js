/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Fragment } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  Text,
  StatusBar,
  TextInput,
  Keyboard,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  getConfiguration,
  setConfiguration,
} from "../../../utils/configuration";
import images from "../../common/images";
import colors from "../../common/colors";
import { RNCamera } from "react-native-camera";
import { check, PERMISSIONS, RESULTS } from "react-native-permissions";
import ImagePicker from "react-native-image-picker";
import Activity from "../../common/ActivityIndicator";
const { height, width } = Dimensions.get("window");
const CameraOptions = ["NORMAL", "LIVE", "BOOMERANG"];
import SmoothPicker from "react-native-smooth-picker";
import { create } from "apisauce";
export default class CreateCommunityScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      isBusy: false,
      tick: true,
      fileUri: "",
      fileType: "image/jpeg",
      fileName: "image.jpg",
      community: null,
      cameraType: RNCamera.Constants.Type.back,
      selected: 0,
      openCamera: false,
    };
    this.checkPermission = this.checkPermission.bind(this);

    this.back = this.back.bind(this);
    this.t = setInterval(() => {
      this.setState({ count: this.state.count + 1 });
    }, 1000);
  }

  componentDidMount() {
    this.checkPermission(
      Platform.OS == "ios"
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA,
      "Camera"
    );
  }
  back() {
    this.props.navigation.goBack();
  }
  setCapture = async () => {
    console.log("suncnccncncnc");
    let context = this,
      options = {
        // skipProcessing: true,
        fixOrientation: true,
        base64: false,
        forceUpOrientation: true,
        quality: 0.8,
        exif: true,
      };
    const response = await this.camera.takePictureAsync(options);
    console.log("datadatadatadata", response);

    let extension = response.uri.split(".").pop(),
      obj = {
        filePath: response,
        fileData: response.data,
        fileUri: response.uri,
        openCamera: false,
      };
    if (extension == "jpg" || extension == "jpeg") {
      obj = { ...obj, fileType: "image/jpeg", fileName: "image.jpg" };
    } else {
      obj = {
        ...obj,
        fileType: "image/" + extension,
        fileName: "image." + extension,
      };
    }

    console.log("extensionextension", extension);
    context.setState(obj);
  };

  launchImageLibrary = () => {
    Keyboard.dismiss();
    let options = {
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
        alert(response.customButton);
      } else {
        const source = { uri: response.uri };

        console.log("response", response);

        let extension = response.fileName.split(".").pop();
        console.log("videoDatavideoDatavideoData", extension);

        let fileType = "image/jpeg",
          fileName = "image.jpg";
        if (extension == "jpg" || extension == "jpeg") {
          (fileType = "image/jpeg"), (fileName = "image.jpg");
        } else {
          (fileType = "image/" + extension), (fileName = "image." + extension);
        }
        console.log("fileurii>>>>>>>>", response.uri);
        this.setState({
          fileUri: response.uri,
          fileType: fileType,
          fileName: fileName,
        });
      }
    });
  };

  checkPermission(type, typeName) {
    console.log("calleddddd");
    check(type)
      .then((result) => {
        console.log("resultresult", result);
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              "This feature is not available (on this device / in this context)"
            );
            break;
          case RESULTS.DENIED:
            console.log("denied");
            break;
          case RESULTS.GRANTED:
            // alert("hey");
            this.setState({ permissionGranted: true });
            break;
          case RESULTS.BLOCKED:
            console.log("blocked");
            break;
        }
      })
      .catch((error) => {
        console.log("errorerrorerrorerror", error);
      });
  }
  handleChange = (index) => {
    console.log("indexindexindex", index);
    this.setState({
      selected: index,
    });
  };
createCkeckCommunity(){
  var name = this.state.name
  var description = this.state.description
  if(name == '' && description == ''){
    alert('Please enter community name!')

  }else{
    this.CreateCommunityApi();
  }
}
  CreateCommunityApi() {
    // setConfiguration('Token', '');
    this.setState({ tick: false });
    let apiRoot = getConfiguration("API_ROOT"),
      acces_token = getConfiguration("Token"),
      { fileType, fileName } = this.state;
    // var customerid = getConfiguration('user_id');
    // create api.

    console.log("apiRootapiRootapiRoot", apiRoot, acces_token);
    const api = create({
      baseURL: apiRoot,
      // headers: { 'Content-Type': 'multipart/form-data', },
      headers: {
        Authorization: "Bearer " + acces_token,
        // 'Content-Type': 'multipart/form-data',
      },
    });

    console.log("api>>>>>>>", api);

    console.log("images>>>>>>>>", this.state.fileUri);
    var photo = this.state.fileUri;
    const data = new FormData();
    data.append("community[name]", this.state.name);
    data.append("community[description]", this.state.description);

    if (this.state.fileUri != "") {
      let params = {
        uri: this.state.fileUri,
        // type: "image/jpeg",
        // name: 'image.jpg'
        type: fileType,
        name: fileName,
      };
      data.append("community[cover]", params);
    } else {
      null;
    }

    // post your data.
    api.post("/communities", data, {}).then((res) =>
      this.afterCreateCommunityAPI(res).catch((err) => {
        console.log("e  d ", err);
      })
    );
  }

  afterCreateCommunityAPI(res) {
    console.log("response --- ", res);
    console.log("response value --- ", res.data);
    this.postingAsAPI();
  
    if(res.status == dataCode.status.code){
      alert('Unauthorized')
        this.props.navigation.navigate('Login')
        
    }else{
     
    }
   

    // this.props.navigation.navigate('Introduction');
  }

  postingAsAPI() {
    // setConfiguration('Token', '');
    this.props
      .PostingAsAPI()
      .then(() => this.afterCallingPostingAsAPI())
      .catch((e) => this.showAlert(e.message, 300));
  }

  afterCallingPostingAsAPI() {
    console.log("isBusy value --- ", this.props.isBusy);
    console.log("response value PostingAs --- ", this.props.responsePostingAs);
    // this.props.navigation.navigate('CommunityScreen')
    this.back();
  }

  showAlert(message, duration) {
    this.setState({ autoLogin: false });
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      alert(message);
    }, duration);
  }
  openCameraClick() {
    this.setState({ openCamera: true });
  }

  render() {
    let { cameraType, selected, fileUri, isBusy, openCamera } = this.state;
    // console.log("fileuri>>>>>renderffff", fileUri);
    return (
      <View style={{ flex: 1 }}>
        {!openCamera ? (
          <SafeAreaView style={{ flex: 1, backgroundColor: colors.RED }}>
            <View style={{ flex: 1, backgroundColor: "lightgrey" }}>
              <StatusBar
                hidden={false}
                backgroundColor={"#BD2026"}
                barStyle="light-content"
              />
              {/* Header View */}
              <View style={styles.header_View}>
                <TouchableOpacity
                  onPress={() => this.back()}
                  style={{
                    height: "100%",
                    width: "10%",
                    left: 20,
                    justifyContent: "center",
                  }}
                >
                  <Image
                    style={{ resizeMode: "contain", position: "absolute" }}
                    source={images.back}
                  />
                </TouchableOpacity>

                <View
                  style={[
                    styles.header_profile_View,
                    { height: "100%", width: "90%", right: 15 },
                  ]}
                >
                  <Text style={{ color: "white", fontSize: 18 }}>
                    Create a Community
                  </Text>
                </View>
              </View>
            <ScrollView>

         
                <View style={{ margin: 15 }}>
                  {/* Name View */}
                  <View style={{ height: fileUri =='' ?'10%':'8%', width: "100%" }}>
                    <Text style={{ marginVertical: 5, fontWeight: "bold" }}>
                      Name
                    </Text>
                    <TextInput
                      placeholder="Enter community name"
                      style={{
                        backgroundColor: "white",
                        color: "grey",
                        height: 40,
                        padding: 10,
                        width: "100%",
                        borderRadius: 5,
                        borderWidth: 0.5,
                      }}
                      onChangeText={(name) => this.setState({ name })}
                      value={this.state.name}
                    />
                  </View>

                  {/* Descriptionn View */}
                  <View style={{ height: "18%", width: "100%" }}>
                    <View
                      style={{
                        height: "30%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                      }}
                    >
                      <Text style={{ marginVertical: 5, fontWeight: "bold" }}>
                        Description{" "}
                      </Text>
                      <Text
                        style={{
                          color: "grey",
                          fontSize: 10,
                          marginVertical: 5,
                        }}
                      >
                        {" "}
                        maximum of 100 letter
                      </Text>
                    </View>

                    <View
                      style={{
                        height: "70%",
                        width: "100%",
                        backgroundColor: "white",
                        borderRadius: 5,
                        borderWidth: 0.5,
                      }}
                    >
                      <TextInput
                        placeholder=""
                        style={{
                          padding: 10,
                          color: "grey",
                        }}
                        onChangeText={(description) =>
                          this.setState({ description })
                        }
                        value={this.state.description}
                      />
                    </View>
                  </View>

                  {/* cover photo */}
                  <View style={{height: "12%",width: "100%",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontWeight: "bold" }}>Cover photo</Text>

                    <TouchableOpacity
                      onPress={() => this.openCameraClick()}
                      style={{
                        height: 50,
                        width: "100%",
                        top: 5,
                        borderRadius: 5,
                        flexDirection: "row",
                        backgroundColor: "black",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        style={{ height: 15, width: 15 }}
                        source={images.cameraupload}
                      />
                      <Text style={{ color: "white", left: 5 }}>
                        Upload Cover photo
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Pic From Gallery */}

                  {fileUri != "" ? (
                    <Fragment>
                      <Image
                        resizeMode="cover"
                        source={{ uri: this.state.fileUri }}
                        style={{
                          height: 250,
                          width: Platform.OS == 'android'? 330 : 340,
                        }}
                      />

                      <TouchableOpacity
                        onPress={() => this.setState({ fileUri: "" })}
                        style={{
                          alignSelf: "flex-end",
                          position: "absolute",
                          top: 340,
                        }}
                      >
                        <Image
                          source={images.cross}
                          style={{ height: 25, width: 25 }}
                        />
                      </TouchableOpacity>
                    </Fragment>
                  ) : (
                    <View
                      style={{
                        width: "100%",
                        top: 10,
                        backgroundColor: "white",
                        height: 80,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 5,
                        borderWidth: 0.5,
                      }}>
                      <Image
                        style={{
                          tintColor: "gray",
                          height: "60%",
                          width: "70%",
                          resizeMode: "contain",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        source={images.post_photo}
                      />
                    </View>
                  )}

                  {/* Button View */}
                  <View
                    style={{
                      height: fileUri == ''? '12%': '8%',
                      width: "100%",
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => this.createCkeckCommunity()}
                      disabled={this.state.tick == true ? false : true}
                      style={{
                        height: 60,
                        backgroundColor: "#BD2026",
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 5,
                      }}
                    >
                      <Text style={{ color: "white", borderRadius: 5 }}>
                        Create Community
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ height: 300, width: "100%" }}></View>
                </View>
                {this.props.isBusy ? <Activity /> : null}
                </ScrollView>
            </View>
          </SafeAreaView>
        ) : (
          <RNCamera
            // captureAudio={audio}
            ref={(ref) => (this.camera = ref)}
            style={{ flex: 1 }}
            onStatusChange={(res) => {
              this.setState({ permissionGranted: true });
            }}
            mirrorMode
            type={cameraType}
            //   flashMode={flash}
            androidCameraPermissionOptions={{
              title: "Opu Health would like to access the camera",
              message: "This will let you take photos for the app to analyze.",
              buttonPositive: "Allow",
              buttonNegative: "Don't Allow",
            }}
          >
            <View style={[styles.cameraFooter]}>
              <View style={styles.rowContentApart}>
                <TouchableOpacity
                  style={[styles.flex1, styles.firsthaderstyle]}
                  onPress={() =>
                    this.setState(
                      {
                        openCamera: false,
                      },
                      () => {
                        this.launchImageLibrary();
                      }
                    )
                  }
                >
                  <Image
                    resizeMode="contain"
                    source={images.video_icon}
                    style={{ height: 25, width: 25 }}
                  />
                </TouchableOpacity>
                <View style={styles.flex2}>
                  <SmoothPicker
                    initialScrollToIndex={0}
                    offsetSelection={0}
                    magnet
                    scrollAnimation
                    horizontal={true}
                    data={CameraOptions}
                    onSelected={({ item, index }) => this.handleChange(index)}
                    renderItem={({ item, index }) => {
                      // console.log("index == selected ",index, selected )
                      return (
                        <Text
                          style={[
                            styles.sliderCamersOption,
                            { color: index == selected ? "white" : "grey" },
                          ]}
                          selected={index === selected}
                        >
                          {item}
                        </Text>
                      );
                    }}
                  />
                </View>
                <TouchableOpacity
                  style={[styles.flex1, styles.firsthaderstyle]}
                  onPress={() =>
                    this.setState({
                      cameraType:
                        cameraType == RNCamera.Constants.Type.back
                          ? RNCamera.Constants.Type.front
                          : RNCamera.Constants.Type.back,
                    })
                  }
                >
                  <Image
                    resizeMode="contain"
                    source={images.camerachange2}
                    style={{ height: 25, width: 25 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={styles.cameraIconContainer}
              onPress={() => {
                this.setCapture();
              }}
            >
              <Image
                resizeMode="contain"
                source={images.shotButtonRed}
                style={styles.cameraIcon}
              />
            </TouchableOpacity>
          </RNCamera>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header_View: {
    height: 50,
    width: "100%",
    backgroundColor: "#BD2026",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  header_profile_View: {
    justifyContent: "center",
    alignItems: "center",
  },
  saveCommunity: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  saveCommunityText: {
    textAlign: "center",
    color: "white",
  },
  firsthaderstyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  rowContentApart: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cameraFooter: {
    bottom: 0,
    position: "absolute",
    width: width,
    height: 142,
    // paddingTop:109,
    // alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    // backgroundColor: "rgba(4,0,0,0.5)"
  },
  cameraHeader: {
    top: 0,
    position: "absolute",
    width: width,
    height: 90,
    // paddingTop:109,
    // alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    // backgroundColor: "rgba(4,0,0,0.5)"
  },

  cameraIconContainer: {
    position: "absolute",
    left: width * 0.42,
    bottom: height * 0.15,
  },
  cameraIcon: { height: 50, width: 50 },
  flex1: { flex: 1 },
  flex2: { flex: 2 },
  feedTextInput: {
    height: height * 0.1,
    width: width * 0.95,
  },
  videoIconContainer: {
    position: "absolute",
    left: width * 0.7,
    bottom: height * 0.15,
  },
  sliderCamersOption: { color: "white", padding: 5 },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  VideoStyle: {
    height: height,
    width: width,
  },
  sliderCamersOption: { color: "white", padding: 5 },
  postButton: {
    backgroundColor: "white",
    borderRadius: width * 0.1,
    justifyContent: "center",
    alignItems: "center",
    padding: width * 0.04,
  },
  redText: {
    color: "red",
    fontWeight: "bold",
  },
});
