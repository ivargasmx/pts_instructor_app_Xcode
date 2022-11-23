//
//  Shift
//  Ipad Trainer Portal-r2-b
//
//  Created by [Author].
//  Copyright © 2018 [Company]. All rights reserved.
//

import React from "react"
import { Image, StyleSheet, Text, View,TouchableWithoutFeedback	,Animated,
Alert
,TouchableOpacity,ScrollView 
} from "react-native"

import Moment from 'moment';
import CalendarHeader from "../Headers/CalendarHeader";
import FlashMessage from "react-native-flash-message";
import Toast from 'react-native-tiny-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import connDBHelper   from "../Helper/Dao";
import connectionHelper   from "../Helper/Connection"; 
import SubmitErrorButton from "../SubmitError/SubmitErrorButton";
import ErrorHandler    from "../Helper/ErrorHandler" 
import TimerMixin from 'react-timer-mixin';
import authHelper   from "../Helper/Sessions";
import StillConnection from "../Helper/StillConnection"

import "./../../global.js";

export default class Shift extends React.Component {

	static navigationOptions = ({ navigation }) => {


//this.props.nav.props.navigation.state.params._onLoadGetUsers)		
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
			id : "",
			authenticated : 0,
			day :-1,
			even : -1,
			shiftsCount : 0,
			today : "",
			current_date: "",
			current_month_end:"",
			current_month_start: "",
			current_week_end: "",
			current_week_start: "",
			formatted_current_date : "",
			returnShifts : [],
			_objResultTxt : null, 
			returnInstructor : null,
			next_shift: null,
			clock : 0,
			backgroundColorBtnClockIn :"rgb(0,154,218)",
			animation : new Animated.Value(0),
			moveAnimationR: new Animated.Value(0),
			modalVisible: false,
			specifications_locations : null,
			stylePaddingLeftExtra:{flex: 0.2 },
		  }
	}



	onLoginfailure = () => {
	
		const { navigate } = this.props.navigation
		
		navigate("Login",{_onLoadGetUsers :this.props.navigation.state.params._onLoadGetUsers})
	}

	componentDidMount() {
		global.logs = "";
		let objResultTxt = "";
		this._moveR =true;

		if( global.connection !== 1) {

			if(this.props.navigation.state.params.localShifts !== undefined ) { //&& this.props.navigation.state.params.localShifts['object'] !== undefined){ 
			    objResultTxt = this.props.navigation.state.params.localShifts.object;
				//console.log(objResultTxt);
				this.shiftHandler(objResultTxt,1);
			} 
			 
			return;
		}		  
 
       

		global.name ="";
		var _url = global.host + '/api/auth/shift';
		fetch(_url, {
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
			
				 global.logs = ErrorHandler.setMessageResponse( "","",responseData,"response","",_url,global.id,global.name ,global.email);
	
				   try {
					   var responseTXT = responseData;
					   this.shiftHandler(responseTXT,0);


				   } catch (e) {
					   console.log(e);
					   this.setState({
						   authenticated :0
					   });
						global.logs = ErrorHandler.setMessageResponseAdd( global.logs,"","","error",e.toString(),_url,global.id,global.name ,global.email);

					   Alert.alert("Error:", "Problems connecting to the Server. Please try again later.");

				   }

				}).catch((error) => {
				  console.log(error);	 
				  console.error(error);
				  global.logs = ErrorHandler.setMessageResponseAdd( global.logs,"","","error",error.toString(),_url,global.id,global.name ,global.email);

				  this.setState({
					 authenticated :0
				   });
				});
	}

