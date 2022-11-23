import React from "react";
import {Image,StyleSheet,Text,View,TextInput,TouchableOpacity,KeyboardAvoidingView,Icon,Dimensions} from "react-native";
import MapView from "react-native-maps";
import * as Permissions from 'expo-permissions';
  import * as Location from 'expo-location';
const latitudeDelta = 0.025;
const longitudeDelta = 0.025;
const prefix = "https://";


export default class GooglePlaces extends React.Component<any, any> {

searchText :any ;
mapView :any;
state = {
   region: {
   latitudeDelta,   longitudeDelta, 
   latitude: this.props.location.latitude,   longitude: this.props.location.longitude,   location:this.props.location,   buttonText:"",  },   errorMessage:"",   listViewDisplayed: true,   address: "",   showAddress: false,   search: "",   currentLat: "",   currentLng: "",   forceRefresh: 0, };

 getLocationAsync = async (location) => {
  let { status } = await Location.requestForegroundPermissionsAsync() ;// Permissions.askAsync(Permissions.LOCATION);
  if (status !== 'granted') {
    this.setState({
    errorMessage: 'Permission to access location was denied',    });
  }

  let geocode = await Location.reverseGeocodeAsync(location) 

  this.setGeocodeAddress(geocode);
}; 

setGeocodeAddress = (geocode) => {
  if(  geocode)
 { 
    this.setState({
      address: 
    geocode[0].name + ", " +
    geocode[0].city + " " +
    geocode[0].region + " " +
    geocode[0].postalCode  });
  }
  console.log(geocode);

}

goToInitialLocation = (region) => {
     let initialRegion = Object.assign({}, region);
     initialRegion["latitudeDelta"] = 0.002;
     initialRegion["longitudeDelta"] = 0.002;
   this.mapView.animateToRegion(initialRegion, 2000);
};
onRegionChange = (region) => {
    this.setState({
      region: region,      forceRefresh: Math.floor(Math.random() * 100),      },     this.getCurrentAddress//callback
     );

     this.getLocationAsync(region)
   };

 async componentDidMount() {   
   this.getCurrentAddress();
  }

getAddress= () => {
    let _url = prefix+'maps.googleapis.com/maps/api/geocode/json?address=' + this.state.region.latitude+',' +this.state.region.longitude +'&key=' + global.googleMapsKeyAPI;
    console.log(_url);
    fetch(_url,{method: 'POST' }).then((response) => response.json()).then((responseJson) => {
      //console.log(responseJson)
          console.log("ADDRESS GEOCODE is BACK!! => " +
          JSON.stringify(responseJson));
         // console.log(responseJson);
        this.setState(
        { address:      JSON.stringify(responseJson.results[0].formatted_address)
      .replace(/"/g, "")
     });
   });
}
getCurrentAddress() { 
  
 }

 onButtnPressPickAddss= () => {

   this.props.callBackAddress(this.state.address)
   this.props.callBackLocation(this.state.region)
   this.props.callBack()
}
 render(){
   return (
      <View style={styles.map}>

        <MapView
         provider="google"
         ref={(ref) => (this.mapView = ref)}
         onMapReady={() =>
         this.goToInitialLocation(this.state.region)}
         style={styles.map}
         initialRegion={this.state.region}
         onRegionChangeComplete={this.onRegionChange}
       />


     <View style={styles.panel}>
         <View style={styles.panelFill}>   
        </View>
</View>

<View style={styles.markerFixed}>


<Image
  style={styles.marker}
  source={require("./../../assets/images/geopointtransp.png")}/>
</View>

<KeyboardAvoidingView style={styles.footer}>
  <View style={{ flexDirection: "row", margin: 10 }}>

    <Text style={styles.addressText}>Address</Text>
  </View>
<TextInput
  multiline={true}
  clearButtonMode="while-editing"
  style={{
    marginBottom: 5,    paddingLeft:5,    width: "90%",    minHeight: 70,    alignSelf: "center",    borderColor: "lightgrey",    borderWidth: 1.5,    borderRadius: 5,    flex: 0.5,    alignContent: "flex-start",    textAlignVertical: "top",    fontFamily: "Montserrat-Regular",    fontSize: 15,    }}
  onChangeText={(text) => {
    this.setState({ address: text }) 
    console.log(text);
  }
  }
  value={this.state.address}
/>

  <TouchableOpacity
      style={styles.closeButtonMaps }
      onPress={() => {this.onButtnPressPickAddss()}}>  
    <Text style={styles.textStyleClose}>{this.props.buttonText }</Text>
  </TouchableOpacity>        
 </KeyboardAvoidingView>
</View>
      
      )
  }
  }

const styles = StyleSheet.create({
  textStyleClose: {
    color: "white",    fontWeight: "bold",    textAlign: "center"
    },   
  closeButtonMaps: {
    top:20,    
     backgroundColor: "#8B1936",    borderRadius: 10,    padding: 10,    elevation: 2,    width: 170,    shadowColor: "#000",    shadowOffset: {
      width: 0,      height: 2
    },    shadowOpacity: 0.25,    shadowRadius: 3.84,    alignSelf: "center",    
    },  
  mapStyle: {
		top:0,		width: Dimensions.get('window').width,		height: Dimensions.get('window').height,	  },   
map:{
  height:600,  width: 500,  alignSelf: "center",  flex:.85
  },markerFixed: {
  left: "50%",  marginLeft: -24,  marginTop: -48,  position: "absolute",  top: "50%",  },addressText: {
  color: "black",  margin: 3,  height:20,  fontFamily: "Montserrat-Bold",  fontSize: 16, // fontFamily: "Calibri",},footer: {
  backgroundColor: "white",  bottom: 0,  //position: "absolute",  width: "100%",  height: "10%",},panelFill: {
 position: "absolute", top: 0, alignSelf: "stretch", right: 0, left: 0,},panel: {
 position: "absolute", top: 0, alignSelf: "stretch", right: 0, left: 0, flex: 1,},panelHeader: {
//add custom header
},});