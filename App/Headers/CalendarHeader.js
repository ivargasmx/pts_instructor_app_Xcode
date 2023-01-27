import React from 'react';
import {ScrollView, View, Text,Image, TextInput,StyleSheet,StatusBar,TouchableOpacity,TouchableWithoutFeedback } from 'react-native';

import  Modal,{SlideAnimation, ModalContent,ModalButton } from 'react-native-modals';
import authHelper   from "../Helper/Sessions";

export default class CalendarHeader extends React.Component {


    constructor(props) {
        super(props);
    
        this.state = {
		  currentTabView: null,
		  visible : false,
		  debug : false,

        };
      }
    onBtnLogoutPressed = () => {
		authHelper.logOut(global.host,global.access_token);  
		this.props._onLoadGetUsers(global.location_now.latitude,global.location_now.longitude);
		const { navigate } = this.props.navigation
		global.logs = "";
		global.screen = "Login"
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
    render() {
        
       return ( <View> 
				<StatusBar backgroundColor="blue" barStyle="light-content" />
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
							left: 18,
							right: 20,
							top: 27,
							height: 36,
							flexDirection: "row",
							alignItems: "flex-start",
						}}>
						<TouchableOpacity
							onLongPress ={this.onBtnLogoPressed}
							style={styles.imgIconHeaderButton}>
							<Image
								source={require("./../../assets/images/grupo-96.png")}
								style={styles.imgIconHeaderButtonImage}/>
						</TouchableOpacity>
						<View
							style={{
								flex: 1,
							}}/>
						{ global.access_token != "" &&	
						<TouchableOpacity 
						     onPress={() => {
							this.setState({ visible: true });
							}}> 	
							<Text
								style={styles.txtInstructorNameText}>{this.props.instructorName}</Text>
						</TouchableOpacity>	
						}	
						{ global.access_token != "" &&
						<TouchableOpacity 
						     onPress={() => {
							this.setState({ visible: true });
							}}> 
						   <Image
							source={require("./../../assets/images/grupo-95.png")}
							style={styles.imgIconInstructorImage}/>		
						</TouchableOpacity>
						}

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
						  <Text style={styles.txtDebug} > DEBUG .</Text>	
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
       );
    };
}

const styles = StyleSheet.create({
	FlexOne: {
        flex : 1
	},
	inputTxtLocation: {
		backgroundColor: "red",
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
		width: 660,
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
	txtLogout1: {
		backgroundColor: "red",
		color: "rgb(0, 0, 0)",
		fontFamily: "Montserrat-Regular",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
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
    btnUserButton: {
		backgroundColor: "transparent",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		position: "absolute",
		right: 20,
		width: 335,
		top: 30,
		height: 27,
    },
    imgBkgHeaderImage: {
		resizeMode: "cover",
		backgroundColor: "transparent",
		shadowColor: "rgba(0, 0, 0, 0.2)",
		shadowRadius: 6,
		shadowOpacity: 1,
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		height: 67,
    },
    imgIconHeaderButton: {
		backgroundColor: "transparent",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		width: 190,
		height: 34,
    },
    txtInstructorNameText: {
		color: "white",
		fontFamily: "SegoeUI",
		fontSize: 20,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "right",
		backgroundColor: "transparent",
		width: 331,
		marginRight: 18,
		marginTop: 9,
    },
    imgIconInstructorImage: {
		resizeMode: "cover",
		backgroundColor: "transparent",
		width: 18,
		height: 26,
		marginTop: 9,
	},
	
})
