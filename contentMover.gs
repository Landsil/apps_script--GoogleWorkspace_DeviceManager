/**************************************************************
This code is used to move data around so that payload in deviceCreateGoogle_A is only users that actually have any changes, saves on processing time later on.
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
  var current = devicePullGoogle_A.getRange(2, 1, lastRow - 1, 4).getValues();  // start row, start column, number of rows, number of columns
  // console.log(current)
  return current
};

/** Load devices from Mosyle automated import */
function load_Mosyle() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var devicePullMosyle_A = SpreadsheetApp.setActiveSheet(ss.getSheetByName("devicePullMosyle_A"));

  var column = devicePullMosyle_A.getRange('A1:A').getValues();
  var lastRow = column.filter(String).length;
  var mosyle = devicePullMosyle_A.getRange(2, 1, lastRow - 1, 3).getValues();  // start row, start column, number of rows, number of columns
  // console.log(current)
  return mosyle
};

/** Start comparing different sources with what you already have
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



/** Save array of devices into deviceCreateGoogle_A */
function save_source(newArrayMosyle, newArrayManual) {
  var newArrayMosyle = make_newArrayFromMosyle()
  var newArrayManual = make_newArrayFromManual()
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var deviceCreateGoogle_A = SpreadsheetApp.setActiveSheet(ss.getSheetByName("deviceCreateGoogle_A"));

  deviceCreateGoogle_A.getRange("A2:D").clearContent();  // Clear the space

  // This decided where to post. Starts after header.
  var lastRow = Math.max(deviceCreateGoogle_A.getRange(2, 1).getLastRow(), 1);
  var index = 0;
  const newArray = newArrayManual.concat(newArrayMosyle)
  var data = newArray;

  // Populate sheet by looping thru records in our list of dictonaries and pulling data we need into correct columns.
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
  var newArrayManual = make_newArrayFromManual(sourceManual, current);
  var newArrayMosyle = make_newArrayFromMosyle(mosyle, current);
  
  save_source(newArrayManual, newArrayMosyle);
};
