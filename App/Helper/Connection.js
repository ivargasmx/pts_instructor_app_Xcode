import NetInfo from "@react-native-community/netinfo";
import { showMessage, hideMessage } from "react-native-flash-message";
import Toast from 'react-native-tiny-toast';

 const  connectionHelper = {

    isConnected : function () {
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
            console.log('Connection type', state.type);
			console.log('Is connected?', state.isConnected);
			global.logs = global.logs + "\n" +"Internet Connection: " + 'Is connected?:' +state.isConnected  + '  Connection type:'+ state.type +"\n";
			
			if(state.isConnected) global.connection = 1; else  global.connection = 0;  
			if(global.connection  === 0 || global.connectionTest === 0 ) {
				Toast.show("No Internet connection. Please make sure wifi is off.",{
					position: 20,					containerStyle:{
						backgroundColor: 'orange'
					},					duration	: 1000	,					textStyle:{
						color:'#fff',					   },					imgSource: null,					imgStyle: {},					mask: true,					maskStyle:{}
				  })
				showMessage({
					message:  "Attention !",					description: global.msgNoConnection,					type: "danger",					icon : "info",					hideOnPress : true,					autoHide : false,					duration : 8000,	
	
				  });
			}
	
			if(global.connectionTest === 0  ) return 0; 
			console.log("interner")
			return global.connection;
        })



        
    } 
}
export default connectionHelper;