shiftHandler = (responseTXT,local) => {

		var responseJSON = JSON.parse (responseTXT); 
		var instructor;
		var shifts;
		var shift_count =0;
	   if(responseJSON['success'] !== undefined && responseJSON['success']) {
			 

			 
			 let _next_shifts = null;
			 let returnShifts = [];
			 let clocked_in = null;

 
			 if(local === 1){
				 _next_shifts = responseJSON['next_shifts'];
				 _next_shifts.map((item) => {
						global.next_shift  = item.shifts.shift;
						returnShifts.push( item.shifts.shift);

						global.todayText = _next_shifts[0].formatted_current_date;
						global.today =   _next_shifts[0].current_date;
						global.current_month_end = _next_shifts[0].current_month_end;
						global.current_month_start = _next_shifts[0].current_month_start;
						global.current_week_end = _next_shifts[0].current_week_end;
						global.current_week_start = _next_shifts[0].current_week_start;

						
				 })
				 shifts = returnShifts;
				 instructor =  _next_shifts[0].instructor;

				 this.setState({next_shift :  _next_shifts[0]});
	 
			 }else{
	 
				global.todayText = responseJSON.formatted_current_date;
				global.today = responseJSON.current_date;
				global.current_month_end = responseJSON.current_month_end;
				global.current_month_start = responseJSON.current_month_start;
				global.current_week_end = responseJSON.current_week_end;
				global.current_week_start = responseJSON.current_week_start;
				shifts =  responseJSON['shifts'];
				instructor = responseJSON.instructor;

			 }

			 global.required_checkout_pictures = instructor.require_clockout_pictures == 0 ? false: true;
             console.log("required checkout pictures : ",global.required_checkout_pictures);
			 
			 global.require_inventory_confirm = 
			   ( instructor.require_inventory_confirm != undefined
				 && instructor.require_inventory_confirm != 0 // && instructor.require_inventory_confirm != null
				 ) ? true: false;
             
		
		     console.log("required inventory config : ",global.require_inventory_confirm);

			 global.instructor_id  = instructor.id;
			 global.id=  instructor.id;
			 global.name = instructor.name;
			 global.phone = instructor.phone;
			 global.address = instructor.address;
			 global.state = instructor.state; 
			 global.city = shifts[0]['city'] ;

			 global.zip = instructor.zip;
			 global.notes = instructor.notes;
			 global.created_at = instructor.created_at;
			 global.updated_at = instructor.updated_at;
			 global.user_id = instructor.user_id;
			 global.deleted_at = instructor.deleted_at;
			 global.disabled_at = instructor.disabled_at;
			 global.assigned_states = instructor.assigned_states;
			 global.available_schedule = instructor.available_schedule; 


			 global.current_month_end_orig = global.current_month_end;
			 global.current_month_start_orig = global.current_month_start;
			 global.current_week_end_orig = global.current_week_end;
			 global.current_week_start_orig = global.current_week_start;

			 console.log(global.current_week_start_orig)


			 if(responseJSON['success'] === true){    
   
				 global.todayFormat = Moment(global.today).format('MMM DD YYYY') ;

				 global.todayMonth = parseInt( global.today.substring(5,7) , 10); 
				 global.todayYear = parseInt( global.today.substring(0,4) , 10); 
				 global.todayDay = parseInt( global.today.substring(8,10) , 10); 

				 
				 shift_count = Object.keys(shifts).length;

				 global.todayDate = new Date(global.todayYear, global.todayMointh - 1, global.todayDay); 

				 let lastDayOfMonth  = new Date(global.todayYear, global.todayMonth , 0); 

				 let firstDayOfMonth  = new Date(global.todayYear, global.todayMonth -1 , 1); //onChange date//

				 global.current_month_end_number = lastDayOfMonth.getDate();

				 global.current_month_start_day = firstDayOfMonth.getUTCDay(); //onChange date//

				 global.leapYear   = ((global.todayYear % 4 == 0) && (global.todayYear % 100 != 0)) || (global.todayYear % 400 == 0);




				if(responseJSON["next_shifts"] !== undefined  &&  responseJSON["next_shifts"] && local !== 1 ) {
				   let next_shifts  = responseJSON["next_shifts"][0];
				   

				}

				clocked_in = {is_clocked_in:responseJSON['is_clocked_in'] ,clocked_in_shift: responseJSON['clocked_in_shift'] }

				//global.logs = "Clock - Shift: " + JSON.stringify(responseJSON['clocked_in_shift']) + "\n";
				if(responseJSON['is_clocked_in']){
					global.clock = 1;
					this.setState({clock:global.clock});
					global.shift_time_id = responseJSON['clocked_in_shift'].shift_time_id;
					global.clockTime = responseJSON['clocked_in_shift'].clock_in_time;
				}else{
					global.clock = 0;
					this.setState({clock:global.clock});
					global.shift_time_id = 0;
					global.clockTime = Moment(Date.now()).format('hh:mm a')  ;
				}
                var timeOutClockIN =null;
	
				if(! responseJSON['is_clocked_in']){
					console.log("is_clocked_in**********")
					timeOutClockIN = TimerMixin.setTimeout(
								() => { 
								console.log("logOut ,.,.,.,.,.,.,.,.,.")
								authHelper.logOut(global.host,global.access_token);  
								this.onLoginfailure()
								},
								global.time_out_logout_no_clockIn
					);
				 
				 
				}else{
					 TimerMixin.clearTimeout(timeOutClockIN);
				}

				console.log("clocked_in")
				console.log(clocked_in)
				console.log(global.clockTime)
				
				if(responseJSON['specifications_locations']){
					
					global.specifications_locations = responseJSON['specifications_locations'];
					//global.logs = global.logs +  "\n Specification State/City: \n " + JSON.stringify(global.specifications_locations)+ "\n";
					
				}


			 }
							 

		}else{

			if(responseJSON['message']  == "No Shifts Found"){
				global.todayText = responseJSON.formatted_current_date;
				global.today = responseJSON.current_date;
				global.current_month_end = responseJSON.current_month_end;
				global.current_month_start = responseJSON.current_month_start;
				global.current_week_end = responseJSON.current_week_end;
				global.current_week_start = responseJSON.current_week_start;

				global.current_month_end_orig = global.current_month_end;
				global.current_month_start_orig = global.current_month_start;
				global.current_week_end_orig = global.current_week_end;
				global.current_week_start_orig = global.current_week_start;
				global.shift_found = false;
				

			}else{
				global.shift_found = true;
			}

		 Alert.alert(
			 'Attention !',
			 'No Shifts Found.',
			 [
			 {text: 'OK', onPress: () => console.log('OK Pressed')},
			 ],
			 {cancelable: false},
		 );
		}

		this.setState({
		   data :shifts ,
		}); 
		this.setState({
		   shiftsCount : shift_count,
		}); 
		this.setState({
		   today : global.todayText,   // OJO Aqui la fecha de Hoy
		}); 

		if(shift_count == 1){
			this.onBtn1PressedCheckClock(this.state.data[0])
		}
		
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
	}	

	onComGooglecodeItermPressed = () => {

		const { navigate } = this.props.navigation
		navigate("Login",{_onLoadGetUsers :this.props.navigation.state.params._onLoadGetUsers})
	}

	onBtn1PressedCheckClock = (item) => {
		item['formatted_current_date'] = global.todayText

		const { navigate } = this.props.navigation
		if( global.connection == 1) {
			global.shifttype = "real";
			navigate("Classroom",{ parameters: item ,_onLoadGetUsers :this.props.navigation.state.params._onLoadGetUsers}) 
		}else{	
			global.shifttype = "real";
			navigate("Classroom",{ parameters: item , next_shift:this.state.next_shift ,_onLoadGetUsers :this.props.navigation.state.params._onLoadGetUsers})	 
		}

	}

	onViewPressed = () => {
		global.current_month_end = global.current_month_end_orig ;
		global.current_month_start = global.current_month_start_orig ;
		global.current_week_end = global.current_week_end_orig ;
		global.current_week_start = global.current_week_start_orig ;

		const { navigate } = this.props.navigation
		
		navigate("Monthly",{_onLoadGetUsers :this.props.navigation.state.params._onLoadGetUsers})
	}

	onBtnUserPressed = () => {
	
	}

	onImgIconHeaderPressed = () => {
	
	}

	onTxtDayPressed = () => {
	
	}
	onClockInButtonPressedR = () => {
       console.log("...1")
	if(this._moveR){ // if Button Menu is  hidden
		console.log("...2")
		this.setState({stylePaddingLeftExtra:{flex: 9 }})
		this.onClockAllButtonPressedR()
		
		return;
	 }
	 this.setState({stylePaddingLeftExtra:{flex: 0.2 }})
	 console.log("...3")
		this._setIniR();
		const { navigate } = this.props.navigation
        if( global.clock ===0  ){
			Alert.alert(
				'Attention !',
				'You must Clock In before you can send Incident Report.',
				[
				{text: 'OK', onPress: () => {

					 }
				},
				],
				{cancelable: false},
			   );
           console.log('You must Clock In before you can send Incident Report')
		}else{
			navigate("InjuredPersonDetails",{_onLoadGetUsers :this.props.navigation.state.params._onLoadGetUsers});
		}

		
   } 
	_moveR = () => {
		console.log("Pressed!");
		if(this._moveR){
			Animated.timing(this.state.moveAnimationR, {
				toValue: 690,
				timing: 1000,
				useNativeDriver: true,
			}).start()
			
		}else{
			Animated.timing(this.state.moveAnimationR, {
				toValue: 0,
				timing: 1000,
				useNativeDriver: true,
			}).start()
			
		}
		this._moveR =! this._moveR
	}
	_setIniR = () => {
		
		Animated.timing(this.state.moveAnimationR, {
			toValue: 0,
			timing: 1000,
			useNativeDriver: true,

		}).start();
		this._moveR =! this._moveR 
	}

	_setOutR = () => {
		
		if(this._moveR){
			Animated.timing(this.state.moveAnimationR, {
				toValue: 690,
				timing: 1000,
				useNativeDriver: true,

			}).start()
		}else{
			/*Animated.timing(this.state.moveAnimation, {
				toValue: 0,
				timing: 1000,
				useNativeDriver: true,
			}).start()*/
		}
		
	}
	onClockAllButtonPressedR = () => {
		console.log(this._moveR)

		if(this._moveR){

			this._setOutR();
		}else{
			
			this._setIniR();
		}      
	  this._moveR =  false//! this._moveR

	  console.log("----")
	  console.log(this._moveR)
	  
	  
}

	onArrowBackButtonPressedR = () => {
		if(!this._moveR ){
			this.setState({stylePaddingLeftExtra:{flex: 0.2 }})
		}else{
			this.setState({stylePaddingLeftExtra:{flex: 9}})
		}
		
		
		this._setIniR();
	}	
	onArrowShowButtonPressed = () => {
		this._setIniR();
	}	


	onTxtWeekPressed = () => {
		global.current_month_end = global.current_month_end_orig ;
		global.current_month_start = global.current_month_start_orig ;
		global.current_week_end = global.current_week_end_orig ;
		global.current_week_start = global.current_week_start_orig ;
		const { navigate } = this.props.navigation
		navigate("Weekly",{_onLoadGetUsers :this.props.navigation.state.params._onLoadGetUsers})
	}

	onTxtMonthPressed = () => {
	
	}

	onTabAnouncements = () => {

	}

	onTabSpecificationsPressed = () => {
		console.log(this.state.data[0])
	  const { navigate } = this.props.navigation

      if(this.state.data && this.state.data.length > 0)
		 navigate("Specifications",{ header: this.state.data[0] ,_onLoadGetUsers :this.props.navigation.state.params._onLoadGetUsers});
	}
	showSendErrorScreen(navObj){
		const { navigate } = navObj

		navigate("SubmitError",{_onLoadGetUsers :navObj.state.params._onLoadGetUsers})
	}
	render() {
		const { modalVisible } = this.state; 

/*
		moveAnimationStyle = {
			transform: [
				{
					translateX: this.state.moveAnimationR
				}
			]
		}
*/		
		return <View 
				style={styles.viewView}>

				<CalendarHeader
					instructorName = {global.name}
					navigation = {this.props.navigation}
					_onLoadGetUsers = {this.props.navigation.state.params._onLoadGetUsers}
				>
				</CalendarHeader>

				<Text 
					style={styles.txtTodayCursesText}>Today's classes</Text>
				<Text
					style={styles.txtDateCourseText}>{this.state.today}</Text>

				<View>
			    { ! global.shift_found && 
				<View>
					<Text
					style={styles.txtNoShiftsFoundText}>No Shifts Found</Text>
				</View>
	            }        	

				<StillConnection  parentWindow = {this} />
					 
				  <KeyboardAwareScrollView  behavior={ Platform.OS === 'ios'? 'padding': null}
				      extraHeight = {210}
				       style= {styles.FlexGrowOne}>
					<ScrollView 
						style={styles.viewScrollView}>
						<ChildComponetsShifts  result={this.state.data}  nav ={this} /> 	
						<View
					style={{
						flex: 1,
					}}/>	
					</ScrollView>
				  </KeyboardAwareScrollView>	
			    </View>
				<FlashMessage position="top" />
				<View
					style={{
						flex: 1,
					}}/>
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
								onPress={this.onViewPressed}
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
							onPress={this.onTabSpecificationsPressed}
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
							<SubmitErrorButton callbackFunction={this.showSendErrorScreen} nav={this.props.navigation}/>	
						<View
							style={{
								flex: 1,
							}}/>											
					</View>
				</View>
				
				{ false &&
				<View style={styles.viewBandViewContainerReport} >		
						<TouchableWithoutFeedback delayLongPress={1000} style={styles.button}  > 
						   <Animated.View 
						       style={[styles.animatedContainer, moveAnimationStylex]}>
								<View style={styles.conteiner} >		
									<Image
										source={require("./../../assets/images/trazado-103.png")}
										style={styles.imgBkgWhiteImage2}/>
									<View style={styles.viewBandViewR}>	

											
											<View style={styles.viewBandViewR}>	 
												<TouchableOpacity
														onPress={this.onArrowBackButtonPressedR}>	
													<Image
													source={require("./../../assets/images/arow_back.png")}
														style={styles.imgArrowBackImage}/>    
												</TouchableOpacity>
													<View
															style={{
																flex: 11,
															}}/>	
												<TouchableOpacity
													onPress={this.onClockInButtonPressedR}>								
														<View
															style={{
																	//backgroundColor: "rgb(148, 233, 56)",
																	backgroundColor:"orange",
																	borderRadius: 20,
																	shadowColor: "rgba(0, 0, 0, 00.16)",
																	shadowRadius: 12,
																	shadowOpacity: 1,
																	width: 288,
																	height: 48,
																	marginTop: 11,
																	flexDirection: "row",
																	alignItems: "center"}
																}>
															<Text
																style={styles.txtClockInText}>Incident Report</Text>
															<View
																style={{
																	flex: 1,
																}}/>
															<Image
																source={require("./../../assets/images/grupo-60.png")}
																style={styles.imgClockInImage}/>
														</View>
													</TouchableOpacity>
													<View
											           style={this.state.stylePaddingLeftExtra}/>
											</View> 
							
										 { false && <View>
										    <View
													style={{
														flex: 1,
													}}/>
												<TouchableOpacity
														onPress={this.onClockAllButtonPressedR}>	
													<Image
													source={require("./../../assets/images/alert.png")}
														style={styles.imgIncidentImage}/>    
												</TouchableOpacity>	
											</View>
										}
																						
									      </View>
								</View>
						   </Animated.View>
					    </TouchableWithoutFeedback> 					
					</View> 

				}
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
			//console.log(this.props.result);
			var res = this.props.result.map((item,i)=>{
				let icon ;
				let background ;
				let styleTextCity;
				let styleTextDay;
				let styleTextTime;
				let styleBackGroundView;
				let styleTextHours;
				let styleTextClass;
				let styleTextStudentsCount; 
                 
				if(item.class_time === "Evening"){
					
					 icon = require("./../../assets/images/grupo-49.png");
					 background =  require("./../../assets/images/trazado-64.png");
					 styleTextCity = styles.txtCityTwoText;
					 styleTextDay = styles.txtDayTwoText; 
					 styleBackGroundView = styles.viewCardShiftEveningView
					 styleTextTime = styles.txtTimeBText;
					 styleTextClass = styles.txtClassBText;
					 styleTextStudentsCount = styles.txtStudentsBText;
					 styleTextHours = styles.txtHoursBText;

				}
				if(item.class_time === "Day"){ 
					
					 icon = require("./../../assets/images/grupo-46.png");
					 background = require("./../../assets/images/trazado-103.png");
					 styleTextCity = styles.txtCityText;
					 styleTextDay = styles.txtDayText;
					 styleBackGroundView = styles.viewCardShiftDayView
					 styleTextTime = styles.txtTimeWText;
					 styleTextClass = styles.txtClassWText; 
					 styleTextStudentsCount = styles.txtStudentsWText;
					 styleTextHours = styles.txtHoursWText;
				}
				if(item.class_time === "Weekend"){
					icon = require("./../../assets/images/trazado-107.png");
					background =  require("./../../assets/images/trazado-103.png");
					styleTextCity = styles.txtCityText;
					styleBackGroundView = styles.viewCardShiftDayView
					styleTextDay = styles.txtDayText;
					styleTextClass = styles.txtClassWText;  
					styleTextStudentsCount = styles.txtStudentsWText;
					styleTextTime = styles.txtTimeWText;
					styleTextHours = styles.txtHoursWText;
			   }
			   if(item.class_time !== "Evening" &&  item.class_time !== "Day" &&
			   item.class_time !== "Weekend" ){
				    icon = require("./../../assets/images/trazado-107-T.png");
					background = require("./../../assets/images/trazado-103.png");
					styleTextCity = styles.txtCityText;
					styleBackGroundView = styles.viewCardShiftDayView
					styleTextDay = styles.txtDayText;
					styleTextTime = styles.txtTimeWText;
					styleTextClass = styles.txtClassWText; 
					styleTextStudentsCount = styles.txtStudentsWText;
					styleTextHours = styles.txtHoursWText;
		       }
				return(  
				<TouchableOpacity  key={item.id} 
					   onPress={() => {
						this.props.nav.onBtn1PressedCheckClock(item);
					}}> 
				    <View   
					        key={item.id}   
								style={styleBackGroundView}>
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
	
								</View>
								
								<View
									pointerEvents="box-none"
									style={{
										position: "absolute",
										left: 0,
										right: 0,
										top: 0,
										height: 285,
										alignItems: "flex-start",
									}}>
									<View 
										style={styles.viewHeaderRedView}>
										<Text
											style={styleTextCity}>{item.city}</Text>
										<Text
											style={styles.txtProgramNameText}>{item.class_type}</Text>
									</View>
									<View
										style={styles.viewTimeView}>
										<Image
											source={icon}
											style={styles.imgIconTimeWImage}/>
										<View
											style={{
												flex: 1,
											}}/>
										<Text
											style={styleTextTime}>{item.class_time}</Text>
									</View>
									<Text
										style={styleTextClass}>Class #{item.class_number}</Text>
									<Text
										style={styleTextHours}>{item.class_hours}</Text>
									<Text
										style={styleTextStudentsCount} >{item.students_count} Students</Text>
								</View>
							</View>
			     </TouchableOpacity> 
						
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
	viewScrollView:{
		//marginTop: 12,
		//marginBottom:250,
		height : 740,
	},
	txtClockOutText: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		marginLeft: 23,
	},
	txtClockInText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		marginLeft: 21,
	},
	imgArrowShowImage: {
		resizeMode: "contain",
		backgroundColor: "transparent",
		marginTop:20,
		width: 26,
		height: 26,
		marginRight : 20,
		transform: [{ rotate: '180deg' }],
	},
	imgClockInImage: {
		backgroundColor: "transparent",
		resizeMode: "contain",
		width: 26,
		height: 26,
		marginRight: 19,
	},
	imgArrowBackImage: {
		resizeMode: "contain",
		backgroundColor: "transparent",
		marginTop:23,
		width: 26,
		height: 26,
		marginLeft : 15,
	},
	imgIncidentImage: {
		resizeMode: "contain",
		backgroundColor: "transparent",
		marginTop:23,
		width: 26,
		height: 26,
		marginRight : 15,
	},
	viewBandViewR: {
		backgroundColor: "transparent",
		left: 0,
		right: 0,
		top: -3,
		width: 750,
		//height: 66,
		flexDirection: "row",
		alignItems: "flex-start",
		opacity: 1,
		flex: 1,
		position: "absolute",
		//marginBottom: 15,
		justifyContent: 'space-between',
	},
	imgBkgWhiteImage2: {
		resizeMode: "cover",
		backgroundColor: "transparent",
		shadowColor: "rgba(0, 0, 10, 8)",
		shadowRadius: 6,
		shadowOpacity: 0.7,
		width: 749,
		height: 59,
		opacity: 1,
		borderTopRightRadius: 25, 
		borderBottomRightRadius: 25,

	},	
	conteiner:{
		marginLeft: -690,
		width: 750,
		shadowColor: "rgba(0, 0, 10, 8)",
		shadowRadius: 8,
		shadowOpacity: 0.7,
	},
	animatedContainer:{
		marginTop: 0,
		height: 25,
		width: 635,
	},
	viewBandViewContainerReport: {
		backgroundColor: "transparent",
		left: 0,
		right: 0,
		top: 69,
		height: 60,
		alignItems: "flex-start",
		opacity: 1,
		position: "absolute",
	},
	container: {
		flex: 1,
		justifyContent: "center",
		
	  },
	viewView: {
		backgroundColor: "rgb(239, 239, 244)",
		flex: 1,
	},
	viewHeaderView: {
		backgroundColor: "transparent",
		height: 61,
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
	btnUserButtonText: {
		color: "black",
		fontFamily: ".AppleSystemUIFont",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
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
	imgIconHeaderButtonImage: {
		resizeMode: "contain",
	},
	imgIconHeaderButtonText: {
		color: "black",
		fontFamily: ".AppleSystemUIFont",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
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
		resizeMode: "center",
		backgroundColor: "transparent",
		width: 18,
		height: 26,
		marginTop: 9,
	},
	txtTodayCursesText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 40,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
		marginLeft: 9,
		marginRight: 14,
		marginTop: 29,
	},
	txtDateCourseText: {
		color: "rgb(112, 112, 112)",
		fontFamily: "Montserrat-Bold",
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
		backgroundColor: "transparent",
		marginLeft: 9,
		marginRight: 14,
		marginTop: 10,
	},
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
	viewCardShiftDayView: {
		backgroundColor: "#fff",
		shadowColor: "rgba(0, 0, 0, 0.15)",
		shadowRadius: 5,
		shadowOpacity: 1,
		height: 317,
		marginLeft: 137,
		marginRight: 157,
		marginTop: 24,
		borderRadius:20,
		borderWidth: 1,
		borderColor: '#fff'
	},
	viewCardShiftEveningView: {
		backgroundColor: "#3A3A3A",
		shadowColor: "rgba(0, 0, 0, 0.15)",
		shadowRadius: 5,
		shadowOpacity: 1,
		height: 317,
		marginLeft: 137,
		marginRight: 157,
		marginTop: 24,
		borderRadius:20,
		borderWidth: 1,
		borderColor: '#fff'
	},
	btn1Button: {
		backgroundColor: "transparent",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		position: "absolute",
		left: 14,
		right: 5,
		top: 14,
		height: 296,
	},
	btn1ButtonText: {
		color: "black",
		fontFamily: ".AppleSystemUIFont",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
	},
	btn1ButtonImage: {
		resizeMode: "contain",
	},
	imgBkgWhiteImage: {
		resizeMode: "cover",
		backgroundColor: "transparent",
		shadowColor: "rgba(0, 0, 0, 0.52)",
		shadowRadius: 10,
		shadowOpacity: 1,
		width: null,
		height: 316,
	},
	viewHeaderRedView: {
		backgroundColor: "rgb(139, 25, 54)",
		alignSelf: "stretch",
		height: 80,
		alignItems: "flex-start",
	},
	txtCityText: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 405,
		marginLeft: 18,
		marginTop: 3,
	},
	txtProgramNameText: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 405,
		marginLeft: 18,
		marginTop: 4,
	},
	viewTimeView: {
		backgroundColor: "transparent",
		width: 308,
		height: 29,
		marginLeft: 18,
		marginTop: 19,
		flexDirection: "row",
		alignItems: "center",
	},
	imgIconTimeWImage: {
		resizeMode: "contain",
		backgroundColor: "transparent",
		width: 23,
		height: 23,
	},
	txtTimeWText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 268,
		marginRight: 5,
	},
	txtClassWText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		width: 368,
		marginLeft: 18,
		marginTop: 9,
	},
	txtHoursWText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 368,
		marginLeft: 18,
		marginTop: 9,
	},
	txtStudentsWText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 368,
		marginLeft: 18,
		marginTop: 62,
	},
	viewCardShiftEveView: {
		backgroundColor: "rgba(0, 0, 0, 0.16)",
		shadowColor: "rgba(0, 0, 0, 0.15)",
		shadowRadius: 10,
		shadowOpacity: 1,
		height: 316,
		marginLeft: 137,
		marginRight: 157,
		marginTop: 31,
	},
	viewCardShiftView: {
		backgroundColor: "transparent",
		height: 316,
		marginLeft: 137,
		marginRight: 157,
		marginTop: 31,
	},
	btn2Button: {
		backgroundColor: "transparent",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		position: "absolute",
		left: 7,
		right: 13,
		top: 10,
		height: 296,
	},
	btn2ButtonImage: {
		resizeMode: "contain",
	},
	btn2ButtonText: {
		color: "black",
		fontFamily: ".AppleSystemUIFont",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
	},
	imgBkgBlackImage: {
		backgroundColor: "transparent",
		shadowColor: "rgba(0, 0, 0, 0.53)",
		shadowRadius: 10,
		shadowOpacity: 1,
		resizeMode: "cover",
		width: null,
		height: 316,
	},
	viewHeaderRedTwoView: {
		backgroundColor: "rgb(139, 25, 54)",
		alignSelf: "stretch",
		height: 80,
		alignItems: "flex-start",
	},
	txtCityTwoText: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 405,
		marginLeft: 18,
		marginTop: 5,
	},
	txtProgramNameTwoText: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 405,
		marginLeft: 18,
		marginTop: 4,
	},
	viewCardShiftEveTwoView: {
		backgroundColor: "transparent",
		width: 435,
		height: 29,
		marginLeft: 21,
		marginTop: 22,
		flexDirection: "row",
		alignItems: "center",
	},

	imgIconTimeBImage: {
		backgroundColor: "transparent",
		resizeMode: "center",
		width: 27,
		height: 25,
	},
	txtTimeBText: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 396,
		left : 6,
		marginRight: 4,
	},
	txtClassBText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 436,
		marginLeft: 21,
		marginTop: 10,
	},
	txtHoursBText: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 436,
		marginLeft: 21,
		marginTop: 9,
	},
	txtStudentsBText: {
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 436,
		marginLeft: 21,
		marginTop: 62,
	},
	viewFooterMenuView: {
		backgroundColor: "transparent",
		shadowColor: "rgba(0, 0, 0, 0.15)",
		shadowRadius: 4,
		shadowOpacity: 1,
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
	txtDayButtonImage: {
		resizeMode: "contain",
		marginRight: 10,
	},
	txtDayButtonText: {
		color: "rgb(139, 25, 54)",
		fontFamily: "Montserrat-Bold",
		fontSize: 30,
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
		marginTop: 1,
	},
	txtMonthButtonImage: {
		resizeMode: "contain",
		marginRight: 10,
	},
	txtMonthButtonText: {
		color: "rgb(22, 22, 22)",
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
		color: "rgb(39, 39, 39)",
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
})
