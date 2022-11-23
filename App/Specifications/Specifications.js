

import React from "react"
import { Image, StyleSheet, Text, FlatList, TouchableOpacity, View,StatusBar,ScrollView,Alert ,ActivityIndicator,Dimensions} from "react-native"
import Moment from 'moment';

import ShiftHeader from "../Headers/ShiftHeader"

import HTML from 'react-native-render-html';
//import HTMLView from 'react-native-htmlview';
//import { greaterThan } from "react-native-reanimated";

export default class Specifications extends React.Component {

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
			 header : this.props.navigation.state.params.header,
			 paymentTab: false,
			 infoTab: false,
			 enrollmentTab:true,
			 state_specifications:"",
             city_specifications:"",
             city_name : "",
			 state_name : "",
			 _state: null,
			 _city: null,
			 specifications_locations: global.specifications_locations, 
			 _states: null,
			 _vities: null,
			 _waiting:false,
			 type:"S",
        }
        
	}

	getSpecifications = (state_id,city_id,type) => {
		this.setState({type:type})
        let _url = global.host + '/api/auth/specifications/'+ state_id+'/'+city_id.toLowerCase();
		console.log("_url");
		console.log(_url);
		this.setState({_waiting : true})
		fetch( _url, {
			method: 'GET',
			headers: {
			   'Accept': 'application/json',
			   'Content-Type': 'application/json', 
			   "cache-control": "no-cache",
			   'Authorization' : global.token_type +  " " + global.access_token
			},
			body: ""
		   
		  }).then((response) =>  response.text()) 
				.then((responseData) =>
				 {
					//console.log(responseData); return;
				   try {
					this.setState({_waiting : false})
//console.log(responseData)
					   var responseTXT = responseData; 
					   let responseJSON = JSON.parse (responseTXT); 

					   if( responseJSON['success'] !== undefined && responseJSON['success'] !== false )  {
						  let new_state_url ;
						  let _state_specifications = responseJSON['state_specifications'];
						  let _city_specifications =responseJSON['city_specifications'];
						  this.setState({ state_specifications: _state_specifications.split("\/uploads" ).join( global.host+"\/uploads") })
						  this.setState({ city_specifications:_city_specifications.split("\/uploads" ).join( global.host+"\/uploads")})
						  console.log(".....")
						  console.log(_state_specifications.split("\/uploads" ).join( global.host+"\/uploads")   ) 
						  this.setState({city_name:responseJSON['city_name']});
                          this.setState({state_name:responseJSON['state_name']});
                                  
					 	} else{
							console.log("ERROR");
							if (responseJSON['message'] == "Unauthenticated."){
							Alert.alert(
								'Attention !',
								'Your session expired. Please login again.',
								[
								{text: 'OK', onPress: () => {console.log('OK Error Pressed');return;}},
								],
								{cancelable: false},
							);
							
							   this.onLoginfailure();  
							}
							if (responseJSON['msg'] == "Error Clock Out"){ 
								Alert.alert( 
									responseJSON['msg'] +'!',
									responseJSON['error'],
									[
									{text: 'OK', onPress: () => {
										console.log('OK Pressed Message Error');
										
									}
									
								    },
									],
									{cancelable: false},
								);
								
								    
								}							
					 } 

				   } catch (e) {
					   console.log(e);
					   this.setState({
						   authenticated :0
					   });
					   if (e !== "ERROR")
					        Alert.alert("Error:", "Problems connecting to the Server. Please try again later.");

				   }

				}).catch((error) => {
				  console.log(error);	 
				  console.error(error);

				  this.setState({
					 authenticated :0
				   });
				});
	
	}

	

	componentDidMount() {
		console.log(this.state.specifications_locations.states[0].id)
		if( this.state.specifications_locations){
			var first_city_id = this.firstCityId(this.state.specifications_locations.states[0].id);
			var first_city= this.firstCityObj(this.state.specifications_locations.states[0].id);
			
			this.setState({_states:this.state.specifications_locations.states})
			this.setState({_cities:this.state.specifications_locations.cities})
			this.setState({_state:this.state.specifications_locations.states[0]})
			this.setState({_city:this.firstCityObj(this.state.specifications_locations.states[0].id)})

		}
        console.log(this.props.navigation.state.params.header);
        
		this.getSpecifications(this.state.specifications_locations.states[0].abbreviation ,first_city_id , "S");
	}

	onBtnEnrollment = () => {
		this.setState({ paymentTab: false})
		this.setState({ infoTab: false})
		this.setState({ enrollmentTab: true})
	}


	onBtnInfo = () => {
		this.setState({ paymentTab: false})
		this.setState({ infoTab: true})
		this.setState({ enrollmentTab: false})
	}
	
	onBtnBackPressed = () => {

		this.props.navigation.goBack()
	}
	onLoginfailure = () => {
	
		const { navigate } = this.props.navigation
		
		navigate("Login")
	}

	onBtnCityPressed = (state_id,permalink,city)   =>{
		let current_state = state_id;
		let current_cityId = permalink;


		this.setState({_city:city})
		console.log(state_id)
		console.log(permalink)
		console.log(city)
		this.getSpecifications(current_state ,current_cityId , "C");
	 } 
	 onBtnStatePressed(state_id,selected_state)  {

		let current_state = state_id;
		let current_cityOBJ = this.firstCityObj(selected_state.id) ;//this.state._city.permalink;
		let current_cityId = this.firstCityId(selected_state.id) ;//this.state._city.permalink;
	
		console.log(current_cityId)
		this.setState({_state:selected_state})
		this.setState({_city:current_cityOBJ})
		this.getSpecifications(current_state ,current_cityId , "S");
	  }   

	firstCityObj(state_id){
		var city = global.specifications_locations.cities.map((item,i)=>{ 			
			if(item.state_id === state_id){
				return (item);
			}
		});		
	}
	firstCityId(state_id){
		//console.log(this.state._cities.length)

		for(let i = 0;  i < global.specifications_locations.cities.length ; i++ )				
			if(global.specifications_locations.cities[i].state_id === state_id){
				return global.specifications_locations.cities[i].permalink;
			}
	
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
				<StatusBar backgroundColor="transparent" barStyle="light-content" />	
				<View
					//pointerEvents="box-none"
					style={{

                        flex: 1,
					}}>

					<ShiftHeader
						instructorName = {global.name}
						date = {global.todayFormat}
						time = {this.state.header.class_time}
						class_type = {this.state.header.class_type}
						city = {this.state.header.city}
						class_number = {this.state.header.class_number}
						navigation = {this.props.navigation}
						_onLoadGetUsers = {this.props.navigation.state.params._onLoadGetUsers}
					>
					</ShiftHeader>


                <View
					style={styles.stateBandView}>
					<View 					
						style={styles.bandText}>
							<Text
								style={styles.lblnameText}>States:</Text>	
					</View>
					<FlatList
						horizontal
						data={this.state._states}
						renderItem={({ item: rowData }) => {
						return (
								<TouchableOpacity 
										onPress={ () => {this.onBtnStatePressed(rowData.abbreviation,rowData)}}>	
											<View 					
												style={styles.buttonBandView}>
													<View
														style={styles.buttonCitiesView}
													>
														<Text
															style={styles.buttonCitiesText}
															>{rowData.name}</Text>		
													</View>
											</View>
									</TouchableOpacity>	

						);
						}}
						keyExtractor={(item, index) => index}
					/>
				</View> 
				
				<View
					style={styles.stateBandView}>	
					<View 					
						style={styles.bandText}>
							<Text
								style={styles.lblnameText}>Cities:</Text>	
					</View>

					<FlatList
						horizontal
						data={this.state._cities}
						renderItem={({ item: rowData }) => {
						if(rowData.state_id == this.state._state.id ){	
							return (
									<TouchableOpacity 
											onPress={ () => {this.onBtnCityPressed(rowData.state_abbreviation,rowData.permalink,rowData)}}>	
												<View 					
													style={styles.buttonBandView}>
														<View
															style={styles.buttonCitiesView}
														>
															<Text
																style={styles.buttonCitiesText}
																>{rowData.name}</Text>		
														</View>
												</View>
										</TouchableOpacity>	
							)
						};
						}}
						keyExtractor={(item, index) => index}
					/>


				</View> 		

				<TouchableOpacity
						onPress={this.onBtnBackPressed}
						style={styles.btnbackButton}>
						<Text
							style={styles.btnbackButtonText}>Back</Text>
				</TouchableOpacity>				 

    <ScrollView style=  {styles.FlexOne1}  > 
          <View style=  {styles.FlexGrowOne} > 

		  <View  style={styles.detailContainerShow} > 
		      <View
					style={styles.viewbodyView}>
							<View
								pointerEvents="box-none"
								style={{
									backgroundColor: "white",
									//position: "absolute",
									left: 0,
									right: 0,
									top: 0,
									flex : 1,
									shadowColor: "rgb(139, 25, 54)",
									shadowRadius: 4,
									shadowOpacity: .5,
								}}>

								{ true &&    
									<View style={{
											width: 690,
												}}>

											<HTML source={{ html: page }}  
												tagsStyles= {{
													h4: {  fontStyle: 'italic', color: 'black',fontSize: 18  } ,
													p: {  fontStyle: 'italic', color: 'gray',fontSize: 14 ,left:30 },
												}}
												classesStyles={{ 'panel-title': { fontStyle: 'italic', color: 'black',fontSize: 18} }}
											/>
									</View>
								}
								<View
								style={{
									flex: 1,
								}}/>
							</View>	
				</View>
            </View>

           </View>

          </ScrollView>
                <View  style={[styles.containerWait, !this.state._waiting ? styles.containerHiddend : {}]}>
                      <ActivityIndicator size="large" color="#ffff"  />    
			    </View>	
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
	buttonCitiesText:{
		color: "gray",
		backgroundColor:"transparent",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "center",
		borderRadius: 16.5,
		alignSelf: "center",
		marginHorizontal:15,
		marginBottom:5,
		marginTop:5,
	},
	buttonCitiesView:{
		borderRadius: 16.5,	
		backgroundColor:"white",
		shadowColor: "rgba(0, 0, 0, 0.16)",
		shadowRadius: 12,
		shadowOpacity: 1,
		alignSelf: "center",
		marginLeft:10,
	},
	stateBandView:{
		marginLeft:1,
		marginTop: 1,
		height: 46,
		flexDirection: "row",
		backgroundColor:"black",
	},
	buttonBandView:{
		marginLeft:1,
		marginTop: 1,
		height: 46,
		flexDirection: "row",
		backgroundColor:"transparent",
	},	
	bandText:{
		width:120,
		backgroundColor:"white",
	},	
    FlexGrowOne: {
       flex : 1,
        flexDirection: "row",
        //height : 2800,
    },
    FlexOne: {
        flex : 1,
        flexDirection: "row",
        //height : 1800,
    },
	stylesHTML:{
		width: 70,
		backgroundColor: "yellow",
	},
	h4a :{
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular", 
		fontSize: 16,
		left: 79,
	}  , 
	li1:{
		marginLeft: 0,
		backgroundColor: "yellow",

	}, 
	ul1:{
		marginLeft: 0,
		backgroundColor: "blue",
	},

	detailContainerShow:{ 
		left:0,
		width: 748,
		marginTop:10,
		marginLeft:10,

        //flex : 1,
		//position: "absolute",
	},
	detailContainerHidden:{
        left:3000,
        flex : 1,
		//position: "absolute",
	},
	paymentContainerShow:{
		left:0,
		width: 770,
        //position: "absolute",
       // flex : 1,
	},
	paymentContainerHidden:{
		left:3000,
		position: "absolute",
	},
	infoContainerShow:{
		left:0,
		width: 770,
        //position: "absolute",
       // flex : 1,
	},
	infoContainerHidden:{
		left:3000,
		position: "absolute",
	},	
	viewbodyInfoView:{
		backgroundColor: "rgb(228, 228, 228)",
		shadowColor: "rgb(139, 25, 54)",
		shadowRadius: 10,
		shadowOpacity: .5,
		height: 440,
		marginLeft: 19,
		marginRight: 19,
		marginTop: 8,
		alignItems: "flex-start",
	},

	txtnameText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 460,
		marginLeft: 12,
	},
	txtlblemailText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		width: 52,
	},
	txtlblemailText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		width: 52,
	},	
	txtlblphoneText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 65,
	},
	txtphoneText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 557,
		marginLeft: 5,
		marginTop: 1,
	},
	txtphoneText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 557,
		marginLeft: 5,
		marginTop: 1,
	},
	txtlbladdressText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		position: "absolute",
		left: 0,
		top: 0,
	},	
	txtaddressText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		position: "absolute",
		left: 85,
		width: 551,
		top: 0,
	},
	txtlblcityText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
	},
	txtcityInfoText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 537,
		marginLeft: 10,
	},
	txtlblstateText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
	},
	txtstateText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 555,
		marginLeft: 27,
	},
	txtlblzipText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
	},
	txtzipText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 558,
		marginLeft: 18,
	},
	txtlblssnText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
	},
	txtssnText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 423,
		marginLeft: 15,
	},
	txtlbldateofbText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
	},
	txtdateofbText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 506,
		marginLeft: 9,
	},
	txtlblcreatedText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
	},
	txtcreatedText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 464,
		marginLeft: 12,
	},
	txtlblaccounturlText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 175,
		marginLeft: 27,
		marginTop: 9,
	},
	txtaccounturlText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 698,
		marginLeft: 32,
		marginTop: 12,
	},
	txtemailText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 557,
		marginLeft: 8,
	},
	viewbuttoncopyButton: {
		backgroundColor: "white",
		borderRadius: 10,
		shadowColor: "black",
		shadowRadius: 5,
		shadowOpacity: .5,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		alignSelf: "flex-end",
		width: 98,
		height: 32,
		marginRight: 51,
		marginBottom: 26,
	},
	viewbuttoncopyButtonText: {
		color: "rgb(139, 25, 54)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
	},
	enrollmentInfoText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
	},
	paymentHistoryInfoText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		marginLeft: 108,
	},
	infoInfoText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
	},





	viewView: {
		backgroundColor: "rgb(239, 239, 244)",
		flex: 1,
		
	},

	viewCol1View: {
		backgroundColor: "transparent",
		width: 102,
		height: 41,
		alignItems: "flex-start",
	},
	txtClassText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 110,
		marginTop: 3,
	},
	viewCol2View: {
		backgroundColor: "transparent",
		width: 209,
		height: 42,
		alignItems: "flex-end",
	},
	viewRowDatetimeView: {
		backgroundColor: "transparent",
		width: 209,
		height: 20,
		marginTop: 3,
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "flex-start",
	},
	txtCityText2: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		width: 110,
	},
	txtDateText2: {
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		marginRight: 8,
		left:-20,
	},
	viewTimeView2: {
		backgroundColor: "transparent",
		width: 82,
		height: 18,
		marginTop: 2,
		flexDirection: "row",
		alignItems: "flex-start",
		left:-18,
	},
	txtProgramText2: {
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		alignSelf: "flex-start",
		width: 187,
		marginLeft: 6,
	},
	imgIconTimeImage: {
		backgroundColor: "transparent",
		resizeMode: "cover",
		width: 15, 
		height: 15,
	},
	txtInstructorNameText: {
		color: "white",
		fontFamily: "SegoeUI",
		fontSize: 17,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "right",
		backgroundColor: "transparent",
		width: 155,
		marginRight: 8,
		marginTop: 18,
	},
	imgIconInstructorImage: {
		resizeMode: "cover",
		backgroundColor: "transparent",
		width: 18,
		height: 26,
		marginTop: 9,
		right: -8,
	},	
	txtTimeText2: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		left: 4,
		width: 70,
	},	
	trazado0057Image:{
		resizeMode:"stretch",
		backgroundColor: "transparent",
		position: "absolute",
		left: 380,
		width: 368,
		right: -1,
		top: -1,
		height: 41,
	},


	trazado108Image: {
		backgroundColor: "transparent",
		shadowColor: "rgba(0, 0, 0, 0.2)",
		shadowRadius: 6,
		shadowOpacity: 1,
		resizeMode: "cover",
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		height: 61,
	},
	grupo290Image: {
		backgroundColor: "transparent",
		resizeMode: "center",
		width: 190,
		height: 34,
		marginTop: 4,
	},
	phoenixText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
	},
	class3Text: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		marginTop: 3,
	},
	nationalProgramText: {
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		marginRight: 23,
	},
	may062002Text: {
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		marginRight: 12,
	},
	grupo292View: {
		backgroundColor: "transparent",
		width: 52,
		height: 18,
		marginTop: 2,
		flexDirection: "row",
		alignItems: "center",
	},
	grupo46Image: {
		resizeMode: "center",
		backgroundColor: "transparent",
		width: 15,
		height: 15,
	},
	dayText: {
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
	},
	jenniferAneHoffmanText: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "SegoeUI",
		fontSize: 20,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		marginRight: 8,
		marginTop: 16,
	},
	grupo291Image: {
		resizeMode: "center",
		backgroundColor: "transparent",
		width: 18,
		height: 26,
		marginTop: 10,
	},
	btnbackButton: {
		position:"absolute",
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
		top:78,
		right:12,
		//marginRight: 20,
		//marginTop: 29,
	},
	btnbackButtonText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
	},
	btnbackButtonImage: {
		resizeMode: "contain",
		marginRight: 10,
	},
	tabsbarView: {
		backgroundColor: "transparent",
		alignSelf: "flex-start",
		width: 796,
		height: 36,
		marginLeft: 18,
		marginTop: 35,
	},
	trazado57Image: {
		resizeMode: "stretch",
		backgroundColor: "transparent",
		position: "absolute",
		width: 388,
		left: 0,
		right: -1,
		top: -1,
		height: 41 ,
	},
	enrollmentText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 20,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
	},
	labelpaymenthistoryText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 20,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		marginLeft: 100,
	},
	labelinfoText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 20,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
	},

