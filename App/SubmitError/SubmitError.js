import React, { Component } from 'react'
import { Text, View,StyleSheet,TouchableOpacity,TextInput,Alert,Image,
        ActivityIndicator,Dimensions } from 'react-native'
import ImagePro from 'react-native-image-progress';
import Progress from 'react-native-progress/CircleSnail';		
import CalendarHeader from "../Headers/CalendarHeader";
import { WebView } from 'react-native-webview';
import  Modal,{SlideAnimation, ModalContent,ModalButton } from 'react-native-modals';
import ErrorHandler    from "../Helper/ErrorHandler"
import { stopLocationUpdatesAsync } from 'expo-location';

export default class SubmitError extends Component {
    static navigationOptions = ({ navigation }) => {
      
        const { params = {} } = navigation.state
        return {
            header: null,
            headerLeft: null,
            headerRight: null,
          }
      }
      
    constructor(props) {
        super(props);
            this.state = {
                currentNote:"",
				_waiting: false,
                visible : false,
            }
      }

	onBtnBackPressed = () => {
		global.screen = "Classroom"
		this.props.navigation.goBack()	
	}
	componentDidMount() {
       console.log("Mount Submit Error:", global.access_token) //this.props.navigation.state.params._onLoadGetUsers);
	}

   sendError = () => { 
	     let auxii = ErrorHandler.setMessageResponseEnc64( "",global.host + '/api/auth/error',global.logs,"Error Report","",global.host + '/api/auth/error',global.id,global.name ,global.email);		 ;


	     console.log("auxii:" ,auxii );
		let dataReport = {note:this.state.currentNote,location:global.location_now,  errors :  [auxii] };
		//console.log("dataReport:" ,dataReport );
	
		this.setState({_waiting : true})
		var _url =  global.host + '/api/auth/error';
		var _body = JSON.stringify(dataReport);
		
		console.log("_body::",_body)
		
		fetch(_url, { 
			method: 'POST',  
			headers: {
			   'Accept': 'application/json',
			   'Content-Type': 'application/json', 
			   "cache-control": "no-cache"
			},
			body: _body
			
			}).then((response) =>  response.text()) 
            .then((responseData) =>
                {
			    this.setState({_waiting : false})		
                try {

                    let responseTXT = responseData;
                   // console.log(responseData)
                    let responseJSON = JSON.parse (responseTXT); 
                
                    if(responseJSON['success']) {
                        
                        Alert.alert(
                            'Success!',
                            'Your Report was sent.',
                            [
                            {text: 'OK', onPress: () =>{ 
                                console.log('OK Pressed')
                                this.props.navigation.goBack();
                            }},
                            ],
                            {cancelable: false},
                        );
					
                       
                    } else{
                            console.log(responseJSON['message']);
                            Alert.alert(
                                'Error !',
                                responseJSON['message'],
                                [
                                {text: 'OK', onPress: () => console.log('OK Pressed')},
                                ],
                                {cancelable: false},
                            );

							global.logs = global.logs + " \n " + responseData

                       
                    } 



                    if(responseJSON['message'] !== undefined && responseJSON['message']  === "Unauthenticated.") {
                        Alert.alert(
                            'Attention !',
                            'Your session expired. Please login again.',
                            [
                            {text: 'OK', onPress: () => console.log('OK Pressed')},
                            ],
                            {cancelable: false},
                        );

                    }

                } catch (e) {
                    Alert.alert("Error:", "Problems connecting to the Server. Please try again later.");
                    global.logs = global.logs + " \n " + responseData + " \n " 
                }

            });   
    };

    render() {
        return (
              <View     
				style={styles.viewView}>					
			    <CalendarHeader
					instructorName = {""}
					navigation = {this.props.navigation}
					_onLoadGetUsers = {this.props.navigation.state.params._onLoadGetUsers}
					
				>
				</CalendarHeader>
                <TouchableOpacity
					onPress={this.onBtnBackPressed}
					style={styles.btnbackButton}>
					<Text
					  style={styles.btnbackButtonText}>Back</Text>
				</TouchableOpacity>
                <View style={styles.viewTitle}>
					<Text
					style={styles.txtTitle}>Submit an error</Text>
				</View>
                <View style={styles.viewRowError}>
                   <View style={styles.viewLeftCol}>
                     <TextInput
                        onChangeText = {(currentNote) => this.setState({currentNote})} 
                        autoCorrect={false}
                        multiline={true} 

                        value={this.state.currentNote}
                        style={styles.inputTxtNotesTextInput}
                        autoCapitalize="sentences"
                        placeholder={"Describe the error and what you were trying to do before you ran into that issue"}
                        placeholderTextColor="#999"
                        //returnKeyType="done"
                        />
                   </View>
                     <TouchableOpacity
                        onPress={this.sendError}
                        style={styles.btnSendButton}>
                        <Text
                        style={styles.btnbackButtonText}> Submit </Text>
			          </TouchableOpacity>
                   <View style={styles.viewRightCol}>
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({ visible: true });	
                        }}
                        style={styles.btnHotlineButton}>
                            <Image
                               source={require("./../../assets/images/support.png")}
														style={styles.imgHotlineButtonImage}/> 
			        </TouchableOpacity>
                    <View style={{ flex: 3,}}/>

