import React, { useRef, useState, useEffect } from 'react';
import { AppState, StyleSheet, Text, View } from 'react-native';
import Session from "../Helper/Sessions"

const AppStates = () => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);


  useEffect(() => {
    const subscription = AppState.addEventListener("change", _handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, []);

  const _handleAppStateChange = nextAppState => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!');
      Session.recoverLoginSession();
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log('AppState::', appState.current);
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