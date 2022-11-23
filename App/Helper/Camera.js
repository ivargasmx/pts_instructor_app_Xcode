import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,  Dimensions,  View,  Text,  TouchableOpacity,  SafeAreaView,  Image,} from "react-native";
import { Camera } from "expo-camera";
import { Video } from "expo-av";



const WINDOW_HEIGHT = Dimensions.get("window").height;

const closeButtonSize = Math.floor(WINDOW_HEIGHT * 0.032);
const captureSize = Math.floor(WINDOW_HEIGHT * 0.09);

export default function App( params) {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [isPreview, setIsPreview] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [videoSource, setVideoSource] = useState(null);
  const [imageSource, setImageSource] = useState("");
  const [alternateImage, setAlternateImage]= useState(false);
  const cameraRef = useRef();



  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const onCameraReady = () => {
    console.log("setIsCameraReady = > true");
    setIsCameraReady(true);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true, skipProcessing: true };
      const data = await cameraRef.current.takePictureAsync(options);
      const source = data.uri;
      if (source) {
        await cameraRef.current.pausePreview();
        setImageSource(source);
        setIsPreview(true);
        setAlternateImage(false) 
        
       // params.parentWindow.onBtnSave(source);
       // params.parentWindow.props.navigation.goBack();
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
    params.parentWindow.onBtnSave(imageSource);
    setImageSource("");    
    params.parentWindow.props.navigation.goBack();    


  }; 

//closeButton
  const renderCancelPreviewButton = () => (
    <View style={styles.control}>
      <View
        style={{
            flex: 1,    
    }}/>
        <TouchableOpacity disabled={!isCameraReady} onPress={cancelPreview}>
            <Image 
                source={require("./../../assets/images/picture_cancel.png")}
                style={styles.buttonCancelpreview}/>
        </TouchableOpacity>
        <View
        style={{
            flex: 2.5,    
    }}/>
        <TouchableOpacity disabled={!isCameraReady} onPress={savePreview}>
            <Image 
                source={require("./../../assets/images/save_picture.png")}
                style={styles.buttonCancelpreview}/>
        </TouchableOpacity>
        <View
        style={{
            flex: 1,    
    }}/>        
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
            flex: 1,    
    }}/>
      <TouchableOpacity disabled={!isCameraReady} onPress={onBtnBackPressed}>
          <Image 
            source={require("./../../assets/images/picture_cancel.png")}
            style={styles.buttonCancelCamera}/>
      </TouchableOpacity>
      <View
        style={{
            flex: 1,    
    }}/>
      <TouchableOpacity disabled={!isCameraReady} onPress={switchCamera}>
          <Image 
            source={require("./../../assets/images/flip.png")}
            style={styles.buttonFlip}/>
      </TouchableOpacity>


      <View
        style={{
            flex: 1,    
    }}/>

      <TouchableOpacity
        activeOpacity={0.7}
        disabled={!isCameraReady}
        onLongPress={recordVideo}
        onPressOut={stopVideoRecording}
       
        onPress={() => {
           setAlternateImage(true)    
           takePicture();

          }}
       
      >
       { alternateImage && <Image 
            source={require("./../../assets/images/shutter-pressed.png")}
            style={styles.buttonFlip}/>}
       { !alternateImage && <Image 
            source={require("./../../assets/images/shutter-base.png")}
            style={styles.buttonFlip}/>}  

      </TouchableOpacity>
      <View
        style={{
            flex: 1,    
    }}/>
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
        style={styles.container}
        type={cameraType}
        flashMode={Camera.Constants.FlashMode.on}
        onCameraReady={onCameraReady}
        onMountError={(error) => {
          console.log("cammera error", error);
        }}
      />
      <View style={styles.container}>
        {isVideoRecording && renderVideoRecordIndicator()}
        {videoSource && renderVideoPlayer()}
        {isPreview && renderCancelPreviewButton()}
        {!videoSource && !isPreview && renderCaptureControl()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

buttonFlip: {
    width: 60,    
height: 60,    
shadowColor: "gray",    
shadowOffset: { height: 1, width: 1 
},
  
shadowOpacity: 0.8,    
shadowRadius: 0.2    
 }, 
buttonCancelCamera: {
    width: 60,    
height: 60,    
shadowColor: "gray",    
shadowOffset: { height: 1, width: 1 
},
  
shadowOpacity: 0.8,    
shadowRadius: 0.2    
  },   
  buttonCancelpreview: {
    width: 60,    
height: 60,    
shadowColor: "gray",    
shadowOffset: { height: 1, width: 1 
},
  
shadowOpacity: 0.8,    
shadowRadius: 0.2    
  },    
 
  container: {
    ...StyleSheet.absoluteFillObject,  
},
closeButton: {
    position: "absolute",    
top: 35,    
left: 15,    
height: closeButtonSize,    
width: closeButtonSize,    
borderRadius: Math.floor(closeButtonSize / 2),    
justifyContent: "center",    
alignItems: "center",    
backgroundColor: "#c4c5c4",    
opacity: 0.7,    
zIndex: 2,  

},

media: {
    ...StyleSheet.absoluteFillObject,  
},
closeCross: {
    width: "68%",    
height: 1,    
backgroundColor: "black",  
},
control: {
    position: "absolute",    
flexDirection: "row",    
bottom: 38,    
width: "100%",    
alignItems: "center",    
justifyContent: "center",  
},

controlPreview: {
    position: "absolute",    
flexDirection: "row",    
top: 38,    
width: "100%",    
alignItems: "center",    
justifyContent: "center",  }, 
  capture: {
    backgroundColor: "red",    
borderRadius: 5,    
height: captureSize -20,    
width: captureSize -20,    
borderRadius: Math.floor(captureSize / 2),    
marginHorizontal: 31,  
},
recordIndicatorContainer: {
    flexDirection: "row",    
position: "absolute",    
top: 25,    
alignSelf: "center",    
justifyContent: "center",    
alignItems: "center",    
backgroundColor: "transparent",    
opacity: 0.7,  
},
recordTitle: {
    fontSize: 14,    
color: "#ffffff",    
textAlign: "center",  
},
recordDot: {
    borderRadius: 3,    
height: 6,    
width: 6,    
backgroundColor: "#ff0000",    
marginHorizontal: 5,  
},
text: {
    color: "#fff",  },});