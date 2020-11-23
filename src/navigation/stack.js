import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Introduction from '../Container/intro/Intro';
import HomeScreen from '../Container/home';
import Login from '../Container/login';
import SignUp from '../Container/signup';
import NewFeeds from '../Container/status';
import Story from '../Container/Story_Screen';
import Share from '../Container/Share';
import CreatePost from '../Container/CreatePost';
import Location from '../Container/Location/Location';
import TermAndCondition from '../Container/term_and_condition/terms_and_condition';
import Search from '../Container/Search/Search';
import Comments from '../Container/CommentScreen';
import ForgotPassword from '../Container/forgotpasswordScreen';
import Checkyouremail from '../Container/forgotpassword/checkyouremail';
import Createnewpassword from '../Container/CreateNewPassword';
import ReactionView from '../Container/ReactionViewScreen/ReactionView';
import Passwordchanged from '../Container/forgotpassword/passwordchanged';
import CreateCommunityScreen from '../Container/CommunityScreens/CreateCommunityScreen';
import CommunitySetting from '../Container/CommunityScreens/CommunitySetting';
import images from '../Container/common/images';
import CreateUpdatePost from '../Container/CreateUpdatePost';
import CommunityScreen from '../Container/CommunityScreens/CommunityScreen';
import Profile from '../Container/Profile/Profile';
import Message from '../Container/Message/Message';
import Shopping from '../Container/Shopping/Shopping';
import EditCommunity from '../Container/CommunityScreens/EditCommunity'
import AddMember from '../Container/CommunityScreens/AddMember'
import AddStory from '../Container/AddStory';
import SeeAllMember from '../Container/CommunityScreens/SeeAllMember/SeeAllMember'
import Notification from '../Container/Notification/Notification';
import Community from '../Container/Community';
import Contacts from '../Container/Contacts';

import StorySettings from "../Container/StorySettings"
import Viewers from "../Container/Viewers";
const Tab = createBottomTabNavigator();
  
function MyTabs() {
  const navigationOptions = {
    style: {
      backgroundColor: 'gray',
    },
    showIcon: true,
    showLabel: false,
  };
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      activeColor="#e91e63"
      tabBarOptions={navigationOptions}
    
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeTab}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({focused, color, size}) =>
            focused ? (
              <Image
                resizeMode="contain"
                source={images.tabhomeA}
                style={styles.imageStyle}
              />
            ) : (
              <Image
                resizeMode="contain"
                source={images.tabhomeN}
                style={styles.imageStyle}
              />
            ),
        }}
      />
      <Tab.Screen
        name="CommunityScreen"
        component={CommunityScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({focused, color, size}) =>
            focused ? (
              <Image
                resizeMode="contain"
                source={images.tabcommunitA}
                style={styles.imageStyle}
              />
            ) : (
              <Image
                resizeMode="contain"
                source={images.tabcommunitN}
                style={styles.imageStyle}
              />
            ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({focused, color, size}) =>
            focused ? (
              <Image
                resizeMode="contain"
                source={images.tabprofileA}
                style={styles.imageStyle}
              />
            ) : (
              <Image
                resizeMode="contain"
                source={images.tabprofileN}
                style={styles.imageStyle}
              />
            ),
        }}
      />
      <Tab.Screen
        name="Message"
        component={Message}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({focused, color, size}) =>
            focused ? (
              <Image
                resizeMode="contain"
                source={images.tabchatA}
                style={styles.imageStyle}
              />
            ) : (
              <Image
                resizeMode="contain"
                source={images.tabchatN}
                style={styles.imageStyle}
              />
            ),
        }}
      />
      <Tab.Screen
        name="Shopping"
        component={Shopping}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({focused, color, size}) =>
            focused ? (
              <Image
                resizeMode="contain"
                source={images.tabshoppingA}
                style={styles.imageStyle}
              />
            ) : (
              <Image
                resizeMode="contain"
                source={images.tabshoppingN}
                style={styles.imageStyle}
              />
            ),
        }}
      />
    </Tab.Navigator>
  );
}

const HomeT = createStackNavigator();

function HomeTab() {
  return (
    <HomeT.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <HomeT.Screen name="Home" component={HomeScreen} />
      <HomeT.Screen name="NewFeeds" component={NewFeeds} />
      <HomeT.Screen name="Story" component={Story} />
    </HomeT.Navigator>
  );
}



const Stack = createStackNavigator();
const FeedStack = () => {
  return (
    // <HomeScreen/>
    <Stack.Navigator
      initialRouteName="Introduction"       // Introduction  StorySettings Viewers
      screenOptions={{ 
        headerShown: false,
      }}>
      <Stack.Screen
        name="Introduction"
        component={Introduction}
        screenOptions={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Login"
        component={Login}
        screenOptions={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="SignUp"
        component={SignUp}
        screenOptions={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="TermAndCondition"
        component={TermAndCondition}
        screenOptions={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        screenOptions={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Checkyouremail"
        component={Checkyouremail}
        screenOptions={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Createnewpassword"
        component={Createnewpassword}
        screenOptions={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Passwordchanged"
        component={Passwordchanged}
        screenOptions={{
          headerShown: false,
        }}
      />
        <Stack.Screen
        name="Viewers"
        component={Viewers}
        screenOptions={{
          headerShown: false,
        }}
      />
      

      <Stack.Screen
        name="Home"
        component={MyTabs}
        screenOptions={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="NewFeeds"
        component={NewFeeds}
        screenOptions={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Story"
        component={Story}
        screenOptions={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Share"
        component={Share}
        screenOptions={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CreatePost"
        component={CreatePost}
        screenOptions={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CreateUpdatePost"
        component={CreateUpdatePost}
        screenOptions={{
          headerShown: false,
        }}
      />
       <Stack.Screen
        name="Community"
        component={Community}
        screenOptions={{
          headerShown: false,
        }}
      />
    <Stack.Screen
        name="Contacts"
        component={Contacts}
        screenOptions={{
          headerShown: false,
        }}
      />
 <Stack.Screen
        name="AddStory"
        component={AddStory}
        screenOptions={{
          headerShown: false,
        }}
      />

<Stack.Screen
        name="StorySettings"
        component={StorySettings}
        screenOptions={{
          headerShown: false,
        }}
      />
      
      <Stack.Screen
        name="Search"
        component={Search}
        screenOptions={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Comments"
        component={Comments}
        screenOptions={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ReactionView"
        component={ReactionView}
        screenOptions={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Location"
        component={Location}
        screenOptions={{
          headerShown: false,
        }}
      />
       <Stack.Screen 
       name="CreateCommunityScreen" 
       component={CreateCommunityScreen} 
       screenOptions={{
        headerShown: false,
      }}
      />
       <Stack.Screen 
       name="CommunitySetting" 
       component={CommunitySetting} 
       screenOptions={{
        headerShown: false,
      }}
      />
       <Stack.Screen 
       name="EditCommunity" 
       component={EditCommunity} 
       screenOptions={{
        headerShown: false,
      }}
      />
       <Stack.Screen 
       name="AddMember" 
       component={AddMember} 
       screenOptions={{
        headerShown: false,
      }}
      />
       <Stack.Screen 
       name="SeeAllMember" 
       component={SeeAllMember} 
       screenOptions={{
        headerShown: false,
      }}
      />
       <Stack.Screen 
       name="Notification" 
       component={Notification} 
       screenOptions={{
        headerShown: false,
      }}
      />
    </Stack.Navigator>
  );
};

export default FeedStack;

const styles = StyleSheet.create({
  imageStyle: {
    width: 30,
    height: 30,
  },
});
