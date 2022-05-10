/**************************************************************
This code is used to move data around so that payload in deviceCreateGoogle_A is only devices that are missing, saves on processing time later on.
It's done in multiple passes that load data from all possible sources and then compare them with what data is already in the system.
deviceType has to be one of: https://cloud.google.com/identity/docs/reference/rest/v1/devices#DeviceType
*/

/** Load devices from manual import sheet */
function load_manualSource() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var manual_import = SpreadsheetApp.setActiveSheet(ss.getSheetByName("manual_import"));

  var column = manual_import.getRange('A1:A').getValues();
  var lastRow = column.filter(String).length;
  var sourceManual = manual_import.getRange(2, 1, lastRow, 5).getValues();  // start row, start column, number of rows, number of columns
  // console.log(sourceManual)
  return sourceManual
};

/** Load devices you already have from devicePullGoogle_A */
function load_current() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var devicePullGoogle_A = SpreadsheetApp.setActiveSheet(ss.getSheetByName("devicePullGoogle_A"));

  var column = devicePullGoogle_A.getRange('A1:A').getValues();
  var lastRow = column.filter(String).length;
  var current = devicePullGoogle_A.getRange(2, 1, lastRow, 4).getValues();  // start row, start column, number of rows, number of columns
  // console.log(current)
  return current
};

/** Load devices from Mosyle automated import */
function load_Mosyle() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var devicePullMosyle_A = SpreadsheetApp.setActiveSheet(ss.getSheetByName("devicePullMosyle_A"));

  var column = devicePullMosyle_A.getRange('A1:A').getValues();
  var lastRow = column.filter(String).length;
  var mosyle = devicePullMosyle_A.getRange(2, 1, lastRow, 3).getValues();  // start row, start column, number of rows, number of columns
  // console.log(current)
  return mosyle
};

/** Load devices from SnipeIT automated import */
function load_SnipeIT() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var devicePullSnipeIT_A = SpreadsheetApp.setActiveSheet(ss.getSheetByName("devicePullSnipeIT_A"));

  var column = devicePullSnipeIT_A.getRange('A1:A').getValues();
  var lastRow = column.filter(String).length;
  var snipeIT = devicePullSnipeIT_A.getRange(2, 1, lastRow, 4).getValues();  // start row, start column, number of rows, number of columns
  // console.log(current)
  return snipeIT
};


/** 
Start comparing different sources with what you already have
Compare manual to current
*/
function make_newArrayFromManual(sourceManual, current) {
  const currentArray = load_current()
  const manualArray = load_manualSource()
  var newArrayManual = []

  // console.log('currentArray')
  // console.log(currentArray)
  // console.log('manualArray')
  // console.log(manualArray)

  for (const mRow of manualArray) {
    if (mRow[4] === true)   // This will forcefully copy marked rows from new_devices into deviceCreateGoogle_A
    {
      newArrayManual.push(
        {
          "serialNumber": mRow[0],
          "assetTag": mRow[1],
          "deviceType": mRow[2],
        }
      )
    } else {
      var count = 0
      for (const cRow of currentArray) {
        // console.log(mRow[0] + ' vs ' + cRow[0])
        if (mRow[0] === cRow[0] && cRow[3] === 'COMPANY')  // Verify if it's already visible in google
        { count++ }
      }
      if (count == 0) {
        newArrayManual.push(
          {
            "serialNumber": mRow[0],
            "assetTag": mRow[1],
            "deviceType": mRow[2],
          }
        )
      };
    }
  }

  // console.log(newArray)
  return newArrayManual
};

/** Compare Mosyle to current */
function make_newArrayFromMosyle(mosyle, current) {
  const currentArray = load_current()
  const mosyleArray = load_Mosyle()
  var newArrayMosyle = []

  // console.log('currentArray')
  // console.log(currentArray)
  // console.log('mosyleArray')
  // console.log(mosyleArray)

  for (const mRow of mosyleArray) {
    if (mRow[6] === true)   // Check for Forced_Sync
    {
      console.log(mRow[6])
      newArrayMosyle.push(
        {
          "serialNumber": mRow[0],
          "assetTag": mRow[1],
          "deviceType": 'MAC_OS',
        }
      )
    } else {
      var count = 0
      for (const cRow of currentArray) {
        // console.log(mRow[0] + ' vs ' + cRow[0])
        // console.log(cRow[3])
        if (mRow[0] === cRow[0] && cRow[3] === 'COMPANY')  // Verify if it's already visible in google
        { count++ }
      }
      if (count == 0) {
        newArrayMosyle.push(
          {
            "serialNumber": mRow[0],
            "assetTag": mRow[1],
            "deviceType": 'MAC_OS',
          }
        )
      };
    }
  }

  // console.log(newArrayMosyle)
  return newArrayMosyle
};