// Payment::


	tabsbarPaymentView:{
		backgroundColor: "transparent",
		alignSelf: "flex-start",
		width: 796,
		height: 36,
		marginLeft: 18,
		marginTop: 35,
		flexDirection: "row",
		alignItems: "flex-start",
	},
	enrollmentPaymentText:{
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		marginLeft: 21,
		marginTop: 6,
	},
	trazado057Image:{
		resizeMode:"stretch",
		backgroundColor: "transparent",
		position: "absolute",
		left: 0,
		width: 248,
		right: -1,
		top: -1,
		height: 41,
	},
	labelpaymenthistoryPaymentText:{
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
	},



	viewbodyPymentView: {
		backgroundColor: "white",
		shadowColor: "rgb(139, 25, 54)",
		shadowRadius: 7,
		shadowOpacity: 0.5,
		height: 500,
		marginLeft: 21,
		marginRight: 17,
		marginTop: 7,
		alignItems: "flex-start",
	},

	viewheaderView : {
		backgroundColor: "transparent",
		width: 700,
		height: 19,
		marginLeft: 19,
		marginTop: 12,
	},
	txtheaddateText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 46,
	},
	txtheadamountText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		//marginLeft: 59,
	},
	txtheadtypeText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		width: 59,
		//marginLeft: 35,
	},
	txtheadreferenceText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 91,
		//marginLeft: 40,
	},
	txtheadcardText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		width: 58,
		//marginRight: 109,
	},
	txtheadcourseText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		width: 71,
	},
	viewlineheaderView: {
		backgroundColor: "rgb(184, 184, 184)",
		alignSelf: "flex-start",
		width: 700,
		height: 1,
		marginTop: 11,
	},
	viewrowView: {
		backgroundColor: "transparent",
		width: 769,
		height: 1,
		marginLeft: 5,
		marginTop: 47,
	},
	viewtxtdateText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 96,
	},
	viewtxtamountText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 57,
		marginLeft: 19,
	},
	viewtxttypeText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 65,
		marginLeft: 50,
	},
	viewtxtreferenceText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 121,
		marginLeft: 37,
	},
	viewcardText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 101,
		marginRight: 60,
	},
	viewtxtcourseText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 142,
		left: -60,
	},
	viewlinerowView: {
		backgroundColor: "rgb(184, 184, 184)",
		alignSelf: "flex-start",
		width: 700,
		height: 1,
		marginTop: 15,
	},





	viewbodyView: {
		backgroundColor: "red",
		//position: "absolute",
		left: 0,
		right: 0,
        top: 0,
        //alignItems: "flex-start",
        
	},
	viewrectcardView: {
		backgroundColor: "white",
		opacity: 0.5,
		shadowColor: "rgb(139, 25, 54)",
		shadowRadius: 7,
		shadowOpacity: 1,
		//position: "absolute",

        alignItems: "flex-start",
		
	},
	viewcontheaderView: {
		backgroundColor: "transparent",
		alignSelf: "stretch",
		height: 87,
	},
	viewrectredView: {
		backgroundColor: "rgb(139, 25, 54)",
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		height: 87,
	},
	txtcityText: {
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 32,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 362,
	},
	txtdateText: {
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 18,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "right",
		backgroundColor: "transparent",
		width: 233,
		height: 22,
		marginTop: 13,
	},
	txtprogramText: {
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 32,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 422,
	},
	viewtimeView: {
		backgroundColor: "transparent",
		width: 140,
		height: 30,
		marginTop: 1,
		flexDirection: "row",
		alignItems: "center",
		
	},
	imgtimeImage: {
		resizeMode: "cover",
		backgroundColor: "transparent",
		width: 26,
		height: 26,
		marginLeft: 11,
		left : -17,
	},
	txttimeText: {
		color: "white",
		fontFamily: "Montserrat-Regular",
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 126,
		backgroundColor: "transparent",
		left : -12,
	},
	lbldateenrolledText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 122,
		height: 19,
	},
	txtdateenrolledText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 141,
		marginLeft: 5,
	},
	lblcityText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		width: 42,
		height: 19,
	},
	txtcityTwoText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 211,
		marginLeft: 3,
	},
	lblstateText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		width: 53,
		height: 19,
	},
	txtstateText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 201,
		marginLeft: 8,
	},
	lbltuitioncostText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		width: 110,
		height: 19,
	},
	txttuitioncostText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 119,
		marginLeft: 1,
	},
	txtexamcostText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 140,
		marginLeft: 176,
	},
	lbltuitionbalanceText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 137,
		height: 19,
		marginTop: 8,
	},
	txttuitionbalanceText: {
		color: "rgb(139, 25, 54)",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 93,
		marginLeft: 2,
		marginTop: 8,
	},
	lblexambalanceText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		width: 128,
		height: 19,
		marginLeft: 77,
		marginTop: 8,
	},
	txtexambalanceText: {
		backgroundColor: "transparent",
		color: "rgb(139, 25, 54)",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 106,
		marginLeft: 2,
		marginTop: 8,
	},
	btnaddpayButtonText: {
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
	},
	btnaddpayButton: {
		backgroundColor: "rgb(142, 217, 61)",
		borderRadius: 16,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		width: 152,
		height: 32,
	},
	btnaddpayButtonImage: {
		resizeMode: "contain",
		marginRight: 10,
	},
	lblnotesText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		marginLeft: 14,
		marginTop: 34,
	},
	rectangulo62TextInput: {
		backgroundColor: "white",
		borderWidth: 1,
		borderColor: "rgb(112, 112, 112)",
		borderStyle: "solid",
		padding: 10,
		color: "black",
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		width: 355,
		height: 67,
		marginLeft: 14,
		marginTop: 2,
	},
	viewnoterowView: {
		backgroundColor: "transparent",
		width: 743,
		height: 62,
		marginLeft: 21,
		marginTop: 18,
		alignItems: "flex-end",
	},
	addPaymentText: {
		backgroundColor: "transparent",
		color: "white",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		marginRight: 15,
	},
	txtnoteText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		alignSelf: "flex-start",
		width: 743,
		height: 41,
		marginTop: 168,
	},
	lblexamcostText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		position: "absolute",
		left: 324,
		width: 96,
		top: 207,
		height: 19,
	},
	txtnotedateText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		position: "absolute",
		left: 21,
		width: 177,
		top: 400,
	},
	btnsaveView: {
		backgroundColor: "rgb(239, 239, 239)",
		borderRadius: 5,
		shadowColor: "rgba(0, 0, 0, 0.69)",
		shadowRadius: 3,
		shadowOpacity: 1,
		position: "absolute",
		right: 215,
		width: 130,
		top: 347,
		height: 33,
		justifyContent: "center",
		alignItems: "flex-end",
	},
	btntxtsavenoteText: {
		color: "rgb(139, 25, 54)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		backgroundColor: "transparent",
		marginRight: 18,
	},
	lblnameText: {
		color: "rgb(139, 25, 54)",
		fontFamily: "Montserrat-Bold",
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "right",
		marginTop:6,
		backgroundColor: "transparent",
		alignSelf: "center",

	},
})
