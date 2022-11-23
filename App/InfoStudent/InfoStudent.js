//
//  InfoStudent
//  Ipad Trainer Portal-r3d
//
//  Created by [Author].
//  Copyright © 2018 [Company]. All rights reserved.
//

import React from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"


export default class InfoStudent extends React.Component {

	static navigationOptions = ({ navigation }) => {
	
		const { params = {} } = navigation.state
		return {
				header: null,				headerLeft: null,				headerRight: null,			}
	}

	constructor(props) {
		super(props)
	}

	componentDidMount() {
	
	}

	onViewButtonCopyPressed = () => {
	
	}

	render() {
	
		return <View
				style={styles.viewView}>
				<View
					pointerEvents="box-none"
					style={{
						position: "absolute",						left: 0,						right: 0,						top: 0,						height: 660,					}}>
					<View
						pointerEvents="box-none"
						style={{
							height: 61,						}}>
						<Image
							source={require("./../../assets/images/trazado-108.png")}
							style={styles.trazado108Image}/>
						<View
							pointerEvents="box-none"
							style={{
								position: "absolute",								left: 21,								right: 20,								top: 8,								height: 43,								flexDirection: "row",								alignItems: "flex-start",							}}>
							<Image
								source={require("./../../assets/images/grupo-290.png")}
								style={styles.grupo290Image}/>
							<View
								pointerEvents="box-none"
								style={{
									width: 69,									height: 41,									marginLeft: 89,									alignItems: "flex-start",								}}>
								<Text
									style={styles.phoenixText}>Phoenix</Text>
								<Text
									style={styles.class3Text}>Class #3</Text>
							</View>
							<View
								style={{
									flex: 1,								}}/>
							<View
								pointerEvents="box-none"
								style={{
									width: 167,									height: 42,									marginRight: 48,									alignItems: "flex-end",								}}>
								<Text
									style={styles.nationalProgramText}>National Program</Text>
								<View
									pointerEvents="box-none"
									style={{
										width: 167,										height: 20,										marginTop: 3,										flexDirection: "row",										justifyContent: "flex-end",										alignItems: "flex-start",									}}>
									<Text
										style={styles.may062002Text}>may 06 2002</Text>
									<View
										style={styles.grupo292View}>
										<Image
											source={require("./../../assets/images/grupo-46-2.png")}
											style={styles.grupo46Image}/>
										<View
											style={{
												flex: 1,											}}/>
										<Text
											style={styles.dayText}>Day</Text>
									</View>
								</View>
							</View>
							<Text
								style={styles.jenniferAneHoffmanText}>Jennifer Ane Hoffman</Text>
							<Image
								source={require("./../../assets/images/grupo-313.png")}
								style={styles.grupo291Image}/>
						</View>
					</View>
					<View
						style={styles.grupo89View}>
						<Text
							style={styles.backText}>Back</Text>
					</View>




					<View
						pointerEvents="box-none"
						style={{
							height: 42,							marginLeft: 19,							marginRight: 18,							marginTop: 46,						}}>
						<Image
							source={require("./../../assets/images/trazado-110.png")}
							style={styles.trazado110Image}/>
						
						
						<View
							pointerEvents="box-none"
							style={{
								position: "absolute",								left: 13,								right: 173,								top: 0,								height: 29,								flexDirection: "row",								alignItems: "flex-start",							}}>
							<Text
								style={styles.enrollmentText}>Enrollment</Text>
							<Text
								style={styles.paymentHistoryText}>Payment History</Text>
							<View
								style={{
									flex: 1,								}}/>
							<Text
								style={styles.infoText}>Info</Text>
						</View>

					</View>





					<View
						style={styles.viewbodyView}>
						<View
							pointerEvents="box-none"
							style={{
								width: 622,								height: 18,								marginLeft: 27,								marginTop: 52,								flexDirection: "row",								alignItems: "flex-start",							}}>
							<Text
								style={styles.txtlblnameText}>Name on certificate:</Text>
							<Text
								style={styles.txtnameText}>Name on certificate:</Text>
						</View>
						<View
							pointerEvents="box-none"
							style={{
								width: 627,								height: 18,								marginLeft: 27,								marginTop: 9,								flexDirection: "row",								alignItems: "flex-start",							}}>
							<Text
								style={styles.txtlblemailText}>email:</Text>
							<Text
								style={styles.txtemailText}>email:</Text>
						</View>
						<View
							pointerEvents="box-none"
							style={{
								width: 627,								height: 19,								marginLeft: 27,								marginTop: 9,								flexDirection: "row",								alignItems: "flex-start",							}}>
							<Text
								style={styles.txtlblphoneText}>Phone:</Text>
							<Text
								style={styles.txtphoneText}>Phone:</Text>
						</View>
						<View
							pointerEvents="box-none"
							style={{
								width: 621,								height: 18,								marginLeft: 27,								marginTop: 7,							}}>
							<Text
								style={styles.txtlbladdressText}>Address:</Text>
							<Text
								style={styles.txtaddressText}>Address:</Text>
						</View>
						<View
							pointerEvents="box-none"
							style={{
								width: 613,								height: 18,								marginLeft: 27,								marginTop: 9,								flexDirection: "row",								alignItems: "flex-start",							}}>
							<Text
								style={styles.txtlblcityText}>City:</Text>
							<Text
								style={styles.txtcityText}>City:</Text>
						</View>
						<View
							pointerEvents="box-none"
							style={{
								width: 625,								height: 18,								marginLeft: 27,								marginTop: 9,								flexDirection: "row",								alignItems: "flex-start",							}}>
							<Text
								style={styles.txtlblstateText}>State:</Text>
							<Text
								style={styles.txtstateText}>State:</Text>
						</View>
						<View
							pointerEvents="box-none"
							style={{
								width: 624,								height: 18,								marginLeft: 27,								marginTop: 9,								flexDirection: "row",								alignItems: "flex-start",							}}>
							<Text
								style={styles.txtlblzipText}>Zip:</Text>
							<Text
								style={styles.txtzipText}>Zip:</Text>
						</View>
						<View
							pointerEvents="box-none"
							style={{
								width: 617,								height: 18,								marginLeft: 27,								marginTop: 9,								flexDirection: "row",								alignItems: "flex-start",							}}>
							<Text
								style={styles.txtlblssnText}>Social Security Number:</Text>
							<Text
								style={styles.txtssnText}>Social Security Number:</Text>
						</View>
						<View
							pointerEvents="box-none"
							style={{
								width: 616,								height: 18,								marginLeft: 27,								marginTop: 9,								flexDirection: "row",								alignItems: "flex-start",							}}>
							<Text
								style={styles.txtlbldateofbText}>Date of Birth:</Text>
							<Text
								style={styles.txtdateofbText}>Date of Birth:</Text>
						</View>
						<View
							pointerEvents="box-none"
							style={{
								width: 603,								height: 18,								marginLeft: 27,								marginTop: 9,								flexDirection: "row",								alignItems: "flex-start",							}}>
							<Text
								style={styles.txtlblcreatedText}>Account Created:</Text>
							<Text
								style={styles.txtcreatedText}>Account Created:</Text>
						</View>
						<Text
							style={styles.txtlblaccounturlText}>Create Account URL:</Text>
						<Text
							style={styles.txtaccounturlText}>http://students.phlebs.com/portal/lalsi561v86as;654fa556/alkjflc</Text>
						<View
							style={{
								flex: 1,							}}/>
						<TouchableOpacity
							onPress={this.onViewButtonCopyPressed}
							style={styles.viewbuttoncopyButton}>
							<Text
								style={styles.viewbuttoncopyButtonText}>Copy</Text>
						</TouchableOpacity>
					</View>





				</View>
				<Text
					style={styles.terryCooperText}>Terry Cooper</Text>
			</View>
	}
}

