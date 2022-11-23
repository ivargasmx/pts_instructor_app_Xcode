//
//  Weekly
//  Ipad Trainer Portal-r2-b
//
//  Created by [Author].
//  Copyright © 2018 [Company]. All rights reserved.
//

import React from "react"
import { Image, StyleSheet, Text, View , Alert,Platform,Dimensions,ActivityIndicator 
	,FlatList, TouchableOpacity
} from "react-native"
import CalendarHeader from "../Headers/CalendarHeader";
import "./../../global.js";
import Moment from 'moment';

export default class Weekly extends React.Component {

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
			data : null ,
			shiftsCount : 0,
			formatted_dates : "",	
			_waiting: false,
			}
		  }
	

	componentDidMount() {
		url_ = global.host + '/api/auth/assignments?start_date='+global.current_week_start+'&end_date='+global.current_week_end;
		console.log("Week:::",url_);
		
		this.setState({_waiting : true})
			fetch(url_, {
			method: 'GET',
			headers: {
			   'Accept': 'application/json',
			   'Content-Type': 'application/json', 
			   "cache-control": "no-cache",
			   'Authorization' : global.token_type +  " " + global.access_token
			}
		   
		  }).then((response) =>  response.text()) 
				.then((responseData) =>
				 {
					this.setState({_waiting : false})	
					global.shift_found = false;
				   try {
					
					   let responseTXT = responseData;
					   let responseJSON = JSON.parse (responseTXT); 
					   let instructor;
					   let shifts;
					   let meta;
					   let shift_count =0;
					   //console.log(responseData);
					  if(responseJSON['success'] !== undefined) {
							console.log(responseJSON)
							instructor = responseJSON.instructor;
							shifts = responseJSON['shifts'];
							meta = responseJSON['meta'];


							global.current_month_end = meta.current_month_end;
							global.current_month_start = meta.current_month_start;
							//global.current_week_end = meta.current_week_end;
							//global.current_week_start = meta.current_week_start;

							global.next_week_end = meta.next_week_end;
							global.next_week_start = meta.next_week_start;
							global.previous_week_end = meta.previous_week_end;
							global.previous_week_start = meta.previous_week_start;

							let shifts_arr = []; 
							let columns = 3;
							shift_count = Object.keys(shifts).length;
							if(responseJSON['success'] === true){     
								let res = Object.keys(shifts).map((key, i) => {	
									let shift_day = key + " " + shifts[key][0].start_time.substring(0,4);
									let shift_day_date = new Date(shift_day);
									let row_ = Math.trunc( (i +1 ) / columns ) +    ( ((i +1 ) % columns !== 0 )? 1 : 0);
									let col_ = ((i +1 ) % columns !== 0 )? (i +1 ) % columns : columns ;
									let date_ = shift_day_date.getDate();
									let day_of_week_real =  (shift_day_date.getDay() === 0 ? 6 : shift_day_date.getDay() - 1 )    ;

									shifts_arr.push({ "id":i,"shift_count":shift_count,"current_day":key, "day_of_week": i + 1 , "date":date_ , "row":row_, "col":col_ ,"day_of_week_real": day_of_week_real,"shifts":shifts[key] });
									

								});
								//console.log(shifts_arr); 
								shifts = shifts_arr;
								console.log("shifts.length",shifts.length)
								if(shifts.length >0) global.shift_found = true;
							}

						}else{
							if(responseJSON['exception'] !== undefined) {
								Alert.alert(
									'Exception !',
									responseJSON['message'],
									[
									{text: 'OK', onPress: () => console.log('OK Pressed')},
									],
									{cancelable: false},
								);
								return;
							 }
						   }

					   this.setState({
						data :shifts ,
					   }); 
					   this.setState({
						shiftsCount : shift_count,
					   }); 
					   this.setState({
						formatted_dates : responseJSON['formatted_dates'],   
					   }); 

					   if(responseJSON['message'] !== undefined && responseJSON['message']  === "Unauthenticated.") {
							Alert.alert(
								'Attention !',
								'Your session expired. Please login again.',
								[
								{text: 'OK', onPress: () => console.log('OK Pressed')},
								],
								{cancelable: false},
							);

							this.onLoginfailure();
					   }

				   } catch (e) {
					   console.log(e);
					   this.setState({
						   authenticated :0
					   });
					   Alert.alert("Error:", "Problems connecting to the Server. Please try again later.");
					   global.shift_found = false;

				   }

				}).catch((error) => {
				  console.log(error);	 
				  console.error(error);
				  this.setState({
					 authenticated :0
				   });
				});
	}
	onLoginfailure = () => {
		const { navigate } = this.props.navigation
		navigate("Login",{_onLoadGetUsers :this.props.navigation.state.params._onLoadGetUsers})
	}
	onBtn1Pressed = () => {
	
	}

	onBtnEvePressed = () => {
	
	}

	onBtnDayTwoPressed = () => {
	
	}

	onBtnEveTwoPressed = () => {
	
	}

	onBtnDayPressed = () => {
	
	}

	onBtn1TwoPressed = () => {
	
	}

	onBtnDayThreePressed = () => {
	
	}

	onBtnEveThreePressed = () => {
	
	}

	onBtnDayFourPressed = () => {
	
	}

	onBtnEveFourPressed = () => {
	
	}

	onBtnDayFivePressed = () => {
	
	}

	onBtnEveFivePressed = () => {
	
	}

	onNextWeekPressed = () => {
		global.current_week_end = global.next_week_end;
		global.current_week_start = global.next_week_start;
		this.componentDidMount();
	}

	onPreviousWeekPressed = () => {
		global.current_week_end = global.previous_week_end;
		global.current_week_start = global.previous_week_start;
		this.componentDidMount();
	}

	onTxtDayPressed = () => {
		const { navigate } = this.props.navigation
		navigate("Shift",{_onLoadGetUsers :this.props.navigation.state.params._onLoadGetUsers})
	}

	onTxtWeekPressed = () => {
		global.current_month_end = global.current_month_end_orig ;
		global.current_month_start = global.current_month_start_orig ;
		global.current_week_end = global.current_week_end_orig ;
		global.current_week_start = global.current_week_start_orig ;
		this.componentDidMount();
	
	}

	onTxtMonthPressed = () => {
		global.current_month_end = global.current_month_end_orig ;
		global.current_month_start = global.current_month_start_orig ;
		global.current_week_end = global.current_week_end_orig ;
		global.current_week_start = global.current_week_start_orig ;
		
		const { navigate } = this.props.navigation
		
		navigate("Monthly",{_onLoadGetUsers :this.props.navigation.state.params._onLoadGetUsers})
	}

	onTab2Pressed = () => {
	
	}

	onTab2TwoPressed = () => {
	
	}

	onBtnUserPressed = () => {
	
	}

	onImgIconHeaderPressed = () => {
	
	}




	render() {

//console.log( this.state.data);
	const Item = ({ item}) => ( 
			<ChildElementShifts  result={{item}}   nav ={this}/> 
			);
	const renderItem = ({ item }) => {
			return (
				<Item
				item={item}
				
				/>
			);
			};			  

	 return <View
		style={styles.viewView}>

		<CalendarHeader
			instructorName = {global.name}
			navigation = {this.props.navigation}
			_onLoadGetUsers = {this.props.navigation.state.params._onLoadGetUsers}
		>
		</CalendarHeader>


		<View
			pointerEvents="box-none"
			style={{
				height: 49,
				marginLeft: 29,
				marginRight: 34,
				marginTop: 21,
				flexDirection: "row",
				alignItems: "flex-start",
			}}>
			<TouchableOpacity
				onPress={this.onPreviousWeekPressed}
				style={styles.previousWeekButton}>
				<Text
					style={styles.previousWeekButtonText}>Previous Week</Text>
			</TouchableOpacity>
			<Text
				style={styles.txtThisWeekText}>This Week</Text>
			<TouchableOpacity
				onPress={this.onNextWeekPressed}
				style={styles.nextWeekButton}>
				<Text
					style={styles.nextWeekButtonText}>Next Week</Text>
			</TouchableOpacity>
		</View>
		<Text
			style={styles.txtCurrenDateText}>{this.state.formatted_dates}</Text>

         { ! global.shift_found && 
			<View>
				<Text
				style={styles.txtNoShiftsFoundText}>No Shifts Found</Text>
			</View>
	    }   	
		<View
			pointerEvents="box-none"
			style={{
				flex: 1,
				alignItems: "center",
			}}>

					<View style={styles.MainContainer}>
						<FlatList
							data={ this.state.data}
							renderItem={renderItem}
							numColumns={3}
							keyExtractor={item => item.id}
						/>
					</View>
 
           <View
				style={styles.viewFooterMenuView}>
				<View
					style={styles.viewFooterMenuTwoView}>
					<View
						pointerEvents="box-none"
						style={{
							position: "absolute",
							left: 89,
							right: 72,
							top: 2,
							height: 50,
							flexDirection: "row",
							alignItems: "flex-start",
						}}>
						<TouchableOpacity
							onPress={this.onTxtDayPressed}
							style={styles.txtDayButton}>
							<Text
								style={styles.txtDayButtonText}>Day</Text>
						</TouchableOpacity>
						<View
							style={{
								flex: 1,
							}}/>
						<TouchableOpacity
							onPress={this.onTxtMonthPressed}
							style={styles.txtMonthButton}>
							<Text
								style={styles.txtMonthButtonText}>Month</Text>
						</TouchableOpacity>
					</View>
					<TouchableOpacity
						onPress={this.onTxtWeekPressed}
						style={styles.txtWeekButton}>
						<Text
							style={styles.txtWeekButtonText}>Week</Text>
					</TouchableOpacity>
					
				</View>
				<View
					style={styles.tabBarIpadRegView}>
					<View
							style={{
								flex: 1,
							}}/>	
					<TouchableOpacity
						onPress={this.onTab2TwoPressed}
						style={styles.tab2TwoButton}>
						<Text
							style={styles.tab2TwoButtonText}>Specifications</Text>
					</TouchableOpacity>
					<View
						style={{
							flex: 1,
						}}/>
					<TouchableOpacity
						onPress={this.onTab2Pressed}
						style={styles.tab2Button}>
						<Text
							style={styles.tab2ButtonText}>Courses</Text>
					</TouchableOpacity>					
					<View
							style={{
								flex: 1,
							}}/>
						<TouchableOpacity
							onPress={ () => {Alert.alert("Feature coming soon.")}}
							style={styles.tab2TwoButton}>
							<Text
								style={styles.tab2TwoButtonText}>Anouncements</Text>
						</TouchableOpacity>	
					<View
							style={{
								flex: 1,
							}}/>					
				</View>
			</View>
		</View>
		<View  style={[styles.containerWait, !this.state._waiting ? styles.containerHiddend : {}]}>
                      <ActivityIndicator size="large" color="#ffff"  />    
		</View>	
	</View>
   }
}


