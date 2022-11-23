

import React from "react"
import {  StyleSheet, Text,  TouchableOpacity, View,Alert,ActivityIndicator ,TextInput,Dimensions} from "react-native"
import PINCode from '@haskkor/react-native-pincode';


import CalendarHeader from "../Headers/CalendarHeader";


export default class ChangePassword extends React.Component {

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
            _waiting: false,
			_warning: false,
			_setPIN: false,
            user_interface_type: 0,
            current_password : "",
            new_password : "",
            confirm_new_password : ","

        }

	}

    
     componentDidMount() {


       if (this.props.navigation.state.params.action == "password"){
         this.setState({user_interface_type:1})
       }else{
        this.setState({user_interface_type:2})
       }
		
	}


    onBtnBackPressed = () => {
		this.props.navigation.goBack()	
	}

    onNextPress(){
        if(this.state.current_password.trim()  == ''  ){
            Alert.alert(
              'Attention !',
              'The Current Password field cannot be empty.',
              [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ],
              {cancelable: false},
            );
            return ;   
          } 
        this.setState({user_interface_type:6})
    }
                                               

    setUserInterfface = (type,extra_text) => {
		console.log(type)
		switch(type) {
			case 1:
				this.setState({ user_interface_type: 1})


			  break;
			case 2:
				this.setState({ user_interface_type: 2})

			  break;
			  case 6: // For PIN Config first time
				this.setState({ user_interface_type: 6})
		
			  break; 
			  			  			   			  				  
		}
	}
    loginFctNew = () =>{ 

            if(this.state.current_password.trim()  == ''  ){
              Alert.alert(
                'Attention !',
                'The Current Password field cannot be empty.',
                [
                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false},
              );
              return ;   
            } 
            if(this.state.new_password.trim()  == ''  ){
                Alert.alert(
                  'Attention !',
                  'The New Password field cannot be empty.',
                  [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                  ],
                  {cancelable: false},
                );
                return ;   
              } 
              if(this.state.confirm_new_password.trim()  == ''  ){
                Alert.alert(
                  'Attention !',
                  'The Repeat New Password field cannot be empty.',
                  [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                  ],
                  {cancelable: false},
                );
                return ;   
              } 

            if(this.state.new_password.trim()   !== this.state.confirm_new_password.trim() ){  
                  
              Alert.alert(
                'Attention !',
                'The New Password is not equal to Repeat New Password field.',
                [
                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false},
              );
              return ;
            }
    
            if(this.state.password  != this.state.password_conf ){  
                  
                Alert.alert(
                  'Attention !',
                  'The entered values do not match.',
                  [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                  ],
                  {cancelable: false},
                );
                return ;
              }
    

    
            let _body =  JSON.stringify({

                password:this.state.current_password.trim(),
                new_password:this.state.new_password.trim(),
                confirm_password:this.state.confirm_new_password.trim(),
            })
            
        
            console.log("BODY",_body)	
    
            this.setState({_waiting : true})
            //if(global.connection == 0) this.setState({_waiting : false})
            fetch(global.host + '/api/auth/reset_password',{
                method: 'POST',
                headers: {
                   'Accept': 'application/json',
                   'Content-Type': 'application/json', 
                   "cache-control": "no-cache",
                   'Authorization' : global.token_type +  " " + global.access_token
                   
                },
                body:
                   _body
              }).then((response) =>  response.text()) //response.json())
                    .then((responseData) =>
                     {
                        // console.log(responseData);
                       this.setState({_waiting : false})
                       try {
                           var responseTXT = responseData;
                           var responseJSON = JSON.parse (responseTXT);

                           if(responseJSON['success'] !== undefined && responseJSON['success']  ) 
                            {
    
                                this.setState({
                                    current_password:"",
                                    new_password:"",
                                    confirm_new_password : ""
                                }); 
                                Alert.alert(
									'Success !',
									'You have successfully changed your password.',
									[
									{text: 'OK', onPress: () => {
                                        console.log('OK Pressed')
                                        this.onBtnBackPressed()
                                                                }},
									],
									{cancelable: false},
								);
                            }else{

                                   if(responseJSON['success'] !== undefined && ! responseJSON['success'] ){
                                       Alert.alert( 'Attention (Current password)!', responseJSON['msg']);
                                       return;
                                   }
    

                            }
                       } catch (e) {
                           console.log(e);
                           this.setState({
                               authenticated :0
                           });
                           Alert.alert("Error:", "Problems connecting to the Server.");
                           this.setState({_waiting : false})
                           return;
    
                       }  
                    }).catch((error) => {
                        console.log(error);
                      //dispatch(error('There was a problem with the request.'));
                      console.log(error);	 
                      console.error(error);
                      this.setState({
                         authenticated :0
                       });
                       this.setState({_waiting : false})
                    });
    } 
	continueLoginSuccess(){
		this.setUserInterfface (1,"")
		this.onBtnBackPressed();
	}


	savePINNew(pin){
		this.setState({_waiting : true}) 
		fetch(global.host + '/api/auth/setup_pin', {
			method: 'POST',
			headers: {
			   'Accept': 'application/json',
			   'Content-Type': 'application/json', 
			   "cache-control": "no-cache",
			   'Authorization' : global.token_type +  " " + global.access_token

			},
			body: JSON.stringify({
                confirm_pin : pin,
                password : this.state.current_password,
                pin : pin
		   })   
		  }).then((response) =>  response.text())  
				.then((responseData) =>
				 {
					//console.log(responseData)
					this.setState({_waiting : false}) 
				   try {
                        var responseTXT = responseData;
                        var responseJSON = JSON.parse (responseTXT);
                        if(responseJSON['success'] !== undefined && responseJSON['success']  ) 
                        {

                            this.setState({
                                current_password:""
                            }); 
                            Alert.alert(
                                'Success !',
                                'Pin was updated successfully.',
                                [
                                {text: 'OK', onPress: () => {
                                    console.log('OK Pressed')
                                    this.onBtnBackPressed()
                                    }},
                                ],
                                {cancelable: false},
                            );
                        }else{

                                if(responseJSON['success'] !== undefined && ! responseJSON['success'] ){
                                    Alert.alert( 'Attention !', responseJSON['msg']);
                                    return;
                                }


                        }


				   } catch (e) {
					   console.log(e); 
					   this.setState({
						   authenticated :0 
					   });
					   Alert.alert("Error:", "Problems connecting to the Server. Please try again later.");

				   }

				}).catch((error) => {
				  console.log(error);	 
				  console.error(error);

				}); 
	}



	render() {
		let imgIcon;
		let page ;
		
		if(this.state.type =="S"){
			page = this.state.state_specifications  ;
		}else{ 
			page = this.state.city_specifications  ;
		}

		return ( 
		  <View
             style={styles.viewView}>
				<CalendarHeader
					instructorName = {global.name}
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


                { this.state.user_interface_type == 6 && // set New PIN
					<View   
									style={styles.viewCardShiftDayView}>

								<View
									pointerEvents="box-none"
									style={{
										position: "absolute", 
										left: 0,
										right: 0,
										top: 6,
										//height: 885,
										alignItems: "center",
									}}>
		
									<View
										style={styles.viewTitleLogoView}>
										<Text
											style={styles.loginText}></Text>
									</View>


									<View  style={styles.viewCardViewPIN}>
									<View
										style={{
											flex: .1,
									}}/>
										<Text
											numberOfLines = { 2}
											style={styles.loginXuserText}>Configure your New  PIN</Text>
									<View
										style={{
											flex: -1,
									}}/>
											<PINCode 
												status={'choose'}
												//colorCircleButtons={'transparent'}
												colorPassword={'rgb(118,11,41)'}
												colorPasswordEmpty={"white"}
												stylePinCodeHiddenPasswordSizeEmpty={15}
												stylePinCodeHiddenPasswordSizeFull={15}
												stylePinCodeMainContainer={{flex:1,}}

												stylePinCodeTextButtonCircle={{fontSize: 27}}
												stylePinCodeButtonCircle  = {{
													alignItems: 'center',
													justifyContent: 'center', 
													width: 12 * 4, 
													height: 12 * 4, 
													backgroundColor: 'rgb(105, 105, 105)', 
													borderRadius: 12 * 2
													}}
												stylePinCodeCircle = {{

													width: 12 * 2, 
													height: 12 * 2, 
													color: 'rgb(0, 0, 0)',
													//backgroundColor: 'rgb(105, 105, 105)', 
													borderRadius: 12 * 2,
													shadowColor: "#000",
													shadowOffset: {
													width: 0,
													height: 2
													},
													shadowOpacity: 0.5,
													shadowRadius: 2,
												}}
                                                stylePinCodeButtonNumber = {'#fff'}
                                                colorCircleButtons = {'rgb(105, 105, 105)'}
                                                
                                               // stylePinCodeDeleteButtonColorShowUnderlay
												stylePinCodeDeleteButtonText={{
													color : 'rgb(0, 0, 0)'
												}}
                                                styleColumnDeleteButton ={'#000'}
                                                stylePinCodeDeleteButtonColorHideUnderlay={'rgb(105, 105, 105)'}
                                                stylePinCodeDeleteButtonColorShowUnderlay={'#000'}

                                                stylePinCodeColorTitle={'rgb(105, 105, 105)'}
                                                stylePinCodeColorSubtitle={'rgb(105, 105, 105)'}
												buttonDeleteText = {"."}
												pinStatus={this.pinStatus}
												storePin={(pin) => {
													this.savePINNew(pin)
												}}
												finishProcess={() => {
													console.log('pin enters')
													this.setState({user_interface_type:2})
												}}
												onFail= {(attempt) => console.log(attempt) }


												/>
									<View
										style={{
											flex: -1,
									}}/>
									</View>

								</View>
						</View> 
						}	
					{ this.state.user_interface_type == 1 && //Personal Login 
					<View   
							style={styles.viewCardShiftDayView}>

							<View
								pointerEvents="box-none"
								style={{
									position: "absolute",
									left: 0,
									right: 0,
									top: 110,
									height: 285,
									alignItems: "center",
									
								}}>
	
								<View
									style={styles.viewTitleLogoView}>
									<Text
										style={styles.loginText}>Preferencerence </Text>
								</View>


                                <View  style={styles.viewCardView}>
								<View
									  style={{
										flex: 1,
									}}/>									
								   <Text
										style={styles.welcomeText}>New Password</Text>	
								   <View
									  style={{
										flex: 1,
									}}/>

									<View
										style={styles.viewPasswordFieldView}>
										<View
											pointerEvents="box-none"
											style={{
												position: "absolute",
												alignSelf: "center",
												top: 0,
												bottom: 0,
												justifyContent: "center",
											}}>
											<TextInput
											clearButtonMode="always"
												autoCorrect={false}
												textContentType = {"none"}
												placeholder="Current password"
												placeholderTextColor="#707070" 
												secureTextEntry={true}
												style={styles.passwordTextInput}
												autoCapitalize = 'none'
												onChangeText = {(current_password) => this.setState({current_password})}
												returnKeyType="next"
												/>
										</View>
								    </View>	

								   <View
									  style={{
										flex: 1,
									}}/>

									<View
										style={styles.viewPasswordFieldView}>
										<View
											pointerEvents="box-none"
											style={{
												position: "absolute",
												alignSelf: "center",
												top: 0,
												bottom: 0,
												justifyContent: "center",
											}}>
											<TextInput
											clearButtonMode="always"
												autoCorrect={false}
												textContentType = {"none"}
												placeholder="New password"
												placeholderTextColor="#707070" 
												secureTextEntry={true}
												style={styles.passwordTextInput}
												autoCapitalize = 'none'
												onChangeText = {(new_password) => this.setState({new_password})}
												ref={ref =>  {this._password = ref;}}
												returnKeyType="next"
												/>
										</View>
								    </View>	
                                    <View
									  style={{
										flex: 1,
									}}/>

									<View
										style={styles.viewPasswordFieldView}>
										<View
											pointerEvents="box-none"
											style={{
												position: "absolute",
												alignSelf: "center",
												top: 0,
												bottom: 0,
												justifyContent: "center",
											}}>
											<TextInput
											clearButtonMode="always"
												autoCorrect={false}
												textContentType = {"none"}
												placeholder="Repeat new password"
												placeholderTextColor="#707070" 
												secureTextEntry={true}
												style={styles.passwordTextInput}
												autoCapitalize = 'none'
												onChangeText = {(confirm_new_password) => this.setState({confirm_new_password})}
												ref={ref =>  {this._password = ref;}}
												returnKeyType="next"
												/>
										</View>
								    </View>	
                                     	
									<View
										style={{
											height:20,
										}}/>
									<TouchableOpacity
										onPress={ this.loginFctNew}
										style={styles.grupo171Button}>
										<Text
											style={styles.grupo171ButtonText}>SAVE</Text>
									</TouchableOpacity>


									<View
										style={{
											flex: 1,
										}}/>		
								</View>
	
							</View>
					</View> 
					}	

                  { this.state.user_interface_type == 2 && //Personal Login 
					<View   
							style={styles.viewCardShiftDayView}>

							<View
								pointerEvents="box-none"
								style={{
									position: "absolute",
									left: 0,
									right: 0,
									top: 110,
									//height: 285,
									alignItems: "center",
								}}>
	
								<View
									style={styles.viewTitleLogoView}>
									<Text
										style={styles.loginText}>Preferencerence </Text>
								</View>


                                <View  style={styles.viewCardView}>
								<View
									  style={{
										flex: 1,
									}}/>									
								   <Text
										style={styles.welcomeText}>New PIN</Text>	
								   <View
									  style={{
										flex: 1,
									}}/>
						
									<View
									  style={{
										flex: .5, 
									}}/>	
									<View
										style={styles.viewPasswordFieldView}>
										<View
											pointerEvents="box-none"
											style={{
												position: "absolute",
												alignSelf: "center",
												top: 0,
												bottom: 0,
												justifyContent: "center",
											}}>
											<TextInput
											clearButtonMode="always"
												autoCorrect={false}
												textContentType = {"none"}
												placeholder="Current password"
												placeholderTextColor="#707070" 
												secureTextEntry={true}
												style={styles.passwordTextInput}
												autoCapitalize = 'none'
												onChangeText = {(current_password) => this.setState({current_password})}
												ref={ref =>  {this._password = ref;}}
												returnKeyType="done"
												
												/>
										</View>
					   
								    </View>		
									<View
										style={{
											flex: 2,
										}}/>
									<TouchableOpacity
										onPress=  { () => {
                                               this.onNextPress()
                                            }}
										style={styles.grupo171Button}>
										<Text
											style={styles.grupo171ButtonText}>NEXT</Text>
									</TouchableOpacity>
				

									<View
										style={{
											flex: 2,
										}}/>		
								</View>
	
							</View>
					</View> 
					}	

                   <View  style={[styles.containerWait, !this.state._waiting ? styles.containerHiddend : {}]}>
							<ActivityIndicator size="large" color="#ffff"  />    
				   </View>	

		   </View>
		);
			
	}
		
}





