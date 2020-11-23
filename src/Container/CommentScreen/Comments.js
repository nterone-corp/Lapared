import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ImageBackground,
  Image,
  Keyboard,
  TextInput,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {getConfiguration, setConfiguration} from '../../utils/configuration';
import images from '../common/images';
import {create} from 'apisauce';
import moment from 'moment';
import colors from '../common/colors';
import data from '../common/data';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
export default class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      contentRply: '',
      first_name: '',
      last_name: '',
      replyId: '',
      tick:true,
      postId: this.props.route.params.postId,
      id: this.props.route.params.id,
      dataReply: [],
      data: [],
      scrollPadding: 0,
      replyView: false,
      reactiondata: [],
    };
  }

  componentDidMount() {
    console.log('postId>>>>>>>>', this.state.postId);
    this.commentViewApi();
    this.reactionGetApi();


    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow.bind(this),
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide.bind(this),
    );

  }


  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }


  _keyboardDidShow() {
    this.setState({
      scrollPadding: 0

    });
  }

  _keyboardDidHide() {
    this.setState({
      scrollPadding: 0
    });
  }


//  Home Api /////////////////////////

homeAPI() {
  // setConfiguration('Token', '');
  this.props
    .getHomeAPI()
    .then(
      () => this.afterCallingHomeAPI(),
     
    )
    .catch((e) => this.showAlert(e.message, 300));
}

afterCallingHomeAPI() {
  console.log('isBusy value --- ', this.props.isBusy);
  console.log('response value home --- ', this.props.response);

}

postingAsAPI() {
  // setConfiguration('Token', '');
  this.props
    .PostingAsAPI()
    .then(() => this.afterCallingPostingAsAPI())
    .catch((e) => this.afterErrorHomeApi(e));
}

afterCallingPostingAsAPI() {
  console.log('isBusy value --- ', this.props.isBusy);
  console.log('response value PostingAs --- ', this.props.responsePostingAs);


  // this.setState({data: postingData});
}
afterErrorHomeApi(e){
  console.log('response Error message --- ', e);
  console.log('response Code message --- ', e.code);
 
  if(e.code == data.status.code){
    this.showAlert(e.message, 300)
    this.props.navigation.navigate('Login')

  }else{
    this.showAlert(e.message, 300)
  }

}

