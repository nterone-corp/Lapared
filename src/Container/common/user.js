import {Alert} from 'react-native';
import axios from 'axios';
import commonData from '../common/data';
import {Toast} from 'native-base';
import NetInfo from '@react-native-community/netinfo';
import { showMessage, hideMessage } from "react-native-flash-message";
 const url = 'https://uat.wishhealth.in/'


// //Alert function
// export const alertWithTwoBtn = (title, message, btn1Text, btn2Text) => {
//   console.log('alert function ');
//   return new Promise((resolve, reject) => {
//     Alert.alert(
//       title,
//       message,
//       [
//         {
//           text: btn1Text,
//           onPress: () => resolve(false),
//         },
//         {
//           text: btn2Text,
//           onPress: () => resolve(true),
//           style: 'cancel',
//         },
//       ],
//       {cancelable: false},
//     );
//   });
// };
// //Toast function
export const showNotification = (type, message) => {
  showMessage({
    message: message,
    type: type,
  });
};

//Network check function
export const networkCheck = () => {
  return new Promise((resolve, reject) => {
    NetInfo.fetch().then(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      resolve(state.isConnected);
    });
  });
};

// //function for get request with out header
export const getApiRequest = endpoint => {
  return new Promise((resolve, reject) => {
    networkCheck().then(data => {
      if (!data) {
        reject(commonData.ToastMessages.no_network);
      } else {
        console.log('url',url + endpoint)
        axios
          .get(url + endpoint)
          .then(function(response) {
            console.log(response);
            if (response.status == 200) {
              resolve(response.data.data);
            } else {
              reject(response.data.error);
            }
          })
          .catch(function(error) {
            reject(error);
            console.log(error, 'errror');
          });
      }
    });
  });
};

export const getApiRequestCustom = endpoint => {
  return new Promise((resolve, reject) => {
    networkCheck().then(data => {
      if (!data) {
        reject(commonData.ToastMessages.no_network);
      } else {
        console.log('url',url + endpoint)
        axios
          .get(url + endpoint)
          .then(function(response) {
            console.log(response);
            if (response.status == 200 || response.status == 201) {
              resolve(response.data);
            } else {
              reject(response.data);
            }
          })
          .catch(function(error) {
            reject(error);
            console.log(error, 'errror');
          });
      }
    });
  });
};
//function for post request with out header
export const postApiRequest = (endpoint, param) => {      
  console.log(url+endpoint)
  return new Promise((resolve, reject) => {
    networkCheck().then(data => {
      if (!data) {
        reject(commonData.ToastMessages.no_network);
      } else {
        axios
          .post(url+endpoint, param)
          .then(function(response) {
            console.log(response);
            if (response.status == 200 || response.status == 201) {
              resolve(response.data);
            } else {
              reject(response.data.errors);
            }
          })
          .catch(function(error) {
            reject(error);
            console.log(error, 'errror');
          });
      }
    });
  });
};
