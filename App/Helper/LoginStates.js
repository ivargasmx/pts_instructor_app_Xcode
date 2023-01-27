import React, { useRef, useState, useEffect } from 'react';
import { AppState, StyleSheet, Text, View } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { Camera } from "expo-camera";
import * as NotificationsKey from 'expo-notifications';
//import Session from "../Helper/Sessions"
import connectionHelper from "./Connection"; 

const LoginStates = (props) => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

   
  useEffect(() => {
    const subscription = AppState.addEventListener("change", _handleAppStateChange);
    return () => {
      console.log("... LoginState :::  subscription.remove() ")
      subscription.remove();
      console.log(".... ok")
    };
  }, []);


  const _handleAppStateChange = async nextAppState => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      console.log('LoginState ::: App has come to the foreground!');
      // OJO LLAMADA RE LOGIN Session.recoverLoginSession();
      
      //const hearb =  await updateStatus()
       //let resulta = hearb // global.login_session
      ///////console.log("resulta = Session.sendHeartBeat : ",resulta )

      console.log("global.login_session:" ,global.login_session)
      if(! global.login_session ) {

        //props.functionSetConection()
        // Connection
        await NetInfo.fetch().then(state => {
          console.log('Connection type::', state.type);
          console.log('Is connected?', state.isConnected);
          global.logs = global.logs + "\n" +" (FOCUS) Internet Connection: " + 'Is connected?:' +state.isConnected  + '  Connection type:'+ state.type +"\n";
          global.net_state = state;
          connectionHelper.isConnectedToAPI()
          if(state.isConnected) global.connection = 1; else  global.connection = 0;  
          if(!state.isConnected)
             props.functionSetConection()
          
        })
        
        // Camera Status
        const cameraPermission = await Camera.requestCameraPermissionsAsync() 
        const cameraAvailable = cameraPermission.status === "granted"
        console.log("cameraPermission:",cameraPermission)
        console.log("cameraAvailable::",cameraAvailable)
        global.logs = global.logs  + "\n\n (FOCUS) cameraStatus:cameraPermission.status  :" + cameraPermission.status+" \n"
    
      // Notification
    
      const { status: existingStatus } = await NotificationsKey.getPermissionsAsync();
      const { status } = await NotificationsKey.requestPermissionsAsync();
      const notificationsAvailable = existingStatus === 'granted'
      
      global.logs = global.logs  + " (FOCUS): notificationStatus :" + existingStatus + " \n"
      console.log(" (FOCUS): NotificationsKey.getExpoPushTokenAsync()")
      console.log("(FOCUS) notificationStatus :" + existingStatus )
			token = (await NotificationsKey.getExpoPushTokenAsync()).data;
			global.logs = global.logs  + " Push Notification Token: " + token + "\n"
			global.push_notification_key = token;
			console.log(global.push_notification_key);
      global.logs = global.logs  + "\n\n (FOCUS) notificationStatus :" + existingStatus +" \n"

    if( ! global.net_state.isConnected   ){
        global.logs = global.logs  + "\n\n   > (FOCUS) internetFocusStatus  :" + false+" \n"
        props.functionSetConection()
      }
    if( global.connection == 0){
             props.functionSetConection()
             global.logs = global.logs  + "\n\n   > (FOCUS) global.connection  : 0" 
       }
     /*  
        if(global.net_state.type === 'wifi'){
          props.functionCheckStatus( "internet",false)
        }
       
        if(global.net_state.type === 'none'){
          props.functionCheckStatus( "internet",false)

        }
        if(! global.net_state.isConnected ){
           props.functionCheckStatus( "internet",false)
         }
*/



        if( !cameraAvailable  ){
          props.functionCheckStatus( "camera",false)
        }
        if(  !notificationsAvailable && cameraAvailable  ){
          props.functionCheckStatus( "notification",false)
        }        

      }
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log('LoginState ::: AppState::', appState.current);
  };

  async function  updateNotificationStatus() {  
    //global.net_state.type  === "wifi" ! this.state.internetStatus
      console.log( "updateNotificationStatus");
			global.logs = global.logs  + " Start: NotificationsKey.getExpoPushTokenAsync() \n"
			token = (await NotificationsKey.getExpoPushTokenAsync()).data;
			global.logs = global.logs  + " Push Notification Token: " + token + "\n"
			global.push_notification_key = token;
			console.log(global.push_notification_key);
  };

  return (
    <View style={styles.container}>
      { false && <Text  style={styles.titleText}>Current Login state is: {appStateVisible}</Text>}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
	titleText: {
		backgroundColor: "transparent",
		color: "black",
		fontSize: 28,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "center",
		width: 378,
	},
	
});

export default LoginStates;