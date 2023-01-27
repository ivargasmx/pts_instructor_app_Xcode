//
//  Todaycources
//  Login-
//
//  Created by [Author].
//  Copyright © 2018 [Company]. All rights reserved.
//

import React from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View,  Alert } from "react-native"

import "./../../global.js";


export default class Todaycources extends React.Component {

	static navigationOptions = ({ navigation }) => {
	
		const { params = {} } = navigation.state
		return {
				title: "Shift",				headerTintColor: "black",				headerLeft: null,				headerRight: null,				headerStyle: {
				},			}
	}

	constructor(props) { 
		super(props);
		this.state = {
			data : null ,			id : "",			authenticated : 0,			day :-1,			even : -1,			shiftsCount : 0
		  }
	}
	onLoginfailure = () => {
	
		const { navigate } = this.props.navigation
		global.screen = "Login"
		navigate("Login")
	}
	componentDidMount() {
		
		
		fetch('http://phleb.test/api/auth/shift', {
			method: 'GET',			headers: {
			   'Accept': 'application/json',			   'Content-Type': 'application/json', 
			   "cache-control": "no-cache",			   'Authorization' : global.token_type +  " " + global.access_token
			}
		   
		  }).then((response) =>  response.text()) 
				.then((responseData) =>
				 {
					
				   try {
					
					   var responseTXT = responseData;
					   var responseJSON = JSON.parse (responseTXT); 
					   var instructor;
					   var shifts;
					   var shiftView;
					   var shift_count =0;
					   //console.log(responseData);
					  if(responseJSON['success'] !== undefined) {
							console.log(responseJSON['success']);
							instructor = responseJSON.instructor;
							shiftView = responseJSON['shiftView'];
							shifts = responseJSON['shifts'];
							
							global.id=  instructor.id;
							global.name = instructor.name;
							global.phone = instructor.phone;
							global.address = instructor.address;
							global.city = instructor.city;
							global.state = instructor.state;
							global.zip = instructor.zip;
							global.notes = instructor.notes;
							global.created_at = instructor.created_at;
							global.updated_at = instructor.updated_at;
							global.user_id = instructor.user_id;
							global.deleted_at = instructor.deleted_at;
							global.disabled_at = instructor.disabled_at;
							global.assigned_states = instructor.assigned_states;
							global.available_schedule = instructor.available_schedule;
							global.iniDate = shiftView.from;
							global.endDate = shiftView.to;
							
							shift_count = Object.keys(shifts).length;
							//console.log(shift_count);
							//Calculate last day of month in JavaScript

							var month = 0; // January
							month = 8  + 1;
							year = 2020;
							var d = new Date(year, month + 1, 0);
							console.log("Ultimo de mes:" + d);
							leapYear = ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
							console.log("Es bisiesto: " +leapYear);
							console.log("Dia de semana: "  + (d.getUTCDay() + 1));
					   }

					   this.setState({
						data :shifts ,					   }); 
					   this.setState({
						shiftsCount : shift_count,					   }); 
					   

					   console.log(responseJSON);
					   
					   if(responseJSON['message'] !== undefined && responseJSON['message']  === "Unauthenticated.") {
							Alert.alert(
								'Attention !',								'Your session expired. Please login again.',								[
								{text: 'OK', onPress: () => console.log('OK Pressed')},								],								{cancelable: false},							);

							this.onLoginfailure();
					   }

				   } catch (e) {
					   console.log(e);
					   this.setState({
						   authenticated :0
					   });
					   Alert.alert("Error:", "Problems connecting to the Server. Please try again later.");

				   }

				}).catch((error) => {
				  console.log(error);	 
				  console.error(error);
				  this.setState({
					 authenticated :0
				   });
				});
		
	}

	onComGooglecodeItermPressed = () => {
	
		const { navigate } = this.props.navigation
		global.screen = "Login"
		navigate("Login")
	}

	render() {
		return <View
				style={styles.viewView}>
				<TouchableOpacity
					onPress={this.onComGooglecodeItermPressed}
					style={styles.btnBackLogoButton}>
					<Image
						source={require("./../../assets/images/comgooglecodeiterm2-copia.png")}
						style={styles.btnBackLogoButtonImage}/>
				</TouchableOpacity>
				<View
					pointerEvents="box-none"
					style={{
						height: 288,						marginLeft: 87,						marginRight: 66,						marginTop: 158,						flexDirection: "row",						alignItems: "flex-start",					}}>
					
					<ChildComponetsShifts  result={this.state.data}  /> 
					<View key={100} style={styles.viewCardView}></View>
					
			</View>
		</View>
	}
}


export class ChildComponetsShifts extends React.Component{
	
	constructor(props) {
		super(props);
		this.state = {
		};
	}
   	