export class ChildElementShifts extends React.Component{
	
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	componentDidMount() { 
		
	}

	onShiftPressed = (item) => {  
		item['formatted_current_date'] = global.todayText
		let shiftDate = Moment(item.end_time).format('Y-MM-DD')
		let today = Moment(Date.now()).format('Y-MM-DD')

		console.log("item time", shiftDate )
		console.log("today", today )
		console.log(shiftDate,today)
		console.log(shiftDate == today)

		if(shiftDate == today){
			global.shifttype = "real";
		}else{
			global.shifttype = "info";
		}

		const { navigate } = this.props.nav.props.navigation

 	
       navigate("Classroom",{ parameters: item ,_onLoadGetUsers :this.props.nav.props.navigation.state.params._onLoadGetUsers}) 	
		// navigate("Classroom",{ parameters: item ,_onLoadGetUsers :this.props.nav.state.params._onLoadGetUsers}) 

  
	}  
	
	render(){
			  var res = this.props.result;
			  var  card1 = <View></View>;
			  var backGrndStyle = styles.caedDayShiftView;
			  if(res.item.shifts[0] && res.item.shifts[0].class_time !== ""  ){
					var objectItem = res.item.shifts[0];
					var imgIcon ;

					if(res.item.shifts[0].class_time === "Weekend" ){
						imgIcon = require("./../../assets/images/trazado-100.png");
					}

					if(res.item.shifts[0].class_time === "Day" ){
						imgIcon = require("./../../assets/images/grupo-46.png");
					}

					if(res.item.shifts[0].class_time === "Evening" ){
						imgIcon = require("./../../assets/images/img-none.png");
					}

					if(res.item.shifts[0].class_time !== "Evening"  && 
						res.item.shifts[0].class_time !== "Day"  && 
						res.item.shifts[0].class_time !== "Weekend"   ){
							imgIcon = require("./../../assets/images/trazado-107-T.png");
							backGrndStyle = styles.imgBackEveView;
					}
					if(res.item.shifts[0].class_time === "Evening")
						card1 = this.cardEvening(objectItem,res);
					else
						card1 = this.card(objectItem,res,backGrndStyle,imgIcon);
			    }

				var  card2 = <View></View>

				if(res.item.shifts[1] && res.item.shifts[1].class_time !== ""  ){
					var objectItem = res.item.shifts[1];
					var imgIcon ;

					if(res.item.shifts[1].class_time === "Weekend" ){
						imgIcon = require("./../../assets/images/trazado-100.png");
					}

					if(res.item.shifts[1].class_time === "Day" ){
						imgIcon = require("./../../assets/images/grupo-46.png");
					}

					if(res.item.shifts[1].class_time === "Evening" ){
						imgIcon = require("./../../assets/images/img-none.png");
					}

					if(res.item.shifts[1].class_time !== "Evening"  && 
						res.item.shifts[1].class_time !== "Day"  && 
						res.item.shifts[1].class_time !== "Weekend"   ){
							imgIcon = require("./../../assets/images/trazado-107-T.png");
							backGrndStyle = styles.imgBackEveView;
					}
					if(res.item.shifts[1].class_time === "Evening")
						card2 = this.cardEvening(objectItem,res);
					else
						card2 = this.card(objectItem,res,backGrndStyle,imgIcon);
			    }				
				

				if( res.item.shifts.length === 2 &&  res.item.shifts[1].class_time !== ""    ){	
					//backGrndStyle = styles.imgBackEveView;
					var objectItem;
					//if(res.item.shifts[0].class_time === "Evening") objectItem = res.item.shifts[0];
					//if( res.item.shifts.length === 2 &&  res.item.shifts[1].class_time === "Evening"  )  objectItem = res.item.shifts[1];

				    //card2 = this.cardEvening(objectItem,res);
				}

						return( 
							   <View
								style={styles.cardShiftView}>
								<Image
									source={require("./../../assets/images/trazado-83.png")}
									style={styles.imgBackBaseImage}/>
								<View
									pointerEvents="box-none"
									style={{
										
										left: 0,
										right: 0,
										top: 0,
										bottom: 1,
									}}>
									<View
										style={styles.viewHeaderView}>
										<Text
											style={styles.textHeaderDateText}>{res.item.current_day}</Text>
									</View>

									<View
										style={{
											flex: 1,
										}}/>

										{card1}
										{card2}
	
								</View>
							</View>

							)
				}

