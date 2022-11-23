import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View ,TouchableOpacity,Image} from 'react-native'

export default function SubmitErrorButton(props) {
    return (
        <TouchableOpacity
    	    onPress={ () =>{
                props.callbackFunction(props.nav);
              }   
            }
            style={styles.btnbackButton}>
         <Image
			source={require("./../../assets/images/alert3.png")}
			style={styles.imgAlertImage}/> 
        </TouchableOpacity>


    )
}

const styles = StyleSheet.create({
    imgAlertImage: {
		resizeMode: "contain",		backgroundColor: "transparent",		width: 39,	},})
