import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  Text,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import color from '../common/colors';
import Geocoder from 'react-native-geocoding';
Geocoder.init('AIzaSyBZhsjubUdcOajZXmxJdgfglfG0jKtkMwE');
const GOOGLE_MAPS_APIKEY = 'AIzaSyBZhsjubUdcOajZXmxJdgfglfG0jKtkMwE';
import images from '../common/images';
import {getConfiguration, setConfiguration} from '../../utils/configuration';

export default class Location extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      To: false,
      showSuggestion: false,
      predictions: [],

      showSuggestionDest: false,

      myaddress_list: [],

      sourceLocation: '',
      curLatitude: 0,
      curLongitude: 0,
      destinationPlaceID: '',
      selSourcePlaceId: '',
    };
  }
  async onChangeSource(sourceLocation) {
    this.setState({sourceLocation});
    this.setState({showSuggestionDest: false});
    const apiUrl =
      'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' +
      sourceLocation +
      '&key=' +
      GOOGLE_MAPS_APIKEY;
    console.log('apiurl>>>>>>>>>>>>', apiUrl);

    try {
      const result = await fetch(apiUrl);
      const json = await result.json();
      console.log('json>>>>>>>>', json);
      this.setState({
        predictions: json.predictions,
        showSuggestion: true,
      });
      console.log(json.predictions);

      var adress_data = json.predictions;

      this.setState({
        myaddress_list: adress_data,
      });

      if (json.predictions.length == 0) {
        this.setState({
          showSuggestion: false,
        });
      }
    } catch (err) {
      console.error(err);
    }
    console.log('placeId>>>>>>', this.state.predictions);
  }

  async setSourceLocation(placeId, description) {
    this.setState({
      sourceLocation: description,
      showSuggestion: false,
      selSourcePlaceId: placeId,
    });

    Geocoder.from(description)
      .then((json) => {
        var location = json.results[0].geometry.location;
        console.log('Destination location : ', location);

        this.setState({curLatitude: location.lat, curLongitude: location.lng});
        console.log('cruLantityde>>>>>>', this.state.curLatitude);
        console.log('curLongitude>>>>>>', this.state.curLongitude);
        console.log('description>>>>>>', description);

        setConfiguration('curLatitude', this.state.curLatitude);
        setConfiguration('curLongitude', this.state.curLongitude);
        setConfiguration('description', description);
        this.back();
      })
      .catch((error) => console.warn(error));
  }

  back() {
    this.props.navigation.goBack();
  }

  render() {
    const predictions = this.state.predictions.map((prediction) => (
      <TouchableOpacity
        style={{
          paddingVertical: 5,
          flexDirection: 'row',
          width: '100%',
          left: 20,
          alignItems: 'center',
        }}
        onPress={() =>
          this.setSourceLocation(
            prediction.place_id,
            prediction.structured_formatting.main_text,
          )
        }>
        <Image
          source={images.locationaddress}
          style={{height: 50, width: 50}}
        />
        <View>
          <Text
            allowFontScaling={false}
            style={{margin: 10, fontWeight: 'bold'}}
            key={prediction.id}>
            {prediction.structured_formatting.main_text}
          </Text>
          <Text
            allowFontScaling={false}
            style={{marginHorizontal: 10, fontSize: 12, color: 'gray'}}
            key={prediction.id}>
            {prediction.structured_formatting.secondary_text}
          </Text>
        </View>
      </TouchableOpacity>
    ));
    return (
      <SafeAreaView style={{flex:1,backgroundColor: color.RED}}>
      <View style={{flex: 1,backgroundColor:color.WHITE}}>
          <StatusBar
            hidden={false}
            backgroundColor={'#BD2026'}
            barStyle="light-content"
            
        />
        <View style={{height: 100, width: '100%', backgroundColor: '#BD2026'}}>
          <View style={{flex: 0.5, flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => this.back()}
              style={{
                flex: 0.15,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image style={styles.notificationStyle} source={images.back} />
            </TouchableOpacity>

            <View
              style={{
                flex: 0.85,
                justifyContent: 'center',
              }}>
              <Text style={{color: 'white', fontSize: 18}}>Add Location</Text>
            </View>
          </View>
          <View style={{flex: 0.5}}>
            <View style={styles.textinputStyle}>
              <Image
                style={{
                  tintColor: 'gray',
                  height: 20,
                  width: 20,
                  marginHorizontal: 10,
                }}
                source={images.search}
              />
              <TextInput
                placeholder="Search for place"
                placeholderTextColor="black"
                onChangeText={(sourceLocation) =>
                  this.onChangeSource(sourceLocation)
                }
                value={this.state.sourceLocation}
                style={{
                  fontSize: 15,
                  height: 150,

                  width: '89%',
                }}></TextInput>
            </View>
          </View>
        </View>

        <View
          style={{height: '85%', width: '100%', backgroundColor: color.WHITE}}>
          <View
            style={{
              height: '100%',
              width: '100%',
              position: 'absolute',
              backgroundColor: color.WHITE,
            }}>
            {this.state.showSuggestion ? (
              <View
                style={{
                  height: '100%',
                  width: '85%',
                  backgroundColor: 'white',
                }}>
                {predictions}
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  firsthaderstyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  notificationStyle: {
    height: 18,
    width: 18,
    tintColor: 'white',
  },
  userProfileStyle: {
    height: 40,
    width: 40,
    borderWidth: 1,
    borderColor: 'white',
    alignSelf: 'center',
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  textinputStyle: {
    width: '90%',
    height: '70%',
    flexDirection: 'row',
    borderColor: 'gray',
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
  },
  moreStyle: {
    height: 20,
    width: 20,
    marginBottom: 12,
  },
});