const styles = StyleSheet.create({
	viewView: {
		backgroundColor: "rgb(239, 239, 244)",		flex: 1,	},	trazado108Image: {
		backgroundColor: "transparent",		shadowColor: "rgba(0, 0, 0, 0.2)",		shadowRadius: 6,		shadowOpacity: 1,		resizeMode: "cover",		position: "absolute",		left: 0,		right: 0,		top: 0,		height: 61,	},	grupo290Image: {
		backgroundColor: "transparent",		resizeMode: "center",		width: 190,		height: 34,		marginTop: 4,	},	phoenixText: {
		color: "white",		fontFamily: "Montserrat-Bold",		fontSize: 16,		fontStyle: "normal",		fontWeight: "bold",		textAlign: "left",		backgroundColor: "transparent",	},	class3Text: {
		color: "white",		fontFamily: "Montserrat-Bold",		fontSize: 16,		fontStyle: "normal",		fontWeight: "bold",		textAlign: "left",		backgroundColor: "transparent",		marginTop: 3,	},	nationalProgramText: {
		color: "white",		fontFamily: "Montserrat-Regular",		fontSize: 16,		fontStyle: "normal",		fontWeight: "normal",		textAlign: "left",		backgroundColor: "transparent",		marginRight: 24,	},	may062002Text: {
		backgroundColor: "transparent",		color: "white",		fontFamily: "Montserrat-Regular",		fontSize: 16,		fontStyle: "normal",		fontWeight: "normal",		textAlign: "left",		marginRight: 9,	},	grupo292View: {
		backgroundColor: "transparent",		width: 52,		height: 18,		marginTop: 2,		flexDirection: "row",		alignItems: "center",	},	grupo46Image: {
		resizeMode: "center",		backgroundColor: "transparent",		width: 15,		height: 15,	},	dayText: {
		color: "white",		fontFamily: "Montserrat-Regular",		fontSize: 14,		fontStyle: "normal",		fontWeight: "normal",		textAlign: "left",		backgroundColor: "transparent",	},	jenniferAneHoffmanText: {
		backgroundColor: "transparent",		color: "white",		fontFamily: "SegoeUI",		fontSize: 20,		fontStyle: "normal",		fontWeight: "normal",		textAlign: "left",		marginRight: 8,		marginTop: 16,	},	grupo291Image: {
		resizeMode: "center",		backgroundColor: "transparent",		width: 18,		height: 26,		marginTop: 10,	},	grupo89View: {
		backgroundColor: "rgb(139, 25, 54)",		borderRadius: 16.5,		shadowColor: "rgba(0, 0, 0, 0.16)",		shadowRadius: 12,		shadowOpacity: 1,		alignSelf: "flex-end",		width: 113,		height: 33,		marginRight: 20,		marginTop: 29,		justifyContent: "center",		alignItems: "center",	},	backText: {
		color: "white",		fontFamily: "Montserrat-Bold",		fontSize: 16,		fontStyle: "normal",		fontWeight: "bold",		textAlign: "left",		backgroundColor: "transparent",	},	trazado110Image: {
		resizeMode: "cover",		backgroundColor: "transparent",		position: "absolute",		left: 0,		right: 0,		top: 0,		height: 42,	},	enrollmentText: {
		color: "rgb(39, 39, 39)",		fontFamily: "Montserrat-Bold",		fontSize: 24,		fontStyle: "normal",		fontWeight: "bold",		textAlign: "left",		backgroundColor: "transparent",	},	paymentHistoryText: {
		backgroundColor: "transparent",		color: "rgb(39, 39, 39)",		fontFamily: "Montserrat-Bold",		fontSize: 24,		fontStyle: "normal",		fontWeight: "bold",		textAlign: "left",		marginLeft: 108,	},	infoText: {
		color: "rgb(39, 39, 39)",		fontFamily: "Montserrat-Bold",		fontSize: 24,		fontStyle: "normal",		fontWeight: "bold",		textAlign: "left",		backgroundColor: "transparent",	},	viewbodyView: {
		backgroundColor: "rgb(228, 228, 228)",		shadowColor: "rgb(139, 25, 54)",		shadowRadius: 10,		shadowOpacity: 1,		height: 440,		marginLeft: 19,		marginRight: 19,		marginTop: 8,		alignItems: "flex-start",	},	txtlblnameText: {
		backgroundColor: "transparent",		color: "rgb(39, 39, 39)",		fontFamily: "Montserrat-Bold",		fontSize: 16,		fontStyle: "normal",		fontWeight: "bold",		textAlign: "left",	},	txtnameText: {
		color: "rgb(39, 39, 39)",		fontFamily: "Montserrat-Regular",		fontSize: 16,		fontStyle: "normal",		fontWeight: "normal",		textAlign: "left",		backgroundColor: "transparent",		width: 460,		marginLeft: 2,	},	txtlblemailText: {
		backgroundColor: "transparent",		color: "rgb(39, 39, 39)",		fontFamily: "Montserrat-Bold",		fontSize: 16,		fontStyle: "normal",		fontWeight: "bold",		textAlign: "left",		width: 52,	},	txtemailText: {
		color: "rgb(39, 39, 39)",		fontFamily: "Montserrat-Regular",		fontSize: 16,		fontStyle: "normal",		fontWeight: "normal",		textAlign: "left",		backgroundColor: "transparent",		width: 557,		marginLeft: 18,	},	txtlblphoneText: {
		color: "rgb(39, 39, 39)",		fontFamily: "Montserrat-Bold",		fontSize: 16,		fontStyle: "normal",		fontWeight: "bold",		textAlign: "left",		backgroundColor: "transparent",		width: 65,	},	txtphoneText: {
		backgroundColor: "transparent",		color: "rgb(39, 39, 39)",		fontFamily: "Montserrat-Regular",		fontSize: 16,		fontStyle: "normal",		fontWeight: "normal",		textAlign: "left",		width: 557,		marginLeft: 5,		marginTop: 1,	},	txtlbladdressText: {
		backgroundColor: "transparent",		color: "rgb(39, 39, 39)",		fontFamily: "Montserrat-Bold",		fontSize: 16,		fontStyle: "normal",		fontWeight: "bold",		textAlign: "left",		position: "absolute",		left: 0,		top: 0,	},	txtaddressText: {
		color: "rgb(39, 39, 39)",		fontFamily: "Montserrat-Regular",		fontSize: 16,		fontStyle: "normal",		fontWeight: "normal",		textAlign: "left",		backgroundColor: "transparent",		position: "absolute",		left: 70,		width: 551,		top: 0,	},	txtlblcityText: {
		color: "rgb(39, 39, 39)",		fontFamily: "Montserrat-Bold",		fontSize: 16,		fontStyle: "normal",		fontWeight: "bold",		textAlign: "left",		backgroundColor: "transparent",	},	txtcityText: {
		color: "rgb(39, 39, 39)",		fontFamily: "Montserrat-Regular",		fontSize: 16,		fontStyle: "normal",		fontWeight: "normal",		textAlign: "left",		backgroundColor: "transparent",		width: 537,		marginLeft: 38,	},	txtlblstateText: {
		color: "rgb(39, 39, 39)",		fontFamily: "Montserrat-Bold",		fontSize: 16,		fontStyle: "normal",		fontWeight: "bold",		textAlign: "left",		backgroundColor: "transparent",	},	txtstateText: {
		backgroundColor: "transparent",		color: "rgb(39, 39, 39)",		fontFamily: "Montserrat-Regular",		fontSize: 16,		fontStyle: "normal",		fontWeight: "normal",		textAlign: "left",		width: 555,		marginLeft: 27,	},	txtlblzipText: {
		color: "rgb(39, 39, 39)",		fontFamily: "Montserrat-Bold",		fontSize: 16,		fontStyle: "normal",		fontWeight: "bold",		textAlign: "left",		backgroundColor: "transparent",	},	txtzipText: {
		color: "rgb(39, 39, 39)",		fontFamily: "Montserrat-Regular",		fontSize: 16,		fontStyle: "normal",		fontWeight: "normal",		textAlign: "left",		backgroundColor: "transparent",		width: 558,		marginLeft: 38,	},	txtlblssnText: {
		backgroundColor: "transparent",		color: "rgb(39, 39, 39)",		fontFamily: "Montserrat-Bold",		fontSize: 16,		fontStyle: "normal",		fontWeight: "bold",		textAlign: "left",	},	txtssnText: {
		backgroundColor: "transparent",		color: "rgb(39, 39, 39)",		fontFamily: "Montserrat-Regular",		fontSize: 16,		fontStyle: "normal",		fontWeight: "normal",		textAlign: "left",		width: 423,		marginLeft: 15,	},	txtlbldateofbText: {
		backgroundColor: "transparent",		color: "rgb(39, 39, 39)",		fontFamily: "Montserrat-Bold",		fontSize: 16,		fontStyle: "normal",		fontWeight: "bold",		textAlign: "left",	},	txtdateofbText: {
		color: "rgb(39, 39, 39)",		fontFamily: "Montserrat-Regular",		fontSize: 16,		fontStyle: "normal",		fontWeight: "normal",		textAlign: "left",		backgroundColor: "transparent",		width: 506,		marginLeft: 9,	},	txtlblcreatedText: {
		backgroundColor: "transparent",		color: "rgb(39, 39, 39)",		fontFamily: "Montserrat-Bold",		fontSize: 16,		fontStyle: "normal",		fontWeight: "bold",		textAlign: "left",	},	txtcreatedText: {
		color: "rgb(39, 39, 39)",		fontFamily: "Montserrat-Regular",		fontSize: 16,		fontStyle: "normal",		fontWeight: "normal",		textAlign: "left",		backgroundColor: "transparent",		width: 464,		marginLeft: 12,	},	txtlblaccounturlText: {
		color: "rgb(39, 39, 39)",		fontFamily: "Montserrat-Bold",		fontSize: 16,		fontStyle: "normal",		fontWeight: "bold",		textAlign: "left",		backgroundColor: "transparent",		width: 165,		marginLeft: 27,		marginTop: 9,	},	txtaccounturlText: {
		color: "rgb(39, 39, 39)",		fontFamily: "Montserrat-Regular",		fontSize: 14,		fontStyle: "normal",		fontWeight: "normal",		textAlign: "left",		backgroundColor: "transparent",		width: 698,		marginLeft: 32,		marginTop: 12,	},	viewbuttoncopyButton: {
		backgroundColor: "white",		borderRadius: 16,		shadowColor: "black",		shadowRadius: 10,		shadowOpacity: 1,		flexDirection: "row",		alignItems: "center",		justifyContent: "center",		padding: 0,		alignSelf: "flex-end",		width: 98,		height: 32,		marginRight: 51,		marginBottom: 26,	},	viewbuttoncopyButtonText: {
		color: "rgb(139, 25, 54)",		fontFamily: "Montserrat-Bold",		fontSize: 16,		fontStyle: "normal",		fontWeight: "bold",		textAlign: "left",	},	viewbuttoncopyButtonImage: {
		resizeMode: "contain",		marginRight: 10,	},	terryCooperText: {
		color: "rgb(139, 25, 54)",		fontFamily: "Montserrat-Bold",		fontSize: 24,		fontStyle: "normal",		fontWeight: "bold",		textAlign: "left",		backgroundColor: "transparent",		position: "absolute",		alignSelf: "center",		top: 91,	},})
