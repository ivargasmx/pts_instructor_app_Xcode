

  import React, { useState, useEffect } from "react";
  import { StyleSheet, Text, View } from "react-native";
  import Toast from 'react-native-tiny-toast';

  let timerO
  const App = () => {     
    const [counter, setCounter] = useState(0);
    const [monitor, setMonitor] = useState("");
  
    const fetch_alive = async () => {
      let url_ = global.host + '/api/auth/assignments?start_date='+global.current_week_start+'&end_date='+global.current_week_end;
      console.log("Week:::",url_);
      
     
        fetch(url_, {
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
               let instructor;
               let shifts;
               let meta;
               let shift_count =0;

              if(responseJSON['success'] !== undefined) {
                //console.log(responseJSON)
                instructor = responseJSON.instructor;
                shifts = responseJSON['shifts'];
                meta = responseJSON['meta'];

                shift_count = Object.keys(shifts).length;
                if(responseJSON['success'] === true){     

                  console.log("Connected YET!")
                  setMonitor("↑")
                }
  
              }else{
                if(responseJSON['exception'] !== undefined) {
                  console.log("Disconnect!")
                  setMonitor("φ")
                  return;	
                  }
                 
                }
  

               if(responseJSON['message'] !== undefined && responseJSON['message']  === "Unauthenticated.") {
        
                 // 'Attention !',
                 // 'Your session expired. Please login again.',

                 console.log("Disconnect!")
                 setMonitor("φ")
                // this.onLoginfailure();
               }
  
             } catch (e) {
               console.log(e);
               console.log("Disconnect!")
               setMonitor("φ")
               //   authenticated :0
               
              //"Error:", "Problems connecting to the Server. Please try again later.");
              
  
             }
  
          }).catch((error) => {
            console.log(error);	 
            console.error(error);
            console.log("Disconnect!")
            setMonitor("φ")

          });
    }


    useEffect(() => {
      
       timerO = setInterval(() => {
          
          setCounter(prevCount => prevCount + 1);
          global.time_out_counter = counter

          }, 1000);	
    }, []);
  

    //console.log(counter, ", global.user_session_timer_ocurre " , global.user_session_timer_ocurre)
    if (counter == global.user_session_timer_ocurre) {
      // clearInterval(timerO);
      setCounter(0);
      console.log('Time out finish');
      fetch_alive()
      //global.logs = global.logs  + " Location Time Out : " + global.time_out_counter + " sec. \n"
    }
    /*
    let par = counter;
    if(par % 2 == 0){
      setMonitor("«")
    }else{
      setMonitor("")
    }
    */
    if(counter < 5)
        return(
          <View> 
             <Text style={styles.tab2FourButtonText}>{monitor}</Text>
          </View>
    
        );

    if (counter % 2 == 0 ){
      return(
        <View> 
           <Text style={styles.tab2FourButtonText}>«</Text>
        </View>
  
       );
  
    } else{
      return(
        <View> 
           <Text style={styles.tab2FourButtonText}></Text>
        </View>
  
       );
    }


  };
  
  const styles = StyleSheet.create({
  tab2FourButtonText: {
    position:"absolute",
		color: "rgb(153, 153, 153)",
		fontFamily: "SFProText-Regular",
		fontSize: 8,
		fontStyle: "normal",
		fontWeight: "normal",
		textAlign: "left",
    right:4,
    top: 18,
	},
  });

  export default App;

