import React from 'react';
import {ScrollView, View, Text,Image,TextInput, StyleSheet,StatusBar,TouchableOpacity } from 'react-native';
import  Modal,{SlideAnimation, ModalContent,ModalButton } from 'react-native-modals';
import authHelper   from "../Helper/Sessions";

import Camera from "../Helper/Evidence";  // Camera
import * as Permissions from 'expo-permissions';  // Camera
import * as Location from 'expo-location';  // Camera
// import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';  // Camera


var intervalTakePicture;   // Camera
    

export default class ShiftHeader extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = {
		  currentTabView: null,
		  visible : false,
		  debug : false,

		  picturePath:"",  //camera
		  mode : "take",   // camera
		  conta : 0 ,
        };
      }
	

	//Camera	
	_activate = () => {
		//activateKeepAwake(); 
		///alert('Activated!');
	  };
	
	  _deactivate = () => {
		//deactivateKeepAwake(); 
		//alert('Deactivated!');
	  };
	onBtnSave = (objImge) => {
		console.log(objImge);
		this.setState({picturePath:objImge});
		this.props.navigation.state.params.parentPage.addPicture(objImge)
	   }

	componentDidMount() { 
		this.getLocationAsync()
		this._activate();
		
	}

	componentWillUnmount(){
		this.setState({bottonPanel:false}); 
		clearInterval(global.timerTakePicture);

	}
	getLocationAsync = async () => {
		let { status } = await  Location.requestForegroundPermissionsAsync() ;// Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
		  this.setState({
			errorMessage: 'Permission to access location was denied',
		  });
	}
    let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Highest});
    global.location_now = location.coords
    //this.getGeocodeAsync({latitude, longitude})
    console.log("global.location_now")
	console.log(global.location_now)

	};	
    // End Camera

	takeEvidence = () => { 
       console.log("OK")
	   this.setState({conta:this.state.conta + 1})
	   console.log(this.state.conta)
	}



    onBtnLogoutPressed = () => {
	   	authHelper.logOut(global.host,global.access_token); 
	    this.props._onLoadGetUsers(global.location_now.latitude,global.location_now.longitude);  		
		const { navigate } = this.props.navigation
		global.logs = "";
		navigate("Login",{_onLoadGetUsers :this.props._onLoadGetUsers})
	}

	
	onBtnChangePasswordPressed = () => {
		const { navigate } = this.props.navigation
		navigate("ChangePassword",{action:"password",_onLoadGetUsers :this.props._onLoadGetUsers})
	}	
	onBtnChangePINPressed= () => {
		const { navigate } = this.props.navigation
		navigate("ChangePassword",{action:"pin",_onLoadGetUsers :this.props._onLoadGetUsers})
	}	
	onBtnLogoPressed = () => {
	   this.setState({ debug: true }); console.log("debug")
	}	

	onTakePicturePress = () => { 
		//console.log("onTakePicturePressH");
		//const { navigate } = this.props.navigation
		//navigate("TakeEvidencePicture", {parentPage:this});
	  } 

    render() {

		let imgIcon;
		//global.logs = global.logs  + " shift_time_id: " + global.shift_time_id
		if(this.props.time === "Weekend" )
		    imgIcon = require("./../../assets/images/trazado-100w.png");
	
		if(this.props.time === "Day" )
			imgIcon = require("./../../assets/images/grupo-46w.png");

		if(this.props.time === "Evening" )
			imgIcon = require("./../../assets/images/grupo-49-2.png");
		
		if(this.props.time !== "Weekend" && 
		this.props.time !== "Day" && 
		this.props.time !== "Evening" )
             imgIcon = require("./../../assets/images/trazado-107-T.png");        
        
       return ( <View> 
                <StatusBar backgroundColor="blue" barStyle="light-content" />	
				<View
					pointerEvents="box-none"
					style={{
						//position: "absolute",
						left: 0,
						right: 0,
						top: 0,
                        height: 70,
					}}>

				{ false && this.state.mode == "take" &&   // Camera
					
					 <View>	
						<Camera 
							parentWindow = {this}
						/>
					</View>	
					
				}	

				<View
					style={styles.viewHeaderView}>
					<TouchableOpacity

						style={styles.btnUserButton}/>
					<Image 
						source={require("./../../assets/images/trazado-61.png")}
						style={styles.imgBkgHeaderImage}/>
					<View
						pointerEvents="box-none"
						style={{
							position: "absolute",
							left: 9,
							right: 20,
							top: 27,
							height: 36,
							flexDirection: "row",
							alignItems: "flex-start",
						}}>
						<TouchableOpacity
							onLongPress ={this.onBtnLogoPressed}
							onPress={this.onTakePicturePress}
							style={styles.imgIconHeaderButton}>
							<Image
								source={require("./../../assets/images/grupo-96.png")}
								style={styles.imgIconHeaderButtonImage}/>
						</TouchableOpacity>


						<View
						pointerEvents="box-none"
						style={{
							position: "absolute",
							left: 0,
							right: 0,
							top: 0,
							bottom: 0,
							justifyContent: "center",
						}}>
						<View
							pointerEvents="box-none"
							style={{
								height: 42,
								marginLeft: 237,
								marginRight: 256,
								flexDirection: "row",
								alignItems: "center",
							}}>
							<View
								style={styles.viewCol1View}>
								<Text
									style={styles.txtCityText2}>{this.props.city}</Text>
								<Text
									style={styles.txtClassText}>Class #{this.props.class_number}</Text>
							</View>
							<View
								style={{
									flex: 1,
								}}/>
							<View
								style={styles.viewCol2View}>
								<Text
									style={styles.txtProgramText2}>{this.props.class_type}</Text>
								<View
									style={styles.viewRowDatetimeView}>
									<Text
										style={styles.txtDateText2}>{this.props.date}</Text>
									<View
										style={styles.viewTimeView2}>
										<Image
											source={imgIcon}
											style={styles.imgIconTimeImage}/> 
										<View
											style={{
												flex: 1,
											}}/>
										<Text
											style={styles.txtTimeText2}>{this.props.time}</Text>
									</View>
								</View>
							</View>
						</View>
					</View>

						<View
							style={{
								flex: 1,
							}}/>
	                   <TouchableOpacity 
						     onPress={() => {
							this.setState({ visible: true });
							}}> 
							<Text 
									style={styles.txtInstructorNameText}>{this.props.instructorName}</Text>
	                   </TouchableOpacity>	
	                   <TouchableOpacity 
						     onPress={() => {
							this.setState({ visible: true });
							}}> 
						   <Image
							source={require("./../../assets/images/grupo-95.png")}
							style={styles.imgIconInstructorImage}/>
						</TouchableOpacity>						
					</View>
				</View>
				<View style={styles.container}>
					<Modal
					    
						visible={this.state.visible}
						onTouchOutside={() => {
						this.setState({ visible: false });
						}}
						modalAnimation={new SlideAnimation({
							slideFrom: 'top',
						  })}
					  >
						<ModalContent >
						  <View>
						 <View>


						 <View>
							<View style={{height: 30,}}/> 
								<TouchableOpacity 
										style={styles.containerBtnLogout}
										onPress={() => {
											this.setState({ visible: false });	
											this.onBtnLogoutPressed()
										}}> 

									<Text style={styles.txtLogout} > Log Out</Text>	
								</TouchableOpacity>
								<View style={{height: 70,}}/> 
								<TouchableOpacity 
										style={styles.containerBtnLogout}
										onPress={() => {
											this.setState({ visible: false });	
											this.onBtnChangePasswordPressed()
										}}> 

								<Text style={styles.txtLogout} > Change Password</Text>	
								</TouchableOpacity> 
								<View style={{height: 20,}}/> 
								<TouchableOpacity 
										style={styles.containerBtnLogout}
										onPress={() => {
											this.setState({ visible: false });	
											this.onBtnChangePINPressed()
										}}> 

									<Text style={styles.txtLogout} > Change PIN</Text>	
								</TouchableOpacity>
								<View style={{height: 20,}}/> 
							</View> 


							 { global.clock == 100 &&  
							 	<View>
								  <Text style={styles.txtClockInDisable} >You must Clock Out before you can Log Out</Text>
							      <View style={styles.containerBtnLogoutDisabled} > 

										<Text style={styles.txtLogoutDisable} > Log Out</Text>
							       </View>
								</View>
							   }
                           </View>

						   

						  </View>
						</ModalContent>
					</Modal>
				</View>

				<View style={styles.container}>
					<Modal
					    
						visible={this.state.debug}
						onTouchOutside={() => {
						this.setState({ debug: false });
						}}
						modalAnimation={new SlideAnimation({
							slideFrom: 'top',
						  })}
					  >
						<ModalContent >
						  <View>
						  <Text style={styles.txtDebug} > DEBUG</Text>	

							 <TouchableOpacity 
							          style={styles.containerBtnLogout}
									onPress={() => {
									this.setState({ debug: false });	
									}}> 
								<Image
									source={require("./../../assets/images/logout.png")}
									style={styles.imgIconLogoutImage}/>	
						     </TouchableOpacity> 

							 <View
							   style={{
								//width: 30,
								height: 530,
								marginTop: 20,
								
							}}>
							   <ScrollView style={styles.FlexOne}>	
							     <View>
								 <TextInput
										//onChangeText = {(currentNote) => this.setState({currentNote})} 
										//returnKeyType="go"
										autoCorrect={false}
										multiline={true}
										value={global.logs}
										style={styles.txtLogout1}
										editable = {false}

										returnKeyType="done"
										/>
							       
								 </View> 
								</ScrollView> 
							 </View> 
							 <TouchableOpacity 
							          style={styles.containerBtnLogout}
									onPress={() => {
									this.setState({ debug: false });
									global.logs = "";	
									}}> 
                                 <Text style={styles.txtDebug} > CLEAR </Text>	
						     </TouchableOpacity> 

						  </View>
						</ModalContent>
					</Modal>
				</View>

           </View>   
       </View>	
       );
    };
}