const styles = StyleSheet.create({ 
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
	btnCnt: {
		position:"absolute",
		backgroundColor: "transparent",
		borderRadius: 25,
		shadowColor: "rgba(255, 45, 102, 0.72)",
		shadowRadius: 3,
		shadowOpacity: 1,
		opacity:.3,
		paddingLeft: 15,
		paddingRight:15,
		height: 40,
		bottom:60,
		borderColor:"gray",
		borderRadius:20,
		borderWidth: 1,
	},
	btnCntText: {
		marginTop:8,
		color: "white",
		fontFamily: "Raleway-Bold",
		fontSize: 17,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
	},
	passwordRememberdText: {
		backgroundColor: "transparent",
		color: "#8B1936",
		fontSize: 15,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "center",
	},
	btnForgotTouch: {
		backgroundColor: "transparent",
		borderRadius: 25,
		shadowColor: "rgba(255, 45, 102, 0.72)",
		shadowRadius: 3,
		shadowOpacity: 1,
		opacity:.3,
		paddingTop:5,
        alignSelf : "center",
		//paddingLeft: 15,
		//paddingRight:15,
		height: 30,
		width :250,
		borderColor:"gray",
		borderRadius:20,
		borderWidth: 1,
	},
	grupo171ButtonText: {
		color: "white",
		fontFamily: "Raleway-Bold",
		fontSize: 17,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
	},
	grupo171Button: {
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
		width :193,
	},
	passwordTextInput: {
		backgroundColor: "#DADBDD",
		opacity: 0.7,
		paddingLeft : 15,
		color: "#0D0C0C",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 315,
		height: 43,
		borderRadius: 27.5,
		borderWidth: 1,
		borderColor: "#CCC7C7",
		left: -20,
	},
	viewPasswordFieldView: {
		backgroundColor: "transparent",
		borderRadius: 27.5,
		borderWidth: 1,
		borderColor: "transparent",
		borderStyle: "solid",
		width: 300,
		height: 55,
		marginTop: 34,
		marginLeft: 60,

	},
	shareText: {
		backgroundColor: "transparent",
		color: "black",
		fontSize: 13,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "center",
		width: 368,
		marginTop:10,
	},
	welcomeText: {
		backgroundColor: "transparent",
		color: "black",
		fontSize: 28,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "center",
		width: 378,
	},
	loginXuserText: {
		backgroundColor: "transparent",
		color: "#8B1936",
		fontSize: 30,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "center",
		paddingLeft:15,
		paddingRight:15,
		width: 378,
	},
	viewCardViewPIN: {
		backgroundColor: "#FFFFFF",
		alignSelf: "center",
		height: 610,
		width: 400,
		alignItems: "center",
		borderRadius:20,
		borderWidth: 1,
		borderColor: '#fff'
	},
	loginText: {
		backgroundColor: "transparent",
		color: "#8B1936",
		fontSize: 28,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "center",
		width: 410,
	},
	viewTitleLogoView: {
		backgroundColor: "transparent",
		width: 78,
		height: 61,
		alignItems: "center",
	},
	viewCardShiftDayView: {
		backgroundColor: "transparent",
		shadowColor: "rgba(0, 0, 0, 0.15)",
		shadowRadius: 20,
		shadowOpacity: 1,
		height: 317,
		marginLeft: 137,
		marginRight: 157,
		marginTop: 24,
	},
	viewView: {
		backgroundColor: "transparent",
		flex: 1,
		//alignItems: "center",
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
	btnbackButtonText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
	},
})
