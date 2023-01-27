//
//  App.js
//  Ipad Trainer Portal-r3b
//
//  Created by [Author].
//  Copyright © 2018 [Company]. All rights reserved.
//

import * as Font from "expo-font"
import Details from "./App/Details/Details"
import Classroom from "./App/Classroom/Classroom"
import Shift from "./App/Shift/Shift"
import Weekly from "./App/Weekly/Weekly"
import Monthly from "./App/Monthly/Monthly"
import Login from "./App/Login/Login"
import ChangePassword from "./App/Login/ChangePassword"				
import ClockOut from "./App/Inventory/Inventory"//"./App/Inventory/Inventory" //"./App/ClockOut/ClockOut"
import Inventory from "./App/Inventory/Inventory"
import Specifications from "./App/Specifications/Specifications"
import TakePicture from "./App/Incident/TakePicture"
import IncidentDetails from "./App/Incident/IncidentDetails"
import InjuredPersonDetails from "./App/Incident/InjuredPersonDetails"
import ReportedBy from "./App/Incident/ReportedBy"
import InjuredPersonDetailsReport from "./App/Incident/InjuredPersonDetailsReport"
import TakeEvidencePicture from "./App/Helper/TakeEvidencePicture"
import SubmitError from "./App/SubmitError/SubmitError"
import Constants from 'expo-constants';

import VideoPlayer from "./App/VideoPlayer/VideoPlayer"

import WebSocket from "./App/Helper/WebSocket"

import NetInfo from "@react-native-community/netinfo";

import Toast from 'react-native-tiny-toast';

//import Menu from "./App/Menu/Menu"
import React from "react"
// import { AppLoading, DangerZone } from "expo"
import AppLoading  from "expo-app-loading"
import { createAppContainer, createStackNavigator } from "react-navigation"
import { showMessage, hideMessage } from "react-native-flash-message";

import { Alert } from "react-native"
import { View,ScrollView ,Text} from "react-native-web"

import connectionHelper from "./App/Helper/Connection"; 


const PushRouteOne = createStackNavigator({
	Login: {
		screen: Login,		
		//screen: WebSocket,		
	},	
	Shift: {
		screen: Shift,		
		navigationOptions: () => ({
		gestureResponseDistance: {
			  horizontal: -1,			  
			  vertical: -1,			
			},		  
		}),	
	},	
	Weekly: {
		screen: Weekly,	
	}, 
	Monthly: {
		screen: Monthly,	
	},	
	Classroom: {
		screen: Classroom,
		navigationOptions: () => ({
			gestureResponseDistance: {
			  horizontal: -1,			  
			  vertical: -1, 
			},		  
		}),	
	},	
	SubmitError: {
		screen: SubmitError,		
		navigationOptions: () => ({
			gestureResponseDistance: {
			  horizontal: -1,			  
			  vertical: -1, 
			},		  
		}),	
	},	
	Details: {
		screen: Details,	
	},	
	ClockOut: {
		screen: ClockOut,		
		navigationOptions: () => ({
			gestureResponseDistance: {
			  horizontal: -1,			  
			  vertical: -1, 
			},		  
		}),
		},	
	Inventory: {
		screen: Inventory,		
		navigationOptions: () => ({
			gestureResponseDistance: {
			horizontal: -1,			  
			vertical: -1, 
		},		  
	}),	
	},		
	Specifications: {
		screen: Specifications,	
	},	
	TakePicture: {
		screen: TakePicture,	
	},	
	IncidentDetails: {
		screen: IncidentDetails,
	},	
	InjuredPersonDetails: {
		screen: InjuredPersonDetails,	
	},	
	ReportedBy: {
		screen: ReportedBy,	
	},	
	InjuredPersonDetailsReport: {
		screen: InjuredPersonDetailsReport,	
	},	
	TakeEvidencePicture: {
		screen: TakeEvidencePicture,	
	},	
	ChangePassword: {
		screen: ChangePassword,	
	},	
	WebSocket: {
		screen: WebSocket,	
	},	VideoPlayer: {
		screen: VideoPlayer,	
	},	
	/*
	Menu: {
		screen: Menu,	},	*/		
},{ drawerLockMode: 'locked-closed' },
{
	//initialRouteName: "Classroom",	 
	initialRouteName: "Login",	
	//initialRouteName: "WebSocket",	
})

