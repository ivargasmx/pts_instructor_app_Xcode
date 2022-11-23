import Moment from 'moment';
import base64 from 'react-native-base64';

var utf8 = require('utf8');


const ErrorHandler = {
    setMessageResponse  : function( current_message,request,response,type="error",errorMsg="", url="",user_id = "",user_name = "",user_email="")  {
      let JSONResult;
     
      JSONResult = this.buildJSON( request,response,type,errorMsg, url,user_id ,user_name ,user_email);
     
      return JSON.stringify(JSONResult )
    },    setMessageResponseAdd : function(current_message,request,response,type="error",errorMsg="",url="",user_id="",user_name = "",user_email="" )  {
        let JSONResult;
       
        JSONResult = this.buildJSON( request,response,type, errorMsg,url,user_id ,user_name ,user_email);
        
        return current_message + "," +JSON.stringify(JSONResult )

    },    setMessageResponseEnc64  : function( current_message,request,response,type="error",errorMsg="", url="",user_id = "",user_name = "",user_email="")  {
      let JSONResult;
     
      JSONResult = this.buildJSONEnc64( request,response,type,errorMsg, url,user_id ,user_name ,user_email);
     
      return JSONResult 
    },    setMessageResponseAdd : function(current_message,request,response,type="error",errorMsg="",url="",user_id="",user_name = "",user_email="" )  {
        let JSONResult;
       
        JSONResult = this.buildJSON( request,response,type, errorMsg,url,user_id ,user_name ,user_email);
        
        return current_message + "," +JSON.stringify(JSONResult )

    },    buildJSON( request,response,type,errorMsg, url,user_id ,user_name ,user_email){
       let JSON_mess ="";
       let objResp ;
        //var bytes = utf8.encode(response);
        var bytes = response;
        // var encoded =  base64.encode(bytes);
        var encoded =  bytes;

       
       objResp = { 
         date:Moment(Date.now()).format('MMM DD YYYY hh:mm a'),  
         request :request ,response:encoded,type:type, errorMsg:errorMsg,url:url ,user_id:user_id,user_name:user_name ,user_email:user_email
       };
      
       return objResp;
    },    buildJSONEnc64( request,response,type,errorMsg, url,user_id ,user_name ,user_email){
      let JSON_mess ="";
      let objResp ;
       var bytes = utf8.encode(response);
      //var bytes = response;
       var encoded =  base64.encode(bytes);
       
      
      objResp = { 
        date:Moment(Date.now()).format('MMM DD YYYY hh:mm a'),  
        request :request ,response:encoded,type:type, errorMsg:errorMsg,url:url ,user_id:user_id,user_name:user_name ,user_email:user_email
      };
     
      return objResp;
   }
}

export default ErrorHandler;