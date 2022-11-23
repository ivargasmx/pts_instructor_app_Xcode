
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity,TouchableHighlight, View, Linking } from "react-native"

import * as ImagePicker from 'expo-image-picker';
import Modal1, { SlideAnimation, ModalContent } from 'react-native-modals';	

import Camera   from "../Helper/Camera";

export default class TakePicture extends React.Component {




	static navigationOptions = ({ navigation }) => {
	  
		const { params = {} } = navigation.state
		return {
				header: null,				headerLeft: null,                headerRight: null,			}
	}

	constructor(props) {
		super(props);
        this.state = {
          cameraPermission : true, 
          camera_permissions_visible_mod : false,  
          picturePath:"",            mode : "take",          }
        }

    async componentDidMount() {
      console.log("ON  TakePicture.js");
      let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

       this.setState({cameraPermission:permissionResult.granted})
      if (permissionResult.granted === false) {
        this.setState({ camera_permissions_visible_mod: true });
       // alert('Permission to access camera  is required!');
        // this.props.navigation.goBack()
      }
      
	}


  onBtnBackPressed = () => {


		
    this.props.navigation.goBack()
		
	}

  onBtnSave = (objImge) => {
     console.log(objImge);
     this.setState({picturePath:objImge});
     this.props.navigation.state.params.parentPage.addPicture(objImge)
	}


	onBtnClosePressed = () => {
	
	}

	render() {

    if (this.state.mode == "take" && this.state.cameraPermission) {
       return( <Camera 
        parentWindow = {this}
       />)
       
   } // take
      
  return (
    <View>
			<Modal1
				onTouchOutside={() => {
					this.setState({ camera_permissions_visible_mod: false });
          this.props.navigation.goBack()
					}}
				visible={this.state.camera_permissions_visible_mod}
				animationDuration = {500}
				modalAnimation={

					new SlideAnimation({
						slideFrom: 'bottom',
						initialValue: 0,
						useNativeDriver: true,
						})
				}
				>
				<ModalContent style={styles.viewModalConten}  >
					<View 
						style={styles.ClockInLocationText}>
						<Text modalPopUpClockInLocationText>Permission to access camera  is required!</Text>
						<View style={styles.viewPopUpLineView}/>
					</View>

			        <Text style={styles.txtPopUpClockInText} > 
              Allow Phlebotomy App access to Camera 
					
					</Text>

		

						<TouchableOpacity
							style={styles.locationButton}
							onPress={() => {
								this.setState({ camera_permissions_visible_mod: false });
								Linking.openURL('app-settings://');
								this.onBtnBackPressed();
								}}
								>
	            <Image
							         source={require("./../../assets/images/camera.png")}
							     style={styles.imgIconCamera}/>	
							<Text style={styles.textStyleClose}>Camera</Text>
						</TouchableOpacity>
	
						<TouchableHighlight
							style={{ ...styles.closeButton, backgroundColor: "#8B1936" }}
								onPress={() => {

									this.setState({ camera_permissions_visible_mod: false });
                  this.props.navigation.goBack();
								}}>
							<Text style={styles.textStyleClose}>Close</Text>
						</TouchableHighlight>


				</ModalContent>
			</Modal1>	
    </View>
  )
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,    backgroundColor: '#fff',    alignItems: 'center',    justifyContent: 'center',  
  },
  logo: {
    width: 305,    height: 159,    marginBottom: 20,  
  },
  instructions: {
    color: '#000',    fontSize: 18,    marginHorizontal: 15,    marginBottom: 10,  
  },  
  button: {
    backgroundColor: 'blue',    padding: 20,    borderRadius: 5,  
  },  
  buttonText: {
    fontSize: 20,    color: '#fff',  
  },  
  thumbnail: {
    width: 300,    height: 300,    resizeMode: 'contain',  
  },
	viewModalConten: {
		backgroundColor: "transparent",
		alignItems: "center",
		width: 520,
		zIndex: 1, 
    height: 250,
		
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
	txtPopUpClockInText: {
		backgroundColor: "transparent",
		color: "#8B1936",
		fontFamily: "Montserrat-Bold",
		fontSize: 20,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 23,
	},  
	locationButton: {
		backgroundColor: "gray",
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
		width :193,
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
		textAlign: "center"
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