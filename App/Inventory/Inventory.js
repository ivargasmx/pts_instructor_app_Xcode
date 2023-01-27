//
//  ClockOut
//  Ipad Trainer Portal-r4
//
//  Created by [Author].
//  Copyright © 2018 [Company]. All rights reserved.
// Modify:
//  /Volumes/MAC HD DATA/Desarrollo/Jon/Laravel/phlebotomyiPad/node_modules/react-native-range-slider-expo/src/Slider.tsx
// Replace  node_modules/react-native-range-slider-expo/src/Slider.tsx 
//          node_modules/react-native-number-please/dist/src/NumberPlease.js
import React , {useState} from "react"
import { Image, StyleSheet, Text, 
	     TextInput, TouchableOpacity, 
		 View,Alert,ScrollView,Dimensions,
		 ActivityIndicator,Switch,SafeAreaView,
		 SectionList,FlatList } from "react-native"
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import RangeSlider, { Slider } from 'react-native-range-slider-expo';
// import NumberPlease from "react-native-number-please";
import WheelPickerExpo from 'react-native-wheel-picker-expo';


import connDBHelper   from "../Helper/Dao";
import connectionHelper   from "../Helper/Connection"; 
import ShiftHeader from "../Headers/ShiftHeader"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Moment from 'moment'; 
import "./../../global.js";
import { getCenter } from "geolib";
import * as ScreenOrientation from 'expo-screen-orientation';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import  Modal,{SlideAnimation, ModalContent,ModalButton } from 'react-native-modals';
import ErrorHandler    from "../Helper/ErrorHandler" 
import authHelper   from "../Helper/Sessions";
import Toast from 'react-native-tiny-toast';

//var RNFS = require('react-native-fs');

const FRACQTYITEM = [["", " ¼"," ½"," ¾"],[0, 1,2,3], [0, .25,.5,.75] ]
//const FRACQTYITEM[2,4] = [ {"":0}, {"1/4":.25}, {"1/2":.5}, {"3/4":0.75} ]    
const INTQTYITEM = '0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50'.split(',');
const wheelRef = React.useRef<WheelPickerExpo>({fontSize:28});

