//
//  Classroom
//  Ipad Trainer Portal-r3b
//
//  Created by [Author].
//  Copyright © 2018 [Company]. All rights reserved. 
//

import React , {useEffect} from "react"
import { Image, Linking,StyleSheet, Text, TextInput, TouchableOpacity, View,ScrollView,TouchableWithoutFeedback, Keyboard ,Dimensions
	,Animated,TouchableHighlight,Alert,ActivityIndicator,Switch,CheckBox,
 } from "react-native"

import Moment from 'moment'; 
import Modal1, { SlideAnimation, ModalContent, ScaleAnimation } from 'react-native-modals';	
import SwitchSelector from 'react-native-switch-selector';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { getDistance, getPreciseDistance } from 'geolib';
import FlashMessage from "react-native-flash-message";
import Toast from 'react-native-tiny-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import SubmitErrorButton from "../SubmitError/SubmitErrorButton";

import connDBHelper from "../Helper/Dao";
import connectionHelper from "../Helper/Connection"; 

import ShiftHeader from "../Headers/ShiftHeader"
import ErrorHandler    from "../Helper/ErrorHandler"
import Session from "../Helper/Sessions"
import AppStates from "../Helper/AppStates"
import StillConnection from "../Helper/StillConnection"
//import BackgroundTask from "../Helper/BackgroundTask"
import BackgrounFetchTask from "../Helper/BackgrounFetchTask"


import "./../../global.js";


