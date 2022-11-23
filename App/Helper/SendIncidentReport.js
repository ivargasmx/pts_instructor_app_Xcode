

import React, { useState, useEffect } from 'react';
import { Button, View, Image,TouchableOpacity,StyleSheet,Text,Alert } from 'react-native';
import { Asset } from 'expo-asset';
import * as ImageManipulator from 'expo-image-manipulator';
import ErrorHandler    from "../Helper/ErrorHandler"

export default function SendIncidentReport(params) {


  const [image, setImage] = useState(null);
  const [imageArr, setImageArr] = useState(null);

  useEffect(() => {
    (async () => {
        let index = 0;
        let pass = [];
         if(params.pictureFileArray[index]){
            const manipResizeResult = await ImageManipulator.manipulateAsync(
                params.pictureFileArray[index],                [ { resize: {width:800} }],                { compress: 0.70, format: ImageManipulator.SaveFormat.JPEG, base64:true }
            );
            pass.push(manipResizeResult.base64);
            
         } 
         index = 1; 
         if(params.pictureFileArray[index]){
            const manipResizeResult = await ImageManipulator.manipulateAsync(
                params.pictureFileArray[index],                [ { resize: {width:800} }],                { compress: 0.70, format: ImageManipulator.SaveFormat.JPEG, base64:true }
            );
            pass.push(manipResizeResult.base64);
            
         } 
         index = 2;
         if(params.pictureFileArray[index]){
            const manipResizeResult = await ImageManipulator.manipulateAsync(
                params.pictureFileArray[index],                [ { resize: {width:800} }],                { compress: 0.70, format: ImageManipulator.SaveFormat.JPEG, base64:true }
            );
            pass.push(manipResizeResult.base64);
            
         }  
        
        setImageArr(pass);
        console.log("en SendIncidentReport useEffect");
    })();
  }, []);


  const _rotate90andFlip = async () => {
    const manipResult = await ImageManipulator.manipulateAsync(
      image.localUri || image.uri,      [{ rotate: 90 }, { flip: ImageManipulator.FlipType.Vertical }],      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );
    setImage(manipResult);
  };
  
  onBtnSendPressed = () => { 
     console.log(params.pictureFileArray)
     if(imageArr) console.log(imageArr.length)
     //console.log(imageArr)
     sendReport();
  };

 const  sendReport = () => { 

    
    let dataReport = params.dataReport;
    dataReport.reportedBy.pictureArrayB64 = imageArr;


   // console.log(mapViewGoogle)

    params.btnsendPressedFunction(true); 
    var _url =  global.host + '/api/auth/incident';
    fetch(_url, { 
        method: 'POST',  
        headers: {
            'Accept': 'application/json',            'Content-Type': 'application/json', 
            "cache-control": "no-cache",            'Authorization' : global.token_type +  " " + global.access_token 
        },        body: JSON.stringify(
            dataReport
        )
        
        }).then((response) =>  response.text()) 
            .then((responseData) =>
                {
			    global.logs = ErrorHandler.setMessageResponse( "","",responseData,"response","",_url,global.id,global.name ,global.email);

                params.btnsendPressedFunction(false)
                try {

                    let responseTXT = responseData;
                   // console.log(responseData)
                    let responseJSON = JSON.parse (responseTXT); 
                
                    if(responseJSON['success'] !== undefined) {
                        
                        Alert.alert(
                            'Success !',                            'You sent Incident Report by email.',                            [
                            {text: 'OK', onPress: () =>{ 
                                console.log('OK Pressed')
                                params.successSentReport()
                            }},                            ],                            {cancelable: false},                        );
                       
                    } else{
                        console.log("ERROR");
                        if (responseJSON['message'] == "Unauthenticated."){
                        Alert.alert(
                            'Attention !',                            'Your session expired. Please login again.',                            [
                            {text: 'OK', onPress: () => console.log('OK Pressed')},                            ],                            {cancelable: false},                        );
                        
                    
                        }else{
                            console.log(responseJSON['message']);
                            Alert.alert(
                                'Error !',                                
                                responseJSON['message'],                                [
                                {text: 'OK', onPress: () => console.log('OK Pressed')},                                ],                                {cancelable: false},                            );
                        }
                    } 



                    if(responseJSON['message'] !== undefined && responseJSON['message']  === "Unauthenticated.") {
                        Alert.alert(
                            'Attention !',                            'Your session expired. Please login again.',                            [
                            {text: 'OK', onPress: () => console.log('OK Pressed')},                            ],                            {cancelable: false},                        );

                    }

                } catch (e) {
					global.logs = ErrorHandler.setMessageResponseAdd( global.logs,"","","error",e.toString(),_url,global.id,global.name ,global.email);

                    Alert.alert("Error:", "Problems connecting to the Server. Please try again later.");

                }

            });   
};

  return (
    <View  	
    style={styles.viewBootnSaveRow}>                                
            <TouchableOpacity
                onPress={onBtnSendPressed}
                style={styles.btnSaveButton}>
                <Text
                    style={styles.btnSaveButtonText}>Send </Text>
            </TouchableOpacity>      
   </View>
  );
}

const styles = StyleSheet.create({
    btnSaveButton: {
        backgroundColor: "rgb(139, 25, 54)",
        borderRadius: 16.5,        
        shadowColor: "rgba(0, 0, 0, 0.16)",        
        shadowRadius: 12,        
        shadowOpacity: 1,        
        flexDirection: "row",        
        alignItems: "center",        
        justifyContent: "center",        
        padding: 0,        
        alignSelf: "center",        
        width: 173,        
        height: 33, 
    // marginRight: 20,        
        marginTop: 19,    },    
        btnSaveButtonText: {
        color: "white",        
        fontFamily: "Montserrat-Bold",        
        fontSize: 14,        
        fontStyle: "normal",        
        fontWeight: "bold",        
        textAlign: "left",      
    },   
});