	render(){
		if(this.props.result){  
			var res = this.props.result.map((item,i)=>{
				var icon ;
				var background ;
				var styleTextCity;
				var styleTextDay;
				var styleTextTime;
				var styleTextClass;
				var styleTextStudentsCount;

				if(item.class_time !== "Day"){
					 icon = require("./../../assets/images/eveninig.png");
					 background = styles.rectBack1TwoView;
					 styleTextCity = styles.txtCityTwoText;
					 styleTextDay = styles.txtDayTwoText;
					 styleTextTime = styles.txtTimeTwoText;
					 styleTextClass = styles.txtClassTwoText;
					 styleTextStudentsCount = styles.txtStudentsTwoText;

				}else{
					 icon = require("./../../assets/images/day.png");
					 background = styles.rectBack1View;
					 styleTextCity = styles.txtCityText;
					 styleTextDay = styles.txtDayText;
					 styleTextTime = styles.txtTimeText;
					 styleTextClass = styles.txtClassText; 
					 styleTextStudentsCount = styles.txtStudentsText;
				}

				return(<View key={item.id}
						style={styles.viewCardView}>
						<View
							style={background}/>
						<View
							pointerEvents="box-none"
							style={{
								position: "absolute",								left: 0,								width: 264,								top: 0,								height: 271,								alignItems: "flex-start",							}}>
							<View
								style={styles.rectBack12View}/>
							<View
								style={styles.viewRowDayView}>
								<Image
									source={icon}
									style={styles.imageImage}/>
								<View
									style={styles.viewDayView}>
									<Text
										style={styleTextDay}>{item.class_time}</Text>
								</View>
							</View>
							<View
								style={styles.viewClassView}>
								<Text
									style={styleTextClass}>Class #{item.class_number}</Text>
							</View>
							<View
								style={styles.viewTimeView}>
								<Text
									style={styleTextTime}>{item.class_hours}</Text>
							</View>
							<View
								style={styles.viewStudentsView}>
								<Text
									style={styleTextStudentsCount} >{item.students_count} Students</Text>
							</View>
						</View>
						<View
							style={styles.viewCityView}>
							<Text numberOfLines = { 2 }
								style={styleTextCity}>{item.class_name}</Text>
						</View>
					</View>
			   )
			})

		}
		return ( 
			<View
			 style={styles.margenProdView}>{res}</View> 
		)
	}
}



