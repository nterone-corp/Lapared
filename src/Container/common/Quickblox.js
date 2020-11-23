import QB from "quickblox-react-native-sdk";
import { NativeEventEmitter } from "react-native";
import { StackRouter } from "@react-navigation/native";
import NavigationService from "../components/navigation/NavigationService";
import { PERMISSIONS, request } from "react-native-permissions";
import { showNotification } from "../common/user";

const appSettings = {
  appId: "81573",
  authKey: "EeSzOX5Qg3XbOZR",
  authSecret: "XDOuyfNbLgN7LKB",
  accountKey: "tsGJjQDTDaagsp53zmAY",
};

const CALL = QB.webrtc.EVENT_TYPE.CALL,
  AССEPT = QB.webrtc.EVENT_TYPE.ACCEPT,
  REJECT = QB.webrtc.EVENT_TYPE.REJECT,
  HANG_UP = QB.webrtc.EVENT_TYPE.HANG_UP,
  RECEIVED_VIDEO_TRACK = QB.webrtc.EVENT_TYPE.RECEIVED_VIDEO_TRACK,
  PEER_CONNECTION_STATE_CHANGED =
    QB.webrtc.EVENT_TYPE.PEER_CONNECTION_STATE_CHANGED,
  NOT_ANSWER = QB.webrtc.EVENT_TYPE.NOT_ANSWER,
  CALL_END = QB.webrtc.EVENT_TYPE.CALL_END;
let props;
const intialize = () => {
  QB.settings
    .init(appSettings)
    .then(function(e) {
      console.log("quickblox initialized successfully");
      try {
        QB.settings.enableAutoReconnect({ enable: true });
        eventHandler();
      } catch (error) {}
    })
    .catch(function(e) {
      console.log(e, "QB.settings error");
    });
};

const logout = () => {
  // QB.chat.disconnect();
  // QB.auth
  // .getSession()
  // .then(function (session) {
  //   // handle session
  //   console.log(session)
  // })
  // .catch(function (e) {
  //   // som
  // })
  // QB.webrtc
  // .release()
  // .then(() => { /* released successfully */
  // console.log("release")
  // })
  // .catch(e => { /* handle error */
  //   console.log("release error", e)
  // })
  // QB.auth
  //   .logout()
  //   .then(function() {
  //     console.log('signed out successfully');
  //   })
  //   .catch(function(e) {
  //     console.log(e, 'signed out error');
  //   });
  try {
    QB.chat.disconnect();
    QB.webrtc.sessions = {};
  } catch (error) {
    console.log(error);
  }
};

const login = (user, props) => {
  let { email, name, phone, user_id, id } = user;
  console.log(user, "user88888888888888");
  let loginId = "P_" + id;
  QB.auth
    .login({
      // email: email,
      login: loginId,
      password: "quickblox",
    })
    .then(function(info) {
      console.log("signed in successfully, handle info as necessary", info);
      intializeWebRTC(loginId, "quickblox");
    })
    .catch(function(e) {
      QB.users
        .create({
          // email: email,
          // fullName: name,
          login: loginId,
          password: "quickblox",
          // phone: phone,
        })
        .then(function(user) {
          console.log("user created successfully", user);
          intializeWebRTC(loginId, "quickblox");
        })
        .catch(function(e) {
          // handle as necessary
          console.log("signed in error", e);
          QB.auth
            .getSession()
            .then(function(session) {
              console.log(session, "session");
              intializeWebRTC(loginId, "quickblox");
            })
            .catch(function(e) {});
        });
    });
};