var imgIcon;
var imgIconLink = '';
export default class Classroom extends React.Component {

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
		this.state={
		  animation : new Animated.Value(0),
		  moveAnimation: new Animated.Value(0),
		  moveAnimationR: new Animated.Value(0),
		  modalVisible: false,
		  visible_mod: false,
		  visible_mod_notLocation: false,
		  data : null ,
		  course_date_id :0,
		  instructor_id : 0, 
		  _course : this.props.navigation.state.params.parameters,
		  location:null,
		  geocode:null,
		  errorMessage:"",
		  locationCityLongitude : null,
		  locationCityLatitude : null, 
		  distanceOut : 0,
		  _rowResult : null ,
		  _arrayAttandance : [],
		  _arrayMakeupAttandance : [],
		  _arrayReturningAttandance : [],		  
		  attenLocal  : false,
		  attenRedy : false,
		  headerData : null,
		  notes : [],
		  currentNote: "",  
		  arrAtt : null,
		  renderNotes : null,
		  _waiting: true,
		  _waitingclock: false,
		  _waitingreport: false,
		  location_permissions_visible_mod:false,
		  permissionsLocationsOk : "",
		  backgroundColorBtnClockIn :"rgb(0,154,218)",
		  localClockIn: [],
		  clock : 0,
		  bottonPanel:false,
		  showBtnBack : false,
		  showBtnBackLook: false,
		  students: [],
		  clockType : "clockin",
		  stylePaddingLeftExtraRep:{flex: 0.2 },
		  shift_hours : 0,
		  pe_result_selected : "",
		  visible_mod_ex_result : false,
		  lastItem : null,
		  ratingNote:"",
		  showNotInClassroomTitles :true,

		} 

	}

	_getDistance = () => {
		
		var dis = getDistance(
		  
		  { latitude: (this.state.location ? this.state.location.latitude :0), longitude: (this.state.location ? this.state.location.longitude :0) } , 
		  { latitude: this.state.locationCityLatitude, longitude: this.state.locationCityLongitude }, 
		  0.1
		);

	  };
	
	  _getPreciseDistance = async () => { 
	    await this.getLocationAsync();  
		console.log("this.state.locationCityLatitude:" ,this.state.locationCityLatitude);
		console.log("this.state.locationCityLongitude:",this.state.locationCityLongitude);
		console.log("this.state.location:",this.state.location);


        console.log(",,,,,,")
		console.log("global.location_now:",global.location_now)

		if(this.state.locationCityLatitude == null || this.state.locationCityLongitude == null )
		  return 2;
		  
		var pdis = await getPreciseDistance(
		  { latitude: this.state.locationCityLatitude, longitude: this.state.locationCityLongitude },
		  {latitude:  global.location_now.latitude , longitude:  global.location_now.longitude } , 
		);	
		console.log("pdis:",pdis);
		this.setState({distanceOut:pdis});
	
		//alert(`Precise Distance\n${pdis} Meter\nor\n${pdis / 1000} KM`);
		return pdis;
	  };
    
	  _getCurrentPreciseDistance = async () => { 
	   
		console.log("locationCityLatitude::", this.state.locationCityLatitude);
		console.log("locationCityLongitude::", this.state.locationCityLongitude);


        console.log(",,,,,,")
		console.log(global.location_now)

		var pdis = await getPreciseDistance(
		  { latitude: this.state.locationCityLatitude, longitude: this.state.locationCityLongitude },
		  {latitude:  global.location_now.latitude , longitude:  global.location_now.longitude } , 
		);	
		this.setState({distanceOut:pdis});
	
		//alert(`Precise Distance\n${pdis} Meter\nor\n${pdis / 1000} KM`);
		return pdis;
	  };

	  onBtnBackPressed = () => {

		this._setOut()
		this._setOutR()
		this.props.navigation.goBack()
		
	}

	getLocationAsync = async () => {
	 let { status } = await Location.requestForegroundPermissionsAsync() ;// Permissions.askAsync(Permissions.LOCATION);
	 this.setState({ permissionsLocationsOk: status });
	 console.log("permissions status:", status);
     
	 if (status !== 'granted') {

		  console.log("Location errorMessage:" ,'Permission to access location was denied');	
		  this.setState({ location_permissions_visible_mod: true }); 
		  this.setState({
			errorMessage: 'Permission to access location was denied',
		  });
	  }
    let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Highest});
    const { latitude , longitude } = location.coords
    this.getGeocodeAsync({latitude, longitude})
    this.setState({ location: {latitude, longitude}});

	};
	getGeocodeAsync= async (location) => {
		let geocode = await Location.reverseGeocodeAsync(location)
		this.setState({ geocode})
	  }
	startAnimation=()=>{
		Animated.timing(this.state.animation,{ 
		  toValue : 690,
		  duration : 2000,
		  useNativeDriver: true,
		}).start(()=>{
		  this.state.animation.setValue(0); 
		});
	}

	_move = () => {
		console.log("Pressed!");
		if(this._move){
			Animated.timing(this.state.moveAnimation, {
				toValue: 690,
				timing: 1000,
				useNativeDriver: true,
			}).start()
		}else{
			Animated.timing(this.state.moveAnimation, {
				toValue: 0,
				timing: 1000,
				useNativeDriver: true,
			}).start()
		}
		this._move =! this._move
	}

	_setIni = () => {
		
		Animated.timing(this.state.moveAnimation, {
			toValue: 0,
			timing: 1000,
			useNativeDriver: true,

		}).start();
		this._move =! this._move ;
		this.setState({showBtnBack: this._move})

		this.setState({_waitingclock : false})

		
	}

	onClockInButtonPressedR = () => {

        Session.checkSessionAlive(this.props.navigation);
		if(this._moveR){ // if Button Menu is  hidden
			
			this.setState({stylePaddingLeftExtraRep:{flex: 9 }})
			this.onClockAllButtonPressedR()
			this.setState({_waitingreport : true})
			return;
		 } 

	  this.setState({stylePaddingLeftExtraRep:{flex: 0.2 }})
	  
	
		 this._setIniR();
		 const { navigate } = this.props.navigation
		 if( global.clock ===0  ){
			 Alert.alert(
				 'Attention !',
				 'You must Clock In before you can send Incident Report.',
				 [
				 {text: 'OK', onPress: () => {
					this.setState({_waitingreport : false})
 
					  }
				 },
				 ],
				 {cancelable: false},
				);
				
			console.log('You must Clock In before you can send Incident Report')
			
			return;
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
		this.setState({_waitingreport : false})
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
			this.setState({stylePaddingLeftExtraRep:{flex: 0.2 }})
		}else{
			this.setState({stylePaddingLeftExtraRep:{flex: 9}})
		}
		
		
		this._setIniR();
	}	



	useEffect = () => {
		if (Platform.OS === 'android' && !Constants.isDevice) {
		  setErrorMsg(
			'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
		  );
		} else {
			
		  (async () => {
/*
			let { status } = await Camera.requestCameraPermissionsAsync();
			console.log('#### requestCameraPermissionsAsync ::' + status);
			if (status !== 'granted') {
			  setErrorMsg('Permission to access location was denied');
			  console.log('#### Permission to access location was denied');
			}
			*/
	
			let location = await Location.getCurrentPositionAsync({});
			setLocation(location);
		  })();
		}
		if (this.state.errorMsg) {
			this.setState({ messages: this.state.errorMsg });
		  } else if (this.state.location) {
			this.setState({ messages: JSON.stringify(this.state.location) });
			
		  }
	  }
	  
	updateClassLocation(){			
		let assignment_id = 0;
		let _url = "";
		
        let	objectUpdateClassLocation = {latitude:( this.state.location ? String( this.state.location.latitude ):String(global.location_now.latitude))
			                 ,longitude:( this.state.location?  String( this.state.location.longitude):String(global.location_now.longitude)) } ;

		 _url = global.host + '/api/instructor/'+this.state.instructor_id+'/class_coordinates/'+this.state.data.course.city_id;
	    var _body = JSON.stringify(
				objectUpdateClassLocation
			);

		
	 // Dont Ask 
      /* 
		Alert.alert(
			'Update class location',
			'Turning on location service allows us to register your shift.',
			[
			  {text: 'OK', onPress: () => {
            
				// If press OK Button
             */

				this.setState({_waiting : true})
				fetch( _url , { 
					method: 'POST', 
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json', 
						"cache-control": "no-cache",
						'Authorization' : global.token_type +  " " + global.access_token
					},
					body: _body
					}).then((response) =>  response.text()) 
						.then((responseData) =>
							{
							this.setState({_waiting : false})
							this.setState({showBtnBack : true})
							global.logs = ErrorHandler.setMessageResponse( "",_body,responseData,"response","",_url,global.id,global.name ,global.email);
			      console.log("_body:" ,_body);
			      console.log("_body:" ,_body);
					
							   try {
							
								let responseTXT = responseData;
								let responseJSON = JSON.parse (responseTXT); 
								if(responseJSON['success'] !== undefined) {
									if(responseJSON['success'] ){   
										this.setState({locationCityLatitude:  this.state.location ? String( this.state.location.latitude ):String(global.location_now.latitude) , 
													   locationCityLongitude: this.state.longitude ? String( this.state.location.longitude ):String(global.location_now.longitude) })
                                         
									/*    Silence when send location				   
										Alert.alert(
											'Success !',
											'The classroom location was updated.',
											[
											{text: 'OK', onPress: () => {
												console.log('OK Pressed');
												this.setState( {showNotInClassroomTitles:false});
												//this._getPreciseDistance()
												this._getCurrentPreciseDistance();
			
											}},
											],
											{cancelable: false},
										);
										*/
									}
								} else{
									console.log("ERROR");
									console.log()
									global.logs = ErrorHandler.setMessageResponseAdd( global.logs,"","","error","",_url,global.id,global.name ,global.email);
		
									if (responseJSON['message'] == "Unauthenticated."){
									Alert.alert(
										'Attention !',
										'Your session expired. Please login again.',
										[
										{text: 'OK', onPress: () => console.log('OK Pressed')},
										],
										{cancelable: false},
									);
									
								
									}else{
										
									}
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
		
							} catch (e) {
								console.log(e);
								this.setState({
									authenticated :0
								});
								global.logs = ErrorHandler.setMessageResponseAdd( global.logs,"","","error",e.toString(),_url,global.id,global.name ,global.email);
		
								Alert.alert("Error:", "Problems connecting to the Server. Please try again later.");
		
							}
		
							this.setState({
								authenticated :0
							});
						});	

       // Dont Ask
        /*
			  }},
			  {text: 'Not Now', onPress: () => {  console.log('Cancel Pressed'); return;}},
			],
			{cancelable: false},
		  );
        */
		
    }
	  
	getIniData =  () => {
		let course_date_id;
		 
		this.setState({ visible_mod: false });
		this.setState({ visible_mod_notLocation: false });
		this.getLocationAsync();
		
		if( global.connection !== 1) { // NotConnect
			//connDBHelper.getShift(global.user_id,Date.now(),this);
			//console.log(this.props.navigation.state.params.next_shift.shifts.shift.course_date_id); return;
			//console.log(this.props.navigation.state.params.next_shift.shifts['course'].id); return;
			if(this.props.navigation.state.params.next_shift !== null && this.props.navigation.state.params.next_shift !== undefined){
				this.classroomHandle(this.props.navigation.state.params.next_shift.shifts,1,this.props.navigation.state.params.next_shift.shifts.shift.course_date_id);
		    } 
			
			return;
		}


		if(this.props.navigation.state.params.parameters && this.props.navigation.state.params.parameters.course_date_id !== null ){ 
			
			course_date_id = this.props.navigation.state.params.parameters.course_date_id; 
			
			//connDBHelper.getLocalClockIn(this.state._course.id,global.user_id,this);

			/// Ojo this.getLocalAtendance(global.user_id , course_date_id );
console.log("course_date_id",course_date_id)	
            var _url = global.host + '/api/auth/course_date/'+course_date_id ;		
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
						
						   let responseTXT = responseData;
						   let responseJSON = JSON.parse (responseTXT); 

						 if(responseJSON['success'] !== undefined) {
							  this.classroomHandle(responseJSON,0,course_date_id);
							 //connDBHelper.getLocalClockInIni(course_date_id,global.user_id,this);

							 this.setColorClockIn();

						   } else{
							   console.log("ERROR");
							   if (responseJSON['message'] == "Unauthenticated."){
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


						   this.setState({ 
						   }); 

						  // this._getPreciseDistance();

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
					  	   global.logs = ErrorHandler.setMessageResponseAdd( global.logs,"","","error",e.toString(),_url,global.id,global.name ,global.email);

						   Alert.alert("Error:", "Problems connecting to the Server. Please try again later.");
	
					   }
	 
					  //console.log(error);	 
					  //console.error(error);
					  this.setState({
						 authenticated :0
					   });
					});
		}

	  }
	  setStSchedulTime(){
		let start_time  =global.start_time;
        let end_time = global.end_time;
        let diff = Moment.duration(Moment(end_time).diff(Moment(start_time)));
		let days = parseInt(diff.asDays()); //84
        let hours = parseInt(diff.asHours()); //2039 hours, but it gives total hours in given miliseconds which is not expacted.
        hours = hours - days*24;  // 23 hours
        let minutes = parseInt(diff.asMinutes()); //122360 minutes,but it gives total minutes in given miliseconds which is not expacted.
        minutes = minutes - (days*24*60 + hours*60); //20 minutes.
		this.setState({shift_hours:hours})
		//if(hours >= 6)  this.setState({_breaks:1})
		if(hours <6)  this.setState({_breaks:1})
        console.log("day",days, "hours",hours,"minutes",minutes)
	}

    classroomHandle(responseJSON,local,course_date_id) {
		
		let students_arr = [];
		let arrStudentAttendance =[];
		let arrMackUpStudentAttendance =[];
		let arrReturningStudentAttendance =[];
		let register = [];
		let indexStudent = 0;
		let makeup_students_arr = [];
		let returning_students_arr = [];
		let dropout_students_arr = [];
		let course = {};
		let clocked_in = null;
		let courseObj = {};
		let data_obj = {}; 

		

		console.log("in Classroom");

						if(responseJSON['success'] === true){   
								courseObj = responseJSON['course'];	 
								global.city_id = responseJSON['course']["city_id"] ; 
								course = {"id": responseJSON['course'].id,"time_id": responseJSON['course'].time_id,"start_date": responseJSON['course'].start_date,"end_date": responseJSON['course'].end_date,
								"cost": responseJSON['course'].cost,"status": responseJSON['course'].status,"hours_start": responseJSON['course'].hours_start,"hours_end": responseJSON['course'].hours_end,
								"longitude" : Number(responseJSON['shift'].longitude) ,  "latitude": Number(responseJSON['shift'].latitude) }


								global.inventory_check = responseJSON['shift'].inventory_check ;
								global.shift_id = responseJSON['shift'].id ;
		  
						
        console.log("Classroom :: responseJSON['shift'].inventory_check :" ,responseJSON['shift'].inventory_check)


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
								console.log("clocked_in")
								console.log(clocked_in)
								console.log(global.clockTime)
								
								

								this.setState({notes:responseJSON['notes']}); 
								responseJSON['students'].map((student) => {
								
									console.log(student.enrollment_id)
									    if(student.practical_exam == undefined )	
									        student["practical_exam"]	 = null;
										students_arr.push({ "id":student.id ,"student_id":student.enrollment_id, "course": student.course_id, "student":student,"instructor_notes":student.instructor_notes ,"practical_exam_switch":(student.practical_exam === null?false:true),"practical_exam":(student.practical_exam === null?0:student.practical_exam.id) ,  "practical_exam_result":(student.practical_exam === null?null:student.practical_exam.rating), "practical_exam_notes":(student.practical_exam === null?"":student.practical_exam.notes)  , "attended_l" : student.attended  });
										arrStudentAttendance.push( { "id":indexStudent, "attended" : (student.attended ? 1: 0 ), "attended_l" : student.attended ,"student_id" : student.enrollment_id });
										indexStudent ++;
								})
		
								responseJSON['makeup_students'].map((makeup_student) => {

			                      if(makeup_student.practical_exam == undefined )	
			                             makeup_student["practical_exam"]	 = null;		 		
									makeup_students_arr.push({ "id":makeup_student.id ,"student_id":makeup_student.make_up_enrollment_id, "course": makeup_student.course_id, "makeup_student":makeup_student,"practical_exam_switch":(makeup_student.practical_exam === null ?false:true) ,"practical_exam":(makeup_student.practical_exam === null ?0:makeup_student.practical_exam.id) , "practical_exam_result":(makeup_student.practical_exam === null?null:makeup_student.practical_exam.rating),"instructor_notes":makeup_student.instructor_notes, "practical_exam_notes":(makeup_student.practical_exam === null?"":makeup_student.practical_exam.notes) });
									arrMackUpStudentAttendance.push( { "id":indexStudent, "attended" : (makeup_student.attended ? 1: 0 ), "attended_l" : makeup_student.attended , "student_id" : makeup_student.make_up_enrollment_id});
									indexStudent ++;
								})								  
			

								responseJSON['returning_students'].map((returning_student) => {


									returning_students_arr.push({ "id":returning_student.id ,"student_id":returning_student.enrollment_id, "course": returning_student.course_id, "returning_student":returning_student,"instructor_notes":returning_student.instructor_notes });
									arrReturningStudentAttendance.push( { "id":indexStudent, "attended" : (returning_student.attended ? 1: 0 ), "attended_l" : returning_student.attended , "student_id" : returning_student.enrollment_id});
									indexStudent ++;
								}) 
								
								
								responseJSON['dropout_students'].map((dropout_student) => {

									dropout_students_arr.push({ "id":dropout_student.id ,"student_id":dropout_student.student_id,"course": dropout_student.course_id,"balance": dropout_student.balance,"name": dropout_student.name,"last_name": dropout_student.last_name,"phone":( dropout_student.phone == undefined ? "" : dropout_student.phone ),"email":( dropout_student.mail == undefined ? "" : dropout_student.mail ),"dropout_date":dropout_student.dropout_date  } );
								
								})
								register = {id:0,object: JSON.stringify(arrStudentAttendance) , course_date_id:course_date_id,estatus:0 ,user_id :responseJSON['shift'].user_id , timestamp :null };


								// _arrayAttandance se llena en un inicio de la DB
								if( this.state._arrayAttandance.length !== 0 && this.state._arrayAttandance !== 'false' ) 
										arrStudentAttendance = this.state._arrayAttandance; 
								else
									this.setState({_arrayAttandance : arrStudentAttendance});	 
								
								if( this.state._arrayMakeupAttandance.length !== 0 && this.state._arrayMakeupAttandance !== 'false' ) 
								arrMackUpStudentAttendance = this.state._arrayMakeupAttandance; 
								else
								this.setState({_arrayMakeupAttandance : arrMackUpStudentAttendance});	 

								if( this.state._arrayReturningAttandance.length !== 0 && this.state._arrayReturningAttandance !== 'false' ) 
								arrReturningStudentAttendance = this.state._arrayReturningAttandance; 
									else
									this.setState({_arrayReturningAttandance : arrReturningStudentAttendance});


								data_obj = {"shift_id":responseJSON['shift'].id,"shift":responseJSON['shift'], "course_date_id":course_date_id,"course_id":responseJSON['course'].id, "course":courseObj,"students":students_arr , "makeup_students":makeup_students_arr , "returning_students":returning_students_arr ,"dropout_students":dropout_students_arr, "can_clock_in":responseJSON['can_clock_in'], "attendance":arrStudentAttendance, "makeUpAttendance":arrMackUpStudentAttendance, "returningAttendance":arrReturningStudentAttendance,"clocked_in":clocked_in}; 

								global.start_time = responseJSON['shift'].start_time;
								global.end_time = responseJSON['shift'].end_time;

								this.setState({ locationCityLongitude : Number(responseJSON['shift'].longitude)}); 
								this.setState({locationCityLatitude :  Number(responseJSON['shift'].latitude) });  
								
								
								//global.instructor_id = responseJSON['shift'].instructor_id;
								this.setState({_waiting : false})
								this.setState({showBtnBack : true})

								this.setStSchedulTime();
								if( global.connection !== 1) {

									 connDBHelper.getDBAtendance(global.instructor_id,course_date_id,this).then((_array) => {
											let attendanceDB;
											let arrDBAttendance = [];
											let objAttendance = {};
											let enrollment_ids = {}; 
											let notes = "";
											if(_array.length >0){
												attendanceDB = _array[0]; 
												//console.log(_array.length);return;
												objAttendance = JSON.parse(	attendanceDB["object"]);				
												enrollment_ids = objAttendance.enrollment_ids;
												Object.assign( enrollment_ids , objAttendance.makeup_enrollment_ids,objAttendance.returningAttendance );
												notes = objAttendance.notes;
											}

											this.updateDBAttendance(data_obj,enrollment_ids)
										  }) ;
								}	else {
									this.setState({
										data :data_obj ,
								   }); 
								}
								this.setState({bottonPanel:true});

						}

						this.setState({

							course_date_id : course_date_id ,
							instructor_id :  global.instructor_id
					   }); 	

	}
	
	 updatePracticalExam = (item) => { 
	
		let exam_value = 0;
		let exam_method = "";
		let objectAtt;
		let response = false;
		let objectUpdatePracticalExam ;


		if(item.practical_exam !== null || item.practical_exam !== 0) {  //Update Exam
		
			exam_value = ( item.student == undefined ? item.makeup_student.latest_enrollment.id :item.student.enrollment_id  );
			
			exam_method = "POST";
			response = true;
			console.log("item.practical_exam_result:",this.state.pe_result_selected);
			console.log("item.practical_exam_notes:",this.state.ratingNote);

			objectUpdatePracticalExam = {rating:this.state.pe_result_selected,notes:this.state.ratingNote,city_id:global.city_id  };
		}

		
		//this.setState({_waiting : true})
		var _url = global.host + '/api/auth/'+ String(exam_value)  +'/practical_exam';
		var _body = JSON.stringify(
				objectUpdatePracticalExam
			);
		fetch(_url, { 
			method: exam_method, 
			headers: {
			   'Accept': 'application/json',
			   'Content-Type': 'application/json', 
			   "cache-control": "no-cache",
			   'Authorization' : global.token_type +  " " + global.access_token
			},
			body: _body
		}).then((response) =>  response.text()) 
			.then((responseData) =>
			{
				  	global.logs = ErrorHandler.setMessageResponse( "",_body,responseData,"response","",_url,global.id,global.name ,global.email);

					try {
						this.setState({_waiting : false})
						let responseTXT = responseData;
						let responseJSON = JSON.parse (responseTXT); 


						if(responseJSON['success'] !== undefined) {
								if(responseJSON['success'] === true){   
									this.setState({pe_result_selected:""})
									this.setState({ratingNote:""})
									if(exam_method == "POST"){

										item.practical_exam  = responseJSON["exam_id"];
										item.practical_exam_result = responseJSON["rating"];
										item.practical_exam_notes = responseJSON["notes"];
									}
									this.forceUpdate();  // *********
									//console.log("llegando de API")
									
									//return response;
									// Cambiar elemento 

									//this.UpdateNotes()
									
								}
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

								this.props.nav.onLoginfailure(); // 
						}

					} catch (e) {
						console.log(e);
					  	global.logs = ErrorHandler.setMessageResponseAdd( global.logs,_body,"","error",e.toString(),_url,global.id,global.name ,global.email);
						Alert.alert("Error:", "Problems connecting to the Server. Please try again later.");

					}
	 
			});
			
			return item;
	}


	uppdatearrAttendance(attendance,dbAttendance){
		let arrResult = [];
		let attendValue = 0;

		attendance.map((itemAtt,j)=>{
			attendValue = 0;
			var fetchArr = Object.values(dbAttendance);

			fetchArr.map((itemDBAtt,i)=>{
				
				if(itemAtt.student_id  ===  itemDBAtt )
				{

					attendValue = 1;
				}
			})
			arrResult.push( { "attended":attendValue, "id" :itemAtt.id, "student_id":itemAtt.student_id});
		})

		return arrResult;
	}

	updateDBAttendance(classroomObject,dbAttendance) { 
		let attendance = classroomObject.attendance;
		let makeUpAttendance = classroomObject.makeUpAttendance;
		let returningAttendance = classroomObject.returningAttendance;

		classroomObject.attendance = this.uppdatearrAttendance(attendance,dbAttendance);
		classroomObject.makeUpAttendance = this.uppdatearrAttendance(makeUpAttendance,dbAttendance);
		classroomObject.returningAttendance = this.uppdatearrAttendance(returningAttendance,dbAttendance);
		this.setState({data:classroomObject});
	}
	setColorClockIn() { 
		
		if(global.clock == 0) {
			this.setState({clock:0});
			this.setState({ backgroundColorBtnClockIn :"rgb(148, 233, 56)" }) // Blue rgb(0,154,218)
		}else{
			this.setState({clock:1});
			this.setState({ backgroundColorBtnClockIn :"rgb(148, 233, 56)" }) // Green rgb(148, 233, 56)
		}
		
			console.log("setColorClockIn()");
			console.log(global.clock);
	}

	componentWillUnmount(){
		this.setState({bottonPanel:false});
	}
	componentDidMount() { 

		if( global.connection !== 1) {
			Toast.show(msgNoConnection,{
				position: Toast.position.center,
				containerStyle:{
					backgroundColor: 'red'
				},
				duration	: 3000	,
				delay : 500,
				textStyle:{
					color:'#fff',
				   },
				imgSource: null,
				imgStyle: {},
				mask: true, 
				maskStyle:{}
			  })
		}
		this.getIniData();
		this.getLocationAsync();
		this.setColorClockIn();
		//if(global.clock == 0) {
		console.log("******",global.clock)
		 if(global.clock == 0){
			Animated.timing(this.state.moveAnimation, {
				toValue: 690,
				timing: 1000,
				useNativeDriver: true,
			}).start();

			this.onEnterMenu();
			if(global.shifttype == "info") {
				this.onBackBttnBack() // :: IVR
				this._setIni();
				
			}
		 }else{
			this.onBackBttnBack();
		 }

			
			
			//this._move =true;
			//this.setState({showBtnBack: false})

	//	this._move =false;
	//	this.setState({showBtnBack: false})

    //    this.setState({showBtnBack: false})
	//	this.setState({_waitingclock : true})

		//this.onClockAllButtonPressed()
	//	this._move()
	//	this.setState({showBtnBack: false})
		//this._setOut();
		//this.setState({ showBtnBack: false });
		 
		//this.onClockAllButtonPressed()
		//this._setIni();
		//this.setState({bottonPanel:true});
		this._getPreciseDistance()
	}
	
	onEnterMenu = () => {
		Animated.timing(this.state.moveAnimation, {
			toValue: 690,
			timing: 1000,
			useNativeDriver: true,

		}).start();
		this._move =false;
		this.setState({_waitingclock : true})			
	}

	onBackBttnBack = () => {
		this.setState({showBtnBackLook:true})
	}
	onLoginfailure = () => {
		const { navigate } = this.props.navigation
		navigate("Login")
	}

   onReturnFromClockOut = () => {
	 this.onArrowBackButtonPressed ();
	 this.setState({ showBtnBack: true });
	 this._move = true
	 //333
   }
   onReturnFromApplayClockOut = () => {
	this.onArrowBackButtonPressed ();
	this.setState({ showBtnBack: true });
	this._move = true
	this.setState({ clock : 0})
	//333
  }

 onClockOutButtonPressed = () => {

    Session.checkSessionAlive(this.props.navigation);
    
	if(this._move){ // if Button Menu is  hidden

	  this.onClockAllButtonPressed()
	 return;
	}
	
	    this.onBackBttnBack();
		
		const { navigate } = this.props.navigation
		var pdis = getPreciseDistance(
			{ latitude: this.state.locationCityLatitude, longitude: this.state.locationCityLongitude },
			{latitude:  global.location_now.latitude , longitude:  global.location_now.longitude } , 
		);


		this._getCurrentPreciseDistance();
       
		console.log("---- Distance radius::",global.distanceOut);
		console.log("---- Current Distance ::",pdis);

     // No option, Send location always
	/*	
		if(pdis >= global.distanceOut ) {
			this.setState({ visible_mod_notLocation: true });// Show PopUp No in the Classroom
			this.setState({ clockType: "clockout" });
			this._setIni();
		}else{
			this.setState({ visible_mod_notLocation: false });
			this._setIni();
			this.setState({showBtnBack : true})	

			const { navigate } = this.props.navigation
			navigate("ClockOut" ,{course: this.state._course,context:this,_onLoadGetUsers :this.props.navigation.state.params._onLoadGetUsers} )		
		}  
	*/
	// Send Location Always	
		this.setState({ visible_mod_notLocation: false });
		this._setIni();
		this.setState({showBtnBack : true})	

		/// this.updateClassLocation(); // Send Location no more
		
		
		navigate("ClockOut" ,{course: this.state._course,context:this,_onLoadGetUsers :this.props.navigation.state.params._onLoadGetUsers} )

	}

	onArrowBackButtonPressed = () => {
		
		this.onBackBttnBack();
		this._setIni();
	}	
	onArrowShowButtonPressed = () => {
		
		this.onBackBttnBack();
		this._setIni();
	}	


	onClockOutLunchButtonPressed = () => {
		this.onBackBttnBack();
		this.onArrowBackButtonPressed();		
		var pdis = getPreciseDistance(
			{ latitude: this.state.locationCityLatitude, longitude: this.state.locationCityLongitude },
			{latitude:  global.location_now.latitude , longitude:  global.location_now.longitude } , 
		  );




		if(pdis >= global.distanceOut ) {
			this.setState({ visible_mod_notLocation: true });// PopUp 
			this.setState({ clockType: "clockoutlunch" });
			this._setIni();
		}else{
			this.setState({ visible_mod_notLocation: false });
			this._setIni();
			this.clockOutLunch()
			this.setState({showBtnBack : true})	
		}

	}

	onClockInButtonPressed = () => {
		    
		
		if (this.state.permissionsLocationsOk !== 'granted') {
			 console.log("Location errorMessage:" ,'Permission to access location was denied');	
			 this.setState({ location_permissions_visible_mod: true }); 
			 this.setState({
			   errorMessage: 'Permission to access location was denied',
			 });
			 return;
		 }

		//this.onClockAllButtonPressed()
		if(this._move){ // if Button Menu is  hidden
			this.onClockAllButtonPressed()
		   return;
		  }

		var pdis = getPreciseDistance(
			{ latitude: this.state.locationCityLatitude, longitude: this.state.locationCityLongitude },
			{latitude:  global.location_now.latitude , longitude:  global.location_now.longitude } , 
		);


		this._getCurrentPreciseDistance();

		console.log("---- Distance radius::",global.distanceOut);
		console.log("---- Current Distance ::",pdis);

     // No option, Send location always
	/*
		if(pdis >= global.distanceOut ) {
			this.setState({ visible_mod_notLocation: true });// // Show PopUp No in the Classroom 
			this.setState({ clockType: "clockin" });
			this._setIni();
		}else{
			this.onClockIn();
			this.setState({ visible_mod_notLocation: false });
			this._setIni();
			this.setState({showBtnBack : true})	
			this.onBackBttnBack();
		}
		*/
		this.onClockIn();
		this.setState({ visible_mod_notLocation: false });
		this._setIni();
		this.setState({showBtnBack : true})	
		// this.updateClassLocation(); // Send Location
	}
	onClockAllButtonPressed = () => {
            
			this.onBackBttnBack();
			if(this._move){
				this._setOut();
			}else{
				
				this._setIni();
			}     
	
			//this._move = true	
	}
	_setOut = () => {
		
		if(this._move){
			Animated.timing(this.state.moveAnimation, {
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
		this._move =! this._move
		
		this.setState({showBtnBack: !this.state.showBtnBack})
		this.setState({_waitingclock : true})
	}
	


	onCancel = () => {
		this._setOut();
		this.setState({ visible_mod: true });
	}
	onDetailStudentPressed = (item) => {

		const { navigate } = this.props.navigation	
		navigate("Details", {header:this.state._course,icon:imgIcon,studentItem:item.student, course : this.state.data.course , shift:this.state.data.shift,_onLoadGetUsers :this.props.navigation.state.params._onLoadGetUsers} )// {course : this.state._course} )
	}
	onDetailMakeUpPressed = (item) => {

		const { navigate } = this.props.navigation
		
		navigate("Details", {header:this.state._course,icon:imgIcon,studentItem:item.makeup_student, course : this.state.data.course , shift:this.state.data.shift,_onLoadGetUsers :this.props.navigation.state.params._onLoadGetUsers} )// {course : this.state._course} )
	}
	
	onSetPracticalExamResultPressed= (item) => {

		if( global.clock ===0  || global.shifttype == "info" ){
			Alert.alert(
				'Attention !',
				'You must Clock In before you can set Practical Exam.',
				[
				{text: 'OK', onPress: () => {

					 }
				},
				],
				{cancelable: false},
			   );
			   return;
		}	
		this.setState({pe_result_selected:item.practical_exam_result})
		this.setState({ratingNote:item.practical_exam_notes})
		this.setState({visible_mod_ex_result:true})
		this.setState({lastItem:item})

	}



	onDetailReturningPressed = (item) => {
		
	
		const { navigate } = this.props.navigation
		
		navigate("Details", {header:this.state._course,icon:imgIcon,studentItem:item.returning_student, course : this.state.data.course , shift:this.state.data.shift,_onLoadGetUsers :this.props.navigation.state.params._onLoadGetUsers} )// {course : this.state._course} )
	}	


	onUseMyLocation = () => {

		var distance = this._getPreciseDistance();

		//if(this.state.distanceOut >= global.distanceOut ) {
		if(distance >= global.distanceOut ) {
			
			this.setState({ visible_mod: false });
			this.setState({ visible_mod_notLocation: true });
		}else{
			this.setState({ visible_mod: false });
			this._setIni();
			this.onBackBttnBack();
			switch(this.state.clockType) {
 
				case 'clockin':
					this.onClockIn();
				  break;
				case 'clockout':
					const { navigate } = this.props.navigation
					navigate("ClockOut" ,{course: this.state._course,context:this,_onLoadGetUsers :this.props.navigation.state.params._onLoadGetUsers} )
				  break;
				case 'clockoutlunch':
					
					this.clockOutLunch()
					this.setState({showBtnBack : true})
					
				  break;				  				  
			}

			
		}
	}
 
 onPressBtnClockOutModal = () => {
	const { navigate } = this.props.navigation
	this.setState({showBtnBack: true})
	navigate("ClockOut" ,{course: this.state._course,context:this,_onLoadGetUsers :this.props.navigation.state.params._onLoadGetUsers} )
}

clockOutLunch = () => {
 
		let shift_id = this.state._course.id;
		let	objectClockOut = {shift_time_id:global.shift_time_id, device_setup:0,latitude:(this.state.location ? this.state.location.latitude :0)
			,longitude:(this.state.location ? this.state.location.longitude :0),checklist:[], lunch:1,city_id:global.city_id } ;

		//global.logs = "Clock -OUT LUNCH (objectClockOut): " + JSON.stringify(objectClockOut) + "\n";

       this.setColorClockIn();
       if(global.clock == 0) {
			Alert.alert(
				'Attention !',
				'You need Clock in before.',
				[
				{text: 'OK', onPress: () => console.log('OK Pressed')},
				],
				{cancelable: false},
			);
			return;
		}
		console.log(objectClockOut);

		if( global.connection !== 1) {

			Alert.alert(
				'Attention !',
				'Your Clock Out, has been saved locally due to not having internet access.',
				[
				{text: 'OK', onPress: () => {
					   connDBHelper.saveClock( shift_id, global.shift_time_id, this.state._course.course_date_id,global.user_id,0,this.state._course.instructor_id,2,JSON.stringify(objectClockOut));
					   connDBHelper.setClockInOff(this.state._course.course_date_id,global.user_id,global.shift_time_id)  ;
					   global.clock =0;
					   console.log('OK Success Pressed');
					   //global.shift_time_id = 0;
					   this.setColorClockIn();
					   
					 }
				},
				],
				{cancelable: false},
			   );

			 
			return;
		}

		this.setState({_waiting : true})
		var _url = global.host + '/api/auth/clockout';
		var _body = JSON.stringify(
				objectClockOut 
			);
		fetch(_url, {
			method: 'POST',
			headers: {
			   'Accept': 'application/json',
			   'Content-Type': 'application/json', 
			   "cache-control": "no-cache",
			   'Authorization' : global.token_type +  " " + global.access_token
			},
			body: _body
	   
		  }).then((response) =>  response.text()) 
				.then((responseData) =>
				 {
					 global.logs = ErrorHandler.setMessageResponse( "",_body,responseData,"response","",_url,global.id,global.name ,global.email);

					//global.logs = global.logs + " Clock -OUT LUNCH (Response): " + JSON.stringify(responseData) + "\n";
					this.setState({_waiting : false})
				   try {
					   var responseTXT = responseData;
					   let responseJSON = JSON.parse (responseTXT); 

					   if(responseJSON['success'] !== undefined && responseJSON['success'] !== false )  {
						      connDBHelper.setClockOutOk(this.state.course_date_id,global.user_id,shift_time_id);   
							
						Alert.alert(
							'You have to take a lunch break',
							"Then clock back in when you're back.",
							[
							{text: 'OK', onPress: () => {
								   connDBHelper.saveClock( shift_id, global.shift_time_id, this.state._course.course_date_id,global.user_id,1,this.state._course.instructor_id,2,JSON.stringify(objectClockOut));
								   console.log('OK Success Pressed');
								   global.clock = 0;
					               this.setColorClockIn();
								   connDBHelper.setClockInOff(this.state._course.course_date_id,global.user_id,global.shift_time_id)  ;
						console.log("global.clock ");
						console.log(global.clock );
                           this.onArrowBackButtonPressed ()
                           this._move = true;
								   
							     }
							},
							],
							{cancelable: false},
						   );
					    
                                  
					 	} else{
							console.log("ERROR");
							if (responseJSON['message'] == "Unauthenticated."){
							Alert.alert(
								'Attention !',
								'Your session expired. Please login again.',
								[
								{text: 'OK', onPress: () => {console.log('OK Error Pressed');return;}},
								],
								{cancelable: false},
							);
							
							   this.onLoginfailure();  
							}
							if (responseJSON['message'] ){
							    // console.log(responseJSON['message']);
							}
							if (responseJSON['msg'] == "Error Clock Out"){
								Alert.alert(
									responseJSON['msg'] +'!',
									responseJSON['error'],
									[
									{text: 'OK', onPress: () => {
										console.log('OK Pressed Message Error');
										
									}
									
								    },
									],
									{cancelable: false},
								);
								
								    
								}							
					 } 

				   } catch (e) {
					   console.log(e);
					   this.setState({
						   authenticated :0
					   });
					   	global.logs = ErrorHandler.setMessageResponseAdd( global.logs,_body,"","error",e.toString(),_url,global.id,global.name ,global.email);

					   if (e !== "ERROR")
					        Alert.alert("Error:", "Problems connecting to the Server. Please try again later.");

				   }

				}).catch((error) => {
				  console.log(error);	 
				  console.error(error);
			  	  global.logs = ErrorHandler.setMessageResponseAdd( global.logs,_body,"","error",error.toString(),_url,global.id,global.name ,global.email);

				  this.setState({
					 authenticated :0
				   });
				});
	
	}	

	onClockIn = () => { // 
		let shift_time_id = 0;
		//console.log(global.user_id); return;
		var	objectAtt = {assignment_id:this.state.data.shift_id,device_setup:0,latitude:this.state.locationCityLatitude,longitude:this.state.locationCityLongitude,city_id:global.city_id } ;
		
		connDBHelper.saveClock(this.state.data.shift_id,shift_time_id, this.state.course_date_id, global.user_id,0,this.state.instructor_id,1,JSON.stringify(objectAtt));
		
		//global.logs = " Clock -IN (objectAtt): " + JSON.stringify(objectAtt) + "\n";
		
		if( global.connection !== 1) {
			Alert.alert(
				'Attention !',
				'Your Clock In, has been saved locally due to not having internet access.',
				[
				{text: 'OK', onPress: () => console.log('OK Pressed')},
				],
				{cancelable: false},
			);

			this.UpdateNotes()
			 

			return;
		}


		this.setState({_waiting : true})
		var _url = global.host + '/api/auth/clockin';
		var _body = JSON.stringify(
				objectAtt
			);

		fetch(_url, { 
			method: 'POST', 
			headers: {
			   'Accept': 'application/json',
			   'Content-Type': 'application/json', 
			   "cache-control": "no-cache",
			   'Authorization' : global.token_type +  " " + global.access_token
			},
			body: _body
		}).then((response) =>  response.text()) 
			.then((responseData) =>
			{
				    global.logs = ErrorHandler.setMessageResponse( "",_body,responseData,"response","",_url,global.id,global.name ,global.email);

				    //global.logs = global.logs + " Clock -IN (Response): " + JSON.stringify(responseData) + "\n";
				    this.setState({_waiting : false})
					try {
						
						let responseTXT = responseData;
						let responseJSON = JSON.parse (responseTXT); 
						

	
						if(responseJSON['success'] !== undefined) {
								if(responseJSON['success'] === true){   
									 shift_time_id = responseJSON['shift_time_id'] ;
									 global.shift_time_id = shift_time_id;
									 global.clock = 1;
									 this.setState({clock:global.clock});
									 global.clockTime = Moment(responseJSON["clock_in_time"]).format('hh:mm a')

	
									connDBHelper.setClockInOk(this.state.course_date_id,global.user_id,shift_time_id);

									this.setColorClockIn();
									//this.onArrowBackButtonPressed ()
									this._move = true;
									//this.onBackBttnBack();
									Alert.alert(
										'Success !',
										responseJSON['msg'],
										[
										{text: 'OK', onPress: () => console.log('OK Pressed')},
										],
										{cancelable: false},
									);
									
								}
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
	
					} catch (e) {
						console.log(e);
						global.logs = ErrorHandler.setMessageResponseAdd( global.logs,_body,"","error",e.toString(),_url,global.id,global.name ,global.email);

						Alert.alert("Error:", "Problems connecting to the Server. Please try again later.");
	
					}
	
			});
	}


 onSendNote = () => { 
		
		Keyboard.dismiss();
		let objectAtt ; //arrAtt
        if(this.state.currentNote == "" ) return;

        if( global.clock ===0   || global.shifttype == "info"){
			
			Alert.alert(
				'Attention !',
				'You must Clock In before you can save Note.',
				[
				{text: 'OK', onPress: () => {

					 }
				},
				],
				{cancelable: false},
			   );
			   
			   
			   return;
		}


		objectAtt = {user_id:global.user_id,course_id:this.state.data.course_id ,course_date_id:this.state.course_date_id,notes:this.state.currentNote,city_id:global.city_id } ;
		

		//connDBHelper.saveAttendance(this.state.course_date_id,global.user_id,0,this.state.instructor_id,JSON.stringify(objectAtt));
		
       
		if( global.connection !== 1) {
			Alert.alert(
				'Attention !',
				'Your Students Attendance, has been saved locally due to not having internet access.',
				[
				{text: 'OK', onPress: () => console.log('OK Pressed')},
				],
				{cancelable: false},
			);

			 
			return;
		}	

		this.setState({_waiting : true})
		fetch(global.host + '/api/auth/attendance/student_note', { 
			method: 'POST', 
			headers: {
			   'Accept': 'application/json',
			   'Content-Type': 'application/json', 
			   "cache-control": "no-cache",
			   'Authorization' : global.token_type +  " " + global.access_token
			},
			body: JSON.stringify(
				objectAtt
			)
		}).then((response) =>  response.text()) 
			.then((responseData) =>
			{       
				    this.setState({_waiting : false})
					try {
						
						let responseTXT = responseData;
						let responseJSON = JSON.parse (responseTXT); 
						let course = {};
						let courseObj = {};
						let students_arr = [];
						let indexStudent = 0;
	
						if(responseJSON['success'] !== undefined) {
								if(responseJSON['success'] === true){   
								
									
									this.UpdateNotes()
									
								}
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
	
					} catch (e) {
						console.log(e);
						Alert.alert("Error:", "Problems connecting to the Server. Please try again later.");
	
					}
	 
			});
	}

	onSendSingleMakeUpAttendance = (student_id, item) => { 
		
		Keyboard.dismiss();


		let objectAtt ; //arrAtt
		let j = 0;


        if( global.clock ===0  || global.shifttype == "info" ){
			
			Alert.alert(
				'Attention !',
				'You must Clock In before you can send Attendance.',
				[
				{text: 'OK', onPress: () => {

					 }
				},
				],
				{cancelable: false},
			   );
			   
			   this.forceUpdate(); 
			   return;
		}

		onLoginfailure = () => {
			const { navigate } = this.props.navigation
			navigate("Login")
		}

		objectAtt = {user_id:global.user_id,course_id:this.state.data.course_id ,course_date_id:this.state.course_date_id,makeup_enrollment_id:item.student_id, student_id:student_id,city_id:global.city_id}  ;
		

		//connDBHelper.saveAttendance(this.state.course_date_id,global.user_id,0,this.state.instructor_id,JSON.stringify(objectAtt));
		
       
		if( global.connection !== 1) {
			Alert.alert(
				'Attention !',
				'Your Students Attendance, has been saved locally due to not having internet access.',
				[
				{text: 'OK', onPress: () => console.log('OK Pressed')},
				],
				{cancelable: false},
			);

			 
			return;
		}	
	
		this.setState({_waiting : true})
		var _url  = global.host + '/api/auth/attendance/makeup_student';
		var _body = JSON.stringify(
				objectAtt
			);
		fetch(_url, { 
			method: 'POST', 
			headers: {
			   'Accept': 'application/json',
			   'Content-Type': 'application/json', 
			   "cache-control": "no-cache",
			   'Authorization' : global.token_type +  " " + global.access_token
			},
			body: _body
		}).then((response) =>  response.text()) 
			.then((responseData) =>
			{       
				    global.logs = ErrorHandler.setMessageResponse( "",_body,responseData,"response","",_url,global.id,global.name ,global.email);
    
					this.setState({_waiting : false})
					try {
						
						let responseTXT = responseData;
						let responseJSON = JSON.parse (responseTXT); 
						let course = {};
						let courseObj = {};
						let students_arr = [];
						let indexStudent = 0;
	
						if(responseJSON['success'] !== undefined) {
								if(responseJSON['success'] === true){   
								
									
									
								}
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
	
					} catch (e) {
						console.log(e);
						global.logs = ErrorHandler.setMessageResponseAdd( global.logs,_body,"","error",e.toString(),_url,global.id,global.name ,global.email);
						Alert.alert("Error:", "Problems connecting to the Server. Please try again later.");
	
					}
	 
			});
	}


	onSendSingleAttendance = (item) => { 
		
		Keyboard.dismiss();


		let objectAtt ; //arrAtt
		let j = 0;


        if( global.clock ===0  || global.shifttype == "info" ){
			
			Alert.alert(
				'Attention !',
				'You must Clock In before you can send Attendance.',
				[
				{text: 'OK', onPress: () => {

					 }
				},
				],
				{cancelable: false},
			   );
			   
			   this.forceUpdate(); 
			   return;
		}

		onLoginfailure = () => {
			const { navigate } = this.props.navigation
			navigate("Login")
		}

		objectAtt = {user_id:global.user_id,course_id:this.state.data.course_id ,course_date_id:this.state.course_date_id,notes:"",enrollment_id:item.student_id,city_id:global.city_id } ;
		

		connDBHelper.saveAttendance(this.state.course_date_id,global.user_id,0,this.state.instructor_id,JSON.stringify(objectAtt));
		
       
		if( global.connection !== 1) {
			Alert.alert(
				'Attention !',
				'Your Students Attendance, has been saved locally due to not having internet access.',
				[
				{text: 'OK', onPress: () => console.log('OK Pressed')},
				],
				{cancelable: false},
			);

			 
			return;
		}	

		this.setState({_waiting : true})
		var _url = global.host + '/api/auth/attendance/student';
		var _body = JSON.stringify(
				objectAtt
			);
		fetch(_url, { 
			method: 'POST', 
			headers: {
			   'Accept': 'application/json',
			   'Content-Type': 'application/json', 
			   "cache-control": "no-cache",
			   'Authorization' : global.token_type +  " " + global.access_token
			},
			body: _body
		}).then((response) =>  response.text()) 
			.then((responseData) =>
			{       
				    this.setState({_waiting : false})
					global.logs = ErrorHandler.setMessageResponse( "",_body,responseData,"response","",_url,global.id,global.name ,global.email);

					try {
						
						let responseTXT = responseData;
						let responseJSON = JSON.parse (responseTXT); 
						let course = {};
						let courseObj = {};
						let students_arr = [];
						let indexStudent = 0;
	
						if(responseJSON['success'] !== undefined) {
								if(responseJSON['success'] === true){   
								
								
									// Ojo this.UpdateNotes()
									
								}
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
	
					} catch (e) {
						this.setState({_waiting : false})
						console.log(e);
						global.logs = ErrorHandler.setMessageResponseAdd( global.logs,_body,"","error",e.toString(),_url,global.id,global.name ,global.email);

						Alert.alert("Error:", "Problems connecting to the Server. Please try again later.");
	
					}
	 
			});
			
	}


	onSendAttendance = () => { // (course_date_id, user_id, attendance) {
		// OJO
		Keyboard.dismiss();
		let enrollment_ids = [];
		let makeup_enrollment_ids = [];
		
		let objectEnrollment_ids ;
		let objecMakeup_enrollment_ids ; 
		let objectAtt ; //arrAtt
		let j = 0;


        if( global.clock ===0  || global.shifttype == "info" ){
			Alert.alert(
				'Attention !',
				'You must Clock In before you can send Attendance.',
				[
				{text: 'OK', onPress: () => {

					 }
				},
				],
				{cancelable: false},
			   );
			   return;
		}


		 this.state.data.attendance.map((item,i)=>{ 
			
			if(item.attended === 1 )   {
				 
			   enrollment_ids[j]  = item.student_id;

			  j ++;
			  
		   }
		})

		let k = j;
		this.state.data.returningAttendance.map((item,i)=>{ 
			
			if(item.attended === 1 )   {
				 
			   enrollment_ids[k]  = item.student_id;

			  k ++;
		   }
		})
		let m = k;
		this.state.data.makeUpAttendance.map((item,i)=>{ 
			
			if(item.attended === 1 )   {
				 
				makeup_enrollment_ids[m]  = item.student_id;

			  m ++;
		   }
		})
	
	    
		objectEnrollment_ids = enrollment_ids.reduce(function(result, item, index, array) {
			result[index] = item; //a, b, c
			return result;
		  }, {})
	
		  objecMakeup_enrollment_ids = makeup_enrollment_ids.reduce(function(result, item, index, array) {
			result[index] = item; //a, b, c
			return result;
		  }, {})
	
		objectAtt = {user_id:global.user_id,course_id:this.state.data.course_id ,course_date_id:this.state.course_date_id,notes:this.state.currentNote,enrollment_ids:objectEnrollment_ids,makeup_enrollment_ids: objecMakeup_enrollment_ids} ;
		

		connDBHelper.saveAttendance(this.state.course_date_id,global.user_id,0,this.state.instructor_id,JSON.stringify(objectAtt));
		
       
		if( global.connection!== 1) {
			Alert.alert(
				'Attention !',
				'Your Students Attendance, has been saved locally due to not having internet access.',
				[
				{text: 'OK', onPress: () => console.log('OK Pressed')},
				],
				{cancelable: false},
			);

			this.UpdateNotes()
			 
			return;
		}	

		this.setState({_waiting : true})
		var _url = global.host + '/api/auth/attendance';
		var _body = JSON.stringify(
				objectAtt
			);
		fetch(_url, { 
			method: 'POST', 
			headers: {
			   'Accept': 'application/json',
			   'Content-Type': 'application/json', 
			   "cache-control": "no-cache",
			   'Authorization' : global.token_type +  " " + global.access_token
			},
			body: _body
		}).then((response) =>  response.text()) 
			.then((responseData) =>
			{       
				    global.logs = ErrorHandler.setMessageResponse( "",_body,responseData,"response","",_url,global.id,global.name ,global.email);

				    this.setState({_waiting : false})
					try {
						
						let responseTXT = responseData;
						let responseJSON = JSON.parse (responseTXT); 
						let course = {};
						let courseObj = {};
						let students_arr = [];
						let indexStudent = 0;
	
						if(responseJSON['success'] !== undefined) {
								if(responseJSON['success'] === true){   
									
									Alert.alert(
										'Success !',
										'You sent Students Attendance.',
										[
										{text: 'OK', onPress: () => console.log('OK Pressed')},
										],
										{cancelable: false},
									);
									
									connDBHelper.setAttendanceOk(this.state.course_date_id,global.user_id);
									this.UpdateNotes()
									
								}
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
	
					} catch (e) {
						console.log(e);
						global.logs = ErrorHandler.setMessageResponseAdd( global.logs,_body,"","error",e.toString(),_url,global.id,global.name ,global.email);

						Alert.alert("Error:", "Problems connecting to the Server. Please try again later.");
	
					}
	 
			});
			this.setState({_waiting : false})
	}
	
	

	UpdateNotes = () => {
		//this.setState({notes:[]})
		//this.state.currentNote
		if(this.state.currentNote === "") return;
		let arr_ = [];
		let arr_result = [];
		let j = 0;
		
		arr_ = this.state.notes

        arr_.push({comment:this.state.currentNote,updated_at:global.today,id:arr_.length} ) 
		
		
		j= this.state.notes.length 

		arr_.map((item,i)=>{ 
			j--;
			arr_result.push(arr_[j])

		})
		
		this.setState({notes:arr_result})

		this.setState({currentNote:""})
	}

	onTabSpecificationsPressed = () => {
		
		const { navigate } = this.props.navigation
	
		if(this.state.data.shift )

		   navigate("Specifications",{ header: this.state.data.shift ,_onLoadGetUsers :this.props.navigation.state.params._onLoadGetUsers});
	  }
    onPressPopupExResultButton = (option) => {
		
		this.setState({pe_result_selected:option})
	}

    onPressPopupExResultSubmitButton = () => {
		this.setState({visible_mod_ex_result:false})
		this.updatePracticalExam (this.state.lastItem )
		
			
	}

	showSendErrorScreen(navObj){
		const { navigate } = navObj
		
		navigate("SubmitError",{_onLoadGetUsers :this.nav.state.params._onLoadGetUsers })
	}
	
	

	render() { 
		let arrow_back_img ;
		let styleBack ;


		let paddingLeftExtra ;
		if(this._move){
		   paddingLeftExtra = {flex: 0.2, }
		}else{
		  paddingLeftExtra = {flex: 9.5, }
		}   

		const { modalVisible } = this.state; 
		
		const {location,geocode, errorMessage } = this.state;
        if(global.shifttype == "info" ){
			
			styleBack  = styles.viewViewInfo;
		}else{
			styleBack  = styles.viewView;
		}


		if(this.state.clock === 0 )
			arrow_back_img = require("./../../assets/images/arow_forward.png");
		else	
			arrow_back_img = require("./../../assets/images/arow_forward-green.png");
			
			
		if(this.state._course.class_time === "Weekend" )
			imgIcon = require("./../../assets/images/trazado-100w.png");
		
	    if(this.state._course.class_time === "Day" )
			imgIcon = require("./../../assets/images/grupo-46w.png");
		if(this.state._course.class_time === "Evening" )
			 imgIcon = require("./../../assets/images/grupo-49-2.png");
		
		if(this.state._course.class_time !== "Weekend" && 
		   this.state._course.class_time !== "Day" && 
		   this.state._course.class_time !== "Evening" )
		   imgIcon = require("./../../assets/images/trazado-107-T.png");
 


		moveAnimationStyle = {
			transform: [
				{
					translateX: this.state.moveAnimation
				}
			]
		}

		
		return<View
				style={styleBack}>					
				
				<ShiftHeader
						instructorName = {global.name}
						//date = {global.todayFormat}
						date = { Moment(this.state._course.start_time).format('MMM DD YYYY') }
						time = {this.state._course.class_time}
						class_type = {this.state._course.class_type}
						city = {this.state._course.city}
						class_number = {this.state._course.class_number}
						navigation = {this.props.navigation}
						_onLoadGetUsers = {this.props.navigation.state.params._onLoadGetUsers}
					>
				</ShiftHeader>

					{ this.state.showBtnBack && this.state.showBtnBackLook &&
					<TouchableOpacity
							onPress={this.onBtnBackPressed}
							style={styles.btnbackButton}>
							<Text
								style={styles.btnbackButtonText}>Back</Text>
					</TouchableOpacity> }

				
				<View
					style={styles.viewTitlesView}>
					<Text
						style={styles.studentText}>Student</Text>
					<Text
						style={styles.attendanceText}>Attendance</Text>
					<Text
						style={styles.enrollmentDocumentsText}>Enrollment{"\n"}Documents</Text>
					<Text
						style={styles.paymentsText}>Paid off</Text>
					<Text
						style={styles.practicalExamText}>Practical{"\n"}Exam</Text>
					<Text
						style={styles.detailsText}>Details</Text>
				</View>

				<View 		style={[styles.containerWait, !this.state._waiting ? styles.containerHiddend : {}]}>
                      <ActivityIndicator size="large" color="#ffff"  />
                </View>
				<View 		style={[styles.containerWait, !this.state._waitingclock ? styles.containerHiddend : {}]}>
                      <ActivityIndicator animating="false"  size="large" color="#ffff"  />
                </View>	
				<View 		style={[styles.containerWait, !this.state._waitingreport ? styles.containerHiddend : {}]}>
                      <ActivityIndicator animating="false"  size="large" color="#ffff"  />
                </View>				
				
				<KeyboardAwareScrollView  behavior={ Platform.OS === 'ios'? 'padding': null}
					extraHeight = {200}
                      style= {styles.FlexGrowOne}>
					<ScrollView
					     
						style={styles.FlexOne}> 

						<View						
							style={styles.containerStudents}> 
							<ChildElementStuden  result={this.state.data}  atten={this.state._arrayAttandance}   nav ={this}/>  
							</View>
			<AppStates></AppStates>
			
			
							<View
								style={styles.viewTitleMakeupStudentsView}>
								<Text
									style={styles.makeUpStudentsText}>Make Up Students</Text>
							</View>
						
							<View						
							style={styles.containerStudents}> 
							<ChildElementMakeUpStuden  result={this.state.data}  atten={this.state._arrayMakeupAttandance}  nav ={this}/>  
							</View>
							<Text
								style={styles.txtReturningStudentsText}>Returning Students</Text>
							<View						
									style={styles.containerStudents}> 
							<ChildElementReturningStuden  result={this.state.data}  atten={this.state._arrayReturningAttandance}  nav ={this}/>  
							</View>

							<View						
							  style={styles.containerStudents}> 
										<Text
											style={styles.txtReturningStudentsText}>Removed from Course</Text>
											<View>


										<ChildElementRemovedStuden  result={this.state.data} />  
									</View>	

							</View>


							<View
								pointerEvents="box-none"
								style={{
									height: 275,
									marginLeft: 17,
									marginRight: 19,
									marginTop: 30,
									backgroundColor: "transparent",
								}}>

								<View
									style={styles.viewFootnoteView1}>
									{false && 
									<TouchableOpacity
												onPress={this.onSendAttendance}		  
												style={styles.btnAttendanceButton}>
												<Text
													style={styles.btnUpdateButtonText}>Send Attendance</Text>
									</TouchableOpacity>
									}
									{false && <View
										style={styles.viewRemovedView}>
										<View
											style={styles.viewRectRemovedView}/>
										<Text
											style={styles.txtRemovedText}>Removed from class </Text>
									</View>}
									<Text
										style={styles.txtNotesText}>Notes</Text>
									<TextInput
										onChangeText = {(currentNote) => this.setState({currentNote})} 
										//returnKeyType="go"
										autoCorrect={false}
										multiline={true}
										value={this.state.currentNote}
										style={styles.inputTxtNotesTextInput}
										autoCapitalize="sentences"

										ref={ref =>  {this._note = ref;}}
										// onSubmitEditing= {() =>this._note.focus()}
										returnKeyType="done"
										/>
										<View > 
											<TouchableOpacity
												onPress={this.onSendNote}
												style={styles.btnUpdateButton}>
												<Text
													style={styles.btnUpdateButtonText}>Send Note</Text>
											</TouchableOpacity>	
				
										</View>	
								</View>
							</View>


							<View
							style={styles.viewNotesListView}>
								<ChildElementNotes  notesList={this.state.notes} />  
								<View key={1000000}
								style={styles.viewNotesRowViewSpace}></View>
		
							</View> 
							<View
							   style={{
								    height : 20,
									flex: 1,
								}}/>  
					   </ScrollView>
			   
				    </KeyboardAwareScrollView>



					<View
						style={styles.viewFooterMenuThreeView}>
						<View
							style={styles.tabBarIpadRegTwoView}>
							<View
								style={{
									flex: 1,
							}}/>	
							<TouchableOpacity
								onPress={this.onTabSpecificationsPressed}
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
								style={styles.tab2FourButton}>
								<Text
									style={styles.tab2FourButtonText}>Anouncements</Text>
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
							{ false && <BackgrounFetchTask></BackgrounFetchTask>}	
						
						</View>
						
					</View>

				{ this.state.bottonPanel  &&  global.shifttype == "real" &&	
					<View style={styles.viewReportBandViewContainer} >
					   <View style={styles.viewBandViewContainerReport} >
					       <TouchableWithoutFeedback delayLongPress={1000} style={styles.button}  > 
								<Animated.View 
								    style={[  styles.animatedContainer, { 
										                                  transform: [{
										                                     translateX: this.state.moveAnimationR}] } 
										 ]}>
						
						
										<View style={styles.conteiner} >		
										

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
																	//shadowColor: "rgba(0, 0, 0, 00.16)",
																	//shadowRadius: 12,
																	//shadowOpacity: 1,
																	width: 288,
																	height: 48,
																	marginTop: 9,
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
																source={require("./../../assets/images/alert.png")}
																style={styles.imgClockInImage}/>
														</View>
													</TouchableOpacity>	
													<View
											           style={this.state.stylePaddingLeftExtraRep}/>
											</View>	
										</View>	


								</Animated.View>		
						   </TouchableWithoutFeedback>
					   </View>
					</View>
                } 

				{ this.state.bottonPanel  &&  global.shifttype == "real" &&
					<View style={styles.viewBandViewContainer} >		
						<TouchableWithoutFeedback delayLongPress={1000} style={styles.button}  > 
						   <Animated.View 
						   style={[styles.animatedContainer, moveAnimationStyle]}>
								<View style={styles.conteiner} >		
									
									<View style={styles.viewBandView}>	

										  { this.state.clock == 1 && 
											<View style={styles.viewBandView}> 

												<TouchableOpacity
														onPress={this.onArrowBackButtonPressed}>	
													<Image
													source={require("./../../assets/images/arow_back.png")}
														style={styles.imgArrowBackImage}/>    
												</TouchableOpacity>
										        <View
											    style={{
													flex: 1,
												   }}/>
												  <View
														style={styles.viewClockInTimeView}>
														<Text
															style={styles.txtClockInTimeText}>Clocked in</Text>
														<Text
															style={styles.txtClockInTimeText}>{global.clockTime}</Text>	
														<View
															style={{
																flex: 1,
															}}/>

												   </View>

											      <View
													  style={{
														flex: 1,
													}}/>

                                             { this.state.shift_hours  >= 6  &&	
											  <View>
												<TouchableOpacity
											       onPress={this.onClockOutLunchButtonPressed}>								
													<View
														style={styles.viewClockOutLunchView}>
														<Text
															style={styles.txtClockOutLunchText}>Clock Out Lunch </Text>
														<View
															style={{
																flex: 1,
															}}/>
														<Image
															source={require("./../../assets/images/lunch78.png")}
															style={styles.imgClockOutLunchImage}/>
													</View>
												</TouchableOpacity>

											   </View>
	                                        }
											{ this.state.shift_hours  < 6  &&	
												<View
												style={{
													flex: 20,
											  }}/>
											}
											     	
											   <View
												 style={{
												   flex: 4,
											   }}/>
												<TouchableOpacity
											       onPress={this.onClockOutButtonPressed}>	
												  <View
														style={styles.viewClockOutView}>
														{/* Principal Button  XXX */}
														<Text
															style={styles.txtClockOutText}>Clock Out </Text> 
														<View
															style={{
																flex: 1,
															}}/>
														<Image
															source={require("./../../assets/images/grupo-62.png")}
															style={styles.imgClockOutImage}/>
												   </View>
											    </TouchableOpacity>
											    
												<View
											    style={{
													flex: .5,
												   }}/>	
											</View>
											}
											{ this.state.clock == 0 && 
											<View style={styles.viewBandView}>	 
												<TouchableOpacity
														onPress={this.onArrowBackButtonPressed}>	
													<Image
													source={require("./../../assets/images/arow_back.png")} 
														style={styles.imgArrowBackImage}/>    
												</TouchableOpacity>
													<View
															style={{
																flex: 11,
															}}/>	
													<TouchableOpacity
													onPress={this.onClockInButtonPressed}>								
														<View
															style={{
																	//backgroundColor: "rgb(148, 233, 56)",
																	backgroundColor:this.state.backgroundColorBtnClockIn,
																	borderRadius: 20,
																	shadowColor: "rgba(0, 0, 0, 00.16)",
																	shadowRadius: 12,
																	shadowOpacity: 1,
																	width: 188,
																	height: 48,
																	marginTop: 11,
																	flexDirection: "row",
																	alignItems: "center"}
																}>
															<Text
																style={styles.txtClockInText}>Clock In</Text>
														
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
											           style={paddingLeftExtra}/>
											</View> 
											}

											{ false && <View>
												<View
														style={{
															flex: 1,
														}}/>
												<TouchableOpacity
														onPress={this.onClockAllButtonPressed}>	
													<Image  
													source={arrow_back_img}
														style={styles.imgArrowShowImage}/>    
												</TouchableOpacity>	
											</View>
											}
												
									</View>
								</View>
						   </Animated.View>
					    </TouchableWithoutFeedback> 					
					</View>
				}	

			<Modal1
				onTouchOutside={() => {
					this.setState({ location_permissions_visible_mod: false });
					}}
				visible={this.state.location_permissions_visible_mod}
				animationDuration = {500}
				modalAnimation={

					new SlideAnimation({
						slideFrom: 'bottom',
						initialValue: 0,
						useNativeDriver: true,
						})
				}
				>
				<ModalContent style={styles.viewModalConten}  >
					<View 
						style={styles.ClockInLocationText}>
						<Text modalPopUpClockInLocationText>Location</Text>
						<View style={styles.viewPopUpLineView}/>
					</View>

			        <Text style={styles.txtPopUpClockInText} > 
					Turning on location service allows us {"\n"} to register your shift. 
					
					</Text>

		

						<TouchableOpacity
							style={styles.locationButton}
							onPress={() => {
								//this.onUseMyLocation
								this.setState({ location_permissions_visible_mod: false });
								Linking.openURL('app-settings://');
								this.onBtnBackPressed();
								}}
								>
	                       <Image
							         source={require("./../../assets/images/arrowFilled.png")}
							     style={styles.imgIconLocation}/>	
							<Text style={styles.textStyleClose}>Current Location</Text>
						</TouchableOpacity>
	
						<TouchableHighlight
							style={{ ...styles.closeButton, backgroundColor: "#8B1936" }}
								onPress={() => {
									//this.setState({ visible_mod: false });
									// this._setIni();
									// this.setState({showBtnBack: true,showBtnBackLook :true})
									this.setState({ location_permissions_visible_mod: false });
									/// this._move = true;

									
								}}>
							<Text style={styles.textStyleClose}>Close</Text>
						</TouchableHighlight>


				</ModalContent>
			</Modal1>	
           
		{ /* Modal Window  "You are not in the classroom!" */}
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
						<Text modalPopUpClockInLocationText>Location</Text>
						<View style={styles.viewPopUpLineView}/>
					</View>
					
			          <Text style={styles.txtPopUpClockInText} >{this.state.showNotInClassroomTitles ? 'You are not in the classroom!':''}</Text>


					<View style={styles.mapContainer}>
					   <MapView style={styles.mapStyle}
					 	provider="google"
						 region={{  
							   latitude:  (location ? location.latitude :global.location_now.latitude) ,
							   longitude: (location ? location.longitude :global.location_now.longitude), 
							   latitudeDelta: 0.0022,
							   longitudeDelta: 0.0021
						 }}>
							 						    
						   
						 <Marker coordinate={{latitude: (this.state.locationCityLatitude ? this.state.locationCityLatitude :0),longitude:(this.state.locationCityLongitude ? this.state.locationCityLongitude :0)}}
						   title= { global.city } //(geocode  ? geocode[0].city + " " +geocode[0].isoCountryCode  : "" ) } 
						   pinColor = "blue"
						   icon = {require("./../../assets/images/phleico1.png")}
						   >
						 </Marker>

						 <Marker coordinate={{latitude: (location ? location.latitude :global.location_now.latitude),longitude:(location ? location.longitude :global.location_now.longitude)}}
						   title= { (geocode  ? geocode[0].city + " " +geocode[0].isoCountryCode  : "" ) } >
						 </Marker>
						</MapView>

                    </View>		
		
					<Text style={styles.txtPopUpCanSignText} >{this.state.showNotInClassroomTitles ? "Remember you can't clock in/out from outside the classroom":''} </Text>
						{ this.state.clockType == "clockin" && // REAL Clock IN
							<TouchableHighlight
									style={
										{
										backgroundColor:this.state.backgroundColorBtnClockIn,
										borderRadius: 20,
										shadowColor: "rgba(0, 0, 0, 00.16)",
										shadowRadius: 12,
										shadowOpacity: 1,
										top:275,
										width: 188,
										height: 48,
										alignItems: "center"
									}
									}
									onPress={() => {
										//this._getCurrentPreciseDistance();
										console.log("distanceOut ::",this.state.distanceOut);
										console.log("global.distanceOut::",global.distanceOut);
										
									
										
										
										if(this.state.distanceOut >= global.distanceOut  ) {
											Alert.alert(
												'Attention !',
												"You can't clock in/out from outside the classroom.",
												[
												{text: 'OK', onPress: () => {

													return;
												}
												},
												],
												{cancelable: false},
											   );
											   return;
										}

										//this._getPreciseDistance();
										this.onClockIn();
										this.setState({ visible_mod_notLocation: false });
										this._setIni();
										this.onBackBttnBack();
										this.setState({showBtnBack: true,showBtnBackLook :true})
									
										
										
									}}>
									<Text style={styles.txtClockInLocationText}>Clock In</Text>
							</TouchableHighlight>	
						}
						{ this.state.clockType == "clockout" && // REAL Clock Out
							<TouchableHighlight
									style={
										{
										//backgroundColor: "rgb(148, 233, 56)",
										backgroundColor:"#8B1936",
										borderRadius: 20,
										shadowColor: "rgba(0, 0, 0, 00.16)",
										shadowRadius: 12,
										shadowOpacity: 1,
										top:275,
										width: 188,
										height: 48,
										paddingTop:8,
										paddingRight:12,
										//marginTop: 48,
										//flexDirection: "row",
										alignItems: "center"
									}
									}
									onPress={() => {
										//this._getPreciseDistance();
										//this.onPressBtnClockOutModal();
										//this._getCurrentPreciseDistance();
										console.log("distanceOut ::",this.state.distanceOut);
										console.log("global.distanceOut::",global.distanceOut);
										
										if(this.state.distanceOut >= global.distanceOut  ) {
											Alert.alert(
												'Attention !',
												"You can't clock in/out from outside the classroom.",
												[
												{text: 'OK', onPress: () => {

													return;
												}
												},
												],
												{cancelable: false},
											   );
											   return;
										}

										const { navigate } = this.props.navigation
										this.setState({ visible_mod_notLocation: false });
										this._setIni();
										navigate("ClockOut" ,{course: this.state._course,context:this,_onLoadGetUsers :this.props.navigation.state.params._onLoadGetUsers} )
										this.setState({showBtnBack : true})
										// 333
										this._move = true
									}}>
									<Text style={styles.txtClockOutText}>Clock Out</Text>
							</TouchableHighlight>	
						}
						{ this.state.clockType == "clockoutlunch" &&
							<TouchableHighlight
									style={
										{
										backgroundColor:"rgb(140, 132, 14)",
										borderRadius: 20,
										shadowColor: "rgba(0, 0, 0, 00.16)",
										shadowRadius: 12,
										shadowOpacity: 1,
										top:275,
										width: 260,
										height: 48,
										paddingTop:8,
										paddingRight:17,
										alignItems: "center"
									}
									}
									onPress={() => {
										//this._getPreciseDistance();
										this.setState({ visible_mod_notLocation: false });
										this._setIni();
										this.clockOutLunch()
										this.setState({showBtnBack : true})

										this.onArrowBackButtonPressed();
									}}>
									<Text style={styles.txtClockOutText}>Clock Out Lunch</Text>
							</TouchableHighlight>	
						}
						<TouchableHighlight
							style={{ ...styles.closeButtonMaps, backgroundColor: "#8B1936" }}
								onPress={() => {
									this.setState({ visible_mod_notLocation: false });
									this._setIni();
									this.setState({showBtnBack: true,showBtnBackLook :true})
									console.log("close 1")
									this._move = true
									//this.onArrowBackButtonPressed ()
								}}>
							<Text style={styles.textStyleClose}>Close</Text>
						</TouchableHighlight>
						{ this.state.showNotInClassroomTitles  &&
						<TouchableOpacity
						      style={styles.updateLocationButton}
								onPress={() => {
									//this.getLocationAsync();
									//this._getPreciseDistance();
									//this.onClockIn();
							/// this.updateClassLocation();
									//this.setState({ visible_mod_notLocation: false });
								}}>
                                 <Image
							         source={require("./../../assets/images/arrowFilled.png")}
							     style={styles.imgIconLocation}/>		
							<Text style={styles.textLocationStyle}>Update class location</Text>
						</TouchableOpacity>
						}
						<Text style={styles.txtPopUpNotClassRoomText} > {this.state.showNotInClassroomTitles ? "Warning!! changing the classroom location will modify it for the rest of the course and the administrators will recieve message.":''}</Text>
				</ModalContent>
			</Modal1>
    	{ /* End:: Modal Window  "You are not in the classroom!" */}


			<Modal1
				onTouchOutside={() => {
					this.setState({ visible_mod_notLocation: false });
					}}
				visible={this.state.visible_mod_ex_result} 
				animationDuration = {0}

				>
				<ModalContent style={styles.viewModalPracticalExam}  >
					<View 
						style={styles.PtacticalExamTitleText}>
			          <Text style={styles.txtPopUpPracticalExamTitleText} >Practical Exam</Text>
					</View>

					<Text style={styles.textPracticalExamNormalStyle}>Select the exam result</Text>
					
					<View
					   style={styles.viewPracticalExamOptionFaces}>
                      <TouchableHighlight
						onPress={() => {this.onPressPopupExResultButton("acceptable")	}} >
						   
					{ this.state.pe_result_selected != "acceptable" ?
					   <View 
					     style={styles.viewButtoPracticalExam} >  
					    <Image
						   source={require("./../../assets/images/em_acceptable.png")}
						    style={styles.viewBtnDetailsButtonImage}/>
							<Text style={styles.textPracticalExamNormalStyle}>Acceptable</Text>
					   </View>
					   : 

						<View 
						  style={styles.viewButtoPracticalExam} >  
					      <Image
						    source={require("./../../assets/images/em_acceptable_.png")}
						    style={styles.viewBtnDetailsButtonImage}/>
						    <Text style={styles.textPracticalExamSelectStyle}>Acceptable</Text>
					    </View>

	                }
                      </TouchableHighlight>  
					   <View
							style={{
							flex: 3,
							}}/>
				     <TouchableHighlight
						onPress={() => {this.onPressPopupExResultButton("good")	}} >			
					{ this.state.pe_result_selected != "good" ?		
					   <View 
					    style={styles.viewButtoPracticalExam} >  
					   <Image
						   source={require("./../../assets/images/em_good.png")}
						    style={styles.viewBtnDetailsButtonImage}/>
							<Text style={styles.textPracticalExamNormalStyle}>Good</Text>
					   </View>
					   : 
					   <View 
						 style={styles.viewButtoPracticalExam} >  
						 <Image
						   source={require("./../../assets/images/em_good_.png")}
						   style={styles.viewBtnDetailsButtonImage}/>
						   <Text style={styles.textPracticalExamSelectStyle}>Good</Text>
					   </View>
				     }
					 </TouchableHighlight>
					   <View
							style={{
							flex: 3,
							}}/>
				     <TouchableHighlight
						onPress={() => {this.onPressPopupExResultButton("outstanding")	}} >
					{ this.state.pe_result_selected != "outstanding" ?	
					   <View 
					    style={styles.viewButtoPracticalExam} >  
					   <Image
						   source={require("./../../assets/images/em_outstanding.png")}
						    style={styles.viewBtnDetailsButtonImage}/>
							<Text style={styles.textPracticalExamNormalStyle}>Outstanding</Text>
					   </View>		   
						: 
						<View 
							style={styles.viewButtoPracticalExam} >  
							<Image
							source={require("./../../assets/images/em_outstanding_.png")}
							style={styles.viewBtnDetailsButtonImage}/>
							<Text style={styles.textPracticalExamSelectStyle}>Outstanding</Text>
					   </View>
					}
                    </TouchableHighlight>
					</View>
					<View  	
						style={styles.viewNotesRowRating}> 
							<View>
							<TextInput
								clearButtonMode="always"
								onChangeText = {(value) => this.setState({ratingNote:value})} 
								autoCorrect={false}
								multiline={true}
								defaultValue = {this.state.ratingNote}
								style={styles.inputTxtNotesRating}
								autoCapitalize="sentences"
								placeholder={"  Notes:"}
								placeholderTextColor="#999" 
								/>
							</View>
					 </View>
					<TouchableHighlight
							style={{ ...styles.closeButtonMaps, backgroundColor: "#8B1936",top:45 }}
								onPress={() => {

									if(this.state.pe_result_selected == ""){
										Alert.alert(
											'Attention !',
											'Please select a rating for the practical exam',
											[
											{text: 'OK', onPress: () => {
							
												 }
											},
											],
											{cancelable: false},
										   );
	
										   return;
									}

                                      this.onPressPopupExResultSubmitButton()
								}}>
							<Text style={styles.textStyleClose}>Submit</Text>
						</TouchableHighlight>

				</ModalContent>
			</Modal1>

			<FlashMessage position="top" />
	</View>
		
	}
}


export class ChildElementNotes extends React.Component{ 
	
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render(){
		if(this.props.notesList){  
			//console.log("this.props.notesList");
			//console.log(this.props.notesList);
		
			var res = this.props.notesList.map((item)=>{ 

			return( 
				<View key={item.id}
					style={styles.viewNotesRowView}>
					<Text
						style={styles.txtDateNoteText}>{Moment(item.updated_at).format('MMM DD YYYY') }</Text>
					<Text numberOfLines = { 20 }
						style={styles.txtNoteText}>{item.comment}</Text>
					<View
						style={styles.lineNoteView}/>
				</View>
				)
			})	
		}
		return ( 
			<View>{res}</View> 
		)
		index ++;	
	}


}

export class ChildElementRemovedStuden extends React.Component{ 
	
	constructor(props) {
		super(props);
		this.state = {
			dump:0,
			arrStudentAttendance:[],
		};
	}

	render(){
		if(this.props.result){  
			if (this.props.result.dropout_students.length == 0) {
				return (<Text
				 style={styles.txtNoMakeUpStudentsFoundText}>
					No Removed from course found
				</Text>);
			}

			var res = this.props.result.dropout_students.map((item,i)=>{ 

			return( 
					  <View key={item.id} >
							<View 
								style={styles.viewRowStudentView}>
								<View
									style={styles.viewLineView}/>
								{false && <Text
									style={styles.txtIndexRemoveText}>{i+1}</Text>}
								<View
									style={styles.viewStudentView}>
									<Image
										source={require("./../../assets/images/elipse-3-16.png")}
										style={styles.imgAvatarImage}/>
									<View
										pointerEvents="box-none"
										style={{
											width: 151,
											height: 48,
											marginLeft: 15,
											marginTop: 4,
											backgroundColor:"transparent",
											alignItems: "flex-start",
										}}>
										<Text numberOfLines = { 2 }
											style={styles.txtStudNameRemovedText}>{item.name} {item.last_name}</Text>
						
						           { item.exam_optout_at != undefined &&  item.exam_optout_at  && 
										<Text 
											style={styles.txtStudExamOptoutText}> No Exam </Text>
								   }
									</View>
								</View>
						
								<View>
								<Text numberOfLines = { 3 }
											style={styles.txtStudEmailText}>{item.email}</Text>
								</View>
								<View>
									<Text 
											style={styles.txtStudNoteText}>{item.phone}</Text>
								</View>	
								<View>
									<Text  numberOfLines = { 3 }	
											style={styles.txtStudBalanceText}>{  ( item.dropout_date == null ? "" : Moment((item.dropout_date)).format('MMM DD YYYY') )   }</Text>
								</View>		
							</View>
					  </View>
				);
			})	
			
		}
		return ( 
			
			<View>
				{ true &&

					<View
							style={styles.viewTitlesRemovView}>
							<View
								style={{
									flex: 0,
								}}/>	
							<Text
								style={styles.studentText}>Student</Text>
							<View
								style={{
									flex: 1,
								}}/>
							<Text
								style={styles.attendanceText}>Email</Text>
							<View
								style={{
									flex: 3,
								}}/>	
							<Text
								style={styles.paymentsText}>Phone</Text>
							<View
								style={{
									flex: 1,
								}}/>	
							<Text
								style={styles.practicalExamText}>Date removed</Text>
							<View
								style={{
									flex: 0,
								}}/>	
						</View>				
				}

				{res}</View> 
		)	
	}



	getLocalAttendance = (arrAttendance,student_id )=> {

		let attended = 0;
		
		 for (let i = 0; i < arrAttendance.length; i++ )
		 { 
		   if(arrAttendance[i].student_id === student_id)  attended =  arrAttendance[i].attended;
		 }
		 return attended;
	}
	
	getLocalIdAttendance = (arrAttendance,student_id )=> {

		let id = 0;
		
		 for (let i = 0; i < arrAttendance.length; i++ )
		 { 
		   if(arrAttendance[i].student_id === student_id)  id =  arrAttendance[i].id;
		 }
		 return id;
	}


   onChangeSwitchSelector = (arrAttendance,i,idStuden,value) => {

        if(arrAttendance.length == 0)  arrAttendance[i].attended = 0;
		let AttJSON = "";
		for (let i = 0; i < arrAttendance.length; i++ )
		{ 
		  
		  if(arrAttendance[i].student_id === idStuden) { 
			arrAttendance[i].attended = (value?1:0);
			arrAttendance[i].attended_l = value;
		 }
		}
		AttJSON = JSON.stringify(arrAttendance);
	  }	


}

export class ChildElementMakeUpStuden extends React.Component{ 
	
	constructor(props) {
		super(props);
		this.state = {
			dump:0,
			arrStudentAttendance:[],
		};
	}
	practicalToggleSwitch = (value,item) => {
		console.log("En practicalToggleSwitch")
		if( global.clock ===0  || global.shifttype == "info" ){
			Alert.alert(
				'Attention !',
				'You must Clock In before you can set Practical Exam.',
				[
				{text: 'OK', onPress: () => {

					 }
				},
				],
				{cancelable: false},
			   );
			   return;
		}

		 let result = this.onPressExam (item)

		item.practical_exam_switch = value;
		this.forceUpdate();
	};

    attendanceToggleSwitch = (value,attendance,index,student_id,item) => {
		//console.log(item)
		this.props.nav.onSendSingleMakeUpAttendance(student_id,item)
		let result = this.onChangeSwitchSelector(attendance,index, student_id ,value  )
		this.forceUpdate();
		
	  };

	onPressExam = (item) => { 
	
		let exam_value = 0;
		let exam_method = "";
		let objectAtt;
		let response = false;
		let objectUpdatePracticalExam ;
		


	this.props.nav.setState({lastItem:item})
     if(item.practical_exam === null || item.practical_exam === 0  ) {  //Insert Exam
			//exam_value = item.make_up_enrollment_id;

			exam_value = item.makeup_student.latest_enrollment.id;

			exam_method = "POST";
			response = true;
			this.props.nav.setState({visible_mod_ex_result:true})
			objectUpdatePracticalExam = {rating:"",notes:"",city_id:global.city_id  };
			
		}else  //Delete Exam
		{
			exam_value = item.practical_exam;
			exam_method = "DELETE";
			response = false;
		}

		//this.setState({_waiting : true})

		//console.log(item)
		var _url = global.host + '/api/auth/'+ String(exam_value)  +'/practical_exam';
		var _body = JSON.stringify(
				objectUpdatePracticalExam
			);
		fetch(_url, { 
			method: exam_method, 
			headers: {
			   'Accept': 'application/json',
			   'Content-Type': 'application/json', 
			   "cache-control": "no-cache",
			   'Authorization' : global.token_type +  " " + global.access_token
			},
			body: _body
		}).then((response) =>  response.text()) 
			.then((responseData) =>
			{
				  global.logs = ErrorHandler.setMessageResponse( "",_body,responseData,"response","",_url,global.id,global.name ,global.email);

					try {
						this.setState({_waiting : false})
						let responseTXT = responseData;
						let responseJSON = JSON.parse (responseTXT); 


						if(responseJSON['success'] !== undefined) {
								if(responseJSON['success'] === true){   
									this.setState({pe_result_selected:""})
									this.setState({ratingNote:""})
									if(exam_method == "DELETE"){
										item.practical_exam = null;
										item.practical_exam_result = null;
										item.practical_exam_notes = "";
									}else{
										item.practical_exam  = responseJSON["exam_id"];
										item.practical_exam_result = responseJSON["rating"];
										item.practical_exam_notes = responseJSON["notes"];
										objectUpdatePracticalExam = {rating:"",notes:""};
									}

									this.forceUpdate();  // *********
									console.log("retorno makeup practical exam ")
									console.log(item.practical_exam)
									//return response;
									// Cambiar elemento 

									//this.UpdateNotes()
									
								}
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

								this.props.nav.onLoginfailure();
						} 

					} catch (e) {
						console.log(e);
						global.logs = ErrorHandler.setMessageResponseAdd( global.logs,_body,"","error",e.toString(),_url,global.id,global.name ,global.email);
						Alert.alert("Error:", "Problems connecting to the Server. Please try again later.");

					}
	 
			});
			
			return item;
	}
	
	render(){  // Makeup Students
		if(this.props.result){  

			let index = 0;
			
			if (this.props.result.makeup_students.length == 0) {
				return (<Text
				 style={styles.txtNoMakeUpStudentsFoundText}>
					No Makeup Students Found
				</Text>);
			}

			var res = this.props.result.makeup_students.map((item,i)=>{ 
			let _in_progress;
			let attended;
			let enrollment;
			let payments;
			let passed;
			let practical_exam_result_img;
			let practical_exam_result_btn;
			let practical_exam_result_view;
			let practical_exam_result_element;
			


     // *****   Progress 
				if(item.makeup_student.status === "in_progress"){
					_in_progress= 
					 <View  
					    style={styles.viewProgressView}>
					<View
						style={styles.viewRectProgressView}/>
					 <Text
						style={styles.txtProgressText}>In Progress</Text> 
				   </View>;
				}else{
					_in_progress=  <View></View>;
				}
			// *****   Attended 

			 attended = 0;  
			 attended = this.getLocalAttendance(this.props.result.makeUpAttendance,item.student_id);
			 index = this.getLocalIdAttendance(this.props.result.makeUpAttendance,item.student_id);
			// *****   Practical Exam
			switch(item.practical_exam_result) {
				case 'good':
					practical_exam_result_img =  require("./../../assets/images/em_good_.png");							
				  break;
				case 'outstanding':
					practical_exam_result_img =  require("./../../assets/images/em_outstanding_.png");
				  break;
				case 'acceptable':
					practical_exam_result_img =  require("./../../assets/images/em_acceptable_.png");
				  break;

			} 			
		
			practical_exam_result_btn =								
					<TouchableOpacity
					onPress={ () => {this.props.nav.onSetPracticalExamResultPressed(item) }}  
					style={styles.viewBtnPracticalExamEmotionButton}>
					<Image
						source={practical_exam_result_img}
						style={styles.viewBtnDetailsButtonImage}/>
					</TouchableOpacity>	;

			practical_exam_result_view =		
				<View  style={styles.viewBtnPracticalExamEmotionView}>
				</View>	;

			switch(item.practical_exam_result) {
				case 'good':
					practical_exam_result_element =	practical_exam_result_btn;							
				break;
				case 'outstanding':
					practical_exam_result_element =	practical_exam_result_btn;	
				break;
				case 'acceptable':
					practical_exam_result_element =	practical_exam_result_btn;	
				break;
				default:
					practical_exam_result_element = practical_exam_result_view;

			} 

			
			// *****   Practical Exam
			return( 
					  <View key={item.id} >
							<View 
								style={styles.viewRowStudentView}>
								<View
									style={styles.viewLineView}/>
								<Text
									style={styles.txtIndexText}>{index +1}</Text>
								<View
									style={styles.viewStudentView}>
									<Image
										source={require("./../../assets/images/elipse-3-16.png")}
										style={styles.imgAvatarImage}/>
									<View
										pointerEvents="box-none"
										style={{
											width: 151,
											height: 48,
											marginLeft: 15,
											marginTop: 4,
											backgroundColor:"transparent",
											alignItems: "flex-start",
										}}>
									{ item.makeup_student.latest_enrollment.exam_optout_at  && 
											
										<Text  numberOfLines = { 2 } 
											style={[styles.txtStudNameNoExamText,item.makeup_student.name.length + item.makeup_student.last_name.length >18 ? {marginTop:0}:{marginTop:8}]}>{item.makeup_student.name} {item.makeup_student.last_name}</Text>
									}
									{  !item.makeup_student.latest_enrollment.exam_optout_at  && 
											
											<Text  numberOfLines = { 2 } 
												style={styles.txtStudNameText}>{item.makeup_student.name} {item.makeup_student.last_name}</Text>
										}
									{ item.makeup_student.latest_enrollment.exam_optout_at  && 
									
										<Text 
											style={[styles.txtStudExamOptoutText,item.makeup_student.name.length + item.makeup_student.last_name.length >18 ? {marginTop:3}:{marginTop:-13}]}> No Exam </Text>
									}	
									</View>
								</View>
								<Switch
									trackColor={{ false: "#767577", true: "rgba(202, 245, 210)" }}
									thumbColor={this.state._roll ? "green":"rgba(118, 118, 128, 0.22)" }
									ios_backgroundColor="rgba(255, 255, 255)"
									onValueChange={value=>{
										if( global.clock ===0 || global.shifttype == "info" ){
											Alert.alert(
												'Attention !',
												'You must Clock In before you can set Attendance.',
												[
												{text: 'OK', onPress: () => {
								
													 }
												},
												],
												{cancelable: false},
											   );
											   value = ! value ; 
											   return;
										}
										this.attendanceToggleSwitch(value,this.props.result.makeUpAttendance,i, item.student_id,item )
									} } 
									style={styles.swAttendanceSwitch2} 

									value={ this.props.result.makeUpAttendance[i].attended_l }	
								/>	
								<View
								  style={styles.viewRowMUPStudentSpaceView}
								>	
								</View>	
								<Switch
									trackColor={{ false: "#767577", true: "rgba(202, 245, 210)" }}
									thumbColor={this.state._roll ? "green":"rgba(118, 118, 128, 0.22)" }
									ios_backgroundColor="rgba(255, 255, 255)"
									onValueChange={value=>{this.practicalToggleSwitch(value,item )} } 
									style={styles.swPracticalSwitch} 
									value={ (item.practical_exam_switch )  }	
								/>
								<View style={{width: 10,}}/>	
								{practical_exam_result_element}
								<TouchableOpacity
									onPress={ () => {this.props.nav.onDetailMakeUpPressed(item) }}  
									style={styles.viewBtnDetailsButton}>
									<Image
										source={require("./../../assets/images/trazado-44.png")}
										style={styles.viewBtnDetailsButtonImage}/>
								</TouchableOpacity> 
							</View>
					  </View>
				);
			})	
			index ++;
		}
		return ( 
			<View>{res}</View> 
		)	
	}



	getLocalAttendance = (arrAttendance,student_id )=> {

		let attended = 0;
		
		 for (let i = 0; i < arrAttendance.length; i++ )
		 { 
		   if(arrAttendance[i].student_id === student_id)  attended =  arrAttendance[i].attended;
		 }
		 return attended;
	}
	
	getLocalIdAttendance = (arrAttendance,student_id )=> {

		let id = 0;
		
		 for (let i = 0; i < arrAttendance.length; i++ )
		 { 
		   if(arrAttendance[i].student_id === student_id)  id =  arrAttendance[i].id;
		 }
		 return id;
	}


   onChangeSwitchSelector = (arrAttendance,i,idStuden,value) => {

        if(arrAttendance.length == 0)  arrAttendance[i].attended = 0;
		let AttJSON = "";
		for (let i = 0; i < arrAttendance.length; i++ )
		{ 
		  
		  if(arrAttendance[i].student_id === idStuden) { 
			arrAttendance[i].attended = (value?1:0);
			arrAttendance[i].attended_l = value;
		 }
		}
		AttJSON = JSON.stringify(arrAttendance);
	  }	


}

export class ChildElementReturningStuden extends React.Component{ 
	
	constructor(props) {
		super(props);
		this.state = {
			dump:0,
			arrStudentAttendance:[],
		};
	}
	attendanceToggleSwitch = (value,attendance,index,student_id,item) => {
		this.props.nav.onSendSingleAttendance(item)
		let result = this.onChangeSwitchSelector(attendance,index, student_id ,value  )
		this.forceUpdate();
	  };
	render(){
		if(this.props.result){  
			if (this.props.result.returning_students.length == 0) {
				return (<Text
				 style={styles.txtNoMakeUpStudentsFoundText}>
					No Returning Students Found
				</Text>);
			}
            let index = 0;
			var res = this.props.result.returning_students.map((item,i)=>{ 
	
			let _in_progress;
			let attended;
			let enrollment;
			let payments;
			let passed;
						

            // *****   Progress 
				if(item.returning_student.status === "in_progress"){
					_in_progress= 
					 <View  
					    style={styles.viewProgressView}>
					<View
						style={styles.viewRectProgressView}/>
					 <Text
						style={styles.txtProgressText}>In Progress</Text> 
				   </View>;
				}else{
					_in_progress=  <View></View>;
				}
			// *****   Attended 

			 attended = 0; 
		 
			 attended = this.getLocalAttendance(this.props.result.returningAttendance,item.student_id);
			 index = this.getLocalIdAttendance(this.props.result.returningAttendance,item.student_id);

			return( 
					  <View key={item.id} >
							<View 
								style={styles.viewRowStudentView}>
								<View
									style={styles.viewLineView}/>
								<Text
									style={styles.txtIndexText}>{index +1}</Text>
								<View
									style={styles.viewStudentView}>
									<Image
										source={require("./../../assets/images/elipse-3-16.png")}
										style={styles.imgAvatarImage}/>
									<View
										pointerEvents="box-none"
										style={{
											width: 151,
											height: 48,
											marginLeft: 15,
											marginTop: 4,
											backgroundColor:"transparent",
											alignItems: "flex-start",
										}}>
										<Text numberOfLines = { 2 }
											style={styles.txtStudNameText}>{item.returning_student.name} {item.returning_student.last_name}</Text>	
									</View>
								</View>

								<Switch
									trackColor={{ false: "#767577", true: "rgba(202, 245, 210)" }}
									thumbColor={this.state._roll ? "green":"rgba(118, 118, 128, 0.22)" }
									ios_backgroundColor="rgba(255, 255, 255)"
									onValueChange={value=>{
										if( global.clock ===0  || global.shifttype == "info" ){
											Alert.alert(
												'Attention !',
												'You must Clock In before you can set Attendance.',
												[
												{text: 'OK', onPress: () => {
								
													 }
												},
												],
												{cancelable: false},
											   );
											   value = ! value ; 
											   return;
										}
										this.attendanceToggleSwitch(value,this.props.result.returningAttendance,i, item.student_id ,item)
									
									} } 
									style={styles.swAttendanceSwitch2} 

									value={ this.props.result.returningAttendance[i].attended_l }	
								/>

								<View
								  style={styles.viewRowStudentSpaceView}>
								</View>
											
								<TouchableOpacity
									onPress={ () => {this.props.nav.onDetailReturningPressed(item) }}  
									style={styles.viewBtnDetailsButton}>
									<Image
										source={require("./../../assets/images/trazado-44.png")}
										style={styles.viewBtnDetailsButtonImage}/>
								</TouchableOpacity>
							</View>
					  </View>
				)
			})	
			
		}
		return ( 
			<View>{res}</View> 
		)
		index ++;	
	}



	getLocalAttendance = (arrAttendance,student_id )=> {

		let attended = 0;
		
		 for (let i = 0; i < arrAttendance.length; i++ )
		 { 
		   if(arrAttendance[i].student_id === student_id)  attended =  arrAttendance[i].attended;
		 }
		 return attended;
	}
	
	getLocalIdAttendance = (arrAttendance,student_id )=> {

		let id = 0;
		
		 for (let i = 0; i < arrAttendance.length; i++ )
		 { 
		   if(arrAttendance[i].student_id === student_id)  id =  arrAttendance[i].id;
		 }
		 return id;
	}


   onChangeSwitchSelector = (arrAttendance,i,idStuden,value) => {

        if(arrAttendance.length == 0)  arrAttendance[i].attended = 0;
		let AttJSON = "";
		for (let i = 0; i < arrAttendance.length; i++ )
		{ 
			if(arrAttendance[i].student_id === idStuden) { 
				arrAttendance[i].attended = (value?1:0);
				arrAttendance[i].attended_l = value;
			 }
		}
		AttJSON = JSON.stringify(arrAttendance);

	  }	


}


export class ChildElementStuden extends React.Component{ 
	
	constructor(props) {
		super(props);
		this.state = {
			dump:0,
			arrStudentAttendance:[],
			switchValue:true,
			students: [],
			
		};
	}
	
	practicalToggleSwitch = (value,item) => {
		if( global.clock ===0  || global.shifttype == "info" ){
			Alert.alert(
				'Attention !',
				'You must Clock In before you can set Practical Exam.',
				[
				{text: 'OK', onPress: () => {

					 }
				},
				],
				{cancelable: false},
			   );
			   return;
		}
		
		
		let result = this.onPressExam (item)

		item.practical_exam_switch = value;
		this.forceUpdate();
	  };

	attendanceToggleSwitch = (value,attendance,index,student_id,item) => {
		console.log("attendanceToggleSwitch")
		this.props.nav.onSendSingleAttendance(item)
		let result = this.onChangeSwitchSelector(attendance,index, student_id ,value  )
		this.forceUpdate();
	  };

	  componentDidMount() { 
		  global.logs = "";
	  }

	render(){ // Students
		if(this.props.result){  

			var res = this.props.result.students.map((item,i)=>{ 

			var _in_progress;
			let attended;
			let enrollment;
			let payments;
			let passed;
			var index = 0;	
			let practical_exam_result_img;
			let practical_exam_result_btn;
			let practical_exam_result_view;
			let practical_exam_result_element;	 	

            // *****   Progress 
				if(item.student.status === "in_progress"){
					_in_progress= 
					 <View  
					    style={styles.viewProgressView}>
					<View
						style={styles.viewRectProgressView}/>
					 <Text
						style={styles.txtProgressText}>In Progress</Text> 
				   </View>;
				}else{
					_in_progress=  <View></View>;
				}
			// *****   Attended 

			 attended = 0; 		 
			 attended = this.getLocalAttendance(this.props.result.attendance,item.student_id);
 
			 passed = 0;
			 passed = this.getLocalPasedExam(item.student);

			if( item.student.waiver.status  !== undefined &&  item.student.waiver !== null) {
						if(item.student.waiver !== null && item.student.waiver.status === "Completed") {
							enrollment  = 
							<Image
							source={require("./../../assets/images/trazado-42.png")}
							style={styles.imgStatusEnrollDoctsImage}/>;
						}else{

							if(item.student.waiver.reminded_on === null ) {  // created_at
									enrollment  = 
                                    <Image
							         source={require("./../../assets/images/trazado-43-2.png")}
							         style={styles.imgStatusEnrollDoctsImage}/>;
							}else{

								 // created_at
									enrollment  = 
                                    <Image
							         source={require("./../../assets/images/trazado-43-2.png")}
							         style={styles.imgStatusEnrollDoctsImage}/>;

							}

					}
			}else{
				enrollment  = 
				<Image
				source={require("./../../assets/images/trazado-43-2.png")}
				style={styles.imgStatusEnrollDoctsImage}/>;
			} 

			// *****   Payments 
			if(item.student.balance < 0)  {
				payments  = 
				<Image
				    source={require("./../../assets/images/trazado-43-2.png")}
				style={styles.imgStatusPyamentsImage}/>;
			}else{
				payments  = 
					<Image
					source={require("./../../assets/images/trazado-42.png")}
					style={styles.imgStatusPyamentsImage}/>;
			} 
			// *****   Passed 
			// *****   Practical Exam
			
			switch(item.practical_exam_result) {
				case 'good':
					practical_exam_result_img =  require("./../../assets/images/em_good_.png");							
				  break;
				case 'outstanding':
					practical_exam_result_img =  require("./../../assets/images/em_outstanding_.png");
				  break;
				case 'acceptable':
					practical_exam_result_img =  require("./../../assets/images/em_acceptable_.png");
				  break;

			} 

			practical_exam_result_btn =								
					<TouchableOpacity
					onPress={ () => {this.props.nav.onSetPracticalExamResultPressed(item) }}  
					style={styles.viewBtnPracticalExamEmotionButton}>
					<Image
						source={practical_exam_result_img}
						style={styles.viewBtnDetailsButtonImage}/>
					</TouchableOpacity>	;

			practical_exam_result_view =		
				<View  style={styles.viewBtnPracticalExamEmotionView}>
				</View>	;


			switch(item.practical_exam_result) {
				case 'good':
					practical_exam_result_element =	practical_exam_result_btn;							
				  break;
				case 'outstanding':
					practical_exam_result_element =	practical_exam_result_btn;	
				  break;
				case 'acceptable':
					practical_exam_result_element =	practical_exam_result_btn;	
				  break;
				  default:
					practical_exam_result_element = practical_exam_result_view;

			} 

			
			// *****   Practical Exam


			return( 
					  <View key={item.id} >
							<View 
								style={styles.viewRowStudentView}>
								<View
									style={styles.viewLineView}/>
								<Text
									style={styles.txtIndexText}>{i +1}</Text>
								<View
									style={styles.viewStudentView}>
									<Image
										source={require("./../../assets/images/elipse-3-16.png")}
										style={styles.imgAvatarImage}/>
									<View
										pointerEvents="box-none"
										style={{
											width: 151,
											height: 48,
											marginLeft: 15,
											marginTop: 4,
											backgroundColor:"transparent",
											alignItems: "flex-start",
										}}>
									{ item.student.exam_optout_at  &&
										 <Text   numberOfLines = { 2 } 
											style={[styles.txtStudNameNoExamText,item.student.name.length + item.student.last_name.length >18 ? {marginTop:0}:{marginTop:8}]}>{item.student.name} {item.student.last_name}</Text>
									
									}
									{  ! item.student.exam_optout_at  &&
										<Text   numberOfLines = { 2 } 
											style={styles.txtStudNameText}>{item.student.name} {item.student.last_name}</Text>

									}	
									{ item.student.exam_optout_at  &&
									
										<Text 
											style={[styles.txtStudExamOptoutText,item.student.name.length + item.student.last_name.length >18 ? {marginTop:3}:{marginTop:-13}]}> No Exam  </Text>
									}			
									</View>
								</View>


								<Switch
									trackColor={{ false: "#767577", true: "rgba(202, 245, 210)" }}
									thumbColor={this.state._roll ? "green":"rgba(118, 118, 128, 0.22)" }
									ios_backgroundColor="rgba(255, 255, 255)"
									onValueChange={value=>{
										if( global.clock ===0  || global.shifttype == "info" ){
											Alert.alert(
												'Attention !',
												'You must Clock In before you can set Attendance.',
												[
												{text: 'OK', onPress: () => {
								
													 }
												},
												],
												{cancelable: false},
											   );
											   value = ! value ; 
											   return;
										}	
										
										this.attendanceToggleSwitch(value,this.props.result.attendance,i, item.student_id,item )
									
									} } 
									style={styles.swAttendanceSwitch2} 

									value={ this.props.result.attendance[i].attended_l }	
								/>						
								<View>
									{enrollment}
								</View>
								<View>
									{payments}
								</View>	
								


								<Switch
									trackColor={{ false: "#767577", true: "rgba(202, 245, 210)" }}
									thumbColor={this.state._roll ? "green":"rgba(118, 118, 128, 0.22)" }
									ios_backgroundColor="rgba(255, 255, 255)"
									onValueChange={value=>{this.practicalToggleSwitch(value,item )} } 
									style={styles.swPracticalSwitch} 
									value={ (item.practical_exam_switch )  }	
								/>		
								{practical_exam_result_element}
								<TouchableOpacity
									onPress={ () => {this.props.nav.onDetailStudentPressed(item) }}  
									style={styles.viewBtnDetailsButton}>
									<Image
										source={require("./../../assets/images/trazado-44.png")}
										style={styles.viewBtnDetailsButtonImage}/>
								</TouchableOpacity>
							</View>
		
					  </View>

				)

			})	
			
		}
		return ( 
			<View>{res}</View> 
		)
		index ++;	
	}

	onSendWaiversPressed =  (enrollment_id) => {

		let objectAtt;
		var response;
		console.log("En onSendWaiversPressed: " +  global.host + '/api/docusign/send_waiver/'+ String(enrollment_id));
		this.setState({_waiting : true})
		var  _url = global.host + '/api/docusign/send_waiver/'+ String(enrollment_id);
		
		fetch(  _url, { 
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
						
						this.setState({_waiting : false})
						let responseTXT = responseData;
						let responseJSON = JSON.parse (responseTXT); 


						if(responseJSON['success'] !== undefined) {
								if(responseJSON['success'] === true){   
									console.log("Success");
									console.log(enrollment_id);
		                         this.props.nav.getIniData();
									
								}else{
									console.log("Error");
								}
						}  else{
							console.log("Error 2");
							//console.log(responseJSON);
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

					} catch (e) {
						console.log(e);
						global.logs = ErrorHandler.setMessageResponseAdd( global.logs,"","","error",e.toString(),_url,global.id,global.name ,global.email);

						Alert.alert("Error:", "Problems connecting to the Server. Please try again later.");

					}
	 
			});
			return response;		
		
	}
	
	onPressExam = (item) => { 
	
		let exam_value = 0;
		let exam_method = "";
		let objectAtt;
		let response = false;
		let objectUpdatePracticalExam ;

		this.props.nav.setState({lastItem:item})
		if(item.practical_exam === null || item.practical_exam === 0) {  //Insert Exam Student
		
			exam_value = item.student.enrollment_id;
			exam_method = "POST";
			response = true;
			
			this.props.nav.setState({visible_mod_ex_result:true})
			objectUpdatePracticalExam = {rating:"",notes:"",city_id:global.city_id };
		}else  //Delete Exam
		{
			exam_value = item.practical_exam;
			exam_method = "DELETE";
			response = false;
		}


		//this.setState({_waiting : true})
		var _url =global.host + '/api/auth/'+ String(exam_value)  +'/practical_exam' ;
		var _body = JSON.stringify(
				objectUpdatePracticalExam
			);
 		fetch(_url, { 
			method: exam_method, 
			headers: {
			   'Accept': 'application/json',
			   'Content-Type': 'application/json', 
			   "cache-control": "no-cache",
			   'Authorization' : global.token_type +  " " + global.access_token
			},
			body: _body
		}).then((response) =>  response.text()) 
			.then((responseData) =>
			{
				 global.logs = ErrorHandler.setMessageResponse( "",_body,responseData,"response","",_url,global.id,global.name ,global.email);
	  
					try {
						this.setState({_waiting : false})
						let responseTXT = responseData;
						let responseJSON = JSON.parse (responseTXT); 


						if(responseJSON['success'] !== undefined) {
								if(responseJSON['success'] === true){   
									this.setState({pe_result_selected:""})
									this.setState({ratingNote:""})
									if(exam_method == "DELETE"){
										item.practical_exam = null;
										item.practical_exam_result = null;
										item.practical_exam_notes = "";
									}else{
										item.practical_exam  = responseJSON["exam_id"];
										item.practical_exam_result = responseJSON["rating"];
										item.practical_exam_notes = responseJSON["notes"];
									}
									this.forceUpdate();  // *********
									console.log("llegando de API")
									console.log(item.practical_exam)
									//return response;
									// Cambiar elemento 

									//this.UpdateNotes()
									
								}
						}  
						
						if(responseJSON['message'] !== undefined && responseJSON['message']  === "Unauthenticated.") {
								Alert.alert(
									'Attention !',
									'Your session expired. Please login again,',
									[
									{text: 'OK', onPress: () => console.log('OK Pressed')},
									],
									{cancelable: false},
								);
                                this.props.nav.setState({visible_mod_ex_result:false})
								this.props.nav.onLoginfailure(); //xxx 
						}

					} catch (e) {
						console.log(e);
						global.logs = ErrorHandler.setMessageResponseAdd( global.logs,"","","error",e.toString(),_url,global.id,global.name ,global.email);
	
						Alert.alert("Error:", "Problems connecting to the Server. Please try again later.");

					}
	 
			});
			
			return item;
	}


	getLocalAttendance = (arrAttendance,student_id )=> {

		let attended = 0;
		
		 for (let i = 0; i < arrAttendance.length; i++ )
		 { 
		   if(arrAttendance[i].student_id === student_id)  attended =  arrAttendance[i].attended;
		 }
		 return attended;
	}
 
	getLocalPasedExam = (item)=> {

		let exam = 0;

		if(item.practical_exam   && item.practical_exam.approved_by != 0)  {
           exam = 1;
		}
		
		return exam;
	}

   onChangeSwitchSelector = (arrAttendance,i,idStuden,value) => {

        if(arrAttendance.length == 0)  arrAttendance[i].attended = 0;
		let AttJSON = "";
		for (let i = 0; i < arrAttendance.length; i++ )
		{ 
		  if(arrAttendance[i].student_id === idStuden) { 
			   arrAttendance[i].attended = (value?1:0);
			   arrAttendance[i].attended_l = value;
			}
		}
		AttJSON = JSON.stringify(arrAttendance);
		
	  }	 

  
}



const options = [
	{ label: '', value: 0 , activeColor:'red'},
	{ label: '', value: 1, activeColor:'green' }
];
const optionsExam = [
	{ label: '', value: 0 , activeColor:'red'},
	{ label: 'Passed', value: 1 , activeColor:'green'}
];
const styles = StyleSheet.create({
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
	viewPracticalExamOptionFaces: {
		backgroundColor: "transparent",
		borderWidth: 1,
		borderColor: "transparent",
		borderStyle: "solid",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		width: "90%",
		height: 80,
		marginTop: 20,
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
	txtStudEmailText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 13,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		left:5,
		width: 230,
		height:39,
		marginTop: 15,
	},
	txtStudBalanceText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		left:0,
		width: 100,
		height:39,
		marginTop: 15,
	},	
	txtStudNoteText	: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		left:10,
		width: 130,
		height:53,
		marginTop: 15,
	},	
    FlexGrowOne: {
        flexGrow : 1
    },
    FlexOne: {
        flex : 1
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
		alignSelf: "flex-end",
		width: 113,
		height: 33, 
	    position: "absolute",
		marginRight: 23,
		top: 82,
		right:8,
		zIndex: 2,
	},
	
	btnbackButtonText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
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
	containerLocal: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		
	  },
	  overlay:{
		backgroundColor:"#00000070",
		height:"100%",
		width:"100%",
		justifyContent:"center",
		alignItems:"center"
	  },
	  heading1:{
		color:"#fff",
		fontWeight:"bold",
		fontSize:30,
		margin:20
	  },
	  heading2:{
		color:"#fff",
		margin:5,
		fontWeight:"bold",
		fontSize:15
	  },
	  heading3:{
		color:"#fff",
		margin:5
	  },



	mapContainer: {
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	  },
	  mapStyle: {
		top:0,
		width: 480,//Dimensions.get('window').width,
		height: 270,//Dimensions.get('window').height,
		position: "absolute",
	  },

	containerStudents: {
		backgroundColor: "transparent",
	},
    imgIconLocation: {
		resizeMode: "contain",
		backgroundColor: "transparent",
		width: 18,
		height: 26,
		//marginTop: 9,
		right:8,
	},
	locationButton: {
		backgroundColor: "#0A60FE",
		borderRadius: 25,
		shadowColor: "rgba(255, 45, 102, 0.72)",
		shadowRadius: 3,
		shadowOpacity: .5,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		alignSelf:"center",
		padding: 0,
		height: 40,
		width :193,
	},
	updateLocationButton: {
		top: 295,
		backgroundColor: "#0A60FE",
		borderRadius: 25,
		shadowColor: "rgba(255, 45, 102, 0.72)",
		shadowRadius: 3,
		shadowOpacity: .5,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		alignSelf:"center",
		padding: 0,
		height: 40,
		width :210,
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
	ClockInLocationText: {
		backgroundColor: "transparent",
		height: 42,
		alignItems: "center",
		
	},
	PtacticalExamTitleText: {
		backgroundColor: "#8B1936",
        width : 450,
		height: 52,
		top: -26,
		alignItems: "center",
		
	},	
	viewModalConten: {
		backgroundColor: "transparent",
		alignItems: "center",
		width: 520,
		zIndex: 1, 
		
	},
	viewModalContenMaps: {
		backgroundColor: "transparent",
		alignItems: "center",
		width: 520,
		height: 700,
	},
	viewModalPracticalExam: {
		backgroundColor: "transparent",
		alignItems: "center",
		width: 420,
		height: 400,
	},
	viewButtoPracticalExam: {
		backgroundColor: "transparent",
		alignItems: "center",
		//width: 420,
		//height: 300,
	},	
	txtPopUpClockInText: {
		backgroundColor: "transparent",
		color: "#8B1936",
		fontFamily: "Montserrat-Bold",
		fontSize: 20,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 23,
	},
	txtPopUpPracticalExamTitleText: {
		backgroundColor: "transparent",
		color: "#FFFFFF",
		fontFamily: "Montserrat-Bold",
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
		top: 12,
	},	
	txtPopUpNotClassRoomText: {
		backgroundColor: "transparent",
		color: "black",
		fontFamily: "Montserrat-Regular",
		fontSize: 11,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "center",
		top: 300,
		marginBottom: 1,
		padding: 10,
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
	viewPopUpLineView: {
		backgroundColor: "rgb(184, 184, 184)",
		flex: 1,
		height: 1,
		marginTop: 25,
		width: 660,
		position: "absolute",	
	},

	viewPopUpLinePracticalExamView: {
		backgroundColor: "rgb(184, 184, 184)",
		flex: 1,
		height: 1,
		marginTop: 35,
		width: 660,
		position: "absolute",	
	},	
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 10,
		padding: 25,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
		  width: 0,
		  height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		
	  },
	  openButton: {
		top:25,
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
	  openButtonMaps: {
		top:280,
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
	    closeButton: {
		top:30,
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
		shadowRadius: 12,
		marginBottom:50,
		
	  },
	  textPracticalExamNormalStyle: {
		color: "#000000",
		//fontWeight: "bold",
		textAlign: "center",
		fontFamily: "Montserrat-Regular",
		fontSize: 17,
		fontStyle: "normal",
		fontWeight: "normal",
	  },
	  textPracticalExamSelectStyle: {
		color: "#8B1936",
		fontFamily: "Montserrat-Bold",
		fontSize: 17,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center"
	  },	  
	  textStyle: {
		color: "#8B1936",
		fontWeight: "bold",
		textAlign: "center"
	  },
	  textLocationStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center"
	  },	  
	  textStyleClose: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center"
	  },
	  modalText: {
		marginBottom: 15,
		textAlign: "center"
	  },

	conteiner:{
		marginLeft: -690,
		width: 750,
	},
	animatedContainer:{
		marginTop: 0,
		height: 25,
		width: 635,
	},	
	animatedContainerClockIn:{
		marginTop: 0,
		height: 25,
		width: 635,
	},
	conteinerClockIn:{
		marginLeft: -690,
		width: 750,
	},
	imgBkgWhiteImage: {
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

	viewBandViewContainerReport: {
		backgroundColor: "transparent",
	    left: 0,
		right: 0,
		height: 60,
		alignItems: "flex-start",
		opacity: 1,
		position: "absolute",
		zIndex:1,
	},
	viewBandViewContainer: {
		backgroundColor: "transparent",
		left: 0,
		right: 0,
		top: 69,
		height: 60,
		alignItems: "flex-start",
		opacity: 1,
		position: "absolute",
		zIndex:1,
		shadowColor: "rgba(0, 0, 10, 8)",
		shadowRadius: 4,
		shadowOpacity: 0.1,
	},

	viewReportBandViewContainer: {
		backgroundColor: "transparent",
		left: 0,
		right: 0,
		top: 69 + 60,
		height: 60,
		alignItems: "flex-start",
		opacity: 1,
		position: "absolute",
		zIndex:1,
		shadowColor: "rgba(0, 0, 10, 8)",
		shadowRadius: 4,
		shadowOpacity: 0.1,
	},

	viewBandView: {
		backgroundColor: "transparent",
		left: 0,
		right: 0,
		top: -3,
		//height: 66,
		flexDirection: "row",
		alignItems: "flex-start",
		opacity: 1,
		flex: 1,
		position: "absolute",
		//marginBottom: 15,
		justifyContent: 'space-between',
	},
	clockButton: {
		flex: 1,
	},
	viewClockInTimeView	: {
		backgroundColor: "transparent",
		width: 120,
		height: 48,
		marginTop: 16,
		alignItems: "center",
	},
	txtClockInTimeText: {
		backgroundColor: "transparent",
		color: "black",
		fontFamily: "Montserrat-Bold",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",

	},
	viewClockOutView: {
		backgroundColor: "rgb(64, 1, 16)",
		borderRadius: 20,
		shadowColor: "rgba(0, 0, 0, 00.16)",
		shadowRadius: 12,
		shadowOpacity: 1,
		width: 200,
		height: 48,
		marginTop: 11,
		flexDirection: "row",
		alignItems: "center",
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
	imgClockOutImage: {
		resizeMode: "contain",
		backgroundColor: "transparent",
		width: 26,
		height: 26,
		marginRight: 15,
	},
	imgArrowBackImage: {
		resizeMode: "contain",
		backgroundColor: "transparent",
		marginTop:23,
		width: 26,
		height: 26,
		marginLeft : 15,
	},
	imgArrowShowImage: {
		resizeMode: "contain",
		backgroundColor: "transparent",
		marginTop:20,
		width: 26,
		height: 26,
		marginRight : 20,
	},
	imgArrowShowImage180: {
		resizeMode: "contain",
		backgroundColor: "transparent",
		marginTop:20,
		width: 26,
		height: 26,
		marginRight : 20,
		transform: [{ rotate: '180deg' }],
	},	
	viewClockOutLunchView: {
		backgroundColor: "rgb(140, 132, 14)",
		borderRadius: 20,
		shadowColor: "rgba(0, 0, 0, 00.16)",
		shadowRadius: 12,
		shadowOpacity: 1,
		width: 277,
		height: 48,
		marginTop: 11,
		flexDirection: "row",
		alignItems: "center",
	},
	txtClockOutLunchText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		marginLeft: 15,
	},
	imgClockOutLunchImage: {
		backgroundColor: "transparent",
		resizeMode: "contain",
		width: 26,
		height: 26,
		marginRight: 12,
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
	txtClockInLocationText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
		top:10,
		backgroundColor: "transparent",
		//marginLeft: 21,
	},	
	imgClockInImage: {
		backgroundColor: "transparent",
		resizeMode: "contain",
		width: 26,
		height: 26,
		marginRight: 19,
	},
	txtInstructorNameText: {
		color: "white",
		fontFamily: "SegoeUI",
		fontSize: 17,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "right",
		backgroundColor: "transparent",
		width: 155,
		marginRight: 8,
		marginTop: 18,
	},	
	imgIconInstructorImage: {
		resizeMode: "cover",
		backgroundColor: "transparent",
		width: 18,
		height: 26,
		marginTop: 9,
		right: -8,
	},	
	tab2FourButtonText: {
		color: "rgb(153, 153, 153)",
		fontFamily: "SFProText-Regular",
		fontSize: 13,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
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
	tab2ThreeButtonText: {
		color: "white",
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
	tabBarIpadRegTwoView: {
		backgroundColor: "rgba(36, 36, 36, 1)",
		shadowColor: "rgba(0, 0, 0, 0.3)",
		shadowRadius: 0,
		shadowOpacity: 1,
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
		height: 60,
		flexDirection: "row",
		alignItems: "center",
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
		height: 61,
		justifyContent: 'space-between',
	},
	viewView: {
		backgroundColor: "rgb(239, 239, 244)",//"#C0C0C0", //
		flex: 1,
		paddingBottom:0,
	},
	viewViewInfo: {
		backgroundColor: "rgb(193, 193, 193)",
		flex: 1,
		paddingBottom:0,
	},
	viewHeaderView: {
		backgroundColor: "rgb(36, 36, 36)",
		height: 69,
	},
	grupo290Image: {
		backgroundColor: "transparent",
		resizeMode: "cover",
		width: 190,
		height: 34,
	},
	viewUserView: {
		backgroundColor: "transparent",
		width: 218,
		height: 33,
		marginTop: 6,
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "flex-start",
	},
	jenniferAneHoffmanText: {
		color: "white",
		fontFamily: "SegoeUI",
		fontSize: 20,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		marginRight: 8,
		marginTop: 6,
	},
	grupo291Image: {
		backgroundColor: "transparent",
		resizeMode: "center",
		width: 18,
		height: 26,
	},
	viewCol1View: {
		backgroundColor: "transparent",
		width: 102,
		height: 41,
		alignItems: "flex-start",
	},
	txtCityText: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		width: 110,
	},
	txtClassText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
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
	txtProgramText: {
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
	txtDateText: {
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
	viewTimeView: {
		backgroundColor: "transparent",
		width: 82,
		height: 18,
		marginTop: 2,
		flexDirection: "row",
		alignItems: "center",
		left:-18,
	},
	imgIconTimeImage: {
		backgroundColor: "transparent",
		resizeMode: "contain",
		width: 15, 
		height: 15,
	},
	txtTimeText: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		left: 4,
		width: 70,
	},
	viewTitlesView: {
		backgroundColor: "transparent",
		alignSelf: "flex-end",
		justifyContent: 'space-between',
		width: 671,
		height: 55,
		marginRight: 23,
		marginTop: 57,
		flexDirection: "row",
		alignItems: "flex-end",
	},
	viewTitlesRemovView: {
		backgroundColor: "transparent",
		alignSelf: "flex-end",
		justifyContent: 'space-between',
		width: 671,
		height: 35,
		marginRight: 23,
		marginTop: 5,
		flexDirection: "row",
		alignItems: "flex-end",
	},	
	studentText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		marginLeft: 61,
	},
	attendanceText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		marginLeft: 21,
	},
	enrollmentDocumentsText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
		backgroundColor: "transparent",
		marginLeft: 0,
	},
	paymentsText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
	},
	practicalExamText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
		backgroundColor: "transparent",
	},
	detailsText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
		backgroundColor: "transparent",
	},
	viewRowStudentView: {
		backgroundColor: "transparent",
		height: 69,
		marginLeft: 17,
		marginRight: 18,
		marginTop: 10,
		flexDirection: "row",
		alignItems: "flex-start",
		justifyContent: 'space-between',
		
	},
	viewRowStudentSpaceView: {
		backgroundColor: "transparent",
		height: 64,
		marginTop: 10,
		width: 315,
	},
	viewRowMUPStudentSpaceView: {
		backgroundColor: "transparent",
		height: 64,
		marginTop: 10,
		width: 150,
	},
	viewLineView: {
		backgroundColor: "rgb(184, 184, 184)",
		flex: 1,
		height: 1,
		marginTop: 67,
		width: 730,
		position: "absolute",
		
	},
	txtNoMakeUpStudentsFoundText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		marginTop: 1,
		left: 30,
	},
	txtIndexText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		marginTop: 16,
	},
	txtIndexRemoveText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "center",
		marginTop: 16,
		left: -5,
	},	
	viewStudentView: {
		backgroundColor: "transparent",
		width: 203,
		height: 52,
		marginLeft: -3,
		flexDirection: "row",
		alignItems: "flex-start",
	},
	imgAvatarImage: {
		resizeMode: "cover",
		backgroundColor: "transparent",
		width: 52,
		height: 52,
	},
	txtStudExamOptoutText:{  
		backgroundColor: "#FD9A08",
	    color: "rgb(255, 255, 39)",
		width: 80,
		fontFamily: "Montserrat-Regular",
		fontSize: 12,
		textAlign: "center",
		height:18,
		// marginTop: 3 ,
		left: 3,
		paddingBottom: 2,
        borderRadius: 10
	},
	txtStudNameText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		left:0,
		width: 150,
		height:36,
		marginTop: 15,		
	},
	txtStudNameNoExamText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		left:0,
		width: 150,
		height:36,
		marginTop: 8,		
	},	
	txtStudNameRemovedText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		left:0,
		width: 145,
		height:36,
		marginTop: 8,
	},	
	viewProgressView: {
		backgroundColor: "transparent",
		width: 103,
		height: 24,
		marginTop: 5,
	},
	viewRectProgressView: {
		backgroundColor: "rgb(142, 217, 61)",
		borderRadius: 4,
		position: "absolute",
		left: 0,
		width: 103,
		top: 0,
		height: 24,
	},
	txtProgressText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		position: "absolute",
		left: 17,
		top: 5,
	},
	swAttendanceSwitch: {
		backgroundColor: "transparent",
		borderRadius: 9.2,
		borderWidth: 1,
		borderColor: "rgb(153, 153, 153)",
		borderStyle: "solid",
		width: 51,
		height: 31,
		marginLeft: -10,
		marginTop: 25,
	},
	swAttendanceSwitchNew: {
		backgroundColor: "transparent",
		borderStyle: "solid",
		width: 110,
		height: 21,
		marginLeft: -10,
		marginTop: 20,
	},
	swAttendanceSwitch2: {
		backgroundColor: "transparent",
		borderStyle: "solid",
		width: 110,
		height: 21,
		left: 15,
		marginTop: 20,
	},
	swPracticalSwitch: {
		backgroundColor: "transparent",
		borderStyle: "solid",
		width: 60,
		height: 21,
		left: 20,
		marginTop: 25,
	},	
	swPassedSwitchNew: {
		backgroundColor: "transparent",
		borderStyle: "solid",
		width: 100,
		height: 21,
		marginLeft: 10,
		marginTop: 20,

	},
	imgStatusEnrollDoctsImage: {
		resizeMode: "contain",
		backgroundColor: "transparent",
		width: 33,
		height: 33,
		marginLeft: 5,
		marginRight: 33,
		marginTop: 25,
	},
	imgStatusPyamentsImage: {
		resizeMode: "contain",
		backgroundColor: "transparent",
		width: 33,
		height: 33,
		marginLeft: 10,
		marginTop: 25,

	},
	viewStatusPassedView: {
		backgroundColor: "transparent",
		width: 77,
		height: 24,
		marginLeft: 18,
		marginTop: 30,
	},
	viewRectStatusPassedView: {
		backgroundColor: "white",
		borderRadius: 12,
		shadowColor: "rgba(0, 0, 0, 0.2)",
		shadowRadius: 6,
		shadowOpacity: 1,
		position: "absolute",
		right: 0,
		width: 77,
		top: 0,
		height: 24,
	},
	viewRectStatusNoPassedView: {
		backgroundColor: "gray",
		borderRadius: 12,
		shadowColor: "rgba(0, 0, 0, 0.2)",
		shadowRadius: 6,
		shadowOpacity: 1,
		position: "absolute",
		right: 0,
		width: 77,
		top: 0,
		height: 24,
	},	
	txtStatusPassedText: {
		color: "rgb(139, 25, 54)",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		position: "absolute",
		right: 16,
		top: 5,
	},
	txtStatusNoPassedText: {
		color: "rgb(139, 25, 54)",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
		backgroundColor: "transparent",
		//position: "absolute",
		//right: 16,
		top: 5,
	},	
	viewBtnDetailsButton: {
		backgroundColor: "rgb(139, 25, 54)",
		borderRadius: 12,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		width: 48,
		height: 24,
		marginLeft: 11,
		marginTop: 30,
	},
	viewBtnPracticalExamEmotionButton: {
		backgroundColor: "transparent",
		borderRadius: 12,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		width: 30,
		height: 24,
		marginLeft: 11,
		marginTop: 30,
	},	
	viewBtnPracticalExamEmotionView: {
	backgroundColor: "transparent",
	borderRadius: 12,
	flexDirection: "row",
	alignItems: "center",
	justifyContent: "center",
	padding: 0,
	width: 30,
	height: 24,
	marginLeft: 11,
	marginTop: 30,
    },
	viewBtnDetailsButtonImage: {
		resizeMode: "contain",
	},
	viewRowStudent2View: {
		backgroundColor: "transparent",
		height: 64,
		marginLeft: 17,
		marginRight: 19,
		marginTop: 8,
		flexDirection: "row",
		alignItems: "flex-start",
	},
	viewLineTwoView: {
		backgroundColor: "rgb(184, 184, 184)",
		flex: 1,
		height: 1,
		marginTop: 63,
	},
	txtIndexTwoText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "center",
		marginTop: 16,
	},
	viewStudentTwoView: {
		backgroundColor: "transparent",
		width: 203,
		height: 52,
		marginLeft: 58,
		flexDirection: "row",
		alignItems: "flex-start",
	},
	imgAvatarTwoImage: {
		resizeMode: "center",
		backgroundColor: "transparent",
		width: 52,
		height: 52,
	},
	txtStudNameTwoText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 137,
	},
	viewProgressTwoView: {
		backgroundColor: "transparent",
		width: 103,
		height: 24,
		marginTop: 5,
	},
	viewRectProgressTwoView: {
		backgroundColor: "rgb(142, 217, 61)",
		borderRadius: 4,
		position: "absolute",
		left: 0,
		width: 103,
		top: 0,
		height: 24,
	},
	txtProgressTwoText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		position: "absolute",
		left: 17,
		top: 5,
	},
	swAttendanceTwoSwitch: {
		backgroundColor: "transparent",
		borderRadius: 9.2,
		borderWidth: 1,
		borderColor: "rgb(153, 153, 153)",
		borderStyle: "solid",
		width: 51,
		height: 31,
		marginLeft: 49,
		marginTop: 15,
	},
	viewSentView: {
		backgroundColor: "transparent",
		width: 131,
		height: 64,
		marginRight: 0,
		marginLeft: 0,
		marginTop:10,
		alignItems: "flex-end",
	},
	viewReSentView: {
		backgroundColor: "transparent",
		width: 131,
		height: 64,
		marginRight: 0,
		marginLeft: 0,
		alignItems: "flex-end",
	},
	txtSend2linesText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "center",
		width: 111,
	},
	btnResendButton: {
		backgroundColor: "white",
		borderRadius: 12,
		shadowColor: "rgba(0, 0, 0, 0.2)",
		shadowRadius: 6,
		shadowOpacity: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		width: 111,
		height: 24,
		marginTop: 4,
	},
	btnResendButtonText: {
		color: "rgb(139, 25, 54)",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
	},
	btnResendButtonImage: {
		resizeMode: "contain",
		marginRight: 10,
	},
	imgStatusPyamentsTwoImage: {
		resizeMode: "contain",
		backgroundColor: "transparent",
		width: 33,
		height: 33,
		marginRight: 55,
		marginTop: 15,
	},
	viewStatusPassedTwoView: {
		backgroundColor: "transparent",
		width: 77,
		height: 24,
		marginRight: 28,
		marginTop: 22,
	},
	viewRectStatusPassedTwoView: {
		backgroundColor: "white",
		borderRadius: 12,
		shadowColor: "rgba(0, 0, 0, 0.2)",
		shadowRadius: 6,
		shadowOpacity: 1,
		position: "absolute",
		right: 0,
		width: 77,
		top: 0,
		height: 24,
	},
	txtStatusPassedTwoText: {
		color: "rgb(139, 25, 54)",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		position: "absolute",
		right: 16,
		top: 5,
	},
	viewBtnDetailsTwoButtonImage: {
		resizeMode: "contain",
	},
	viewBtnDetailsTwoButton: {
		backgroundColor: "rgb(139, 25, 54)",
		borderRadius: 12,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		width: 48,
		height: 24,
		marginRight: 11,
		marginTop: 22,
	},
	viewRowStudent3View: {
		backgroundColor: "transparent",
		height: 73,
		marginLeft: 17,
		marginRight: 19,
		marginTop: 8,
		flexDirection: "row",
		alignItems: "flex-start",
	},
	viewLineThreeView: {
		backgroundColor: "rgb(184, 184, 184)",
		flex: 1,
		height: 1,
		marginTop: 70,
	},
	txtIndexThreeText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "center",
		marginTop: 16,
	},
	viewStudentThreeView: {
		backgroundColor: "transparent",
		width: 203,
		height: 52,
		marginLeft: 58,
		flexDirection: "row",
		alignItems: "flex-start",
	},
	imgAvatarThreeImage: {
		resizeMode: "center",
		backgroundColor: "transparent",
		width: 52,
		height: 52,
	},
	txtStudNameThreeText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 137,
	},
	viewProgressThreeView: {
		backgroundColor: "transparent",
		width: 103,
		height: 24,
		marginTop: 5,
	},
	viewRectProgressThreeView: {
		backgroundColor: "rgb(142, 217, 61)",
		borderRadius: 4,
		position: "absolute",
		left: 0,
		width: 103,
		top: 0,
		height: 24,
	},
	txtProgressThreeText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		position: "absolute",
		left: 17,
		top: 5,
	},
	swAttendanceThreeSwitch: {
		backgroundColor: "transparent",
		borderRadius: 9.2,
		borderWidth: 1,
		borderColor: "rgb(153, 153, 153)",
		borderStyle: "solid",
		width: 51,
		height: 31,
		marginLeft: 49,
		marginTop: 15,
	},
	viewSentTwoView: {
		backgroundColor: "transparent",
		width: 111,
		height: 64,
		marginRight: 27,
		alignItems: "flex-end",
	},
	txtSend2linesTwoText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "center",
		width: 95,
		marginRight: 10,
	},
	btnSentButtonText: {
		color: "rgb(139, 25, 54)",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
	},
	btnSentButton: {
		backgroundColor: "white",
		borderRadius: 12,
		shadowColor: "rgba(0, 0, 0, 0.2)",
		shadowRadius: 6,
		shadowOpacity: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		width: 94,
		height: 24,
		marginRight: 10,
		marginTop: 3,
	},
	btnSentButtonImage: {
		resizeMode: "contain",
		marginRight: 10,
	},
	imgStatusPyamentsThreeImage: {
		resizeMode: "contain",
		backgroundColor: "transparent",
		width: 33,
		height: 33,
		marginRight: 55,
		marginTop: 15,
	},
	viewStatusPassedThreeView: {
		backgroundColor: "transparent",
		width: 77,
		height: 24,
		marginRight: 28,
		marginTop: 22,
	},
	viewRectStatusPassedThreeView: {
		backgroundColor: "white",
		borderRadius: 12,
		shadowColor: "rgba(0, 0, 0, 0.2)",
		shadowRadius: 6,
		shadowOpacity: 1,
		position: "absolute",
		right: 0,
		width: 77,
		top: 0,
		height: 24,
	},
	txtStatusPassedThreeText: {
		backgroundColor: "transparent",
		color: "rgb(139, 25, 54)",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		position: "absolute",
		right: 16,
		top: 5,
	},

	viewBtnDetailsThreeButton: {
		backgroundColor: "rgb(139, 25, 54)",
		borderRadius: 12,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		width: 48,
		height: 24,
		marginRight: 11,
		marginTop: 22,
	},
	viewBtnDetailsThreeButtonImage: {
		resizeMode: "contain",
	},
	viewTitleRemoveStudentsView: {
		backgroundColor: "transparent",
		alignSelf: "flex-start",
		width: 223,
		height: 19,
		marginLeft: 18,
		marginTop: 29,
		marginBottom : 25,
		alignItems: "flex-start",
	},	
	viewTitleMakeupStudentsView: {
		backgroundColor: "transparent",
		alignSelf: "flex-start",
		width: 223,
		height: 19,
		marginLeft: 18,
		marginTop: 29,
		marginBottom : 25,
		alignItems: "flex-start",
	},
	makeUpStudentsText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
	},
	viewRowStudentMakeupView: {
		backgroundColor: "transparent",
		height: 64,
		marginLeft: 17,
		marginRight: 19,
		marginTop: 15,
		flexDirection: "row",
		alignItems: "flex-start",
	},
	viewLineFourView: {
		backgroundColor: "rgb(184, 184, 184)",
		flex: 1,
		height: 1,
		marginTop: 63,
	},
	txtIndexFourText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "center",
		marginTop: 16,
	},
	viewStudentFourView: {
		backgroundColor: "transparent",
		width: 203,
		height: 52,
		marginLeft: 58,
		flexDirection: "row",
		alignItems: "flex-start",
	},
	imgAvatarFourImage: {
		resizeMode: "center",
		backgroundColor: "transparent",
		width: 52,
		height: 52,
	},
	txtStudNameFourText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 137,
	},
	viewProgressFourView: {
		backgroundColor: "transparent",
		width: 103,
		height: 24,
		marginTop: 5,
	},
	viewRectProgressFourView: {
		backgroundColor: "rgb(142, 217, 61)",
		borderRadius: 4,
		position: "absolute",
		left: 0,
		width: 103,
		top: 0,
		height: 24,
	},
	txtProgressFourText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		position: "absolute",
		left: 17,
		top: 5,
	},
	swAttendanceFourSwitch: {
		backgroundColor: "transparent",
		borderRadius: 9.2,
		borderWidth: 1,
		borderColor: "rgb(153, 153, 153)",
		borderStyle: "solid",
		width: 51,
		height: 31,
		marginLeft: 49,
		marginTop: 15,
	},
	imgStatusEnrollDoctsTwoImage: {
		backgroundColor: "transparent",
		resizeMode: "contain",
		width: 33,
		height: 33,
		marginRight: 63,
		marginTop: 15,
	},
	imgStatusPyamentsFourImage: {
		backgroundColor: "transparent",
		resizeMode: "contain",
		width: 33,
		height: 33,
		marginRight: 55,
		marginTop: 15,
	},
	viewStatusPassedFourView: {
		backgroundColor: "transparent",
		width: 77,
		height: 24,
		marginRight: 28,
		marginTop: 22,
	},
	viewRectStatusPassedFourView: {
		backgroundColor: "white",
		borderRadius: 12,
		shadowColor: "rgba(0, 0, 0, 0.2)",
		shadowRadius: 6,
		shadowOpacity: 1,
		position: "absolute",
		right: 0,
		width: 77,
		top: 0,
		height: 24,
	},
	txtStatusPassedFourText: {
		backgroundColor: "transparent",
		color: "rgb(139, 25, 54)",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		position: "absolute",
		right: 16,
		top: 5,
	},
	viewBtnDetailsFourButtonImage: {
		resizeMode: "contain",
	},
	viewBtnDetailsFourButton: {
		backgroundColor: "rgb(139, 25, 54)",
		borderRadius: 12,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		width: 48,
		height: 24,
		marginRight: 11,
		marginTop: 22,
	},

	viewFootnoteView: {
		backgroundColor: "blue",
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		height: 270,
		alignItems: "flex-start",
	},
	txtReturningStudentsText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 252,
		marginLeft: 13,
		marginTop: 30,
		marginBottom: 18,

	},
	txtNoReturningText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 324,
		marginLeft: 23,
		marginTop: 15,
	},
	viewRemovedView: {
		backgroundColor: "transparent",
		width: 162,
		height: 25,
		marginLeft: 10,
		marginTop: 16,
	},
	viewRectRemovedView: {
		backgroundColor: "rgb(139, 25, 54)",
		borderRadius: 4,
		shadowColor: "rgba(0, 0, 0, 0.2)",
		shadowRadius: 6,
		shadowOpacity: 1,
		position: "absolute",
		left: 0,
		width: 162,
		top: 0,
		height: 25,
	},
	txtRemovedText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		position: "absolute",
		left: 16,
		top: 5,
	},
	txtNotesText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		width: 162,
		marginLeft: 13,
		marginTop: 15,
	},
	inputTxtNotesTextInput: {
		backgroundColor: "white",
		borderWidth: 1,
		borderColor: "rgb(112, 112, 112)",
		borderStyle: "solid",
		padding: 0,
		color: "black",
		fontFamily: "Montserrat-Regular",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		alignSelf: "stretch",
		height: 91,
		marginLeft: 13,
		marginRight: 18,
		marginTop: 8,
	},
	inputTxtNotesRating: {
		backgroundColor: "transparent",
		borderWidth: 2,
		borderColor: "rgb(112, 112, 112)",
		borderStyle: "solid",
		padding: 0,
		color: "black",
		fontFamily: "Montserrat-Regular",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		alignSelf: "stretch",
		height: 70,
		width: 350,
		marginLeft: 17,
		//marginRight: 18,
		marginTop: 15,
	},	
    viewNotesRowRating   :{
		// position: "absolute",
		// top:450,
		 marginTop:20,     
		 backgroundColor: "transparent",
		 marginLeft: 3,
		 width: 400,
		 flexDirection: "row",
	   }, 
	btnUpdateButton: {
		backgroundColor: "white",
		borderRadius: 5,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		alignSelf: "flex-end",
		width: 115,
		height: 33,
		top: 8,
		//top:220,
		marginRight: 18,
		marginBottom: 42,
		shadowColor: "rgba(0, 0, 0, 0.2)",
		shadowRadius: 6,
		shadowOpacity: 1,
	},
	btnAttendanceButton: {
		backgroundColor: "white",
		borderRadius: 5,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		alignSelf: "center",
		width: 165,
		height: 33,
		marginRight: 18,
		marginTop: 0,
		shadowColor: "rgba(0, 0, 0, 0.2)",
		shadowRadius: 6,
		shadowOpacity: 1,
	},	
	btnUpdateButtonImage: {
		resizeMode: "contain",
		marginRight: 10,
	},
	btnUpdateButtonText: {
		color: "rgb(139, 25, 54)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
	},
	viewNotesListView: {
		backgroundColor: "transparent",
		//position: "absolute",
		left: 0,
		right: 0,
		//top: 315,
		//height: 170,
	},
	viewNotesRowView: {
		backgroundColor: "transparent",
		marginTop: 6,
		left: 0,
		right: 0,
		top: 0,
		//height: 63,
	},
	viewNotesRowViewSpace: {
		backgroundColor: "transparent",
		marginTop: 6,
		left: 0,
		right: 0,
		top: 0,
		height: 63,
	},	
	txtDateNoteText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		alignSelf: "flex-start",
		marginLeft: 23,
	},
	txtNoteText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		marginLeft: 23,
		marginRight: 18,
		marginTop: 4,

	},
	lineNoteView: {
		backgroundColor: "rgb(184, 184, 184)",
		height: 1,
		marginTop: 19,
	},
	viewNotesRowTwoView: {
		backgroundColor: "transparent",
		position: "absolute",
		left: 0,
		right: 0,
		top: 64,
		height: 217,
	},
	txtDateNoteTwoText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		alignSelf: "flex-start",
		marginLeft: 23,
	},
	txtNoteTwoText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		marginLeft: 23,
		marginRight: 18,
		marginTop: 4,
	},
	lineNoteTwoView: {
		backgroundColor: "rgb(184, 184, 184)",
		height: 1,
		marginTop: 7,
	},
})
