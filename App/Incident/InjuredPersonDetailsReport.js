

  import React, { useState, useRef, useEffect } from "react";
  import { Image, StyleSheet, Text, TouchableOpacity, View,ScrollView,Dimensions,ActivityIndicator  } from "react-native"
  import MapView, { Marker } from 'react-native-maps';
  import * as Location from 'expo-location';
  import CalendarHeader from "../Headers/CalendarHeader";
  import SendIncidentReport from "../Helper/SendIncidentReport";
  
  import ViewShot from "react-native-view-shot";  


  

  export default class InjuredPersonDetailsReport extends React.Component {


    static navigationOptions = ({ navigation }) => {
      
        const { params = {} } = navigation.state
        return {
            header: null,
            headerLeft: null,
            headerRight: null,
          }
      }
  


    constructor(props) {
      super(props);
          this.state = {

            arrayImageB64 : [],
            arB64:[],
            data:this.props.navigation.state.params.data,
            reportedByInput:"", 
            phoneNumberReportedInput:"",
            personTypeInput:2,
            geocode:null,
            location:this.props.navigation.state.params.data.reportedBy.location,
            witnesses:[
               {
                name:"",
                phoneNumbre:""
               } 
            ],
            _waiting: false,
            mapImage : "",
            }
          }

          

   /****************************** */

  addWitnees = () => {
    let _array = this.state.witnesses
    _array.push(               
           {
            name:"",
            phoneNumbre:""
           } );
    this.setState({witnesses:_array})
   }

   async componentDidMount() {

     global.arrImages64 = []
      let geocode = await Location.reverseGeocodeAsync(this.state.location)
      this.setState({ geocode:geocode})

      this.refs.viewShot.capture().then(uri => {
        this.setState({mapImage:uri})
       
      });
      
    }
	onBtnBackPressed = () => { 
        global.injured_report_data = this.state.data;
		this.props.navigation.goBack() 
    }
    
    onBtnsendPressed = (value) => { 
       this.setState({_waiting : value})
    }
    onSuccessSentReport = () => {   
      const { navigate } = this.props.navigation
      navigate("Shift",{_onLoadGetUsers :this.props.navigation.state.params._onLoadGetUsers})
    }

    render() {
  
      //const { date } = this.state;
     
        return (
          <View>
                <CalendarHeader
                    instructorName = {global.name}
                    navigation = {this.props.navigation}
                    _onLoadGetUsers = {this.props.navigation.state.params._onLoadGetUsers}
                  />
      <ScrollView 
        style={styles.FlexGrowOne}>               
              <View>
                    <TouchableOpacity
                          onPress={this.onBtnBackPressed}
                          style={styles.btnbackButton}>
                          <Text
                            style={styles.btnbackButtonText}>Back</Text>
                    </TouchableOpacity>   
                    <View 
                    style={styles.viewTitleRow}>  
                        <Text
                            style={styles.txtTitleText}>Incident Report</Text>
                    </View>         
                    <View 
                       style={styles.viewSubTitleRow}>            
                        <Text
                            style={styles.txtSubTitleText}>Injured Person Details</Text>
                    </View>

                            <View  	
                                style={styles.viewCol1Row}> 
                                   
                                    <Text
                                    style={styles.labelAll}>Name</Text>
                                    <Text style={styles.labelData}>
                                        {this.state.data.reportedBy.InjuredPersonDetails.nameInput}
                                    </Text>
                            </View>
                            <View  	
                                style={styles.viewCol1Row}> 
                                    <Text
                                    style={styles.labelAll}>Phone Number</Text>
                                    <Text style={styles.labelData}>
                                        {this.state.data.reportedBy.InjuredPersonDetails.phoneNumberInput}
                                    </Text>
                                    <View
                                        style={{
                                            flex: .5,
                                        }}/> 
                                    <View  style={styles.viewCol2Row}>
                                        <Text
                                        style={styles.labelAll}>Email</Text>
                                        <Text style={styles.labelData}>
                                            {this.state.data.reportedBy.InjuredPersonDetails.emailInput}
                                        </Text>
                                    </View>
                            </View>
                            <View  	
                                style={styles.viewCol1Row}> 
                                    <Text
                                    style={styles.labelAll}>Mailing Address</Text>
                                    <Text style={styles.labelData} numberOfLines = { 2 }>
                                        {this.state.data.reportedBy.InjuredPersonDetails.addressInput}
                                    </Text>
                            </View>

                            <View
						       style={styles.lineNoteView}/>

                            <View 
                            style={styles.viewSubTitleRow}>            
                                <Text
                                    style={styles.txtSubTitleText}>Incident Details</Text> 
  
                            </View>
                                  
                            <View  	
                                style={styles.viewCol1Row}> 
                                    <View >
                                        <Text
                                        style={styles.labelAll}>Location</Text>
                                        <View style={{
                                                width: 363,
                                                height:40,
                                                backgroundColor:"transparent",
                                            }}>
                                           <Text style={styles.labelLocation}
                                                  numberOfLines = { 2 }
                                           > 
                                              {this.state.data.reportedBy.locationInput} </Text>
                                        </View>
                                    </View>            
                            </View>

                            <View  	
                                style={styles.viewCol1Row}> 
                                <ViewShot ref="viewShot" options={{ format: "jpg", quality: 1 }}>
                                    <MapView style={styles.mapStyle}
                                        provider="google"
                                        region={{  
                                            latitude:  (this.state.location ? this.state.location.latitude :0) ,
                                            longitude: (this.state.location ? this.state.location.longitude :0), 
                                            latitudeDelta: 0.0038,
                                            longitudeDelta: 0.0038
                                        }}>                
                                            <Marker coordinate={{latitude: (this.state.location ? this.state.location.latitude :0),longitude:(this.state.location ? this.state.location.longitude :0)}}
                                                title= { global.city } //(geocode  ? geocode[0].city + " " +geocode[0].isoCountryCode  : "" ) } 
                                                pinColor = "blue"
                                                icon = {require("./../../assets/images/phleico1.png")}
                                            >
                                            </Marker>

                                            <Marker coordinate={{latitude: (this.state.location ? this.state.location.latitude :0),longitude:(this.state.location ? this.state.location.longitude :0)}}
                                                title= { (this.state.geocode  ? this.state.geocode[0].city + " " +this.state.geocode[0].isoCountryCode  : "" ) } >
                                            </Marker>
                                        </MapView>
                                </ViewShot>
                            </View>	

                            <View  style={{
                                        top:270,
                                        left:450,
                                        position: "absolute",
                                    }}>
                                   <View  style={styles.secondColumn}>
                                        <Text
                                        style={styles.labelAll}>Date</Text>
                                        <Text style={styles.labelData}>
                                            {this.state.data.reportedBy.dateInput}
                                        </Text>
                                    </View>
                                    <View  style={styles.secondColumn}>
                                        <Text
                                        style={styles.labelAll}>Time</Text>
                                        <Text style={styles.labelData}>
                                            {this.state.data.reportedBy.timeInput}
                                        </Text>
                                    </View>
                                    <View  style={styles.secondColumn}>
                                        <Text
                                        style={styles.labelAll}>Police Notified</Text>
                                        <Text style={styles.labelData}>
                                        { (this.state.data.reportedBy.policeNotified === 1?"Yes":"No")  }
                                           
                                        </Text>
                                    </View>
                                    <View  style={styles.secondColumn}>
                                        <Text
                                        style={styles.labelAll}>Medical Notified</Text>
                                        <Text style={styles.labelData}>
                                          
                                            { (this.state.data.reportedBy.medicalNotified === 1?"Yes":"No")  }
                                        </Text>
                                    </View>                              
                            </View>
                            <View
                                style={{
                                    height: 10,
                                }}/> 
                            <View style={styles.viewCol1Row}> 
                                <View  	
                                      style={styles.viewCol50LeftRow}>  
                                   <Text
                                    style={styles.labelAll}>Incident Details</Text>
                                </View>
                                <View  	
                                    style={styles.viewCol50RightRow}>  
                                    <Image 
                                        source={require("./../../assets/images/rrs.png")}
                                        style={styles.buttonPicture}/>  
                                    </View>            
                            </View>                       
                            <View  	                           
                                style={styles.viewCol1Row}> 
                                <View>
                                        <Text style={styles.labelDataNote}>
                                                {this.state.data.reportedBy.notes}
                                        </Text>
                                       
                                </View>  
                            </View> 
                            <View
                              style={{
                                height: 10,
                              }}/>                             
                            <View  	
                                style={styles.viewCol1Row}> 
                                  
                                    <Text
                                    style={styles.labelAll}>Name of Person who Injured Students/Staff</Text>
                                    <Text style={styles.labelData}>
                                        {this.state.data.reportedBy.injuredPerson}
                                    </Text>
                            </View>     

                            <View  	
                                style={styles.viewCol1Row}> 
                                  
                                    <Text
                                    style={styles.labelAll}>Incident Photos</Text>
                            </View>   

                            <View style={styles.containerPictures}>
                              { this.state.data.reportedBy.pictureArray && this.state.data.reportedBy.pictureArray[0] && <View 
                                    style={styles.viewPictures}>
                                    <Image  
                                      source={{uri:this.state.data.reportedBy.pictureArray[0]}}
                                      style={styles.picture}/>
                                </View> }
                                
                                { this.state.data.reportedBy.pictureArray && this.state.data.reportedBy.pictureArray[1] && <View 
                                  style={styles.viewPictures}>
                                    <Image 
                                      source={{uri:this.state.data.reportedBy.pictureArray[1]}}
                                      style={styles.picture}/>

                                </View>}

                                {this.state.data.reportedBy.pictureArray &&  this.state.data.reportedBy.pictureArray[2] && <View 
                                  style={styles.viewPictures}>
                                    <Image 
                                      source={{uri:this.state.data.reportedBy.pictureArray[2]}}
                                      style={styles.picture}/> 
                                </View>   }                     
                            </View> 
                            <View
						       style={styles.lineNoteView}/>

                            <View 
                                style={styles.viewSubTitleRow}>            
                                    <Text
                                        style={styles.txtSubTitleText}>Reported by</Text> 
                            </View>
                            <View  	
                                style={styles.viewCol1Row}> 
                                    <Text
                                    style={styles.labelAll}>Name</Text>
                                    <Text style={styles.labelData}>
                                        {this.state.data.reportedByInput}
                                    </Text>
                                    <View
                                        style={{
                                            flex: .6,
                                        }}/> 
                                    <View  style={styles.viewCol2Row}>
                                        <Text
                                        style={styles.labelAll}>
                                            { (this.state.data.personTypeInput == 0?"Student":"Staff")  }
                                            </Text>

                                    </View>
                            </View>
                            <View  	
                                style={styles.viewCol1Row}> 
                                    <Text
                                    style={styles.labelAll}>Phone Number</Text>
                                    <Text style={styles.labelData}>
                                        {this.state.data.phoneNumberReportedInput}
                                    </Text>
                                    <View
                                        style={{
                                            flex: .6,
                                        }}/> 

                            </View>

                            <View
                              style={{
                                  flex: .5,
                              }}/> 
                            <View 
                                style={styles.viewSubTitleWitnesRow}>            
                                <Text
                                    style={styles.txtSubTitleText}>Witnesses</Text>
                            </View>

                            <ChildElementWitneesClass  result={this.state.data.witnesses}  />     
                            <View  	
                                style={styles.viewBootnSaveRow}>                                
      
                            </View>
                            <SendIncidentReport
                               pictureFileArray = {this.state.data.reportedBy.pictureArray}
                               dataReport = {this.state.data}
                               btnsendPressedFunction = {this.onBtnsendPressed}
                               successSentReport = {this.onSuccessSentReport} 
                               mapViewCapture = {this.state.mapImage}
                            />
                    </View>
                    <View
                        style={{
                            height:123
                        }}/>  
               </ScrollView>       
               <View  style={[styles.containerWait, !this.state._waiting ? styles.containerHiddend : {}]}>
                      <ActivityIndicator size="large" color="#ffff"  />    
			         </View>	 

        </View>     
        );   
 
    }
    
  }


