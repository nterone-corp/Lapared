

import React from 'react';
import {
        createStackNavigator,
        createAppContainer,
         createDrawerNavigator,
         createBottomTabNavigator,
         DrawerNavigator,
         DrawerItems
       } from "react-navigation";
// import { DrawerActions } from 'react-navigation';
import Login from './src/containers/Login'
// import ForgotPassword from './src/containers/ForgotPassword'
import Register from './src/containers/Register/Register'
import Signup from './src/containers/Signup/Signup'
import Home from './src/containers/Home/Home'
import ProductList from './src/containers/ProductList/ProductList'
import ProductDetail from './src/containers/ProductDetail/ProductDetail'
import CheckOut from './src/containers/CheckOut/CheckOut'
import EditProfile from './src/containers/EditProfile/EditProfile'
import Profile from  './src/containers/Profile/Profile'
import WishlistRecieved from './src/containers/WishlistRecieved/WishlistRecieved'
import SupportMessage from './src/containers/SupportMessage/SupportMessage'
import ViewWishlist from './src/containers/ViewWishlist/ViewWishlist'
import RetailStore from './src/containers/RetailStore/RetailStore'
import StoreList from './src/containers/StoreList/StoreList'
import MultipleWishList from './src/containers/MultipleWishList/MultipleWishList'
import WishlistName from './src/containers/WishlistName/WishlistName'
import ImageCapture from './src/containers/ImageCapture/ImageCapture'
import Password from './src/containers/Password/Password'
import ChangePassword from './src/containers/ChangePassword/ChangePassword'
import VerifyOTP from './src/containers/VerifyOTP/VerifyOTP'
import Shared from './src/containers/Shared/Shared'




import {NavigationActions} from 'react-navigation';


import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView
} from 'react-native';


import { DrawerActions } from 'react-navigation';


 import DrawerContent from './DrawerContent'




const RetailStoreNavigation=createStackNavigator({

  RetailStoreScreen: {
    screen: RetailStore,
      navigationOptions: {
            gesturesEnabled: false,
        },
  },
   StoreList: {
     screen: StoreList,
       navigationOptions: {
             gesturesEnabled: false,
         },
   },



},{
  headerMode:'none'
}
);

const WishlistRecievedNavigationScreen=createStackNavigator({

  WishlistRecieved: {
    screen: WishlistRecieved,
      navigationOptions: {
            gesturesEnabled: false,
        },
  },




},{
  headerMode:'none'
}
);

const ProfileNavigationScreen=createStackNavigator({

  ProfileScreen: {
    screen: Profile,
      navigationOptions: {
            gesturesEnabled: false,
        },
  },




},{
  headerMode:'none'
}
);
const SharedNavigationScreen=createStackNavigator({

  SharedScreen: {
    screen: Shared,
      navigationOptions: {
            gesturesEnabled: false,
        },
  },




},{
  headerMode:'none'
}
);




const ProfileNavigation=createStackNavigator({

  EditProfileScreen: {
    screen: EditProfile,
      navigationOptions: {
            gesturesEnabled: false,
        },
  },




},{
  headerMode:'none'
}
);


const WishListNavigation=createStackNavigator({

  MultipleWishList: {
    screen: MultipleWishList,
      navigationOptions: {
            gesturesEnabled: false,
        },
  },
  ViewWishlist: {
    screen: ViewWishlist,
      navigationOptions: {
            gesturesEnabled: false,
        },
  },
  WishlistName: {
    screen: WishlistName,
      navigationOptions: {
            gesturesEnabled: false,
        },
  },

 
 ImageCapture: {
   screen: ImageCapture,
     navigationOptions: {
           gesturesEnabled: false,
       },
 },



},{
  headerMode:'none'
}
);




const DashboardNavigation=createStackNavigator({

  Dashboardscreen: {
    screen: Home,
      navigationOptions: {
            gesturesEnabled: false,
        },
  },

  ProductList: {
     screen: ProductList,
       navigationOptions: {
             gesturesEnabled: false,
         },
  },
   EditProfile: {
      screen: EditProfile,
        navigationOptions: {
              gesturesEnabled: false,
          },
   },
   Profile: {
    screen: ProfileNavigationScreen,
      navigationOptions: {
            gesturesEnabled: false,
        },
 },
 Shared: {
  screen: SharedNavigationScreen,
    navigationOptions: {
          gesturesEnabled: false,
      },
},
 WishlistRecieved: {
  screen: WishlistRecievedNavigationScreen,
    navigationOptions: {
          gesturesEnabled: false,
      },
},
    ProductDetail: {
       screen: ProductDetail,
         navigationOptions: {
               gesturesEnabled: false,
           },
    },
    CheckOut: {
      screen: CheckOut,
        navigationOptions: {
              gesturesEnabled: false,
          },
   },
        RetailStoreNav: {
           screen: RetailStoreNavigation,
             navigationOptions: {
                   gesturesEnabled: false,
               },
        },

            ProfileNav: {
               screen: ProfileNavigation,
                 navigationOptions: {
                       gesturesEnabled: false,
                   },
            },
       WishListNav: {
            screen: WishListNavigation,
            navigationOptions: {
                gesturesEnabled: false,
           },
       },
       SupportNav: {
             screen: SupportMessage,
             navigationOptions: {
                 gesturesEnabled: false,
            },
        },

},{
  headerMode:'none'
}
);







