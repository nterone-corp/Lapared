import React , {Component, Fragment} from "react"

import {View, StyleSheet, Dimensions, TouchableOpacity,StatusBar, Image, Text, Keyboard} from "react-native";
import { RNCamera } from "react-native-camera";
import { check, PERMISSIONS, RESULTS } from "react-native-permissions";
import images from '../common/images';
const { height, width } = Dimensions.get("window");
import SmoothPicker from "react-native-smooth-picker";
const CameraOptions = ["NORMAL", "LIVE", "BOOMERANG"];
import {create} from 'apisauce';
import {getConfiguration, setConfiguration} from '../../utils/configuration';
import ImagePicker from 'react-native-image-picker';
import Activity from '../common/ActivityIndicator';
class AddStory extends Component {
  constructor(props) {
    super(props);
    this.state = {
     
      fileUri: "",
      fileType: "image/jpeg",
      fileName: 'image.jpg',
      community: null,
      cameraType: RNCamera.Constants.Type.back,
      selected: 0,
    };
    this.checkPermission = this.checkPermission.bind(this);
    this.createPost = this.createPost.bind(this);
    this.addcommunity = this.addcommunity.bind(this);
    this.back = this.back.bind(this);
    this.t = setInterval(() => {
      this.setState({count: this.state.count + 1});
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

    console.log("suncnccncncnc")
    let context = this , options = {
      // skipProcessing: true,
      fixOrientation: true,
      base64: false,
      forceUpOrientation: true,
      quality: 0.8,
      exif: true
    };
    const response = await this.camera.takePictureAsync(options);
       console.log("datadatadatadata",response)


       let extension = response.uri.split('.').pop(),
        obj = {
          filePath: response,
          fileData: response.data,
          fileUri: response.uri
        }
        if((extension == "jpg") || (extension ==  "jpeg")){
         obj = {...obj,fileType: "image/jpeg", fileName: 'image.jpg' }  
        }else {
          obj = {...obj,fileType: "image/"+extension, fileName: 'image.'+ extension }  
        }
         

        console.log("extensionextension",extension)
       context.setState(obj);
  };


  addcommunity(selectedCommunity){
    console.log("dfdsfdsfsfsdfs",selectedCommunity)
    let communityArray = "";
    selectedCommunity.map((item,ind)=>{
      if (ind == 0){
        communityArray= communityArray+ item.id
      }else{
        communityArray= communityArray+ "," +item.id
      }
     
    })
    console.log("communityArraycommunityArray",communityArray)
    this.setState({community : communityArray})
  }


  launchImageLibrary = () => {
    Keyboard.dismiss();
    let options = {
      
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = {uri: response.uri};

        console.log('response', response);

      
   

        
    

            let videoData  , extension = response.uri.split('.').pop();
               console.log("videoDatavideoDatavideoData",extension)
            
            let fileType = "image/jpeg", fileName ="image.jpg" ; 
            if((extension == "jpg") || (extension ==  "jpeg")){
              fileType = "image/jpeg", fileName = "image.jpg", videoData = false ;
             }else {
               fileType = "image/"+extension,  fileName = 'image.'+ extension  , videoData = false;
             }


            this.setState({
              fileUri: response.uri,
              fileType: fileType, 
              fileName: fileName,
            });

          
          
  
      
      }
    });
  };



