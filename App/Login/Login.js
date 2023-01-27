//
//  Login
//  Login-
//
//  Created by [Author].
//  Copyright © 2018 [Company]. All rights reserved. 
//

import React from "react"
import { Image,ImageBackground, StyleSheet, Text, TextInput, Linking,TouchableOpacity, View,  Alert ,Dimensions,
	ActivityIndicator,ScrollView} from "react-native"
import authHelper   from "../Helper/Sessions";
import FlashMessage from "react-native-flash-message";
import Toast from 'react-native-tiny-toast';
import Constants from 'expo-constants';
import Moment from 'moment'; 
import * as Permissions from 'expo-permissions'; 
import * as Location from 'expo-location';

import { Camera } from "expo-camera";

import  Modal,{SlideAnimation, ModalContent,ModalButton } from 'react-native-modals'; 
import "./../../global.js";

import connDBHelper   from "../Helper/Dao";
import connectionHelper   from "../Helper/Connection";

import Notifications   from "../Helper/PushNotifications";
import ErrorHandler    from "../Helper/ErrorHandler"

import LoginStates from "../Helper/LoginStates"


import CountDown from 'react-native-countdown-component'; 
import PINCode from '@haskkor/react-native-pincode';


import TimerMixin from 'react-timer-mixin';
import SubmitErrorButton from "../SubmitError/SubmitErrorButton";
import CodeFieldInput from "../Helper/CodeFieldInput"

import * as NotificationsKey from 'expo-notifications';

import LoginHeader from "../Headers/LoginHeader"

export default class Login extends React.Component {
 
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
			current_screen : "Login",
			username: '',
			password: '',
			password_conf: '',
			data : null ,
			authenticated : 0,
			localShifts : null,
			host_ : global.host,
			visibleInputHost : false,
			_waiting: false,
			_warning: false,
			_modalNotLogin: false,
			_setPIN: false,
			_changePW : false,
			_folio:"",
			_date:"",
			recoverCode : "",
			user_interface_type: 1,
			user_botton_text : "Login as different user",
			user_name:"",
			user_email:"",
			user_id:0,
			_codeVerify:"",
			_timestamp:"",
			lastBtn:true, 
			rememberEmailField:true, 
			users:null,
			pin_entered : "", 
			appStateLogin : null,
			location:{
				latitude:33.46863937,  
				longitude:0
			},
			locationStatus:true,
			notificationStatus:true,
			cameraStatus:true,
			internetStatus:true,
			internetFocusStatus:true,
			connectionStatus:true,
			_title_users:""  ,  //Select your user 
			_showButtonCntRemember:false,
			message_debug : "",

		  };  
		  //String.fromCharCode(67,79,68,69);
		  //'234'.padStart(5, "0") 

		  //connDBHelper.dropTables();
		  connDBHelper.createTables();
		  		   
	}



	getLocationAsync = async () => {
		
        console.log("start await Location.requestForegroundPermissionsAsync()")
		let counter = 0;
		global.logs = global.logs + "\n\n" + Moment(Date.now()).format('MMM DD YYYY hh:mm a') + " \n";

		global.time_out_counter = counter
		let timerO = setInterval(() => {
			console.log(counter + ' / ' + global.time_out + ' sec.. ');
            counter ++;
			global.time_out_counter = counter
			if (counter == global.time_out) {
                clearInterval(timerO);
				this.setState({_waiting : false}) 
				console.log('Time out finish');
				global.logs = global.logs  + " Location Time Out : " + global.time_out_counter + " sec. \n"
            /*
				Toast.show("Location Time Out  " ,{ 
					position: Toast.position.center,
					containerStyle:{
						backgroundColor: '#FF8000'
					},
					duration	: 3500	,
					delay : 500,
					textStyle:{
						color:'#fff',
					   },
					imgSource: null,
					imgStyle: {},
					mask: false,
					maskStyle:{}
				  })
				  */
                  }
       			 }, 1000);		
 
        global.logs = global.logs  +  " Start: Location.requestForegroundPermissionsAsync() \n"
		let { status } = await Location.requestForegroundPermissionsAsync() ;// Permissions.askAsync(Permissions.LOCATION);
		let location = {coords:{ latitude :0, longitude:0 }};
	    
		global.logs = global.logs  + " Location.requestForegroundPermissionsAsync status : " + status + "  \n"
        // push_notification
		let token;
		

		////  Notification ini
		global.logs = global.logs  + "Start  NotificationsKey.getPermissionsAsync() \n"
		console.log("Start:  NotificationsKey.getPermissionsAsync()")
		const { status: existingStatus } = await NotificationsKey.getPermissionsAsync();

		global.logs = global.logs  +  JSON.stringify({ status: existingStatus } ,null,2) + " \n"
		
		let finalStatus = existingStatus;

		console.log("existingStatus:",existingStatus)
		if (existingStatus !== 'granted') {
			console.log("start await NotificationsKey.requestPermissionsAsync()")

		  const { status } = await NotificationsKey.requestPermissionsAsync();
		  this.setState({notificationStatus:false}) 
		  finalStatus = status;
		} 

		if (finalStatus !== 'granted') { 
			//alert('Failed to get push token for push notification!');
			console.log("A Failed to get push token for push notification!")
			global.logs = global.logs  + "B Failed to get push token for push notification! \n"
			return;
		}



		// Notifycation Status
		if( ! global.simulator){
			console.log("Not simulator");
			global.logs = global.logs  + " Start: NotificationsKey.getExpoPushTokenAsync() \n"
			token = (await NotificationsKey.getExpoPushTokenAsync()).data;
			global.logs = global.logs  + " Push Notification Token: " + token + "\n"
			global.push_notification_key = token;
			console.log(global.push_notification_key);
			 // push_notification
		}
		///// Notification end


		if (status !== 'granted') { 
			console.log("status:",status)
			console.log('Permission to access location was denied')
            global.logs = global.logs  + "Permission to access location was denied \n"
			this.setState({
				errorMessage: 'Permission to access location was denied',
			});

			this.setState({locationStatus:false})   // Show wait modal
			// Alert.alert("Error:", 'Permission to access location was denied'); 
			//  Linking.openURL('app-settings://');
			//  return;

			location.coords.latitude = global.default_location.latitude;
			location.coords.longitude = global.default_location.longitude 

			global.logs = global.logs  + " location.coords :" + JSON.stringify(location ,null,2) + " \n"

			//global.location_now
		}else{  
			//OJO aqui poner timer
			clearInterval(timerO);
			console.log("clearInterval(timerO)")
			console.log("status:",status)
			console.log(" Get Location.getCurrentPositionAsync");
			this.setState({locationStatus:true});                    // Show wait modal  No Location 
			global.logs = global.logs  + " Start: Location.getCurrentPositionAsync() \n"
			location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Highest});
		}	
		
		global.logs = global.logs  + " location.coords :" + JSON.stringify(location ,null,2) + " \n"

		console.log("--- locationStatus" , this.state.locationStatus )
    
		
		const { latitude , longitude } = location.coords
		global.location_now = location.coords
		console.log("************* location.coords  *********")
		console.log( location.coords);
		this.getGeocodeAsync({latitude, longitude})

		console.log( "global.location_now ...",global.location_now);

     // ojo  si son correctas insertar coordenadas en :  global.default_location
		this.setState({ location: {latitude, longitude}});
		this.onLoadGetUsers(location.coords.latitude,location.coords.longitude)
		
	}; 


	getGeocodeAsync= async (location) => {
		let geocode = await Location.reverseGeocodeAsync(location)
		this.setState({ geocode})
	  }


	setStatusAll  = async (feature,status) => {
		console.log("&&&&&&&&&&&&&&&  setStatusAll")
		if(feature === 'camera')
		    this.setState({ cameraStatus :false})
		if(feature === 'notification')
		    this.setState({ notificationStatus :false})
		if(feature === 'internet')
		    this.setState({ internetStatus :false})		 
	    console.log("feature:" ,feature )	
	    console.log("status:" ,status )	
		this.forceUpdate();
	}
    changeStatus  = async () => {
		this.setState({ internetFocusStatus :false})
		global.logs = global.logs  + "\n\n > internetFocusStatus  :" + false+" \n"
		
	}

	async realSetStatusAll (feature,status){

	}
	async permisionCameraFunction  ()  {
		
		const cameraPermission = await Camera.requestCameraPermissionsAsync() //.getCameraPermissionsAsync() // .requestPermissionsAsync();
		//setCameraPermission(cameraPermission.status === 'granted');
        this.setState({cameraStatus:cameraPermission.status === "granted"}) 
		console.log("cameraPermission:",cameraPermission)
		console.log("this.statuscameraStatus::",this.state.cameraStatus)
		global.logs = global.logs  + "\n\n cameraStatus:cameraPermission.status  :" + cameraPermission.status+" \n"


	  };


	  

async componentDidMount() {
	
		//global.logs = ""; 
// let NetState =  await connectionHelper.isConnected();

		/// Camera Status Ini
		await this.permisionCameraFunction()
		
		/// Camera Status End

		if(global.connection  === 0 || global.connectionTest === 0  || this.state.locationStatus == false ) {
              
			  //this.setState({_waiting: true})
			  let code = connDBHelper.getSecureCode();			
			  this.setState({_folio:code});	
			  this.setState({_warning:false});
			  this.setState({connectionStatus:false}); 
			  this.setState({internetStatus:false}); 
			  
			  global.logs  =  "\n" + global.logs + "\n" +  " Net Status: Not Connected to Internet " + "\n\n"
  
		}else{
			this.setState({_waiting: true}) 
		}

		await connectionHelper.isConnectedToAPI()

			//		
		await this.getLocationAsync();
		
		// Internet Connection
		console.log("@@@@@");
		console.log("***** connectionHelper.isConnected :",global.net_state)
		global.logs  =  "\n" + global.logs + "\n Net Status(ini):" +  JSON.stringify(global.net_state ,null,2) + "\n\n"

		if(! global.net_state)
		  //   global.logs  =  "\n" + global.logs + "\n Net Status:" +  JSON.stringify(global.net_state ,null,2) + "\n\n"
        //else
		  global.logs  =  "\n" + global.logs + "\n" +  " Net Status: Can't get connection status (global.net_state) " + "\n\n"
        
		if( global.connection  === 0 || global.net_state == null  || ! global.net_state ||  this.state.connectionStatus != true  ){ //global.net_state.type  != "cellular" || 
			
			this.setState({internetStatus:false}); 
		}
               

		if(  global.connection  === 0 || global.net_state == null  || ! global.net_state   ||  global.net_state.isConnected  != true)	  
		   		 this.setState({connectionStatus:false}); 			
		

		//authHelper.logOut(global.host,global.access_token);
		global.shift_time_id = 0;
		//connDBHelper.saveLogin("dev@phlebotomyusa.com","Phleb$123" ,111, null );
		

		//const { statusCam } = await Camera.requestCameraPermissionsAsync();
		//this.setState({cameraStatus:statusCam !== "granted"}) 
		//console.log("statusCam:",statusCam)


		
		let _timestamp = Moment(Date.now()).format('Y-MM-DD HH:mm:ss')
		this.buildVerifyCode(_timestamp,this.state.user_email)
		
		
			//this.setUserInterfface (6,"")

	if(!this.state.cameraStatus) this.setState({notificationStatus:true})		 
	 console.log(" ======  Status   ======")		
	 console.log('this.state.notificationStatus::' ,this.state.notificationStatus ) 
	 console.log('this.state.cameraStatus::' ,this.state.cameraStatus )
	 console.log('global.net_state.type ::' ,global.net_state.type  )
	 
	
	}
	

	buildVerifyCode =  (timestamp,user_email) => {
		
		let _day = String(parseInt(  Moment(timestamp).format('DD') ) + 9 )
		let _sec = Moment(timestamp).format('ss')
		let _sum = String(parseInt( _day ) + parseInt(_sec )).padStart(2, "0") 
		let _lengthEmail = String(user_email.trim().length).padStart(2, "0")
		let recoverCode = _sum + _lengthEmail + _sec
		return recoverCode 
	}

	 sendBuilCode = async (timestamp,instructor_id,email) =>{
		
		this.setState({_waiting : true}) 

		let bodyJSON ="";
		if(email == ""){
			bodyJSON = JSON.stringify({
				verification_code_timestamp: timestamp
		   })  
		}else{
			bodyJSON = JSON.stringify({
				verification_code_timestamp: timestamp,
				email : email
		   })  
		}
        var _url = global.host + '/api/ipad/verification_code/'+instructor_id;
		fetch(_url, {
			method: 'POST',
			headers: {
			   'Accept': 'application/json',
			   'Content-Type': 'application/json', 
			   "cache-control": "no-cache"

			},
			body: bodyJSON 

		  }).then((response) =>  response.text())  
				.then((responseData) =>
				 {
				  	global.logs = ErrorHandler.setMessageResponse( "",bodyJSON,responseData,"response","",_url,global.id,global.name ,global.email);
					this.setState({_waiting : false}) 
				   try {
					   var responseTXT = responseData;
					   let responseJSON = JSON.parse (responseTXT); 
					   
					   if(responseJSON['success'] !== undefined && responseJSON['success'] !== false )  {
					
						 this.setState({user_id:responseJSON.instructor.id})
						 this.setUserInterfface (4,"")
					   }else{
						Alert.alert("Error:",responseJSON.msg );
						this.setState({username:""})
						this.setUserInterfface (2,"")
					   }

				   } catch (e) {
					   console.log(e); 
					  	global.logs = ErrorHandler.setMessageResponseAdd( global.logs,"","","error",e.toString(),_url,global.id,global.name ,global.email);

					   this.setState({
						   authenticated :0 
					   });
					   Alert.alert("Error:", "Problems connecting to the Server. Please try again later.");

				   }

				}).catch((error) => {
	  		      global.logs = ErrorHandler.setMessageResponseAdd( global.logs,"","","error",error.toString(),_url,global.id,global.name ,global.email);

				  console.log(error);	 
				  console.error(error);

				});
	}