/** Compare SnipeIT to current */
function make_newArraySnipeIT(snipeIT, current) {
  const currentArray = load_current()
  const snipeITArray = load_SnipeIT()
  var newArraySnipeIT = []

  // console.log('currentArray')
  // console.log(currentArray)
  // console.log('snipeITArray')
  // console.log(snipeITArray)

  for (const sRow of snipeITArray) {
      var count = 0
      for (const cRow of currentArray) {
        // console.log(sRow[0] + ' vs ' + cRow[0])
        // console.log(cRow[3])
        if (sRow[0] === cRow[0] && cRow[3] === 'COMPANY' || sRow[0] == "")  // Verify if it's already visible in google and not empty
        { count++ }
      }
      if (count == 0) {
// This logic reads category and assigns correct device type as required by Google. This will have to fit your own naming framework
        var newDeviceType;
        if (sRow[3] == "Laptop/ChromeOS") {newDeviceType = "CHROME_OS"} 
        else if (sRow[3] == "Laptop/MacOS") {newDeviceType = "MAC_OS"}
        else if (sRow[3] == "Laptop/Windows") {newDeviceType = "WINDOWS"}
        else if (sRow[3] == "Laptop/Linux") {newDeviceType = "LINUX"} 
        else {newDeviceType = "DEVICE_TYPE_UNSPECIFIED"};

        newArraySnipeIT.push(
          {
            "serialNumber": sRow[0],
            "assetTag": sRow[1],
            "deviceType": newDeviceType,
          }
        )

      };

  }
  // console.log(newArray)
  return newArraySnipeIT
};


/** Save array of devices into deviceCreateGoogle_A */
function save_source(newArrayMosyle, newArrayManual, newArraySnipeIT) {
  var newArrayMosyle = make_newArrayFromMosyle()
  var newArrayManual = make_newArrayFromManual()
  var newArraySnipeIT = make_newArraySnipeIT()
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var deviceCreateGoogle_A = SpreadsheetApp.setActiveSheet(ss.getSheetByName("deviceCreateGoogle_A"));
  deviceCreateGoogle_A.getRange("A2:D").clearContent();  // Clear the space

  // This decided where to post. Starts after header.
  var lastRow = Math.max(deviceCreateGoogle_A.getRange(2, 1).getLastRow(), 1);
  var index = 0;
  var newArray = [...newArrayManual, ...newArrayMosyle, ...newArraySnipeIT];     // Merge all dictionaries
  var data = [...new Set(newArray)];

  // Populate sheet by looping thru records in our list of dictionaries and pulling data we need into correct columns.
  for (var i = 0; i < data.length; i++) {

    deviceCreateGoogle_A.getRange(index + lastRow + i, 1).setValue(data[i]['serialNumber']);
    deviceCreateGoogle_A.getRange(index + lastRow + i, 2).setValue(data[i]["assetTag"]);
    deviceCreateGoogle_A.getRange(index + lastRow + i, 3).setValue(data[i]["deviceType"]);
  }

  // This actually posts data when it's ready instead of making many changes one at a time.
  deviceCreateGoogle_A.sort(1);  // sort by column 1
  SpreadsheetApp.flush();
}


/** This is what you use to run all the steps. */
function run_main_mover() {
  var sourceManual = load_manualSource();
  var current = load_current();
  var mosyle = load_Mosyle();
  var snipeIT = load_SnipeIT();
  var newArrayManual = make_newArrayFromManual(sourceManual, current);
  var newArrayMosyle = make_newArrayFromMosyle(mosyle, current);
  var newArraySnipeIT = make_newArraySnipeIT(snipeIT, current);
  
  save_source(newArrayManual, newArrayMosyle, newArraySnipeIT);
}