// const TabNavigation= createAppContainer( createBottomTabNavigator({

//   Home: {
//     screen: DashboardNavigation,
//     navigationOptions: {
//       tabBarIcon: ({ focused }) => {
//       return <Image resizeMode="contain" style={{
//       width: 20,
//       height: 20
//       }}
//       source= {focused ? require('./assets/homeOrange.png') : require('./assets/homeBlack.png')}
//       />;
//      },
//      }

//   },

//        Wishlist: {

//         // screen: Login,
//           screen: WishListNavigation,
//          navigationOptions: {
//            tabBarIcon: ({ focused }) => {
//            return <Image resizeMode="contain" style={{
//            width: 20,
//            height: 20
//            }}
//          source= {focused ? require('./assets/likeOrange.png') : require('./assets/like.png')}

//            />;
//           },
//           }

//        },




//        Recieved: {
//          screen: WishlistRecieved,
//          navigationOptions: {
//            tabBarIcon: ({ focused }) => {
//            return <Image resizeMode="contain" style={{
//            width: 20,
//            height: 20
//            }}
//          source= {focused ? require('./assets/wishlistserchorange.png') : require('./assets/wishlistserch.png')}

//            />;
//           },
//           }

//        },

//        Support: {
//         screen: SupportMessage,
//         navigationOptions: {
//           tabBarIcon: ({ focused }) => {
//           return <Image resizeMode="contain" style={{
//           width: 20,
//           height: 20
//           }}
//           source= {focused ? require('./assets/supportOrange.png') : require('./assets/supportBlack.png')}
//           />;
//          },
//          }
    
//       },




// },
// {
//   initialRouteName:'Home',
//   tabBarOptions: {
//     style:{bottom:20},
//      activeTintColor: '#ff8211',
//      showLabel: true,
//      inactiveTintColor: '#000000',
//      labelStyle: { marginTop : -10,
//       marginBottom: -10,
//      fontSize: 12,
//  }
//      // showLabel: false,
//    },
// }));









// This code let you hide the bottom app bar when "CustomHide" is rendering
DashboardNavigation.navigationOptions = ({ navigation }) => {
  let tabBarVisible;
  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map(route => {
      if (route.routeName === "ProductDetail" || route.routeName === "CheckOut" || route.routeName === "EditProfile" || route.routeName === "Profile" || route.routeName === "Shared") {
        tabBarVisible = false;
      } else {
        tabBarVisible = true;
      }
    });
  }

  return {
    tabBarVisible
  };
};





const DrawerNav=createDrawerNavigator({


  Dashboard: {
  screen: TabNavigation,

   },
   RetailStore: {
    screen: RetailStoreNavigation,
    },
  




},{
  contentComponent: DrawerContent,
  contentOptions: {
      tintColor: '#a6a5ab'
}
},

);


//



const AppNavigator = createStackNavigator({
 
   Login: {
     screen: Login,
     navigationOptions: {
      gesturesEnabled: false,
         },
   },
     Password: {
       screen: Password,
       navigationOptions: {
        gesturesEnabled: false,
           },
     },
    VerifyOTP: {
      screen: VerifyOTP,
      navigationOptions: {
       gesturesEnabled: false,
          },
    },
    ChangePassword: {
      screen: ChangePassword,
      navigationOptions: {
       gesturesEnabled: false,
      },
  },
  Register: {
    screen: Register,
    navigationOptions: {
     gesturesEnabled: false,
        },
  },

   Signup: {
     screen: Signup,
     navigationOptions: {
      gesturesEnabled: false,
         },
   },
   SideMenu:{
    screen: DrawerNav,
   navigationOptions: {
    gesturesEnabled: false,
   },
 },



},{
  headerMode:'none'

});









export default createAppContainer(AppNavigator);
