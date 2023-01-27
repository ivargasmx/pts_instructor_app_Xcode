import NetInfo from "@react-native-community/netinfo";
import { showMessage, hideMessage } from "react-native-flash-message";
import Toast from 'react-native-tiny-toast';

 const  connectionHelper = {

    isConnected : async function () {
		/*	
			CheckConnectivity = () => {
				// For Android devices
				if (Platform.OS === "android") {
				NetInfo.isConnected.fetch().then(isConnected => {
					if (isConnected) {
					Alert.alert("You are online!");
					} else {
					Alert.alert("You are offline!");
					}
				});
				} else {
				// For iOS devices
				NetInfo.isConnected.addEventListener(
					"connectionChange",			this.handleFirstConnectivityChange
				);
				}
			};

			handleFirstConnectivityChange = isConnected => {
				NetInfo.isConnected.removeEventListener(
				"connectionChange",		  this.handleFirstConnectivityChange
				);
			
				if (isConnected === false) {
				Alert.alert("You are offline!");
				} else {
				Alert.alert("You are online!");
				}
			};	

		*/
				/*
				NetInfo.addEventListener(state => {
					console.log('Connection type', state.type);
					console.log('Is connected?', state.isConnected);
				});
				//unsubscribe();
				*/

		/*		NetInfo.configure({
					reachabilityUrl: 'https://google.com',			reachabilityTest: async (response) => response.status === 200,			reachabilityLongTimeout: 60 * 1000, // 60s
					reachabilityShortTimeout: 5 * 1000, // 5s
					reachabilityRequestTimeout: 15 * 1000, // 15s
				});		
		/*
				NetInfo.fetch().then(state => {
					console.log('Connection type', state.type);
					console.log('Is connected?', state.isConnected);
				});
		*/
				
				
		/*NetInfo.fetch("wifi").then(state => {
			console.log("SSID", state.details.ssid);
			console.log("BSSID", state.details.bssid);
			console.log("Is connected?", state.isConnected);
		});

		*/         

				
				
		NetInfo.fetch().then(state => {
					global.logs = global.logs + "\n" + 'Connection type:', state.type
					console.log(' **** IN Connection Component Connection type', state.type); 
					console.log('**** IN Connection Component Is connected?', state.isConnected);
					global.logs = global.logs + "\n" +"Internet Connection: " + 'Is connected?:' +state.isConnected  + '  Connection type:'+ state.type +"\n";
					
					global.net_state = state;
					
					if(state.isConnected) global.connection = 1; else  global.connection = 0;  
					if(global.connection  === 0 || global.connectionTest === 0 ) {
						Toast.show(" No Internet connection. Please make sure Cellular data is on.",{
							position: 20,					
							containerStyle:{
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
					}
			         
					if(global.connectionTest === 0  ) return 0; 
					console.log("**** IN Connection interner")
					return state;
				})



        
    } ,
	isConnectedToAPI : async function () {
		url_ = global.host + "/api/system_status"
		body_data = ""
		console.log("**** IN isConnectedToAPI")
		//this.setState({_waiting : true})
		fetch(url_,{
			method: 'GET',
			headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json', 
			"cache-control": "no-cache"
			
			}
		
		}).then((response) =>  response.text()) //response.json())
		  .then((responseData) =>
				{
					console.log("::responseData::",responseData)
					global.logs =  global.logs  + "\n\n >>"  + responseData + "\n";
				   //this.setState({_waiting : false})
				   try {
					 var responseTXT = responseData;
					 var responseJSON = JSON.parse (responseTXT);
						if(responseJSON['success'] !== undefined) 
						{
							global.connection = 1;	
							global.logs =  global.logs  + "\n\n"  +  " >> CONNECTED  BY :api/system_status "  + "\n";
							return 1
						}else{
							global.connection = 0;
							global.logs =  global.logs  + "\n\n"  +  " >> NO CONNECTED  BY :api/system_status "  + "\n";

							return 0

						}
				    } catch (e) {
					    console.log(e);
					    global.connection = 0;
						global.logs =  global.logs  + "\n\n"  +  " >> NO CONNECTED  BY :api/system_status "  + "\n";

					    return 0
					}

				})  
		
        
    } ,

	isComunication : async function () {
      /*
		let time_out = 10;
		let counter = 0;
		let timer1 = setInterval(() => {
			console.log(counter + ' / ' + time_out + ' sec.. ');
            counter ++;
			//global.time_out_counter = counter
			if (counter == time_out) {
                clearInterval(timer1);
				//this.setState({_waiting : false}) 
				console.log('Time out finish');
				

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
            }
        }, 1000);	
		*/	

	},
}
export default connectionHelper; 