showAlert(message, duration) {
  clearTimeout(this.timer);
  this.timer = setTimeout(() => {
    alert(message);
  }, duration);
}




  replybtn(item) {
    // console.log('ItemReply>>>>>>>>>>>>>>>>>>>>', item);

    this.setState({
      replyView: true,
      dataReply: item.comments,
      first_name: item.user.first_name,
      last_name: item.user.last_name,
      replyId: item.id,
    });
  }
  getDateAndTime(dateTime) {
    // console.log('Here is time:', dateTime);

    var newTime = moment(dateTime).startOf('hour').fromNow();

    // console.log('Here is time After Format:', newTime);
    return newTime;
  }
  replysent() {
    this.setState({replyView: false,tick:false});
    this.commentReplyApi();
  }

  comments_view(item) {
    return (
      <View style={{flex: 1, flexDirection: 'row', backgroundColor: 'white'}}>
        <View
          style={{
            height: '70%',
            width: '10%',
          top:15,
            alignItems: 'flex-end',
          }}>
          <Image
            style={{
              height: 25,
              width: 25,
              resizeMode: 'contain',
            }}
            source={images.dummyPerson}
          />
        </View>
        <View style={{width: '90%'}}>
          <View style={{width: '100%'}}>
            <View
              style={{
               
                width: '90%',
                margin: 10,
                backgroundColor: '#F2F2F2',
                borderRadius: 10,
                paddingBottom:10
              }}>
              <Text style={{left: 5, fontWeight: 'bold', margin: 10}}>
                {item.user.first_name} {item.user.last_name}
              </Text>

              <Text style={{width:'90%',left: 15}}>{item.content}</Text>
            </View>
          </View>
          <View
            style={{
              height: '16%',
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={{left: 10}}>
              {item.elapsed_time}
            </Text>
            {
              this.state.replyView == true ?
              null
              :
              <Text onPress={() => this.replybtn(item)} style={{left: 25}}>
              Reply
            </Text>
            }
        
          </View>
          {item.comments.length != 0  ? <TouchableOpacity onPress={() => this.replybtn(item)}  style={{height:70,left:10, width:'100%'}}>
            <View style={{flex:0.5,justifyContent:'center'}}>
              <Text style={{fontWeight:'bold'}}> View {item.comments.length} previous reply.....</Text>

            </View>
            <View style={{flex:0.3,flexDirection:'row',alignItems:'center'}}>
              <Image source={images.dummyPerson} style={{height:20,width:20}} />

          <Text style={{fontWeight:'bold'}} >  {item.comments[0].user.first_name} {item.comments[0].user.last_name}</Text>
              <Text style={{width:'50%'}} numberOfLines={2}> {item.comments[0].content} </Text>
            </View>

</TouchableOpacity>
:
null
}
        
        </View>
        
      </View>
    );
  }
  // Reaction Get //////////////////////////////////
  reactionGetApi() {
    var apiRoot = getConfiguration('API_ROOT');
    var acces_token = getConfiguration('Token');
    // create api. ////////////////////////////////
    const api = create({
      baseURL: apiRoot,
      headers: {
        Authorization: 'Bearer ' + acces_token,
        'Content-Type': 'application/json',
      },
    });

    console.log('api>>>>>>>', api);

    api
      .get('/reactions/' + this.state.postId + '', {})
      .then((res) => this.afterGetReactions(res));
  }

  afterGetReactions(res) {
    console.log('upload share succes======', res);
    console.log('response value GetReaction --- ', res.data);
    var reactiondata = res.data;
    this.setState({reactiondata: reactiondata});
    if(res.status == data.status.code){
      alert('Unauthorized')
        this.props.navigation.navigate('Login')
        
    }
  }

  // Get Comment////////////////////////////////////
  commentViewApi() {
    //     console.log('message',this.state.message)
    //     console.log('itemId',this.state.item.id)
    // console.log('userID',this.state.userId)

    var apiRoot = getConfiguration('API_ROOT');

    var acces_token = getConfiguration('Token');

    // create api.
    const api = create({
      baseURL: apiRoot,
      // headers: { 'Content-Type': 'multipart/form-data', },
      headers: {
        Authorization: 'Bearer ' + acces_token,
        'Content-Type': 'application/json',
      },
    });

    console.log('api>>>>>>>', api);

    api
      .get('/posts/' + this.state.postId + '/comments', {})
      .then((res) => this.afterPostView(res));
  }
  afterPostView(res) {
    console.log('upload share succes======', res);
    console.log('response value getpost --- ', res.data);

    this.setState({data: res.data});
    if(res.status == data.status.code){
      alert('Unauthorized')
        this.props.navigation.navigate('Login')
        
    }
  }

  //   comment post////////////////////////
  commentPostApi() {
    //     console.log('message',this.state.message)
    //     console.log('itemId',this.state.item.id)
    // console.log('userID',this.state.userId)
    this.setState({tick:false})
Keyboard.dismiss()
    var apiRoot = getConfiguration('API_ROOT');

    var acces_token = getConfiguration('Token');

    // create api.
    const api = create({
      baseURL: apiRoot,

      headers: {
        Authorization: 'Bearer ' + acces_token,
        'Content-Type': 'application/json',
      },
    });

    console.log('api>>>>>>>', api);
    if(this.state.id == 'home'){
      let details = {
        content: this.state.content,
      
      };  
      api
      .post(
        '/posts/' + this.state.postId + '/comments',
        JSON.stringify(details),
        {},
      )
      .then((res) => this.afterPost(res));
    }else{
      let details = {
        content: this.state.content,
        community_id: this.state.id
      }; 
      api
      .post(
        '/posts/' + this.state.postId + '/comments',
        JSON.stringify(details),
        {},
      )
      .then((res) => this.afterPost(res));
    }
    
    // api
    //   .post(
    //     '/user/posts/' + this.state.postId + '/comments',
    //     JSON.stringify(details),
    //     {},
    //   )
    //   .then((res) => this.afterPost(res));
  }

  afterPost(res) {
    console.log('upload share succes======', res);
    console.log('response value createpost --- ', res.data);
    this.setState({content: '',tick:true});
    this.commentViewApi();
    this.homeAPI();
    this.postingAsAPI();

  }
  _scrollToInput (reactNode) {
    this.scroll.props.scrollToFocusedInput(reactNode)
  }
  //   Reply//////////////////////////////////////

  commentReplyApi() {
    var apiRoot = getConfiguration('API_ROOT');

    var acces_token = getConfiguration('Token');

    // create api.
    const api = create({
      baseURL: apiRoot,

      headers: {
        Authorization: 'Bearer ' + acces_token,
        'Content-Type': 'application/json',
      },
    });

    console.log('api>>>>>>>', api);
    let details = {
      content: this.state.contentRply,
      comment_id: this.state.replyId,
    };

    api
      .post(
        '/posts/' + this.state.postId + '/comments',
        JSON.stringify(details),
        {},
      )
      .then((res) => this.afterReply(res));
  }

  afterReply(res) {
    console.log('upload rply succes======', res);
    console.log('response value createpost --- ', res.data);
    this.setState({contentRply: '',tick:true});
    this.commentPostApi();
    this.commentViewApi();
  }
reactionscreen(){
  this.props.navigation.navigate('ReactionView',{postId:this.state.postId})
}
  back() {
    this.props.navigation.goBack();
    this.homeAPI()
  }

  render() {
    return (
      <SafeAreaView style={{flex:1,backgroundColor: colors.RED}}>
      <View style={{flex: 1, backgroundColor: colors.WHITE}}>
          <StatusBar
            hidden={false}
            backgroundColor={'#BD2026'}
            barStyle="light-content"
            
        />
        <View style={styles.header}>
          <View style={styles.second_view}>
            {this.state.replyView == true ? (
              <TouchableOpacity
                onPress={() => this.setState({replyView: false})}>
                <Image style={{resizeMode: 'contain'}} source={images.back} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => this.back()}>
                <Image style={{resizeMode: 'contain'}} source={images.back} />
              </TouchableOpacity>
            )}
          </View>
          {this.state.replyView == true ? (
            <Text style={{color: 'white', fontSize: 18}}>Replies</Text>
          ) : (
            <Text style={{color: 'white', fontSize: 18}}>Comments</Text>
          )}
        </View>
        {this.state.reactiondata != [] ? (
          <TouchableOpacity onPress={()=> this.reactionscreen()}  style={styles.symbol_view}>
            <Image
              style={{
                height: '50%',
                width: '5%',
                position: 'absolute',
                left: 20,
                resizeMode: 'contain',
              }}
              source={images.emojiAngry}
            />

            <Image
              style={{
                height: '50%',
                width: '5%',
                left: 10,
                resizeMode: 'contain',
              }}
              source={images.emojiHappy}
            />

            <Text style={{left: 25}}>{this.state.reactiondata.length}</Text>

            <Image
              style={{
                height: '30%',
                width: '5%',
                tintColor: 'grey',
                left: 30,
                resizeMode: 'contain',
              }}
              source={require('../../assests/image/next.png')}
            />
          </TouchableOpacity>
        ) : null}



<KeyboardAwareScrollView   
// keyboardShouldPersistTaps="handled"
innerRef={(ref) => { this.scroll = ref; }} 
behavior="padding"
resetScrollToCoords={{ x: 0, y: 0 }}
enableAutoAutomaticScrol='true'
keyboardOpeningTime={0}
// extraScrollHeight={10}
enableOnAndroid={true}
scrollEnabled={true}
contentContainerStyle={{height:'100%',width:'100%',paddingTop: this.state.scrollPadding}}
 
> 
<View
          style={{
           flex:0.9,
          }}>
          {this.state.replyView == true ? (
            <FlatList
              data={this.state.dataReply}
              renderItem={({item}) => this.comments_view(item)}
            />
          ) : (
            <FlatList
              data={this.state.data}
              renderItem={({item}) => this.comments_view(item)}
            />
          )}
        </View>
  
     
        <View
         style={{
           flex:0.13,
           height:60,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ImageBackground
            source={images.common_background}
            style={{
              width: '100%',
              height: '100%',          
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                height: '60%',
                width: '90%',
                borderRadius: 30,
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              


      
              {this.state.replyView == true ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 70,
                    flexDirection: 'row',
                  }}>
                  <View style={{backgroundColor: 'pink', padding: 5,left:5}}>
                    <Text>
                      {this.state.first_name} {this.state.last_name}{' '}
                    </Text>
                  </View>

                  <TextInput
                    style={{height: '100%', width: '42%',left:10}}
                    placeholder=""
                    onChangeText={(contentRply) => this.setState({contentRply})}
                    value={this.state.contentRply}
                  />

                  <TouchableOpacity
                    onPress={() => this.replysent()}
                    disabled={this.state.tick == true ? false : true}
                    style={{
                      height: '100%',
                      width: '20%',
                      left: 15,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{
                        height: '60%',
                        width: '45%',
                        resizeMode: 'contain',
                      }}
                      source={require('../../assests/image/sent.png')}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height:70,
                    flexDirection: 'row',
                  }}>
                  <TextInput
                    style={{height: '100%', width: '70%'}}
                    placeholder="Write a Comment..."
                    onChangeText={(content) => this.setState({content})}
                    value={this.state.content}
                    // multiline={true}
                    // autoCapitalize='none'
                    
                  />

                  <TouchableOpacity
                    onPress={() => this.commentPostApi()}
                    disabled={this.state.tick == true ? false : true}
                    style={{
                      height: '50%',
                      width: '20%',
                      justifyContent: 'center',
                      left: 30,
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{
                        height:30,
                        width:30,
                        resizeMode: 'contain',
                      }}
                      source={require('../../assests/image/sent.png')}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ImageBackground>
        
        </View>     
           
</KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    height:50,
    width: '100%',
    backgroundColor: '#BD2026',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  second_view: {
    height: '100%',
    width: '10%',
    position: 'absolute',
    left: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  symbol_view: {
    height: '7%',
    width: '100%',
    backgroundColor: 'white',
    borderColor: 'grey',
    borderWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});