  checkPermission(type, typeName) {
    console.log(
      "calleddddd"
    );
    check(type)
      .then(result => {
        console.log("resultresult",result)
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
      .catch(error => {
        console.log("errorerrorerrorerror",error)
      });
  }
  handleChange = index => {
    console.log("indexindexindex",index)
    this.setState({
      selected: index
    });
  };



  ////////////  createPost api /////////////////////////////////
  createPost() {
  

    Keyboard.dismiss();
    this.setState({isBusy: true})
    let apiRoot = getConfiguration('API_ROOT'), acces_token = getConfiguration('Token'),{fileType, fileName} = this.state;
    // var customerid = getConfiguration('user_id');
    // create api.

    console.log("apiRootapiRootapiRoot",apiRoot, acces_token)
    const api = create({
      baseURL: apiRoot,
      // headers: { 'Content-Type': 'multipart/form-data', },
      headers: {
        Authorization: 'Bearer ' + acces_token,
        // 'Content-Type': 'multipart/form-data',
      },
    });

   
    var photo = this.state.fileUri;
    const data = new FormData();
    
    if(this.state.community){
        data.append('story[community_ids]', this.state.community);
    }


      let params = {
        uri: this.state.fileUri,
        // type: "image/jpeg",
        // name: 'image.jpg'
        type: fileType,
        name: fileName,
      }
       data.append("story[media]", params);
     
      

   
    // {
      // this.state.communityIndex == 0
      //   ? // post your data.
          api.post('/user/stories', data, {}).then((res) => {
              console.log("ressssssss",res)
           this.props.route.params.storyAPI()
           this.props.navigation.pop()
              this.setState({isBusy: false})
            // this.afterPost(res)
          
          }).catch((err)=>{
            this.setState({isBusy: false})
            console.log("e  d " , err)}
            )
    //     : // post your data.
    //       api
    //         .post('/communities/' + this.state.communityId + '/posts', data, {})
    //         .then((res) => this.afterPost(res));
    // }
  
          }
    render(){
      let {cameraType, selected, fileUri, isBusy} = this.state;
    return(
      <Fragment>  
{(fileUri != "") ?
<View style={{height: '100%', width: '100%'}}>
  <Image
    resizeMode="cover"
    source={{uri: this.state.fileUri}}
    style={{height: height, width: width}}
  />
  
  <View
                style={[
                  styles.cameraFooter
                ]}
              >
             
                <View style={styles.rowContentApart}>
               
                <TouchableOpacity
                    style={[styles.flex1,styles.saveCommunity]}
                    onPress={() =>{
                      this.props.navigation.navigate('Community',{  
                        addcommunity : (selectedCommunity)=>this.addcommunity(selectedCommunity)
                      });

                      
                    }}
                    
                  >
                   <Image
                    resizeMode="contain"
                    source={images.Community}
                    style={{height: 25, width: 25,tintColor:'white'}}
                  />
                  <Text style={styles.saveCommunityText}>Select Community's</Text>
                  </TouchableOpacity>
                  <View style={styles.flex1}>
                  <TouchableOpacity
                    style={[styles.flex1,styles.saveCommunity]}
                    onPress={() =>{}}
                    
                  >
                   <Image
                    resizeMode="contain"
                    source={images.dropDown}
                    style={{height: 25, width: 25}}
                  />
                  <Text style={styles.saveCommunityText}>Save</Text>
                  </TouchableOpacity>
                   </View>
                  <TouchableOpacity
                   style={[styles.flex1,styles.postButton]}
                  onPress={() =>{
                    this.createPost()
                  }}
                >
                 <Text style={styles.redText}>POST</Text>
                </TouchableOpacity>
                 
            
                </View>
              
              </View>
  
  
  
  
  
  </View> : <RNCamera
              // captureAudio={audio}
              ref={ref => (this.camera = ref)}
              style={{flex: 1}}
              onStatusChange={res => {
              this.setState({ permissionGranted: true });
              }}
              mirrorMode
              type={cameraType}
              //   flashMode={flash}
              androidCameraPermissionOptions={{
                title: "Opu Health would like to access the camera",
                message:
                  "This will let you take photos for the app to analyze.",
                buttonPositive: "Allow",
                buttonNegative: "Don't Allow"
              }}
            >

            <View
                style={[
                  styles.cameraHeader
                ]}
              >
             
                <View style={styles.rowContentApart}>
      

                <View style={styles.rowContentApart}>
               
               <TouchableOpacity
                   style={[styles.flex1,styles.firsthaderstyle,{ right:25}]}
                   onPress={() =>
                    {
                      this.back()
                     this.setState({
                       openCamera : false,
                     },()=>{
                      //  this.launchImageLibrary()
                     })
                    }
                   }
                 >
                  <Image
                   resizeMode="contain"
                   source={images.delete_icon}
                   style={{height: 20, width: 20,tintColor:'white'}}
                 />
                 </TouchableOpacity>
                 <View style={styles.flex2}>
          
                  </View>
                 <TouchableOpacity
                  style={[styles.flex1,styles.firsthaderstyle,{ left:25}]}
                 onPress={() =>{
                   
                 
                    this.props.navigation.navigate('StorySettings');
                  
            
 
    // this.setState({
    //   cameraType: cameraType == RNCamera.Constants.Type.back ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back
    // })

                 }
                 
                 }
               >
                <Image
                 resizeMode="contain"
                 source={images.setting2}
                 style={{height: 20, width: 20,tintColor:'white'}}
               />
               </TouchableOpacity>
            
               </View>
            
                </View>

                </View> 

              <View
                style={[
                  styles.cameraFooter
                ]}
              >
             
                <View style={styles.rowContentApart}>
               
                <TouchableOpacity
                    style={[styles.flex1,styles.firsthaderstyle]}
                    onPress={() =>
                      this.setState({
                        openCamera : false,
                      },()=>{
                        this.launchImageLibrary()
                      })
                    }
                  >
                   <Image
                    resizeMode="contain"
                    source={images.video_icon}
                    style={{height: 25, width: 25}}
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
                        return( 
                        <Text style={[styles.sliderCamersOption,{color: index == selected ? "white" : "grey"}]} selected={index === selected}>{item}</Text>
                      )}}
      />
                   </View>
                  <TouchableOpacity
                   style={[styles.flex1,styles.firsthaderstyle]}
                  onPress={() =>
                    this.setState({
                      cameraType: cameraType == RNCamera.Constants.Type.back ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back
                    })
                  }
                >
                 <Image
                  resizeMode="contain"
                  source={images.camerachange2}
                  style={{height: 25, width: 25}}
                />
                </TouchableOpacity>
                 
            
                </View>
              
              </View>
              <TouchableOpacity 
                    style={styles.cameraIconContainer}
                  onPress={() => {
                  
                   
                      this.setCapture()
                
                    }}>
                  <Image
                    resizeMode="contain"
                    source={images.shotButtonRed}
                    style={styles.cameraIcon}
                  />
                  </TouchableOpacity>
                  
           
            </RNCamera>}
            {isBusy ? <Activity /> : null}
            </Fragment>  
        );    
    }
}