/*
	sendTrayAgainSMSBuilCode = async (timestamp,instructor_id,email) =>{
		
		this.setState({_waiting : true}) 

		let bodyJSON ="";
		if(email == ""){
			bodyJSON = JSON.stringify({
				verification_code_timestamp: timestamp
		   })  
		}else{
			bodyJSON = JSON.stringify({
				verification_code_timestamp: timestamp,
				email : email
		   })  
		}
        var _url = global.host + '/api/auth/login_verification_code';
		console.log("_url:",_url);
		fetch(_url, {
			method: 'POST',
			headers: {
			   'Accept': 'application/json',
			   'Content-Type': 'application/json', 
			   "cache-control": "no-cache"

			},
			body: bodyJSON 

		  }).then((response) =>  response.text())  
				.then((responseData) =>
				 {
				  	global.logs = ErrorHandler.setMessageResponse( "",bodyJSON,responseData,"response","",_url,global.id,global.name ,global.email);
					this.setState({_waiting : false}) 
				   try {
					   var responseTXT = responseData;
					   let responseJSON = JSON.parse (responseTXT); 
					   
					   if(responseJSON['success'] !== undefined && responseJSON['success'] !== false )  {
					
						 this.setState({user_id:responseJSON.instructor.id})
						 this.setUserInterfface (4,"")
					   }else{
						Alert.alert("Error:",responseJSON.msg );
						this.setState({username:""})
						this.setUserInterfface (2,"")
					   }

				   } catch (e) {
					   console.log(e); 
					  	global.logs = ErrorHandler.setMessageResponseAdd( global.logs,"","","error",e.toString(),_url,global.id,global.name ,global.email);

					   this.setState({
						   authenticated :0 
					   });
					   Alert.alert("Error:", "Problems connecting to the Server. Please try again later.");

				   }

				}).catch((error) => {
	  		      global.logs = ErrorHandler.setMessageResponseAdd( global.logs,"","","error",error.toString(),_url,global.id,global.name ,global.email);

				  console.log(error);	 
				  console.error(error);

				});
	}
*/
	loginFctByEmailSMS = async (email,verification_code) =>{  // Login by SMS , Validation

		    
		global.email = email
			this.setState({
				username : global.email, 
			});
			this.setState({
				password :"x",
			});

		




		let body_data = JSON.stringify({
			email: email.trim(),
			verification_code: verification_code,
			remember_me: true
		  })
	   
		console.log("body_data:",body_data)  

		this.setState({_waiting : true})
				
		
		let url_ = global.host + '/api/auth/login_verification_code';
		console.log("url_:",url_)
		fetch(url_,{
			method: 'POST',
			headers: {
			   'Accept': 'application/json',
			   'Content-Type': 'application/json', 
			   "cache-control": "no-cache"
			   
			},
			body: body_data
		   
		  }).then((response) =>  response.text()) //response.json())
			.then((responseData) =>
				 {
					 console.log("responseData:",responseData)
					 global.logs = ErrorHandler.setMessageResponse( "",body_data,responseData,"response","",url_,global.id,global.name ,global.email);
					// TimerMixin.clearTimeout(timeOutLogin);
				   this.setState({_waiting : false})
				   try {
					   var responseTXT = responseData;
					   var responseJSON = JSON.parse (responseTXT);
					   this.setState({
						   data :responseJSON
					   });
						
   
						   if(responseJSON['access_token'] !== undefined) 
						   {
					
							   this.setState({
								   authenticated :1,
								   password:"",
								   password_conf:"",
							   });


							   global.access_token = responseJSON['access_token'];
							   global.token_type = responseJSON['token_type'];
							   global.expires_at = responseJSON['expires_at'];
							   
							   global.email = this.state.username.trim();
							   global.user_id = responseJSON['user_id'];

							   connDBHelper.saveLogin(this.state.username.trim(),this.state.password.trim() ,responseJSON['user_id'], String(responseJSON['login_time']));
							   this.setUserInterfface (1,"")
							   this.onLoginSuccess();
							   
						   }else{
							   this.setState({
								   authenticated :0
							   });
				
							 this.setState({
								_showButtonCntRemember :true
							 });
							 
							 this.setState({
								user_interface_type : 10
							  });
						/*
							   this.setState({
								  user_interface_type : 2
								});
								
							   
							   Alert.alert("Authentication failed "," Incorrect email or Verification Code", [{
								text: "Cancel",
								style: "cancel",
								onPress: () => {
									},
									}, {
										text: "OK",
										onPress: () => {

										},
									}]);
									
							*/	
										
						   }
				   } catch (e) {
					   console.log(e);
					   this.setState({
						   authenticated :0
					   });
					   Alert.alert("Error:", "Problems connecting to the Server.");
					   this.setState({_waiting : false})
					   return;

				   }  
				}).catch((error) => {
					
				  //dispatch(error('There was a problem with the request.'));
				  console.log(error);	 
				  console.error(error);
				  this.setState({
					 authenticated :0
				   });
				   this.setState({_waiting : false})
				});

	  } 

	getVerificationCodeByEmail = async (timestamp,email) =>{
		
		this.setState({_waiting : true}) 

		let bodyJSON ="";
	
		let instructor_id = 208
		bodyJSON = JSON.stringify({
				verification_code_timestamp: timestamp,
				email : email
		})


        let _url = global.host + '/api/ipad/request_verification_code';
		console.log("_url::",_url);
		console.log("bodyJSON:",bodyJSON)
		fetch(_url, {
			method: 'POST',
			headers: {
			   'Accept': 'application/json',
			   'Content-Type': 'application/json', 
			   "cache-control": "no-cache"

			},
			body: bodyJSON 

		  }).then((response) =>  response.text())  
				.then((responseData) =>
				 {
				  	global.logs = ErrorHandler.setMessageResponse( "",bodyJSON,responseData,"response","",_url,global.id,global.name ,global.email);
					this.setState({_waiting : false}) 
				   try {
					   var responseTXT = responseData;
					   let responseJSON = JSON.parse (responseTXT); 
					   
					   if(responseJSON['success'] !== undefined && responseJSON['success'] !== false )  {
					
						 this.setState({user_id:responseJSON.instructor.id})
						 this.setUserInterfface (20,"")
					   }else{
						Alert.alert("Error:",responseJSON.msg );
						this.setState({username:""})
						this.setUserInterfface (2,"")  // Redirection to General Login 
					   }

				   } catch (e) {
					   console.log(e); 
					  	global.logs = ErrorHandler.setMessageResponseAdd( global.logs,"","","error",e.toString(),_url,global.id,global.name ,global.email);

					   this.setState({
						   authenticated :0 
					   });
					   Alert.alert("Error:", "Problems connecting to the Server. Please try again later.");

				   }

				}).catch((error) => {
	  		      global.logs = ErrorHandler.setMessageResponseAdd( global.logs,"","","error",error.toString(),_url,global.id,global.name ,global.email);

				  console.log(error);	 
				  console.error(error);

				});
	}


	onForgotPress = () =>{ 	
		this.setUserInterfface (4,"") 
		
		let _timestamp = Moment(Date.now()).format('Y-MM-DD HH:mm:ss')
		let code = this.buildVerifyCode(_timestamp,this.state.user_email)
		this.setState({_timestamp:_timestamp,_codeVerify:code})

		console.log("code",code)
		console.log("_timestamp",_timestamp)
		console.log("user_id",this.state.user_id)
		this.sendBuilCode  (_timestamp,this.state.user_id,"")
	}

	onForgotGeneralPress = () =>{ 	
		this.setUserInterfface (9,"") 
		this.setState({user_name:""})
		console.log("onForgotGeneralPress")
	}
	onForgotTryAgainPress  = () =>{ 	
		this.setUserInterfface (19,"") 
		this.setState({user_name:""})
		console.log("onForgotTryPress")
	}
	
	onForgotTryAgainNextPress = () =>{ 	
		console.log("onForgotTryAgainNextPress")
		this.setState({user_name:""})
		if(this.state.username.trim()  == ''  ){
				  
			Alert.alert(
			  'Attention !',
			  'The email field cannot be empty.',
			  [
				{text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  {cancelable: false},
			);
		   // this.emailInput.current.focus;
			return ;
			
		  } 

		let _timestamp = Moment(Date.now()).format('Y-MM-DD HH:mm:ss')
		let code = this.buildVerifyCode(_timestamp,this.state.username)
		console.log("this.state.username",this.state.username)
		this.setState({_timestamp:_timestamp,_codeVerify:code})

		console.log("code",code)
		console.log("_timestamp",_timestamp)
		console.log("user_id",this.state.user_id)
		this.getVerificationCodeByEmail(_timestamp,this.state.username)
	}



	onForgotGeneralNextPress = () =>{ 	
		console.log("onForgotGeneralNextPress")
		this.setState({user_name:""})
		if(this.state.username.trim()  == ''  ){
				  
			Alert.alert(
			  'Attention !',
			  'The email field cannot be empty.',
			  [
				{text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  {cancelable: false},
			);
		   // this.emailInput.current.focus;
			return ;
			
		  } 

		let _timestamp = Moment(Date.now()).format('Y-MM-DD HH:mm:ss')
		let code = this.buildVerifyCode(_timestamp,this.state.username)
		console.log("this.state.username",this.state.username)
		this.setState({_timestamp:_timestamp,_codeVerify:code})

		console.log("code",code)
		console.log("_timestamp",_timestamp)
		console.log("user_id",this.state.user_id)
		this.sendBuilCode  (_timestamp,0,this.state.username)
	}

	onForgotPINPress = (user_name) =>{ 	
		this.setUserInterfface (3,user_name) 

	}
	onLogoPressed = () => {
		this.setState({ visibleInputHost :! this.state.visibleInputHost});
		//console.log(this.state.host_);
	    this.setState ( { host_:global.host});
	}
	onSavePadPressed = () => {  
		global.host = this.state.host_;
		this.setState({ visibleInputHost :! this.state.visibleInputHost});

		
		this.setState({_title_users:"Select your user " })
		this.componentDidMount()

	}	 

	onVideoPlay = () => {
  console.log("onVideoPlay....")
		const { navigate } = this.props.navigation
		
		navigate("VideoPlayer" ) 
	}

	 onGrupo171Pressed = async () => {
	
		const { navigate } = this.props.navigation
		global.screen = "Shift"

		navigate("Shift",{_onLoadGetUsers:this.onLoadGetUsers})
	}
	 onLoginSuccess = async () => {

		const { navigate } = this.props.navigation
		global.screen = "Shift"

		navigate("Shift" , {_onLoadGetUsers:this.onLoadGetUsers}) 
	}

	onLoadGetUsers = (_latitude,_longitude) => {

		if(global.push_notification_key== "") global.push_notification_key ="XXXXXXX"

		let url = global.host + '/api/shifts_by_coordinates?latitude=' + _latitude +'&longitude='+_longitude + "&notification_token_id="+global.push_notification_key
  		console.log("url:",url);	
		
		const timeOutList = TimerMixin.setTimeout(
			() => { 
				console.log('I do not leak!');
				this.setState({_waiting : false});
				Toast.show("Network request failed, 'No internet connection' " ,{
					position: Toast.position.center,
					containerStyle:{
						backgroundColor: '#8B1936'
					},
					duration	: 2500	,
					delay : 500,
					textStyle:{
						color:'#fff',
					   },
					imgSource: null,
					imgStyle: {},
					mask: false,
					maskStyle:{}
				  })
				  let code = connDBHelper.getSecureCode();
								
				  this.setState({_folio:code});
				  console.log("no internet connection")
				  this.setState({_warning:true});

				return;
			},
			12000
		  ); 
	
		fetch(url , {
			method: 'GET',
			headers: {
			   'Accept': 'application/json',
			   'Content-Type': 'application/json', 
			   "cache-control": "no-cache"
			}			
		   
		  }
		  ).then((response) =>  response.text())   
				.then((responseData) =>
				 {
					global.logs = ErrorHandler.setMessageResponseAdd( global.logs,"",responseData,"response","",url,global.id,global.name ,global.email);
					TimerMixin.clearTimeout(timeOutList);

					this.setState({_waiting : false}) 
				   try {
					   var responseTXT = responseData;
					   let responseJSON = JSON.parse (responseTXT); 
					    this.setState({users:responseJSON.login_list.instructors}) 
						if(responseJSON.login_list.length ==0)
						     this.setState({_title_users:"No shifts found today"}) 
						else
						     this.setState({_title_users:"Select your user"})
						 	  

				   } catch(e) {
					   console.log("error:",e);
					   this.setState({
						   authenticated :0 
					   });
					   global.logs = ErrorHandler.setMessageResponseAdd( global.logs,"","","error",e.toString(),url,global.id,global.name ,global.email);
					   Alert.alert("Error:", "Problems connecting to the Server. Please try again later.");

				   }

				}).catch((error) => {
				  console.log("error::",error);	 
				  console.error(error);
				  this.setState({
					 authenticated :0 
				   });
				   global.logs = ErrorHandler.setMessageResponseAdd( global.logs,"","","error",error.toString(),url,global.id,global.name ,global.email); 
				});
	}

	showSendErrorScreen(navObj){
		const { navigate } = navObj
		global.screen = "SubmitError"
		navigate("SubmitError",{_onLoadGetUsers:this.onLoadGetUsers})
	}
    setUserInterfface = (type,extra_text) => {
		console.log(type)
		switch(type) {
			case 1:
				this.setState({ user_interface_type: 1})
				this.setState({user_botton_text : "Login as different user"})
				this.setState({lastBtn:true})
			  break;
			case 2:
				this.setState({ user_interface_type: 2})
				this.setState({user_botton_text : "Back to users"})
				this.setState({lastBtn:true})
			  break;
			case 3:
				this.setState({ user_interface_type: 3})
				this.setState({user_botton_text : "I'm not " + extra_text })
				this.setState({lastBtn:true})
			  break;	
			case 4:  // Changue Pin
				this.setState({ user_interface_type: 4})
				this.setState({user_botton_text : "" })
				this.setState({lastBtn:false})
				this.setState({rememberEmailField:false})		
			  break; 
			  case 5: // Reset PW
				this.setState({ user_interface_type: 5})
				this.setState({user_botton_text : "" })  
				this.setState({lastBtn:false})
				this.setState({rememberEmailField:true})			
			  break; 
			  case 6: // For PIN Config first time
				this.setState({ user_interface_type: 6})
				this.setState({user_botton_text : "" })  
				this.setState({lastBtn:false})
				this.setState({rememberEmailField:false})			
			  break; 
			  case 7: // Login with PIN
			  this.setState({ user_interface_type: 7})
			  this.setState({user_botton_text : "I'm not " + extra_text })
			  this.setState({lastBtn:true})		
			  break; 
			  case 9:
				this.setState({ user_interface_type: 9})
				this.setState({user_botton_text : " "  })
				this.setState({lastBtn:false})
			  break;
			  case 10: // Login Failed
				this.setState({ user_interface_type: 10})
				this.setState({user_botton_text : "Back to users"  })
				this.setState({lastBtn:true})
			  break;	
			  case 11:
				this.setState({ user_interface_type: 11})
				this.setState({user_botton_text : "" })
				this.setState({lastBtn:false})
				this.setState({rememberEmailField:true})		
			  break; 	 
			  case 19:   // Login Try Again
				this.setState({ user_interface_type: 19})
				this.setState({user_botton_text : " "  })
				this.setState({lastBtn:false})
			  break;
			  case 20:   // Login with SMS
				this.setState({ user_interface_type: 20})
				this.setState({user_botton_text : " "  })
				this.setState({lastBtn:false})
			  break;			  	  			   			  				  
		}

	}
    onEndCodeValidity  = (type_login) => {
		Toast.show("You Verification code has expired " ,{
			position: Toast.position.center,
			containerStyle:{
				backgroundColor: 'orange'
			},
			duration	: 1500	,
			delay : 500,
			textStyle:{
				color:'#fff',
			   },
			imgSource: null,
			imgStyle: {},
			mask: false,
			maskStyle:{}
		  })
		  switch(type_login) {
			case 1:
				this.setUserInterfface(1,"")
			  break;
			case 3:
				this.setUserInterfface(3,this.state.user_name)
			  break;
		  }
		  this.setState({_timestamp:"",_codeVerify:""})
	}

	setCodeHook(code) {
		console.log("en setCodeHook(code): ",code)
		if(this.state.user_interface_type == 4){  // If reset PW
			console.log("this.state.user_interface_type == 4")

			if(code == this.state._codeVerify) {
				this.setUserInterfface (5,"") // if code is valid : Send to update new PW 
			}else{
				Alert.alert(
					'Error !',
					"The code entered is not valid, please verify it ",
					[
					{text: 'OK', onPress: () => console.log('OK Pressed')},
					],
					{cancelable: false},
				);
			}
		}
		 
		if(this.state.user_interface_type == 20){  // If Validation Code & Login with SMS + email
            console.log("this.state.user_interface_type == 20")
			console.log("_codeVerify:" , this.state._codeVerify)
			console.log("code:" , code)
			console.log("this.state.username",this.state.username)
			if(code == this.state._codeVerify) {
				this.loginFctByEmailSMS(this.state.username,this.state._codeVerify)
				//this.setUserInterfface (5,"") // 
			}else{
				Alert.alert(
					'Error !',
					"The code entered is not valid, please verify it ",
					[
					{text: 'OK', onPress: () => console.log('OK Pressed')},
					],
					{cancelable: false},
				);
			}
		}		

	}

	savePIN(pin){
	
		this.setState({_waiting : true}) 
        var _url =  global.host + '/api/auth/login_setup_pin';
		var _body = JSON.stringify({
				pin: pin,
				confirm_pin:pin,
				app_release :  Constants.manifest.version  + " (" + Constants.manifest.ios.buildNumber+")"
		   })   ;
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
					   var responseTXT = responseData;
					   let responseJSON = JSON.parse (responseTXT); 
					   if(responseJSON['success'] !== undefined && responseJSON['success'] !== false )  {
						
						 global.haspin = true;
					   }


				   } catch (e) {
					   console.log(e); 
					   	global.logs = ErrorHandler.setMessageResponseAdd( global.logs,"","","error",e.toString(),_url,global.id,global.name ,global.email);

					   this.setState({
						   authenticated :0 
					   });
					   Alert.alert("Error:", "Problems connecting to the Server. Please try again later.");

				   }

				}).catch((error) => {
				  console.log(error);	 
			 	global.logs = ErrorHandler.setMessageResponseAdd( global.logs,"","","error",error.toString(),_url,global.id,global.name ,global.email);

				  console.error(error);

				}); 
	}


	hasSet = async() => {
		const res = await hasUserSetPinCode()
	
	  }

    pinStatus(pinCode) {
        console.log('pinStatus', pinCode)
    };
	pinOnFail() {

	}

	continueLoginSuccess(){
		
		this.setUserInterfface (1,"")
		this.onLoginSuccess();
	}
	

	render() {
		const imageBack = require("./../../assets/images/login_background-ios.png");
		let sms_number ="";
		if(global.host.indexOf("admin.phlebotomyusa.com") !== -1  ){
			sms_number =global.sms_number_production;
		}else{
			sms_number =global.sms_number_staging;
		}
		return <ImageBackground source={imageBack} style={styles.imageBack}>



		     <View
				style={styles.viewView}>
             <LoginHeader
						instructorName = {global.name}
						navigation = {this.props.navigation}
						
					>
				</LoginHeader>

					{  global.debug &&  
					  <Text
						style={styles.releaseText}>
						r. {Constants.manifest.version}   ( {Constants.manifest.ios.buildNumber})
					   </Text>	
					}
						<TouchableOpacity
							onLongPress={this.onLogoPressed}>
							<View
								style={styles.viewHeaderView}>
	
							</View>
						</TouchableOpacity>	

						{ this.state.visibleInputHost && global.debug  &&
						<View
								
							pointerEvents="box-none"
							style={{
								//position: "absolute",
								alignSelf: "center",
								top: 0,
								bottom: 0,
								justifyContent: "center", 
							}}>
							<Text style={styles.NotificationTokenIdText}>{global.push_notification_key}</Text>

							<TextInput
							clearButtonMode="always"
								autoCorrect={false}
								placeholder={global.host}
								placeholderTextColor="#fff" 
								style={styles.hostTextInput}
								value = {this.state.host_}
								onChangeText = {(host_) => this.setState({host_})}
								autoCapitalize = 'none'
								/>
							<TouchableOpacity
									onPress={ this.onSavePadPressed}
									style={styles.grupo171Button}>
									<Text
										style={styles.grupo171ButtonText}>   SAVE PATH   </Text>
							</TouchableOpacity>	
						</View>
						}

						<TouchableOpacity
						    style={styles.viewNoLogin}
							onPress={ () => {
								let code = connDBHelper.getSecureCode();
								
								this.setState({_folio:code});
								this.setState({_warning:true});
							}}>

								<Image
							         source={require("./../../assets/images/rrs.png")}
							     style={styles.imgIconNoLogIn}/>

						</TouchableOpacity>	
						<View>
							<Notifications/> 
						</View>

					


							{ this.state.user_interface_type == 7 && // Login with PIN
							<View   
										style={styles.viewCardShiftDayView}>

									<View
										pointerEvents="box-none"
										style={{
											position: "absolute",
											left: 0,
											right: 0,
											top: 20,
											//height: 285,
											alignItems: "center",
										}}> 
			
										<View
											style={styles.viewTitleLogoView}>
											<Text
												style={styles.loginText}>Login</Text>
										</View>


										<View  style={styles.viewCardViewPINEnter}>
								        <View style={{height: 10,}}/> 
										 <Text
												style={styles.welcomeText}>Welcome</Text>	
										<View style={{height: 5,}}/> 
											<Text
												numberOfLines = { 2}
												style={styles.loginXuserText}>{this.state.user_name} </Text>
											<Text
												style={styles.shareText}>Please never share your password or PIN with anyone else</Text>
											<PINCode 
												status={'enter'}
												disableLockScreen
												vibrationEnabled ={true}
												colorPassword={'rgb(118,11,41)'}
												colorPasswordEmpty={"white"}
												stylePinCodeHiddenPasswordSizeEmpty={15}
												stylePinCodeHiddenPasswordSizeFull={15}
												stylePinCodeMainContainer={{flex: 1,}}
												stylePinCodeRowButtons = {{justifyContent: 'center', 
																			alignItems: 'center', 
																			height: 12 * 5}}
												stylePinCodeTextButtonCircle={{fontSize: 27}}
												stylePinCodeButtonCircle  = {{
													alignItems: 'center',
													justifyContent: 'center', 
													width: 12 * 4, 
													height: 12 * 4, 
													backgroundColor: 'rgb(105, 105, 105)', 
													borderRadius: 12 * 2
													}}
												stylePinCodeCircle = {{

													width: 12 * 2, 
													height: 12 * 2, 
													color: 'rgb(0, 0, 0)',
													//backgroundColor: 'rgb(105, 105, 105)', 
													borderRadius: 12 * 2,
													shadowColor: "#000",
													shadowOffset: {
													width: 0,
													height: 2
													},
													shadowOpacity: 0.5,
													shadowRadius: 2,
												}}
												stylePinCodeButtonNumber = {'#fff'}
                                                colorCircleButtons = {'rgb(105, 105, 105)'}
												stylePinCodeDeleteButtonText={{
													color : 'rgb(0, 0, 0)'
												}}
												stylePinCodeColorTitle={'rgb(105, 105, 105)'}
												styleColumnDeleteButton ={'#000'}
                                                stylePinCodeDeleteButtonColorHideUnderlay={'rgb(105, 105, 105)'}
                                                stylePinCodeDeleteButtonColorShowUnderlay={'#000'}
												buttonDeleteText = {"."}
												handleResultEnterPin = {(pin) => {this.loginPIN(this.state.username,pin)}} 
												pinStatus={this.pinStatus}
												storePin={(pin) => {
													console.log("storePin")
													this.savePIN(pin)
												}}
												 finishProcess={() => {
													
													 console.log('finishProcess Success')
													
													//this.continueLoginSuccess()
												}}
												storedPin = {(this.state.pin_entered == ""?"123":this.state.pin_entered)} 
												// onFail= {(attempt) => console.log("onFail:",attempt) }
												//onFail= {  this.pinOnFail }
												onFail= {  this.pinStatus = 2222 }
												maxAttempts = {0}
												///timeLocked = {10 * 1000} 
											/>


											<TouchableOpacity
												style={styles.btnForgotTouch}
												onPress={ () => {
													this.onForgotPINPress(this.state.user_name)
													}}>
											<Text
												style={styles.passwordRememberdText}>Can't remember my PIN</Text>	
											</TouchableOpacity>	
											<View
												style={{
													flex: .1,
												}}/>		
										</View>
			


									</View>
							</View> 
							}			




					      { this.state.user_interface_type == 6 && // set New PIN
						    <View   
									style={styles.viewCardShiftDayView}>

								<View
									pointerEvents="box-none"
									style={{
										position: "absolute", 
										left: 0,
										right: 0,
										top: 6,
										//height: 885,
										alignItems: "center",
										
									}}>
		
									<View
										style={styles.viewTitleLogoView}>
										<Text
											style={styles.loginText}></Text>
									</View>


									<View  style={styles.viewCardViewPIN}>
									<View
										style={{
											flex: .1,
									}}/>
										<Text
											numberOfLines = { 2}
											style={styles.loginXuserText}>Configure your PIN</Text>
									<View
										style={{
											flex: .1,
									}}/>
											<PINCode 
												status={'choose'}
												//colorCircleButtons={'transparent'}
												colorPassword={'rgb(118,11,41)'}
												colorPasswordEmpty={"white"}
												stylePinCodeHiddenPasswordSizeEmpty={15}
												stylePinCodeHiddenPasswordSizeFull={15}
												stylePinCodeMainContainer={{flex: 1,}}

												stylePinCodeTextButtonCircle={{fontSize: 27}}
												stylePinCodeButtonCircle  = {{
													alignItems: 'center',
													justifyContent: 'center', 
													width: 12 * 4, 
													height: 12 * 4, 
													backgroundColor: 'rgb(105, 105, 105)', 
													borderRadius: 12 * 2
													}}
												stylePinCodeCircle = {{

													width: 12 * 2, 
													height: 12 * 2, 
													color: 'rgb(0, 0, 0)',
													//backgroundColor: 'rgb(105, 105, 105)', 
													borderRadius: 12 * 2,
													shadowColor: "#000",
													shadowOffset: {
													width: 0,
													height: 2
													},
													shadowOpacity: 0.5,
													shadowRadius: 2,
												}}
												stylePinCodeDeleteButtonText={{
													color : 'rgb(0, 0, 0)'
												}}
												stylePinCodeColorTitle={'rgb(105, 105, 105)'}
												stylePinCodeColorSubtitle={'rgb(105, 105, 105)'}
												stylePinCodeButtonNumber = {'#fff'}
                                                colorCircleButtons = {'rgb(105, 105, 105)'}
												styleColumnDeleteButton ={'#000'}
                                                stylePinCodeDeleteButtonColorHideUnderlay={'rgb(105, 105, 105)'}
                                                stylePinCodeDeleteButtonColorShowUnderlay={'#000'}
												buttonDeleteText = {"."}
												//handleResultEnterPin = {(pin) => this.savePIN(pin)} 
												pinStatus={this.pinStatus}
												storePin={(pin) => {
													this.savePIN(pin)
												}}
												finishProcess={() => {
													
													this.continueLoginSuccess()
												}}
												//onFail= {(attempt) => console.log(attempt) }


												/>
									<View
										style={{
											flex: -.5,
									}}/>
									</View>

								</View>
						</View> 
						}	

						{ this.state.user_interface_type == 5 && //New Login 
						<View   
								style={styles.viewCardShiftDayView}>

								<View
									pointerEvents="box-none"
									style={{
										position: "absolute",
										left: 0,
										right: 0,
										top: 110,
										//height: 285,
										alignItems: "center",
									}}>
		



									<View  style={styles.viewCardView}>
									<View
										style={{
											flex: 2,
										}}/>									


										<View
											style={styles.viewPasswordFieldView}>
											<View
												pointerEvents="box-none"
												style={{
													position: "absolute",
													alignSelf: "center",
													top: 0,
													bottom: 0,
													justifyContent: "center",
												}}>
												<Text
												  style={styles.passwordTitleTxt}>Enter your new password</Text>	
												<TextInput
												clearButtonMode="always" 
													autoCorrect={false}
													textContentType = {"none"}
													placeholder="Password"
													placeholderTextColor="#707070" 
													secureTextEntry={true}
													style={styles.passwordTextInput}
													autoCapitalize = 'none'
													onChangeText = {(password) => this.setState({password})}
													ref={ref =>  {this._password = ref;}}
													returnKeyType="done"
													
													/>
											</View>
										</View>		
										<View
											style={{
												flex: 1,
											}}/>											
										<View
											style={styles.viewPasswordFieldView}>
											<View
												pointerEvents="box-none"
												style={{
													position: "absolute",
													alignSelf: "center",
													top: 0,
													bottom: 0,
													justifyContent: "center",
												}}>
												<Text
												  style={styles.passwordTitleTxt}>Confirm your  password</Text>
												<TextInput
												clearButtonMode="always"
													autoCorrect={false}
													textContentType = {"none"}
													placeholder="Confirm Password"
													placeholderTextColor="#707070" 
													secureTextEntry={true}
													style={styles.passwordTextInput}
													autoCapitalize = 'none'
													onChangeText = {(password_conf) => this.setState({password_conf})}
													ref={ref =>  {this._password = ref;}}
													returnKeyType="done"
													
													/>
											</View>
										</View>		
										<View
											style={{
												flex: 2,
											}}/>
										<TouchableOpacity
											onPress={ this.loginFctNew}
											style={styles.grupo171Button}>
											<Text
												style={styles.grupo171ButtonText}>SAVE & LOGIN</Text>
										</TouchableOpacity>
										<View
										style={{
											flex: 1,
										}}/>	
										<TouchableOpacity
											style={styles.btnForgotTouch}
											onPress={  () => { this.setUserInterfface (1,"")}}>
										<Text
											style={styles.passwordRememberdText}>Cancel</Text>	
										</TouchableOpacity>	
										<View
											style={{
												flex: 2,
											}}/>		
									</View>
		
								</View>
						</View> 
						}			
						{ 
						this.state.user_interface_type == 4 && // Validation Code 
							<View   
								style={styles.viewCardShiftDayView}>

							<View
								pointerEvents="box-none"
								style={{
									position: "absolute",
									left: 0,
									right: 0,
									top: 110,
									//height: 285,
									alignItems: "center",
								}}>
	
								<View
									style={styles.viewTitleLogoView}>
									<Text
										style={styles.loginText}></Text>
								</View>


                                <View  style={styles.viewCardView}>
								<View
									  style={{
										flex: 1,
									}}/>									

									

									<Text
									    numberOfLines = { 2}
										style={styles.loginXuserText}></Text>
									<View
									  style={{
										flex: 2,  
									}}/>	

									<Text
									    numberOfLines = { 2}
										style={styles.smsAdviceSMSText}>An SMS has been sent to your mobile phone, please enter the verification code</Text>
								  <View
									  style={{
										flex: 2,  
									}}/>

                                <CodeFieldInput   
								  title = {""}
								  parentWindow = {this}
								/>
								

								{ this.state.rememberEmailField && 
									<View
										style={styles.viewUserFieldView}>
										<View
											pointerEvents="box-none"
											style={{
												position: "absolute",
												alignSelf: "center",
												top: 0,
												bottom: 0,
												justifyContent: "center",
											}}>
											<TextInput
											clearButtonMode="always"
												autoCorrect={false}
												placeholder="Email"
												placeholderTextColor="#707070" 
												style={styles.usernameTextInput}
												onChangeText = {(username) => this.setState({username})}
												autoCapitalize = 'none'
												ref={ref => { this._username = ref; }}
												returnKeyType= "next"
												keyboardType="email-address"
												textContentType = {"none"}
												///onSubmitEditing={() =>this._password.focus()}
												textContentType = {"none"}
												/>
										</View>
									</View>
	                             } 
									<View
										style={{
											flex: 2,
										}}/>
									<TouchableOpacity
										onPress={ this.loginFct}
										style={styles.grupo171Button}>
										<Text
											style={styles.grupo171ButtonText}>Next</Text>
									</TouchableOpacity>
									<View
										style={{
											flex: 1,
										}}/>
									<CountDown
										until={global.timeOutCodeView}
										size={18}
										onFinish={() => {this.onEndCodeValidity(3)}}
										digitStyle={{backgroundColor: 'transparent'}}
										digitTxtStyle={{color: "#8B1936"}}
										timeToShow={['M', 'S']}
										//timeLabels={{m: 'MM', s: 'SS'}}
										timeLabels={{m: null, s: null}}
										separatorStyle={{color: "#8B1936"}}
                                        showSeparator
									/>						
									<View
										style={{
											flex: 1,
										}}/>	
									<TouchableOpacity
									    style={styles.btnForgotTouch}
										onPress={  () => { this.setUserInterfface (1,"")}}>
									<Text
										style={styles.passwordRememberdText}>Cancel</Text>	
									</TouchableOpacity>	
									<View
										style={{
											flex: 2,
										}}/>		
								</View>
	
							</View>
					</View> 	
					}
					{ this.state.user_interface_type == 3 && //Personal Login 
					<View   
								style={styles.viewCardShiftDayView}>

							<View
								pointerEvents="box-none"
								style={{
									position: "absolute",
									left: 0,
									right: 0,
									top: 110,
									//height: 285,
									alignItems: "center",
								}}>
	
								<View
									style={styles.viewTitleLogoView}>
									<Text
										style={styles.loginText}>Login</Text>
								</View>


                                <View  style={styles.viewCardView}>
								<View
									  style={{
										flex: 1,
									}}/>									
								   <Text
										style={styles.welcomeText}>Welcome</Text>	
								   <View
									  style={{
										flex: 1,
									}}/>
									<Text
									    numberOfLines = { 2}
										style={styles.loginXuserText}>{this.state.user_name}</Text>
								   <Text
										style={styles.shareText}>Please never share your password or PIN with anyone else</Text>
					
									<View
									  style={{
										flex: .5,
									}}/>	
									<View
										style={styles.viewPasswordFieldView}>
										<View
											pointerEvents="box-none"
											style={{
												position: "absolute",
												alignSelf: "center",
												top: 0,
												bottom: 0,
												justifyContent: "center",
											}}>
											<TextInput
											clearButtonMode="always"
												autoCorrect={false}
												textContentType = {"none"}
												placeholder="Password"
												placeholderTextColor="#707070" 
												secureTextEntry={true}
												style={styles.passwordTextInput}
												autoCapitalize = 'none'
												onChangeText = {(password) => this.setState({password})}
												ref={ref =>  {this._password = ref;}}
												returnKeyType="done"
												
												/>
										</View>
					   
								    </View>		
									<View
										style={{
											flex: 2,
										}}/>
									<TouchableOpacity
										onPress={ this.loginFct}
										style={styles.grupo171Button}>
										<Text
											style={styles.grupo171ButtonText}>LOGIN</Text>
									</TouchableOpacity>
									<View
										style={{
											flex: 2,
										}}/>
									<TouchableOpacity
									    style={styles.btnForgotTouch}
										onPress={ this.onForgotPress}>
									<Text
										style={styles.passwordRememberdText}>Can't remember my password</Text>	
									</TouchableOpacity>	
									<View
										style={{
											flex: 2,
										}}/>		
								</View>
	
							</View>
					</View> 
					}				
					{ this.state.user_interface_type == 9 && //Send Reset Password Login general
					<View   
								style={styles.viewCardShiftDayView}>

							<View
								pointerEvents="box-none"
								style={{
									position: "absolute",
									left: 0,
									right: 0,
									top: 110,
									//height: 285,
									alignItems: "center",
								}}>
	
								<View
									style={styles.viewTitleLogoView}>
									<Text
										style={styles.loginText}></Text>
								</View>


                                <View  style={styles.viewCardView}>
								<View
									  style={{
										flex: 1,
									}}/>									
								   <Text
										style={styles.welcomeText}></Text>	
								   <View
									  style={{
										flex: 1,
									}}/>
									<Text
									    numberOfLines = { 2}
										style={styles.loginXuserText}></Text>
								   <Text
										style={styles.shareText}>Please type your email and we will send you a code </Text>
					
									<View
									  style={{
										flex: .5,
									}}/>	
									<View
										style={styles.viewPasswordFieldView}>
										<View
											pointerEvents="box-none"
											style={{
												position: "absolute",
												alignSelf: "center",
												top: 0,
												bottom: 0,
												justifyContent: "center",
											}}>
											<TextInput
											clearButtonMode="always"
												autoCorrect={false}
												textContentType = {"none"}
												placeholder="email"
												placeholderTextColor="#707070" 
												style={styles.passwordTextInput}
												autoCapitalize = 'none'
												onChangeText = {(username) => this.setState({username})}
												ref={ref =>  { this._password = ref;}}
												returnKeyType= "next"
												keyboardType="email-address"
												
												/>
										</View>
					   
								    </View>		
									<View
										style={{
											flex: 2,
										}}/>
									<TouchableOpacity
										onPress={ this.onForgotGeneralNextPress}
										style={styles.grupo171Button}>
										<Text
											style={styles.grupo171ButtonText}>Next</Text>
									</TouchableOpacity>
									<View
										style={{
											flex: 2,
										}}/>
									<TouchableOpacity
									    style={styles.btnForgotTouch}
										onPress={  () => { this.setUserInterfface (1,"")}}>
									<Text
										style={styles.passwordRememberdText}>Cancel</Text>	
									</TouchableOpacity>	
									<View
										style={{
											flex: 2,
										}}/>		
								</View>
	
							</View>
					</View> 
					}	
					{ this.state.user_interface_type == 19 && //Send Reset Password Login Try Again
					<View   
								style={styles.viewCardShiftDayView}>

							<View
								pointerEvents="box-none"
								style={{
									position: "absolute",
									left: 0,
									right: 0,
									top: 110,
									//height: 285,
									alignItems: "center",
								}}>
	
								<View
									style={styles.viewTitleLogoView}>
									<Text
										style={styles.loginText}></Text>
								</View>


                                <View  style={styles.viewCardView}>
								<View
									  style={{
										flex: 1,
									}}/>									
								   <Text
										style={styles.welcomeText}></Text>	
								   <View
									  style={{
										flex: 1,
									}}/>
									<Text
									    numberOfLines = { 2}
										style={styles.loginXuserText}></Text>
								   <Text
										style={styles.shareText}>Please type your email and we will send you a code. </Text>
					
									<View
									  style={{
										flex: .5,
									}}/>	
									<View
										style={styles.viewPasswordFieldView}>
										<View
											pointerEvents="box-none"
											style={{
												position: "absolute",
												alignSelf: "center",
												top: 0,
												bottom: 0,
												justifyContent: "center",
											}}>
											<TextInput
											clearButtonMode="always"
												autoCorrect={false}
												textContentType = {"none"}
												placeholder="email"
												placeholderTextColor="#707070" 
												style={styles.passwordTextInput}
												autoCapitalize = 'none'
												onChangeText = {(username) => this.setState({username})}
												ref={ref =>  { this._password = ref;}}
												returnKeyType= "next"
												keyboardType="email-address"
												
												/>
										</View>
					   
								    </View>		
									<View
										style={{
											flex: 2,
										}}/>
									<TouchableOpacity
										onPress={ this.onForgotTryAgainNextPress}
										style={styles.grupo171Button}>
										<Text
											style={styles.grupo171ButtonText}>Next</Text>
									</TouchableOpacity>
									<View
										style={{
											flex: 2,
										}}/>
									<TouchableOpacity
									    style={styles.btnForgotTouch}
										onPress={  () => { this.setUserInterfface (1,"")}}>
									<Text
										style={styles.passwordRememberdText}>Cancel</Text>	
									</TouchableOpacity>	
									<View
										style={{
											flex: 2,
										}}/>		
								</View>
	
							</View>
					</View> 
					}
					{ this.state.user_interface_type == 20 && // Validation Code & Login with SMS
							<View   
								style={styles.viewCardShiftDayView}>

							<View
								pointerEvents="box-none"
								style={{
									position: "absolute",
									left: 0,
									right: 0,
									top: 110,
									//height: 285,
									alignItems: "center",
								}}>
	
								<View
									style={styles.viewTitleLogoView}>
									<Text
										style={styles.loginText}></Text>
								</View>


                                <View  style={styles.viewCardView}>
								<View
									  style={{
										flex: 1,
									}}/>									

									

									<Text
									    numberOfLines = { 2}
										style={styles.loginXuserText}></Text>
									<View
									  style={{
										flex: 2,  
									}}/>	

									<Text
									    numberOfLines = { 2}
										style={styles.smsAdviceSMSText}>An SMS has been sent to your mobile phone, please enter the verification code</Text>
								  <View
									  style={{
										flex: 2,  
									}}/>

                                <CodeFieldInput   
								  title = {""}
								  parentWindow = {this}
								/>
								

								{ false && this.state.rememberEmailField && 
									<View
										style={styles.viewUserFieldView}>
										<View
											pointerEvents="box-none"
											style={{
												position: "absolute",
												alignSelf: "center",
												top: 0,
												bottom: 0,
												justifyContent: "center",
											}}>
											<TextInput
											clearButtonMode="always"
												autoCorrect={false}
												placeholder="Email"
												placeholderTextColor="#707070" 
												style={styles.usernameTextInput}
												onChangeText = {(username) => this.setState({username})}
												autoCapitalize = 'none'
												ref={ref => { this._username = ref; }}
												returnKeyType= "next"
												keyboardType="email-address"
												textContentType = {"none"}
												///onSubmitEditing={() =>this._password.focus()}
												textContentType = {"none"}
												/>
										</View>
									</View>
	                             } 
									<View
										style={{
											flex: 2,
										}}/>

								{ false &&  // Not use Next Button
									<TouchableOpacity
										onPress={ this.loginFct}
										style={styles.grupo171Button}>
										<Text
											style={styles.grupo171ButtonText}>Next</Text>
									</TouchableOpacity>
								}
									<View
										style={{
											flex: 1,
										}}/>
											
									<CountDown
										until={global.timeOutCodeView}
										size={18}
										onFinish={() => {this.onEndCodeValidity(1)}}
										digitStyle={{backgroundColor: 'transparent'}}
										digitTxtStyle={{color: "#8B1936"}}
										timeToShow={['M', 'S']}
										//timeLabels={{m: 'MM', s: 'SS'}}
										timeLabels={{m: null, s: null}}
										separatorStyle={{color: "#8B1936"}}
                                        showSeparator
									/>						
									<View
										style={{
											flex: 1,
										}}/>	
									<TouchableOpacity
									    style={styles.btnForgotTouch}
										onPress={  () => { this.setUserInterfface (1,"")}}>
									<Text
										style={styles.passwordRememberdText}>Cancel</Text>	
									</TouchableOpacity>	
									<View
										style={{
											flex: 2,
										}}/>		
								</View>
	
							</View>
					</View> 	
					}
				    { this.state.user_interface_type == 2 && // General Login
						<View   
								style={styles.viewCardShiftDayView}>

							<View
								pointerEvents="box-none"
								style={{
									position: "absolute",
									left: 0,
									right: 0,
									top: 110,
									//height: 285,
									alignItems: "center",
								}}>
	
								<View
									style={styles.viewTitleLogoView}>
									<Text
										style={styles.loginText}>Login</Text>
								</View>


                                <View  style={styles.viewCardView}>
								   <View
									  style={{
										flex: 2,
									}}/>
									<View
										style={styles.viewUserFieldView}>
										<View
											pointerEvents="box-none"
											style={{
												position: "absolute",
												alignSelf: "center",
												top: 0,
												bottom: 0,
												justifyContent: "center",
											}}>
											<TextInput
											clearButtonMode="always"
												autoCorrect={false}
												placeholder="Email"
												placeholderTextColor="#707070" 
												style={styles.usernameTextInput}
												onChangeText = {(username) => this.setState({username})}
												autoCapitalize = 'none'
												ref={ref => { this._username = ref; }}
												returnKeyType= "next"
												keyboardType="email-address"
												textContentType = {"none"}
												//onSubmitEditing={() =>this._password.focus()}
												/>
										</View>
					   
									</View>
									<View
									  style={{
										flex: .5,
									}}/>	
									<View
										style={styles.viewPasswordFieldView}>
										<View
											pointerEvents="box-none"
											style={{
												position: "absolute",
												alignSelf: "center",
												top: 0,
												bottom: 0,
												justifyContent: "center",
											}}>
											<TextInput
											clearButtonMode="always"
												autoCorrect={false}
												placeholder="Password"
												placeholderTextColor="#707070" 
												secureTextEntry={true}
												style={styles.passwordTextInput}
												autoCapitalize = 'none'
												onChangeText = {(password) => this.setState({password})}
												ref={ref =>  {this._password = ref;}}
												textContentType = {"none"}
												returnKeyType="done"
												
												/>
										</View>
					   
								    </View>		
									<View
										style={{
											flex: 2,
										}}/>
									<TouchableOpacity
										onPress={ this.loginFct}
										style={styles.grupo171Button}>
									{/* Button  Login AS DIFFEREN USER*/}		
										<Text
											style={styles.grupo171ButtonText}>LOGIN</Text>
									</TouchableOpacity>
									<View
										style={{
											flex: 2, 

										}}/>
									<TouchableOpacity
									    style={styles.btnForgotTouch}
										onPress={ this.onForgotGeneralPress}>
									<Text
										style={styles.passwordRememberdText}>Can't remember my password</Text>	
									</TouchableOpacity>	
									<View
										style={{
											flex: 2,
										}}/> 

									<View
										style={{
											flex: 2,
										}}/>
								</View>
	
							</View>
					</View> 
					}
					{ this.state.user_interface_type == 10 && // General Login Faild , New feature 
						<View   
								style={styles.viewCardShiftDayView}>

							<View
								pointerEvents="box-none"
								style={{
									position: "absolute",
									left: 0,
									right: 0,
									top: 110,
									//height: 285,
									alignItems: "center",
								}}>
	
								<View
									style={styles.viewTitleLogoView}>
									<Text
										style={styles.loginText}>Login</Text>
								</View>


                                <View  style={styles.viewCardView}>
								   <View
									  style={{
										flex: 2,
									}}/>
			
									<View
									  style={{
										flex: 1,
									}}>
										<Text
											style={styles.cadrSubTitleTxt} >
												Your user or password are incorrect</Text>

									</View>	
				
									<View
										style={{
											flex: 1,
										}}>
										
									</View>
									<TouchableOpacity
										//onPress={ this.loginFct}
										onPress={  () => { this.setUserInterfface (2,"")}}
										
										style={styles.grupo171Button}>
										<Text
											style={styles.grupo171ButtonText}>Try Again</Text>
									</TouchableOpacity>
									<View
										style={{
											flex: 2, 

										}}/>
									<TouchableOpacity
									    style={styles.btnForgotTouch}
										onPress={ this.onForgotTryAgainPress}>
									<Text
										style={styles.passwordRememberdText}>Can't remember my password</Text>	
									</TouchableOpacity>	
									<View
										style={{
											flex: 2,
										}}/> 
									<TouchableOpacity
									    style={styles.btnStillForgotTouch}
										onPress={ () => { 
											let code = connDBHelper.getSecureCode();
											console.log(code)
											this.setState({_folio:code});
											this.setState({ _modalNotLogin: true }) }
											 
											 }>
											
									<Text
										style={styles.passwordRememberdText}>I still can't Clock In</Text>	
									</TouchableOpacity>	
									
									<View
										style={{
											flex: 2,
										}}/>
								</View>
	
							</View>
					</View> 
					} 
					{ this.state.user_interface_type == 11 && // Login by SMSCode 
							<View   
								style={styles.viewCardShiftDayView}>

							<View
								pointerEvents="box-none"
								style={{
									position: "absolute",
									left: 0,
									right: 0,
									top: 110,
									//height: 285,
									alignItems: "center",
								}}>
	
								<View
									style={styles.viewTitleLogoView}>
									<Text
										style={styles.loginText}></Text>
								</View>


                                <View  style={styles.viewCardView}>
								<View
									  style={{
										flex: 1,
									}}/>									

									

									<Text
									    numberOfLines = { 2}
										style={styles.loginXuserText}></Text>
									<View
									  style={{
										flex: 2,  
									}}/>	

									<Text
									    
										style={styles.smsAdviceSMSText}>Enter your user email</Text>
								  <View
									  style={{
										flex: .7,  
									}}/>
									{ this.state.rememberEmailField && 
									<View
										style={styles.viewUserFieldView}>
										<View
											pointerEvents="box-none"
											style={{
												position: "absolute",
												alignSelf: "center",
												top: 0,
												bottom: 0,
												justifyContent: "center",
											}}>
											<TextInput
											clearButtonMode="always"
												autoCorrect={false}
												placeholder="Email"
												placeholderTextColor="#707070" 
												style={styles.usernameTextInput}
												onChangeText = {(username) => this.setState({username})}
												autoCapitalize = 'none'
												ref={ref => { this._username = ref; }}
												returnKeyType= "next"
												keyboardType="email-address"
												textContentType = {"none"}
												///onSubmitEditing={() =>this._password.focus()}
												textContentType = {"none"}
												/>
										</View>
									</View>
	                             }  
							     <View
									  style={{
										flex: 2,  
									}}/>
										<Text
									    numberOfLines = { 2}
										style={styles.smsAdviceSMSText}>An SMS has been sent to your mobile phone, please enter the verification code</Text>
								  <View
									  style={{
										flex: 1,  
									}}/>
                                <CodeFieldInput   
								  title = {""}
								  parentWindow = {this}
								/>
																
									<View
										style={{
											flex: 3,
										}}/>
									<TouchableOpacity
										onPress={ this.loginFctSMS}
										style={styles.grupo171Button}>
										<Text
											style={styles.grupo171ButtonText}>Next</Text>
									</TouchableOpacity>
									<View
										style={{
											flex: 1,
										}}/>
									<CountDown
										until={global.timeOutCodeView}
										size={18}
										onFinish={() => {this.onEndCodeValidity(1)}}
										digitStyle={{backgroundColor: 'transparent'}}
										digitTxtStyle={{color: "#8B1936"}}
										timeToShow={['M', 'S']}
										//timeLabels={{m: 'MM', s: 'SS'}}
										timeLabels={{m: null, s: null}}
										separatorStyle={{color: "#8B1936"}}
                                        showSeparator
									/>						
									<View
										style={{
											flex: 1,
										}}/>	
									<TouchableOpacity
									    style={styles.btnForgotTouch}
										onPress={  () => { this.setUserInterfface (1,"")}}>
									<Text
										style={styles.passwordRememberdText}>Cancel</Text>	
									</TouchableOpacity>	
									<View
										style={{
											flex: 2,
										}}/>		
								</View>
	
							</View>
					</View> 	
					}
				   { this.state.user_interface_type == 1 &&  // Multiple Login
						<View   
						   style={styles.viewCardUsersDayView}>
							<View
								pointerEvents="box-none" 
								style={{
									left: 0,
									right: 0,
									top: 0,
									alignItems: "center",
								}}>
 
								<View
									style={styles.viewTitleLogoView}>
									 <TouchableOpacity
								        onLongPress={
									        this.onVideoPlay 
									    }>
									   <Text
										    style={styles.loginText}>{this.state._title_users}</Text>
								      </TouchableOpacity>

										
								</View>		   
									   <ScrollView 
											style={styles.viewScrollView}>
											<ChildComponetsLogins  result={this.state.users}  nav ={this} /> 
											{global.debug_msg && <View><Text>{global.logs}</Text></View>}
										</ScrollView>
							       </View>
			             </View> 			
                   }					
		 			<View >
			{ 	 false &&  // Cancel popup no connection		
					<Modal
						visible={this.state._warning}
						onTouchOutside={() => {
						this.setState({ _warning: false });

						}}
						modalAnimation={new SlideAnimation({
							slideFrom: 'bottom',
						  })}
					  >
						<ModalContent >  
	
						  <View style={{
									left: 0,
									right: 0,
									top: 0,
									alignItems: "center",
									width: 500 , 
								}}>
						  <Text style={styles.txtCantTitle} > No Internet connection detected.></Text>	


							 <View
							style={{
								//width: 30,
								height: 100,
							}}/>

							<Text style={styles.txtPleaseText} > If you can’t connect to the internet please try to restart the iPad. If that doesn’t work please proceed...</Text>
							 
							 <Text style={styles.txtCantText} > To clock in or clock out without Internet use your mobile phone to send an SMS with the following code to</Text>

							 <Text style={styles.txtCantSubTitleText} > {sms_number}</Text>	

							 <Text style={styles.txtCantSubTitleTextBold} > {this.state._folio}  </Text>
							 

							 <Text style={styles.txtMaillText} > You must email a list of attendees to dev@phlebotomyusa.com</Text> 
							 <View
							style={{
								//width: 30,
								height: 40,
							}}/>
							 <TouchableOpacity
								onPress={() => {
									this.setState({ _warning: false });
									}}
								style={styles.grupo171Button}>
								<Text
									style={styles.grupo171ButtonText}>Close</Text>
							</TouchableOpacity>
							<View
							style={{
								//width: 30,
								height: 30,
							}}/>
						  </View>
						</ModalContent>
					</Modal>
}
					<Modal
						visible={ ! this.state.locationStatus}
						onTouchOutside={() => {
					//this.setState({ locationStatus: true });

						}}
						modalAnimation={new SlideAnimation({
							slideFrom: 'bottom',
						  })}
					  >
						<ModalContent >  
	
						  <View style={{
									left: 0,
									right: 0,
									top: 0,
									alignItems: "center",
									width: 500 , 
								}}>
						  <Text style={styles.txtCantTitle} > LOCATION </Text>	 


							 <View
							style={{
								//width: 30,
								height: 100,
							}}/>

							 
							 <Text style={styles.txtCantText} > </Text>

							 <Text style={styles.txtCantSubTitleText} > Your location is used to show your shift and classroom info.</Text>	
							 <Text style={styles.txtCantSubSubTitleText} >Turning on location services allows us to register your shift.</Text>	
							 <Text style={styles.txtCantSubTitleTextBold} > {this.state._folio}  </Text>
							 
							 <View
							style={{
								//width: 30,
								height: 40,
							}}/>
							 <TouchableOpacity
								onPress={() => {
									this.setState({ locationStatus: true });
									}}
								style={styles.grupo171Button}>
								<Text
									style={styles.grupo171ButtonText}>Close</Text>
							</TouchableOpacity>
							<View
							style={{
								//width: 30,
								height: 40,
							}}/>
							 <TouchableOpacity
								onPress={() => {
									 this.setState({ locationStatus: true });
									 Linking.openURL('app-settings://');

									}}
								style={styles.locationButton}>
                                 <Image
							         source={require("./../../assets/images/arrowFilled.png")}
							     style={styles.imgIconLocation}/>	
								<Text
									style={styles.grupo171ButtonText}>Current Location</Text>
							</TouchableOpacity>	
							<View
							style={{
								//width: 30,
								height: 30,
							}}/>
						  </View>
						</ModalContent>
					</Modal>


                   {/* ::  Camera status Modal    */}
				   <Modal
						visible={ ! this.state.cameraStatus && global.net_state.isConnected } // global.net_state.type  !== "none" 
						onTouchOutside={() => {
					     this.setState({ cameraStatus: true });

						}}
						modalAnimation={new SlideAnimation({
							slideFrom: 'bottom',
						  })}
					  >
						<ModalContent >  
	
						  <View style={{
									left: 0,
									right: 0,
									top: 0,
									alignItems: "center",
									width: 690 , 
									height: 900,
								}}>
						 	

                             <TouchableOpacity 
							          style={styles.containerBtnLogout}
									onPress={() => {
									this.setState({ debug: false });	
									}}> 
								<Image
									source={require("./../../assets/images/No_Camera.jpg")}
									style={styles.imgAdvertNoNotificationsImage}/>	
						     </TouchableOpacity> 
							

							 
							 <View
							    style={{
								//width: 30,
								height: 20,
							 }}/>
						 <View
							style={{
									backgroundColor:"transparent",
									//width: 608,
									marginTop: 11,
									flexDirection: "row",
									alignItems: "center"}
								}>
								    <View
										style={{
											flex: 1,
									}}/>
									<TouchableOpacity
										onPress={() => {
											 //this.permisionCameraFunction()
											
											this.setState({ cameraStatus: true });
											}}
										style={styles.grupo171Button}>
										<Text
											style={styles.grupo171ButtonText}>Close</Text>
									</TouchableOpacity>
									<View
										style={{
											flex: 1,
										}}/>
									
									<TouchableOpacity
										onPress={() =>  { 
											this.setState({ cameraStatus: true });
											Linking.openURL('app-settings://');

											}}
										style={styles.locationButton}>
										<Image
											source={require("./../../assets/images/camera.png")}
										style={styles.imgIconLocation}/>	
										<Text
											style={styles.grupo171ButtonText}>Edit Settings</Text>
									</TouchableOpacity>	
								    <View
										style={{
											flex: 1, 
									}}/>
							</View>

							<View
							style={{
								//width: 30,
								//height: 30,
								//alignItems: "flex-start",
							}}/>
						  </View>
						</ModalContent>
					</Modal>
				   {/*  Camera Modal ::*/}


                  {/* ::  Notification status Modal    */}
				  <Modal
						visible={  !this.state.notificationStatus &&  global.net_state.isConnected  } //   global.net_state.type  === "cellular"
						//visible= {this.state.cameraStatus}
						onTouchOutside={() => {
					     this.setState({ notificationStatus: true });

						}} 
						modalAnimation={new SlideAnimation({
							slideFrom: 'bottom',
						  })}
					  >
						<ModalContent >  
	
						  <View style={{
									left: 0,
									right: 0,
									top: 0,
									alignItems: "center",
									width: 690 , 
									height: 900,
								}}>
						 	

                             <TouchableOpacity 
							          style={styles.containerBtnLogout}
									onPress={() => {
									this.setState({ debug: false });	
									}}> 
								<Image
									source={require("./../../assets/images/No_Notifications.jpg")}
									style={styles.imgAdvertNoNotificationsImage}/>	
						     </TouchableOpacity> 
							

							 
							 <View
							    style={{
								//width: 30,
								height: 20,
							 }}/>
						 <View
							style={{
									backgroundColor:"transparent",
									//width: 608,
									marginTop: 11,
									flexDirection: "row",
									alignItems: "center"}
								}>
								    <View
										style={{
											flex: 1,
									}}/>
									<TouchableOpacity
										onPress={() => {
											// this.getLocationAsync();
											this.setState({ notificationStatus: true });
											}}
										style={styles.grupo171Button}>
										<Text
											style={styles.grupo171ButtonText}>Close</Text>
									</TouchableOpacity>
									<View
										style={{
											flex: 1,
										}}/>
									
									<TouchableOpacity
										onPress={() =>  { 
											this.setState({ notificationStatus: true });
											Linking.openURL('app-settings://');

											}}
										style={styles.locationButton}>
										<Image
											source={require("./../../assets/images/notifications_bell.png")}
										style={styles.imgIconLocation}/>	
										<Text
											style={styles.grupo171ButtonText}>Edit Settings</Text>
									</TouchableOpacity>	
								    <View
										style={{
											flex: 1, 
									}}/>
							</View>

							<View
							style={{
								//width: 30,
								//height: 30,
								//alignItems: "flex-start",
							}}/>
						  </View>
						</ModalContent>
					</Modal>
				   {/*  Notification Modal ::*/}


				   


                   {/* ::  Type Connection status Focus  Modal    */}
				   <Modal
						visible={ ! this.state.internetFocusStatus  }
						onTouchOutside={() => {
					     this.setState({ internetFocusStatus: true });

						}}
						modalAnimation={new SlideAnimation({
							slideFrom: 'bottom',
						  })}
					  >
						<ModalContent >  
	
						  <View style={{
									left: 0,
									right: 0,
									top: 0,
									alignItems: "center",
									width: 690 , 
									height: 900,
								}}>
						 	

                             <TouchableOpacity 
							          style={styles.containerBtnLogout}
									onPress={() => {
									this.setState({ debug: false });	
									}}> 
								<Image
									source={require("./../../assets/images/Not_Connected.jpg")}
									style={styles.imgAdvertNoNotificationsImage}/>	
						     </TouchableOpacity> 
							

							 
							 <View
							    style={{
								//width: 30,
								height: 20,
							 }}/>
						 <View
							style={{
									backgroundColor:"transparent",
									//width: 608,
									marginTop: 11,
									flexDirection: "row",
									alignItems: "center"}
								}>
								    <View
										style={{
											flex: 1,
									}}/>
									<TouchableOpacity
										onPress={() => {
											this.setState({ internetFocusStatus: true });
											let msg_ = "\n" + global.logs + "\n" +  "  === Try re-connect to Internet  ===" + "\n\n"
											global.logs  =  msg_
											console.log("msg_:" ,msg_)
											connectionHelper.isConnected()
											
											
											
										    
											}}
										style={styles.grupo171Button}>
										<Text
											style={styles.grupo171ButtonText}>Close</Text>
									</TouchableOpacity>
									<View
										style={{
											flex: 1,  
										}}/>
									 
									<TouchableOpacity 
										onPress={() => {
											this.setState({ internetFocusStatus: true });
											if(global.net_state.type !== 'wifi') Linking.openURL('App-Prefs:Data'); else  Linking.openURL('App-Prefs:WIFI');
											

											}}
										style={styles.connectionButton}>
										<Image
											source={require("./../../assets/images/celular_signal.png")}
										style={styles.imgIconLocation}/>	
										<Text
											style={styles.grupo171ButtonText}>Edit Settings</Text>
									</TouchableOpacity>	
								    <View 
										style={{
											flex: 1, 
									}}/>
							</View>

							<View
							style={{
								//width: 30,
								height: 20,
								//alignItems: "flex-start",
							}}/>
							<Text style={styles.txtCantSubSubTitleText} > Status : {(this.state.connectionStatus? "Connected, ":"Disonnected, " ) }  Connected to: {global.net_state.type} </Text>	
							

							
						  </View>
						</ModalContent>
					</Modal>
				   {/*  Type Connection Focus  Modal ::*/}



                   {/* ::  Type Connection status Modal    */}
				   <Modal
						visible={ ! this.state.internetStatus  }
						onTouchOutside={() => {
					     this.setState({ internetStatus: true });

						}}
						modalAnimation={new SlideAnimation({
							slideFrom: 'bottom',
						  })}
					  >
						<ModalContent >  
	
						  <View style={{
									left: 0,
									right: 0,
									top: 0,
									alignItems: "center",
									width: 690 , 
									height: 900,
								}}>
						 	

                             <TouchableOpacity 
							          style={styles.containerBtnLogout}
									onPress={() => {
									this.setState({ debug: false });	
									}}> 
								<Image
									source={require("./../../assets/images/Not_Connected.jpg")}
									style={styles.imgAdvertNoNotificationsImage}/>	
						     </TouchableOpacity> 
							

							 
							 <View
							    style={{
								//width: 30,
								height: 20,
							 }}/>
						 <View
							style={{
									backgroundColor:"transparent",
									//width: 608,
									marginTop: 11,
									flexDirection: "row",
									alignItems: "center"}
								}>
								    <View
										style={{
											flex: 1,
									}}/>
									<TouchableOpacity
										onPress={() => {
											let msg_ = "\n" + global.logs + "\n" +  "  === Try re-connect to Internet  ===" + "\n\n"
											global.logs  =  msg_
											console.log("msg_:" ,msg_)
											connectionHelper.isConnected()
											
											//this.componentDidMount()
											//this.setState({ internetStatus: true });
											this.setState({ internetStatus: true });
										    
											}}
										style={styles.grupo171Button}>
										<Text
											style={styles.grupo171ButtonText}>Close</Text>
									</TouchableOpacity>
									<View
										style={{
											flex: 1,  
										}}/>
									 
									<TouchableOpacity 
										onPress={() => {
											// seting = 'App-Prefs:WIFI'
											//this.setState({ internetStatus: true });
											//Linking.openURL('app-settings:{2}');
											//Linking.openURL('App-Prefs:Bluetooth');
											// Linking.openURL('App-Prefs:CellularData');
											// Linking.openURL('App-Prefs:root=CellularData');
											//Linking.openURL('App-Prefs:INTERNET_TETHERING');
											this.setState({ internetStatus: true });
											if(global.net_state.type !== 'wifi') Linking.openURL('App-Prefs:Data'); else  Linking.openURL('App-Prefs:WIFI');
											//com.phlebotomy.trainingmanager 

											}}
										style={styles.connectionButton}>
										<Image
											source={require("./../../assets/images/celular_signal.png")}
										style={styles.imgIconLocation}/>	
										<Text
											style={styles.grupo171ButtonText}>Edit Settings</Text>
									</TouchableOpacity>	
								    <View 
										style={{
											flex: 1, 
									}}/>
							</View>

							<View
							style={{
								//width: 30,
								height: 20,
								//alignItems: "flex-start",
							}}/>
							<Text style={styles.txtCantSubSubTitleText} > Status : {(this.state.connectionStatus? "Connected, ":"Disonnected, " ) }  Connected to: {global.net_state.type} </Text>	
							

							
						  </View>
						</ModalContent>
					</Modal>
				   {/*  Type Connection Modal ::*/}


                   {/* No Can'Login  , new feature*/}
					<Modal
						visible={this.state._modalNotLogin}
						onTouchOutside={() => {
						this.setState({ _modalNotLogin: false });

						}}
						modalAnimation={new SlideAnimation({
							slideFrom: 'bottom',
						  })}
					  >
						<ModalContent >  
	
						  <View style={{
									left: 0,
									right: 0,
									top: 0,
									alignItems: "center",
									width: 500 , 
								}}>
						  <Text style={styles.txtCantTitle} > I still can't Clock In</Text>	


							 <View
							style={{
								//width: 30,
								height: 100,
							}}/>

							<Text style={styles.txtPleaseText} > If you can’t connect to the internet please try to restart the iPad. If that doesn’t work please proceed..</Text>
							 
							 <Text style={styles.txtCantText} > To clock in or clock out without Internet use your mobile phone to send an SMS with the following code to</Text>

							 <Text style={styles.txtCantSubTitleText} > {sms_number}</Text>	

							 <Text style={styles.txtCantSubTitleTextBold} > {this.state._folio}  </Text>
							 

							 <Text style={styles.txtMaillText} > You must email a list of attendees to dev@phlebotomyusa.com</Text> 
							 <View
							style={{
								//width: 30,
								height: 40,
							}}/>
							{/* Send Login by SMS */}
							 <TouchableOpacity
								onPress={() => {
									this.setState({ _modalNotLogin: false });
									this.setUserInterfface (11,"");
									}}
								style={styles.grupo171Button}>
								<Text
									style={styles.grupo171ButtonText}>Next</Text>
							</TouchableOpacity>
							<View
							style={{
								//width: 30,
								height: 30,
							}}/>
						  </View>
						</ModalContent>
					</Modal>

				</View>			
                { this.state.lastBtn &&
					<TouchableOpacity 
						onPress={ () => {
							if (this.state.user_interface_type == 2 || this.state.user_interface_type == 7 || this.state.user_interface_type == 10 ||
								this.state.user_interface_type == 3 ) this.setUserInterfface (1,"")
							if (this.state.user_interface_type == 1) { this.setUserInterfface (2,""); this.setState({username: ""}) } 
						}}
						style={styles.btnCnt}>
						<Text
							style={styles.btnCntText}>{this.state.user_botton_text}</Text>
					</TouchableOpacity>
	               } 
						<View  style={[styles.containerWait, !this.state._waiting ? styles.containerHiddend : {}]}>
							<ActivityIndicator size="large" color="#ffff"  />    
						</View>	

				   	<View style={styles.viewSendErrorButton}>
				   		<SubmitErrorButton callbackFunction={this.showSendErrorScreen} nav={this.props.navigation}/>
					</View>
					
				<LoginStates 
				  functionCheckStatus = {this.setStatusAll}
				  functionSetConection =  {this.changeStatus}
				></LoginStates>		
				
			</View> 
			</ImageBackground>	
	}
    

 loginFctNew = () =>{ 
	//	console.log(connectionHelper.isConnected());
   /*
		if(global.nologin === 1 ) {
			console.log(global.email);
			console.log(global.password);
			this.setState({
				username : global.email,
			});
			this.setState({
				password :global.password,
			});
			console.log("user:  " +this.state.username);
			console.log("pw "+ this.state.password);
		}
		*/
		if(this.state.password_conf.trim()  == ''  ){
		  
		  Alert.alert(
			'Attention !',
			'The Confirm Password field cannot be empty.',
			[
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			],
			{cancelable: false},
		  );
		 // this.emailInput.current.focus;
		  return ;
		  
		} 
		if(this.state.password.trim()  == '' ){  
			  
		  Alert.alert(
			'Attention !',
			'The Password field cannot be empty',
			[
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			],
			{cancelable: false},
		  );
		  return ;
		}

		if(this.state.password  != this.state.password_conf ){  
			  
			Alert.alert(
			  'Attention !',
			  'The entered values do not match.',
			  [
				{text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  {cancelable: false},
			);
			return ;
		  }


		//if(connectionHelper.isConnected() !== 1) {
		//	var passed = false;
		//	connDBHelper.localLogin(this.state.username.trim(),this.state.password.trim(),this ) ;


			//let objResultTxt = "";
			//if(connectionHelper.isConnected() !== 1) {
				//connDBHelper.getShift(global.user_id,Date.now(),this);
	
				//console.log(this.state._objResultTxt);
				//if(this.state._objResultTxt !== null){
				//	objResultTxt = this.state._objResultTxt.object;
			//		console.log(this.state._objResultTxt);
			//	} 
				 
				//
				//connectionHelper.isConnected();
			//	return;
			//}	

		 //  return;
		//}

		if(global.debug){
			Toast.show("You are connecting to:" + global.host,{
				position: Toast.position.center,
				containerStyle:{
					backgroundColor: 'gray'
				},
				duration	: 1000	,
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

	    let _body =  JSON.stringify({
			new_password : this.state.password.trim(),
			confirm_password : this.state.password_conf.trim(),
			verification_code :  this.state._codeVerify })
		
	
		console.log("BODY",_body)	
        console.log("BODY",this.state.user_id)	
		this.setState({_waiting : true})
		//if(global.connection == 0) this.setState({_waiting : false})
		_url =global.host + '/api/ipad/reset_password/'+this.state.user_id; 
		fetch(_url,{
			method: 'POST',
			headers: {
			   'Accept': 'application/json',
			   'Content-Type': 'application/json', 
			   "cache-control": "no-cache"
			   
			},
			body:
		       _body
		  }).then((response) =>  response.text()) //response.json())
				.then((responseData) =>
				 {
				  	global.logs = ErrorHandler.setMessageResponse( "",_body,responseData,"response","",_url,global.id,global.name ,global.email);


				   this.setState({_waiting : false})
				   try {
					   var responseTXT = responseData;
					   var responseJSON = JSON.parse (responseTXT);
					  
					   this.setState({
						   data :responseJSON
					   });
					   
   
						   if(responseJSON['access_token'] !== undefined) 
						   {

							   this.setState({
								   authenticated :1,
								   password:"",
								   password_conf:"",
								   _waiting:""
							   }); 
							   global.access_token = responseJSON['access_token'];
							   global.token_type = responseJSON['token_type'];
							   global.expires_at = responseJSON['expires_at'];
							   global.foto = responseJSON['foto'];
							   global.email = this.state.user_email;
							   global.user_id = responseJSON['user_id'];
							   
							   connDBHelper.saveLogin(this.state.username.trim(),this.state.password.trim() ,responseJSON['user_id'], String(responseJSON['login_time']));

								this.onLoginSuccess();	
								this.setUserInterfface (1,"")
							  		
						   }
						   else{
							   this.setState({
								   authenticated :0
							   });
							   if(responseJSON['data'] === 'noactivo'){
								   Alert.alert( 'Attention !', responseJSON['message']);
								   return;
							   }
							   this.setState({
								 user_interface_type : 10
							    });
							   
								/*
								Alert.alert("Authentication failed "," Incorrect password", [
								{
										text: "OK",
										onPress: () => {
											
											this.setState({
												_showButtonCntRemember :true
											});
										},
									}]);
								*/	
						   }
				   } catch (e) {
					   console.log(e);
					   global.logs = ErrorHandler.setMessageResponseAdd( global.logs,"","","error",e.toString(),_url,global.id,global.name ,global.email);

					   this.setState({
						   authenticated :0
					   });
					   Alert.alert("Error:", "Problems connecting to the Server.");
					   this.setState({_waiting : false})
					   return;

				   }  
				}).catch((error) => {
				   global.logs = ErrorHandler.setMessageResponseAdd( global.logs,"","","error",error.toString(),_url,global.id,global.name ,global.email);

				  //dispatch(error('There was a problem with the request.'));
				  console.log(error);	 
				  console.error(error);
				  this.setState({
					 authenticated :0
				   });
				   this.setState({_waiting : false})
				});

	  } 

	loginPIN = async (username,pin) =>{ 

		let body_data = JSON.stringify({
			email: username.trim(),
			pin: pin ,
			app_release :  Constants.manifest.version  + " (" + Constants.manifest.ios.buildNumber+")"
		  })
	
	
		this.setState({_waiting : true})
		//if(global.connection == 0) this.setState({_waiting : false})
		var _url = global.host + '/api/auth/login_pin';
		fetch(_url,{
			method: 'POST',
			headers: {
			   'Accept': 'application/json',
			   'Content-Type': 'application/json', 
			   "cache-control": "no-cache"
			   
			},
			body: body_data
		   
		  }).then((response) =>  response.text()) //response.json())
				.then((responseData) =>
				 {
				   
                   global.logs = ErrorHandler.setMessageResponse( "",body_data,responseData,"response","",_url,global.id,global.name ,global.email);

				   this.setState({_waiting : false})
				   try {
					   var responseTXT = responseData;
					   var responseJSON = JSON.parse (responseTXT);
					   this.setState({
						   data :responseJSON
					   });
						// console.log(responseData);
   
						   if(responseJSON['access_token'] !== undefined) 
						   {

							   this.setState({
								   authenticated :1,
							   });

							   this.setState({pin_entered:pin})  // Set Success PIN

							   global.access_token = responseJSON['access_token'];
							   global.token_type = responseJSON['token_type'];
							   global.expires_at = responseJSON['expires_at'];
							   global.email = this.state.username.trim();
							   global.user_id = responseJSON['user_id'];
							   global.haspin = responseJSON['has_pin'];
 
							   this.onLoginSuccess();
							   this.setUserInterfface (1,"")
						   }else{
							   console.log("loginPIN failure");
							   this.setState({
								   authenticated :0
							   });
							   Toast.show("Incorrect PIN Code " ,{
								position: Toast.position.center,
								containerStyle:{
									backgroundColor: 'orange'
								},
								duration	: 1500	,
								delay : 500,
								textStyle:{
									color:'#fff',
								   },
								imgSource: null,
								imgStyle: {},
								mask: false,
								maskStyle:{}
							  })
							  
							   this.setState({pin_entered:""}) // Set Unsuccess PIN
							   if(responseJSON['data'] === 'noactivo'){
								   Alert.alert( 'Attention !', responseJSON['message']);
								   return;
							   }


						   }
				   } catch (e) {
					   console.log(e);
					   this.setState({
						   authenticated :0
					   });
					   Alert.alert("Error:", "Problems connecting to the Server.");
			           global.logs = ErrorHandler.setMessageResponseAdd( global.logs,"","","error",e.toString(),_url,global.id,global.name ,global.email);

					   this.setState({_waiting : false})
					   return;

				   }  
				}).catch((error) => {
					console.log(error);
				  //dispatch(error('There was a problem with the request.'));
				  console.log(error);	 
				  console.error(error);
                  global.logs = ErrorHandler.setMessageResponseAdd( global.logs,"","","error",error.toString(),_url,global.id,global.name ,global.email);

				  this.setState({
					 authenticated :0
				   });
				   this.setState({_waiting : false})
				});

	  } 

	loginFctSMS = () =>{   
		Alert.alert(
			'Attention !',
			'Login By SMS.',
			[
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			],
			{cancelable: false},
		  );
	}
		
 loginFct = async () =>{ 
                let xx =  await connectionHelper.isConnected();
		        if(global.nologin === 1 ) {

					this.setState({
						username : global.email, 
					});
					this.setState({
						password :global.password,
					});

				}

				if(this.state.username.trim()  == ''  ){
				  
				  Alert.alert(
					'Attention !',
					'The email field cannot be empty.',
					[
					  {text: 'OK', onPress: () => console.log('OK Pressed')},
					],
					{cancelable: false},
				  );
				 // this.emailInput.current.focus;
				  return ;
				  
				} 
				if(this.state.password.trim()  == '' ){  
				  	
				  Alert.alert(
					'Attention !',
					'The Password field cannot be empty.',
					[
					  {text: 'OK', onPress: () => console.log('OK Pressed')},
					],
					{cancelable: false},
				  );
				  return ;
				}
		
				await connectionHelper.isConnectedToAPI()
				
				global.logs  =  "\n" + global.logs + "\n" +  " Try Login , global.connection: " + global.connection +"\n\n"
				if(global.connection !== 1) {
					var passed = false;
					//connDBHelper.localLogin(this.state.username.trim(),this.state.password.trim(),this ) ;
                  // return; 
				}


				if( global.connection != 1) {
					global.logs = global.logs  +  " \n \n Network request failed, 'No internet connection'  \n \n"
					this.setState({internetStatus:false});  

					const timeOutList = TimerMixin.setTimeout(
						() => { 
							console.log('I do not leak!');
							
							Toast.show("Network request failed, 'No internet connection' " ,{
								position: Toast.position.center,
								containerStyle:{
									backgroundColor: '#8B1936'
								},
								duration	: 3500	,
								delay : 500,
								textStyle:{
									color:'#fff',
								   },
								imgSource: null,
								imgStyle: {},
								mask: false,
								maskStyle:{}
							  })

							  console.log("no internet connection")
							 
			
							return;
						},
						12000
					  ); 	
					  
					  
					return;
				}

				if(global.debug){
					Toast.show("You are connecting to:" + global.host,{
						position: Toast.position.center,
						containerStyle:{
							backgroundColor: 'gray'
						},
						duration	: 1000	,
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

				let body_data = JSON.stringify({
					email: this.state.username.trim(),
					password: this.state.password.trim() ,
					app_release :  Constants.manifest.version  + " (" + Constants.manifest.ios.buildNumber+")"
				  })
			
	
				this.setState({_waiting : true})
				
				const timeOutLogin = TimerMixin.setTimeout(
					() => { 
						
					
						Toast.show("Network request failed " ,{
							position: Toast.position.center,
							containerStyle:{
								backgroundColor: '#8B1936'
							},
							duration	: 3500	,
							delay : 500,
							textStyle:{
								color:'#fff',
							},
							imgSource: null,
							imgStyle: {},
							mask: false,
							maskStyle:{}
						})
		

						  this.setState({_waiting : false});

						return;
					},
					12000
				  ); 	
				// xxx  	
                let _url = global.host + '/api/auth/login';
                console.log("Before Login fetch, global.connection: ",global.connection)
				if(global.connection === 1)
				{
						fetch(_url,{
							method: 'POST',
							headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json', 
							"cache-control": "no-cache"
							
							},
							body: body_data
						
						}).then((response) =>  response.text()) //response.json())
							.then((responseData) =>
								{
									console.log("responseData::",responseData)
									global.logs = ErrorHandler.setMessageResponse( "",body_data,responseData,"response","",_url,global.id,global.name ,global.email);
									TimerMixin.clearTimeout(timeOutLogin);
								this.setState({_waiting : false})
								try {
									var responseTXT = responseData;
									var responseJSON = JSON.parse (responseTXT);
									this.setState({
										data :responseJSON
									});
										
				
										if(responseJSON['access_token'] !== undefined) 
										{
									
											this.setState({
												authenticated :1,
												password:"",
												password_conf:"",
											});


											global.access_token = responseJSON['access_token'];
											global.token_type = responseJSON['token_type'];
											global.expires_at = responseJSON['expires_at'];
											global.foto = responseJSON['foto'];
											global.email = this.state.username.trim();
											global.user_id = responseJSON['user_id'];
				
											connDBHelper.saveLogin(this.state.username.trim(),this.state.password.trim() ,responseJSON['user_id'], String(responseJSON['login_time']));
											
											if( ! responseJSON['has_pin'] )	{
												this.setUserInterfface (6,"")
												return
											}  
											this.onLoginSuccess();
											this.setUserInterfface (1,"")
										}else{
											this.setState({
												authenticated :0
											});
											if(responseJSON['data'] === 'noactivo'){
												Alert.alert( 'Attention !', responseJSON['message']);
												return;
											}
											this.setState({
												_showButtonCntRemember :true
											});
											/*
											// SMS by Login CASE
											this.setState({
												user_interface_type : 10
												});
												
												*/
											
											/*  Coment dis Alert when activate SMS by Login */	
											Alert.alert("Authentication failed "," Incorrect email or password", [{
												text: "Cancel",
												style: "cancel",
												onPress: () => {
													},
													}, {
														text: "OK",
														onPress: () => {

														},
													}]);
												
												
														
										}
								} catch (e) {
									console.log(e);
									this.setState({
										authenticated :0
									});
									Alert.alert("Error:", "Problems connecting to the Server.");
									this.setState({_waiting : false})
									return;
				
								}  
								}).catch((error) => {
									
								//dispatch(error('There was a problem with the request.'));
								console.log(error);	 
								console.error(error);
								this.setState({
									authenticated :0
								});
								this.setState({_waiting : false})
								});
				
					} // End If 
				}	

}

export class ChildComponetsLogins extends React.Component{
	
	constructor(props) {
		super(props);
		this.state = {
		};
	}
   	
	onIndividualUserPressed (user,context){
		console.log(user)
		context.setState({username: user.email})
		context.setState({user_name:user.name})
		context.setState({user_email:user.email})
		context.setState({user_id:user.id})
		global.haspin = user.has_pin  || global.haspin ;
	console.log("global.haspin :::",global.haspin)	
		if(global.haspin){
			context.setUserInterfface( 7,user.name) //3 has PIN, PIN Login
		}else{
			context.setUserInterfface( 3,user.name)  //3 with out PIN
		}
	}

	render(){
		if(this.props.result){  
			
			var res = this.props.result.map((item,i)=>{
				return(  
					<View  key={item.id}>
						<View 
						  style={styles.viewCardUsersView}>
								<View
									style={{
										flex: 1,
									}}/>
									<Text
									    numberOfLines = { 2}
										style={styles.loginXuserText}>{item.name}</Text>
									<View
									style={{
										flex: .5,
									}}/>	
								
									<View
										style={{ 
											flex: .5,
										}}/>
									<TouchableOpacity
										
										onPress={ () => {
											this.onIndividualUserPressed (item,this.props.nav);
										}}
										style={styles.grupo171Button}>
										<Text
											style={styles.grupo171ButtonText}>This is me</Text>
									</TouchableOpacity>
									<View
										style={{
											flex: 1,
										}}/>
								</View>	
				
 						</View>	
						
			   )
			})

		}
		return ( 
			<View>{res}</View> 
		)
	}
}



const styles = StyleSheet.create({

    imgAdvertNoNotificationsImage: {
		resizeMode: "contain",
		backgroundColor: "transparent",
		//width: 600, 
		height: 790,
		//marginTop: 9,
	},
	passwordTitleTxt: {
		color: "#8B1936",
		fontFamily: "Montserrat-Regular",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		marginBottom:10,
		left: -12,
	},
	cadrSubTitleTxt: {
		color: "black",
		fontFamily: "Montserrat-Regular",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "normal",
		//textAlign: "left",
		backgroundColor: "transparent",
		//marginBottom:10,
		
	},
	
    imgIconNoLogIn: {
		resizeMode: "cover",
		backgroundColor: "transparent",
		width: 18,
		height: 26,
		marginTop: 9,
		right:12,
	},
    imgIconLocation: {
		resizeMode: "contain",
		backgroundColor: "transparent",
		width: 18,
		height: 26,
		//marginTop: 9,
		right:8,
	},	
	txtPleaseText: {
		color: "#8B1936",
		fontFamily: "Montserrat-Regular",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		//marginLeft: 9,
		//marginRight: 14,
		width: 430,
		marginTop: 0,
		marginBottom: 40,
	},	
	txtCantText: {
		color: "#8B1936",
		fontFamily: "Montserrat-Regular",
		fontSize: 15,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		marginLeft: 9,
		marginRight: 14,
		marginTop: 0,
		marginBottom: 20,
	},	
	txtMaillText: {
		color: "#8B1936",
		fontFamily: "Montserrat-Regular",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "center",
		backgroundColor: "transparent",
		//marginLeft: 9,
	    //marginRight: 14,
		width: 500,
		marginTop: 0,
		marginBottom: 20,
	},	
	txtDataText: {
		color: "#8B1936",
		fontFamily: "Montserrat-Bold",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		marginLeft: 9,
		marginRight: 10,
		marginTop: 0,
		marginBottom: 20,
	},	
	txtCantSubTitleText: {
		color: "#8B1936",
		fontFamily: "Montserrat-Regular",
		fontSize: 21,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "center",
		backgroundColor: "transparent",
		marginLeft: 9,
		marginRight: 14,
		marginTop: 0,
		marginBottom:30,
	},
	txtCantSubSubTitleText: {
		color: "#8B1936",
		fontFamily: "Montserrat-Regular",
		fontSize: 15,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "center",
		backgroundColor: "transparent",
		marginLeft: 9,
		marginRight: 14,
		marginTop: 0,
		marginBottom:30,
	},		
	txtCantSubTitleTextBold: {
		color: "#8B1936",
		fontFamily: "Montserrat-Bold",
		fontSize: 21,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
		backgroundColor: "transparent",
		marginLeft: 9,
		marginRight: 14,
		marginTop: 0,
		marginBottom:30,
	},
	txtCantTitle: {
		color: "#8B1936",
		fontFamily: "Montserrat-Regular",
		fontSize: 34,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "center",
		backgroundColor: "transparent",
		marginLeft: 9,
		marginRight: 14,
		marginTop: 0,
	},	
	viewCardView: {
		backgroundColor: "#FFFFFF",
		alignSelf: "center",
		height: 380,
		width: 400,
		alignItems: "center",
		borderRadius:20,
		borderWidth: 1,
		borderColor: '#fff'
	},
	viewCardViewPIN: {
		backgroundColor: "#FFFFFF",
		alignSelf: "center",
		height: 610,
		width: 400,
		alignItems: "center",
		borderRadius:20,
		borderWidth: 1,
		borderColor: '#fff'
	},
	viewCardViewPINEnter: {
		backgroundColor: "#FFFFFF",
		alignSelf: "center",
		height: 580,
		width: 400,
		alignItems: "center",
		borderRadius:20,
		borderWidth: 1,
		borderColor: '#fff'
	},
	viewCardUsersView: {
		backgroundColor: "#FFFFFF",
		alignSelf: "center",
		height: 180,
		width: 400,
		alignItems: "center",
		borderRadius:20,
		borderWidth: 1,
		borderColor: '#fff',
		marginTop:12,
	},	
	viewCardShiftDayView: {
		backgroundColor: "transparent",
		shadowColor: "rgba(0, 0, 0, 0.15)",
		shadowRadius: 20,
		shadowOpacity: 1,
		height: 317,
		marginLeft: 137,
		marginRight: 157,
		marginTop: 24,
	},
	viewCardUsersDayView: {
		backgroundColor: "transparent",
		shadowColor: "rgba(0, 0, 0, 0.15)",
		shadowRadius: 20,
		shadowOpacity: 1,
		height: 557,
		marginLeft: 137,
		marginRight: 157,
		marginTop: 124,
	},	
	imageBack: {
		flex: 1,
		resizeMode: "stretch",
		justifyContent: "center"
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
	viewView: {
		backgroundColor: "transparent",
		flex: 1,
		alignItems: "center",
	},
	viewHeaderView: {
		backgroundColor: "transparent",
		width: 333,
		height: 93,
		marginTop: 12,
		alignItems: "center",
	},
	phleicoImage: {
		backgroundColor: "transparent",
		shadowColor: "rgba(157, 237, 137, 0.79)",
		shadowRadius: 5,
		shadowOpacity: .7,
		resizeMode: "contain",
		width: 433,

	},
	union10Image: {
		resizeMode: "contain",
		backgroundColor: "transparent",
		position: "absolute",
		left: 75,
		right: 37,
		top: 0,
		height: 416,
	},
	viewTitleLogoView: {
		backgroundColor: "transparent",
		width: 78,
		height: 61,
		alignItems: "center",
	},
	loginText: {
		backgroundColor: "transparent",
		color: "#8B1936",
		fontSize: 38,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "center",
		width: 410,
	},
	welcomeText: {
		backgroundColor: "transparent",
		color: "black",
		fontSize: 38,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "center",
		width: 378,
	},	
	shareText: {
		backgroundColor: "transparent",
		color: "black",
		fontSize: 13,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "center",
		width: 368,
		marginTop:10,
	},
	passwordRememberdText: {
		backgroundColor: "transparent",
		color: "#8B1936",
		fontSize: 15,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "center",
	},
	smsAdviceSMSText: {
		backgroundColor: "transparent",
		color: "black",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		paddingLeft:20,
		paddingRight:20,
		width: 340,
	},	
	loginXuserText: {
		backgroundColor: "transparent",
		color: "#8B1936",
		fontSize: 30,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "center",
		paddingLeft:15,
		paddingRight:15,
		width: 378,
	},	
	lineLogoView: {
		backgroundColor: "rgb(93, 159, 255)",
		width: 73,
		height: 5,
		marginLeft: 4,
		marginTop: 13,
	},
	viewUserFieldView: {
		backgroundColor: "transparent",
		borderRadius: 27.5,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.6)",
		borderStyle: "solid",
		width: 300,
		height: 55,
		marginTop: 9,
		marginLeft: 40,
	},
	usernameTextInput: {
		backgroundColor: "#DADBDD",
		opacity: 0.7,
		paddingLeft : 15,
		color: "#0D0C0C",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 315,
		height: 43,
		borderRadius: 27.5,
		borderWidth: 1,
		borderColor: "#CCC7C7",
		left: -20,
	},
	hostTextInput: {
		backgroundColor: "blue",
		opacity: 0.5,
		padding: 0,
		color: "white",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 391,
		height: 33,
	},	
	NotificationTokenIdText	: {
		backgroundColor: "transparent",
		opacity: 0.5,
		padding: 0,
		color: "white",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 391,
		height: 33,
	},	
	imgBackUserImage: {
		resizeMode: "cover",
		backgroundColor: "transparent",
		position: "absolute",
		left: 0,
		width: 50,
		top: 0,
		height: 44,
	},
	iconUserImage: {
		resizeMode: "cover",
		backgroundColor: "transparent",
		position: "absolute",
		left: 14,
		width: 16,
		top: 14,
		height: 16,
	},
	viewPasswordFieldView: {
		backgroundColor: "rgba(255, 255, 255, 0.09)",
		borderRadius: 27.5,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.6)",
		borderStyle: "solid",
		width: 300,
		height: 55,
		marginTop: 34,
		marginLeft: 40,

	},
	passwordTextInput: {
		backgroundColor: "#DADBDD",
		opacity: 0.7,
		paddingLeft : 15,
		color: "#0D0C0C",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 315,
		height: 43,
		borderRadius: 27.5,
		borderWidth: 1,
		borderColor: "#CCC7C7",
		left: -20,
	},
	imgBckPwImage: {
		resizeMode: "cover",
		backgroundColor: "transparent",
		position: "absolute",
		left: 0,
		width: 50,
		top: 0,
		height: 44,
	},
	iconPwImage: {
		resizeMode: "cover",
		backgroundColor: "transparent",
		position: "absolute",
		left: 15,
		width: 14,
		top: 15,
		height: 16,
	},
	viewForgotButtonText: {
		color: "white",
		fontFamily: "Raleway",
		fontSize: 13,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "right",
	},
	releaseText: {
		color: "white",
		fontFamily: "Raleway",
		opacity: 0.7,
		fontSize: 15,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "right",
		top:100,
	},
	viewForgotButton: {
		backgroundColor: "transparent",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		alignSelf: "stretch",
		height: 16,
		marginLeft: 186,
		marginRight: 147,
		marginTop: 47,
		
	},
	viewForgotButtonImage: {
		resizeMode: "cover",
		marginRight: 10,
	},
	btnStillForgotTouch:{
		backgroundColor: "#DADBDD",
		borderRadius: 25,
		shadowColor: "rgba(255, 45, 102, 0.72)",
		shadowRadius: 3,
		shadowOpacity: 1,
		opacity:.3,
		paddingTop:5,
		paddingLeft: 15,
		paddingRight:15,
		height: 30,
		width :250,
		borderColor:"gray",
		borderRadius:20,
		borderWidth: 1,
	},
	btnForgotTouch: {
		backgroundColor: "transparent",
		borderRadius: 25,
		shadowColor: "rgba(255, 45, 102, 0.72)",
		shadowRadius: 3,
		shadowOpacity: 1,
		opacity:.3,
		paddingTop:5,
		paddingLeft: 15,
		paddingRight:15,
		height: 30,
		width :250,
		borderColor:"gray",
		borderRadius:20,
		borderWidth: 1,
	},
	btnCnt: {
		position:"absolute",
		backgroundColor: "transparent",
		borderRadius: 25,
		shadowColor: "rgba(255, 45, 102, 0.72)",
		shadowRadius: 3,
		shadowOpacity: 1,
		opacity:.3,
		paddingLeft: 15,
		paddingRight:15,
		height: 40,
		bottom:50,
		borderColor:"gray",
		borderRadius:20,
		borderWidth: 1,
	},
	grupo171Button: {
		backgroundColor: "#8B1936",
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
	connectionButton: {
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
		width :240,
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
	grupo171ButtonImage: {
		resizeMode: "contain",
		marginRight: 10,
	},
	btnCntText: {
		marginTop:8,
		color: "white",
		fontFamily: "Raleway-Bold",
		fontSize: 17,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
	},
	grupo171ButtonText: {
		color: "white",
		fontFamily: "Raleway-Bold",
		fontSize: 15,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
	},
	viewNoLogin: {
		position: "absolute",
		backgroundColor: "transparent",
		marginTop: 19,
		right : 12,
		//alignItems: "center",
	},
	viewSendErrorButton:{						
	position: "absolute",
    right : 35,
	top: 965,
	alignSelf: "flex-end",
   },
})