export class ChildElementWitneesClass extends React.Component{ 
	
	constructor(props) {
		super(props);
		this.state = {
			dump:0,
		};
	}

	render(){
		if(this.props.result){  

			let index = 0;
		    var res = this.props.result.map((item,i)=>{ 

				return(		  
                        <View key={i}
                            style={styles.viewWitnessRow}>            
                            <View  	
                                style={styles.viewCol1Row}> 
                                    <Text
                                    style={styles.labelAll}>Name</Text>
                                    <Text style={styles.labelData}>
                                        {item.name}
                                    </Text>
                                    <View
                                        style={{
                                            flex: .5,
                                        }}/> 
                                    <View  style={styles.viewCol2Row}>
                                        <Text
                                        style={styles.labelAll}>Phone Number</Text>
                                        <Text style={styles.labelData}>
                                            {item.phoneNumbre}
                                        </Text>
                                    </View>
                            </View>
                        </View>  	
					)
			});
			
		}

		return ( 
			<View>{res}</View> 
		)
		index ++;
		console.log(index);
     }


}
  
  const options = [
    { label: 'Student', value: 1 , activeColor:'#999'},
    { label: 'Staff', value: 2, activeColor:'#8B1936' }
  ];
  const styles = StyleSheet.create({
    containerWait: {
      backgroundColor : 'rgba(0,0,0,0.4)',
      flex: 1,
      justifyContent: "center",
      flexDirection: "row",
      top:0,
      left:0,
      position: "absolute",
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      zIndex: 1,
      },
      containerHiddend: {
      left:1000,
      },
    containerPictures: {
        backgroundColor: 'transparent',
        flexDirection: "row",
        width: "100%",
      },     
      viewPictures: {
        backgroundColor: 'transparent',
        padding: 10,
        alignItems: "center",
      },           
	mapContainer: {
		backgroundColor: '#fff',
        marginLeft:35,
      },   
	  mapStyle: {
		top:0,
		width: 380,//Dimensions.get('window').width,
		height: 170,//Dimensions.get('window').height,

	  },         
    secondColumn: {
            alignSelf: "flex-end",
             width: 351,
             flexDirection: "row",
             marginBottom:15,
    },
	lineNoteView: {
		backgroundColor: "rgb(184, 184, 184)",
		height: 1,
        marginTop: 19,
        width: 700,
        alignSelf: "center",      
	},      
    btnAddButtonImage: {
		resizeMode: "cover",
		backgroundColor: "transparent",
		width: 18,
		height: 18,
		//marginTop: 9,
		right: -8,
	},
    btnbackButton: {
        backgroundColor: "rgb(139, 25, 54)",
        borderRadius: 16.5,
        shadowColor: "rgba(0, 0, 0, 0.16)",
        shadowRadius: 12,
        shadowOpacity: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        alignSelf: "flex-start",
        width: 113,
        height: 33,
        marginRight: 20,
        marginTop: 29,
        top: 63,
        right: 15,
        position: "absolute",	
        zIndex: 1,
      },
      btnbackButtonText: {
        color: "white",
        fontFamily: "Montserrat-Bold",
        fontSize: 16,
        fontStyle: "normal",
        fontWeight: "bold",
        textAlign: "left",
      },   
  
    
    FlexGrowOne: {
      flexGrow : 1
    },
    FlexOne: {  
        flex : 2
    },    

    btnAddButton: {
        backgroundColor: "#2C89C7",
        borderRadius: 16.5,
        shadowColor: "rgba(0, 0, 0, 0.16)",
        shadowRadius: 12,
        shadowOpacity: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        alignSelf: "center",
        width: 173,
        height: 33,
       // marginRight: 20,
        marginTop: 19,
      },
 
    btnAddButtonText: {
        color: "white",
        fontFamily: "Montserrat-Bold",
        fontSize: 14,
        fontStyle: "normal",
        fontWeight: "bold",
        textAlign: "left",
      },   
    swPersonType: {
      backgroundColor: "transparent",
      borderStyle: "solid",
      width: 150,
      height: 21,
      marginLeft: 10,
      marginTop: 0,
    },   
    viewTitleRow:{
      //position: "absolute",
      //top:170,
      backgroundColor: "transparent",
      marginLeft: 33,
      marginTop:30,
      width: 700,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },   
    viewSubTitleRow:{
      //position: "absolute",
      //top:170,
      backgroundColor: "transparent",
      marginLeft: 33,
      marginTop:10,
      width: 700,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },   
    viewSubTitleWitnesRow:{
        backgroundColor: "transparent",
        marginLeft: 23,
        marginTop:40,
        width: 700,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      },      
    viewWitnessRow:{
        backgroundColor: "transparent",
        marginLeft: 23,
        marginTop:10,
        width: 700,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      },             
    viewCol1Row:{
      backgroundColor: "transparent",
      marginLeft: 33,
      marginTop:10,
      width: 700,
      flexDirection: "row",
    },
    viewCol2Row:{
        backgroundColor: "transparent",
        marginLeft: 33,
        marginTop:0,
        //width: 700,
        flexDirection: "row",
      },  
      viewCol50RightRow:{
        backgroundColor: "transparent",
        right: 0,
        marginTop:0, 
        alignItems: "flex-end",
        width: "50%",
        //flexDirection: "row",
      },         
      viewCol50LeftRow:{
        backgroundColor: "transparent",
        right: 0,
        marginTop:0, 
        alignItems: "flex-start",
        width: "50%",
        //flexDirection: "row",
      },  
    viewDateTimeRow:{
      //position: "absolute",
      //top:270,
      marginTop:30,
      backgroundColor: "transparent",
      marginLeft: 33,
      width: 700,
      flexDirection: "row",
    },
    viewNotifiedRow:{
      //position: "absolute",
      //top:370,
      marginTop:30,
      backgroundColor: "transparent",
      marginLeft: 33,
      width: 700,
      flexDirection: "row",
    }, 
    viewAddressRow   :{
     // position: "absolute",
     // top:450,
      marginTop:30,     
      backgroundColor: "transparent",
      marginLeft: 33,
      width: 700,
      flexDirection: "row",
    }, 
    viewTitlePictureRow    :{
      //position: "absolute",
      //top:712,
      marginTop:30,       
      backgroundColor: "transparent",
      marginLeft: 33,
      width: 700,
      flexDirection: "row",
    },   
    viewBootnSaveRow   :{
     // position: "absolute",
      //top:882,
      marginTop:30,       
      backgroundColor: "transparent",
      marginLeft: 33,
      width: 700,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },  
    containerPictures: {
      backgroundColor: 'transparent',
      //position: "absolute",
      flexDirection: "row",
      //top: 750,
      width: "90%",
      //alignItems: "flex-start",
      //justifyContent: "center",
    },  
    
    inputTxtName: {
      backgroundColor: "white",
      borderWidth: 1,
      borderColor: "rgb(112, 112, 112)",
      borderStyle: "solid",
      paddingLeft:5,
      color: "black",
      fontFamily: "Montserrat-Regular",
      fontSize: 14,
      fontStyle: "normal",
      fontWeight: "normal",
      textAlign: "left",
      alignSelf: "stretch",
      height: 35, 
      width: 670,
    },
    inputTxtWitnessName: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "rgb(112, 112, 112)",
        borderStyle: "solid",
        paddingLeft:5,
        color: "black",
        fontFamily: "Montserrat-Regular",
        fontSize: 14,
        fontStyle: "normal",
        fontWeight: "normal",
        textAlign: "left",
        alignSelf: "stretch",
        height: 35, 
        width: 410,
      },
    inputTxtInjuredPerson: {
      backgroundColor: "white",
      borderWidth: 1,
      borderColor: "rgb(112, 112, 112)",
      borderStyle: "solid",
      paddingLeft:5,
      color: "black",
      fontFamily: "Montserrat-Regular",
      fontSize: 14,
      fontStyle: "normal",
      fontWeight: "normal",
      textAlign: "left",
      alignSelf: "stretch",
      height: 35, 
      width: 670,
    },

    inputTxtAddress: {
      backgroundColor: "white",
      borderWidth: 1,
      borderColor: "rgb(112, 112, 112)",
      borderStyle: "solid",
      paddingLeft:5,
      color: "black",
      fontFamily: "Montserrat-Regular",
      fontSize: 14,
      fontStyle: "normal",
      fontWeight: "normal",
      textAlign: "left",
      alignSelf: "stretch",
      height: 75, 
      width: 670,
    },    
    inputTxtPhoneNumber: {
      backgroundColor: "white",
      borderWidth: 1,
      borderColor: "rgb(112, 112, 112)",
      borderStyle: "solid",
      paddingLeft:5,
      color: "black",
      fontFamily: "Montserrat-Regular",
      fontSize: 14,
      fontStyle: "normal",
      fontWeight: "normal",
      textAlign: "left",
      alignSelf: "stretch",
      paddingLeft:10,
      height: 35,
      width: 300,
    },   
    inputTxtWitnessPhoneNumber: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "rgb(112, 112, 112)",
        borderStyle: "solid",
        paddingLeft:5,
        color: "black",
        fontFamily: "Montserrat-Regular",
        fontSize: 14,
        fontStyle: "normal",
        fontWeight: "normal",
        textAlign: "left",
        alignSelf: "stretch",
        paddingLeft:10,
        height: 35,
        width: 260,
      },

    inputTxtEmail: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "rgb(112, 112, 112)",
        borderStyle: "solid",
        paddingLeft:5,
        color: "black",
        fontFamily: "Montserrat-Regular",
        fontSize: 14,
        fontStyle: "normal",
        fontWeight: "normal",
        textAlign: "left",
        alignSelf: "stretch",
        paddingLeft:10,
        height: 35,
        width: 300,
      },        
    txtTitleText: {
      //position: "absolute",
      //top:70,
      color: "rgb(139, 25, 54)",
      fontFamily: "Montserrat-Bold",
      fontSize: 24,
      fontStyle: "normal",
      fontWeight: "bold",
      //textAlign: "left",
      //alignSelf: "center",
      backgroundColor: "transparent",
      //marginLeft: 70,
      //marginTop: 80,
    }, 
    txtSubTitleText: {
      color: "#272727",
      //position: "absolute",
      //top:110,
      fontFamily: "Montserrat-Bold",
      fontSize: 18,
      fontStyle: "normal",
      fontWeight: "bold",
     // textAlign: "left",
      backgroundColor: "transparent",
     // marginLeft: 286,
      //marginTop: 80,
    },        
    labelAll: {
      color: "#272727",
      fontFamily: "Montserrat-Bold",
      fontSize: 15,
      fontStyle: "normal",
      textAlign: "left",
      backgroundColor: "transparent",
     // marginLeft: 286,
      marginBottom: 5,
    },     
    labelData: {
        color: "#272727",
        fontFamily: "Montserrat-Regular",
        fontSize: 15,
        fontStyle: "normal",
        textAlign: "left",
        backgroundColor: "transparent",
        marginLeft: 15,
        marginBottom: 5,
      }, 
      labelLocation: {
        color: "#272727",
        fontFamily: "Montserrat-Regular",
        fontSize: 15,
        fontStyle: "normal",
        textAlign: "left",
        backgroundColor: "transparent",
        marginLeft: 15,
        marginBottom: 5,
        height : 45,
      },       
    labelDataNote: {
        color: "#272727",
        fontFamily: "Montserrat-Regular",
        fontSize: 15,
        fontStyle: "normal",
        textAlign: "left",
        backgroundColor: "transparent",
        marginLeft: 15,
        marginBottom: 5,
        width: 680,
      },        
    controlPreview: {
      position: "absolute",
      flexDirection: "row",
      top: 38,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    },   
    buttonPoint : {
      resizeMode: "contain",
      height: 35,
      shadowColor: "gray",
      shadowOffset: { height: 3, width: 3 },
      shadowOpacity: 0.4,
      shadowRadius: 0.2,  
      top:23,  
    },
    buttonPicture : {
      resizeMode: "contain",
      height: 35,
      marginLeft:20, 
      top:5,  
    },    
    buttonMic : {
      top:190,  
      left:-38,
    },   
    buttonShadow: {
      width: 60,
      height: 60,
      shadowColor: "gray",
      shadowOffset: { height: 3, width: 3 },
      shadowOpacity: 0.8,
      shadowRadius: 0.2    
    },
    viewPictures: {
      backgroundColor: 'transparent',
      padding: 10,
      alignItems: "center",
    },    
    picture: {
      backgroundColor: 'transparent',
      top:0,
      width: 150,
      height: 80,
      shadowColor: "gray",
      shadowOffset: { height: 4, width: 1 },
      shadowOpacity: 0.8,
      shadowRadius: 0.4,   
      resizeMode: 'contain', 
    },  
    pictureDelete: {
      backgroundColor: 'transparent',
      shadowColor: "gray",
      shadowOffset: { height: 1, width: .5 },
      shadowOpacity: 0.3,
      shadowRadius: 0.1,   
      resizeMode: 'contain', 
      top:9,
    },   
        
    control: {
      //position: "absolute",
      flexDirection: "row",
      //bottom: 38,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    },    
    container: {
      flex: 1,
      backgroundColor: "rgb(239, 239, 244)",
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      width: 305,
      height: 159,
      marginBottom: 20,
    },
    instructions: {
      color: '#888',
      fontSize: 18,
      marginHorizontal: 15,
      marginBottom: 10,
    },
    button: {
      backgroundColor: 'blue',
      padding: 20,
      borderRadius: 5,
    },
    buttonText: {
      fontSize: 20,
      color: '#fff',
    },
    thumbnail: {
      width: "70%",
      height: "70%",
      resizeMode: 'contain',
    },
    

  });