const styles = StyleSheet.create({
  saveCommunity: {
   flexDirection : "column",
   justifyContent: "center",
   alignItems: "center"
  },
  saveCommunityText: {
  textAlign: "center",
  color: "white"
  },
    firsthaderstyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
      },
    rowContentApart: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    },
    cameraFooter: {
      bottom: 0,
      position: "absolute",
       width: width,
       height:142,
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
       height:90,
  // paddingTop:109,
      // alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 20,
      // backgroundColor: "rgba(4,0,0,0.5)"
    },
  
    cameraIconContainer: {
      position: "absolute",
      left : width*.42,
      bottom: height*.15
    },
    cameraIcon:{height: 50, width: 50},
    flex1 : {flex: 1},
    flex2 : {flex: 2},
    feedTextInput: {
      height:height*.10,
      width:width*.95,
  
     },
     videoIconContainer: {
      position: "absolute",
      left : width*.70,
      bottom: height*.15
     },
     sliderCamersOption: {color: "white",
       padding : 5
    },
    backgroundVideo: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    VideoStyle: {
      height: height, width: width
    },
    sliderCamersOption: {color: "white",
    padding : 5
    },
    postButton: {
      backgroundColor : "white",
      borderRadius: width*.10,
      justifyContent : "center",
      alignItems: "center",
      padding: width*.04
    },
    redText: {
      color: "red",
      fontWeight: "bold"
    }
  });

export default AddStory;