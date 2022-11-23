
import React from "react"
import {  Text, TextInput, TouchableOpacity, View,StyleSheet
	,Animated } from "react-native"
import Modal, { SlideAnimation, ModalContent } from 'react-native-modals'
import { Button } from 'react-native'




export default class Menu extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
      fontsReady: false,      visible: false,		}
	}

	componentDidMount() {

	}



	render() {
	

        return  <View style={styles.container}>
      <Button
        title="Show Modal"
        onPress={() => {
          this.setState({ visible: true });
        }}
      />
      <Modal
        visible={this.state.visible}
        onTouchOutside={() => {
          this.setState({ visible: false });
        }}
      >
        <ModalContent>
        <View style={styles.modalView}>
              <Text>Hola</Text>
            </View>
        </ModalContent>
      </Modal>
    </View>
  }
  
}

const styles = StyleSheet.create({
  conteiner:{
		marginLeft: -680,		width: 750,  },  modalView: {
		margin: 20,		backgroundColor: "white",		borderRadius: 20,		padding: 35,		alignItems: "center",		shadowColor: "#000",		shadowOffset: {
		  width: 0,		  height: 2
		},		shadowOpacity: 0.25,		shadowRadius: 3.84,		elevation: 5
	  },}
);  