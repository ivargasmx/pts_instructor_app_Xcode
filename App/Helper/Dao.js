
import { Alert } from "react-native"
import * as SQLite from 'expo-sqlite';
import Moment from 'moment';

const db = SQLite.openDatabase('Phlebotomy.db');
var result = "OK";

const connDBHelper = {


    getSecureCode: function(){
        let prime_number = 1 ;
        while (!this.isPrime(prime_number)) {
          prime_number = Math.round(Math.random()*1000) ;
        }
       // let month_day =   Moment(Date.now()).format('MM') + Moment(Date.now()).format('DD')
       // let month_day_numeric  = parseInt(month_day )
       // let code = String((prime_number * 127) + month_day_numeric).padStart(6, "0")  ;
       // return code;

        let code = String((prime_number * 127) + 127).padStart(6, "0")  ;
        return code;
    },    isPrime: function(number)  {
        // Special Cases
        if (number == 0 || number == 1 || number == 4) return false;
        for (let x = 2; x < number / 2; x++) {
          if (number % x == 0) return false; 
        }
        return true;
      },    dropTables : function() {
		console.log("on dropTables:");  

			db.transaction(tx => {
             
                tx.executeSql(
                   ' DROP TABLE IF  EXISTS localAttendance;'
                    ); 
                tx.executeSql(
                    ' DROP TABLE IF  EXISTS login;'
                    ); 
                tx.executeSql(
                        ' DROP TABLE IF  EXISTS localShift;'
                        );  
                        
                tx.executeSql(
                    ' DROP TABLE IF  EXISTS localClocking;'
                    );                                                
			},null,null)
    },    createTables: function()  {
        console.log("on createTables:");
        
			db.transaction(tx => {

                tx.executeSql(
                    'CREATE TABLE IF NOT EXISTS "login" ( ' +
                    '	"id"	INTEGER, ' +
                    '	"email"	TEXT NOT NULL, ' +
                    '	"code"	TEXT NOT NULL, ' +
                    '	"user_id"	INTEGER DEFAULT 0, ' +
                    '	"date_login"	DATE, ' +
                    '	"date_local_login"	DATE, ' +
                    '	PRIMARY KEY("id") ' +
                    '); '
                    );   
            /*    tx.executeSql(    
                    'CREATE TABLE "config" ( ' +
                    '    "id"	INTEGER, ' +
                    '    "host"	TEXT ' +
                    '); ' 
                    );  
                    */ 
				tx.executeSql(
                    'CREATE TABLE IF NOT EXISTS "localShift" ( ' +
                    '	"id"	INTEGER, ' +
                    '	"object"	TEXT, ' +
                    '	"shift_course_date_id"	INTEGER DEFAULT 0, ' +
                    '	"shift_user_id"	INTEGER DEFAULT 0, ' +
                    '	"shift_date"	DATE, ' +
                    '	"next_course_date_id"	INTEGER DEFAULT 0, ' +
                    '	"next_user_id"	INTEGER DEFAULT 0, ' +
                    '	"next_date"	DATE, ' +
                    "	'timestamp'	DATE DEFAULT (datetime('now', 'localtime')), " +
                    '	PRIMARY KEY("id" AUTOINCREMENT) ' +
                    '); '
                    );                    
                tx.executeSql(
                    'CREATE TABLE IF NOT EXISTS "localAttendance" ( ' +
                    '	"id"	INTEGER, ' +
                    '	"object"	TEXT, ' +
                    '	"course_date_id"	INTEGER, ' +
                    '	"estatus"	INTEGER DEFAULT 0, ' +
                    '	"instructor_id"	INTEGER, ' +
                    "	'timestamp'	DATE DEFAULT (datetime('now', 'localtime')), " +
                    '	"user_id"	INTEGER, ' +
                    '	PRIMARY KEY("id" AUTOINCREMENT) ' +
                    '); '
                    );   
                tx.executeSql(
                    'CREATE TABLE IF NOT EXISTS "localClocking" ( ' +
                    '	"id"	INTEGER, ' +
                    '	"object"	TEXT, ' +
                    '	"shift_id"	INTEGER, ' +
                    '	"shift_time_id"	INTEGER, ' +
                    '	"course_date_id"	INTEGER, ' +
                    '	"estatus"	INTEGER DEFAULT 0, ' +
                    '	"valid"	INTEGER DEFAULT 1, ' +                    
                    '	"type"	INTEGER DEFAULT 1, ' +
                    '	"instructor_id"	INTEGER, ' +
                    "	'timestamp'	DATE DEFAULT (datetime('now', 'localtime')), " +
                    '	"user_id"	INTEGER, ' +
                    '	PRIMARY KEY("id" AUTOINCREMENT) ' +
                    '); '
                    );                     
                tx.executeSql(
                    'CREATE INDEX IF NOT EXISTS "user_id" ON "localAttendance" ( ' +
                    '	"user_id" ' +
                    '); ' 
                    );   
                tx.executeSql(
                    'CREATE INDEX IF NOT EXISTS "tstp_atten" ON "localAttendance" ( ' +
                    '	"timestamp"	DESC ' +
                    '); ' 
                    );      
                tx.executeSql(
                    'CREATE INDEX IF NOT EXISTS "course_date_id" ON "localAttendance" ( ' +
                    '	"course_date_id"	DESC ' +
                    '); '
                    ); 
                tx.executeSql(
                    'CREATE INDEX IF NOT EXISTS "login_user_id" ON "login" ( ' +
                    '	"user_id" ' +
                    '); '
                    ); 
                tx.executeSql(
                    'CREATE INDEX IF NOT EXISTS "date_login" ON "login" ( ' +
                    '	"date_login" ' +
                    '); '
                    );    
                tx.executeSql(
                    'CREATE INDEX IF NOT EXISTS "date_local_login" ON "login" ( ' +
                    '	"date_local_login" ' +
                    '); '
                    ); 
                tx.executeSql(
                    'CREATE INDEX IF NOT EXISTS "shift_id" ON "localClocking" ( ' +
                    '	"shift_id" ' +
                    '); '
                    );                             
                                                                                                          
        });
        
    },	onDbError : function()  {
        console.log("onDbError");
     },     onDbSuccess : function() {
         console.log("onDbSuccess");
     },  

     newItem : function()  {
		db.transaction(tx => {
		  tx.executeSql('INSERT INTO items (text, count) values (?, ?)', ['gibberish', 0],			
		  (txObj, resultSet) => this.setState({ data: this.state.data.concat(
				{ id: resultSet.insertId, text: 'gibberish', count: 0 }) }),			(txObj, error) => console.log('Error', error))
		})
	  },	saveRegister : function(table,fields,values)  {

		let query  = "insert into " + table + " ( " + fields + " ) values ( " + values +" );";
		console.log("on saveRegister");
		//console.log(query);

		db.transaction(
			tx => {
				tx.executeSql(query ,[],					this.onDbSuccess , 
					(txObj, error) => console.log('Error', error) 	
				)
			},			null,			null
		);	
    },    insertRegister : function(table,fields,values)  {
        let values_qmk = "?";
        let query = "";
       // console.log(Object.keys(values).length );
       // console.log( values );
        var element_count = 0;
        for (let i = 1; i < Object.keys(values).length; i++) {
               values_qmk = values_qmk + ",?" 
          }



        query = 'INSERT INTO ' +   table +'  (' + fields + ')  VALUES ( ' + values_qmk + ')' ;
        console.log(query);
        
        db.transaction((tx) => {
            tx.executeSql(
                query ,                values ,                (tx, results) => {
                       // console.log('Results Insert', results.rowsAffected);
                        if (results.rowsAffected > 0) {
                            console.log('Success,  insert successfully')
                        } else {
                            console.log('Insert Failed');
                        }
                }
            );
         });
    },   updateRegister : function(table,fields,values,condition)  {
    let query = "";
    //console.log("updateRegister");
    query   = 'UPDATE ' +   table +' set ' + fields + '  where  ' + condition;
    //console.log(query);
    //console.log(values);
    db.transaction((tx) => {
        tx.executeSql(
           query,           values,          (tx, results) => {
            // console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              console.log('Success,  updated successfully')
            } else {
              console.log('Updation Failed');
            }
          },          (txObj, error) => console.log('Error ::', error)
        );
      });
    },	saveLogin : function(email,code,user_id,date_login)  {
        let query = "SELECT * FROM login where user_id = ? LIMIT 1 ";
        console.log(query);
            console.log("in");
            console.log(user_id);
            db.transaction((tx) => {
              tx.executeSql(
                query,                [user_id],                (tx, results) => {
                   // console.log("Results:");    
                   // console.log(results.rows);
                    
                    var len = results.rows.length;
                    if (len > 0) {
                        let res = results.rows.item(0);
                        console.log(' user found');
                        this.updateRegister("login","email=?, code=?, date_login = ? ",[email,code,date_login,user_id]," user_id=? ") ;

                    } else {
                        console.log('No user found');
                        this.insertRegister("login","email,code,user_id,date_local_login",[email,code,user_id,date_login]);
                    }  
                }
              );
            })  
    },    saveShift : function(shift_course_date_id,shift_user_id,shift_date,next_user_id,next_course_date_id,next_date,object)  {
        let query = "SELECT * FROM localShift where shift_course_date_id = ? and shift_user_id = ? LIMIT 1 " ;
        console.log(query);
            db.transaction((tx) => {
              tx.executeSql(
                query,                [shift_course_date_id,shift_user_id],                (tx, results) => {
                    //console.log("Results:");    
                    //console.log(results.rows);
                    
                    var len = results.rows.length;
                    if (len > 0) {
                        let res = results.rows.item(0);
                        console.log(' user found');
                        this.updateRegister("localShift","shift_course_date_id=?,shift_user_id=?,shift_date=?,next_user_id=?,next_course_date_id=?,next_date=?,object=?"
                        ,[shift_course_date_id,shift_user_id,shift_date,next_user_id,next_course_date_id,next_date,object,shift_course_date_id,shift_user_id]," shift_course_date_id = ? and shift_user_id = ? ") ;

                    } else {
                        console.log('No user found');
                        this.insertRegister("localShift","shift_course_date_id,shift_user_id,shift_date,next_user_id,next_course_date_id,next_date,object"
                        ,[shift_course_date_id,shift_user_id,shift_date,next_user_id,next_course_date_id,next_date,object]);
                    }  
                }
              );
            })  
    },    saveAttendance : function(course_date_id,user_id,estatus,instructor_id,object)  {
        let query = "SELECT * FROM localAttendance where course_date_id = ? and user_id = ? LIMIT 1 " ;
        console.log(query);
        console.log("object");
        console.log(object);
              db.transaction((tx) => {
              tx.executeSql(
                query,                [course_date_id,user_id],                (tx, results) => {
                    console.log("Results:");    
                    //console.log(results.rows);
                    
                    var len = results.rows.length;
                    if (len > 0) {
                        let res = results.rows.item(0);
                        console.log(' user found');
                        this.updateRegister("localAttendance","course_date_id=?,user_id=?,estatus=?,instructor_id=?,object=?"
                        ,[course_date_id,user_id,estatus,instructor_id,object,course_date_id,user_id]," course_date_id = ? and user_id = ? ") ;

                    } else {
                        console.log('No user found');
                        this.insertRegister("localAttendance","course_date_id,user_id,estatus,instructor_id,object"
                        ,[course_date_id,user_id,estatus,instructor_id,object]);
                    }  
                }
              );
            })  
    },  
    saveClock : function(shift_id,shift_time_id,course_date_id,user_id,estatus,instructor_id,type,object)  {
        let query = "SELECT * FROM localClocking where shift_id = ?  and user_id = ? and type = ?  order by id desc LIMIT 1" ;
        console.log(query);
            let parameters = [shift_id,user_id,type];
           // console.log(parameters);
            
            db.transaction((tx) => {
              tx.executeSql(
                query,                parameters,                (tx, results) => {
                   // console.log("Results:");    
                   // console.log(results.rows);
                    
                    var len = results.rows.length;
                    if (len > 0) {
                        let res = results.rows.item(0);
                        console.log(' user found');
                        parameters = [shift_id,shift_time_id,course_date_id,user_id,estatus,instructor_id,type,object,shift_id ,user_id,type];
                        //console.log(parameters);
                        this.updateRegister("localClocking","shift_id=?,shift_time_id=?,course_date_id=?,user_id=?,estatus=?,instructor_id=?,type=?,object=?"
                        ,parameters,                        " shift_id = ? and user_id = ? and type = ?") ;

                    } else {
                        console.log('No user found');
                        this.insertRegister("localClocking","shift_id,shift_time_id,course_date_id,user_id,estatus,instructor_id,type,object"
                        ,[shift_id,shift_time_id,course_date_id,user_id,estatus,instructor_id,type,object]);
                    }  
                }
              );
            })  
    },   
    localLogin : function(email,password,response)  {
        let query = "SELECT * FROM login where email = ? LIMIT 1 " ;
        console.log(query);
        console.log(email);
        console.log(password);  
            db.transaction((tx) => {
              tx.executeSql(
                query,                [email],                (tx, results) => {
                    console.log("Results:");    
                    //console.log(results.rows);
                    
                    var len = results.rows.length;
                    if (len > 0) {
                        let res = results.rows.item(0);
                        console.log(' user found');
                        //console.log(res.code);
                        if(res.code === password){
                            console.log(' user authenticated');
                            global.email = email.trim();
                            global.user_id = res.user_id;
                            this.setLocalLoginOk(res.user_id) ;
                            response.setState( {authenticated: 1});

                           // this.getShift(global.user_id,Date.now(),response);
                           // console.log("@@@@@@@@@@@");
                           // console.log(response.state.localShifts);
                           let next_date =Moment(Date.now()).format('Y-MM-DD') ;
                           //console.log(next_date);
                           let query = "SELECT * FROM localShift WHERE next_user_id=? and strftime('%Y-%m-%d',next_date)  =?   LIMIT 1;"
                           console.log(query);
                           let parametros = [user_id,next_date];
                           //console.log(parametros);
                           db.transaction(
                               tx => {
                                   tx.executeSql(query,parametros , 
                                      (txObj, { rows: { _array } }) => {
                                      // console.log("################################");   
                                      // console.log("SELECT localShift Success");
                                      // console.log(_array);
                                          response.setState({localShifts:_array[0]}) ;
                                          response.onLoginSuccess(_array[0]); 
                   
                                       },                                    (txObj, error ) => console.log('Error ', error)
                                   )
                               },                               null,                               null
                           );  
                            
                        }else {
                            console.log(' user No authenticated');
                            response.setState( {authenticated: 0});
                            
                            Alert.alert("Authentication failed "," Incorrect email or password" , [{
                                text: "Cancel",                                style: "cancel",                                onPress: () => {
                                    }, 
                                    }, {
                                        text: "OK",                                        onPress: () => {
                                        },                             }]);                               
                        }
                    } else {
                        console.log('No user found');
                        Alert.alert("Authentication failed "," Incorrect email or password" , [{
                            text: "Cancel",                            style: "cancel",                            onPress: () => {
                                },                                }, {
                                    text: "OK",                                    onPress: () => {
                                    },                         }]);  
                    }  
                }
              );
            })  
            
    },    
    setClockInOk : function(course_date_id,user_id,shift_time_id)  {
        this.updateRegister("localClocking","estatus=? ,shift_time_id=?,valid=?"
        ,[1,shift_time_id,1,course_date_id,user_id,1]," course_date_id = ? and user_id = ? and type = ?") ;
    }, 
    setClockInOff : function(course_date_id,user_id,shift_time_id)  {
        console.log("setClockInOff");
        this.updateRegister("localClocking","estatus=? ,shift_time_id=?,valid=?"
        ,[0,shift_time_id,0,course_date_id,user_id,1]," course_date_id = ? and user_id = ? and type = ?") ;
    },     
    setClockLunchOk : function(course_date_id,user_id)  {
        this.updateRegister("localClocking","estatus=?,shift_id=?"
        ,[1,shift_time_id,course_date_id,user_id,2]," course_date_id = ? and user_id = ? and type = ?") ;
    }, 
    setClockOutOk : function(course_date_id,user_id)  {
        this.updateRegister("localClocking","estatus=?,shift_id=?"
        ,[1,shift_time_id,course_date_id,user_id,3]," course_date_id = ? and user_id = ? and type = ?") ;
    },   
    setAttendanceOk : function(course_date_id,user_id)  {
        this.updateRegister("localAttendance","estatus=?"
        ,[1,course_date_id,user_id]," course_date_id = ? and user_id = ? ") ;
    }, 
    setLocalLoginOk : function(user_id)  {
        this.updateRegister("login","date_local_login=?"
        ,[Moment(Date.now()).format('Y-MM-DD HH:MM')   ,user_id]," user_id = ?  ") ;
    },   
    
    getShift : function (user_id,date,context){
        //console.log(date);
        
        let next_date =Moment(date).format('Y-MM-DD') ;

        let query = "SELECT * FROM localShift WHERE next_user_id=? and strftime('%Y-%m-%d',next_date)  =?   LIMIT 1;"

		db.transaction(
			tx => {
				tx.executeSql(query, [user_id,next_date], 
				   (txObj, { rows: { _array } }) => {
                   // console.log("################################");   
                   // console.log("SELECT localShift Success");
                   // console.log(_array[0]);
                       context.setState({localShifts:_array[0]}) ;

                    },                 (txObj, error ) => console.log('Error ', error)
                )
			},			null,			null
		); 
    },    
    getLocalClockIn : function (shift_id,user_id,context){  
        
        let query = "SELECT * FROM localClocking where shift_id = ?  and user_id = ? and type = 1  order by id desc LIMIT 1" ;
        console.log(query);
        let parameters = [shift_id,user_id];
        //console.log(parameters);
		db.transaction(
			tx => {
				tx.executeSql(query, parameters, 
				   (txObj, { rows: { _array } }) => {
    //console.log(_array);
                        if(_array !== undefined && _array !== [] && _array.length !== 0){
                            global.shift_time_id = _array[0].shift_time_id;
                            context.setState({localClockIn:_array[0]}) ;
                            console.log(global.shift_time_id );
                        }


                    },                 (txObj, error ) => console.log('Error ', error)
                )
			},			null,			null
        ); 
       
    },   
    getLocalClockInIni : function (course_date_id,user_id,context){  
        
        let query = "SELECT * FROM localClocking where course_date_id = ?  and user_id = ? and type = 1  order by id desc LIMIT 1" ;
        console.log(query);
        let parameters = [course_date_id,user_id];
        console.log("parameters:::");
        console.log(parameters);
		db.transaction(
			tx => {
				tx.executeSql(query, parameters, 
				   (txObj, { rows: { _array } }) => {
    console.log("resultado:") ;                  
    console.log(_array);
                        if(_array !== undefined && _array !== [] && _array.length !== 0){
                            console.log("_array !== undefined");
                            console.log(_array[0].valid);
                            global.shift_time_id = _array[0].shift_time_id;

                            global.clock  = _array[0].valid;
                          
                                 
                            context.setState({localClockIn:_array[0]}) ;
                            console.log(global.shift_time_id );
                        }else{
                            console.log("_array == undefined");
                            global.shift_time_id = 0;
                            global.clock  = 0;
                        }
                       context.setColorClockIn();

                    },                 (txObj, error ) => console.log('Error ', error)
                )
			},			null,			null
        ); 
       
	},       
	getRecord : function (query){
        console.log("on getRecord");
		/*
		db.transaction(
			tx => {
				tx.executeSql(query, [], 
				   (txObj, { rows: { _array } }) => this.setState({_rowResult:_array}) ,                 (txObj, error ) => console.log('Error ', error)
                )
			},			null,			null
		); */
		
		db.transaction(
			tx => {
				tx.executeSql(query, [], (_, { rows }) =>
                 console.log(JSON.stringify(rows))
                );
			}
		);
		
	}, 



	getDBAtendance : function (instructor_id,course_date_id,context)  {
		return new Promise(function(resolve, reject) {
                console.log("on getLocalAtendance");
                console.log("on instructor_id " + instructor_id);
                console.log("on course_date_id " +course_date_id);
                
                let query = "Select * from  localAttendance where instructor_id = ? and course_date_id =  ?  order by  timestamp desc LIMIT 1 ";

                console.log("*** db.transaction");		

                db.transaction(
                    tx => {
                        tx.executeSql(query, [instructor_id,course_date_id], 
                        (txObj, { rows: { _array } }) => { 
                            // console.log("---- Array");
                            //console.log(_array);
                            resolve(_array) ; 
                            },                        (txObj, error) => console.log('Error ::', error)
                        )
                    },                    null,                    null
                );	
            })	
     }	 

          
}
export default connDBHelper;