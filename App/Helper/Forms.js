import React from "react"
import {  Alert} from "react-native"

const formHelper = {

    
    mandatoryValidator : function(fields) {
        
       let response = true; 
 
       console.log(fields);
       fields.map((field,i) => {
            if(! field.value && response){
                response = false;
                Alert.alert("Mandatory value "," The '" + field.name +"' field cannot be empty." , [
                       {
                            text: "OK",                            onPress: () => {
                            },                 }]);  

                 
                 return response;
            }

       });
       return response; 
    },    functions : function(fields) { 

    }
}
export default formHelper;