                   </View>
                </View>
                <View style={styles.viewTutoTitle}>
					<Text
					style={styles.txtTitle}>Tutorials</Text>
				</View>
                <WebView 
                    style={styles.viewWebContainer}
                    source={{ uri: global.host + '/ipad_training_device' }
                             //  { uri: 'http://192.168.0.5/ipad_training_device' }
                    
                           }
                    />
				<View  style={[styles.containerWait, !this.state._waiting ? styles.containerHiddend : {}]}>
                      <ActivityIndicator size="large" color="#ffff"  />    
			    </View>	
                
                
                <View>
					<Modal
					    
						visible={this.state.visible}
						onTouchOutside={() => {
						this.setState({ visible: false });
						}}
						modalAnimation={new SlideAnimation({
							useNativeDriver: true,
							initialValue: 0,
							slideFrom: 'top',
						  })}
					  >
						<ModalContent >
						  
						  <View>
							
							<View>
							   <View /> 
							   <TouchableOpacity  style={{width: Dimensions.get('window').width, paddingRight:30}}
											onPress={() => {
												this.setState({ visible: false });	
											}}> 
	                                 <Image
                                         source={require("./../../assets/images/picture_cancel.png")}
														style={styles.imgCloseHotlineButtonImage}/>									
								</TouchableOpacity>
								<TouchableOpacity 
											
										onPress={() => {
											this.setState({ visible: false });	
											
										}}> 

                                      <ImagePro
                                         source={{uri: global.host + "/images/instructors/hotline.jpg"}}
										 style={styles.imgHotlineBackImage}
                                         indicator={Progress.Bar}
										 indicatorProps={{
											size: 40,
											borderWidth: 0,
											color: 'rgba(150, 150, 150, 1)',
											unfilledColor: 'rgba(200, 200, 200, 0.2)'
										  }}
											/> 									
								</TouchableOpacity>
                           </View>

						



						  </View>
						</ModalContent>
					</Modal>
				</View>

              </View>
        )
    }
}

const styles = StyleSheet.create({
    imgHotlineBackImage: {
		resizeMode: "contain",
		backgroundColor: "transparent",
		width: 700,
		height:900,

	},
    imgHotlineButtonImage: {
		resizeMode: "contain",
		backgroundColor: "transparent",
		marginTop:4,
		width: 110,
		borderRadius: 40,

	},  
    imgCloseHotlineButtonImage: {
		resizeMode: "contain",
		backgroundColor: "transparent",
		marginTop:0,
		width: 30,
		height:30,
		alignSelf: "flex-end",

	},  	  
	containerWait: {
		backgroundColor : 'rgba(0,0,0,0.4)',
		flex: 1,
		justifyContent: "center",
		flexDirection: "row",
		top:0,
		left:0,
		position: "absolute",
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
		zIndex: 1,
	  },
	  containerHiddend: {
		left:1000,
	  },
    viewWebContainer:{

    },
    viewLeftCol:{
        backgroundColor: "transparent",
        paddingTop:12,
        paddingRight:12,
        width: "60%",
    },
    viewRightCol:{
        position:"absolute",
        backgroundColor: "transparent",
        marginTop:12,
        paddingTop:12,
        right:16,
        top:30,
        paddingLeft:12,
        justifyContent: "flex-end",
        width: "30%",
        height:100,
    },
    viewRowError:{
        padding:18,
        flexDirection: "row",
        backgroundColor: "transparent",
    },
	inputTxtNotesTextInput: {
		backgroundColor: "white",
		borderWidth: 1,
		borderColor: "rgb(112, 112, 112)",
		borderStyle: "solid",
		padding: 10,
		color: "black",
		fontFamily: "Montserrat-Regular",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		alignSelf: "stretch",
		height: 70,


	},    
    txtTitle: {
		color: "rgb(139, 25, 54)",
		fontFamily: "Montserrat-Bold",
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "bold",
		backgroundColor: "transparent",
		marginTop: 5,
	},
    viewTitle:{
      top:20,
      left:20  
    },
    viewTutoTitle:{
		alignItems: "center",
        paddingBottom:10,
      },
    viewView: {
        backgroundColor: "rgb(239, 239, 244)",
        flex: 1,
    },
	btnbackButtonText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
	},
    
	btnbackButton: {
		backgroundColor: "rgb(139, 25, 54)",
		borderRadius: 16.5,
		shadowColor: "rgba(0, 0, 0, 0.16)",
		shadowRadius: 12,
		shadowOpacity: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		alignSelf: "flex-end",
		width: 113,
		height: 33, 
	    position: "absolute",
		marginRight: 23,
		top: 82,
		right:8,
		zIndex: 2,
	},
	btnSendButton: {
		backgroundColor: "rgb(139, 25, 54)",
		borderRadius: 16.5,
		shadowColor: "rgba(0, 0, 0, 0.16)",
		shadowRadius: 12,
		shadowOpacity: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		alignSelf: "flex-end",
		width: 113,
		height: 33, 
		marginRight: 12,
		//top: 50,
		right:0,
		zIndex: 2,
	},   
	btnHotlineButton: {
		backgroundColor: "rgb(139, 25, 54)",
		//borderRadius: 16.5,
		shadowColor: "rgba(0, 0, 0, 0.16)",
		shadowRadius: 12,
		shadowOpacity: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		alignSelf: "flex-end",
		//width: 113,
		height: 33, 
		marginRight: 8,
		//top: 50,
		right:10,
		zIndex: 2,
		
	},
})