//
//  Details
//  Ipad Trainer Portal-r3d
//
//  Created by [Author].
//  Copyright © 2018 [Company]. All rights reserved.
//

import React from "react"
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View,StatusBar,ScrollView,Alert,Dimensions,ActivityIndicator } from "react-native"
import Moment from 'moment';

import ShiftHeader from "../Headers/ShiftHeader"


export default class Details extends React.Component {

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
			// instructor_notes: this.props.navigation.state.params.instructor_notes,
			 shift:  this.props.navigation.state.params.shift,
			 paymentTab: false,
			 infoTab: false,
			 enrollmentTab:true,
			 comments : this.props.navigation.state.params.studentItem.comments, 
			 comment : "",
			 enrollment_id : this.props.navigation.state.params.studentItem.id,
			 student_id: this.props.navigation.state.params.studentItem.student_id,
			 _waiting: false,
	    }
	}

 

	componentDidMount() {
		console.log(this.props.navigation.state.params.studentItem.id);
		console.log("__________");
		console.log(this.props.navigation.state.params.studentItem.student_id);
		//this.setState({instructor_notes:this.props.navigation.state.params.studentItem.instructor_notes})
console.log(" " , this.props.navigation.state.params.studentItem)
	}

	onGrupo89Pressed = () => {
	
	}

	onBtnEnrollment = () => {
		this.setState({ paymentTab: false})
		this.setState({ infoTab: false})
		this.setState({ enrollmentTab: true})
	}

	onBtnPaymentHistory = () => {
	
		this.setState({ paymentTab: true})
		this.setState({ infoTab: false})
		this.setState({ enrollmentTab: false})
	//	const { navigate } = this.props.navigation;

	//	console.log(" antes de ir a PaymentHistory");
	//	navigate("PaymentHistory",{header:this.props.navigation.state.params.header,icon:this.props.navigation.state.params.icon,studentItem:this.props.navigation.state.params.studentItem, 
	//		course :this.props.navigation.state.params.course , shift:this.props.navigation.state.params.shift  })// {course : this.state._course} ) , {header:this.state._course,icon:imgIcon,student:item, course : this.state.data.course } 
	}
	onBtnInfo = () => {
		//console.log(222)
		//const { navigate } = this.props.navigation
		//navigate("InfoStudent")// {course : this.state._course} ) , {header:this.state._course,icon:imgIcon,student:item, course : this.state.data.course } 
		this.setState({ paymentTab: false})
		this.setState({ infoTab: true})
		this.setState({ enrollmentTab: false})
	}
	
	onBtnBackPressed = () => {
        global.screen = "Classroom"
		this.props.navigation.goBack()
	}

	
	onBtnAddPayPressed = () => {
        global.screen = "Classroom"
		this.props.navigation.goBack()
	}



	onSendComments = () => { // 

		if(this.state.comment == "") return;

		if( global.clock ===0  || global.shifttype == "info"){
			Alert.alert(
				'Attention !',
				'You must Clock In before you can save Comment.',
				[
				{text: 'OK', onPress: () => {

					 }
				},
				],
				{cancelable: false},
			   );
			   return;
		}

		var	objectBody = {comment:this.state.comment,student_id :this.state.student_id,city_id:global.city_id  } ;
		var _coments = [] ;
		 if(this.props.navigation.state.params.studentItem.comments !== undefined)
		     _coments = this.props.navigation.state.params.studentItem.comments;


		console.log(".................");
		console.log(this.state.enrollment_id);
		this.setState({_waiting : true})
		fetch(global.host + '/api/auth/students/enrollments/'+ this.state.enrollment_id, { 
			method: 'POST', 
			headers: {
			   'Accept': 'application/json',
			   'Content-Type': 'application/json', 
			   "cache-control": "no-cache",
			   'Authorization' : global.token_type +  " " + global.access_token
			},
			body: JSON.stringify(
				objectBody
			)
		}).then((response) =>  response.text()) 
			.then((responseData) =>
			{
				    this.setState({_waiting : false})
					try {
						
						let responseTXT = responseData;
						let responseJSON = JSON.parse (responseTXT); 


						console.log(this.state.course_date_id);

	
						if(responseJSON['success'] !== undefined) {
								if(responseJSON['success'] === true){   
									
									Alert.alert(
										'Success !',
										'You sent Enrollment Comment.',
										[
										{text: 'OK', onPress: () => console.log('OK Pressed')},
										],
										{cancelable: false},
									);
									
									
									if(this.state.comment !== ""){
										_coments.push({comment:this.state.comment,updated_at:global.today} ) 
										this.setState({comments:_coments});
										this.setState({comment:""});
									}
									
								}
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
	
								this.onLoginfailure();
						}
	
					} catch (e) {
						console.log(e);
						Alert.alert("Error:", "Problems connecting to the Server. Please try again later.");
	
					}	 
			});
	}

  


	render() {
		let imgIcon;

 
		let account_create = "NO"
		if(this.props.navigation.state.params.studentItem.created_at !== undefined && this.props.navigation.state.params.studentItem.created_at !== null )
				account_create = "YES"

		if(this.state.header.class_time === "Weekend" )
		imgIcon = require("./../../assets/images/trazado-100w.png");
	
		if(this.state.header.class_time === "Day" )
			imgIcon = require("./../../assets/images/grupo-46w.png");

		if(this.state.header.class_time === "Evening" )
			imgIcon = require("./../../assets/images/grupo-49-2.png");
		
		if(this.state.header.class_time !== "Weekend" && 
		this.state.header.class_time !== "Day" && 
		this.state.header.class_time !== "Evening" )
		imgIcon = require("./../../assets/images/trazado-107-T.png");

		return ( 
		      <View
				style={styles.viewView}>
				<StatusBar backgroundColor="transparent" barStyle="light-content" />	
				<View
					pointerEvents="box-none"
					style={{
						position: "absolute",
						left: 0,
						right: 0,
						top: 0,
						height: 1020,
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

					<TouchableOpacity
						onPress={this.onBtnBackPressed}
						style={styles.btnbackButton}>
						<Text
							style={styles.btnbackButtonText}>Back</Text>
					</TouchableOpacity>
					<Text
					style={styles.lblnameText}>{this.props.navigation.state.params.studentItem.name + "  " + this.props.navigation.state.params.studentItem.last_name}</Text>


    <ScrollView> 
     <View style=  {styles.mainContainer} > 
	 

				    <View  style={[styles.detailContainerShow, !this.state.enrollmentTab ? styles.detailContainerHidden : {}]} > 
					    <View  > 
							<View
								style={styles.tabsbarView}>
								<Image
									source={require("./../../assets/images/trazado-57.png")}
									style={styles.trazado57Image}/>
								<View
									pointerEvents="box-none"
									style={{
										position: "absolute",
										left: 21,
										right: 172,
										top: 7,
										height: 29,
										flexDirection: "row",
										alignItems: "flex-start",
									}}>
									<TouchableOpacity
										onPress={this.onBtnEnrollment}
										>
									<Text
												style={styles.enrollmentText}>Enrollment</Text>
									</TouchableOpacity>	
									<TouchableOpacity
										onPress={this.onBtnPaymentHistory}
										>
										<Text
											style={styles.labelpaymenthistoryText}>Payment History</Text>
									</TouchableOpacity>
									<View
										style={{
											flex: 1,
										}}/>
									<TouchableOpacity
										onPress={this.onBtnInfo}
										>
									<Text
										style={styles.labelinfoText}>Info</Text>
									</TouchableOpacity>
								</View>
							</View>

						</View>
							<View
								pointerEvents="box-none"
								style={{
									//height: 493,
									marginLeft: 18,
									marginRight: 20,
									marginTop: 5,
								}}>
								<View
									style={styles.viewbodyView}>
									<View
										style={styles.viewrectcardView}/>
									<View
										pointerEvents="box-none"
										style={{
											//position: "absolute",
											left: 0,
											right: 0,
											top: 0,
											//height: 460,
											alignItems: "flex-start",
										}}>
										<View
											style={styles.viewcontheaderView}>
											<View
												style={styles.viewrectredView}/>
											<View
												pointerEvents="box-none"
												style={{
													position: "absolute",
													left: 13,
													right: 17,
													top: 4,
													height: 78,
												}}>
												<View
													pointerEvents="box-none"
													style={{
														height: 39,
														flexDirection: "row",
														alignItems: "flex-start",
													}}>
													<Text
														style={styles.txtcityText}>{this.state.header.city}</Text>
													<View
														style={{
															flex: 1,
														}}/>
													<Text
														style={styles.txtdateText}></Text>
												</View>
												<View
													pointerEvents="box-none"
													style={{
														height: 39,
														marginRight: 1,
														flexDirection: "row",
														alignItems: "flex-start",
													}}>
													<Text
														style={styles.txtprogramText}>{this.state.header.class_type}</Text>
													<View
														style={{
															flex: 1,
														}}/>
													<View
														style={styles.viewtimeView}>
														<Image
															source={imgIcon}
															style={styles.imgtimeImage}/>
														<View
															style={{
																flex: 1,
															}}/>
														<Text
															style={styles.txttimeText}>{this.state.header.class_time}</Text>
													</View>
												</View>
											</View>
										</View>
										<View
											pointerEvents="box-none"
											style={{
												width: 268,
												height: 19,
												marginLeft: 14,
												marginTop: 11,
												flexDirection: "row",
												alignItems: "flex-start",
											}}>
											<Text
												style={styles.lbldateenrolledText}>Date Enrolled:</Text>
											<Text
												style={styles.txtdateenrolledText}>{  Moment(this.props.navigation.state.params.created_at).format('MMM DD YYYY') }</Text>
										</View>
										<View
											pointerEvents="box-none"
											style={{
												width: 256,
												height: 19,
												marginLeft: 14,
												marginTop: 7,
												flexDirection: "row",
												alignItems: "flex-start",
											}}>
											<Text
												style={styles.lblcityText}>City:</Text>
											<Text
												style={styles.txtcityTwoText}>{this.props.navigation.state.params.shift.city}</Text>
										</View>
										<View
											pointerEvents="box-none"
											style={{
												width: 256,
												height: 19,
												marginLeft: 14,
												marginTop: 7,
												flexDirection: "row",
												alignItems: "flex-start",
											}}>
											<Text
												style={styles.lblstateText}>State:</Text>
											<Text
												style={styles.txtstateText}>{this.props.navigation.state.params.shift.state}</Text>
										</View>
										<View
											pointerEvents="box-none"
											style={{
												width: 546,
												height: 19,
												marginLeft: 14,
												marginTop: 38,
												flexDirection: "row",
												alignItems: "flex-start",
											}}>
											<Text
												style={styles.lbltuitioncostText}>Tuition Cost:</Text>
											<Text
												style={styles.txttuitioncostText}>$ {this.props.navigation.state.params.course.cost / 100}</Text>
											<Text
												style={styles.txtexamcostText}>$ {this.props.navigation.state.params.course.exam_cost / 100}</Text>
										</View>
										<View
											pointerEvents="box-none"
											style={{
												alignSelf: "stretch",
												height: 32,
												marginLeft: 15,
												marginRight: 45,
												flexDirection: "row",
												alignItems: "flex-start",
											}}>
											<Text
												style={styles.lbltuitionbalanceText}>Tuition Balance:</Text>
											<Text
												style={styles.txttuitionbalanceText}>$ {this.props.navigation.state.params.studentItem.balance/100}</Text>
											<Text
												style={styles.lblexambalanceText}>Exam Balance:</Text>
											<Text
												style={styles.txtexambalanceText}>$ {this.props.navigation.state.params.studentItem.exam_balance/100}</Text>
											<View
												style={{
													flex: 1,
												}}/>
										{ false &&		
											<TouchableOpacity
												onPress={this.onBtnAddPayPressed}
												style={styles.btnaddpayButton}>
												<Text
													style={styles.btnaddpayButtonText}>Add Payment</Text>
											</TouchableOpacity>
	                                    }
										</View>
									
										<View>
											<Text
												style={styles.lblnotesText}>Comments</Text>
											<TextInput
												multiline={true}
												autoCorrect={false}
												onChangeText = {(comment) => this.setState({comment})}
												defaultValue = {this.state.comment}
												style={styles.rectangulo62TextInput}/>
										</View>
										
										<View
											style={styles.viewnoterowView}>
											<Text
												style={styles.addPaymentText}></Text>
											<Text
												style={styles.txtnoteText}></Text>
										</View>
									</View>
									<Text
										style={styles.lblexamcostText}>Exam Cost:</Text>
									<Text
										style={styles.txtnotedateText}></Text>

									<View>
										<TouchableOpacity
											onPress={this.onSendComments}
											>
											<View
												style={styles.btnsaveView}>
												<Text
													style={styles.btntxtsavenoteText}>Save Comment</Text>
											</View>
										</TouchableOpacity>
									</View>
									<View
										style={styles.viewNotesListView}>
										<ChildElementComments  commentsList={this.state.comments} />  
										<View key={1000000}
											style={styles.viewNotesRowViewSpace}></View>
									</View> 
								</View>
							</View>
				    </View>





				   <View  style={[styles.paymentContainerShow, !this.state.paymentTab ? styles.paymentContainerHidden : {}]} > 	   
					 <View
							style={styles.tabsbarPaymentView}>
								<TouchableOpacity
									onPress={this.onBtnEnrollment}>
							<Text
								style={styles.enrollmentPaymentText}>Enrollment</Text>
							</TouchableOpacity>		
							<View
								pointerEvents="box-none"
								style={{
									flex: 1,
									height: 42,
									marginLeft: 83,
								}}>
								<Image
									source={require("./../../assets/images/trazado-57.png")}
									style={styles.trazado057Image}/>
								<View
									pointerEvents="box-none"
									style={{
										position: "absolute",
										left: 21,
										right: 172,
										top: 7,
										height: 29, 
										flexDirection: "row",
										alignItems: "flex-start",
									}}>
									<Text
										style={styles.labelpaymenthistoryPaymentText}>Payment History</Text>
									<View
										style={{
											flex: 1,
										}}/> 
									<TouchableOpacity
									   onPress={this.onBtnInfo}>
									  <Text
										style={styles.labelinfoText}>Info</Text>	
									</TouchableOpacity>
									
								</View>
							</View>
						</View>




						<View
						style={styles.viewbodyPymentView}>
							<View
								style={styles.viewheaderView}>
								<View
									pointerEvents="box-none"
									style={{
										height: 19,
										flexDirection: "row",
										alignItems: "flex-start",
									}}>
									<Text
										style={styles.txtheaddateText}>Date</Text>
										<View
										style={{
											flex: 1,
										}}/>
									<Text
										style={styles.txtheadamountText}>Amount</Text>
									<View
										style={{
											flex: 1,
										}}/>			
									<Text
										style={styles.txtheadtypeText}>Type</Text>
										<View
										style={{
											flex: 1,
										}}/>		
									<Text
										style={styles.txtheadreferenceText}>Reference</Text>
									<View
										style={{
											flex: 1,
										}}/>
									<Text
										style={styles.txtheadcardText}>Card</Text>
									<View
										style={{
											flex: 1,
										}}/>									
									<Text
										style={styles.txtheadcourseText}>Course</Text>
									<View
										style={{
											flex: 1,
										}}/>
								</View>
								<View
									style={styles.viewlineheaderView}/>
							</View>
							<ChildElementPaymentHistory  result={this.props.navigation.state.params.studentItem}  shift={this.props.navigation.state.params.shift} />  

					   </View>

				</View>
				
				

				<View  style={[styles.infoContainerShow, !this.state.infoTab ? styles.infoContainerHidden : {}]} > 
				
							<View
								style={styles.tabsbarView}>
								<Image
									source={require("./../../assets/images/trazado-57.png")}
									style={styles.trazado0057Image}/>
								<View
									pointerEvents="box-none"
									style={{
										position: "absolute",
										left: 21,
										right: 172,
										top: 7,
										height: 29,
										flexDirection: "row",
										alignItems: "flex-start",
									}}>
									<TouchableOpacity
										onPress={this.onBtnEnrollment}
										>
									<Text
												style={styles.enrollmentText}>Enrollment</Text>
									</TouchableOpacity>	
									<TouchableOpacity
										onPress={this.onBtnPaymentHistory}
										>
										<Text
											style={styles.labelpaymenthistoryText}>Payment History</Text>
									</TouchableOpacity>
									<View
										style={{
											flex: 1,
										}}/>
                                    <TouchableOpacity
									   onPress={this.onBtnInfo}>
									<Text
										style={styles.labelinfoText}>Info</Text>
									</TouchableOpacity>
								</View>
							</View>

							<View
									hide = {false}
									style={styles.viewbodyInfoView}>
									<View
										pointerEvents="box-none"
										style={{
											width: 622,
											height: 18,
											marginLeft: 27,
											marginTop: 52,
											flexDirection: "row",
											alignItems: "flex-start",
										}}>
										<Text
											style={styles.txtlblnameText}>Name on certificate:</Text>
										<Text
											style={styles.txtnameText}>{this.props.navigation.state.params.studentItem.name}  {this.props.navigation.state.params.studentItem.last_name}</Text>
									</View>
									<View
										pointerEvents="box-none"
										style={{
											width: 627,
											height: 18,
											marginLeft: 27,
											marginTop: 9,
											flexDirection: "row",
											alignItems: "flex-start",
										}}> 
										<Text
											style={styles.txtlblemailText}>email:</Text>
										<Text
											style={styles.txtemailText}>{this.props.navigation.state.params.studentItem.waiver.student_email}</Text>
									</View>
									<View
										pointerEvents="box-none"
										style={{
											width: 627,
											height: 19,
											marginLeft: 27,
											marginTop: 9,
											flexDirection: "row",
											alignItems: "flex-start",
										}}>
										<Text
											style={styles.txtlblphoneText}>Phone:</Text>
										<Text
											style={styles.txtphoneText}>{this.props.navigation.state.params.studentItem.phone}</Text>
									</View>
									<View
										pointerEvents="box-none"
										style={{
											width: 621,
											height: 18,
											marginLeft: 27,
											marginTop: 7,
										}}>
										<Text
											style={styles.txtlbladdressText}>Address:</Text>
										<Text
											style={styles.txtaddressText}>{this.props.navigation.state.params.studentItem.address}</Text>
									</View>
									<View
										pointerEvents="box-none"
										style={{
											width: 613,
											height: 18,
											marginLeft: 27,
											marginTop: 9,
											flexDirection: "row",
											alignItems: "flex-start",
										}}>
										<Text
											style={styles.txtlblcityText}>City:</Text>
										<Text
											style={styles.txtcityInfoText}>{this.props.navigation.state.params.header.city}    </Text>
									</View>
									<View
										pointerEvents="box-none"
										style={{
											width: 625,
											height: 18,
											marginLeft: 27,
											marginTop: 9,
											flexDirection: "row",
											alignItems: "flex-start",
										}}>
										<Text
											style={styles.txtlblstateText}>State:</Text>
										<Text
											style={styles.txtstateText}>{this.props.navigation.state.params.studentItem.state}</Text>
									</View>
									<View
										pointerEvents="box-none"
										style={{
											width: 624,
											height: 18,
											marginLeft: 27,
											marginTop: 9,
											flexDirection: "row",
											alignItems: "flex-start",
										}}>
										<Text
											style={styles.txtlblzipText}>Zip:</Text>
										<Text
											style={styles.txtzipText}>{this.props.navigation.state.params.studentItem.zip}</Text>
									</View>
									<View
										pointerEvents="box-none"
										style={{
											width: 617,
											height: 18,
											marginLeft: 27,
											marginTop: 9,
											flexDirection: "row",
											alignItems: "flex-start",
										}}>
										<Text
											style={styles.txtlblssnText}>Social Security Number:</Text>
										<Text
											style={styles.txtssnText}>{this.props.navigation.state.params.studentItem.ssn}</Text>
									</View>
									<View
										pointerEvents="box-none"
										style={{
											width: 616,
											height: 18,
											marginLeft: 27,
											marginTop: 9,
											flexDirection: "row",
											alignItems: "flex-start",
										}}>
										<Text
											style={styles.txtlbldateofbText}>Date of Birth:</Text>
										<Text
											style={styles.txtdateofbText}>{ Moment(this.props.navigation.state.params.studentItem.birthdate).format('MMM DD YYYY')}</Text>
									</View>
									<View
										pointerEvents="box-none"
										style={{
											width: 603,
											height: 18,
											marginLeft: 27,
											marginTop: 9,
											flexDirection: "row",
											alignItems: "flex-start",
										}}>
										<Text
											style={styles.txtlblcreatedText}>Account Created:</Text>
										<Text
											style={styles.txtcreatedText}>{account_create}</Text>
									</View>
								

									<View
										pointerEvents="box-none"
										style={{
											width: 603,
											height: 18,
											marginLeft: 27,
											marginTop: 9,
											flexDirection: "row",
											alignItems: "flex-start",
										}}>

										<Text
											style={styles.txtlblcreatedText}>Graduation Document:</Text>
										<Text
											style={styles.txtcreatedText}>{account_create}</Text>
									</View>

									<View
										style={{
											flex: 1,
										}}/>
								    { false && <View>	
										<TouchableOpacity
											onPress={this.onViewButtonCopyPressed}
											style={styles.viewbuttoncopyButton}>
											<Text
												style={styles.viewbuttoncopyButtonText}>Copy</Text>
										</TouchableOpacity>
									</View>	}
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

export class ChildElementComments extends React.Component{ 
	
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render(){
		if(this.props.commentsList){  
			//console.log("this.props.notesList");
			//console.log(this.props.notesList);
		
			var res = this.props.commentsList.map((item)=>{ 

			return( 
				<View key={item.id}
					style={styles.viewNotesRowView}>
					<Text
						style={styles.txtDateNoteText}>{Moment(item.created_at).format('MMM DD YYYY') }</Text>
					<Text numberOfLines = { 20 }
						style={styles.txtNoteText}>{item.comment}</Text>
					<View
						style={styles.lineNoteView}/>
				</View>
				)
			})	
		}
		return ( 
			<View>{res}</View> 
		)
		index ++;	
	}


}

export class ChildElementPaymentHistory extends React.Component{ 
	
	constructor(props) {
		super(props);
		this.state = {

		};
	}

	render(){
		if(this.props.result && this.props.result.paymentHistory){  
			var res = this.props.result.paymentHistory.map((item,i)=>{ 
			return( 
					  <View key={item.id} >
							<View
								style={styles.viewrowView}>
								<View
									pointerEvents="box-none" 
									style={{
										height: 18,
										marginLeft: 9,
										flexDirection: "row",
										alignItems: "flex-start",
									}}>
									<Text
										style={styles.viewtxtdateText}>{Moment(item.created_at).format('MMM DD YYYY') }</Text>
									<Text
										style={styles.viewtxtamountText}>$ {item.amount/100}</Text>
									<Text
										style={styles.viewtxttypeText}>{item.payment_type}</Text>
									<Text
										style={styles.viewtxtreferenceText}>{item.transaction_id}</Text>
									<View
										style={{
											flex: 1,
										}}/>
									<Text
										style={styles.viewcardText}>{item.card_type} ***{item.card_number}</Text>
									<Text
										style={styles.viewtxtcourseText}>{this.props.shift.class_type} Program</Text>
								</View>
								<View
									style={styles.viewlinerowView}/>
							</View>
					  </View>
				)
			})	
		}
		return ( 
			<View>{res}</View> 
		)
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
	txtDateNoteText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Regular",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
		backgroundColor: "transparent",
		alignSelf: "flex-start",
		//marginLeft: 23,
	},	
	viewNotesListView: {
		backgroundColor: "transparent",
		left: 20,
		alignItems: "flex-start",
		width: 680,
	},
	lineNoteView: {
		backgroundColor: "rgb(184, 184, 184)",
		height: 1,
		marginTop: 19,
		width: 680,
	},	
	viewNotesRowView: {
		backgroundColor: "transparent",
		marginTop: 6,
		left: 0,
		right: 0,
		top: 0,
		//height: 63,
	},
	viewNotesRowViewSpace: {
		backgroundColor: "transparent",
		marginTop: 6,
		left: 0,
		right: 0,
		top: 0,
		height: 63,
	},
	detailContainerShow:{ 
		left:0,
		width: 770,
		position: "absolute",
	},
	detailContainerHidden:{
		left:3000,
		position: "absolute",
	},
	paymentContainerShow:{
		left:0,
		width: 770,
		position: "absolute",
	},
	paymentContainerHidden:{
		left:3000,
		position: "absolute",
	},
	infoContainerShow:{
		left:0,
		width: 770,
		position: "absolute",
	},
	infoContainerHidden:{
		left:3000,
		position: "absolute",
	},	
	viewbodyInfoView:{
		backgroundColor: "white",
		shadowColor: "rgb(0, 0, 0)",
		shadowRadius: 10,
		shadowOpacity: .3,
		height: 440,
		marginLeft: 19,
		marginRight: 19,
		marginTop: 8,
		alignItems: "flex-start",
	},
	txtlblnameText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
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
		left: 550,
		width: 128,
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
		marginRight: 20,
		marginTop: 29,
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
		resizeMode: "cover",
		backgroundColor: "transparent",
		position: "absolute",
		width: 188,
		left: 0,
		right: -1,
		top: -1,
		height: 41 ,
	},
	enrollmentText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
	},
	labelpaymenthistoryText: {
		backgroundColor: "transparent",
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 24,
		fontStyle: "normal",
		fontWeight: "bold",
		textAlign: "left",
		marginLeft: 100,
	},
	labelinfoText: {
		color: "rgb(39, 39, 39)",
		fontFamily: "Montserrat-Bold",
		fontSize: 24,
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
		shadowColor: "rgb(0, 0, 0)",
		shadowRadius: 7,
		shadowOpacity: 0.2,
		height: 750,
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
		backgroundColor: "white",

		left: 0,
		right: 0,
		top: 0,

		shadowColor: "rgb(0, 0, 0)",
		shadowRadius: 7,
		shadowOpacity: 0.2,

	},
	viewrectcardView: {
		backgroundColor: "red",
		opacity: 0.5,
		shadowColor: "rgb(139, 25, 54)",
		shadowRadius: 7,
		shadowOpacity: 1,
		//position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		//height: 493,
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
		//flexDirection: "row",
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
		width: 465,
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
		shadowOpacity: .5,
		position: "absolute",
		right: 60,
		width: 165,
		top: -120,
		height: 33,
	    justifyContent: "center",
		alignItems: "flex-end",
		shadowOffset: {
			width: 1,
			height: 2
		  },
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
		textAlign: "center",
		backgroundColor: "transparent",
		position: "absolute",
		alignSelf: "center",
		width: 476,
		top: 91,
	},
})