				card = (objectItem,res,backGrndStyle,imgIcon) => {
					return(
						<TouchableOpacity  key={res.id} delayPressIn={5} delayPressOut={5} delayLongPress={5}
				             onPressIn={() => {this.onShiftPressed(objectItem)}} >
							<View
							style={styles.caedDayShiftView}>
							<View
								pointerEvents="box-none"
								style={{
									
									left: 16,
									width: 219, 
									top: 7,
									height: 138,
									alignItems: "flex-start",
								}}>
									
								<Text
									style={styles.txtCityText}>{objectItem.city}</Text>	
								<Text
									style={styles.txtProgramText}>{objectItem.class_type}</Text>
								<View
									style={styles.veiwTimeView}>
									<Image
										source={imgIcon}
										style={styles.imgIconTimeWImage}/>
									<View
										style={{
											flex: 1,
										}}/>
									<Text
										style={styles.txtTimeWText}>{objectItem.class_time}</Text>
								</View>
								<Text
									style={styles.txtClassText}>Class #{objectItem.class_number}</Text>
								<Text
									style={styles.txtHoursWText}>{objectItem.class_hours}</Text>
								<Text
									style={styles.txtStudensWText}>{objectItem.students_count} Students</Text>
							</View>
						</View>
						</TouchableOpacity>
					)
				}

				cardEvening = (objectItem,res) => {
					return (
						<TouchableOpacity  key={res.id} delayPressIn={5} delayPressOut={5} delayLongPress={5}
				             onPressIn={() => {this.onShiftPressed(objectItem)}} >
							<View
								style={styles.cardEveShiftView}>
								<View
									style={styles.imgBackEveView}/>
								<View
									pointerEvents="box-none"
									style={{
										
										left: 17,
										width: 215,
										top: 0,
										height: 147,
										alignItems: "flex-start",
									}}>
									<Text
										style={styles.txtCityBText}>{objectItem.city}</Text>
									<Text
										style={styles.txtHoursBText}>{objectItem.class_hours}</Text>
									<Text
										style={styles.txtStudensBText}>{objectItem.students_count} Students</Text>
								</View>
								<Text
									style={styles.txtProgramaBText}>{objectItem.class_type}</Text>
								<View
									style={styles.viewTimeView}>
									<Image
										source={require("./../../assets/images/grupo-49-2.png")}
										style={styles.grupo49Image}/>
									<View
										style={{
											flex: 1,
										}}/>
									<Text
										style={styles.txtTimeBText}>{objectItem.class_time}</Text>
								</View>
								<Text
									style={styles.txtClassTwoText}>Class #{objectItem.class_number}</Text>
								<TouchableOpacity key={res.id} delayPressIn={5} delayPressOut={5} delayLongPress={5}
									onPress={this.onTxtMonthPressed}
									style={styles.cardEveShiftView}/>
							</View>	
						</TouchableOpacity>
					)
	
				}	
		}

