import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,  Dimensions,  View,  Text,  TouchableOpacity,  SafeAreaView,  Image,} from "react-native";
import { Camera } from "expo-camera";
import { Video } from "expo-av";
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';


const WINDOW_HEIGHT = Dimensions.get("window").height;

const closeButtonSize = Math.floor(WINDOW_HEIGHT * 0.032);
const captureSize = Math.floor(WINDOW_HEIGHT * 0.09);

export  class TakePicture extends React.Component {
    //console.log("Hi")
    //intervalTakePicture = setInterval(this.takeEvidence, 10000);
    constructor(props) {
      super(props);
      this.state={
          hasPermission: null,          cameraType:Camera.Constants.Type.back,          isPreview:false,          isCameraReady:false,          isVideoRecording:false, 
          videoSource:null,          imageSource:"", 
      }
  } 
  static take () { 

        console.log("take....")
        //console.log(App)
       //console.log(App(this).hasPermission)
       //console.log(App.toString())
        return 11;
    }  
}


export const foo = Math.sqrt(2);

export default function App( params) {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [isPreview, setIsPreview] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [videoSource, setVideoSource] = useState(null);
  const [imageSource, setImageSource] = useState("");
  const [imageBase64, setImageBase64] = useState("");

var conta = 0;
  const cameraRef = useRef();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");


     // clearInterval(global.timerTakePicture);
      if(global.take_picture){
        global.timerTakePicture = setInterval(takeEvidence, global.timerTakePictureTime);
      }

  
    })();
  }, []);

const takeEvidence = () => { 
    console.log("OK")
   conta = conta +1;
   console.log(conta)
   takePicture()
}

const deleteFile = async (file) => {
  await FileSystem.deleteAsync(file);
}


const  sendEvidence = (picture) => { 
  
  let dataReport = {
    instructor_name  : global.name ,    instructor_id  : global.instructor_id ,    clock_status:global.clock ,    clock_time:global.clockTime,    phone  : global.phone ,    email  : global.email ,    city  : global.city ,    state  : global.state ,    location_latitude  : global.location_now.latitude ,    location_longitude  : global.location_now.longitude,    pictureB64 :picture
  }



  fetch(global.host + '/api/auth/evidence', { 
      method: 'POST',  
      headers: {
          'Accept': 'application/json',          'Content-Type': 'application/json', 
          "cache-control": "no-cache",          'Authorization' : global.token_type +  " " + global.access_token 
      },      body: JSON.stringify(
          dataReport
      )
      
      }).then((response) =>  response.text()) 
          .then((responseData) =>
              {
              
              try {
              
                  let responseTXT = responseData;
                  // console.log(responseData)
                  let responseJSON = JSON.parse (responseTXT); 
              
                  if(responseJSON['success'] !== undefined) {
                      
                    //console.log(responseJSON)
                     
                  } else{
                      console.log("ERROR");
                      if (responseJSON['message'] == "Unauthenticated."){

                          console.log('Your session expired. Please login again.',)
                  
                      }else{
                          console.log(responseJSON['message']);

                      }
                  } 



                  if(responseJSON['message'] !== undefined && responseJSON['message']  === "Unauthenticated.") {
                      console.log('Your session expired. Please login again.',)

                  }

              } catch (e) {

                  Alert.alert("Error:", "Problems connecting to the Server. Please try again later.");

              }

          });   
 };


 const onCameraReady = () => {
    setIsCameraReady(true);
  };

  const  takePicture = async () => {
    if (cameraRef.current) {
      let convert ="";
      const options = { quality: 0.5, base64: true, skipProcessing: true };
      const data = await cameraRef.current.takePictureAsync(options);
      const source = data.uri;
      if (source) {

        //SystemSetting.setVolume(0.0,{type: 'system', playSound:false, showUI:true});

        await cameraRef.current.pausePreview();
        setImageSource(source);
        setIsPreview(true);
        console.log("picture source", source);


         if(source){
            const manipResizeResult = await ImageManipulator.manipulateAsync(
                 source,                [ { resize: {width:800} }],                { compress: 0.70, format: ImageManipulator.SaveFormat.JPEG, base64:true }
            );
           
           convert =  manipResizeResult.base64;
           setImageBase64(manipResizeResult.base64)
           //console.log(manipResizeResult)
          }

        await cameraRef.current.resumePreview();
        setIsPreview(false);
        setVideoSource(null);
        setImageSource(""); 
        
        deleteFile(source) 
 
        sendEvidence(convert)
      }
    }
  };


  const recordVideo = async () => {
    if (cameraRef.current) {
      try {
        const videoRecordPromise = cameraRef.current.recordAsync();

        if (videoRecordPromise) {
          setIsVideoRecording(true);
          const data = await videoRecordPromise;
          const source = data.uri;
          if (source) {
            setIsPreview(true);
            console.log("video source", source);
            setVideoSource(source);
          }
        }
      } catch (error) {
        console.warn(error);
      }
    }
  };

  
  const stopVideoRecording = () => {
    if (cameraRef.current) {
      setIsPreview(false);
      setIsVideoRecording(false);
      cameraRef.current.stopRecording();
    }
  };
 const onBtnBackPressed = () => {
    setImageSource("");
    params.parentWindow.props.navigation.goBack();
  };
  const switchCamera = () => {
    if (isPreview) {
      return;
    }
    setCameraType((prevCameraType) =>
      prevCameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const cancelPreview = async () => {
    await cameraRef.current.resumePreview();
    setIsPreview(false);
    setVideoSource(null);
    setImageSource("");

  };
  const savePreview = async () => {
    await cameraRef.current.resumePreview();
    setIsPreview(false);
    setVideoSource(null);
   /// params.parentWindow.onBtnSave(imageSource);
    setImageSource("");    
    /// params.parentWindow.props.navigation.goBack();    


  }; 
  const onTakePressed = async () => {
    console.log("onTakePressed")
    takePicture()
  }
//closeButton
  const renderCancelPreviewButton = () => (  
    <View style={styles.controlPreview}>
      <View
        style={{
            flex: 1,        }}/>
        <TouchableOpacity disabled={!isCameraReady} onPress={cancelPreview}>
            <Image 
                source={require("./../../assets/images/picture_cancel.png")}
                style={styles.buttonCancelpreview}/>
        </TouchableOpacity>
        <View
        style={{
            flex: 1,        }}/>
        <TouchableOpacity disabled={!isCameraReady} onPress={savePreview}>
            <Image 
                source={require("./../../assets/images/save_picture.png")}
                style={styles.buttonCancelpreview}/>
        </TouchableOpacity>
        <View
        style={{
            flex: 1,        }}/>        
    </View>
  );

  const renderVideoPlayer = () => (
    <Video
      source={{ uri: videoSource }}
      shouldPlay={true}
      style={styles.media}
    />
  );

  const renderVideoRecordIndicator = () => (
    <View style={styles.recordIndicatorContainer}>
      <View style={styles.recordDot} />
      <Text style={styles.recordTitle}>{"Recording..."}</Text>
    </View>
  );

  const renderCaptureControl = () => (
    <View style={styles.control}>
      <View
        style={{
            flex: 1,        }}/>
      <TouchableOpacity disabled={!isCameraReady} onPress={switchCamera}>
          <Image 
            source={require("./../../assets/images/flip.png")}
            style={styles.buttonFlip}/>
      </TouchableOpacity>
      <View
        style={{
            flex: 1,        }}/>
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={!isCameraReady}
        onLongPress={recordVideo}
        onPressOut={stopVideoRecording}
        onPress={takePicture}
        style={styles.capture}
      />
      <View
        style={{
            flex: 1,        }}/>
      <TouchableOpacity disabled={!isCameraReady} onPress={onBtnBackPressed}>
          <Image 
            source={require("./../../assets/images/picture_cancel.png")}
            style={styles.buttonCancelCamera}/>
      </TouchableOpacity>
      <View
        style={{
            flex: 1,        }}/>
    </View>
  );

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text style={styles.text}>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      
      <Camera
        
        ref={cameraRef}
        style={styles.cameraContainer}
        type={Camera.Constants.Type.front}
        flashMode={Camera.Constants.FlashMode.off}
        onCameraReady={onCameraReady}
        playSoundOnCapture = {null}
        onMountError={(error) => { 
          console.log("cammera error", error);
        }}
      />
  { false &&
      <View style={styles.container}>
        {isVideoRecording && renderVideoRecordIndicator()}
        {videoSource && renderVideoPlayer()}
        {isPreview && renderCancelPreviewButton()}
        { !videoSource && !isPreview && renderCaptureControl()}
      </View>
      
  }   
    </SafeAreaView>
  );



  
  
}

