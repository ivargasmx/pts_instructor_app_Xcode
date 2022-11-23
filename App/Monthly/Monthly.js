//
//  Monthly
//  Ipad Trainer Portal-r2-b
//
//  Created by [Author].
//  Copyright © 2018 [Company]. All rights reserved.
//

import React from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View,Dimensions,ActivityIndicator ,
	Alert,FlatList,Platform } from "react-native"

import "./../../global.js";
import CalendarHeader from "../Headers/CalendarHeader";
import Moment from 'moment';

export default class Monthly extends React.Component {

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

	onLoginfailure = () => {
		const { navigate } = this.props.navigation
		navigate("Login",{_onLoadGetUsers :this.props.navigation.state.params._onLoadGetUsers})
	}

	componentDidMount() {
		console.log("Month:::",global.host + '/api/auth/assignments?start_date='+global.current_month_start+'&end_date='+global.current_month_end+'&view=month');
		this.setState({_waiting : true})
		fetch(global.host + '/api/auth/assignments?start_date='+global.current_month_start+'&end_date='+global.current_month_end+'&view=month', {
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
					   
					  if(responseJSON['success'] !== undefined) {
							console.log(responseJSON);
							instructor = responseJSON.instructor;
							shifts = responseJSON['shifts'];
							meta = responseJSON['meta'];



							//global.current_month_end = meta.current_month_end;
							//global.current_month_start = meta.current_month_start;
							//global.current_week_end = meta.current_week_end;
							//global.current_week_start = meta.current_week_start;
						if(meta && meta.previous_month_start !== undefined ){
							global.previous_month_start = meta.previous_month_start;
							global.previous_month_end = meta.previous_month_end;
							global.next_month_start = meta.next_month_start;
							global.next_month_end = meta.next_month_end;
							global.current_week_start = meta.current_week_start;
							global.current_week_start = meta.current_week_start;	
						}



							let formatted_dates_ = responseJSON['formatted_dates'];  //onChange date//
							//console.log(formatted_dates_); 
							let firstDayOfMonth_  = new Date("1 " +formatted_dates_); //onChange date//
							//console.log(firstDayOfMonth_);
							global.current_month_start_day = firstDayOfMonth_.getUTCDay(); //onChange date//


							let shifts_arr = []; 
							let columns = 7;
							let date = 0;
							let countDate = 1;
							let row_ ;
							let col_ ;
							let arr_ = [];

	
		console.log("++++++++++++ Shift ");					
		
		
		
							shift_count = Object.keys(shifts).length;
							
			
							let current_month_end_number = this.getCurrentMonthLast(global.current_month_start);


							if(shift_count >0) global.shift_found = true;
							
							if(responseJSON['success'] === true){     
                                
								for(var i = 0; i <= 41; i++) {

									row_ = Math.trunc( (i +1 ) / columns ) +    ( ((i +1 ) % columns !== 0 )? 1 : 0);
									col_ = ((i +1 ) % columns !== 0 )? (i +1 ) % columns : columns ;	
									//console.log("global.current_month_start_day:",i , "::", global.current_month_start_day) 
									//console.log("    countDate:",countDate , "::", global.current_month_end_number) 
									if(i >= global.current_month_start_day && countDate <= current_month_end_number ){
										arr_ = [];
										if(shifts[(countDate).toString()] !== undefined )  arr_ = shifts[(countDate).toString()];
										date ++;
										countDate ++;	
									}else{
										date = 0;
										arr_ = [];
									}
									
									shifts_arr.push({ "id":i,"current_day":date, "day_of_week": col_ -1  ,  "row":row_, "col":col_ ,"shifts":arr_});
								}

								//console.log(shifts_arr); 
								shifts = shifts_arr; 
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
	onPreviousMonthPressed = () => {
		
		global.current_month_end = global.previous_month_end;
		global.current_month_start = global.previous_month_start;
		this.componentDidMount();
	}
	onNextMonthPressed = () => {
		global.current_month_end = global.next_month_end;
		global.current_month_start = global.next_month_start;
		this.componentDidMount();
	}

	onBtnShiftDTwoPressed = () => {
	
	}

	onBtnShiftDPressed = () => {
	
	}

	onBtnShiftDFourPressed = () => {
	
	}

	onTxtDayPressed = () => {
	
	}

	onTxtWeekPressed = () => {
	
	}

	onTxtMonthPressed = () => {
	
	}

	onTab2Pressed = () => {
	
	}

	onTab2TwoPressed = () => {
	
	}
	getCurrentMonthLast(xDate){
		var date=new Date(xDate);
		var currentMonth=date.getMonth();
		var nextMonth=++currentMonth +1;
		var nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
		var oneDay=1000*60*60*24;
		var lasdate =new Date(nextMonthFirstDay-oneDay);
		return lasdate.getUTCDate()
	}

	onBtnUserPressed = () => {
	
	}

	onImgIconHeaderPressed = () => {

	}

	onTxtDayTwoPressed = () => {
		global.current_month_end = global.current_month_end_orig ;
		global.current_month_start = global.current_month_start_orig ;
		global.current_week_end = global.current_week_end_orig ;
		global.current_week_start = global.current_week_start_orig ;
		const { navigate } = this.props.navigation
		navigate("Shift",{_onLoadGetUsers :this.props.navigation.state.params._onLoadGetUsers})
	}

	onTxtWeekTwoPressed = () => {
		global.current_month_end = global.current_month_end_orig ;
		global.current_month_start = global.current_month_start_orig ;
		global.current_week_end = global.current_week_end_orig ;
		global.current_week_start = global.current_week_start_orig ;
		const { navigate } = this.props.navigation
		
		navigate("Weekly",{_onLoadGetUsers :this.props.navigation.state.params._onLoadGetUsers})
	}

	onTxtMonthTwoPressed = () => {
		global.current_month_end = global.current_month_end_orig ;
		global.current_month_start = global.current_month_start_orig ;
		global.current_week_end = global.current_week_end_orig ;
		global.current_week_start = global.current_week_start_orig ;
		this.componentDidMount();

	}

	onTab2ThreePressed = () => {
	
	}

	onTab2FourPressed = () => {
	
	}

	render() {
	const Item = ({ item}) => ( 
			<ChildElementShifts  result={{item}}  nav ={this} /> 
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
						onPress={this.onPreviousMonthPressed}
						style={styles.previousMonthButton}>
						<Text
							style={styles.previousMonthButtonText}>Previous Month</Text>
					</TouchableOpacity>
					<Text
						style={styles.txtThisMonthText}>This Month</Text>
					<TouchableOpacity
						onPress={this.onNextMonthPressed}
						style={styles.nextMonthButton}>
						<Text
							style={styles.nextMonthButtonText}>Next Month</Text>
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
						marginLeft: 3,
						marginRight: 3,
						marginTop: 10,

					}}>
					<View
						style={styles.viewWeekDayHeadView}>
						<Text
							style={styles.sunText}>Sun</Text>
						<Text
							style={styles.monText}>Mon</Text>
						<Text
							style={styles.tueText}>Tue</Text>
						<Text
							style={styles.wedText}>Wed</Text>
						<Text
							style={styles.thuText}>Thu</Text>
						<Text
							style={styles.friText}>Fri</Text>
						<Text
							style={styles.satText}>Sat</Text>
					</View>


					<View style={styles.MainContainer}>
						<FlatList
							data={ this.state.data}
							renderItem={renderItem}
							numColumns={7}
							keyExtractor={item => item.id}
						/>
					</View>


				</View>

				<View
					pointerEvents="box-none"
					style={{
						height: 1,
					}}>
					<View
						style={styles.viewFooterMenuView}>
						<View
							style={styles.viewFooterMenuTwoView}>
							<View
								pointerEvents="box-none"
								style={{
									position: "absolute",
									left: 89,
									right: 39,
									top: 2,
									height: 49,
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
					</View>
					
					<View
						style={styles.viewFooterMenuThreeView}>
						<View
							style={styles.viewFooterMenuFourView}>
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
									onPress={this.onTxtDayTwoPressed}
									style={styles.txtDayTwoButton}>
									<Text
										style={styles.txtDayTwoButtonText}>Day</Text>
								</TouchableOpacity>
								<View
									style={{
										flex: 1,
									}}/>
								<TouchableOpacity
									onPress={this.onTxtMonthTwoPressed}
									style={styles.txtMonthTwoButton}>
									<Text
										style={styles.txtMonthTwoButtonText}>Month</Text>
								</TouchableOpacity>
							</View>
							<TouchableOpacity
								onPress={this.onTxtWeekTwoPressed}
								style={styles.txtWeekTwoButton}>
								<Text
									style={styles.txtWeekTwoButtonText}>Week</Text>
							</TouchableOpacity>
						</View>
						<View
							style={styles.tabBarIpadRegTwoView}>								
							<View
								style={{
									flex: 1,
								}}/>	
							<TouchableOpacity
								onPress={this.onTab2FourPressed}
								style={styles.tab2FourButton}>
								<Text
									style={styles.tab2FourButtonText}>Specifications</Text>
							</TouchableOpacity>
							<View
								style={{
									flex: 1,
								}}/>								
							<TouchableOpacity
								onPress={this.onTab2ThreePressed}
								style={styles.tab2ThreeButton}>
								<Text
									style={styles.tab2ThreeButtonText}>Courses</Text>
							</TouchableOpacity>
							<View
								style={{
									flex: 1,
								}}/>
							<TouchableOpacity
								onPress={ () => {Alert.alert("Feature coming soon.")}}
								style={styles.tab2ThreeButton}>
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
	
	onShiftPressed = (item) => {  
		item['formatted_current_date'] = global.todayText
		let shiftDate = Moment(item.end_time).format('Y-MM-DD')
		let today = Moment(Date.now()).format('Y-MM-DD')


		if(shiftDate == today){
			global.shifttype = "real";
		}else{
			global.shifttype = "info";
		}
		const { navigate } = this.props.nav.props.navigation

		//navigate("Classroom",{ parameters: item ,_onLoadGetUsers :this.props.navigation.state.params._onLoadGetUsers}) 
		navigate("Classroom",{ parameters: item ,_onLoadGetUsers :this.props.nav.props.navigation.state.params._onLoadGetUsers}) 
	}

	render(){
			if(this.props.result){  
				let res = this.props.result;
			

				let date = "";
				let celBackStyle = styles.celView;
				
				if(res.item.current_day !== 0) date = res.item.current_day.toString();
				if(res.item.day_of_week === 0 || res.item.day_of_week === 6 ) celBackStyle = styles.celViewWeekend;

				let  card1 = <View style={styles.viewShiftDView}>
								</View>;
				
				
				if(res.item.shifts[0] && res.item.shifts[0].class_time !== ""  ){
					var objectItem = res.item.shifts[0];
					var imgIcon ;

					if(res.item.shifts[0].class_time === "Weekend" ){
						imgIcon = require("./../../assets/images/trazado-107.png");
					}

					if(res.item.shifts[0].class_time === "Day" ){
						imgIcon = require("./../../assets/images/grupo-46.png");
					}

					if(res.item.shifts[0].class_time === "Evening" ){
						imgIcon = require("./../../assets/images/grupo-49.png");
					}

					if(res.item.shifts[0].class_time !== "Evening"  && 
						res.item.shifts[0].class_time !== "Day"  && 
						res.item.shifts[0].class_time !== "Weekend"   ){
							imgIcon = require("./../../assets/images/trazado-107-T.png");
							
					}
					if(res.item.shifts[0].class_time === "Evening")
						card1 = this.cardEvening(objectItem);
					else
						card1 = this.card(objectItem,imgIcon);
				}
				
				let  card2 = <View ></View>

				if(res.item.shifts[1] && res.item.shifts[1].class_time !== ""  ){
					var objectItem = res.item.shifts[1];
					var imgIcon ;

					if(res.item.shifts[1].class_time === "Weekend" ){
						imgIcon = require("./../../assets/images/trazado-107.png");
					}

					if(res.item.shifts[1].class_time === "Day" ){
						imgIcon = require("./../../assets/images/grupo-46.png");
					}

					if(res.item.shifts[1].class_time === "Evening" ){
						imgIcon = require("./../../assets/images/grupo-49.png");
					}

					if(res.item.shifts[1].class_time !== "Evening"  && 
						res.item.shifts[1].class_time !== "Day"  && 
						res.item.shifts[1].class_time !== "Weekend"   ){
							imgIcon = require("./../../assets/images/trazado-107-T.png");
							
					}
					if(res.item.shifts[1].class_time === "Evening")
						card2 = this.cardEvening(objectItem);
					else
						card2 = this.card(objectItem,imgIcon);
				}	
				

				
				if( res.item.current_day !== 0 && res.item.shifts.length !== 0 
					&&  (res.item.shifts[0].class_time === "Day" 
					|| res.item.shifts[0].class_time === "Weekend"  
					|| res.item.shifts[0].class_time === "Accelerated" ) ){
						let objectItem = res.item.shifts[0];
						let imgIcon ;
						if(res.item.shifts[0].class_time === "Weekend" ){
							imgIcon = require("./../../assets/images/trazado-107.png");
						}else{
							if(res.item.shifts[0].class_time === "Day" )
								imgIcon = require("./../../assets/images/grupo-46.png");
							else
								imgIcon = require("./../../assets/images/img-none.png");
						}
						//if(res.item.shifts[0].class_time === "Weekend" )
						card1 = this.card(objectItem,imgIcon);
							
					}

		
					if( res.item.current_day !== 0 &&  res.item.shifts.length !== 0 && (res.item.shifts[0].class_time === "Evening" ||  ( res.item.shifts.length === 2 &&  res.item.shifts[1].class_time === "Evening"  ) ) ){	
						let objectItem;
						if(res.item.shifts[0].class_time === "Evening") objectItem = res.item.shifts[0];
						//if( res.item.shifts.length === 2 &&  res.item.shifts[1].class_time === "Evening"  )  objectItem = res.item.shifts[1];
						objectItem = res.item.shifts[1];
						//card2 =this.cardEvening(objectItem);

					}

							return( 
								<View
								style={celBackStyle}>
								<Text
									style={styles.txtDayText}>{date}</Text>
									{card1}
									{card2}
									

							</View>

								)
				}
			}
			card = (objectItem,imgIcon) => {
				return(

					<View
						style={styles.viewShiftDView}>
					   <TouchableOpacity   delayPressIn={5} delayPressOut={5} delayLongPress={5}
				             onPressIn={() => {this.onShiftPressed(objectItem)}} >
								<View
									pointerEvents="box-none"
									style={{
										position: "absolute",
										left: 0,

										top: 0,
										height: 89,
										alignItems: "flex-start",
									}}>
									<View
										style={styles.viewHeadDView}/>
									<View
										style={styles.viewTimeWView}>
										<Image
											source={imgIcon}
											style={styles.imgIcoTimeWImage}/>
										<Text
											style={styles.txtTimeWText}>{objectItem.class_time}</Text>
									</View>
									<Text
										style={styles.txtClassWText}>Class #{objectItem.class_number}</Text>
									<Text
										style={styles.txtStudensWText}>{objectItem.students_count} Students</Text>
								</View>
								<Text
									style={styles.txtCityDText}>{objectItem.city}</Text>
								<Text
									style={styles.txtProgramDText}>{objectItem.class_type}</Text>
								<Text
									style={styles.txtHoursWText}>{objectItem.class_hours}</Text>

						</TouchableOpacity>			
					</View>
						
				)
			}

			cardEvening = (objectItem) => {
				return(
					<View
							style={styles.viewShiftEView}>
					     <TouchableOpacity  delayPressIn={5} delayPressOut={5} delayLongPress={5}
				             onPressIn={() => {this.onShiftPressed(objectItem)}} >
							<View
								pointerEvents="box-none"
								style={{
									position: "absolute",
									left: 0,
									top: 0,
									height: 89,
									alignItems: "flex-start",
								}}>
								<View
									style={styles.viewHeadEView}/>
								<View
									style={styles.viewTimeBView}>
									<Image
										source={require("./../../assets/images/grupo-49.png")}
										style={styles.imgIcoTimeBImage}/>
									<Text
										style={styles.txtTimeBText}> {objectItem.class_time}</Text>
								</View>
								<Text
									style={styles.txtClassBText}>Class #{objectItem.class_number}</Text>
								<Text
									style={styles.txtStudensBText}>{objectItem.students_count} Students</Text>
							</View>
							<Text
								style={styles.txtCityEText}>{objectItem.city}</Text>
							<Text
								style={styles.txtProgramEText}>{objectItem.class_type}</Text>
							<Text
								style={styles.txtHoursBText}>{objectItem.class_hours}</Text>
                         </TouchableOpacity>
					</View>
								
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

		paddingTop: (Platform.OS) === 'ios' ? 35 : 0,
		backgroundColor: "transparent",
		position: "absolute",
		alignSelf: "center",
		width: 789,
		top: 8,
		bottom: 114,
		left:2,
		},
		
		GridViewBlockStyle: {  // Cell
		  justifyContent: 'center',
		  flex:1,
		  alignItems: 'center',
		  height: 323,
		  margin: 7,
		  backgroundColor: '#00BCD4',

		
		}
		,
		
		GridViewInsideTextItemStyle: {
		
		   color: '#fff',
		   padding: 10,
		   fontSize: 18,
		   justifyContent: 'center',
		   
		 },	
	celView: {
		backgroundColor: "rgb(255, 255, 255)",
		borderWidth: 1,
		borderColor: "rgb(218, 219, 221)",
		borderStyle: "solid",
		width: 108,
		alignItems: "flex-end",
		
	},
	celViewWeekend: {
		backgroundColor: "rgb(244, 244, 246)",
		borderWidth: 1,
		borderColor: "rgb(218, 219, 221)",
		borderStyle: "solid",
		width: 108,
		alignItems: "flex-end",
		
	},
	
	txtDayText: {
		color: "rgb(112, 112, 112)",
		fontFamily: "SFProText-Regular",
		fontSize: 20,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "right",
		backgroundColor: "transparent",
		width: 29,
		height: 24,
		marginRight: 16,
		marginTop: 1,
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
	nextMonthButtonText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 20,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
	},
	nextMonthButton: {
		backgroundColor: "transparent",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-end",
		padding: 0,
		width: 127,
		height: 24,
		marginTop: 23,
	},
	txtThisMonthText: {
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
	previousMonthButton: {
		backgroundColor: "transparent",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		width: 169,
		height: 24,
		marginTop: 23,
	},
	previousMonthButtonText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 20,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
	},
	viewView: {
		backgroundColor: "rgb(239, 239, 244)",
		flex: 1,
	},
	viewHeaderView: {
		backgroundColor: "transparent",
		height: 61,
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
	btnUserButtonImage: {
		resizeMode: "contain",
	},
	imgBkgHeaderImage: {
		backgroundColor: "transparent",
		shadowColor: "rgba(0, 0, 0, 0.2)",
		shadowRadius: 6,
		shadowOpacity: 1,
		resizeMode: "cover",
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		height: 67,
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
		backgroundColor: "transparent",
		resizeMode: "center",
		width: 18,
		height: 26,
		marginTop: 9,
	},
	viewWeekDayHeadView: {
		backgroundColor: "transparent",
		position: "absolute",
		alignSelf: "center",
		justifyContent: 'space-between',
		width: 690,
		top: 0,
		height: 30,
		flexDirection: "row",
		alignItems: "flex-end",
		
	},
	sunText: {
		backgroundColor: "transparent",
		color: "rgb(112, 112, 112)",
		fontFamily: "SFProText-Regular",
		fontSize: 20,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
	},
	monText: {
		color: "rgb(22, 22, 22)",
		fontFamily: "SFProText-Regular",
		fontSize: 20,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		marginTop: 2,
	},
	tueText: {
		backgroundColor: "transparent",
		color: "rgb(22, 22, 22)",
		fontFamily: "SFProText-Regular",
		fontSize: 20,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
	},
	wedText: {
		backgroundColor: "transparent",
		color: "rgb(22, 22, 22)",
		fontFamily: "SFProText-Regular",
		fontSize: 20,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
	},
	thuText: {
		backgroundColor: "transparent",
		color: "rgb(22, 22, 22)",
		fontFamily: "SFProText-Regular",
		fontSize: 20,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
	},
	friText: {
		backgroundColor: "transparent",
		color: "rgb(22, 22, 22)",
		fontFamily: "SFProText-Regular",
		fontSize: 20,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
	},
	satText: {
		backgroundColor: "transparent",
		color: "rgb(112, 112, 112)",
		fontFamily: "SFProText-Regular",
		fontSize: 20,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
	},
	viewScrollView: {
		backgroundColor: "transparent",
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
	},
	viewVcalendarView: {
		backgroundColor: "transparent",
		height: 908,
	},
	row1View: {
		backgroundColor: "transparent",
		height: 120,
		marginLeft: 3,
		marginRight: 3,
		marginTop: 32,
		flexDirection: "row",
		alignItems: "flex-start",
	},
	cel11View: {
		backgroundColor: "rgb(244, 244, 246)",
		borderWidth: 1,
		borderColor: "rgb(218, 219, 221)",
		borderStyle: "solid",
		width: 117,
		height: 120,
		marginLeft: 3,
	},
	cel12View: {
		backgroundColor: "white",
		borderWidth: 1,
		borderColor: "rgb(218, 219, 221)",
		borderStyle: "solid",
		width: 117,
		height: 120,
	},
	cel13View: {
		backgroundColor: "white",
		borderWidth: 1,
		borderColor: "rgb(218, 219, 221)",
		borderStyle: "solid",
		width: 117,
		height: 120,
	},
	cel14View: {
		backgroundColor: "white",
		borderWidth: 1,
		borderColor: "rgb(218, 219, 221)",
		borderStyle: "solid",
		width: 117,
		height: 120,
	},
	cel15View: {
		backgroundColor: "white",
		borderWidth: 1,
		borderColor: "rgb(218, 219, 221)",
		borderStyle: "solid",
		width: 117,
		height: 120,
	},
	cel16View: {
		backgroundColor: "white",
		borderWidth: 1,
		borderColor: "rgb(218, 219, 221)",
		borderStyle: "solid",
		width: 117,
		height: 121,
	},
	viewShiftEView: {
		backgroundColor: "rgb(58, 58, 58)",
		//left: 0,
		alignSelf: "stretch",
		height: 96,
	},
	viewShiftDView: {
		backgroundColor: "transparent",
		alignSelf: "stretch",
		height: 96,
	},

	viewTimeWView: {
		backgroundColor: "transparent",
		width: 96,
		height: 16,
		marginLeft: 5,
		marginTop: 4,
		flexDirection: "row",
		alignItems: "center",
	},
	imgIcoTimeWImage: {
		backgroundColor: "transparent",
		resizeMode: "stretch",
		width: 16,
		height: 16,
	},
	txtTimeWText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		flex: 1,
		marginLeft: 2,
	},
	txtClassWText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		width: 111,
		marginLeft: 4,
		marginTop: 1,
	},
	txtStudensWText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 10,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 110,
		marginLeft: 5,
		marginTop: 14,
	},
	txtCityDText: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 10,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		lineHeight: 12,
		paddingTop: 1,
		position: "absolute",
		left: 5,
		width: 110,
		top: 0,
	},
	txtProgramDText: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 10,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		lineHeight: 12,
		paddingTop: 1,
		position: "absolute",
		left: 5,
		width: 110,
		top: 12,
		height: 13,
	},
	txtHoursWText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 10,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		position: "absolute",
		left: 4,
		width: 111,
		top: 61,
	},
	btnShiftDButton: {
		backgroundColor: "transparent",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		position: "absolute",
		left: 5,
		right: 5,
		top: 4,
		height: 87,
	},
	btnShiftDButtonText: {
		color: "black",
		fontFamily: ".AppleSystemUIFont",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
	},
	btnShiftDButtonImage: {
		resizeMode: "contain",
	},
	row2View: {
		backgroundColor: "transparent",
		height: 216,
		marginLeft: 3,
		marginRight: 3,
		flexDirection: "row",
		alignItems: "flex-start",
	},
	cel21View: {
		backgroundColor: "rgb(244, 244, 246)",
		borderWidth: 1,
		borderColor: "rgb(218, 219, 221)",
		borderStyle: "solid",
		width: 117,
		height: 216,
		marginLeft: 3,
		alignItems: "flex-end",
	},
	txtDay21Text: {
		backgroundColor: "transparent",
		color: "rgb(112, 112, 112)",
		fontFamily: "SFProText-Regular",
		fontSize: 20,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "right",
		width: 30,
		marginRight: 15,
		marginTop: 1,
	},
	cel22View: {
		backgroundColor: "white",
		borderWidth: 1,
		borderColor: "rgb(218, 219, 221)",
		borderStyle: "solid",
		width: 117,
		height: 216,
		alignItems: "flex-end",
	},
	txtDay22Text: {
		backgroundColor: "transparent",
		color: "black",
		fontFamily: "SFProText-Regular",
		fontSize: 20,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "right",
		width: 30,
		marginRight: 15,
		marginTop: 1,
	},
	viewShiftDTwoView: {
		backgroundColor: "transparent",
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		height: 96,
	},
	viewHeadDTwoView: {
		backgroundColor: "rgb(139, 25, 54)",
		width: 117,
		height: 26,
	},
	viewTimeWTwoView: {
		backgroundColor: "transparent",
		width: 96,
		height: 16,
		marginLeft: 5,
		marginTop: 4,
		flexDirection: "row",
		alignItems: "center",
	},
	imgIcoTimeWTwoImage: {
		backgroundColor: "transparent",
		resizeMode: "stretch",
		width: 16,
		height: 16,
	},
	txtTimeWTwoText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		flex: 1,
		marginLeft: 2,
	},
	txtClassWTwoText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		width: 111,
		marginLeft: 4,
		marginTop: 1,
	},
	txtStudensWTwoText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 10,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 110,
		marginLeft: 5,
		marginTop: 14,
	},
	txtCityDTwoText: {
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 10,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		lineHeight: 12,
		paddingTop: 1,
		backgroundColor: "transparent",
		position: "absolute",
		left: 5,
		width: 110,
		top: 0,
	},
	txtProgramDTwoText: {
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 10,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		lineHeight: 12,
		paddingTop: 1,
		backgroundColor: "transparent",
		position: "absolute",
		left: 5,
		width: 110,
		top: 12,
		height: 13,
	},
	txtHoursWTwoText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 10,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		position: "absolute",
		left: 4,
		width: 111,
		top: 61,
	},
	btnShiftDTwoButton: {
		backgroundColor: "transparent",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		position: "absolute",
		left: 5,
		right: 5,
		top: 4,
		height: 87,
	},
	btnShiftDTwoButtonImage: {
		resizeMode: "contain",
	},
	btnShiftDTwoButtonText: {
		color: "black",
		fontFamily: ".AppleSystemUIFont",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
	},
	viewHeadEView: {
		backgroundColor: "rgb(139, 25, 54)",
		width: 103,
		height: 26,
	},
	viewHeadDView: {
		backgroundColor: "rgb(139, 25, 54)",
		width: 108,
		height: 26,
	},
	viewTimeBView: {
		backgroundColor: "transparent",
		width: 108,
		height: 16,
		marginLeft: 4,
		marginTop: 4,
		flexDirection: "row",
		alignItems: "center",
	},
	imgIcoTimeBImage: {
		resizeMode: "stretch",
		backgroundColor: "transparent",
		width: 16,
		height: 15,
	},
	txtTimeBText: {
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		alignSelf: "flex-start",
		marginLeft: 6,
	},
	txtClassBText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		marginLeft: 4,
		marginTop: 1,
	},
	txtStudensBText: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 10,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 104,
		marginLeft: 5,
		marginTop: 14,
	},
	txtCityEText: {
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 10,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		lineHeight: 12,
		paddingTop: 1,
		backgroundColor: "transparent",
		position: "absolute",
		left: 5,
		width: 110,
		top: 0,
	},
	txtProgramEText: {
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 10,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		lineHeight: 12,
		paddingTop: 1,
		backgroundColor: "transparent",
		position: "absolute",
		left: 5,
		width: 110,
		top: 12,
		height: 13,
	},
	txtHoursBText: {
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 10,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		position: "absolute",
		left: 4,
		top: 61,
	},
	btnShiftDThreeButton: {
		backgroundColor: "transparent",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		position: "absolute",
		left: 4,
		right: 6,
		top: 3,
		height: 87,
	},
	btnShiftDThreeButtonImage: {
		resizeMode: "contain",
	},
	btnShiftDThreeButtonText: {
		color: "black",
		fontFamily: ".AppleSystemUIFont",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
	},
	cel23View: {
		backgroundColor: "white",
		borderWidth: 1,
		borderColor: "rgb(218, 219, 221)",
		borderStyle: "solid",
		width: 117,
		height: 216,
		alignItems: "flex-end",
	},
	txtDay23Text: {
		color: "black",
		fontFamily: "SFProText-Regular",
		fontSize: 20,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "right",
		backgroundColor: "transparent",
		width: 29,
		marginRight: 16,
		marginTop: 1,
	},
	viewShiftETwoView: {
		backgroundColor: "rgb(58, 58, 58)",
		alignSelf: "stretch",
		height: 96,
	},
	viewHeadETwoView: {
		backgroundColor: "rgb(139, 25, 54)",
		width: 117,
		height: 26,
	},
	viewTimeBTwoView: {
		backgroundColor: "transparent",
		width: 108,
		height: 16,
		marginLeft: 4,
		marginTop: 4,
		flexDirection: "row",
		alignItems: "center",
	},
	imgIcoTimeBTwoImage: {
		resizeMode: "stretch",
		backgroundColor: "transparent",
		width: 16,
		height: 15,
	},
	txtTimeBTwoText: {
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		alignSelf: "flex-start",
		marginLeft: 6,
	},
	txtClassBTwoText: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		marginLeft: 4,
		marginTop: 1,
	},
	txtStudensBTwoText: {
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 10,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 104,
		marginLeft: 5,
		marginTop: 14,
	},
	txtCityETwoText: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 10,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		lineHeight: 12,
		paddingTop: 1,
		position: "absolute",
		left: 5,
		width: 110,
		top: 0,
	},
	txtProgramETwoText: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 10,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		lineHeight: 12,
		paddingTop: 1,
		position: "absolute",
		left: 5,
		width: 110,
		top: 12,
		height: 13,
	},
	txtHoursBTwoText: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 10,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		position: "absolute",
		left: 4,
		top: 61,
	},
	btnShiftDFourButton: {
		backgroundColor: "transparent",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		position: "absolute",
		left: 4,
		right: 6,
		top: 3,
		height: 87,
	},
	btnShiftDFourButtonText: {
		color: "black",
		fontFamily: ".AppleSystemUIFont",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
	},
	btnShiftDFourButtonImage: {
		resizeMode: "contain",
	},
	cel24View: {
		backgroundColor: "white",
		borderWidth: 1,
		borderColor: "rgb(218, 219, 221)",
		borderStyle: "solid",
		width: 117,
		height: 216,
		alignItems: "flex-end",
	},
	txtDay24Text: {
		color: "black",
		fontFamily: "SFProText-Regular",
		fontSize: 20,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "right",
		backgroundColor: "transparent",
		width: 29,
		marginRight: 16,
		marginTop: 5,
	},
	cel25View: {
		backgroundColor: "white",
		borderWidth: 1,
		borderColor: "rgb(218, 219, 221)",
		borderStyle: "solid",
		width: 117,
		height: 216,
		alignItems: "flex-end",
	},
	txtDay25Text: {
		backgroundColor: "transparent",
		color: "black",
		fontFamily: "SFProText-Regular",
		fontSize: 20,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "right",
		width: 29,
		marginRight: 16,
		marginTop: 1,
	},
	cel26View: {
		backgroundColor: "white",
		borderWidth: 1,
		borderColor: "rgb(218, 219, 221)",
		borderStyle: "solid",
		width: 117,
		height: 216,
		alignItems: "flex-end",
	},
	txtDay26Text: {
		backgroundColor: "transparent",
		color: "black",
		fontFamily: "SFProText-Regular",
		fontSize: 20,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "right",
		width: 29,
		marginRight: 16,
		marginTop: 1,
	},
	cel27View: {
		backgroundColor: "rgb(244, 244, 246)",
		borderWidth: 1,
		borderColor: "rgb(218, 219, 221)",
		borderStyle: "solid",
		width: 117,
		height: 216,
		alignItems: "flex-end",
	},
	txtDay27Text: {
		color: "rgb(112, 112, 112)",
		fontFamily: "SFProText-Regular",
		fontSize: 20,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "right",
		backgroundColor: "transparent",
		width: 29,
		marginRight: 12,
		marginTop: 1,
	},
	viewFooterMenuView: {
		backgroundColor: "red",
		shadowColor: "rgba(0, 0, 0, 0.15)",
		shadowRadius: 4,
		shadowOpacity: 1,
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
		height: 119,
	},
	viewFooterMenuTwoView: {
		backgroundColor: "blue",//
		position: "absolute",
		alignSelf: "center",
		width: 850,
		bottom: 60,
		height: 59,
	},
	txtDayButtonText: {
		color: "black",
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
	txtDayButton: {
		backgroundColor: "transparent",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		width: 83,
		height: 49,
	},
	txtMonthButtonImage: {
		resizeMode: "contain",
		marginRight: 10,
	},
	txtMonthButtonText: {
		color: "rgb(139, 25, 54)",
		fontFamily: "Montserrat-Bold",
		fontSize: 31,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
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
	txtWeekButtonImage: {
		resizeMode: "contain",
		marginRight: 10,
	},
	txtWeekButtonText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 29,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
	},
	tabBarIpadRegView: {
		backgroundColor: "rgba(36, 36, 36, 1)",
		shadowColor: "rgba(0, 0, 0, 0.3)",
		shadowRadius: 0,
		shadowOpacity: 1,
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
		height: 65,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: 'space-between',		
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
		width: 122,
		height: 40,
		marginLeft: 196,
	},
	tab2ButtonImage: {
		resizeMode: "contain",
		marginRight: 10,
	},
	tab2ButtonText: {
		color: "white",
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
	tab2TwoButtonText: {
		color: "rgb(153, 153, 153)",
		fontFamily: "SFProText-Regular",
		fontSize: 13,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
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
		width: 120,
		height: 40,
		marginRight: 209,
	},
	viewFooterMenuThreeView: {
		backgroundColor: "transparent",
		shadowColor: "rgba(0, 0, 0, 0.15)",
		shadowRadius: 4,
		shadowOpacity: 1,
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
		height: 119,
	},
	viewFooterMenuFourView: {
		backgroundColor: "white",
		position: "absolute",
		alignSelf: "center",
		width: 850,
		bottom: 60,
		height: 59,
	},
	txtDayTwoButton: {
		backgroundColor: "transparent",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		width: 83,
		height: 49,
	},
	txtDayTwoButtonImage: {
		resizeMode: "contain",
		marginRight: 10,
	},
	txtDayTwoButtonText: {
		color: "rgb(3, 3, 3)",
		fontFamily: "Montserrat-Bold",
		fontSize: 30,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
	},
	txtMonthTwoButtonImage: {
		resizeMode: "contain",
		marginRight: 10,
	},
	txtMonthTwoButtonText: {
		color: "rgb(139, 25, 54)",
		fontFamily: "Montserrat-Bold",
		fontSize: 31,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
	},
	txtMonthTwoButton: {
		backgroundColor: "transparent",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		width: 139,
		height: 49,
		marginTop: 1,
	},
	txtWeekTwoButtonText: {
		color: "rgb(22, 22, 22)",
		fontFamily: "Montserrat-Bold",
		fontSize: 29,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
	},
	txtWeekTwoButton: {
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
	txtWeekTwoButtonImage: {
		resizeMode: "contain",
		marginRight: 10,
	},
	tabBarIpadRegTwoView: {
		backgroundColor: "rgba(36, 36, 36, 1)",
		shadowColor: "rgba(0, 0, 0, 0.3)",
		shadowRadius: 0,
		shadowOpacity: 1,
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
		height: 65,
		flexDirection: "row",
		alignItems: "center",
	},
	tab2ThreeButtonText: {
		color: "white",
		fontFamily: "SFProText-Regular",
		fontSize: 13,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
	},
	tab2ThreeText: {
		color: "rgb(153, 153, 153)",
		fontFamily: "SFProText-Regular",
		fontSize: 13,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
	},
	tab2ThreeButton: {
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
	tab2ThreeButtonImage: {
		resizeMode: "contain",
		marginRight: 10,
	},
	tab2FourButton: {
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
	tab2FourButtonImage: {
		resizeMode: "contain",
		marginRight: 10,
	},
	tab2FourButtonText: {
		color: "rgb(153, 153, 153)",
		fontFamily: "SFProText-Regular",
		fontSize: 13,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
	},
})
