// Menu options
function onOpen() 
{
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = 
  [
    {
    name : 'Pull Google Devices',
    functionName : 'downloadGoogleDevices'
  },
  {
    name : 'Clean data',
    functionName : 'run_main_mover'
  },
    {
    name : 'Push to Google',
    functionName : 'createGoogleDevices_Go'
  },
  {
    name : 'Make Sheets',
    functionName : 'make_sheets'
  },
];
  sheet.addMenu('Script', entries);
}


/**
 * Project properties are used so safely store and operate on tokens, secrets and other data you don't want to put in code.
 * At the moment of wrinting this you have to go to legacy editor to manually insert data into them
 * File > Project Properties > Script Properties
 * eg. Property = Client_ID & Value = your ID
 * NOTE : everyone who has access to sheet can see and edit those.
 *  
 * */ 

var scriptProperties = PropertiesService.getScriptProperties()
    private_key= scriptProperties.getProperty('private_key').replace(/\\n/g, '\n')  // Key you get in JSON is JSON encoded, with this you won't have to clean it.
    client_email = scriptProperties.getProperty("client_email")
    mosyleToken = scriptProperties.getProperty("mosyleToken")
    mosyleUser = scriptProperties.getProperty("mosyleUser")     // Mosyle email
    mosylePass = scriptProperties.getProperty("mosylePass")     // Mosyle password
    ;


/** This is what you use to run full automation via triggers. */
function run_everything() {
  downloadGoogleDevices();
  downloadMosyleDevices();
  run_main_mover();  //  Clean, compare and assamble data
  createGoogleDevices();
};
