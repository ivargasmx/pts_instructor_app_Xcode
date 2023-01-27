import React, { useRef, useState, useEffect } from 'react';
import { AppState, StyleSheet, Text, View } from 'react-native';
import Session from "../Helper/Sessions"


const AppStates = () => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);


  useEffect(() => {
    const subscription = AppState.addEventListener("change", _handleAppStateChange);
    return () => {
      console.log("... hi ")
      subscription.remove();
    };
  }, []);


   const _handleAppStateChange = async nextAppState => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!');
      // OJO LLAMADA RE LOGIN Session.recoverLoginSession();
      
      const hearb =  await sendHeartBeat()
       let resulta = hearb // global.login_session
      console.log("resulta = Session.sendHeartBeat : ",resulta )

      console.log("global.login_session-----------> ",global.login_session)
      if(! global.login_session ) {
        Session.recoverLoginSession();
        global.login_session_user_confirm = true
      }
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log('AppState::', appState.current);
  };

  async function  sendHeartBeat() {
    console.log( "sendHeartBeat");
    let body_data = JSON.stringify({
     notification_token_id:global.push_notification_key
    })
    console.log("body_data :: ",body_data)

    await fetch(global.host + '/api/auth/heartbeat' + "?notification_token_id=" +global.push_notification_key
    , {
       method: 'GET',			
       headers: {
          'Accept': 'application/json',			   
          'Content-Type': 'application/json', 
          "cache-control": "no-cache",			   
          'Authorization' : global.token_type +  " " + global.access_token,
          
       },
      
       
      }).then((response) =>  response.text()) 
          .then((responseData) =>
           {
             try {
             
                let responseTXT = responseData;
                let responseJSON = JSON.parse (responseTXT); 
                console.log(responseData);

                if( responseJSON['message']  === "Unauthenticated."
                   || responseJSON['success'] == undefined 
                   || responseJSON['success'] == false 

                ) {
                  
                    global.login_session = false
                }else{
                    global.login_session = true
                }

                return global.login_session

             } catch (e) {
                console.log(e);
                global.login_session = false
                return global.login_session

             }

          }).catch((error) => {
            console.log(error);	
            console.error(error);
            global.login_session = false
            return global.login_session
          });
};

  return (
    <View style={styles.container}>
      {false && <Text  style={styles.titleText}>Current state is: {appStateVisible}</Text>}
      
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

export default AppStates;