const styles = StyleSheet.create({
	inputTxtLocation: {
		backgroundColor: "transparent",
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
		width: 60,
	},
	containerModal:{
		backgroundColor: "transparent",
		height: 161,
	},
	txtDebug: {
		color: "rgb(0, 0, 0)",
		fontFamily: "Montserrat-Bold",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
		backgroundColor: "transparent",
		marginLeft: 9,
		marginRight: 14,
		marginTop: 0,
	},
	txtLogout: {
		color: "rgb(255, 255, 255)",
		fontFamily: "Montserrat-Bold",
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
		backgroundColor: "transparent",
		marginLeft: 9,
		marginRight: 14,
		marginTop: 0,
	},
	txtLogoutDisable: {
		color: "#b4b4b4",
		fontFamily: "Montserrat-Bold",
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
		backgroundColor: "transparent",
		//marginLeft: 9,
		//marginRight: 14,
		marginTop: 0,
	},
	txtClockInDisable: {
		color: "rgb(0, 0, 0)",
		fontFamily: "Montserrat-Regular",
		fontSize: 17,
		fontStyle: "normal",
		textAlign: "center",
		backgroundColor: "transparent",
		//marginLeft: 9,
		//marginRight: 14,
		marginTop: 0,
		marginBottom : 10,
	},	
	viewHeaderView: {
		backgroundColor: "transparent",
		height: 61,
	},
    imgIconLogoutImage: {
		resizeMode: "cover",
		backgroundColor: "transparent",
		width: 30,
		height: 30,
		//marginTop: 9,
	},
    imgIconLogoutImageDisable: {
		resizeMode: "cover",
		backgroundColor: "transparent",
		width: 30,
		height: 30,
		//marginTop: 9,
	},	
	containerBtnLogout: {
		backgroundColor: "rgb(118,11,41)",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		width: 335,
		height: 47,
		alignSelf: "center",
		borderRadius: 17,
    },
	containerBtnLogoutDisabled: {
		backgroundColor: "rgb(159,159,159)",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		width: 335,
		height: 47,
		alignSelf: "center",
		borderRadius: 17,
    },
	viewHeaderView: {
		backgroundColor: "rgb(36, 36, 36)",
		height: 69,
    },
    viewCol1View: {
		backgroundColor: "transparent",
		width: 112,
		height: 41,
		left:-20,
		alignItems:  "center",
    },
    txtCityText2: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
		width: 160,
    },
    txtClassText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
		backgroundColor: "transparent",
		width: 110,
		marginTop: 3,
    },
    viewCol2View: {
		backgroundColor: "transparent",
		width: 209,
		height: 42,
		alignItems: "flex-end",
    },
    txtProgramText2: {
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		alignSelf: "flex-start",
		width: 187,
		marginLeft: 6,
    },
    viewRowDatetimeView: {
		backgroundColor: "transparent",
		width: 209,
		height: 20,
		marginTop: 3,
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "flex-start",
    },
    txtDateText2: {
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		marginRight: 8,
		left:-20,
    },
    viewTimeView2: {
		backgroundColor: "transparent",
		width: 82,
		height: 18,
		marginTop: 2,
		flexDirection: "row",
		alignItems: "flex-start",
		left:-18,
    },
    imgIconTimeImage: {
		backgroundColor: "transparent",
		resizeMode: "contain",
		width: 15, 
		height: 15,
		marginRight : 5,
    },
    txtTimeText2: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		left: 0,
		width: 85,
    },	
    txtInstructorNameText: {
		color: "white",
		fontFamily: "SegoeUI",
		fontSize: 17,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "center",
		backgroundColor: "transparent",
		width: 140,
		height: 46,
		marginRight: 8,
		marginTop: -5,
		
	},
    imgIconInstructorImage: {
		resizeMode: "cover",
		backgroundColor: "transparent",
		width: 18,
		height: 26,
		marginTop: 9,
	},	
})
