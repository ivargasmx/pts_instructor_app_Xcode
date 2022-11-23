import {  Alert,StyleSheet,TouchableHighlight,TouchableOpacity } from "react-native"
import Moment from 'moment';

const authHelper = {
////////////////////////////////
logOut : function (host,token) {
////////////////////////////////   
      console.log("... En Logout");


      if(token === "") return;
      fetch(host + '/api/auth/logout', {
         method: 'GET',         headers: {
            'Accept': 'application/json',            
            'Content-Type': 'application/json', 
            "cache-control": "no-cache",            
            'Authorization' : "Bearer " + token
            
         },         
         body:""
         
        }).then((response) =>  response.text()) //response.json())
            .then((responseData) =>
             {
               try {
                  var responseTXT = responseData; 
                  var responseJSON = JSON.parse (responseTXT);
                   // Reset Globals Name, Pincode

                     global.access_token = '';  
                     global.id = 0; 
                     global.email = "";
                     global.token_type= "";
                     global.access_token = "";
                     global.password="";
                     global.nologin = 0;
                     global.haspin = false;
                     global.user_id = 0;
                     global.shift_found = false;
                     global.name = "";
                     global.clock = 0;
                     global.log = "";


                     if(responseJSON['access_token'] !== undefined) 
                     {
                 

                     }
                     else{

                        if(responseJSON['data'] === 'noactivo'){
                          // Alert.alert( 'Attention !', responseJSON['message']);
                           
                           console.log(responseJSON['message']);
                           return;
                        }
                    /*
                        Alert.alert("Authentication failed "," Incorrect email or password", [{
                        text: "Cancel",                        style: "cancel",                        onPress: () => {
                           },                           }, {
                              text: "OK",                              onPress: () => {
                              
                              },                           }]);
                           */
                     }

               } catch (e) {
                  console.log(e);
                   console.log("Error:, Problems connecting to the Server.");
                  //Alert.alert("Error:", "Problems connecting to the Server.");

               }  
            }).catch((error) => {
              console.log(error);	 
              console.error(error);

            });

     },  
    ///////////////////////////////// 
    recoverLoginSession : function () {
    /////////////////////////////////
    let body_data = JSON.stringify({
      email: global.email,
      password: "Instruct0r" +  Moment(global.today).format('YYMMDD') 
     })
     console.log(body_data)
     
    let _url = global.host + '/api/auth/login';
    fetch(_url,{
       method: 'POST',
       headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json', 
          "cache-control": "no-cache"
          
       },
       body: body_data
       
      }).then((response) =>  response.text()) //response.json())
       .then((responseData) =>
           {
              console.log("RecoverLogin responseData:")
              // global.logs = ErrorHandler.setMessageResponse( "",body_data,responseData,"response","",_url,global.id,global.name ,global.email);
             
             
             try {
                var responseTXT = responseData;
                var responseJSON = JSON.parse (responseTXT);
    
                
 
                   if(responseJSON['access_token'] !== undefined) 
                   {


                      global.access_token = responseJSON['access_token'];
                      global.token_type = responseJSON['token_type'];
                      global.expires_at = responseJSON['expires_at'];
                     console.log("ReLogin Success!")                      
                    
                   }else{
                     console.log("error:" ,responseJSON['message'])
                     
                            
                   }
             } catch (e) {
                console.log(e);


             }  
          }).catch((error) => {
             
            //dispatch(error('There was a problem with the request.'));
            console.log(error);	 
            console.error(error);

          });

     }, 
    //////////////////////////////////// 
    checkSessionAlive : function (nav) {
    ////////////////////////////////////  
      const { navigate } = nav
      console.log( "checkSessionAlive");
      
      fetch(global.host + '/api/auth/assignments?start_date='+global.current_week_start+'&end_date='+global.current_week_end, {
			method: 'GET',			
         headers: {
			   'Accept': 'application/json',			   
            'Content-Type': 'application/json', 
			   "cache-control": "no-cache",			   
            'Authorization' : global.token_type +  " " + global.access_token
			}
		   
		  }).then((response) =>  response.text()) 
				.then((responseData) =>
				 {
				   try {
					
					   let responseTXT = responseData;
					   let responseJSON = JSON.parse (responseTXT); 
					   //console.log(responseData);

					   if(responseJSON['message'] !== undefined && responseJSON['message']  === "Unauthenticated.") {
							Alert.alert(
								'Attention !',								
                        'Your session expired. Please login again.',								
                        [
								{text: 'OK', onPress: () => console.log('OK Pressed')},								
                     ],								
                     {cancelable: false},							
                     );

							 navigate("Login");
					   }

				   } catch (e) {
					   console.log(e);

					   //Alert.alert("Error:", "Problems connecting to the Server. Please try again later.");

				   }

				}).catch((error) => {
				  console.log(error);	 
				  console.error(error);
				});
   },   
   ////////////////////////////
   HelloTester : function () {
   ///////////////////////////   
      console.log( "HelloTester")
   }
};

const styles = StyleSheet.create({
      viewModalConten: {
         backgroundColor: "transparent",
         alignItems: "center",
         width: 520,
         zIndex: 1, 
      height: 250,
         
      },
      ClockInLocationText: {
         backgroundColor: "transparent",
         height: 42,
         alignItems: "center",
         
      },
      viewPopUpLineView: {
         backgroundColor: "rgb(184, 184, 184)",
         flex: 1,
         height: 1,
         marginTop: 25,
         width: 660,
         position: "absolute",	
      },  
      txtPopUpClockInText: {
         backgroundColor: "transparent",
         color: "#8B1936",
         fontFamily: "Montserrat-Bold",
         fontSize: 20,
         fontStyle: "normal",
         fontWeight: "bold",
         textAlign: "center",
         marginBottom: 23,
      },  
      locationButton: {
         backgroundColor: "gray",
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
      imgIconCamera: {
         resizeMode: "contain",
         backgroundColor: "transparent",
         width: 26,
         height: 26,
         //marginTop: 9,
         right:8,
      },
      textStyleClose: {
         color: "white",
         fontWeight: "bold",
         textAlign: "center"
      },
      closeButton: {
         top:30,
         backgroundColor: "#F194FF",
         borderRadius: 10,
         padding: 10,
         elevation: 2,
         width: 170,
         shadowColor: "#000",
         shadowOffset: {
         width: 0,
         height: 2
         },
      },
});
export default authHelper;