const intializeWebRTC = (email, password) => {
  logout();
  const filter = {
    field: QB.users.USERS_FILTER.FIELD.LOGIN,
    operator: QB.users.USERS_FILTER.OPERATOR.IN,
    type: QB.users.USERS_FILTER.TYPE.STRING,
  };
  QB.users
    .getUsers({ filter: filter })
    .then(function(result) {
      console.log(result, "getUsers", email);
      if (result && result.users && result.users.length) {
        let emailIndex = result.users.findIndex((x) => x.login == email);
        console.log("result.users[emailIndex].id", emailIndex);
        if (emailIndex > -1) {
          QB.chat
            .connect({
              userId: result.users[emailIndex].id,
              password: password,
            })
            .then(function() {
              QB.webrtc
                .init()
                .then(function() {
                  console.log("module is ready for calls processing");
                })
                .catch(function(e) {
                  /* handle error */
                  console.log("module is not ready for calls processing 1", e);
                });
            })
            .catch(function(e) {
              // some error occurred
              console.log("module is not ready for calls processing", e);
            });
        }
      }
    })
    .catch(function(e) {
      // handle error
    });
};

const videoCall = (id, props, userInfo) => {
  if (id == 0) {
    showNotification("danger", "Doctor isn't online.");
    return;
  }
  const params = {
    opponentsIds: [id],
    type: QB.webrtc.RTC_SESSION_TYPE.VIDEO,
  };
  // QB.webrtc.hangUp({sessionId: [id], type: QB.webrtc.RTC_SESSION_TYPE.VIDEO}).then(res=>{console.log("hang up")})
  request("android.permission.CAMERA").then((res) => {
    if (res == "granted") {
      request("android.permission.RECORD_AUDIO").then((resp) => {
        if (resp == "granted") {
          QB.webrtc
            .call({
              opponentsIds: [id],
              type: QB.webrtc.RTC_SESSION_TYPE.VIDEO,
              userInfo: { userInfo: JSON.stringify(userInfo) },
            })
            .then(function(session) {
              if (session.initiatorId > -1) {
                props.navigation.navigate("VideoCall", {
                  session: session,
                  isModal: false,
                });
              }else{
                showNotification(
                  "danger",
                  "Doctor is busy."
                );
              }
            })
            .catch(function(e) {
              console.log("video call joined fail", e);
              showNotification(
                "danger",
                "Please wait. we are preparing our video call."
              );
            });
        } else {
          showNotification("danger", "You don't have microphone permission.");
        }
      });
    } else {
      showNotification("danger", "You don't have camera permission.");
    }
  });
};

const eventHandler = (event) => {
  const emitter = new NativeEventEmitter(QB.webrtc);
  emitter.addListener(CALL, videoCallListner);
  emitter.addListener(HANG_UP, hangUpListner);
  emitter.addListener(REJECT, rejectListner);
  emitter.addListener(NOT_ANSWER, notAnswer);
};
const videoCallListner = (event) => {
  console.log(event, "videoCallListner");
  request("android.permission.CAMERA").then((res) => {
    if (res == "granted") {
      request("android.permission.RECORD_AUDIO").then((resp) => {
        if (resp == "granted") {
          NavigationService.navigate("VideoCall", {
            session: event.payload.session,
            isModal: true,
            // userInfo: event.payload.userInfo
            //   ? JSON.parse(event.payload.userInfo.userInfo)
            //   : "",
          });
        } else {
          showNotification("danger", "You don't have microphone permission.");
        }
      });
    } else {
      showNotification("danger", "You don't have camera permission.");
    }
  });
  // props.navigation.navigate('VideoCall', {session: event.payload.session});
  // StackActions.navigate('VideoCall', {session: event.payload.session});
};

const rejectListner = () => {
  showNotification("danger", "Call reject by doctor.");
  NavigationService.goBack();
};

const hangUpListner = (event) => {
  // QB.webrtc
  //   .hangUp({ sessionId: event.payload.session.id })
  //   .then((res) => {
  //     console.log("hang up");
  //     showNotification("danger", "Call Disconnected.");
  //     NavigationService.goBack();
  //   })
  //   .catch((er) => {
  //     console.log("hang up", er);
  //   });
  // NavigationService.navigate('VideoCall', {session: event.payload.session});
  // props.navigation.navigate('VideoCall', {session: event.payload.session});
  // StackActions.navigate('VideoCall', {session: event.payload.session});
};

const notAnswer = () => {
  NavigationService.goBack();
  showNotification("danger", "User not available to take call.");
};

export default { intialize, logout, login, videoCall };
