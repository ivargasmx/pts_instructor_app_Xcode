//
//  ClockOut
//  Ipad Trainer Portal-r4
//
//  Created by [Author].
//  Copyright © 2018 [Company]. All rights reserved.
//

import React from "react"
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View,Alert,ScrollView,Dimensions,ActivityIndicator,Switch  } from "react-native"
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import * as ImageManipulator from 'expo-image-manipulator';

import connDBHelper   from "../Helper/Dao";
import connectionHelper   from "../Helper/Connection"; 
import ShiftHeader from "../Headers/ShiftHeader"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Moment from 'moment'; 
import "./../../global.js";



export default class ClockOut extends React.Component {

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
			_course : this.props.navigation.state.params.course,		
	_roll:0,		
	_documents:1,		
	_trash:0,		
	_wipe:1,		
	_restock:0,		
	_breaks:0,		
	tostVisible:false,		
	localClockIn: [],		
	data: [],		
	cityName : "",		
	notes: "",		
	_waiting: false,		
	_checkedInventory: false,		
	shift_hours :0,		
	pictureArray : [], 
			imageB64Arr : [],  


		}
	}

	getLocationAsync = async () => {
		let { status } = await Location.requestForegroundPermissionsAsync() ;// Permissions.askAsync(Permissions.LOCATION);
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

	componentDidMount() {
		
		console.log(this.props.navigation.state.params);
		this.getLocationAsync();
		//OJO para local
		//connDBHelper.getLocalClockIn(this.state._course.id,global.user_id,this);
		this.getIniData();     
		this.setStSchedulTime();
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
		console.log("hours ",hours);
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
			pass.push(manipResizeResult.base64);
			this.setState({_trash:true})
			
		 } 
		 index = 2; 
		 if(pictureFileArray[index]){
			const manipResizeResult = await ImageManipulator.manipulateAsync(
				pictureFileArray[index],		
		[ { resize: {width:800} }],		
		{ compress: 0.70, format: ImageManipulator.SaveFormat.JPEG, base64:true }
			);
			pass.push(manipResizeResult.base64);
			this.setState({_wipe:true})
		 } 
		 index = 3;
		 if(pictureFileArray[index]){
			const manipResizeResult = await ImageManipulator.manipulateAsync(
				pictureFileArray[index],		
		[ { resize: {width:800} }],		
		{ compress: 0.70, format: ImageManipulator.SaveFormat.JPEG, base64:true }
			);
			pass.push(manipResizeResult.base64);
			
		 }  

		this.setState({imageB64Arr:pass})
	
		console.log( pass.length, " en  processImage:" );
        if(pictureFileArray[1] ) console.log( "1 tiene datos ");
		if(pictureFileArray[2] ) console.log( "2 tiene datos ");
		if(pictureFileArray[3] ) console.log( "3 tiene datos ");

	};
	
	getIniData(){			
		let assignment_id = 0;
		
		if(global.inventory_check == 0) return; // Not inventory for this Shift
		this.setState({_waiting : true})
		fetch(global.host + '/api/auth/inventory/'+global.shift_id, { 
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
					try {
					
						let responseTXT = responseData;
						let responseJSON = JSON.parse (responseTXT); 
					
						if(responseJSON['success'] !== undefined) {
							console.log(responseJSON["assignment"].course.city.name);
							this.setState({cityName:responseJSON["assignment"].course.city.name });
							this.setState({data:responseJSON["assignment"].course.city.inventoryItems });	
							
						} else{
							console.log("ERROR");
							if (responseJSON['message'] == "Unauthenticated."){
							Alert.alert(
								'Attention !',								'Your session expired. Please login again.',								[
								{text: 'OK', onPress: () => console.log('OK Pressed')},								],								{cancelable: false},							);
							
						
							}else{
								console.log(responseJSON['message']);
							}
						} 



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
	
					//console.log(error);	 
					//console.error(error);
					this.setState({
						authenticated :0
					});
				});
}

 onUpdateInventoryButtonPressed = () => {
   let UpdateInventoryMesage =  this.buildInventoryMessage();
   this.setState({_waiting : true})
   fetch(global.host + '/api/auth/inventory/'+global.shift_id, { 
	method: 'POST',	headers: {
	   'Accept': 'application/json',	   'Content-Type': 'application/json', 
	   "cache-control": "no-cache",	   'Authorization' : global.token_type +  " " + global.access_token
	},	body: 
		UpdateInventoryMesage
	
   
  }).then((response) =>  response.text()) 
		.then((responseData) =>
		 {
		   this.setState({_waiting : false})
		   this.setState({_checkedInventory:true})
		   try {
			   var responseTXT = responseData;
			   let responseJSON = JSON.parse (responseTXT); 

			   if(responseJSON['success'] !== undefined && responseJSON['success'] !== false )  {
					  connDBHelper.setClockOutOk(this.state.course_date_id,global.user_id,shift_time_id);   
					

				Alert.alert(
					'Inventory',		
			"You Updated the Inventory success",					[
					{text: 'OK', onPress: () => {

						 }
					},		
			],		
			{cancelable: false},		
		   );
				
						  
				 } else{
					console.log("ERROR");
					console.log(responseJSON);
					if (responseJSON['message'] == "Unauthenticated."){
					Alert.alert(
						'Attention !',						'Your session expired. Please login again.',						[
						{text: 'OK', onPress: () => {console.log('OK Error Pressed');return;}},						],						{cancelable: false},					);
					
					   //this.onLoginfailure();  
					}else{ 
						if(responseJSON['exception'] !== undefined  ){
							Alert.alert(
								'Error !',								responseJSON['message'] ,								[
								{text: 'OK', onPress: () => {console.log('OK Error Pressed');return;}},								],								{cancelable: false},							);
				    	}

					}
					if (responseJSON['msg'] == "Error Clock Out"){
						Alert.alert(
							responseJSON['msg'] +'!',							responseJSON['error'],							[
							{text: 'OK', onPress: () => {
								console.log('OK Pressed Message Error');
								
							}
							
							},							],							{cancelable: false},						);
						
							
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

 buildInventoryMessage(){
	let inventoryJSONMessage =   JSON.stringify({city_id:global.city_id});
	let itemArray = "";
    var category =  this.state.data.map((categories,i)=>{ 
	    var itemAll =  categories.map((items,j)=>{ 
			itemArray = itemArray +  '"'+items.id+'": {"amount": "'+items.amount+'"},'
			
		});
	});
	itemArray = itemArray.substring(0,itemArray.length -1);
	inventoryJSONMessage = '{ "inventoryItems": { '+ itemArray+ '},"notes":'+ JSON.stringify(this.state.notes)+ ',"city_id":' +global.city_id +'  }';
	return inventoryJSONMessage;
 }

 

 onClockOutButtonPressed = () => {
 
		let shift_id = this.state._course.id;
		let	objectClockOut = {shift_time_id:global.shift_time_id, device_setup:0,latitude:(this.state.location ? this.state.location.latitude :0)
			,longitude:(this.state.location ? this.state.location.longitude :0),checklist:this.getArrayChecks() ,city_id:global.city_id } ;

	 global.logs = "Clock - OUT (objectClockOut): " + JSON.stringify(objectClockOut) + "\n";



       this.props.navigation.state.params.context.setColorClockIn();
       if(global.clock == 0) {
			Alert.alert(
				'Attention !',				'You need Clock in before.',				[
				{text: 'OK', onPress: () => console.log('OK Pressed')},				],				{cancelable: false},			);
			return;
		}


		if(global.connection !== 1) {

			Alert.alert(
				'Attention !',				'Your Clock Out, has been saved locally due to not having internet access.',				[
				{text: 'OK', onPress: () => {
					   connDBHelper.saveClock( shift_id, global.shift_time_id, this.state._course.course_date_id,global.user_id,0,this.state._course.instructor_id,3,JSON.stringify(objectClockOut));
					   connDBHelper.setClockInOff(this.state._course.course_date_id,global.user_id,global.shift_time_id)  ;
					   global.clock =0;
					   console.log('OK Success Pressed');
					   //global.shift_time_id = 0;
					   this.props.navigation.state.params.context.setColorClockIn();
					   this.onOkPressed();
					 }
				},				],				{cancelable: false},			   );

			 
			return;
		}

		let picturesOk = true;
		let errorMessage = "";
		if(! this.state._breaks ) {
			errorMessage = "Take schedule breaks  is required";
			
			picturesOk = false;
		}		

		if(! this.state.imageB64Arr[0] ) {
			errorMessage = "Take out the trash (empty trash can photo) is required";
			
			picturesOk = false;
		}

		if(! this.state.imageB64Arr[1] &&  picturesOk ) {
			errorMessage = "Vacuum / mop (floor photo) is required";
			this.setState({_wipe:false})
			picturesOk = false;
		}

		if(! this.state.imageB64Arr[2] &&  picturesOk ) {
			errorMessage = "Clean up (classroom full shot) is required";
			picturesOk = false;
		}		

        if(! picturesOk) {
			Alert.alert(
				'Error Clock Out!',		
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

		//objectClockOut.pictureArrayB64  = this.state.imageB64Arr;
		objectClockOut.trash_picture  = this.state.imageB64Arr[0]
		objectClockOut.floor_picture =this.state.imageB64Arr[1]
		objectClockOut.classroom_picture = this.state.imageB64Arr[2]




        this.setState({_waiting : true})
		fetch(global.host + '/api/auth/clockout', {
			method: 'POST',		
	headers: {
			   'Accept': 'application/json',		
	   'Content-Type': 'application/json', 
			   "cache-control": "no-cache",		
	   'Authorization' : global.token_type +  " " + global.access_token
			},		
	body: JSON.stringify(
				objectClockOut
			)
		   
		  }).then((response) =>  response.text()) 
				.then((responseData) =>
				 {
					//console.log(responseData); 
					global.logs = global.logs + " Clock - OUT (Response): " + JSON.stringify(responseData) + "\n";
					this.setState({_waiting : false})
				   try {
					   var responseTXT = responseData;
					   let responseJSON = JSON.parse (responseTXT); 

					   if(responseJSON['success'] !== undefined && responseJSON['success'] !== false )  {
						      connDBHelper.setClockOutOk(this.state.course_date_id,global.user_id,shift_time_id);   
							

						Alert.alert(
							'Today you worked',							"From " + responseJSON['clock_in_time'].substring(11,19) + " to " +  responseJSON['clock_out_time'].substring(11,19),							[
							{text: 'OK', onPress: () => {
								   connDBHelper.saveClock( shift_id, global.shift_time_id, this.state._course.course_date_id,global.user_id,1,this.state._course.instructor_id,3,JSON.stringify(objectClockOut));
								   console.log('OK Success Pressed');
								   global.clock = 0;
					               this.props.navigation.state.params.context.setColorClockIn();
								   connDBHelper.setClockInOff(this.state._course.course_date_id,global.user_id,global.shift_time_id)  ;

								   this.onOkPressed();
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
						'Your session expired. Please login again.',								[
								{text: 'OK', onPress: () => {console.log('OK Error Pressed');return;}},								],								{cancelable: false},							);
							
							   //this.onLoginfailure();  
							}
							if (responseJSON['msg'] == "Error Clock Out"){
								Alert.alert(
									responseJSON['msg'] +'!',		
							responseJSON['error'],									[
									{text: 'OK', onPress: () => {
										console.log('OK Pressed Message Error');
										
									}
									
								    },									],									{cancelable: false},								);
								
								    
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

	onOkPressed(){
		this.props.navigation.state.params.context.onReturnFromApplayClockOut()
		this.props.navigation.state.params._onLoadGetUsers(global.location_now.latitude,global.location_now.longitude); 
		this.props.navigation.goBack();
	}
	onBtnBackPressed = () => {

		this.props.navigation.state.params.context.onReturnFromClockOut()
		this.props.navigation.goBack()
	}
	onChangeOption (value)  {
	//	console.log(value);

		//this.setState({ _roll : options[value].value   })  
	}
    getArrayChecks(){
		let arr = [];

		if(this.state._roll)  arr.push( "roll");
		if(this.state._rdocuments)  arr.push( "documents");
		if(this.state._trash)  arr.push( "trash");
		if(this.state._wipe)  arr.push( "wipe");
		if(this.state._restock)  arr.push( "restock");
		if(this.state._breaks)  arr.push( "breaks");
		if(this.state._documents)  arr.push( "documents");

		return arr;
	}

    deletePicture= (index) => {
        let _array = this.state.pictureArray
        _array.splice(index,1);
        this.setState({pictureArray:_array})
      }
   async addPicture(image){
	console.log("addPicture");
        let _array = this.state.pictureArray
        if(_array == null ) _array = [];
        if(_array.length > 4){
          alert('You can add up to 4 pictures!');
          return;
        }
		console.log(this.state.imageType);
        //_array.push(image);
		if(this.state.imageType == ""  )
            _array[0] =image;
		if(this.state.imageType == "trash"  )
            _array[1] =image;	
		if(this.state.imageType == "floor"  )
            _array[2] =image;	
		if(this.state.imageType == "classroom"  )
            _array[3] =image;							

        this.setState({pictureArray:_array})

		console.log(_array);
		this.setState({imageType:""})
		await this.processImage (_array)
      }

    onTakePicturePress = () => {
        const { navigate } = this.props.navigation
		this.setState({imageType:""})
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
	  
	  onTakePictureClassroomPress = () => {
		console.log("onTakePictureClassroomPress");  
        const { navigate } = this.props.navigation
		this.setState({imageType:"classroom"})
        navigate("TakePicture", {parentPage:this});
      }


	render() {
		let cheked = 0;
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
						style={styles.btnbackButton}>
						<Text
							style={styles.btnbackButtonText}>Back</Text>
					</TouchableOpacity>

					{ ( global.inventory_check == 0  ||  ( global.inventory_check == 1 && this.state._checkedInventory ) ) &&
					 <View>
						<Text
							style={styles.txtclockouttitleText}>Clock out check list</Text>
						<Text
							style={styles.txtclockoutsubtitleText}>Make sure you have done the following before clocking out</Text>
					
					

				
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
							{ false &&
							<View
								style={styles.viewRowCheckView}>
								<Switch
									trackColor={{ false: "#767577", true: "rgba(202, 245, 210)" }}
									thumbColor={this.state._trash ? "green":"rgba(118, 118, 128, 0.22)" }
									ios_backgroundColor="rgba(255, 255, 255)"
									onValueChange={value=> { this.setState({ _trash : value   })  } }
									style={styles.swAttendanceSwitchNew}
									value={this.state._trash}
								/>
								<Text
									style={styles.txtlabeltakerollText}>Take out the trash, vacum/mop, clean up</Text>
							</View>
	}
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
									style={styles.txtlabeltakerollText}>Take schedule breaks</Text>
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
									style={styles.txtlabeltakerollText}>Inventory Check</Text>
							</View>
							}

						</View>

					
					


						<View style={styles.viewBtnClockOutView}>
								<Text
									style={styles.txtlabelbycheckingText}>*By checking this boxes I confirm that I've taken care of the required items.</Text>
								<TouchableOpacity
									onPress={this.onClockOutButtonPressed}
									style={styles.btnclockoutButton}>
									<Image
									source={require("./../../assets/images/grupo-61.png")}
									style={styles.btnclockoutButtonImage}/>
									<Text
									style={styles.btnclockoutButtonText}>Clock Out</Text>
								</TouchableOpacity>
						</View>
					</View> }
				<KeyboardAwareScrollView behavior={ Platform.OS === 'ios'? 'padding': null } extraHeight = {200}>
				<ScrollView 
						style={styles.viewScrollView}>
					 { ( global.inventory_check == 1  && ! this.state._checkedInventory ) && 	
					   <View>						 	
							<Text
								style={styles.txtclockouttitleText}>{this.state.cityName} Inventory
							</Text>


							<ChildElementItemClass  result={this.state.data}  />  
						
							<Text
								style={styles.titleItemCategoryText}>Notes:
							</Text> 
							<TextInput
								onChangeText = {(notes) => this.setState({notes})} 
								//onBlur
								//returnKeyType="go"
								autoCorrect={false}
								multiline={true}
								//selectTextOnFocus = {true}
								//value={this.state.currentNote}
								style={styles.inputTxtNotesTextInput}
								//autoCapitalize="none" 
								//returnKeyType="done"
								//returnKeyType= "next"
								//keyboardType="numbers-and-punctuation"
								/>	
							<TouchableOpacity
								onPress={this.onUpdateInventoryButtonPressed}
								style={styles.btnInventoryUpdateButton}>

								<Text
								style={styles.btnclockoutButtonText}>Update Inventory</Text>
							</TouchableOpacity>
						</View>		
	                  }


					 <View
					   style={{
								    height : 80,									flex: 1,						}}/> 

				</ScrollView>						
				</KeyboardAwareScrollView>

				<View  style={[styles.containerWait, !this.state._waiting ? styles.containerHiddend : {}]}>
                      <ActivityIndicator size="large" color="#ffff"  />    
			    </View>	


			</View>
	}
	
}

export class ChildElementItemClass extends React.Component{ 
	
	constructor(props) {
		super(props);
		this.state = {
			dump:0,		};
	}

	render(){
		if(this.props.result){  

			let index = 0;
			//console.log(this.props);
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
		console.log(index);
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
									//console.log(this.props.result[i]);
									//console.log(category);
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

const options = [
	{ label: '', value: 0 , activeColor:"rgba(118, 118, 128, 0.42)"},	{ label: '', value: 1, activeColor:'green' }
];
const styles = StyleSheet.create({
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
      },	txtlabeltakerPictureText: {
		backgroundColor: "transparent",		
		color: "rgb(39, 39, 39)",		
		fontFamily: "Montserrat-Bold",		
		fontSize: 14,		fontStyle: "normal",		
		fontWeight: "normal",		
		textAlign: "left",		
		marginTop:15,		
		width: 332,	},    
		cameraIconCheck:{
		resizeMode:"contain",		
		backgroundColor: "transparent",        
//height: 228,        
//marginTop:40,		
		left:-15,		
		marginRight:17,        
		alignSelf: "center",	}, 
	viewRowBootonView: {
		backgroundColor: "transparent",		
		//marginLeft: 17,		
		//marginRight: 18,		
		marginTop: 30,		
		flexDirection: "row",		
		alignItems: "flex-start",		
		width: 494,	},	
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
	},	viewTitlesView: {
		backgroundColor: "transparent",		
		alignSelf: "flex-end",		
		justifyContent: 'space-between',		
		width: 671,		
		height: 25,		
		marginRight: 23,		
		marginTop: 1,		flexDirection: "row",		
alignItems: "flex-end",	},	
	nameTextHead: {
		color: "rgb(39, 39, 39)",		
fontFamily: "Montserrat-Bold",		
fontSize: 14,		
fontStyle: "normal",		
fontWeight: "bold",		
textAlign: "left",		
backgroundColor: "transparent",		
marginLeft: 1,	},	
	amountTextHead: {
		color: "rgb(39, 39, 39)",		
fontFamily: "Montserrat-Bold",		
fontSize: 14,		
fontStyle: "normal",		
fontWeight: "bold",		
textAlign: "left",		
backgroundColor: "transparent",		
marginLeft: 71,	},	
	comesInTextHead: {
		color: "rgb(39, 39, 39)",		
fontFamily: "Montserrat-Bold",		
fontSize: 14,		
fontStyle: "normal",		
fontWeight: "bold",		
textAlign: "left",		
backgroundColor: "transparent",		
marginLeft: 21,	},	
	notesTextHead: {
		color: "rgb(39, 39, 39)",		
fontFamily: "Montserrat-Bold",		
fontSize: 14,		
fontStyle: "normal",		
fontWeight: "bold",		
textAlign: "left",		
backgroundColor: "transparent",		
marginLeft: 35,		
width: 171,	},	
	viewRowItemView: {
		backgroundColor: "transparent",		
//height: 64,		
marginLeft: 17,		
marginRight: 18,		
marginTop: 0,		
//flexDirection: "row",		
//alignItems: "flex-start",		
//justifyContent: 'space-between',	},	
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
width: 730,	//	position: "absolute",	
	},	viewItemView: {
		backgroundColor: "transparent",		
//alignSelf: "flex-end",		
justifyContent: 'space-between',		
width: 671,		
height: 40,		
marginRight: 23,		
marginTop: 5,		
flexDirection: "row",		
//alignItems: "flex-end",	},	
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
marginTop: 5,	},	ammountTextInput: {
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
left:20,	},	txtItemComesInText: {
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
marginTop: 5,	},	txtItemNotesText: {
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
marginTop: 5,	},	titleItemCategoryText: {
		color: "rgb(39, 39, 39)",		
fontFamily: "Montserrat-Bold",		
fontSize: 16,		
fontStyle: "normal",		
fontWeight: "bold",		
textAlign: "left",		
backgroundColor: "transparent",		
marginLeft: 10,	},	inputTxtNotesTextInput: {
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
marginTop: 8,	},	btnbackButton: {
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
marginTop: 29,	},	btnbackButtonText: {
		color: "white",		
fontFamily: "Montserrat-Bold",		
fontSize: 16,		
fontStyle: "normal",		
fontWeight: "bold",		
textAlign: "left",	},		

	viewScrollView:{
		marginTop: 12,	},	viewView: {
		//backgroundColor: "rgb(239, 239, 244)",		
backgroundColor:"white",		
flex: 1,		
paddingBottom:0,		
//alignItems: "flex-start",	},	txtclockouttitleText: {
		color: "rgb(139, 25, 54)",		
fontFamily: "Montserrat-Bold",		
fontSize: 24,		
fontStyle: "normal",		
fontWeight: "bold",		
textAlign: "left",		
backgroundColor: "transparent",		
marginLeft: 286,		
//marginTop: 80,	},	txtclockoutsubtitleText: {
		color: "rgb(39, 39, 39)",		
fontFamily: "Montserrat-Regular",		
fontSize: 16,		
fontStyle: "normal",		
fontWeight: "normal",		
textAlign: "left",		
backgroundColor: "transparent",		
alignSelf: "center",		
marginTop: 16,	},	viewschecksView: {
		backgroundColor: "transparent",		
alignSelf: "stretch",		
height: 210,		
marginLeft: 206,		
marginRight: 178,		
marginTop: 10,		
alignItems: "flex-start",		

	},	viewchktakerollView: {
		backgroundColor: "transparent",		
width: 64,		
height: 18,		
alignItems: "flex-start",		
right : -40,	},	
	viewRowCheckView: {
		backgroundColor: "transparent",		
//marginLeft: 17,		
//marginRight: 18,		
marginTop: 30,		
flexDirection: "row",		
alignItems: "flex-start",		
width: 494,		

	},	txtlabeltakerollText: {
		backgroundColor: "transparent",		
color: "rgb(39, 39, 39)",		
fontFamily: "Montserrat-Bold",		
fontSize: 14,		
fontStyle: "normal",		
fontWeight: "normal",		
textAlign: "left",		
width: 392,	},	
viewchkdocumentssignedView: {
		backgroundColor: "transparent",		
width: 450,		
height: 36,		
marginTop: 10,		
alignItems: "flex-end",	},	txtlabeldocumentssignedText: {
		backgroundColor: "transparent",		
color: "rgb(39, 39, 39)",		
fontFamily: "Montserrat-Bold",		
fontSize: 14,		
fontStyle: "normal",		
fontWeight: "normal",		
textAlign: "left",		
width: 450,	},	viewchktakeoutView: {
		backgroundColor: "transparent",		
width: 292,		
height: 18,		
marginTop: 9,		
alignItems: "flex-start",	},	txtlabeltakeoutText: {
		color: "rgb(39, 39, 39)",		
fontFamily: "Montserrat-Bold",		
fontSize: 14,		
fontStyle: "normal",		
fontWeight: "normal",		
textAlign: "left",		
backgroundColor: "transparent",		
width: 342,	},	viewchkrestockstudentsuppView: {
		backgroundColor: "transparent",		
width: 216,		
height: 18,		
marginTop: 11,		
alignItems: "flex-start",	},	txtlabelrestockstudentsuppText: {
		backgroundColor: "transparent",		
color: "rgb(39, 39, 39)",		
fontFamily: "Montserrat-Bold",		
fontSize: 14,		
fontStyle: "normal",		
fontWeight: "normal",		
textAlign: "left",		
width: 292,	},	viewchktakeschedulebreaksView: {
		backgroundColor: "transparent",		
width: 151,		
height: 18,		
marginBottom: 11,		
alignItems: "flex-start",	},	txtlabeltakeschedulebreaksText: {
		color: "rgb(39, 39, 39)",		
fontFamily: "Montserrat-Bold",		
fontSize: 14,		
fontStyle: "normal",		
fontWeight: "normal",		
textAlign: "left",		
backgroundColor: "transparent",		
width: 292,	},	viewchkinventorycheckView: {
		backgroundColor: "transparent",		
width: 116,		
height: 18,		
alignItems: "flex-start",	},	txtlabelinventorycheckText: {
		color: "rgb(39, 39, 39)",		
fontFamily: "Montserrat-Bold",		
fontSize: 14,		
fontStyle: "normal",		
fontWeight: "normal",		
textAlign: "left",		
backgroundColor: "transparent",		
width: 292,	},	txtlabelbycheckingText: {
		color: "rgb(139, 25, 54)",		
fontFamily: "Montserrat-Regular",		
fontSize: 12,		
fontStyle: "normal",		
fontWeight: "normal",		
textAlign: "left",		
backgroundColor: "transparent",		
width: 464,		
marginLeft: 175,		
marginTop: 27,	},	btnclockoutButton: {
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
marginTop: 33,	},	btnInventoryUpdateButton: {
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
marginTop: 33,	},	
	btnclockoutButtonText: {
		color: "white",		
fontFamily: "Montserrat-Bold",		
fontSize: 24,		
fontStyle: "normal",		
fontWeight: "bold",		
textAlign: "left",	},	btnclockoutButtonImage: {
		resizeMode: "contain",		
marginRight: 10,	},	txtlabelinventorycheckTwoText: {
		color: "rgb(139, 25, 54)",		
fontFamily: "Montserrat-Bold",		
fontSize: 24,		
fontStyle: "normal",		
fontWeight: "bold",		
textAlign: "left",		
backgroundColor: "transparent",		
alignSelf: "center",		
marginTop: 67,	},	viewcontitemsView: {
		backgroundColor: "transparent",		
alignSelf: "center",		
width: 686,		
height: 465,		
marginBottom: 64,	},	viewrowView: {
		backgroundColor: "transparent",		
height: 52,		
flexDirection: "row",		
justifyContent: 'space-between',		

	},



	viewrowTwoView: {
		backgroundColor: "transparent",		
height: 52,		
marginTop: 15,	},	viewcol1TwoView: {
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
alignItems: "flex-start",	},	textlabelcol3TwoText: {
		backgroundColor: "transparent",		
color: "rgb(39, 39, 39)",		
fontFamily: "Montserrat-Regular",		
fontSize: 12,		
fontStyle: "normal",		
fontWeight: "normal",		
textAlign: "left",		
width: 220,		
marginLeft: 6,	},	textinputcol3TwoTextInput: {
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
marginTop: 1,	},	
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
marginLeft: 6,	},	textinputcol2TwoTextInput: {
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
marginTop: 1,	},})