const styles = StyleSheet.create({
txtCityText2: {
    backgroundColor: "transparent",    color: "white",    fontFamily: "Montserrat-Bold",    fontSize: 36,    fontStyle: "normal",    fontWeight: "bold",    textAlign: "center",    width: 160,    left : 100,    top : 160,    position: "absolute",},buttonFlip: {
    width: 60,    height: 60,    shadowColor: "gray",    shadowOffset: { height: 1, width: 1 },    shadowOpacity: 0.8,    shadowRadius: 0.2    
 }, 
buttonCancelCamera: {
    width: 60,    height: 60,    shadowColor: "gray",    shadowOffset: { height: 1, width: 1 },    shadowOpacity: 0.8,    shadowRadius: 0.2    
  },   
  buttonCancelpreview: {
    width: 60,    height: 60,    shadowColor: "gray",    shadowOffset: { height: 1, width: 1 },    shadowOpacity: 0.8,    shadowRadius: 0.2,    zIndex:0,    
  },     
  container: {
    ...StyleSheet.absoluteFillObject,  },  cameraContainer: {
    left :-100,    top:-300,    height: 102,    width: 76,  },  closeButton: {
    position: "absolute",    top: 35,    left: 15,    height: closeButtonSize,    width: closeButtonSize,    borderRadius: Math.floor(closeButtonSize / 2),    justifyContent: "center",    alignItems: "center",    backgroundColor: "#c4c5c4",    opacity: 0.7,    //zIndex: 2,  },  media: {
    ...StyleSheet.absoluteFillObject,  },  closeCross: {
    width: "68%",    height: 1,    backgroundColor: "black",  },  control: {
    position: "absolute",    flexDirection: "row",    bottom: 38,    width: "100%",    alignItems: "center",    justifyContent: "center",  },  controlPreview: {
    backgroundColor:"red",    position: "absolute",    flexDirection: "row",    top: 238,    width: "100%",    alignItems: "center",    justifyContent: "center",    
  }, 
  capture: {
    backgroundColor: "#f5f6f5",    borderRadius: 5,    height: captureSize -20,    width: captureSize -20,    borderRadius: Math.floor(captureSize / 2),    marginHorizontal: 31,  },  recordIndicatorContainer: {
    flexDirection: "row",    position: "absolute",    top: 25,    alignSelf: "center",    justifyContent: "center",    alignItems: "center",    backgroundColor: "transparent",    opacity: 0.7,  },  recordTitle: {
    fontSize: 14,    color: "#ffffff",    textAlign: "center",  },  recordDot: {
    borderRadius: 3,    height: 6,    width: 6,    backgroundColor: "#ff0000",    marginHorizontal: 5,  },  text: {
    color: "#fff",  },});