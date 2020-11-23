import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Login from './src/login/login';
import SignUp from './src/signup/sign';
import ForgotPassword from './src/forgotpassword/ForgotPassword';
import CheckYourEmail from './src/forgotpassword/checkyouremail';
import CreateNewPassword from './src/forgotpassword/createnewpassword';
import PasswordChangedSucessFully from './src/forgotpassword/passwordchanged';
import HomeScreen from './src/home/HomeScreen';

const StackApp = createStackNavigator();

const AppNavigator = () => {
  return (
    <StackApp.Navigator
      initialRouteName="Introduction"
      screenOptions={{
        headerShown: false,
      }}>
      <StackApp.Screen
        name="Introduction"
        component={Introduction}
        screenOptions={{
          headerShown: false,
        }}
      />

      <StackApp.Screen
        name="Login"
        component={Login}
        screenOptions={{
          headerShown: false,
        }}
      />

      <StackApp.Screen
        name="SignUp"
        component={SignUp}
        screenOptions={{
          headerShown: false,
        }}
      />

      <StackApp.Screen
        name="CheckYourEmail"
        component={CheckYourEmail}
        screenOptions={{
          headerShown: false,
        }}
      />

      <StackApp.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        screenOptions={{
          headerShown: false,
        }}
      />

      <StackApp.Screen
        name="CreateNewPassword"
        component={CreateNewPassword}
        screenOptions={{
          headerShown: false,
        }}
      />

      <StackApp.Screen
        name="PasswordChangedSucessFully"
        component={PasswordChangedSucessFully}
        screenOptions={{
          headerShown: false,
        }}
      />
    </StackApp.Navigator>
  );
};

// const Tab = createBottomTabNavigator();


const TabBarHome = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="ForgotPassword" component={ForgotPassword} />
    </Tab.Navigator>
  );
};



export default AppNavigator;