const styles = StyleSheet.create({
	txtNoShiftsFoundText: {
		color: "black",
		position: "absolute",
		fontFamily: "Montserrat-Bold",
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
		alignSelf :"center",
		backgroundColor: "transparent",
		marginTop: 50,
	},	
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
	MainContainer :{  // Cointener
		justifyContent: 'center',
		flex:1,
		margin: 10,
		paddingTop: (Platform.OS) === 'ios' ? 15 : 0,
		backgroundColor: "transparent",
		position: "absolute",
		alignSelf: "center",
		width: 790,
		justifyContent: 'space-between',
		top: 8,
		bottom: 114,
		},
		
		GridViewBlockStyle: {  // Cell
		  justifyContent: 'center',
		  flex:1,
		  alignItems: 'center',
		  height: 323,
		  margin: 7,
		  backgroundColor: '#00BCD4'
		}
		,
		
		GridViewInsideTextItemStyle: {
		
		   color: '#fff',
		   padding: 10,
		   fontSize: 18,
		   justifyContent: 'center',
		   
		 },

	viewView: {
		backgroundColor: "rgb(239, 239, 244)",
		flex: 1,
	},
	viewHeaderSevenView: {
		backgroundColor: "transparent",
		height: 61,
	},
	btnUserButtonImage: {
		resizeMode: "contain",
	},
	btnUserButtonText: {
		color: "black",
		fontFamily: ".AppleSystemUIFont",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
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
	imgIconHeaderButtonText: {
		color: "black",
		fontFamily: ".AppleSystemUIFont",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
	},
	imgIconHeaderButtonImage: {
		resizeMode: "contain",
	},
	txtInstructorNameText: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "SegoeUI",
		fontSize: 20,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "right",
		width: 332,
		marginRight: 18,
		marginTop: 9,
	},
	imgIconInstructorImage: {
		resizeMode: "center",
		backgroundColor: "transparent",
		width: 18,
		height: 26,
		marginTop: 9,
	},
	previousWeekButton: {
		backgroundColor: "transparent",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		width: 159,
		height: 24,
		marginTop: 23,
	},
	previousWeekButtonImage: {
		resizeMode: "contain",
		marginRight: 10,
	},
	previousWeekButtonText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 20,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
	},
	txtThisWeekText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 40,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
		backgroundColor: "transparent",
		flex: 1,
		marginLeft: 26,
		marginRight: 32,
	},
	nextWeekButton: {
		backgroundColor: "transparent",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		width: 117,
		height: 24,
		marginTop: 23,
	},
	nextWeekButtonImage: {
		resizeMode: "contain",
		marginRight: 10,
	},
	nextWeekButtonText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 20,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
	},
	txtCurrenDateText: {
		backgroundColor: "transparent",
		color: "rgb(112, 112, 112)",
		fontFamily: "Montserrat-Bold",
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
		marginLeft: 214,
		marginRight: 183,
		marginTop: 1,
	},
	viewScrollScrollView: {
		backgroundColor: "transparent",
		position: "absolute",
		alignSelf: "center",
		width: 860,
		top: 8,
		bottom: 114,
		

	
		//alignItems: "center",
	},
	viewContainerView: {
		backgroundColor: "transparent",
		width: 860,
		height: 1074,
		alignItems: "flex-end",
	},
	viewRowView: {
		backgroundColor: "transparent",
		width: 790,
		height: 323,
		marginRight: 33,
		flexDirection: "row",
		alignItems: "flex-start",
		marginBottom: 12,
	},
	cardShiftView: {
		backgroundColor: "transparent",
		width: 244,
		height: 323,
		marginRight : 10,
		marginLeft : 10,
		marginBottom: 10,
		shadowColor: "rgba(0, 0, 0, 0.33)",
		shadowRadius: 4,
		shadowOpacity: 1,
	},
	cardShift1View: {
		backgroundColor: "transparent",
		width: 244,
		height: 323,
	},
	imgBackBaseImage: {
		resizeMode: "cover",
		backgroundColor: "transparent",
		shadowColor: "rgba(0, 0, 0, 0.33)",
		shadowRadius: 4,
		shadowOpacity: 1,
		position: "absolute",
		left: 0,
		right: 1,
		top: 0,
		height: 323,
	},
	viewHeaderView: {
		backgroundColor: "rgb(139, 25, 54)",
		height: 31,
		alignItems: "flex-start",
	},
	textHeaderDateText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 15,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 216,
		marginLeft: 18,
		marginTop: 7,
	},
	caedDayShiftView: {
		backgroundColor: "transparent",
		height: 145,
	},
	txtCityText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		width: 217,
		height: 16,
		marginLeft: 1,
	},
	txtProgramText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		width: 218,
		height: 16,
		marginLeft: 1,
	},
	veiwTimeView: {
		backgroundColor: "transparent",
		width: 203,
		height: 28,
		marginTop: 4,
		flexDirection: "row",
		alignItems: "center",
	},
	imgIconTimeWImage: {
		resizeMode: "contain",
		backgroundColor: "transparent",
		width: 26,
		height: 26,
	},
	txtTimeWText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 164,
		marginRight: 4,
	},
	txtClassText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 217,
		marginTop: 3,
	},
	txtHoursWText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 217,
		marginTop: 4,
	},
	txtStudensWText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 210,
		marginTop: 5,
	},
	btnDayButton: {
		backgroundColor: "transparent",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		position: "absolute",
		left: 6,
		right: 5,
		top: 3,
		height: 138,
	},
	btnDayButtonText: {
		color: "black",
		fontFamily: ".AppleSystemUIFont",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
	},
	btnDayButtonImage: {
		resizeMode: "contain",
	},
	cardEveShiftView: {
		backgroundColor: "transparent",
		height: 145,
	},
	imgBackEveView: {
		backgroundColor: "rgb(58, 58, 58)",
		position: "absolute",
		left: 0,
		right: 1,
		bottom: -2,
		height: 147,
	},
	txtCityBText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 215,
	},
	txtHoursBText: {
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 202,
		marginLeft: 2,
		marginTop: 75,
	},
	txtStudensBText: {
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 202,
		marginLeft: 2,
		marginTop: 2,
	},
	txtProgramaBText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		position: "absolute",
		left: 17,
		width: 215,
		top: 17,
	},
	viewTimeView: {
		backgroundColor: "transparent",
		position: "absolute",
		left: 19,
		width: 213,
		top: 34,
		height: 35,
		flexDirection: "row",
		alignItems: "center",
	},
	grupo49Image: {
		resizeMode: "contain",
		backgroundColor: "transparent",
		width: 20,
		height: 20,
	},
	txtTimeBText: {
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 162,
		marginRight: 16,
	},
	txtClassTwoText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		position: "absolute",
		left: 19,
		width: 205,
		top: 67,
	},
	btnEveButton: {
		backgroundColor: "transparent",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		position: "absolute",
		left: 5,
		right: 6,
		top: 0,
		height: 145,
	},
	btnEveButtonText: {
		color: "black",
		fontFamily: ".AppleSystemUIFont",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
	},
	btnEveButtonImage: {
		resizeMode: "contain",
	},
	cardShift2View: {
		backgroundColor: "transparent",
		width: 243,
		height: 331,
		marginLeft: 32,
	},
	imgBackBaseTwoImage: {
		backgroundColor: "transparent",
		shadowColor: "rgba(0, 0, 0, 0.33)",
		shadowRadius: 4,
		shadowOpacity: 1,
		resizeMode: "stretch",
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		height: 331,
	},
	viewHeaderTwoView: {
		backgroundColor: "rgb(139, 25, 54)",
		alignSelf: "stretch",
		height: 31,
		alignItems: "flex-start",
	},
	textHeaderDateTwoText: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		width: 216,
		marginLeft: 18,
		marginTop: 7,
	},
	txtCityTwoText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		width: 216,
		height: 15,
		marginLeft: 18,
		marginTop: 6,
	},
	txtProgramTwoText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		width: 217,
		height: 15,
		marginLeft: 18,
		marginTop: 1,
	},
	veiwTimeTwoView: {
		backgroundColor: "transparent",
		width: 202,
		height: 27,
		marginLeft: 17,
		marginTop: 5,
		flexDirection: "row",
		alignItems: "center",
	},
	imgIconTimeWTwoImage: {
		backgroundColor: "transparent",
		resizeMode: "center",
		width: 26,
		height: 26,
	},
	txtTimeWTwoText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 164,
		marginRight: 3,
	},
	txtClassThreeText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		width: 216,
		marginLeft: 17,
		marginTop: 4,
	},
	txtHoursWTwoText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 216,
		marginLeft: 17,
		marginTop: 5,
	},
	txtStudensWTwoText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 209,
		marginLeft: 17,
		marginTop: 6,
	},
	cardEveShift2View: {
		backgroundColor: "transparent",
		alignSelf: "stretch",
		height: 153,
	},
	imgBackEveTwoView: {
		backgroundColor: "rgb(58, 58, 58)",
		position: "absolute",
		left: 0,
		right: 0,
		bottom: -0,
		height: 153,
	},
	txtCityBTwoText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 213,
	},
	txtProgramaBTwoText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 213,
		marginTop: 2,
	},
	viewTimeTwoView: {
		backgroundColor: "transparent",
		width: 211,
		height: 29,
		marginLeft: 2,
		marginTop: 2,
		flexDirection: "row",
		alignItems: "center",
	},
	grupo49TwoImage: {
		resizeMode: "center",
		backgroundColor: "transparent",
		width: 27,
		height: 25,
	},
	txtTimeBTwoText: {
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 162,
		marginRight: 14,
	},
	txtClassFourText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 203,
		marginLeft: 2,
		marginTop: 4,
	},
	txtHoursBTwoText: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 200,
		marginLeft: 2,
		marginTop: 7,
	},
	txtStudensBTwoText: {
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 200,
		marginLeft: 2,
		marginTop: 8,
	},
	btnEveTwoButton: {
		backgroundColor: "transparent",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		position: "absolute",
		left: 4,
		right: 5,
		top: 5,
		height: 138,
	},
	btnEveTwoButtonImage: {
		resizeMode: "contain",
	},
	btnEveTwoButtonText: {
		color: "black",
		fontFamily: ".AppleSystemUIFont",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
	},
	btnDayTwoButton: {
		backgroundColor: "transparent",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		position: "absolute",
		left: 4,
		right: 6,
		top: 37,
		height: 138,
	},
	btnDayTwoButtonText: {
		color: "black",
		fontFamily: ".AppleSystemUIFont",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
	},
	btnDayTwoButtonImage: {
		resizeMode: "contain",
	},
	cardShift3View: {
		backgroundColor: "transparent",
		flex: 1,
		height: 331,
		marginLeft: 28,
	},
	imgBackBaseThreeImage: {
		resizeMode: "stretch",
		backgroundColor: "transparent",
		shadowColor: "rgba(0, 0, 0, 0.33)",
		shadowRadius: 4,
		shadowOpacity: 1,
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		height: 331,
	},
	viewHeaderThreeView: {
		backgroundColor: "rgb(139, 25, 54)",
		alignSelf: "stretch",
		height: 31,
		alignItems: "flex-start",
	},
	textHeaderDateThreeText: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		width: 216,
		marginLeft: 18,
		marginTop: 7,
	},
	txtCityThreeText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 216,
		height: 15,
		marginLeft: 18,
		marginTop: 6,
	},
	txtProgramThreeText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 217,
		height: 15,
		marginLeft: 18,
		marginTop: 1,
	},
	veiwTimeThreeView: {
		backgroundColor: "transparent",
		width: 202,
		height: 27,
		marginLeft: 17,
		marginTop: 5,
		flexDirection: "row",
		alignItems: "center",
	},
	imgIconTimeWThreeImage: {
		resizeMode: "center",
		backgroundColor: "transparent",
		width: 26,
		height: 26,
	},
	txtTimeWThreeText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 164,
		marginRight: 3,
	},
	txtClassFiveText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		width: 216,
		marginLeft: 17,
		marginTop: 4,
	},
	txtHoursWThreeText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 216,
		marginLeft: 17,
		marginTop: 5,
	},
	txtStudensWThreeText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 209,
		marginLeft: 17,
		marginTop: 6,
	},
	cardEveShift3View: {
		backgroundColor: "transparent",
		alignSelf: "stretch",
		height: 153,
	},
	imgBackEveThreeView: {
		backgroundColor: "rgb(58, 58, 58)",
		position: "absolute",
		left: 0,
		right: 0,
		bottom: -0,
		height: 153,
	},
	txtCityBThreeText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 213,
	},
	txtProgramaBThreeText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 213,
		marginTop: 2,
	},
	viewTimeThreeView: {
		backgroundColor: "transparent",
		width: 211,
		height: 29,
		marginLeft: 2,
		marginTop: 2,
		flexDirection: "row",
		alignItems: "center",
	},
	grupo49ThreeImage: {
		backgroundColor: "transparent",
		resizeMode: "center",
		width: 27,
		height: 25,
	},
	txtTimeBThreeText: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 162,
		marginRight: 14,
	},
	txtClassSixText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 203,
		marginLeft: 2,
		marginTop: 4,
	},
	txtHoursBThreeText: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 200,
		marginLeft: 2,
		marginTop: 7,
	},
	txtStudensBThreeText: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 200,
		marginLeft: 2,
		marginTop: 8,
	},
	btnEveThreeButton: {
		backgroundColor: "transparent",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		position: "absolute",
		left: 6,
		right: 4,
		top: 5,
		height: 138,
	},
	btnEveThreeButtonText: {
		color: "black",
		fontFamily: ".AppleSystemUIFont",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
	},
	btnEveThreeButtonImage: {
		resizeMode: "contain",
	},
	btnDayThreeButton: {
		backgroundColor: "transparent",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		position: "absolute",
		left: 4,
		right: 5,
		top: 37,
		height: 138,
	},
	btnDayThreeButtonText: {
		color: "black",
		fontFamily: ".AppleSystemUIFont",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
	},
	btnDayThreeButtonImage: {
		resizeMode: "contain",
	},
	viewRow2View: {
		backgroundColor: "transparent",
		width: 790,
		height: 333,
		marginRight: 33,
		marginTop: 18,
		flexDirection: "row",
		alignItems: "flex-start",
	},
	cardShift4View: {
		backgroundColor: "transparent",
		width: 243,
		height: 333,
	},
	imgBackBaseFourImage: {
		resizeMode: "cover",
		backgroundColor: "transparent",
		shadowColor: "rgba(0, 0, 0, 0.33)",
		shadowRadius: 4,
		shadowOpacity: 1,
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		height: 331,
	},
	viewHeaderFourView: {
		backgroundColor: "rgb(139, 25, 54)",
		alignSelf: "stretch",
		height: 31,
		alignItems: "flex-start",
	},
	textHeaderDateFourText: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		width: 216,
		marginLeft: 18,
		marginTop: 7,
	},
	txtCityFourText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 216,
		height: 15,
		marginLeft: 18,
		marginTop: 6,
	},
	txtProgramFourText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 217,
		height: 15,
		marginLeft: 18,
		marginTop: 1,
	},
	veiwTimeFourView: {
		backgroundColor: "transparent",
		width: 202,
		height: 27,
		marginLeft: 17,
		marginTop: 5,
		flexDirection: "row",
		alignItems: "center",
	},
	imgIconTimeWFourImage: {
		backgroundColor: "transparent",
		resizeMode: "center",
		width: 26,
		height: 26,
	},
	txtTimeWFourText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 164,
		marginRight: 3,
	},
	txtClassSevenText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 216,
		marginLeft: 17,
		marginTop: 4,
	},
	txtHoursWFourText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 216,
		marginLeft: 17,
		marginTop: 5,
	},
	txtStudensWFourText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 209,
		marginLeft: 17,
		marginTop: 6,
	},
	cardEveShift4View: {
		backgroundColor: "transparent",
		alignSelf: "stretch",
		height: 153,
	},
	imgBackEveFourView: {
		backgroundColor: "rgb(58, 58, 58)",
		position: "absolute",
		left: 0,
		right: 0,
		bottom: -0,
		height: 153,
	},
	txtCityBFourText: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		width: 213,
	},
	txtProgramaBFourText: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		width: 213,
		marginTop: 2,
	},
	viewTimeFourView: {
		backgroundColor: "transparent",
		width: 211,
		height: 29,
		marginLeft: 2,
		marginTop: 2,
		flexDirection: "row",
		alignItems: "center",
	},
	grupo49FourImage: {
		resizeMode: "center",
		backgroundColor: "transparent",
		width: 27,
		height: 25,
	},
	txtTimeBFourText: {
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 162,
		marginRight: 14,
	},
	txtClassEightText: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		width: 203,
		marginLeft: 2,
		marginTop: 4,
	},
	txtHoursBFourText: {
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 200,
		marginLeft: 2,
		marginTop: 7,
	},
	txtStudensBFourText: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 200,
		marginLeft: 2,
		marginTop: 8,
	},
	btnEveFourButton: {
		backgroundColor: "transparent",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		position: "absolute",
		left: 5,
		right: 5,
		top: 5,
		height: 138,
	},
	btnEveFourButtonText: {
		color: "black",
		fontFamily: ".AppleSystemUIFont",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
	},
	btnEveFourButtonImage: {
		resizeMode: "contain",
	},
	btnDayFourButton: {
		backgroundColor: "transparent",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		position: "absolute",
		left: 6,
		right: 4,
		top: 37,
		height: 138,
	},
	btnDayFourButtonText: {
		color: "black",
		fontFamily: ".AppleSystemUIFont",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
	},
	btnDayFourButtonImage: {
		resizeMode: "contain",
	},
	cardShift5View: {
		backgroundColor: "transparent",
		width: 244,
		height: 333,
		marginLeft: 33,
	},
	imgBackBaseFiveImage: {
		resizeMode: "stretch",
		backgroundColor: "transparent",
		shadowColor: "rgba(0, 0, 0, 0.33)",
		shadowRadius: 4,
		shadowOpacity: 1,
		position: "absolute",
		left: 0,
		right: 1,
		top: 0,
		height: 331,
	},
	viewHeaderFiveView: {
		backgroundColor: "rgb(139, 25, 54)",
		alignSelf: "stretch",
		height: 31,
		alignItems: "flex-start",
	},
	textHeaderDateFiveText: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		width: 216,
		marginLeft: 18,
		marginTop: 7,
	},
	txtCityFiveText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		width: 216,
		height: 15,
		marginLeft: 18,
		marginTop: 6,
	},
	txtProgramFiveText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		width: 217,
		height: 15,
		marginLeft: 18,
		marginTop: 1,
	},
	veiwTimeFiveView: {
		backgroundColor: "transparent",
		width: 202,
		height: 27,
		marginLeft: 17,
		marginTop: 5,
		flexDirection: "row",
		alignItems: "center",
	},
	imgIconTimeWFiveImage: {
		resizeMode: "center",
		backgroundColor: "transparent",
		width: 26,
		height: 26,
	},
	txtTimeWFiveText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 164,
		marginRight: 3,
	},
	txtClassNineText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 216,
		marginLeft: 17,
		marginTop: 4,
	},
	txtHoursWFiveText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 216,
		marginLeft: 17,
		marginTop: 5,
	},
	txtStudensWFiveText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 209,
		marginLeft: 17,
		marginTop: 6,
	},
	cardEveShift5View: {
		backgroundColor: "transparent",
		alignSelf: "stretch",
		height: 153,
	},
	imgBackEveFiveView: {
		backgroundColor: "rgb(58, 58, 58)",
		position: "absolute",
		left: 0,
		right: 0,
		bottom: -0,
		height: 153,
	},
	txtCityBFiveText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 213,
	},
	txtProgramaBFiveText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 213,
		marginTop: 2,
	},
	viewTimeFiveView: {
		backgroundColor: "transparent",
		width: 211,
		height: 29,
		marginLeft: 2,
		marginTop: 2,
		flexDirection: "row",
		alignItems: "center",
	},
	grupo49FiveImage: {
		resizeMode: "center",
		backgroundColor: "transparent",
		width: 27,
		height: 25,
	},
	txtTimeBFiveText: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 162,
		marginRight: 14,
	},
	txtClassTenText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 203,
		marginLeft: 2,
		marginTop: 4,
	},
	txtHoursBFiveText: {
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 200,
		marginLeft: 2,
		marginTop: 7,
	},
	txtStudensBFiveText: {
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 200,
		marginLeft: 2,
		marginTop: 8,
	},
	btnEveFiveButton: {
		backgroundColor: "transparent",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		position: "absolute",
		left: 4,
		right: 5,
		top: 5,
		height: 138,
	},
	btnEveFiveButtonText: {
		color: "black",
		fontFamily: ".AppleSystemUIFont",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
	},
	btnEveFiveButtonImage: {
		resizeMode: "contain",
	},
	btnDayFiveButton: {
		backgroundColor: "transparent",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		position: "absolute",
		left: 4,
		right: 7,
		top: 37,
		height: 138,
	},
	btnDayFiveButtonText: {
		color: "black",
		fontFamily: ".AppleSystemUIFont",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
	},
	btnDayFiveButtonImage: {
		resizeMode: "contain",
	},
	cardShift6View: {
		backgroundColor: "transparent",
		flex: 1,
		height: 333,
		marginLeft: 26,
	},
	imgBackBaseSixImage: {
		resizeMode: "stretch",
		backgroundColor: "transparent",
		shadowColor: "rgba(0, 0, 0, 0.33)",
		shadowRadius: 4,
		shadowOpacity: 1,
		position: "absolute",
		left: 0,
		right: 1,
		top: 0,
		height: 331,
	},
	viewHeaderSixView: {
		backgroundColor: "rgb(139, 25, 54)",
		alignSelf: "stretch",
		height: 31,
		alignItems: "flex-start",
	},
	textHeaderDateSixText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 216,
		marginLeft: 18,
		marginTop: 7,
	},
	txtCitySixText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 216,
		height: 15,
		marginLeft: 18,
		marginTop: 6,
	},
	txtProgramSixText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 217,
		height: 15,
		marginLeft: 18,
		marginTop: 1,
	},
	veiwTimeSixView: {
		backgroundColor: "transparent",
		width: 202,
		height: 27,
		marginLeft: 17,
		marginTop: 5,
		flexDirection: "row",
		alignItems: "center",
	},
	imgIconTimeWSixImage: {
		resizeMode: "center",
		backgroundColor: "transparent",
		width: 26,
		height: 26,
	},
	txtTimeWSixText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 164,
		marginRight: 3,
	},
	txtClassElevenText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 216,
		marginLeft: 17,
		marginTop: 4,
	},
	txtHoursWSixText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 216,
		marginLeft: 17,
		marginTop: 5,
	},
	txtStudensWSixText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 209,
		marginLeft: 17,
		marginTop: 6,
	},
	cardEveShift6View: {
		backgroundColor: "transparent",
		alignSelf: "stretch",
		height: 153,
	},
	imgBackEveSixView: {
		backgroundColor: "rgb(58, 58, 58)",
		position: "absolute",
		left: 0,
		right: 0,
		bottom: -0,
		height: 153,
	},
	txtCityBSixText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 213,
	},
	txtProgramaBSixText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 213,
		marginTop: 2,
	},
	viewTimeSixView: {
		backgroundColor: "transparent",
		width: 211,
		height: 29,
		marginLeft: 2,
		marginTop: 2,
		flexDirection: "row",
		alignItems: "center",
	},
	grupo49SixImage: {
		backgroundColor: "transparent",
		resizeMode: "center",
		width: 27,
		height: 25,
	},
	txtTimeBSixText: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 162,
		marginRight: 14,
	},
	txtClassTwelveText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 203,
		marginLeft: 2,
		marginTop: 4,
	},
	txtHoursBSixText: {
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 200,
		marginLeft: 2,
		marginTop: 7,
	},
	txtStudensBSixText: {
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 200,
		marginLeft: 2,
		marginTop: 8,
	},
	btnEveSixButton: {
		backgroundColor: "transparent",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		position: "absolute",
		left: 6,
		right: 4,
		top: 5,
		height: 138,
	},
	btnEveSixButtonText: {
		color: "black",
		fontFamily: ".AppleSystemUIFont",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
	},
	btnEveSixButtonImage: {
		resizeMode: "contain",
	},
	btnDaySixButton: {
		backgroundColor: "transparent",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		position: "absolute",
		left: 4,
		right: 6,
		top: 37,
		height: 138,
	},
	btnDaySixButtonText: {
		color: "black",
		fontFamily: ".AppleSystemUIFont",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
	},
	btnDaySixButtonImage: {
		resizeMode: "contain",
	},
	cardShift8View: {
		backgroundColor: "transparent",
		width: 244,
		height: 334,
		marginTop: 1,
	},
	cardShift9View: {
		backgroundColor: "transparent",
		flex: 1,
		height: 334,
		marginLeft: 26,
	},
	viewFooterMenuView: {
		backgroundColor: "red",
		shadowColor: "rgba(0, 0, 0, 0.15)",
		shadowRadius: 4,
		shadowOpacity: 1,
		position: "absolute",
		left: 0,
		right: 9,
		bottom: 0,
		height: 119,
	},
	viewFooterMenuTwoView: {
		backgroundColor: "white",
		position: "absolute",
		alignSelf: "center",
		width: 850,
		bottom: 60,
		height: 59,
	},
	txtDayButton: {
		backgroundColor: "transparent",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		width: 83,
		height: 49,
	},
	txtDayButtonText: {
		color: "rgb(1, 1, 1)",
		fontFamily: "Montserrat-Bold",
		fontSize: 30,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
	},
	txtDayButtonImage: {
		resizeMode: "contain",
		marginRight: 10,
	},
	txtMonthButton: {
		backgroundColor: "transparent",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		width: 139,
		height: 49,
	},
	txtMonthButtonImage: {
		resizeMode: "contain",
		marginRight: 10,
	},
	txtMonthButtonText: {
		color: "rgb(1, 1, 1)",
		fontFamily: "Montserrat-Bold",
		fontSize: 31,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
	},
	txtWeekButton: {
		backgroundColor: "transparent",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		position: "absolute",
		alignSelf: "center",
		width: 123,
		top: 2,
		height: 49,
	},
	txtWeekButtonText: {
		color: "rgb(139, 25, 54)",
		fontFamily: "Montserrat-Bold",
		fontSize: 29,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
	},
	txtWeekButtonImage: {
		resizeMode: "contain",
		marginRight: 10,
	},
	tabBarIpadRegView: {
		backgroundColor: "rgba(36, 36, 36, 1)",
		shadowColor: "rgba(0, 0, 0, 0.3)",
		shadowRadius: 0,
		shadowOpacity: 1,
		position: "absolute",
		alignSelf: "center",
		width: 860,
		bottom: 0,
		height: 65,
		flexDirection: "row",
		alignItems: "center",
	},
	tab2Button: {
		backgroundColor: "transparent",
		borderWidth: 1,
		borderColor: "transparent",
		borderStyle: "solid",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		//width: 122,
		height: 40,
		//marginLeft: 196,
	},
	tab2ButtonText: {
		color: "white",
		fontFamily: "SFProText-Regular",
		fontSize: 13,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
	},
	tab2ButtonImage: {
		resizeMode: "contain",
		marginRight: 10,
	},
	tab2TwoButton: {
		backgroundColor: "transparent",
		borderWidth: 1,
		borderColor: "transparent",
		borderStyle: "solid",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		//width: 120,
		height: 40,
		//marginRight: 209,
	},
	tab2TwoButtonText: {
		color: "rgb(153, 153, 153)",
		fontFamily: "SFProText-Regular",
		fontSize: 13,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
	},
	tab2TwoButtonImage: {
		resizeMode: "contain",
		marginRight: 10,
	},
})
