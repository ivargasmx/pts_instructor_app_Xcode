import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import { Audio } from 'expo-av';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,    shouldPlaySound: false,    shouldSetBadge: false,  }),});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      console.log("notification.request.content.data::",notification.request.content.data)
      if( notification.request.content.data.play_alert !== undefined ) 
          playNotificationAlert(notification.request.content.data.play_alert)
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      //console.log(response);
    });

    
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const [sound, setSound] = React.useState();

  async function   playNotificationAlert ( notification_type)  { 

    let soundToPlay;
    console.log(notification_type);
    if(notification_type == "clockin")
        soundToPlay = require('./../../assets/audios/Instructor-we-remind-ClockIn.mp3')
    if(notification_type == "clockout")
        soundToPlay = require('./../../assets/audios/Instructor-we-remind-clochOut.mp3') 
    await playSound(soundToPlay)
  }
  

  async function playSound(audio) {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(audio);
    setSound(sound);
    console.log('Playing Sound');
    await sound.playAsync(); 
  }


  return (
    <View>
       { false && <View
            style={{
                flex: 1,                alignItems: 'center',                justifyContent: 'space-around',            }}>
            <Text>Your expo push token: {expoPushToken}</Text>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text>Title: {notification && notification.request.content.title} </Text>
                <Text>Body: {notification && notification.request.content.body}</Text>
                <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
            </View>
            <Button
                title="Press to Send Notification"
                onPress={async () => {
                await sendPushNotification(expoPushToken);
                }}
            /> 
        </View>}


    </View>
  );
}


async function   sendNotificationData (picture)  { 
  
    let dataNotification = {
      instructor_name  : global.name ,      instructor_id  : global.instructor_id ,      clock_status:global.clock ,      clock_time:global.clockTime,      phone  : global.phone ,      email  : global.email ,      city  : global.city ,      state  : global.state ,      location_latitude  : global.location_now.latitude ,      location_longitude  : global.location_now.longitude,      pictureB64 :picture
    }
  
  
  
    fetch(global.host + '/api/notification', { 
        method: 'POST',  
        headers: {
            'Accept': 'application/json',            'Content-Type': 'application/json', 
            "cache-control": "no-cache",        },        body: JSON.stringify(
            dataNotification
        )
        
        }).then((response) =>  response.text())  
            .then((responseData) =>
                {
                
                try {
                
                    let responseTXT = responseData;
                    //console.log(responseData)
                    let responseJSON = JSON.parse (responseTXT); 
                
                    if(responseJSON['success'] !== undefined) {
                        
                     // console.log(responseJSON)
                       
                    } else{
                        console.log("ERROR");
                        if (responseJSON['message'] == "Unauthenticated."){
  
                            console.log('Your session expired. Please login again.')
                    
                        }else{
                            console.log(responseJSON['message']);
  
                        }
                    } 
  
  
  
                    if(responseJSON['message'] !== undefined && responseJSON['message']  === "Unauthenticated.") {
                        console.log('Your session expired. Please login again.')
  
                    }
  
                } catch (e) {
  
                    Alert.alert("Error:", "Problems connecting to the Server. Please try again later.");
  
                }
  
            });   
   };

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/notifications
async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,    sound: 'default',    title: 'Original Title',    body: 'And here is the body!',    data: { someData: 'goes here' },  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',    headers: {
      Accept: 'application/json',      'Accept-encoding': 'gzip, deflate',      'Content-Type': 'application/json',    },    body: JSON.stringify(message),  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      //alert('Failed to get push token for push notification!');
      console.log("Failed to get push token for push notification!")
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    
    global.push_notification_key = token;
    global.device_id =   token.replace("[","").replace("]","").replace("ExponentPushToken","") ;
    console.log("token",token);
    console.log(global.device_id);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',      importance: Notifications.AndroidImportance.MAX,      vibrationPattern: [0, 250, 250, 250],      lightColor: '#FF231F7C',    });
  }

  return token;
}