export default class Inventory extends React.Component {

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
			current_screen : "Inventory",
            fromValue:0,
            toValue:0,
            value:0,
			_course : this.props.navigation.state.params.course,
			_roll:0,
			_documents:1,
			_trash:false,
			_wipe:1,
			_restock:0,
			_breaks:0,
			tostVisible:false,
			localClockIn: [],
			data: [],
			cityName : "",
			notes: "",
			_waiting: false,
			_restockSecction: true,
			_checkedInventory: false,
			_endCheckedInventory: false,
			shift_hours :0,
			imageType:"",
			itemsInventaryList: null,
			item: null,
			currentCategory:"",
			currentItemInventary: 0,   /////////////////////////////////// 37
			currentItemPicture:null,
			comment : " ",
			commentBackStock : "",
            powderblue:{
                flexGrow: 0,
                flexShrink: 1,
                flexBasis: "50%"
              },
            skyblue:{
                flexGrow: 0,
                flexShrink: 1,
                flexBasis: "50%"
              },
            steelblue:{
                flexGrow: 0,
                flexShrink: 1,
                flexBasis: "30%"
              },
              pickedValues :[
                { id: "integer", value: 0 },
                { id: "fraction", value: 0 },
                
              ],
              setPickedValues : [
                { id: "integer", label: "", min: 0, max: 50 },
                { id: "fraction", label: "", min: 0, max: .75,step:.25 },

              ],
              pictureArray : [], 
			  imageB64Arr : [], 
			  backStockPictureObjList:  [ {
				title: '',
				horizontal: true,
				data: []
			  } ],
			  countPicturesBackStock: 0,
			  backStockPictureObj : null,
			  backStockPictureArr: ["","","","",""],
			  backStockPictureB64Arr: [],
			  currentItemimageB64 : null,  
			  itemPictureArray:[],
			  previousVal : 0,
			  inventaryItemsReport:[],
			  nextText: "Next",
			  frac_value:'',
			  int_value:'',
			  // const wheelRef = useRef<WheelPickerExpo>(null)
		}
	}
	onLoginfailure = () => {
		
		const { navigate } = this.props.navigation;
		global.screen = "Login"
		navigate("Login");
	}
	getLocationAsync = async () => {
		let { status } = Location.requestForegroundPermissionsAsync() ;// await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
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

	 async componentDidMount() {
	    global.logs = "";	 
		console.log("On Inventory Module")
       // ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
       // ScreenOrientation.lockAsync(ScreenOrientation.Orientation.PORTRAIT);
       ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
	   
		this.getLocationAsync();
		//OJO para local
		//connDBHelper.getLocalClockIn(this.state._course.id,global.user_id,this);
		await this.getIniData();     
		this.setStSchedulTime();
/*
		global.inventory_check = 1
		this.setState({_endCheckedInventory :true}) 
		this.setState({_restockSecction :false}) 
*/	
        
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

		if(hours <6)  this.setState({_breaks:1})
        console.log("day",days, "hours",hours,"minutes",minutes)
	}


	async processImage (pictureFileArray) {
		
		let index = 1;
		let pass = [];
		 if(pictureFileArray[index]){
			const manipResizeResult = await ImageManipulator.manipulateAsync(
				pictureFileArray[index],
				[ { resize: {width:800} }],
				{ compress: 0.70, format: ImageManipulator.SaveFormat.JPEG, base64:true }
			);
			//pass.push(manipResizeResult.base64);
			pass[index] = manipResizeResult.base64
			this.setState({_trash:true})
			
		 } 

		 index = 2;
		
		 if(pictureFileArray[index]){
			const manipResizeResult = await ImageManipulator.manipulateAsync(
				pictureFileArray[index],
				[ { resize: {width:800} }],
				{ compress: 0.70, format: ImageManipulator.SaveFormat.JPEG, base64:true }
			);
			//pass.push(manipResizeResult.base64);
			pass[index] = manipResizeResult.base64
			this.setState({_wipe:true})
			
		 } 
		 index = 3; 
		 if(pictureFileArray[index]){
			const manipResizeResult = await ImageManipulator.manipulateAsync(
				pictureFileArray[index],
				[ { resize: {width:800} }],
				{ compress: 0.70, format: ImageManipulator.SaveFormat.JPEG, base64:true }
			);
			//pass.push(manipResizeResult.base64);
			pass[index] = manipResizeResult.base64
			this.setState({_wipe:true})
		 } 

		

		 index = 4;
		
		
		 if(pictureFileArray[index]){
			const manipResizeResult = await ImageManipulator.manipulateAsync(
				pictureFileArray[index],
				[ { resize: {width:800} }],
				{ compress: 0.70, format: ImageManipulator.SaveFormat.JPEG, base64:true }
			);
			//pass.push(manipResizeResult.base64);
			pass[index] = manipResizeResult.base64
			this.setState({_restock:true})
		 }  

		this.setState({imageB64Arr:pass})
		console.log( pass.length, " en  processImage:" );

		console.log( "global.required_clockout_pictures:",global.required_clockout_pictures );

	};
	

	
	async processItemImage (itemImageFile) {
	   let resulta = null;
	   if(itemImageFile){
		const manipResizeResult = await ImageManipulator.manipulateAsync(
			itemImageFile,
			[ { resize: {width:800} }],
			{ compress: 0.70, format: ImageManipulator.SaveFormat.JPEG, base64:true }
		);
		resulta = manipResizeResult.base64		
	  }  
	  this.setState({currentItemimageB64:resulta})

	  this.contenArray()    /////////////////
	}


	async processOneBackStockImage (itemImageFile) {
		let resulta = null;
		let pass = this.state.backStockPictureB64Arr
		if(itemImageFile){
			
		 const manipResizeResult = await ImageManipulator.manipulateAsync(
			 itemImageFile,
			 [ { resize: {width:800} }],
			 { compress: 0.70, format: ImageManipulator.SaveFormat.JPEG, base64:true }
		 );
		 resulta = manipResizeResult.base64	
		 
		 await pass.push(resulta);

		 this.setState({backStockPictureB64Arr:pass}) 
		 
		}
	}

	async processBackStockImage () {
		
		//let data = this.state.backStockPictureObjList[0].data
		let data =  this.state.backStockPictureArr
		data.map((item,j)=>{ 
			if(item != "")
			    this.processOneBackStockImage (item)
		})

	 }

	async getIniData(){	 		
		
		if(global.inventory_check == 0) return; // Not inventory for this Shift
	    let allItems = [];
		let itemsListObj = {itemsCount:0,currentItem:0};
		this.setState({_waiting : true})
		var _url =global.host + '/api/auth/inventory/'+global.city_id + '/items' ;

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

					this.setState({_waiting : false})
				    global.logs = ErrorHandler.setMessageResponse( "","",responseData,"response","",_url,global.id,global.name ,global.email);

					try { 
					
						let responseTXT = responseData;
						let responseJSON = JSON.parse (responseTXT); 
		
console.log("responseJSON::",responseJSON)

						if(responseJSON['success'] !== undefined && responseJSON['success'] == true)   {
							
							let objList = {items: responseJSON['items'] , count: responseJSON['items'].length }
							this.setState({itemsInventaryList:objList})
							
						    if(responseJSON['items'].length == 0){
								Alert.alert("Error:", "No inventory items found ");
								
							}
							let item = responseJSON['items'][0];
						    item.check = 0;
							this.setState({item: item});
							
							let valueSrt;
							if( item.last_report == null ){
								valueSrt = "0";
							}else{
								valueSrt = item.last_report.amount;
							}
							let valueNum = parseFloat(valueSrt)
							let valueInt =Math.trunc(valueNum)
							let valueFrac =   valueNum - valueInt

							this.setState({previousVal:valueNum})
							
							this.setState({pickedValues :[
											{ id: "integer", value: valueInt },
											{ id: "fraction", value: valueFrac },
										]})

		

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
							
						
							}else{
								Alert.alert(
									'Attention !',
									'Error, No Inventory items found.',
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
}


 onUpdateInventoryButtonPressed = () => {  // Borra
   let UpdateInventoryMesage =  this.buildInventoryMessage();
   this.setState({_waiting : true})
 console.log("UpdateInventoryMesage::",UpdateInventoryMesage)  
   var _url = global.host + '/api/auth/inventory/'+global.shift_id;
   fetch(_url, { 
	method: 'POST',
	headers: {
	   'Accept': 'application/json',
	   'Content-Type': 'application/json', 
	   "cache-control": "no-cache",
	   'Authorization' : global.token_type +  " " + global.access_token
	},
	body: 
		UpdateInventoryMesage
	
   
  }).then((response) =>  response.text()) 
		.then((responseData) =>
		 {
			console.log(_url,responseData)
			global.logs = ErrorHandler.setMessageResponse( "",UpdateInventoryMesage,responseData,"response","",_url,global.id,global.name ,global.email);
		   this.setState({_waiting : false})
		   this.setState({_checkedInventory:true})
		   try {
			   var responseTXT = responseData;
			   let responseJSON = JSON.parse (responseTXT); 

			   if(responseJSON['success'] !== undefined && responseJSON['success'] !== false )  {
					  //connDBHelper.setClockOutOk(this.state.course_date_id,global.user_id,shift_time_id);   
					

				Alert.alert(
					'Inventory',
					"You Updated the Inventory success",
					[
					{text: 'OK', onPress: () => {

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
					}else{ 
						if(responseJSON['exception'] !== undefined  ){
							Alert.alert(
								'Error !',
								responseJSON['message'] ,
								[
								{text: 'OK', onPress: () => {console.log('OK Error Pressed');return;}},
								],
								{cancelable: false},
							);
				    	}

					}
					if (responseJSON['msg'] == "Clock Out Error"){
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
			 global.logs = ErrorHandler.setMessageResponseAdd( global.logs,UpdateInventoryMesage,"","error",e.toString(),_url,global.id,global.name ,global.email);
 
			   if (e !== "ERROR")
					Alert.alert("Error:", "Problems connecting to the Server. Please try again later.");

		   }

		}).catch((error) => {
		  console.log(error);	 
		  console.error(error);
		  global.logs = ErrorHandler.setMessageResponseAdd( global.logs,UpdateInventoryMesage,"","error",error.toString(),_url,global.id,global.name ,global.email);

		  this.setState({
			 authenticated :0
		   });
		});
 }

 buildInventoryMessage(){
	let inventoryJSONMessage = "{}";
	let itemArray = "";
    var category =  this.state.data.map((categories,i)=>{ 
	    var itemAll =  categories.map((items,j)=>{ 
			itemArray = itemArray +  '"'+items.id+'": {"amount": "'+items.amount+'"},'
			
		});
	});
	itemArray = itemArray.substring(0,itemArray.length -1);
	inventoryJSONMessage = '{ "inventoryItems": { '+ itemArray+ '},"notes":'+ JSON.stringify(this.state.notes)+'  }';
	return inventoryJSONMessage;
 }

 
 onClockOutButtonPressedCleen = () => {   // Real ClockOut (Clock Out) R.Cleen
	
	console.log(" 0 " )
	this.showDebug("0","green")
	
	let	objectClockOut = {shift_time_id:global.shift_time_id, device_setup:0,
		latitude:this.state.location.latitude,
		longitude:this.state.location.longitude,
		checklist:this.getArrayChecks()
		,city_id:global.city_id  } ;

	var _url = global.host + '/api/auth/clockout';
	var _body = JSON.stringify(
			objectClockOut
		);


		objectClockOut.trash_picture  =  this.state.imageB64Arr.length !== 0 ? this.state.imageB64Arr[1] : undefined
		objectClockOut.floor_picture =this.state.imageB64Arr.length !== 0 ? this.state.imageB64Arr[2] : undefined
		objectClockOut.classroom_picture = this.state.imageB64Arr.length !== 0 ? this.state.imageB64Arr[3] : undefined
		objectClockOut.supply_center = this.state.imageB64Arr.length !== 0 ? this.state.imageB64Arr[4] : undefined

		this.setState({_waiting : true})

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
				console.log("_url::",_url)
				console.log("responseData::",responseData)
				console.log(" 13 " )
				this.showDebug("13","orange")
					//global.logs = global.logs + " Clock - OUT (Response): " + JSON.stringify(responseData) + "\n";
					global.logs = ErrorHandler.setMessageResponse( "",_body,responseData,"response","",_url,global.id,global.name ,global.email);
					this.setState({_waiting : false})
				   try {
					   var responseTXT = responseData;
					   let responseJSON = JSON.parse (responseTXT); 

					   console.log(" 14 " )
					   this.showDebug("14","yellow")

					   if(responseJSON['success'] !== undefined && responseJSON['success'] !== false )  {
						      // connDBHelper.setClockOutOk(this.state.course_date_id,global.user_id,shift_time_id);  
							  //this.deleteImageFilesBackStock(this.state.backStockPictureObjList[0].data)
							  
							  this.deleteImageFiles(this.state.backStockPictureArr)
							  console.log(" 15 " )
							  this.showDebug("15","red")

						Alert.alert(
							'Today you worked',
							// "From " + responseJSON['clock_in_time'].substring(15,19) + " to " +  responseJSON['clock_out_time'].substring(11,19),
							"From " + responseJSON['msg'].substring(15,38) ,
							[
							{text: 'OK', onPress: () => {
								   //connDBHelper.saveClock( shift_id, global.shift_time_id, this.state._course.course_date_id,global.user_id,1,this.state._course.instructor_id,3,JSON.stringify(objectClockOut));
								  
								   global.clock = 0;
					               this.props.navigation.state.params.context.setColorClockIn();
								   //connDBHelper.setClockInOff(this.state._course.course_date_id,global.user_id,global.shift_time_id)  ;
								   //this.onOkPressed();
								   
								   authHelper.logOut(global.host,global.access_token); 
								   this.props.navigation.state.params._onLoadGetUsers(global.location_now.latitude,global.location_now.longitude); 
		                           const { navigate } = this.props.navigation
								   global.screen = "Login"
		                           navigate("Login")
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
							if (responseJSON['msg'] == "Error Clock Out"){
								Alert.alert(
									"Clock Out Error" +'!',
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
					   if (e !== "ERROR")
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



 onClockOutButtonPressed = () => {   // Real ClockOut (Clock Out)

	console.log(" 000 " )
	this.showDebug("0","green")

		//let shift_id = this.state._course.id;
		let	objectClockOut = {shift_time_id:global.shift_time_id, device_setup:0,
			//latitude:(this.state.location ? this.state.location.latitude :0),
			latitude:this.state.location.latitude,
			//longitude:(this.state.location ? this.state.location.longitude :0),
			longitude:this.state.location.longitude,
			checklist:this.getArrayChecks()
			,city_id:global.city_id  } ;

console.log("objectClockOut  :: ",objectClockOut)
      // this.props.navigation.state.params.context.setColorClockIn();

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
	console.log(" 111 " )
	this.showDebug("1","red")
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
		console.log(" 222 " )
		this.showDebug("2","blue")
		if(
			(! this.state.location.latitude || ! this.state.location.longitude) ||
		    ( this.state.location.latitude == 0   ||  this.state.location.longitude == 0)
		){
			Alert.alert(
				'Attention !',
				'Check permission to access location and try again.',
				[
				{text: 'OK', onPress: () => console.log('OK Pressed')},
				],
				{cancelable: false},
			);
			return;
		 }
		 console.log(" 333 " )
		 this.showDebug("3","green")
		 //////////
		 if(!this.state._roll) {
			Alert.alert(
				'Attention !',
				'Take Roll is required.',
				[
				{text: 'OK', onPress: () => console.log('OK Pressed')},
				],
				{cancelable: false},
			);
			return;
		}
console.log(" 444 " )
this.showDebug("4","pink")
		if(this.state.shift_hours  >=6  && ! this.state._breaks) {
			Alert.alert(
				'Attention !',
				'Take scheduled breaks  is required.',
				[
				{text: 'OK', onPress: () => console.log('OK Pressed')},
				],
				{cancelable: false},
			);
			return;
		}
		///////
console.log(" 555 " )
this.showDebug("5","yellow")
		if(global.connection !== 1) {
			
			Alert.alert(
				'Attention !',
				'Your Clock Out, has been saved locally due to not having internet access.',
				[
				{text: 'OK', onPress: () => {
					   
					   //connDBHelper.saveClock( shift_id, global.shift_time_id, this.state._course.course_date_id,global.user_id,0,this.state._course.instructor_id,3,JSON.stringify(objectClockOut));
					   //connDBHelper.setClockInOff(this.state._course.course_date_id,global.user_id,global.shift_time_id)  ;
					   global.clock =0;
					  
					   //global.shift_time_id = 0;
					   this.props.navigation.state.params.context.setColorClockIn();
					   this.onOkPressed();
					   return;
					 }
				},
				],
				{cancelable: false},
			   );

			 
			return;
		}
console.log(" 666 " )
this.showDebug("6","gray")
        let picturesOk = true;
		let errorMessage = "";




		if(! this.state._breaks ) {
			errorMessage = "Take scheduled breaks  is required";
			
			picturesOk = false;
		}		
console.log(" 777 " )
this.showDebug("7","orange")
		if(  global.required_clockout_pictures &&  ! this.state.imageB64Arr[1]  ) {
			errorMessage = "Take out the trash (empty trash can photo) is required";
			
			picturesOk = false;
		}

		if( global.required_clockout_pictures && ( ! this.state.imageB64Arr[2] &&  picturesOk) ) {
			errorMessage = "Vacuum / mop (floor photo) is required";
			this.setState({_wipe:false})
			picturesOk = false;
		}
		console.log(" 888 " )
		this.showDebug("8","puple")
		if( global.required_clockout_pictures && ( ! this.state.imageB64Arr[3] &&  picturesOk )) {
			errorMessage = "Clean up (classroom full shot) is required";
			picturesOk = false;
		}
		
		console.log(" 999 " )	
		this.showDebug("9","white")			
		if(global.required_clockout_pictures &&  (! this.state.imageB64Arr[4] &&  picturesOk) ) {
			errorMessage = "Please take a picture of the restocked Student Supply Center";
			picturesOk = false;
		}	
		console.log(" 10 " )
		this.showDebug("10","blue")
        if( global.required_clockout_pictures &&  ! picturesOk) {
			Alert.alert(
				'Clock Out Error!',
				errorMessage,
				[
				{text: 'OK', onPress: () => {
					console.log('OK Pressed Message Error',errorMessage);
					
				}
				
				},
				],
				{cancelable: false},
			);
			return;
		}
		console.log(" 1111" )
		this.showDebug("11","red")	
console.log("this.state.imageB64Arr Inv:" ,this.state.imageB64Arr.length);

		objectClockOut.trash_picture  =  this.state.imageB64Arr.length !== 0 ? this.state.imageB64Arr[1] : undefined
		objectClockOut.floor_picture =this.state.imageB64Arr.length !== 0 ? this.state.imageB64Arr[2] : undefined
		objectClockOut.classroom_picture = this.state.imageB64Arr.length !== 0 ? this.state.imageB64Arr[3] : undefined
		objectClockOut.supply_center = this.state.imageB64Arr.length !== 0 ? this.state.imageB64Arr[4] : undefined
/*
		objectClockOut.trash_picture  =   this.state.imageB64Arr[1] 
		objectClockOut.floor_picture =  this.state.imageB64Arr[2] 
		objectClockOut.classroom_picture = this.state.imageB64Arr[3] 
		objectClockOut.supply_center =  this.state.imageB64Arr[4] 
*/

		console.log("objectClockOut Inv:" ,objectClockOut);
		//xxx
		
		console.log(" 12 " )
		this.showDebug("12","pink")
		//console.log(this.state.backStockPictureB64Arr) ; 
 
        
		var _url = global.host + '/api/auth/clockout';
		var _body = JSON.stringify(
				objectClockOut
			);

	

this.setState({_waiting : true})


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
				console.log("_url::",_url)
				console.log("responseData::",responseData)
				console.log(" 13 " )
				this.showDebug("13","orange")
					//global.logs = global.logs + " Clock - OUT (Response): " + JSON.stringify(responseData) + "\n";
					global.logs = ErrorHandler.setMessageResponse( "",_body,responseData,"response","",_url,global.id,global.name ,global.email);
					this.setState({_waiting : false})
				   try {
					   var responseTXT = responseData;
					   let responseJSON = JSON.parse (responseTXT); 

					   console.log(" 14 " )
					   this.showDebug("14","yellow")

					   if(responseJSON['success'] !== undefined && responseJSON['success'] !== false )  {
						      // connDBHelper.setClockOutOk(this.state.course_date_id,global.user_id,shift_time_id);  
							  //this.deleteImageFilesBackStock(this.state.backStockPictureObjList[0].data)
							  
							  this.deleteImageFiles(this.state.backStockPictureArr)
							  console.log(" 15 " )
							  this.showDebug("15","red")

						Alert.alert(
							'Today you worked',
							// "From " + responseJSON['clock_in_time'].substring(15,19) + " to " +  responseJSON['clock_out_time'].substring(11,19),
							"From " + responseJSON['msg'].substring(15,38) ,
							[
							{text: 'OK', onPress: () => {
								   //connDBHelper.saveClock( shift_id, global.shift_time_id, this.state._course.course_date_id,global.user_id,1,this.state._course.instructor_id,3,JSON.stringify(objectClockOut));
								  
								   global.clock = 0;
					               this.props.navigation.state.params.context.setColorClockIn();
								   //connDBHelper.setClockInOff(this.state._course.course_date_id,global.user_id,global.shift_time_id)  ;
								   //this.onOkPressed();
								   
								   authHelper.logOut(global.host,global.access_token); 
								   this.props.navigation.state.params._onLoadGetUsers(global.location_now.latitude,global.location_now.longitude); 
		                           const { navigate } = this.props.navigation
								   global.screen = "Login"
		                           navigate("Login")
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
							if (responseJSON['msg'] == "Error Clock Out"){
								Alert.alert(
									"Clock Out Error" +'!',
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
					   if (e !== "ERROR")
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

showDebug(msg,color){
	// if("2023-01-26" !== Moment(Date.now()).format('Y-MM-DD') ) return;
	Toast.show( "Time:" + msg,{
		position: Toast.position.center,
		containerStyle:{
			backgroundColor: color
		},
		duration	: 2000	,
		delay : 100,
		textStyle:{
			color:'#fff',
		   },
		imgSource: null,
		imgStyle: {},
		mask: true, 
		maskStyle:{}
	  })
}

sendInventoryItem = (inventory_item_id,amount,picture,comment) => {
 

		let	objectInventoryItem = {amount:amount, picture:picture,notes:comment,city_id:global.city_id  } ;


        this.setState({_waiting : true})
		var _url =global.host + '/api/auth/inventory/amount/'+inventory_item_id  ;
		var _body =  JSON.stringify(
				objectInventoryItem
			);
console.log("_body:::",_body)	



		fetch(_url, {
			method: 'PUT',
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
					console.log(_url + " --- ",responseData)
				global.logs = ErrorHandler.setMessageResponse( "",_body,responseData,"response","",_url,global.id,global.name ,global.email);
				console.log("responseData::",responseData)
					this.setState({_waiting : false})
				   try {
					   var responseTXT = responseData;
					   let responseJSON = JSON.parse (responseTXT); 

					   if(responseJSON['success'] !== undefined && responseJSON['success'] !== false )  {
						        
					    
                                  
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
							if (responseJSON['msg'] == "Clock Out Error"){
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
					   global.logs = ErrorHandler.setMessageResponseAdd( global.logs,_body,"","error",e.toString(),_url,global.id,global.name ,global.email);

					   this.setState({
						   authenticated :0
					   });
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


	 sendInventoryItemReport =  () => {
 
		let	objectInventoryItemReport = {city_name:global.city,instructor_email:global.email ,instructor_name:global.name,inventory_items:this.state.inventaryItemsReport,inventory_pictures:this.state.backStockPictureB64Arr,comments:this.state.commentBackStock,city_id:global.city_id  } ;

		this.setState({_endCheckedInventory :false}) 

        this.setState({_waiting : true})
		var _url = global.host + '/api/auth/inventory/'+global.city_id+'/notification';
		var _body = JSON.stringify(
				objectInventoryItemReport
			);
	    console.log(_body)		
		fetch(_url , {
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

					console.log('/api/auth/inventory/'+global.city_id+'/notification',responseData)
					this.setState({_waiting : false})
				   try {
					   var responseTXT = responseData;
					   let responseJSON = JSON.parse (responseTXT); 

					   if(responseJSON['success'] !== undefined && responseJSON['success'] !== false )  {
                             
					console.log(responseJSON)
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
							if (responseJSON['msg'] == "Back Stock Report Error"){
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
					   global.logs = ErrorHandler.setMessageResponseAdd( global.logs,_body,"","error",e.toString(),_url,global.id,global.name ,global.email);

					   this.setState({
						   authenticated :0
					   });
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



	onOkPressed(){
		this.deleteImageFiles(this.state.itemPictureArray)
		//this.deleteImageFilesBackStock(this.state.backStockPictureObjList[0].data)
		this.deleteImageFiles(this.state.backStockPictureArr)
		
		this.props.navigation.state.params.context.onReturnFromApplayClockOut()
		this.props.navigation.state.params._onLoadGetUsers(global.location_now.latitude,global.location_now.longitude);  
		global.screen = "Classroom"
		this.props.navigation.goBack();
	}

	onBackStockScreen = async () => {
		
		
		this.setState({_checkedInventory :false}) 
		this.setState({_endCheckedInventory :true}) 
	}

	onBackStockNextButtonPressed = async () => {

	    if( this.state.backStockPictureArr[0] +
			this.state.backStockPictureArr[1] +
			this.state.backStockPictureArr[2] +
			this.state.backStockPictureArr[3] 
			== "" ) {
			Alert.alert(
				'Attention!',
				"Please take at least a picture of the Back Stock shelves that show all inventory",
				[
				{text: 'OK', onPress: () => {
					console.log('OK Pressed Message Error');
					
				}
				
				},
				],
				{cancelable: false},
			);
			return
		} 
		global.inventory_check = 0 
		this.setState({_checkedInventory :false}) 
		this.setState({currentItemInventary :0}) 
		//this.setState({_endCheckedInventory :false}) 

		//await this.processBackStockImage () ///////////////xxx

	//	if(this.state._endCheckedInventory == true )  // Inventary Back Stock
		     this.sendInventoryItemReport()
		
	}

	onNextInventoryButtonPressed = async () => {
		
			    // Send current  Item
				let alreadyValidte = (this.state.inventaryItemsReport[this.state.currentItemInventary] == undefined ? null : this.state.inventaryItemsReport[this.state.currentItemInventary].amount)
			    
				if( (this.state.previousVal  ==  this.state.pickedValues[0].value + this.state.pickedValues[1].value) && alreadyValidte  ==  null 
				    
				  ) {
					const AsyncAlert = async () => new Promise((resolve) => {	
                       if(  global.require_inventory_confirm == true) {
							Alert.alert(
								'Attention !',
								'Are you sure the amount hasn’t changed?',
								[
								{text: 'YES', onPress: () => {
									
									resolve('YES');
								}},
								{ text: 'NO', onPress: () => {
					
		
								},style: "cancel"
								},
								],
								{cancelable: false},
							);
					   }else{
						 resolve('YES');
					   }

				});

				await AsyncAlert();
				}	

				
				await this.processItemImage (this.state.currentItemPicture)
				

				
				let valueSrt =""
				let minimusValueSrt =""
				let valueFrac = 0;

				let itemsReport = this.state.inventaryItemsReport
				let current_item = this.state.itemsInventaryList.items[this.state.currentItemInventary]
				current_item.check = 0;

				// Minimus

				valueSrt = current_item.minimum;

				let valueNum = parseFloat(valueSrt)
				let valueInt =Math.trunc(valueNum)
				let valueFracNum =   valueNum - valueInt

				minimusValueSrt =  valueInt + "" +  valueFracNum.toString().replace("0.25", " ¼").replace("0.5", " ½").replace("0.75", " ¾").replace("0", "") 

				// Current
				

				valueSrt = this.state.pickedValues[0].value + this.state.pickedValues[1].value

				valueNum = parseFloat(valueSrt)
				valueInt =Math.trunc(valueNum)
				valueFracNum =   valueNum - valueInt
				valueSrt =  valueInt + "" +  valueFracNum.toString().replace("0.25", " ¼").replace("0.5", " ½").replace("0.75", " ¾").replace("0", "") 
				itemsReport[this.state.currentItemInventary] = 
				              {
								  id: current_item.id,
								  name : current_item.inventory_item.name,
								  category :  (  current_item.inventory_item.category == this.state.currentCategory ?  "" :current_item.inventory_item.category),
								  comes_in : current_item.inventory_item.uom,
								  amount : valueSrt,
								  minimum : minimusValueSrt,
								 comment : (this.state.comment == null || this.state.comment == undefined ?  " " : this.state.comment )

							 }
				 this.setState({currentCategory:current_item.inventory_item.category})
				
				 this.setState({inventaryItemsReport:itemsReport})
				
			
				this.sendInventoryItem(this.state.item.id,
				                       this.state.pickedValues[0].value + this.state.pickedValues[1].value
				                      ,this.state.currentItemimageB64,this.state.comment);

				this.setState({currentItemimageB64:null})

				if(this.state.itemsInventaryList.count -1 == this.state.currentItemInventary ) {
					console.log("salir")
					console.log("%%%%%%%%%%%%%%")
	               //console.log(this.state.inventaryItemsReport)

						/*  onBackStockScreen
					    global.inventory_check = 0 
						this.setState({_checkedInventory :false}) 
						this.setState({_endCheckedInventory :true}) 
                        */
						this.onBackStockScreen()
						this.deleteImageFiles(this.state.itemPictureArray)
						
						return;
				}

				let next_ = this.state.item;
				if(next_.last_report == null )	 next_.last_report = { instructor: {name:""}}	
				next_.last_report.amount = this.state.pickedValues[0].value + this.state.pickedValues[1].value  + "";
				next_.last_report.instructor.name = global.name;
				next_.comments = this.state.comment;
				this.setState({item:next_})
			
				

			// Change nex Item
				let siguente = this.state.currentItemInventary + 1;
                this.setState({nextText:"Next"})
				if(this.state.currentItemInventary == this.state.itemsInventaryList.count -2 )  this.setState({nextText:"Finish"})
				   this.setState({currentItemInventary:siguente})
				let nextItem = this.state.itemsInventaryList.items[siguente]
	console.log(">>>> nextItem >", nextItem)
				this.setState({item:nextItem})
                
				if(this.state.itemPictureArray[siguente] == undefined || this.state.itemPictureArray[siguente] == null)
				  this.setState({currentItemPicture:null})
				else
				  this.setState({currentItemPicture:this.state.itemPictureArray[siguente]})

			    valueFrac = 0;
				valueSrt = "0";
		
				if(nextItem.last_report == null ){
					valueSrt = "0";
				}else{
					valueSrt = nextItem.last_report.amount;
				}

				 valueNum = parseFloat(valueSrt)
				 valueInt =Math.trunc(valueNum)
				 valueFrac =   valueNum - valueInt
			
				this.setState({pickedValues :[
								{ id: "integer", value: valueInt },
								{ id: "fraction", value: valueFrac },
							]})
				
	console.log("EN NEXT: pickedValues:" , this.state.pickedValues)						
				this.setState({previousVal:valueNum})		
	console.log("EN NEXT: previousVal:" , this.state.previousVal)
	let arr_paso =  this.state.INTQTYITEM	
	this.setState({INTQTYITEM:arr_paso})
	this.forceUpdate()
		
				this.clearPicture(0);
				if( nextItem.comments != "" )
			      this.setState({comment:nextItem.comments})
				else  
				  this.setState({comment:""})
	}


	onPreviousInventoryButtonPressed = () => {

		if( 0 <  this.state.currentItemInventary ) {
			this.setState({nextText:"Next"})
			let siguente = this.state.currentItemInventary - 1;

			this.setState({currentItemInventary:siguente})
			let nextItem = this.state.itemsInventaryList.items[siguente]
			this.setState({item:nextItem})
			
			this.setState({currentItemPicture:this.state.itemPictureArray[siguente]})

			let valueFrac = 0;
			let valueSrt = "0";
			if(nextItem.last_report == null ){
				valueSrt = "0";
			}else{
				valueSrt = nextItem.last_report.amount;
			}

			let valueNum = parseFloat(valueSrt)
			let valueInt =Math.trunc(valueNum)
			 valueFrac =   valueNum - valueInt


			this.setState({pickedValues :[
							{ id: "integer", value: valueInt },
							{ id: "fraction", value: valueFrac },
							
						]})
			this.setState({previousVal:valueNum	})
			this.clearPicture(0);
			if(nextItem.comments != "" )
			      this.setState({comment:nextItem.comments})
		}
	}

	  deleteImageFiles   (picturesArray)  {


		if(picturesArray == null || picturesArray.length == 0)   return
		
		picturesArray.map((file,i) => {
            console.log("deleted File ::" ,file)
			if(file !== null && file !== ""  ){	
				console.log("to delete::",file)		
			    const dirInfo =  FileSystem.getInfoAsync(file);
				if (dirInfo.exists) {
					console.log("real deleted::",file)	
					FileSystem.deleteAsync(file);
				}
			}else{
				console.log("no deleted::",file)	
			}

		})
	}
	deleteImageFilesBackStock   (picturesArray)  {
		
		if(picturesArray == null || picturesArray.length == 0)   return
		picturesArray.map((file,i) => {
			const dirInfo =  FileSystem.getInfoAsync(file.url);
			if (dirInfo.exists) {
				 FileSystem.deleteAsync(file);
			}
		})
	}
	

	onBtnClockOutPressed = () => {
        this.deleteImageFiles(this.state.itemPictureArray)
		this.deleteImageFiles(this.state.pictureArray)
		//this.deleteImageFilesBackStock(this.state.backStockPictureObjList[0].data)
		this.deleteImageFiles(this.state.backStockPictureArr)
		
		this.props.navigation.state.params.context.onReturnFromApplayClockOut()
		global.screen = "Classroom"
		this.props.navigation.goBack()
	}

	onBtnBackPressed = async () => {
		console.log("onBtnBackPressed::this.state.currentItemInventary ",this.state.currentItemInventary);
		if(this.state.currentItemInventary >0) {
			const AsyncAlert = async () => new Promise((resolve) => {	
				Alert.alert(
					'Attention !',
					'Are you sure you want to go back? You will lose all your inventory progress and will have to start again ',
					[
					{text: 'YES', onPress: () => {
						
						resolve('YES');
					}},
					{ text: 'NO', onPress: () => {		   

					},style: "cancel"
					},
					],
					{cancelable: false},
				);
			});

			await AsyncAlert();
		}

		this.deleteImageFiles(this.state.itemPictureArray)
		//this.deleteImageFilesBackStock(this.state.backStockPictureObjList[0].data)
		this.deleteImageFiles(this.state.backStockPictureArr)
		
		this.props.navigation.state.params.context.onReturnFromClockOut()
		global.screen = "Classroom"
		this.props.navigation.goBack()
	}

	onLongPressBack1= async () => {
		console.log("this.state._restockSecction",this.state._restockSecction);
		console.log("global.inventory_check ",global.inventory_check );
		console.log(" this.state._endCheckedInventory", this.state._endCheckedInventory);
		console.log("this.state._restockSecction ",this.state._restockSecction );
		console.log(" this.state._checkedInventory",this.state._checkedInventory );
		console.log("global.required_clockout_pictures ", global.required_clockout_pictures);

		
	}
	onChangeOption (value)  {
	//	console.log(value);

		//this.setState({ _roll : options[value].value   })  
	}
    getArrayChecks(){
		let arr = [];

		if(  this.state._roll)  arr.push( "roll");
		if(! global.required_clockout_pictures || this.state._rdocuments)  arr.push( "documents");
		if(! global.required_clockout_pictures || this.state._trash)  arr.push( "trash");
		if(! global.required_clockout_pictures || this.state._wipe)  arr.push( "wipe");
		if(! global.required_clockout_pictures || this.state._restock)  arr.push( "restock");
		if(! global.required_clockout_pictures || this.state._breaks)  arr.push( "breaks");
		if(! global.required_clockout_pictures || this.state._documents)  arr.push( "documents");

		return arr;
	}
	 delPictureBackStock  (index) {
		let elements = this.state.backStockPictureArr

		elements[index]= ""

		
		this.setState({backStockPictureArr:elements})
		
	}

    deletePicture= (index) => {
        let _array = this.state.pictureArray
		let _array64 = this.state.imageB64Arr
        _array.splice(index,1);
		_array64.splice(index,1);
        this.setState({pictureArray:_array})
		this.setState({imageB64Arr:_array64})

      }
	  clearPicture= (index) => {
        let _array = this.state.pictureArray
		let _array64 = this.state.imageB64Arr
        _array[index] = "";
		_array64[index]="";
        this.setState({pictureArray:_array})
		this.setState({imageB64Arr:_array64})

      }	  
   contenArray = () => {
	   return
	 console.log( "0 tiene  ",this.state.pictureArray[0]);
	 console.log( "1 tiene  ",this.state.pictureArray[1]);
	 console.log( "2 tiene  ",this.state.pictureArray[2]);
	 console.log( "3 tiene  ",this.state.pictureArray[3]);
	 console.log( "4 tiene  ",this.state.pictureArray[4]);
   }	  
   
   async addPicture(image){
        let _array = this.state.pictureArray
		console.log("type::",this.state.imageType )
		this.contenArray(_array)

		let item_array_picture = this.state.itemPictureArray;
        if(_array == null || _array == undefined ) _array = [];
        if(_array.length > 5){
          alert('You can add up to 5 pictures!');
          return;
        }
		
        
        

		if(this.state.imageType == "backstock"  ){
		
			//let arrayObj  = this.state.backStockPictureArr
			let objectBackList = this.state.backStockPictureArr
			
			this.setState({backStockPictureB64Arr: []})
			objectBackList[this.state.countPicturesBackStock] = image

			this.setState({backStockPictureArr:objectBackList}) 

			await this.processBackStockImage ()   ////xxx
			
		}

		if(this.state.imageType == "item"  ){
			_array[0] =image;
			item_array_picture[this.state.currentItemInventary] = image

		    this.setState({itemPictureArray:item_array_picture})
			this.setState({currentItemPicture:image})
			//await this.processItemImage (image)
		}
            
		if(this.state.imageType == "trash"  )
            _array[1] =image;	
		if(this.state.imageType == "floor"  )
            _array[2] =image;	
		if(this.state.imageType == "classroom"  )
            _array[3] =image;	
		if(this.state.imageType == "restock"  )
            _array[4] =image;										
	
        this.setState({pictureArray:_array})
	
		this.setState({imageType:""})
		await this.processImage (_array)
	
		this.contenArray(_array)
      }

	  onTakePictureItemPress = () => {
        const { navigate } = this.props.navigation
		this.setState({imageType:"item"})
		console.log("onTakePictureItemPress"); 
        navigate("TakePicture", {parentPage:this});
      }  
	  onTakePictureTrashPress = () => {
		console.log("onTakePictureTrashPress");  
        const { navigate } = this.props.navigation
		this.setState({imageType:"trash"})
        navigate("TakePicture", {parentPage:this});
      } 

	  
	  onTakePictureFloorPress = () => {
		console.log("onTakePictureFloorPress");  
        const { navigate } = this.props.navigation
		this.setState({imageType:"floor"})
        navigate("TakePicture", {parentPage:this});
      } 
	  onTakePictureRestockPress= () => {
		console.log("onTakePictureRestockPress");  
        const { navigate } = this.props.navigation
		this.setState({imageType:"restock"})
        navigate("TakePicture", {parentPage:this});
      } 
	  onTakePictureBackStockPress= (index) => {
		console.log("onTakePictureBackStockPress");  
		this.setState({countPicturesBackStock:index})
        const { navigate } = this.props.navigation
		this.setState({imageType:"backstock"})
        navigate("TakePicture", {parentPage:this});
      } 

	  onTakePictureClassroomPress = () => {
		console.log("onTakePictureClassroomPress");  
        const { navigate } = this.props.navigation
		this.setState({imageType:"classroom"})
        navigate("TakePicture", {parentPage:this});
      } 

	  onSendPictureRestockNextPress= () => {
		if(! global.required_clockout_pictures || ! this.state.imageB64Arr[4] ) {
			Alert.alert(
				'Clock Out Error!',
				"Please take a picture of the restocked Student Supply Center",
				[
				{text: 'OK', onPress: () => {
					console.log('OK Pressed Message Error');
					
				}
				
				},
				],
				{cancelable: false},
			);
			return;

		}
		this.setState({ _restockSecction: false });
	  }


	  
	render() {

		let cheked = 0;


        let path = "https://www.ciprestige.com/wp-content/"
        let pictureUrl = {uri: path+'uploads/2018/04/torniquete.jpg'} 
		//let fullPathImage = (this.state.item.image  == null ? "" : this.state.item.image )
		//let pictureUrl = {uri: pictureUrl }
	
		
		let valueSrt;
		let valueFrac = "0";
console.log("global.inventory_check::",global.inventory_check);
		if(global.inventory_check == 1 && this.state.item !== null && this.state.item !== undefined ) {
			console.log("this.state.item.last_report::",this.state.item.last_report);
				if(this.state.item.last_report == null || this.state.item.last_report == undefined ){
					valueSrt = "0";
				}else{
					valueSrt = this.state.item.last_report.amount;
				}

				let valueNum = parseFloat(valueSrt)
				let valueInt =Math.trunc(valueNum)

				let valueFracNum =   valueNum - valueInt

				valueSrt =   (valueInt == 0 ? "": valueInt ) + "" +  valueFracNum.toString().replace("0.25", " ¼").replace("0.5", " ½").replace("0.75", " ¾").replace("0", "") 
			console.log("++++" , valueSrt)
				if(valueSrt != '0') valueSrt = valueSrt + " - " 
				              + ( this.state.item.last_report == null || this.state.item.last_report == undefined 
								  ? " " : this.state.item.last_report.instructor.name)
	    }

		return <View
				style={styles.viewView}>
				<ShiftHeader
						instructorName = {global.name}
						date = {global.todayFormat}
						time = {this.state._course.class_time}
						class_type = {this.state._course.class_type}
						city = {this.state._course.city}
						class_number = {this.state._course.class_number}
						navigation = {this.props.navigation}
						_onLoadGetUsers = {this.props.navigation.state.params._onLoadGetUsers}
					>
				</ShiftHeader>	

						

				<TouchableOpacity
						onPress={this.onBtnBackPressed}
						onLongPress={this.onLongPressBack}
						style={styles.btnbackButton}>
						<Text
							style={styles.btnbackButtonText}>Back</Text>
				</TouchableOpacity>


				{ (  ( ( this.state._restockSecction == false  || !global.required_clockout_pictures ) && global.inventory_check == 0  )
				  ||  ( global.inventory_check == 1 && (this.state._checkedInventory && !this.state._endCheckedInventory) )
                  ||  ( (!this.state._checkedInventory && this.state._endCheckedInventory && global.inventory_check == 0   && !global.required_clockout_pictures) )
				  ) &&
					<View>
					<Text
						style={styles.txtclockouttitleText}>Clock out check list</Text>
					<Text
						style={styles.txtclockoutsubtitleText}>Make sure you have done the following before clocking out.</Text>
					<View
						style={styles.viewschecksView}>
						<View
							style={styles.viewRowCheckView}>
						<Switch
							trackColor={{ false: "#767577", true: "rgba(202, 245, 210)" }}
							thumbColor={this.state._roll ? "green":"rgba(118, 118, 128, 0.22)" }
							ios_backgroundColor="rgba(255, 255, 255)"
							onValueChange={value=> { this.setState({ _roll : value   }) ;  } }
							style={styles.swAttendanceSwitchNew}
							value={this.state._roll}
						/>		

							<Text
								style={styles.txtlabeltakerollText}>Take Roll</Text>
						</View>
					{ global.required_clockout_pictures &&		// 	clock Out Pictures
					    <View> 
							<View
								style={styles.viewRowBootonView
								}>
								<TouchableOpacity  onPress={this.onTakePictureTrashPress}>
									<Image 
									source={require("./../../assets/images/camera.png")}
									style={styles.cameraIconCheck}/>
								</TouchableOpacity>  
								<Text
									style={styles.txtlabeltakerPictureText}>Take out the trash (empty trash can photo)</Text>
									<View 
									style={styles.viewPicturesCheck}>
									<Image  
										source={{uri:this.state.pictureArray[1]}}
										style={styles.pictureCheck}/> 
								</View>

							</View>
							<View
								style={styles.viewRowBootonView
								}>
								<TouchableOpacity  onPress={this.onTakePictureFloorPress}>
									<Image 
									source={require("./../../assets/images/camera.png")}
									style={styles.cameraIconCheck}/>
								</TouchableOpacity>  
								<Text
									style={styles.txtlabeltakerPictureText}>Vacuum/mop (floor photo)</Text>
									<View 
									style={styles.viewPicturesCheck}>
									<Image  
										source={{uri:this.state.pictureArray[2]}}
										style={styles.pictureCheck}/> 
								</View>
							</View>
							<View
								style={styles.viewRowBootonView
								}>
								<TouchableOpacity  onPress={this.onTakePictureClassroomPress}>
									<Image 
									source={require("./../../assets/images/camera.png")}
									style={styles.cameraIconCheck}/>
								</TouchableOpacity>  
								<Text
									style={styles.txtlabeltakerPictureText}>Clean up (classroom full shot)</Text>
									<View 
									style={styles.viewPicturesCheck}>
									<Image  
										source={{uri:this.state.pictureArray[3]}}
										style={styles.pictureCheck}/> 
								</View>

							</View>


						<View
							style={styles.viewRowBootonView
							}>
							<TouchableOpacity  onPress={this.onTakePictureRestockPress}>
								<Image 
								source={require("./../../assets/images/camera.png")}
								style={styles.cameraIconCheck}/>
							</TouchableOpacity>  
							<Text
								style={styles.txtlabeltakerPictureText}>Please restock the Student Supply Center and take a picture</Text>
							<View 
								style={styles.viewPicturesCheck}>
								<Image  
									source={{uri:this.state.pictureArray[4]}}
									style={styles.pictureCheck}/> 
							</View>
						</View> 
				  </View>     
				}
				{ false &&
						<View
							style={styles.viewRowCheckView}>
							<Switch
								trackColor={{ false: "#767577", true: "rgba(202, 245, 210)" }}
								thumbColor={this.state._restock ? "green":"rgba(118, 118, 128, 0.22)" }
								ios_backgroundColor="rgba(255, 255, 255)"
								onValueChange={value=> { this.setState({ _restock : value   })  } }
								style={styles.swAttendanceSwitchNew}
								value={this.state._restock}
							/>
							<Text
								style={styles.txtlabeltakerollText}>Restock student supply center</Text>
						</View>
				}
						{ this.state.shift_hours  >=6  &&	
						<View
							style={styles.viewRowCheckView}>
							<Switch
								trackColor={{ false: "#767577", true: "rgba(202, 245, 210)" }}
								thumbColor={this.state._breaks ? "green":"rgba(118, 118, 128, 0.22)" }
								ios_backgroundColor="rgba(255, 255, 255)"
								onValueChange={value=> { this.setState({ _breaks : value   })  } }
								style={styles.swAttendanceSwitchNew}
								value={this.state._breaks}
							/>
							<Text
								style={styles.txtlabeltakerollText}>Take scheduled breaks</Text>
						</View>
						}
						

					</View>
					<View style={styles.viewBtnClockOutView}>
							<Text
								style={styles.txtlabelbycheckingText}>*By checking this boxes I confirm that I've taken care of the required items.</Text>
							<TouchableOpacity
								onPress={this.onClockOutButtonPressedCleen}
								style={styles.btnclockoutButton}>
								<Image
								source={require("./../../assets/images/grupo-61.png")}
								style={styles.btnclockoutButtonImage}/>
								<Text
								style={styles.btnclockoutButtonText}>Clock Out</Text>
							</TouchableOpacity>
					</View>
				</View> }



				{  ( 
				    ( this.state._restockSecction == false && global.inventory_check == 1  && this.state._endCheckedInventory )
				  || ( this.state._restockSecction == true && global.inventory_check == 1  && this.state._endCheckedInventory )
 
				)
				  &&  
				        
					<View style={{
								left: 0,
								right: 0,
								top: 0,
								alignItems: "center",
							}}>

				       <Text
							style={styles.txtclockouttitleText}>Inventory check</Text>
						
								<View
								style={{
									//width: 30,
									height: 100,
								}}/>


								<View
								    style={styles.viewschecksFirstView}>
										<View
											style={styles.viewRowBootonView
											}>

											<Text
												style={styles.txtlabeltakerPictureText}>Please take pictures of the Back Stock shelves that show all the inventory</Text>
										</View>
							    </View>	 
								
									
								<View style={styles.containerPicturesRow}>
									<View
										style={{
											flex: 1,
										}}/>
								    { this.state.backStockPictureArr[0] != "" && 
	 							     <View style={styles.item}>	
										<Image
											source={{
												url: this.state.backStockPictureArr[0],
											}}
											style={styles.itemPhoto}
											resizeMode="contain"
											/>		
										<TouchableOpacity 
											onPress={() => {
											this.delPictureBackStock(0);
											}}  >
											<Image 
												source={require("./../../assets/images/trash.png")}
												style={styles.pictureDelete}/>
										</TouchableOpacity>  	
									</View>
				                   }

								   { ! this.state.backStockPictureArr[0] && 
								    <TouchableOpacity  onPress={() => {
										this.onTakePictureBackStockPress(0)
									}}  >
									  <Image 
										 source={require("./../../assets/images/picture_place.png")}
										 style={styles.camerPlace}/>
								   </TouchableOpacity>  
								 }

								   <View
										style={{
											flex: 1,
										}}/>

								{ this.state.backStockPictureArr[1] != "" && 
	 							     <View style={styles.item}>	
										<Image
											source={{
												url: this.state.backStockPictureArr[1],
											}}
											style={styles.itemPhoto}
											resizeMode="contain"
											/>		
										<TouchableOpacity 
											onPress={() => {
											this.delPictureBackStock(1);
											}}  >
											<Image 
												source={require("./../../assets/images/trash.png")}
												style={styles.pictureDelete}/>
										</TouchableOpacity>  	
									</View>
				                   }

								   { ! this.state.backStockPictureArr[1] && 
								    <TouchableOpacity  onPress={() => {
										this.onTakePictureBackStockPress(1)
									}}  >
									  <Image 
										 source={require("./../../assets/images/picture_place.png")}
										 style={styles.camerPlace}/>
								   </TouchableOpacity>  
								 }

								   <View
										style={{
											flex: 1,
										}}/>
									{ this.state.backStockPictureArr[2] != "" && 
	 							     <View style={styles.item}>	
										<Image
											source={{
												url: this.state.backStockPictureArr[2],
											}}
											style={styles.itemPhoto}
											resizeMode="contain"
											/>		
										<TouchableOpacity 
											onPress={() => {
											this.delPictureBackStock(2);
											}}  >
											<Image 
												source={require("./../../assets/images/trash.png")}
												style={styles.pictureDelete}/>
										</TouchableOpacity>  	
									</View>
				                   }

								   { ! this.state.backStockPictureArr[2] && 
								    <TouchableOpacity  onPress={() => {
										this.onTakePictureBackStockPress(2)
									}}  >
									  <Image 
										 source={require("./../../assets/images/picture_place.png")}
										 style={styles.camerPlace}/>
								   </TouchableOpacity>  
								 }

								   <View
										style={{
											flex: 1,
										}}/>

								   { this.state.backStockPictureArr[3] != "" && 
	 							     <View style={styles.item}>	
										<Image
											source={{
												url: this.state.backStockPictureArr[3],
											}}
											style={styles.itemPhoto}
											resizeMode="contain"
											/>		
										<TouchableOpacity 
											onPress={() => {
											this.delPictureBackStock(3);
											}}  >
											<Image 
												source={require("./../../assets/images/trash.png")}
												style={styles.pictureDelete}/>
										</TouchableOpacity>  	
									</View>
				                   }

								   { ! this.state.backStockPictureArr[3] && 
								    <TouchableOpacity  onPress={() => {
										this.onTakePictureBackStockPress(3)
									}}  >
									  <Image 
										 source={require("./../../assets/images/picture_place.png")}
										 style={styles.camerPlace}/>
								   </TouchableOpacity>  
								 }

								   <View
										style={{
											flex: 1,
										}}/>


								</View>


								<View style={styles.viewCommentsBackStockRow}> 
									<View style={styles.viewItemRow}> 
										<Text
											style={styles.labelLeft}>Comments:</Text>

									</View>
									<View style={styles.viewCommentsRow}> 
										<TextInput
											onChangeText = {(commentBackStock) => this.setState({commentBackStock:commentBackStock})} 
											//returnKeyType="go"
											autoCorrect={false}
											multiline={true}
											value={this.state.commentBackStock}
											style={styles.inputTxtCommentTextInput}
											autoCapitalize="sentences"

											ref={ref =>  {this._note = ref;}}
											//onSubmitEditing= {() =>this._note.focus()}
											returnKeyType="done"
										/>   
									</View>
								</View>

								<View
									style={{
										height: 180,
									}}/>
									<TouchableOpacity
										onPress={() => {
											this.onBackStockNextButtonPressed();
											}}
										style={styles.btnRestockNextButton}>
										<Text
											style={styles.btncNextButtonText}>Next</Text>
									</TouchableOpacity>
									<View
									style={{
										height: 30,
									}}/>
							</View>
					}



			        <View >
					  {  ( (this.state._restockSecction == false  || !global.required_clockout_pictures ) && global.inventory_check == 1  && !this.state._endCheckedInventory ) && 
				        this.state.item  &&  	
					   <View style={styles.viewContenInventoryCheck}>	
							<Text
								style={styles.txtclockouttitleText2}>Inventory check
							</Text>
						
							<Text
								style={styles.txtItemNameTitleText}>  {this.state.item.inventory_item.category}
							</Text>
							<View
								style={{
									height: 30,
								}}/>
							<Text
                                style={styles.labelCenter}>Name:</Text>
  
							<Text 
								style={styles.labelDescriptionRight}> {this.state.item.inventory_item.name} </Text>   


                            <View style={styles.previewContainer}>

	
                                <View
                                  style={[
                                    styles.box,
                                        {
                                        flexBasis: this.state.powderblue.flexBasis,
                                        backgroundColor: "transparent",
                                        height : 580,
                                        paddingLeft:20,
										paddingRight:20,
										top:-5,

										
                                        },
                                    ]}>
											<View style={styles.viewItemRow}> 
												
											</View>

											<View style={styles.viewItemRow}> 
												<Text
													style={styles.labelLeft}>Last Amount:</Text>
												{	valueSrt !== "0" &&
												<View>
													<Text
														style={styles.labelLeft}>{valueSrt} </Text>   
												</View>
												} 
											</View>
											<View
													style={{
														flex: .1,
											        }}/>

											<View style={styles.viewItemRow}> 
												<Text
													style={styles.labelLeft}>Comes in:</Text>
	
												<Text
													style={styles.labelLeft}>{this.state.item.inventory_item.uom} </Text>    
											</View>
										   { this.state.item.notes != "oooooo" &&
											<View style={styles.viewItemRow}> 
												<Text
													style={styles.labelLeft}>Notes:</Text>
	
												<Text
													style={styles.labelLeft}>{this.state.item.inventory_item.notes} </Text>    
											</View>
									        }


										    <View style={styles.viewItemRow}> 
												<Text
													style={styles.labelLeft}>Current Amount :</Text>

												<Text style={styles.labelLeft}>
													{Math.trunc(this.state.pickedValues[0].value).toString() == '0'?'':Math.trunc(this.state.pickedValues[0].value).toString() } </Text>
												<Text style={styles.labelFrac}>
													{this.state.pickedValues[1].value.toString().replace("0.25", " ¼").replace("0.5", " ½").replace("0.75", " ¾").replace("0", "") } 
												   
												</Text>
		                                            
											</View>



											<View style={styles.viewNumberPlease}>
												
											    <View style={styles.viewItemRow}> 
									
														<WheelPickerExpo
															ref={wheelRef}
															backgroundColor="transparent"
															selectedStyle={{ borderColor: '#202124', borderWidth: 1 }}
															height={180}
															width={50}
															//FlatList
															initialSelectedIndex={this.state.pickedValues[0].value} 
															setSelectedIndex={this.state.pickedValues[0].value} 
															items={INTQTYITEM.map((name) => ({ label: name, value: parseInt(name) }))}
															onChange={({ item }) =>{ 
																let item_paso = this.state.pickedValues
																item_paso[0].value = item.value;
																console.log(item_paso)
																console.log("state :::: \n") 
																this.setState( {pickedValues:item_paso}) 
																
															 } }
															// haptics={true}

															 renderItem={(props) => (
																<Text
																  style={[
																	styles.text,
																	{
																	  fontSize: props.fontSize,
																	  color: props.fontColor,
																	  textAlign: props.textAlign,
																	},
																  ]}
																>
																  {props.label}
																</Text>
															  )}

															/>
							
													<WheelPickerExpo
																backgroundColor="transparent"
																selectedStyle={{ borderColor: '#F00F00', borderWidth: 1 }}
																height={180}
																width={50}
														
																initialSelectedIndex={this.state.pickedValues[1].value / 0.25} 
															    setSelectedIndex={this.state.pickedValues[1].value / 0.25} 
																items={FRACQTYITEM[0].map((items, values) => ({ label: items, value: values }))}
																onChange={({ item }) =>{ 
																	console.log("item::",item)
																	let item_paso = this.state.pickedValues
																	item_paso[1].value = FRACQTYITEM[2][item.value] ;
																	console.log(item_paso)
																	console.log("state :::: \n") 
																	this.setState( {pickedValues:item_paso}) 
																	
																 } }									
																 //haptics={true}
																/> 
					
					  	
													</View>		

											</View>
 
											<View style={styles.viewComments}> 
													<View style={styles.viewItemRow}> 
														<Text
															style={styles.labelLeft}>Comments:</Text>
			
													</View>
													<View style={styles.viewCommentsRow}> 
														<TextInput
															onChangeText = {(comment) => this.setState({comment})} 
															//returnKeyType="go"
															autoCorrect={false}
															multiline={true}
															value={this.state.comment}
															style={styles.inputTxtCommentTextInput}
															autoCapitalize="sentences"

															ref={ref =>  {this._note = ref;}}
															//onSubmitEditing= {() =>this._note.focus()}
															returnKeyType="done"
														/>   
													</View>
											</View>
											

												{ this.state.item.inventory_item.position  != null &&
												 <View style={styles.viewPosition}> 
													<View style={styles.viewItemRow}> 
													  <Text
														 style={styles.labePosition}>Position</Text>
												    </View>
													<View>        
														<Image
															style={styles.referenceImage}
															source={{url:(this.state.item.inventory_item.position  == null ? "" : this.state.item.inventory_item.position )}}
															/>
													</View>
												</View> 
												}
													
													

                                 </View>


                                 <View
                                    style={[
                                        styles.box,
                                        {
                                        flexBasis: this.state.skyblue.flexBasis,
                                        height : 580,
                                        paddingLeft:20,
										paddingRight:20,
										top:-10,
                                        backgroundColor: "transparent",
                                        },
                                    ]}>
											
											<View style={styles.viewItemRow}> 
											   <Text
													style={styles.labelLeft}>Reference:</Text>
											</View>
										   { this.state.item.inventory_item.image  != null &&
											<View>        
												<Image
													style={styles.referenceImage}
													source={{url:(this.state.item.inventory_item.image  == null ? "" : this.state.item.inventory_item.image )}}
													/>
											</View>
											}
											{ this.state.item.inventory_item.image  == null &&
											<View>        
												<Image
													style={styles.referenceImage}
													source={require("./../../assets/images/dummy-pictue.png")}
													/>
											</View> 
											}

											<View
													style={{
														flex: .2,
											        }}/>
											<View style={styles.viewItemRow}> 
												<Text
													style={styles.labelLeft}>You may add a picture:</Text>
											</View>  
											<View style={styles.viewItemRow}> 
								
											</View>    

											<View style={styles.containerPictures1}>
												{ this.state.currentItemPicture  && 
												<View 
														style={styles.viewPictures}>
														<Image  
														source={{uri:this.state.currentItemPicture}}
														style={styles.picture}/>

													</View>  
												}
											</View>
											<TouchableOpacity  onPress={this.onTakePictureItemPress}>
												<Image 
												source={require("./../../assets/images/camera.png")}
												style={styles.cameraIcon}/>
											</TouchableOpacity>     
											
                                  </View>
                        </View>  

						

                        <View
                            style={{
                                            marginTop : 630,
                                }}/> 

						<View style={styles.previousNextButtons}>
							{ this.state.currentItemInventary >0 &&
							   <TouchableOpacity
									onPress={this.onPreviousInventoryButtonPressed} 
									style={styles.btnInventoryNextButton}>

									<Text
									style={styles.btncNextButtonText}>Previous</Text>
								</TouchableOpacity>
								
							}
								<View
											style={{
												flex: 11,
								}}/>
								<TouchableOpacity
									onPress={()=>{
										
										this.onNextInventoryButtonPressed()
										
									} }
									style={styles.btnInventoryNextButton}>

									<Text
									style={styles.btncNextButtonText}>{this.state.nextText}</Text>
								</TouchableOpacity>
						</View>

						</View>		
	                     
	                  }
					
				</View>
	

				{  ( this.state._restockSecction &&  global.required_clockout_pictures  ) &&  ( !this.state._endCheckedInventory   )   && // 	clock Out Pictures 
	
				<View style={{
							left: 0,
							right: 0,
							top: 0,
							alignItems: "center",
						}}>

                    <Text
						style={styles.txtclockouttitleText}>Clock out check list</Text>
					<Text
						style={styles.txtclockoutsubtitleText}>Make sure you have done the following before clocking out</Text>

							 <View
							style={{
								//width: 30,
								height: 100,
							}}/>


							<View
						       style={styles.viewschecksFirstView}>

									<View
										style={styles.viewRowBootonView
										}>
										<TouchableOpacity  onPress={this.onTakePictureRestockPress}>
											<Image 
											source={require("./../../assets/images/camera.png")}
											style={styles.cameraIconCheck}/>
										</TouchableOpacity>  
										<Text
											style={styles.txtlabeltakerPictureText}>Please restock the Student Supply Center and take a picture</Text>
										<View 
											style={styles.viewPicturesCheck}>
											<Image  
												source={{uri:this.state.pictureArray[4]}}
												style={styles.pictureCheck}/> 
										</View>
									</View>
						</View>	 

						<View
							style={{
								height: 40,
							}}/>
							 <TouchableOpacity
								onPress={() => {
									this.onSendPictureRestockNextPress();
									}}
								style={styles.btnRestockNextButton}>
								<Text
									style={styles.btncNextButtonText}>Next</Text>
							</TouchableOpacity>
							<View
							style={{
								height: 30,
							}}/>
				</View>
	             }
					
					
							    
				<View  style={[styles.containerWait, !this.state._waiting ? styles.containerHiddend : {}]}>
                      <ActivityIndicator size="large" color="#ffff"  />    
			    </View>	


			</View>

  };
}

export class ChildElementItemClass extends React.Component{ 
	
	constructor(props) {
		super(props);
		this.state = {
			dump:0,
		};
	}

	render(){
		if(this.props.result){  

			let index = 0;
			
		    var res = this.props.result.map((categories,i)=>{ 

				return(
				    <View key={i} >					  
						<Text
							style={styles.titleItemCategoryText}>{categories[0].category}
						</Text>
						<View
								style={styles.viewLineTopView}/>

						<View
							style={styles.viewTitlesView}>
								<Text
									style={styles.nameTextHead}>Name</Text>
								<Text 
									style={styles.amountTextHead}>Current Amount</Text>
								<Text
									style={styles.comesInTextHead}>Comes In</Text>

								<Text
									style={styles.notesTextHead}>Notes</Text>
									
						</View>
						<View
							style={styles.viewLineView}/>
					<View>
					{this.itemsByCategory (categories,this.props.result,i)}
					</View>
                            


					</View>		
					)
			});
			
		}

		return ( 
			<View>{res}</View> 
		)
		index ++;
		
     }

	 itemsByCategory (category,result,i)  {
		 
		 if(result){  
		
            let indexItm = 0;
			var loop = category.map((item,j)=>{	
			return(	<View  key={item.id }
					style={styles.viewRowItemView}>
						<View
						style={styles.viewItemView}>
							<Text numberOfLines = {2}
								style={styles.txtItemNameText}> {item.name} </Text>										
							<TextInput
								autoCorrect={false}
								//placeholder={"12345"}
								placeholderTextColor="#111" 
								style={styles.ammountTextInput}
								keyboardType="numbers-and-punctuation"
								returnKeyType= "next"
								//onChangeText={item.amount => setText(text)}
								onChangeText={(text) => {
									this.props.result[i][j].amount = text;

								  }}
								defaultValue = {item.amount}
								//onChangeText={text => onChangeText(text)}
								//onChangeText = {(host_) => this.setState({host_})}
								autoCapitalize = 'none'
							/>										
							<Text 
								style={styles.txtItemComesInText}> {item.uom} </Text>									
							<Text numberOfLines = {2}
								style={styles.txtItemNotesText}> {item.notes} </Text>	
						</View>
				</View>	)
			});	 
		}
		return ( 
			<View>{loop}</View> 
		)
		indexItm ++;		
	 }	 

}
/*
const ListItem = ({ item, objClass,list }) => {
	return (
	  <View style={styles.item}>
		<Image
		  source={{
			url: item.url,
		  }}
		  style={styles.itemPhoto}
		  resizeMode="contain"
		/>
		<Text style={styles.itemText}></Text>
		<TouchableOpacity 
			onPress={() => {
			objClass.delPictureBackStock(list,item.key);
			}}  >
			<Image 
				source={require("./../../assets/images/trash.png")}
				style={styles.pictureDelete}/>
		</TouchableOpacity>  
	  </View>
	);
  };
  
*/
const options = [
	{ label: '', value: 0 , activeColor:"rgba(118, 118, 128, 0.42)"},
	{ label: '', value: 1, activeColor:'green' }
];

const styles = StyleSheet.create({
	wheel_container: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	  },
	  wheel_container2: {
		flex: 1,
		flexDirection: 'column',
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	  },
	  wheel_text: {
		fontSize: 20,
		fontWeight: 'bold',
	  },
	container: {
		backgroundColor: 'transparent',
		width: "90%",
		height: 150,
	
	  },
	  sectionHeader: {
		//fontWeight: '800',
		fontSize: 1,
		color: '#f4f4f4',
		//marginTop: 2,
		//marginBottom: 5,
	  },  
	  item: {
		backgroundColor:"transparent"  ,
		margin: 5,
		
	  },
	  itemPhoto: {
		width: 80,
		height: 80,
	  },
	  itemText: {
		color: 'rgba(255, 255, 255, 0.5)',
		//marginTop: 5,
	  },  
	containerPicturesRow:
	{
		backgroundColor: 'transparent',
		flexDirection: "row",
		//alignItems: "center",
		//justifyContent: "center",
		//width: "90%",
		alignSelf: "flex-start",
	  }, 
	viewPicturesBackStock: {
		backgroundColor: 'transparent',
		padding: 10,
		alignItems: "center",
	  },    
	pictureDelete: {
		backgroundColor: 'transparent',
		shadowColor: "gray",
		shadowOffset: { height: 1, width: .5 },
		shadowOpacity: 0.3,
		shadowRadius: 0.1,   
		resizeMode: 'contain', 
		top:8,
		width: 30,
		height: 30,
		alignSelf: "center",
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
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "center",
		backgroundColor: "transparent",
		marginLeft: 9,
		marginRight: 14,
		marginTop: 0,
	},		
	previousNextButtons: {
		backgroundColor: "transparent",
		paddingLeft :140,
		paddingRight :140,
		//width: 750,
		height: 66,
		flexDirection: "row",
		//alignItems: "flex-start",
		//opacity: 1,
		flex: 1,
		//marginBottom: 15,
		justifyContent: 'space-between',
	},
    picture: {
        backgroundColor: 'transparent',
        top:0,
       // width: 150,
        height: 228,
        shadowColor: "gray",
        shadowOffset: { height: 4, width: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 0.4,   
        resizeMode: 'contain', 
      },
	  pictureCheck : {
        backgroundColor: 'transparent',
        marginTop:-5,
        width: 60,
        height: 60,
        shadowColor: "gray",
        shadowOffset: { height: 4, width: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 0.4,   
        resizeMode: 'contain', 
      },
    containerPictures: {
        backgroundColor: 'transparent',
        flexDirection: "row",
        width: "90%",
      },     
	referenceImage:{
		resizeMode:"contain",
		backgroundColor: "transparent",
        height: 220,
		width: "100%",
	},
    cameraIcon:{
		resizeMode:"contain",
		backgroundColor: "transparent",
        //height: 228,
        marginTop:20,
        alignSelf: "center",
	},    
    cameraIconCheck:{
		resizeMode:"contain",
		backgroundColor: "transparent",
        //height: 228,
        //marginTop:40,
		left:-15,
		marginRight:17,
        alignSelf: "center",
	}, 
    camerPlace:{
		resizeMode:"contain",
		backgroundColor: "transparent",
        height: 110,
        //marginTop:40,
		//left:-15,
		//marginRight:17,
        alignSelf: "center",
	}, 
    previewContainer: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "aliceblue",
        marginTop:25,
      },
      box: {
        flex: 1,
        height: 50,
        width: 50,
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
    buttonPoint : {
        resizeMode: "contain",
        height: 35,
        shadowColor: "gray",
        shadowOffset: { height: 3, width: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 0.2,  
        top:23,  
      },
	  labelCenter: {
        color: "#272727",
        fontFamily: "Montserrat-Regular",
        fontSize: 15,
        fontStyle: "normal",
        textAlign: "center",
        backgroundColor: "transparent",
        //left: 5,
        //marginRight:15
      },
    labelLeft: {
        color: "#272727",
        fontFamily: "Montserrat-Regular",
        fontSize: 15,
        fontStyle: "normal",
        textAlign: "left",
        backgroundColor: "transparent",
        left: 5,
        marginRight:15
      },
      labelFrac: {
        color: "#272727",
        fontFamily: "Montserrat-Regular",
        fontSize: 15,
        fontStyle: "normal",
        textAlign: "left",
        backgroundColor: "transparent",
        marginTop:2,
        left: -13,
        marginRight:15
      },       
      labelDescriptionRight: {
        color: "rgb(139, 25, 54)",
        //width:275,
        fontFamily: "Montserrat-Bold",
        fontSize: 26,
        fontStyle: "normal",
        textAlign: "center",
        backgroundColor: "transparent",

      },      
    viewItemRow:{
        marginBottom:10,
        backgroundColor: "transparent",
        flexDirection: "row",
      },

	  viewCommentsRow:{
        marginBottom:20,
        backgroundColor: "transparent",
		height: 40,
        flexDirection: "row",
      },
	  viewCommentsBackStockRow:{
        marginTop:30,
        backgroundColor: "transparent",
		height: 40,
		width: "90%",
       
      },	  
	  inputTxtCommentTextInput:{
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
		width: "100%",
	},
	viewComments:{
		top:-40,
	},
	viewPosition:{
      top:-40,
	},
	labePosition:{
			color: "#272727",
			fontFamily: "Montserrat-Bold",
			fontSize: 18,
			width:"100%",
			fontStyle: "normal",
			fontWeight: "bold",
			textAlign: 'center',
			backgroundColor: "transparent",
			marginBottom:15,
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
	  viewBtnClockOutView: {
		//backgroundColor : 'rgba(0,0,0,0.4)',
		//alignItems: "center",
		marginTop:240,
	  },
	swAttendanceSwitchNew: {
		backgroundColor: "transparent",
		borderStyle: "solid",
		width: 80,
		height: 21,
		left: -10,

		marginTop: -5,
	},
	viewTitlesView: {
		backgroundColor: "transparent",
		alignSelf: "flex-end",
		justifyContent: 'space-between',
		width: 671,
		height: 25,
		marginRight: 23,
		marginTop: 1,
		flexDirection: "row",
		alignItems: "flex-end",
	},	
	nameTextHead: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		marginLeft: 1,
	},	
	amountTextHead: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		marginLeft: 71,
	},	
	comesInTextHead: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		marginLeft: 21,
	},	
	notesTextHead: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		marginLeft: 35,
		width: 171,
	},	
	viewRowItemView: {
		backgroundColor: "transparent",
		//height: 64,
		marginLeft: 17,
		marginRight: 18,
		marginTop: 0,
		//flexDirection: "row",
		//alignItems: "flex-start",
		//justifyContent: 'space-between',
	},
	viewLineTopView: {
		backgroundColor: "rgb(184, 184, 184)",
		flex: 1,
		height: 1,
		marginTop: 5,
		left: 15,
		width: 730,
		//position: "absolute",	
	},		
	viewLineView: {
		backgroundColor: "rgb(184, 184, 184)",
		flex: 1,
		height: 1,
		marginTop: 7,
		left:15,
		width: 730,
	//	position: "absolute",	
	},
	viewItemView: {
		backgroundColor: "transparent",
		//alignSelf: "flex-end",
		justifyContent: 'space-between',
		width: 671,
		height: 40,
		marginRight: 23,
		marginTop: 5,
		flexDirection: "row",
		//alignItems: "flex-end",
	},	
	txtItemNameText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		left:0,
		width: 185,
		height:35,
		marginTop: 5,
	},
	ammountTextInput: {
		backgroundColor: "white",
		opacity: 0.5,
		padding: 5,
		color: "black",
		borderRadius: 5.5,
		shadowColor: "rgba(0, 0, 0, 0.16)",
		shadowRadius: 12,
		shadowOpacity: 1,		
		fontSize: 15,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 80,
		height: 33,
		left:20,
	},
	txtItemComesInText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		left: 65,
		width: 135,
		height:35,
		marginTop: 5,
	},
	txtItemNotesText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		left:32,
		width: 205,
		height:35,
		marginTop: 5,
	},
	titleItemCategoryText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		marginLeft: 10,
	},

	inputTxtNotesTextInput: {
		backgroundColor: "white",
		borderWidth: 1,
		borderColor: "rgb(112, 112, 112)",
		borderStyle: "solid",
		padding: 0,
		color: "black",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		alignSelf: "stretch",
		height: 91,
		marginLeft: 28,
		marginRight: 28,
		marginTop: 8,
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
		marginRight: 20,
		marginTop: 29,
	},
	btnbackButtonText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
	},		
	viewScrollView:{
		marginTop: 12,
	},
	viewView: {
		//backgroundColor: "rgb(239, 239, 244)",
		backgroundColor:"white",
		flex: 1,
		paddingBottom:0,
		//alignItems: "flex-start",
	},
	txtclockouttitleText: {
		color: "rgb(139, 25, 54)",
		fontFamily: "Montserrat-Bold",
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
		backgroundColor: "transparent",
	},
	txtclockouttitleText2: {
		color: "black",
		fontFamily: "Montserrat-Bold",
		fontSize: 20,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
		backgroundColor: "transparent",
	},	
	viewContenInventoryCheck:{
		top: 1,
	},
	viewNumberPlease:{
		top: 1,
		left:18,
	},
    txtItemNameTitleText: {
		color: "black",
		fontFamily: "Montserrat-Bold",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
		backgroundColor: "transparent",
        marginTop:10,

	},
	txtclockoutsubtitleText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		alignSelf: "center",
		marginTop: 16,
	},
	viewschecksView: {
		backgroundColor: "transparent",
		alignSelf: "stretch",
		height: 210,
		marginLeft: 206,
		marginRight: 178,
		marginTop: 10,
		alignItems: "flex-start",
		
	},
	viewschecksFirstView: {
		backgroundColor: "transparent",
		alignSelf: "stretch",
		height: 110,
		marginLeft: 206,
		marginRight: 178,
		marginTop: 10,
		alignItems: "flex-start",
		
	},	
	viewchktakerollView: {
		backgroundColor: "transparent",
		width: 64,
		height: 18,
		alignItems: "flex-start",
		right : -40,
	},
	
	viewRowCheckView: {
		backgroundColor: "transparent",
		//marginLeft: 17,
		//marginRight: 18,
		marginTop: 30,
		flexDirection: "row",
		alignItems: "flex-start",
		width: 494,
	},
	viewRowBootonView: {
		backgroundColor: "transparent",
		//marginLeft: 17,
		//marginRight: 18,
		marginTop: 30,
		flexDirection: "row",
		alignItems: "flex-start",
		width: 494,
	},
	txtlabeltakerollText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 392,
	},
	txtlabeltakerPictureText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		marginTop:15,
		width: 382,
	},
	viewchkdocumentssignedView: {
		backgroundColor: "transparent",
		width: 450,
		height: 36,
		marginTop: 10,
		alignItems: "flex-end",
	},
	txtlabeldocumentssignedText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 450,
	},
	viewchktakeoutView: {
		backgroundColor: "transparent",
		width: 292,
		height: 18,
		marginTop: 9,
		alignItems: "flex-start",
	},
	txtlabeltakeoutText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 342,
	},
	viewchkrestockstudentsuppView: {
		backgroundColor: "transparent",
		width: 216,
		height: 18,
		marginTop: 11,
		alignItems: "flex-start",
	},
	txtlabelrestockstudentsuppText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 292,
	},
	viewchktakeschedulebreaksView: {
		backgroundColor: "transparent",
		width: 151,
		height: 18,
		marginBottom: 11,
		alignItems: "flex-start",
	},
	txtlabeltakeschedulebreaksText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 292,
	},
	viewchkinventorycheckView: {
		backgroundColor: "transparent",
		width: 116,
		height: 18,
		alignItems: "flex-start",
	},
	txtlabelinventorycheckText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 292,
	},
	txtlabelbycheckingText: {
		color: "rgb(139, 25, 54)",
		fontFamily: "Montserrat-Regular",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 464,
		marginLeft: 175,
		marginTop: 27,
	},
	btnclockoutButton: {
		backgroundColor: "rgb(64, 1, 16)",
		borderRadius: 20,
		shadowColor: "rgba(0, 0, 0, 0.16)",
		shadowRadius: 12,
		shadowOpacity: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		width: 219,
		height: 48,
		marginLeft: 300,
		marginTop: 33,
	},
	btnInventoryUpdateButton: {
		backgroundColor: "rgb(0,154,218)",
		borderRadius: 20,
		shadowColor: "rgba(0, 0, 0, 0.16)",
		shadowRadius: 12,
		shadowOpacity: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		width: 269,
		height: 48,
		marginLeft: 280,
		marginTop: 133,
	},	
	btnInventoryNextButton: {
		backgroundColor: "white",
		borderRadius: 20,
		shadowColor: "rgba(0, 0, 0, 0.16)",
		shadowRadius: 5,
		shadowOpacity: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		width: 90,
		height: 48,
        alignSelf:"center",
		marginTop: 133,
	},
	btnRestockNextButton: {
		backgroundColor: "white",
		borderRadius: 20,
		shadowColor: "rgba(0, 0, 0, 0.16)",
		shadowRadius: 5,
		shadowOpacity: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		width: 90,
		height: 48,
        alignSelf:"center",
		marginTop: 483,
		position:"absolute",
	},	
	btnclockoutButtonText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
	},
	btncNextButtonText: {
		color: "rgb(139, 25, 54)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
	},
	btnclockoutButtonImage: {
		resizeMode: "contain",
		marginRight: 10,
	},
	txtlabelinventorycheckTwoText: {
		color: "rgb(139, 25, 54)",
		fontFamily: "Montserrat-Bold",
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		alignSelf: "center",
		marginTop: 67,
	},
	viewcontitemsView: {
		backgroundColor: "transparent",
		alignSelf: "center",
		width: 686,
		height: 465,
		marginBottom: 64,
	},
	viewrowView: {
		backgroundColor: "transparent",
		height: 52,
		flexDirection: "row",
		justifyContent: 'space-between',


		
	},






	viewrowTwoView: {
		backgroundColor: "transparent",
		height: 52,
		marginTop: 15,
	},
	viewcol1TwoView: {
		backgroundColor: "transparent",
		width: 144,
		height: 52,
		alignItems: "flex-start",
	},
	txtlabelcol1TwoText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 233,
		marginLeft: 6,
	},
	textinputcol1TwoTextInput: {
		backgroundColor: "rgba(118, 118, 128, 0.12)",
		borderRadius: 10,
		paddingLeft: 9,
		paddingTop: 7,
		color: "black",
		fontFamily: "Montserrat-Regular",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		alignSelf: "stretch",
		height: 36,
		marginTop: 1,
	},
	viewcol3TwoView: {
		backgroundColor: "transparent",
		width: 144,
		height: 52,
		alignItems: "flex-start",
	},
	textlabelcol3TwoText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 220,
		marginLeft: 6,
	},
	textinputcol3TwoTextInput: {
		backgroundColor: "rgba(118, 118, 128, 0.12)",
		borderRadius: 10,
		paddingLeft: 9,
		paddingTop: 7,
		color: "black",
		fontFamily: "Montserrat-Regular",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		alignSelf: "stretch",
		height: 36,
		marginTop: 1,
	},
	viewcol2TwoView: {
		backgroundColor: "transparent",
		position: "absolute",
		alignSelf: "center",
		width: 144,
		top: 0,
		height: 52,
		alignItems: "flex-start",
	},
	textlabelcol2TwoText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 234,
		marginLeft: 6,
	},
	textinputcol2TwoTextInput: {
		backgroundColor: "rgba(118, 118, 128, 0.12)",
		borderRadius: 10,
		paddingLeft: 9,
		paddingTop: 7,
		color: "black",
		fontFamily: "Montserrat-Regular",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		alignSelf: "stretch",
		height: 36,
		marginTop: 1,
	},
})
