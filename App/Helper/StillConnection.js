import React, { useRef, useState, useEffect } from 'react';
import { AppState, StyleSheet, Text, View,TouchableOpacity,TouchableHighlight,Image } from 'react-native';
import Modal1, { SlideAnimation, ModalContent } from 'react-native-modals';	
import Session from "../Helper/Sessions";

const StillConnection = (params) => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [userIdentificationDisplay, setUserIdentificationDisplay] = useState(false);

  

  useEffect(() => {
    const subscription = AppState.addEventListener("change", _handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, []);

  const _handleAppStateChange = nextAppState => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!, Still Cannect');
      setUserIdentificationDisplay(true);
      //Session.recoverLoginSession();
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log('AppState %%%', appState.current);
  };

  const onLoginfailure = () => {
    // params.parentWindow.props.navigation.goBack();
    console.log("onLoginfailure")
    const { navigate } =  params.parentWindow.props.navigation
    navigate("Login")
}

  return (
    <View style={styles.container}>
      {false && <Text  style={styles.titleText}>Current state is: {appStateVisible}</Text>}
      <View>
        <Modal1
          onTouchOutside={() => {
            //setUserIdentificationDisplay(false);
            
            }}
          visible={userIdentificationDisplay}
          animationDuration = {300}
          modalAnimation={

            new SlideAnimation({
              slideFrom: 'top',
              initialValue: 0,
              useNativeDriver: true,
              })
          }
          >
          <ModalContent style={styles.viewModalConten}  >
            <View 
              style={styles.ClockInLocationText}>
              <Text modalPopUpClockInLocationText></Text>
              <View style={styles.viewPopUpLineView}/>
            </View>
            <View>
            <Text style={styles.txtTitleText} > 
                   Continue as
                 </Text>
            </View>
                <Text style={styles.txtPopUpClockInText} > 
                   {global.name} ?
                 </Text>

      

              <TouchableOpacity
                style={styles.yesButton}
                onPress={() => {
                 setUserIdentificationDisplay( false);
                  }}
                  >
                <Text style={styles.textStyleClose}>Yes</Text>
              </TouchableOpacity>
              <View  style={{ height:30 }}></View>
              <TouchableHighlight
                style={styles.noButton}
                  onPress={() => {

                    setUserIdentificationDisplay(false );
                    Session.logOut(global.host,global.access_token); 
                    onLoginfailure();

                  }}>
                <Text style={styles.textStyleClose}>No</Text>
              </TouchableHighlight>


          </ModalContent>
        </Modal1>	
      </View>      
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
    viewModalConten: {
		backgroundColor: "transparent",
		alignItems: "center",
		width: 320,
		zIndex: 1, 
        height: 330,
		
	},
	ClockInLocationText: {
		backgroundColor: "transparent",
		height: 42,
		alignItems: "center",
		
	},
	viewPopUpLineView: {
		backgroundColor: "rgb(184, 184, 184)",
		flex: 1,
		height: 1,
		marginTop: 25,
		width: 660,
		position: "absolute",	
	},  
    txtTitleText: {
		backgroundColor: "transparent",
		color: "black",
		fontFamily: "Montserrat-Regular",
		fontSize: 18,
		fontStyle: "normal",
		textAlign: "center",
		marginBottom: 23,
	},  
	txtPopUpClockInText: {
		backgroundColor: "transparent",
		color: "black",
		fontFamily: "Montserrat-Bold",
		fontSize: 20,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 23,
	},  
	yesButton: {
		backgroundColor: "#8ED93D",
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
		width :130,
	},
	noButton: {
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
		width :130,
	},    
  imgIconCamera: {
		resizeMode: "contain",
		backgroundColor: "transparent",
		width: 26,
		height: 26,
		//marginTop: 9,
		right:8,
	},
  textStyleClose: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
        backgroundColor: "transparent",
		fontFamily: "Montserrat-Bold",
		fontSize: 18,
		fontStyle: "normal",
		textAlign: "center",
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
    }	
});

export default StillConnection;