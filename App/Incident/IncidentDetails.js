

  import React, { useState, useRef, useEffect } from "react";
  import { Image, StyleSheet, Text, TouchableOpacity, View,ScrollView,TextInput, 
    TouchableHighlight } from "react-native"
  
  import * as ImagePicker from 'expo-image-picker';
  import SwitchSelector from 'react-native-switch-selector';
  import DateTimePickerModal from "react-native-modal-datetime-picker";
  import * as Location from 'expo-location';
  import * as Permissions from 'expo-permissions';
  import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
  import Modal1, { SlideAnimation, ModalContent, ScaleAnimation } from 'react-native-modals';	
  
  import CalendarHeader from "../Headers/CalendarHeader";
  import GooglePlaces from "../Helper/GooglePlaces";
  import formHelper   from "../Helper/Forms";
  
  import ViewShot from "react-native-view-shot";  

  import Moment from 'moment';


  export default class IncidentDetails extends React.Component {

     
     result = ""; 

     openImagePickerAsync = async () => {  // ####
          let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

          if (permissionResult.granted === false) {
            alert('Permission to access camera roll is required!');
            return;
          }
      
          let pickerResult = await ImagePicker.launchImageLibraryAsync({
            base64: true,
            //allowsEditing: false,
            //aspect: [4, 3],
          });
          if (pickerResult.cancelled === true) {
            return;
          }
          
          let _setSelectedImage = ({ localUri: pickerResult.uri });

          this.setState({ setSelectedImage:_setSelectedImage});  
          this.addPicture(pickerResult.uri);
   
          //this.addPicture(pickerResult.uri);
    };
  
  
  
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
            modalVisible: false,
            visible_mod_notLocation: false,
            selectedImage:null, 
            setSelectedImage : null,
            pictureArray : [],
            mode : "pick",
            date: new Date(),  
            modes:'date',
            show:false,
            dateInput: Moment().format('MMM DD YYYY') ,
            timeInput:Moment().format('h:mm:ss a') ,
            locationInput:"Campus " + global.city ,
            pickTitle : "Pick a date",
            medicalNotified:0,
            policeNotified:0,
            notes:"",
            errorMsg:"",
            location:null,
            messages:null,
            geocodeAddress:null,
            injuredPerson:"",
            data:null,
            }
          }

          
      /****************************** */
      _getPhotoLibrary = async () => {
        
       }

  	useEffect = () => {
        if (Platform.OS === 'android' && !Constants.isDevice) {
          setErrorMsg(
          'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
          );
        } else {
          (async () => {
          let { status } = await Location.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
          }
      
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
          })();
        }
        if (this.state.errorMsg) {
          this.setState({ messages: this.state.errorMsg });
          } else {
          //if (this.state.location) {
         // this.setState({ messages: JSON.stringify(this.state.location) });
          
          }
    }

 getLocationAsync = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync() ;// Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        this.setState({
        errorMessage: 'Permission to access location was denied',
        });
      }
      let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Highest});
      
      console.log(global.location)
      global.location = location;
      const { latitude , longitude } = location.coords
     // await this.getGeocodeAsync({latitude, longitude})
      this.setState({ location: {latitude, longitude}});
      let location_=  {latitude, longitude}
      await this.getGeocodeAsync(location_)
      this.setState({location:location_})
  
    };    

  getGeocodeAsync= async (location) => {
    console.log(".....");
    console.log(location);
      let geocode = await Location.reverseGeocodeAsync(location)
      
      this.setState({ geocodeAddress:geocode})
  }

  setGeocodeAddress = () => {
    this.setState({ visible_mod_notLocation: true });
     /* 
       if(  this.state.geocodeAddress)
          {this.setState({
            locationInput: 
            this.state.geocodeAddress[0].name + ", " +
            this.state.geocodeAddress[0].city + " " +
            this.state.geocodeAddress[0].region + " " +
            this.state.geocodeAddress[0].postalCode  
           }) }
      */     
  }

   /****************************** */
   async componentDidMount() {
   
        this.setState({ visible_mod_notLocation: false });
        if(global.injured_report_data ) {
          this.setState({locationInput:global.injured_report_data.locationInput  ,dateInput:global.injured_report_data.dateInput ,timeInput :global.injured_report_data.timeInput , 
            policeNotified:global.injured_report_data.policeNotified ,medicalNotified:global.injured_report_data.medicalNotified , notes:global.injured_report_data.notes , location:global.injured_report_data.location,
            pictureArray:global.injured_report_data.pictureArray ,injuredPerson:global.injured_report_data.injuredPerson})
        }
        console.log(global.injured_report_data)
        await this.getLocationAsync();
        global.location = location;
    }

    addPicture(image){
      let _array = this.state.pictureArray
      if(_array == null ) _array = [];
      if(_array.length === 3){
        alert('You can add up to 3 pictures!');
        return;
      }
      _array.push(image);
      this.setState({pictureArray:_array})
    }
    deletePicture= (index) => {

      let _array = this.state.pictureArray
      _array.splice(index,1);
      this.setState({pictureArray:_array})
    }


  	onTakePicturePress = () => {
      console.log("onTakePicturePress");
      const { navigate } = this.props.navigation
      navigate("TakePicture", {parentPage:this,_onLoadGetUsers :this.props.navigation.state.params._onLoadGetUsers});
    }  

    cancelPick = () => {
      this.setState({ setSelectedImage:null}); 
    }
    savePick = () => {
      this.addPicture(this.state.setSelectedImage.localUri);
      this.cancelPick()
    }

    onChangeDate = ( selectedDate) => {
      const currentDate = selectedDate || this.state.date;
      //this.setState({show:Platform.OS === 'ios'}) ;
      this.setState({date:currentDate}) ;
      this.setState({dateInput:Moment(currentDate).format('MMM DD YYYY')  }) ;
      //this.setState({timeInput:Moment(currentDate).format('h:mm:ss a')  }) ;
      this.setState({show:false})
    }
    onChangeTime = ( selectedTime) => {
      const currentDate = selectedTime || this.state.date;
      //this.setState({show:Platform.OS === 'ios'}) ;
      //this.setState({date:currentDate}) ;
      //this.setState({dateInput:Moment(currentDate).format('MMM DD YYYY')  }) ;
      this.setState({timeInput:Moment(selectedTime).format('h:mm:ss a')  }) ;
      this.setState({show:false})
    }


     showMode = (currentMode) => {
      this.setState({show:true}) ;
      this.setState({modes:currentMode}) ;
    };
  
     showDatepicker = () => {
      this.showMode('date');
      this.setState({ pickTitle:"Pick a date"});
    };
  
     hideDatePicker = () => {
      this.setState({show:false}) ;
    };

     showTimepicker = () => {
      this.showMode('time'); 
      this.setState({ pickTitle:"Pick a time"});
    };
    onBtnBackPressed = () => {
      global.injured_report_data = this.state.data;
      this.props.navigation.goBack()
      }
    onBtnSavePressed = () => {
      let validator = [{name:"Location" , value:this.state.locationInput},{name:"Date" , value:this.state.dateInput},{name:"Time" , value:this.state.timeInput},{name:"Incident details" , value:this.state.notes},  ]
      if (! formHelper.mandatoryValidator(validator) ) return;
      let parameters = {locationInput:this.state.locationInput  ,dateInput:this.state.dateInput ,timeInput :this.state.timeInput , 
        policeNotified:this.state.policeNotified ,medicalNotified:this.state.medicalNotified , notes:this.state.notes , location:this.state.location,
        pictureArray:this.state.pictureArray ,injuredPerson:this.state.injuredPerson, InjuredPersonDetails: this.props.navigation.state.params.data}
        
      this.setState({
        data :parameters
      })
      const { navigate } = this.props.navigation	
		  navigate("ReportedBy", {data:parameters,parentPage:this,_onLoadGetUsers :this.props.navigation.state.params._onLoadGetUsers} )

    };
    onBtnPressCloseModal= () => {
      this.setState({ visible_mod_notLocation: false });
    }

    getAddress= (geoAddress) => {
      this.setState({ locationInput: geoAddress });
    }

    getLocation= (location) => {
      this.setState({ location: location });
    }
    render() { 
  
      //const { date } = this.state;
      const { modalVisible } = this.state; 
        return (
          <View>
                <CalendarHeader
                    instructorName = {global.name}
                    navigation = {this.props.navigation}
                    _onLoadGetUsers = {this.props.navigation.state.params._onLoadGetUsers}
                  />   


                   
                <KeyboardAwareScrollView  behavior={ Platform.OS === 'ios'? 'padding': null}
                     extraHeight = {200}
                      style= {styles.FlexGrowOne}>
                    <ScrollView 
                        style={styles.FlexOne}> 

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
                                    style={styles.txtSubTitleText}>Incident Details</Text>
                            </View>

                            <View  	
                                style={styles.viewLocationRow}> 
                                  <View>
                                    <Text
                                    style={styles.labelInput}>Location * </Text>
                                    <TextInput
                                        clearButtonMode="always"
                                        onChangeText = {(value) => this.setState({locationInput:value})} 
                                        //returnKeyType="go"
                                        autoCorrect={false}
                                        multiline={false}
                                        value={this.state.locationInput}
                                        //defaultValue = {this.state.locationInput}
                                        style={styles.inputTxtLocation}
                                        autoCapitalize="sentences"
                                        placeholder={"Location"}
                                        placeholderTextColor="#999" 
                                        //ref={ref =>  {this._note = ref;}}
                                        //onSubmitEditing= {() =>this._note.focus()}
                                        returnKeyType="done"
                                        />
                                  </View>
                                   
                                 { this.state.geocodeAddress &&  <TouchableOpacity  onPress={this.setGeocodeAddress}>
                                        <Image 
                                          source={require("./../../assets/images/geopoint.png")}
                                          style={styles.buttonPoint}/>
                                    </TouchableOpacity>   }  
                            </View>

                            <View  	
                                style={styles.viewDateTimeRow}> 
                                  <View>
                                    <Text
                                    style={styles.labelInput}>Date *</Text>
                                    <TextInput
                                        //onChangeText = {(currentNote) => this.setState({currentNote})} 
                                        //returnKeyType="go"
                                        autoCorrect={false}
                                        multiline={false}
                                        editable = {false}
                                        //value={this.state.currentNote}
                                        defaultValue = {this.state.dateInput}
                                        style={styles.inputTxtDate}
                                        autoCapitalize="sentences"
                                        placeholder={"Date"}
                                        placeholderTextColor="#999" 
                                        ref={ref =>  {this._note = ref;}}
                                        //onSubmitEditing= {() =>this._note.focus()}
                                        returnKeyType="done"
                                        />
                                  </View>
                                    <TouchableOpacity  onPress={this.showDatepicker}>
                                        <Image 
                                          source={require("./../../assets/images/calendar.png")}
                                          style={styles.buttonPoint}/>
                                    </TouchableOpacity>    
                                    <View
                              style={{
                                  flex: .5,
                              }}/> 
                                    <View>
                                    <Text
                                    style={styles.labelInput}>Time *</Text>
                                    <TextInput
                                        //onChangeText = {(currentNote) => this.setState({currentNote})} 
                                        //returnKeyType="go"
                                        autoCorrect={false}
                                        multiline={false}
                                        editable = {false}
                                        //value={this.state.currentNote}
                                        defaultValue = {this.state.timeInput}
                                        style={styles.inputTxtDate}
                                        autoCapitalize="sentences"
                                        placeholder={"Time"}
                                        placeholderTextColor="#999" 
                                        ref={ref =>  {this._note = ref;}}
                                        //onSubmitEditing= {() =>this._note.focus()}
                                        returnKeyType="done"
                                        />
                                  </View>
                                    <TouchableOpacity  onPress={this.showTimepicker}>
                                        <Image 
                                          source={require("./../../assets/images/clock.png")}
                                          style={styles.buttonPoint}/>
                                    </TouchableOpacity>                             
                            </View>

                            <View  	
                                style={styles.viewNotifiedRow}> 
                                  <View>
                                    <Text
                                    style={styles.labelInput}>Police Notified</Text>
                                    <SwitchSelector
                                      options={options} 
                                      initial={0}
                                      height={30}
                                      //disabled = {true}
                                      value = {this.state.injuredPerson}
                                      valuePadding = {2}
                                      onPress={value => this.setState({ policeNotified: value })}
                                      hasPadding
                                      style={styles.swPoliceNotification}/>
                                  </View>
        
                                <View
                              style={{
                                  flex: .5,
                              }}/> 
                                  <View>
                                    <Text
                                    style={styles.labelInput}>Medical Notified</Text>
                                    <SwitchSelector
                                      options={options} 
                                      initial={0}
                                      height={30}
                                      //disabled = {true}
                                      valuePadding = {2} 
                                      value = {this.state.medicalNotified}
                                      onPress={value => this.setState({ medicalNotified: value })}
                                       //defaultValue  = {this.state.medicalNotified}
                                      //value={this.state.medicalNotified}
                                      hasPadding
                                      style={styles.swPoliceNotification}/>
                                  </View>                            
                            </View>

                            <View  	
                                style={styles.viewNotesRow}> 
                                  <View>
                                    <Text
                                    style={styles.labelInput}>Incident Details *</Text>
                                    <TextInput
                                        //onChangeText = {(currentNote) => this.setState({currentNote})} 
                                        //returnKeyType="go"
                                        clearButtonMode="always"
                                        onChangeText = {(value) => this.setState({notes:value})} 
                                        autoCorrect={false}
                                        multiline={true}
                                        //value={this.state.currentNote}
                                        defaultValue = {this.state.notes}
                                        style={styles.inputTxtNotes}
                                        autoCapitalize="sentences"
                                        placeholder={"(HOW THE INCIDENT HAPPENED,FACTORS LEADING TO THE EVENT,PERSONS INVOLVED,AND WHAT TOOK PLACE.BE AS SPECIFIC AS POSSIBLE.)"}
                                        placeholderTextColor="#999" 
                                        //ref={ref =>  {this._note = ref;}}
                                        //onSubmitEditing= {() =>this._note.focus()}
                                        //returnKeyType="done"
                                        />
                                  </View>
                                  { false &&
                                  <View style={styles.buttonMic}> 
                                      <TouchableOpacity  onPress={this.openImagePickerAsync}>
                                            <Image 
                                              source={require("./../../assets/images/micro.png")}
                                              style={styles.buttonPoint}/>
                                        </TouchableOpacity>  
                                  </View>
                                  }
          
                            </View>

                            <View  	
                                style={styles.viewTitlePictureRow}> 
                                  <View>
                                    <Text
                                    style={styles.labelInput}>Incident Photos </Text>
                                    <Text
                                    style={styles.labelInput1}>You may add up to 3 pictures of the incident </Text>                            
                                  </View>  
                                  <View
                                    style={{
                                            flex: .9,
                                      }}/> 
                                  <TouchableOpacity  onPress={this.openImagePickerAsync}>
                                        <Image 
                                          source={require("./../../assets/images/galery.png")}
                                          style={styles.buttonPicture}/>
                                    </TouchableOpacity>  
                                    <TouchableOpacity  onPress={this.onTakePicturePress}>
                                        <Image 
                                          source={require("./../../assets/images/camera.png")}
                                          style={styles.buttonPicture}/>
                                    </TouchableOpacity>                             
                            </View>


                            <View style={styles.containerPictures}>
                              { this.state.pictureArray && this.state.pictureArray[0] && <View 
                                    style={styles.viewPictures}>
                                    <Image  
                                      source={{uri:this.state.pictureArray[0]}}
                                      style={styles.picture}/>
                                    <TouchableOpacity 
                                        onPress={() => {
                                          this.deletePicture(0);
                                        }}  >
                                      <Image 
                                        source={require("./../../assets/images/trash.png")}
                                        style={styles.pictureDelete}/>
                                    </TouchableOpacity>  
                                </View> }
                                
                                { this.state.pictureArray && this.state.pictureArray[1] && <View 
                                  style={styles.viewPictures}>
                                    <Image 
                                      source={{uri:this.state.pictureArray[1]}}
                                      style={styles.picture}/>
                                      <TouchableOpacity 
                                        onPress={() => {
                                          this.deletePicture(1);
                                        }}  >
                                      <Image 
                                      source={require("./../../assets/images/trash.png")}
                                        style={styles.pictureDelete}/>
                                    </TouchableOpacity>  
                                </View>}

                                { this.state.pictureArray && this.state.pictureArray[2] && <View 
                                  style={styles.viewPictures}>
                                    <Image 
                                      source={{uri:this.state.pictureArray[2]}}
                                      style={styles.picture}/>
                                    <TouchableOpacity 
                                        onPress={() => {
                                          this.deletePicture(2);
                                        }}  >
                                      <Image 
                                        source={require("./../../assets/images/trash.png")}
                                        style={styles.pictureDelete}/>
                                    </TouchableOpacity>  
                                </View>   }                     
                            </View> 

                            <View  	
                                style={styles.viewPersonInjuredRow}> 
                                  <View>
                                    <Text
                                    style={styles.labelInput}>Name of Person who Injured Students/Staff</Text>
                                    <TextInput
                                         clearButtonMode="always"
                                        onChangeText = {(value) => this.setState({injuredPerson:value})} 
                                        //returnKeyType="go"
                                        autoCorrect={false}
                                        multiline={false}
                                        value={this.state.injuredPerson}
                                        //defaultValue = {this.state.locationInput}
                                        style={styles.inputTxtInjuredPerson}
                                        autoCapitalize = "words"
                                        placeholder={"Name"}
                                        placeholderTextColor="#999" 
                                        //ref={ref =>  {this._note = ref;}}
                                        //onSubmitEditing= {() =>this._note.focus()}
                                        returnKeyType="done"
                                        />
                                    <TouchableOpacity
                                      onPress={this.onBtnSavePressed}
                                      style={styles.btnSaveButton}>
                                      <Text
                                        style={styles.btnSaveButtonText}>Save & Continue</Text>
                                  </TouchableOpacity>      
                                  </View>
          
                            </View>

                            <View>    
                                <DateTimePickerModal
                                isVisible={this.state.show}
                                headerTextIOS = {this.state.pickTitle}
                                  onConfirm={(date) => {
                                    
                                    if(this.state.modes == "date"){
                                      this.onChangeDate(date);
                                    }else{
                                      this.onChangeTime(date);
                                    }
                                    this.setState({ date: date });
                                  }
                                } 

                              //   onConfirm={this.onChangeDate}
                                  onCancel={this.hideDatePicker}

                                  value={this.state.date}
                                  mode={this.state.modes}
                                  is24Hour={true}
                                  display="default"
                                  //onChange={this.onChangeDate}
                                />
                          </View> 
                      </ScrollView>
                 </KeyboardAwareScrollView>

                 <Modal1
                    onTouchOutside={() => {
                      this.setState({ visible_mod_notLocation: false });
                      }}
                    visible={this.state.visible_mod_notLocation}
                    animationDuration = {500}
                    modalAnimation={

                      new ScaleAnimation({
                        initialValue: 0, // optional
                        useNativeDriver: true, // optional
                        })
                    }
                    >
                    <ModalContent style={styles.viewModalContenMaps}  >
                      <View 
                        style={styles.ClockInLocationText}>
                        <Text >Location</Text>

                      </View>

                          <Text style={styles.txtPopUpClockInText} >Move the map to set address</Text>


                          <GooglePlaces
                             location = {this.state.location}
                             buttonText="Pick Address"
                             callBack = {this.onBtnPressCloseModal}
                             callBackAddress = {this.getAddress}
                             callBackLocation = {this.getLocation}
                             

                          />

                    </ModalContent>
                  </Modal1>


             </View>
        );   
      
  

   

 
    }
    
  }
  
  const options = [
    { label: 'No', value: 0 , activeColor:'#999'},
    { label: 'Yes', value: 1, activeColor:'#8B1936' }
  ];
  const styles = StyleSheet.create({



	  textStyleClose: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
      }, 
	  closeButtonMaps: {
      top:310,
      backgroundColor: "#F194FF",
      borderRadius: 10,
      padding: 10,
      elevation: 2,
      width: 170,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      marginBottom:50,
      
      },
	  textStyle: {
      color: "#8B1936",
      fontWeight: "bold",
      textAlign: "center"
      },
    txtPopUpCanSignText: {
      backgroundColor: "transparent",
      color: "black",
      fontFamily: "Montserrat-Regular",
      fontSize: 13,
      fontStyle: "normal",
      fontWeight: "normal",
      textAlign: "center",
      padding: 10,
      top: 270,
      //position: "absolute",
    },    
    mapContainer: {
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      },   
    txtPopUpClockInText: {
      backgroundColor: "transparent",
      color: "#8B1936",
      fontFamily: "Montserrat-Bold",
      fontSize: 24,
      fontStyle: "normal",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 33,
    },
    viewPopUpLineView: {
      backgroundColor: "rgb(184, 184, 184)",
      flex: 1,
      height: 1,
      //marginTop: 25,
      width: 660,
      position: "absolute",	
    },  
    viewModalContenMaps: {
      backgroundColor: "transparent",
      alignItems: "center",
      width: 520,
      height: 700,
    }, 
    modalPopUpClockInLocationText: {
      color: "rgb(153, 153, 153)",
      fontFamily: "Montserrat-Regular",
      fontSize: 24,
      fontStyle: "normal",
      fontWeight: "normal",
      textAlign: "center",
      marginTop: 23,
      position: "absolute",
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
      top: 0,
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
        flex : 1
    },    
    btnSaveButton: {
      backgroundColor: "rgb(139, 25, 54)",
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
    btnSaveButtonText: {
      color: "white",
      fontFamily: "Montserrat-Bold",
      fontSize: 14,
      fontStyle: "normal",
      fontWeight: "bold",
      textAlign: "left",
    },    
    swPoliceNotification: {
      backgroundColor: "transparent",
      borderStyle: "solid",
      width: 130,
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
    viewLocationRow:{
      //position: "absolute",
      //top:170,
      backgroundColor: "transparent",
      marginLeft: 33,
      marginTop:20,
      width: 700,
      flexDirection: "row",
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
    viewNotesRow   :{
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
    viewPersonInjuredRow   :{
     // position: "absolute",
      //top:882,
      marginTop:30,       
      backgroundColor: "transparent",
      marginLeft: 33,
      width: 700,
      flexDirection: "row",
      alignItems: "center",
    },  
    containerPictures: {
      backgroundColor: 'transparent',
      flexDirection: "row",
      width: "90%",
    },  
    
    inputTxtLocation: {
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
      width: 600,
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

    inputTxtNotes: {
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
      height: 225, 
      width: 670,
    },    
    inputTxtDate: {
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
      paddingLeft:40,
      height: 35,
      width: 243,
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
    labelInput: {
      color: "#272727",
      fontFamily: "Montserrat-Regular",
      fontSize: 15,
      fontStyle: "normal",
      textAlign: "left",
      backgroundColor: "transparent",
     // marginLeft: 286,
      marginBottom: 5,
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
      width: 30,
      height: 30,
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