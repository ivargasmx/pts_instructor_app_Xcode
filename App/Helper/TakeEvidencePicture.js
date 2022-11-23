
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View,Dimensions } from "react-native"

import * as ImagePicker from 'expo-image-picker';


import Camera   from "./Evidence";

export default class TakeEvidencePicture extends React.Component {




	static navigationOptions = ({ navigation }) => {
	  
		const { params = {} } = navigation.state
		return {
				header: null,				headerLeft: null,                headerRight: null,			}
	}

	constructor(props) {
		super(props);
        this.state = {
            picturePath:"",            mode : "take",          }
        }

    async componentDidMount() {
	
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

    if (this.state.mode == "take") {
       return( <Camera 
        parentWindow = {this}
       />)
   } // take   
  return (
    <View>
    </View>
  )
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,    backgroundColor: '#fff',    alignItems: 'center',    justifyContent: 'center',  },  logo: {
    width: 305,    height: 159,    marginBottom: 20,  },  instructions: {
    color: '#888',    fontSize: 18,    marginHorizontal: 15,    marginBottom: 10,  },  button: {
    backgroundColor: 'blue',    padding: 20,    borderRadius: 5,  },  buttonText: {
    fontSize: 20,    color: '#fff',  },  thumbnail: {
    width: 300,    height: 300,    resizeMode: 'contain',  },});