const RootNavigator = createStackNavigator({
	PushRouteOne: {
		screen: PushRouteOne,	},}, {
	mode: "modal",	headerMode: "none",	initialRouteName: "PushRouteOne",})

const AppContainer = createAppContainer(RootNavigator)



export default class App extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			fontsReady: false,		}
	}

	 timeout(delay) {
		return new Promise( res => setTimeout(res, delay) );
	}

	async componentDidMount() {
        global.logs = global.logs + "\n" + 'App Release :' + " " + Constants.manifest.version  + " ( " + Constants.manifest.ios.buildNumber +" ) \n"
		
		 
		await this.initConnection()
		await this.initProjectFonts()
		
		if (global.debug_msg )
		{
			Toast.show("Test (App) : " +  global.logs + " \n" + JSON.stringify(global.net_state),{
				position: 20,					containerStyle:{
					backgroundColor: 'orange'
				},				
				duration	: 5000	,					
				textStyle:{
					color:'#fff',					   
				},					
				imgSource: null,					
				imgStyle: {},					
				mask: true,					
				maskStyle:{}
			  })

			  
		}
	}

	async initProjectFonts() {
	
		await Font.loadAsync({
			"Lato-Regular": require("./assets/fonts/LatoRegular.ttf"),			
			"PTSans-Regular": require("./assets/fonts/LatoRegular.ttf"), 
			//PTSans.ttc
			"Raleway-Bold": require("./assets/fonts/18456.otf"),			
			"Raleway": require("./assets/fonts/37550.otf"),			
			"SegoeUI": require("./assets/fonts/SegoeUI.ttf"),			
			"SFProText-Regular": require("./assets/fonts/FontsFreeNetSFProTextRegular.ttf"),			
			"Montserrat-Bold": require("./assets/fonts/37466.otf"),			
			"Montserrat-Regular": require("./assets/fonts/16353.otf"),		
		})
		console.log()
		this.setState({
			fontsReady: true,		})
	}

	async initConnection () {
		await NetInfo.fetch().then(state => {
			// "type": none,unknown,wifi,cellular,ethernet,other
			// isConnected : true, false, null
			// isInternetReachable : true, false, null
			console.log('Connection type::', state.type);
			console.log('Is connected?', state.isConnected);
			global.logs = global.logs + "\n" +"Internet Connection: " + 'Is connected?:' +state.isConnected  + '  Connection type:'+ state.type +"\n";
			
			global.net_state = state;

			if(state.isConnected) global.connection = 1; else  global.connection = 0;  
			
			connectionHelper.isConnectedToAPI()

			if(global.connection  === 0 || global.connectionTest === 0 ) {
				Toast.show("No Internet connection. Please make sure Cellular Data is on.",{
					position: 20,					containerStyle:{
						backgroundColor: 'orange'
					},				
					duration	: 3000	,					
					textStyle:{
						color:'#fff',					   
					},					
					imgSource: null,					
					imgStyle: {},					
					mask: true,					
					maskStyle:{}
				  })
				showMessage({
					message:  "Attention !",					
					description: global.msgNoConnection,					
					type: "danger",					
					icon : "info",					
					hideOnPress : true,					
					autoHide : false,					
					duration : 8000,	
	
				  });
			}else{
				console.log("state in  App: \n",state);
                console.log("............."+state.type+"......" )
				/*
				if(state.type == "wifi"){
					Toast.show("\nYou are connected to a Wi-Fi network. Please make sure Wi-Fi is off.",{
						position: 140,						
						containerStyle:{
							backgroundColor: '#FF6600' 
						},						
						duration	: 5000	,						
						textStyle:{
							color:'#fff',						   
						},						
						imgSource:  require("./assets/images/alert3_.png"),						
						imgStyle: {},						
						mask: true,						
						maskStyle:{}
					  })
				}  
				*/ 

			}
	
			if(global.connectionTest === 0  ) return 0; 
			console.log("internet")
			return global.connection;
		})
	}


	render() {
	
		if (!this.state.fontsReady) {
		 return (<AppLoading>
			{ global.debug_msg && <View>	   
				<ScrollView >
					
					<View><Text>{global.logs}</Text></View>
				</ScrollView>
			</View>}
		</AppLoading>); } 
		return <AppContainer>
			    { global.debug_msg && <View>	   
				  <ScrollView >	
					<View><Text>{global.logs}</Text></View>
				</ScrollView>
		  </View>}
		</AppContainer>
	}
}
