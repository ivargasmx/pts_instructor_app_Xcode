

  import React, { useState, useRef, useEffect } from "react";
  import { Image, StyleSheet, Text, TouchableOpacity, View,TextInput } from "react-native"
  import CalendarHeader from "../Headers/CalendarHeader";

  import formHelper   from "../Helper/Forms";


  export default class InjuredPersonDetails extends React.Component {

   
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
            data:null,
            nameInput:"",
            phoneNumberInput:"",
            emailInput:"",
            addressInput:"",
            }
          }

          

   /****************************** */
   async componentDidMount() {
    
    }
	onBtnBackPressed = () => {
    global.injured_report_data = null;
    global.screen = "Classroom"
		this.props.navigation.goBack()
    }

    
    onBtnSavePressed = () => {
      
      let validator = [{name:"Name" , value:this.state.nameInput},{name:"Phone Number" , value:this.state.phoneNumberInput},{name:"Email address" , value:this.state.emailInput},  ]
      
      if (! formHelper.mandatoryValidator(validator) ) return;

      let parameters = {nameInput:this.state.nameInput  ,phoneNumberInput:this.state.phoneNumberInput ,emailInput :this.state.emailInput , addressInput:this.state.addressInput }

      this.setState({
        data : parameters     })
		  const { navigate } = this.props.navigation	
		  navigate("IncidentDetails", {data:parameters,_onLoadGetUsers :this.props.navigation.state.params._onLoadGetUsers} )

    };
    render() {
  
      //const { date } = this.state;
     
        return (
          <View>
                <CalendarHeader
                    instructorName = {global.name}
                    navigation = {this.props.navigation}
                    _onLoadGetUsers = {this.props.navigation.state.params._onLoadGetUsers}
                  />
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
                                style={styles.viewNameRow}> 
                                  <View>
                                    <Text
                                    style={styles.labelInput}>Name *</Text>
                                    <TextInput
                                       clearButtonMode="always"
                                        onChangeText = {(value) => this.setState({nameInput:value})} 
                                        //returnKeyType="go"
                                        autoCorrect={false}
                                        multiline={false}
                                        value={this.state.nameInput}
                                        style={styles.inputTxtName}
                                        autoCapitalize = "words"
                                        placeholder={"Name"}
                                        placeholderTextColor="#999" 
                                        returnKeyType="done"
                                        />
                                  </View>
    
                            </View>

                            <View  	
                                style={styles.viewDateTimeRow}> 
                                  <View>
                                    <Text
                                    style={styles.labelInput}>Phone Number *</Text>
                                    <TextInput
                                        clearButtonMode="always"
                                        onChangeText = {(value) => this.setState({phoneNumberInput:value})} 
                                        //returnKeyType="go"
                                        keyboardType= "phone-pad" // "email-address"
                                        autoCompleteType = {"tel"}
                                        autoCorrect={false}
                                        multiline={false}
                                        defaultValue = {this.state.phoneNumberInput}
                                        style={styles.inputTxtPhoneNumber}
                                        autoCapitalize="sentences"
                                        placeholder={"Phone Number"}
                                        placeholderTextColor="#999" 
                                        ref={ref =>  {this._note = ref;}}
                                        returnKeyType="done"
                                        />
                                  </View>  
                                    <View
                              style={{
                                  flex: .7,
                              }}/> 
                                    <View>
                                    <Text
                                    style={styles.labelInput}>Email *</Text>
                                    <TextInput
                                        clearButtonMode="always"
                                        onChangeText = {(value) => this.setState({emailInput:value})} 
                                        //returnKeyType="go"
                                        autoCorrect={false}
                                        multiline={false}
                                        editable = {true}
                                        autoCompleteType = {"email"}
                                        //value={this.state.currentNote}
                                        keyboardType= "email-address"
                                        defaultValue = {this.state.emailInput}
                                        style={styles.inputTxtEmail}
                                        autoCapitalize="none"
                                        placeholder={"Email"}
                                        placeholderTextColor="#999" 
                                        ref={ref =>  {this._note = ref;}}
                                        //onSubmitEditing= {() =>this._note.focus()}
                                        returnKeyType="done"
                                        />
                                  </View>                          
                            </View>

                           

                            <View  	
                                style={styles.viewAddressRow}> 
                                  <View>
                                    <Text
                                    style={styles.labelInput}>Mailing Address </Text>
                                    <TextInput
                                    clearButtonMode="always"
                                        onChangeText = {(value) => this.setState({addressInput:value})}
                                        //returnKeyType="go"
                                        autoCorrect={false}
                                        multiline={true}
                                        //value={this.state.currentNote}
                                        defaultValue = {this.state.addressInput}
                                        style={styles.inputTxtAddress}
                                        autoCapitalize="sentences"
                                        placeholder={"Mailing Address"}
                                        placeholderTextColor="#999" 
                                        //ref={ref =>  {this._note = ref;}}
                                        //onSubmitEditing= {() =>this._note.focus()}
                                        returnKeyType="return"
                                        />
                                  </View>
          
                            </View>

                            <View  	
                                style={styles.viewBootnSaveRow}> 
                             

                                    <TouchableOpacity
                                      onPress={this.onBtnSavePressed}
                                      style={styles.btnSaveButton}>
                                      <Text
                                        style={styles.btnSaveButtonText}>Save & Continue</Text>
                                  </TouchableOpacity>      
                                  
          
                            </View>
                 
             </View>
        );   
      
  

   

 
    }
    
  }
  
  const options = [
    { label: 'No', value: 0 , activeColor:'#999'},
    { label: 'Yes', value: 1, activeColor:'#8B1936' }
  ];
  const styles = StyleSheet.create({


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
    viewNameRow:{
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
      shadowColor: "gray",
      shadowOffset: { height: 3, width: 3 },
      shadowOpacity: 0.4,
      shadowRadius: 0.2,  
      top:23,  
    },
    buttonPicture : {
      resizeMode: "contain",
      height: 35,
      shadowColor: "gray",
      shadowOffset: { height: 3, width: 3 },
      shadowOpacity: 0.4,
      shadowRadius: 0.2, 
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