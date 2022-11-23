import React, { useRef } from "react";
import {
  StyleSheet,  Dimensions,  View,  Text,  TouchableOpacity,  SafeAreaView,  Image,} from "react-native";
import { Camera } from "expo-camera";
import { Video } from "expo-av";



const WINDOW_HEIGHT = Dimensions.get("window").height;

const closeButtonSize = Math.floor(WINDOW_HEIGHT * 0.032);
const captureSize = Math.floor(WINDOW_HEIGHT * 0.09);


export default class Evidences extends React.Component { 

    static navigationOptions = ({ navigation }) => {


        const { params = {} } = navigation.state
            return {
                    header: null,                    headerLeft: null,                    headerRight: null,                    
                }
                
        }
        constructor(props) {
            super(props); 
            this.cameraRef = React.createRef();
            this.state={
                hasPermission: null,                cameraType:Camera.Constants.Type.back,                isPreview:false,                isCameraReady:false,                isVideoRecording:false,                videoSource:null,                imageSource:"",            }
        } 

/*	
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [isPreview, setIsPreview] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [videoSource, setVideoSource] = useState(null);
  const [imageSource, setImageSource] = useState("");
*/
    

   componentDidMount() { 
       console.log("Dentro ···········")
       console.log(this.cameraRef)
   }
 
  useEffect = () => {
    const { status } =  Camera.requestCameraPermissionsAsync();
    this.setState({hasPermission:status === "granted"})
    //setHasPermission(status === "granted");
  }  


   onCameraReady = () => {
    this.setState({isCameraReady:true})   
    //setIsCameraReady(true);
  };

   takePicture = async () => {
    if (this.cameraRef.current) {
      const options = { quality: 0.5, base64: true, skipProcessing: true };
      const data = await this.cameraRef.current.takePictureAsync(options);
      const source = data.uri;
      if (source) {
        await this.cameraRef.current.pausePreview();
        setImageSource(source);
        setIsPreview(true);
        console.log("picture source:", source);
        
       // params.parentWindow.onBtnSave(source);
       // params.parentWindow.props.navigation.goBack();
      }
    }
  };
   getType =  () => {

    return 1;
  }

   recordVideo = async () => {
    if (this.cameraRef.current) {
      try {
        const videoRecordPromise = this.cameraRef.current.recordAsync();

        if (videoRecordPromise) {
          setIsVideoRecording(true);
          const data = await videoRecordPromise;
          const source = data.uri;
          if (source) {
            this.setState({isPreview:true})
            //setIsPreview(true);
            console.log("video source", source);
            this.setState({videoSource:source})
            //setVideoSource(source);
          }
        }
      } catch (error) {
        console.warn(error);
      }
    }
  };

  
   stopVideoRecording = () => {
    if (this.cameraRef.current) {
      //setIsPreview(false);
      this.setState({isPreview:false})
     // setIsVideoRecording(false);
      this.setState({isVideoRecording:false})
      this.cameraRef.current.stopRecording();
    }
  };
  onBtnBackPressed = () => {
    //setImageSource("");
    this.setState({imageSource:""})
    ///  *  params.parentWindow.props.navigation.goBack();
  };
   switchCamera = () => {
    if (this.state.isPreview) {
      return;
    }
    setCameraType((prevCameraType) =>
      prevCameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

   cancelPreview = async () => {
    await this.cameraRef.current.resumePreview();
    this.setState({isPreview:false})
    this.setState({videoSource:null})
    this.setState({imageSource:""})
    //setIsPreview(false);
    //setVideoSource(null);
    //setImageSource("");

  };
   savePreview = async () => {
    await this.cameraRef.current.resumePreview();
    this.setState({isPreview:false})
    this.setState({videoSource:null})
    //setIsPreview(false);
    //setVideoSource(null);
    ///  *  params.parentWindow.onBtnSave(imageSource);
    this.setState({imageSource:""})
    //setImageSource("");    
    ///  *  params.parentWindow.props.navigation.goBack();    


  }; 
   onTakePressed = async () => {
    takePicture()
  }
//closeButton
   renderCancelPreviewButton = () => (  
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

   renderVideoPlayer = () => (
    <Video
      source={{ uri: videoSource }}
      shouldPlay={true}
      style={styles.media}
    />
  );

   renderVideoRecordIndicator = () => (
    <View style={styles.recordIndicatorContainer}>
      <View style={styles.recordDot} />
      <Text style={styles.recordTitle}>{"Recording..."}</Text>
    </View>
  );

   renderCaptureControl = () => (
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


  render() {
        if (this.state.hasPermission === null) {
            return <View />;
        }

        if (this.state.hasPermission === false) {
            return <Text style={styles.text}>No access to camera</Text>;
        }

        return (
            <SafeAreaView style={styles.container}>
            
            <Camera
                
                ref={this.cameraRef}
                style={styles.cameraContainer}
                type={Camera.Constants.Type.front}
                flashMode={Camera.Constants.FlashMode.off}
                onCameraReady={onCameraReady}
                playSoundOnCapture={false}
                captureAudio={false}
                onMountError={(error) => { 
                console.log("cammera error", error);
                }}
            />
        
            <View style={styles.container}>
                {isVideoRecording && renderVideoRecordIndicator()}
                {videoSource && renderVideoPlayer()}
                {isPreview && renderCancelPreviewButton()}
                { !videoSource && !isPreview && renderCaptureControl()}
            </View>
            <Text style={styles.txtCityText2}>TEXTO: {params.parentWindow.state.conta}</Text>
            </SafeAreaView>
        );
   }

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
    width: 60,    height: 60,    shadowColor: "gray",    shadowOffset: { height: 1, width: 1 },    shadowOpacity: 0.8,    shadowRadius: 0.2    
  },     
  container: {
    ...StyleSheet.absoluteFillObject,  },  cameraContainer: {
    marginLeft :100,    marginTop:100,    height: 330,    width: 330,  },  closeButton: {
    position: "absolute",    top: 35,    left: 15,    height: closeButtonSize,    width: closeButtonSize,    borderRadius: Math.floor(closeButtonSize / 2),    justifyContent: "center",    alignItems: "center",    backgroundColor: "#c4c5c4",    opacity: 0.7,    zIndex: 2,  },  media: {
    ...StyleSheet.absoluteFillObject,  },  closeCross: {
    width: "68%",    height: 1,    backgroundColor: "black",  },  control: {
    position: "absolute",    flexDirection: "row",    bottom: 38,    width: "100%",    alignItems: "center",    justifyContent: "center",  },  controlPreview: {
    position: "absolute",    flexDirection: "row",    top: 38,    width: "100%",    alignItems: "center",    justifyContent: "center",  }, 
  capture: {
    backgroundColor: "#f5f6f5",    borderRadius: 5,    height: captureSize -20,    width: captureSize -20,    borderRadius: Math.floor(captureSize / 2),    marginHorizontal: 31,  },  recordIndicatorContainer: {
    flexDirection: "row",    position: "absolute",    top: 25,    alignSelf: "center",    justifyContent: "center",    alignItems: "center",    backgroundColor: "transparent",    opacity: 0.7,  },  recordTitle: {
    fontSize: 14,    color: "#ffffff",    textAlign: "center",  },  recordDot: {
    borderRadius: 3,    height: 6,    width: 6,    backgroundColor: "#ff0000",    marginHorizontal: 5,  },  text: {
    color: "#fff",  },});