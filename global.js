
// BORRAR
//global.next_shift
global.simulator = false;
//global.host  = "https://admin.phlebs.com"; //**** Staging
global.host  =  "https://admin.phlebotomyusa.com"; //**** Prod
//global.host  = "http://192.168.0.7";   
global.debug = true;  
global.nologin = 0;  // Login = 1 , no Login = 0 , Constant  *** Prod 0
global.iduser = '';
global.id = 0; 
global.access_token = '';   
global.token_type = ''; 
global.expires_at = "";
global.screen =""
global.email = "vanslyke_erin@yahoo.com" ; // "vanslyke_erin@yahoo.com";//"rebaarriola@gmail.com";//"ellaed22@icloud.com"; //"jessie_hines@outlook.com"; //"hoffmanjennifera@hotmail.com";//"JencollinsPTS@gmail.com";//"calvillog50@yahoo.com";// "MissStephanieBowers@gmail.com";//"ellaed22@icloud.com";//hristy@phlebotomyusa.com";//"kazzybradshaw@gmail.com";//"lipke.p@yahoo.com";//"by3vtec@icloud.com";//"ellaed22@icloud.com"; //"hoffmanjennifera@hotmail.com";// "josetta.celestine001@mymdc.net";//"cwilki43@gmail.com" ,//"jessie_hines@outlook.com" ,//"hoffmanjennifera@hotmail.com",//"jon.valenti@yahoo.com"//"cgonzalez1146@yahoo.com";// "christy@phlebotomyusa.com" ;  //"kmichellesidhu@outlook.com"; //"rebecca@bundy6pak.com" ;"jon.valenti@yahoo.com"; //"christy@phlebotomyusa.com";
global.password ="phle123"; 

global.connection = 1;  // Result of Validate Internet connecton , Variable  // Production  = 1

global.msgNoConnection = " You do not have an internet connection, you will work offline! ";
global.logs = "";
global.login_session = false
global.login_session_user_confirm = false

global.debug_msg = false


global.injured_report_data = null;
global.specifications_locations = null;
global.time_out = 20;
global.time_out_logout_no_clockIn =  120 * 60  * 1000; // 120 min
global.time_out_counter = 0;
global.default_location = {latitude : 56.820189, longitude : -106.069600};
global.location = null ;  
global.location_now = { latitude:0 , longitude:0 } ;
// Timer Session
global.user_session_timer_ocurre = 60 * 1 //   


//global.arrImages64 = null;
global.connectionTest = 1 ;  // Connection to Internet, constant 1= connected , 0=disconnecte // Production = 1

global.googleMapsKeyAPI = "AIzaSyCSqDyiNE1zdMm_jvdhGYsBRoP6reH5r-Q";
global.shift_time_id = 0; 
global.clock = 0;
global.clockTime = null;
global.shift_type = 1;

global.instructor_id = 0;
global.inventory_check = 0;
global.shift_id = 0;

global.local = true ; // 
global.name = "";
global.phone = ""; 
global.address = "";
global.city = "";
global.city_id = 0;
global.mem_sicity_id = 0;
global.state = "";
global.net_state = null;
global.zip = "";
global.notes = "";
global.created_at = "";
global.updated_at = "";
global.user_id = 0;
global.deleted_at = "";
global.disabled_at = "";
global.assigned_states = "";
global.available_schedule = "";
global.haspin = false;

global.start_time = "";
global.end_time = "";

global.today = "";
global.todayText = "";
global.todayFormat = "";

global.todayDate = Date.now() ;
global.todayLocalDate = Date.now() ;
global.todayMonth = 1;
global.todayYear = 1;
global.todayDay = 1;

global.firstDayOfWeek  = 1; // Monday
global.current_month_start_day = 1;

global.current_month_end_number = 31;

global.leapYear = false;


global.current_month_end = "";
global.current_month_start = "";
global.current_week_end = "";
global.current_week_start = "";
global.previous_week_start = "";
global.previous_week_end = "";
global.next_week_start = "";
global.next_week_end = "";
global.previous_month_start = "";
global.previous_month_end = "";
global.next_month_start = "";
global.next_month_end = "";

global.current_month_end_orig = "";
global.current_month_start_orig = "";
global.current_week_end_orig = "";
global.current_week_start_orig = "";
global.distanceOut = 100; //200;
global.timerTakePictureTime = (40) * 60 * 1000; // (minutes)
//global.timerTakePictureTime = (25) * 1000; // (sec)
global.timerTakePicture = 0;
global.push_notification_key = "";
global.device_id = "" ;
global.data_from_notif = "";
global.send_device_id = 1;
global.timeOutCodeView = 60 * 10 + 0; // 10 min

//(910) 390-6661
global.sms_number_staging = "(910) 390-6661";
global.getway_sms_number_staging = "+19103906661";
global.sms_number_production = "(385) 354-7454";
global.getway_sms_number_production = "+13853547454";

global.take_picture =false;
global.shifttype = "real";
global.applyFraction = false;
global.shift_found = false;
global.required_clockout_pictures = false;
global.required_clockin_pictures = false;
global.require_inventory_confirm = false;
