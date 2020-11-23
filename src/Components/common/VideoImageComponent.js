
import React, { Fragment, Component } from "react";
import { Image, StyleSheet, View, ActivityIndicator } from "react-native";
import Video from 'react-native-video';
import color from '../../Container/common/colors';
import convertToProxyURL from 'react-native-video-cache';
class VideoImageComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loader: false
    }
  }
  controlLoader(loader) {
    let {controlLoader} = this.props;
    this.setState({ loader })
    if(controlLoader){
      controlLoader(loader)
    }
  }


  render() {
    let { loader } = this.state, { source, media_type, videoImageStyle, resizeMode, displayBackgroundColor, mute } = this.props;



    return (<Fragment>
      {(media_type == "video") ?
        <Video source={{ uri: convertToProxyURL(source) }}   // Can be a URL or a local file.
          ref={(ref) => {
            this.player = ref
          }}                                      // Store reference
          onBuffer={this.onBuffer}                // Callback when remote video is buffering
          onError={this.videoError}               // Callback when video cannot be loaded
          muted={true}
          repeat={true}
          paused={false}
          resizeMode={resizeMode}
          onLoadStart={() => this.controlLoader(true)}
          onLoad={() => this.controlLoader(false)}
          muted={mute}
          style={videoImageStyle} />
        : <Image
          resizeMode={resizeMode}
          style={videoImageStyle}
          source={{ uri: source }}
          onLoadStart={() => this.controlLoader(true)}
          onLoadEnd={() => this.controlLoader(false)}
        />}
      {loader && <View style={[{

        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

        opacity: 0.5
      }, displayBackgroundColor && { backgroundColor: "grey",top:80 }]}>
        <ActivityIndicator size="large" color={color.RED_BUTTON} />

      </View>}
    </Fragment>)

  }
}

const styles = StyleSheet.create({

  VideoStyle: {
    width: '90%',
    height: 224,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 12,
  }
});

export default VideoImageComponent;