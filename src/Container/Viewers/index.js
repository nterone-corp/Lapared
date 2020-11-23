import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Text,
} from "react-native";
import images from "../../Container/common/images";
import colors from "../common/colors";
const { height, width } = Dimensions.get("window");
class Viewers extends React.Component {
  constructor(props) {
    super(props);
    this.AddStory = this.AddStory.bind(this);
    this.StorySettings = this.StorySettings.bind(this);
    this.back = this.back.bind(this);
  }
  back() {
    this.props.navigation.goBack();
  }

  AddStory() {
    let { storyAPI } = this.props.route.params;
    this.props.navigation.navigate("AddStory", {
      storyAPI: () => {
        storyAPI(false);
        this.back();
      },
    });
  }

  StorySettings() {
    this.props.navigation.navigate("StorySettings", {});
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.RED }}>
        <View style={styles.container}>
          <StatusBar
            hidden={false}
            backgroundColor={"#BD2026"}
            barStyle="light-content"
          />
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => this.back()}
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image style={styles.notificationStyle} source={images.Vector} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.StorySettings();
              }}
              style={{
                marginTop: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                style={styles.notificationStyle}
                source={images.setting2}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.storyViewContainer}>
            <Image
              style={styles.storyViewers}
              source={images.storyViewers}
              resizeMethod={"auto"}
            />
            <TouchableOpacity
              onPress={() => {
                this.AddStory();
              }}
            >
              <ImageBackground
                style={styles.storyViewers}
                source={images.Rectangle8}
                resizeMethod={"auto"}
              >
                <View style={styles.plusImagContainer}>
                  <Image
                    style={styles.notificationStyle}
                    source={images.plusCircle}
                    resizeMethod={"auto"}
                  />
                  <Text style={styles.addToStoryText}>Add to Story</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </View>
          <View style={styles.contentContainer}>
            <Image
              style={styles.notificationStyle}
              source={images.passwordShow}
            />
            <Text style={styles.noViewer}>No Viewers Yet</Text>
            <Text style={[styles.allpeople]}>
              All people view your story , you 'll see details here{" "}
            </Text>
            <TouchableOpacity style={styles.refreshBackGroundColor}>
              <Text>Refresh</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: width * 0.05,
  },
  notificationStyle: {
    height: width * 0.05,
    width: width * 0.05,
  },
  storyViewers: {
    marginLeft: width * 0.02,
    height: width * 0.4,
    width: width * 0.25,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    justifyContent: "center",
  },
  storyViewContainer: {
    flexDirection: "row",
  },
  plusImagContainer: {
    alignItems: "center",
  },
  addToStoryText: {
    color: "white",
    marginTop: width * 0.01,
    fontSize: 10,
  },
  noViewer: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#BD2026",
  },
  allpeople: {
    marginTop: width * 0.02,
  },
  contentContainer: {
    marginTop: width * 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  refreshBackGroundColor: {
    marginTop: width * 0.05,
    padding: width * 0.02,
    borderRadius: 10,
    backgroundColor: "lightgrey",
  },
});

export default Viewers;
