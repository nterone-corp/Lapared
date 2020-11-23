import React from "react"
import { View, Text, StyleSheet, Dimensions,StatusBar,SafeAreaView, TouchableOpacity, Image } from "react-native";
const { height, width } = Dimensions.get('window');
import ToggleButton from "../../Components/common/ToggleButton.js";
import colors from "../common/colors.js";

class StorySettings extends React.Component {
    constructor(props){
     super(props);
   
     this.state = {
         hideContacts: [],
         saveToProfile: false,
         saveToGallery:  false,
     }
     this.hideContacts = this.hideContacts.bind(this);
     this.addContacts = this.addContacts.bind(this);
     this.onTogglePress = this.onTogglePress.bind(this);
     this.sendDataToUserProfileTable = this.sendDataToUserProfileTable.bind(this);
     this.back = this.back.bind(this);
    }

    componentDidMount(){
         this.props.getProfileAPI((userData)=>{
          console.log("userDatauserData",userData)
         let { hide_stories_from, save_stories_to_computer, save_stories_to_profile} = userData
      
      this.setState({
        hideContacts:hide_stories_from,
        saveToProfile: save_stories_to_profile,
        saveToGallery:save_stories_to_computer
      })
     
         })
        console.log("responseGetProfileresponseGetProfile",this.props.responseGetProfile)
    }

    sendDataToUserProfileTable(){
        let {saveToProfile,saveToGallery, hideContacts } = this.state, params = {
            "save_stories_to_profile": saveToProfile,
            "save_stories_to_computer": saveToGallery,
            "hide_stories_from": hideContacts

        }
        this.props.setProfileAPI(params)
    }
    onTogglePress(key, value){  
        this.setState({[key] : value}, ()=>{
            this.sendDataToUserProfileTable()
        })
    }

    addContacts(hideContacts){
        let context = this  ;
        context.setState({hideContacts},()=>{

        context.sendDataToUserProfileTable()
     });
    }
    back() {
        this.props.navigation.goBack();
    }

   hideContacts() {
       let {hideContacts} = this.state;
        this.props.navigation.navigate('Contacts',{
            addContacts: (hideContacts)=>{this.addContacts(hideContacts)},
            hideContacts
        });
      }


    render() {
      let {hideContacts, saveToProfile,saveToGallery} = this.state;
        return (
            <SafeAreaView style={{flex:1,backgroundColor: colors.RED}}>
        <View style={{flex:1, backgroundColor:colors.WHITE}}>
              <StatusBar
            hidden={false}
            backgroundColor={'#BD2026'}
            barStyle="light-content"
            
        />
            <View style={styles.header}>
                <TouchableOpacity
                    style={{ left: 20, height: '8%', justifyContent: 'center' }}
                    onPress={() => this.back()}>
                    <Image
                        style={styles.backbuttonStyle}
                        source={require('../../assests/image/back.png')}
                    />
                </TouchableOpacity>

                <View>
                    <Text style={styles.titleHeaderText}>Story Settings</Text>
                </View>
                <View
                >

                </View>
            </View>
            <View>
                <View style={styles.hideStoryContainer}>
                    <View style={styles.hideStoryDFFrom}>
                        <Text style={styles.hideStoryFrom}>Hide story from </Text>
                        <Text style={styles.hideStoryFromSubscontainer}>Hide your stories and videos from specific person</Text>
                    </View>


                    <TouchableOpacity style={styles.contact} onPress={()=>{this.hideContacts()}}>
                        <Text> {hideContacts.length} contacts </Text>
                        <Image
                            style={styles.rightArrow}
                            source={require('../../assests/image/next.png')}
                        />
                    </TouchableOpacity>

                </View>

            </View>
          <View style={styles.line}/>
         <View style={styles.savetImageProfile}>
          <Text style={styles.settingColor}>Savings</Text>   
         </View>    

         <View>
           <View style={styles.savetImageProfile}>
          <Text >Save To Profile Page</Text>   
          <ToggleButton selected={saveToProfile} onTogglePress={(value)=>{this.onTogglePress("saveToProfile", value)}}/>
      </View>
  <View style={styles.savetImageProfile}>
          <Text >Save To Gallery</Text>   
          <ToggleButton selected={saveToGallery} onTogglePress={(value)=>{this.onTogglePress("saveToGallery", value)}}/>

</View>              
         </View>    

        </View>
        </SafeAreaView>
        )

    }
}

const styles = StyleSheet.create({
    container: {

    },
    hideStoryContainer: {

        flexDirection: 'row',
        margin: width * .05,


        justifyContent: "space-between"
    },
    hideStoryDFFrom: {
        flex: 2,
        justifyContent: "flex-start",

    },
    contact: {
        flex: 1,

        justifyContent: "flex-end", alignItems: "flex-start",
        flexDirection: "row"
    },
    hideStoryFrom: {
        fontWeight: "bold",
        color: "black"
    },
    hideStoryFromSubscontainer: {
        color: "grey",
        fontSize: 12
    },
    header: {
        height: height * .08,
        backgroundColor: '#BD2026',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    titleHeaderText: {
        color: "white",
        fontSize: width * .05,
        fontWeight: "bold"
    },
    rightArrow: {
        height: width * .04,
        width: width * .05,
        tintColor: 'grey',
        marginTop:3,
        resizeMode: 'contain',
    },
    line : {
        height: 1,
        backgroundColor: "grey"
    },
    savetImageProfile: {
        flexDirection : "row",
        justifyContent: "space-between",
        marginHorizontal: width*.05,
        marginVertical: 0
    },
    toggleIcon: {
        width: width*.10,
        height: width*.10,
    },
    settingColor:{
        color: "#BD2026",
        paddingVertical: width*.05,
        fontSize: width*.06,
        fontWeight:'600'
    }
})

export default StorySettings;