const styles = StyleSheet.create({
	viewView: {
		backgroundColor: "black",		flex: 1,	},	btnBackLogoButton: {
		backgroundColor: "transparent",		flexDirection: "row",		alignItems: "center",		justifyContent: "center",		padding: 0,		alignSelf: "flex-start",		width: 320,		height: 66,		marginLeft: 39,		marginTop: 112,	},	btnBackLogoButtonText: {
		color: "black",		fontFamily: ".AppleSystemUIFont",		fontSize: 12,		fontStyle: "normal",		fontWeight: "normal",		textAlign: "left",	},	btnBackLogoButtonImage: {
		resizeMode: "contain",	},	viewCardView: {
		backgroundColor: "transparent",		width: 264,		height: 288,		top: 0,		marginBottom: 14,	},	rectBack1View: {
		backgroundColor: "white",		borderRadius: 33,		borderWidth: 1,		borderColor: "rgb(112, 112, 112)",		borderStyle: "solid",		position: "absolute",		left: 0,		width: 264,		top: 0,		height: 288,	},	rectBack12View: {
		backgroundColor: "rgb(253, 45, 102)",		borderRadius: 11,		borderWidth: 1,		borderColor: "rgb(112, 112, 112)",		borderStyle: "solid",		width: 264,		height: 86,	},	viewRowDayView: {
		backgroundColor: "transparent",		width: 224,		height: 36,		marginLeft: 14,		marginTop: 14,		flexDirection: "row",		alignItems: "flex-start",	},	imageImage: {
		backgroundColor: "transparent",		resizeMode: "center",		width: 31,		height: 31,	},	viewDayView: {
		backgroundColor: "transparent",		width: 185,		height: 36,		marginLeft: 8,		alignItems: "flex-start",	},	txtDayText: {
		color: "black",		fontFamily: "Lato-Regular",		fontSize: 30,		fontStyle: "normal",		fontWeight: "normal",		textAlign: "left",		backgroundColor: "transparent",		width: 197,	},	viewClassView: {
		backgroundColor: "transparent",		width: 224,		height: 36,		marginLeft: 21,		alignItems: "flex-start",	},	txtClassText: {
		color: "black",		fontFamily: "Lato-Regular",		fontSize: 30,		fontStyle: "normal",		fontWeight: "normal",		textAlign: "left",		backgroundColor: "transparent",	},	viewTimeView: {
		backgroundColor: "transparent",		width: 231,		height: 30,		marginLeft: 14,		marginTop: 23,		alignItems: "flex-start",	},	txtTimeText: {
		color: "black",		fontFamily: "Lato-Regular",		fontSize: 25,		fontStyle: "normal",		fontWeight: "normal",		textAlign: "left",		backgroundColor: "transparent",	},	viewStudentsView: {
		backgroundColor: "transparent",		width: 229,		height: 22,		marginLeft: 21,		marginTop: 24,		alignItems: "flex-start",	},	txtStudentsText: {
		color: "black",		fontFamily: "Lato-Regular",		fontSize: 18,		fontStyle: "normal",		fontWeight: "normal",		textAlign: "left",		backgroundColor: "transparent",		width: 208,	},	viewProgramView: {
		backgroundColor: "transparent",		position: "absolute",		left: 9,		width: 248,		top: 40,		height: 43,		alignItems: "flex-start",	},	txtProgramText: {
		color: "white",		fontFamily: "Lato-Regular",		fontSize: 25,		fontStyle: "normal",		fontWeight: "normal",		textAlign: "left",		backgroundColor: "transparent",	},	viewCityView: {
		backgroundColor: "transparent",		position: "absolute",		left: 9,		width: 243,		top: 3,		height: 43,		alignItems: "flex-start",	},	txtCityText: { 
		color: "white",		fontFamily: "Lato-Regular",		fontSize: 28,		fontStyle: "normal",		fontWeight: "normal",		textAlign: "left",		backgroundColor: "transparent",		width: 235,		marginTop: 5,		height: 288,	},	viewCardTwoView: {
		backgroundColor: "transparent",		width: 264,		height: 288,	},	rectBack1TwoView: {
		backgroundColor: "rgb(58, 58, 58)",		borderRadius: 33,		borderWidth: 1,		borderColor: "rgb(112, 112, 112)",		borderStyle: "solid",		position: "absolute",		left: 0,		width: 264,		top: 0,		height: 288,	},	rectBack12TwoView: {
		backgroundColor: "rgb(253, 45, 102)",		borderRadius: 11,		borderWidth: 1,		borderColor: "rgb(112, 112, 112)",		borderStyle: "solid",		width: 264,		height: 86,	},	viewRowDayTwoView: {
		backgroundColor: "transparent",		width: 224,		height: 36,		marginLeft: 14,		marginTop: 14,		flexDirection: "row",		alignItems: "flex-start",	},	imageTwoImage: {
		backgroundColor: "transparent",		resizeMode: "center",		width: 31,		height: 31,	},	viewDayTwoView: {
		backgroundColor: "transparent",		width: 185,		height: 36,		marginLeft: 8,		alignItems: "flex-start",	},	txtDayTwoText: {
		color: "white",		fontFamily: "Lato-Regular",		fontSize: 30,		fontStyle: "normal",		fontWeight: "normal",		textAlign: "left",		backgroundColor: "transparent",		width: 197,	},	viewClassTwoView: {
		backgroundColor: "transparent",		width: 224,		height: 36,		marginLeft: 21,		alignItems: "flex-start",	},	txtClassTwoText: {
		color: "white",		fontFamily: "Lato-Regular",		fontSize: 30,		fontStyle: "normal",		fontWeight: "normal",		textAlign: "left",		backgroundColor: "transparent",	},	viewTimeTwoView: {
		backgroundColor: "transparent",		width: 231,		height: 30,		marginLeft: 14,		marginTop: 23,		alignItems: "flex-start",	},	txtTimeTwoText: {
		color: "white",		fontFamily: "Lato-Regular",		fontSize: 25,		fontStyle: "normal",		fontWeight: "normal",		textAlign: "left",		backgroundColor: "transparent",	},	viewStudentsTwoView: {
		backgroundColor: "transparent",		width: 229,		height: 22,		marginLeft: 21,		marginTop: 24,		alignItems: "flex-start",	},	txtStudentsTwoText: {
		color: "rgb(255, 250, 250)",		fontFamily: "Lato-Regular",		fontSize: 18,		fontStyle: "normal",		fontWeight: "normal",		textAlign: "left",		backgroundColor: "transparent",		width: 208,	},	viewProgramTwoView: {
		backgroundColor: "transparent",		position: "absolute",		left: 9,		width: 248,		top: 36,		height: 43,		alignItems: "flex-start",	},	txtProgramTwoText: {
		color: "white",		fontFamily: "Lato-Regular",		fontSize: 25,		fontStyle: "normal",		fontWeight: "normal",		textAlign: "left",		backgroundColor: "transparent",	},	viewCityTwoView: {
		backgroundColor: "transparent",		position: "absolute",		left: 14,		width: 243,		top: 6,		height: 43,		alignItems: "flex-start",	},	txtCityTwoText: {
		color: "white",		fontFamily: "Lato-Regular",		fontSize: 30,		fontStyle: "normal",		fontWeight: "normal",		textAlign: "left",		backgroundColor: "transparent",		width: 238,		marginLeft: 1,	},})
