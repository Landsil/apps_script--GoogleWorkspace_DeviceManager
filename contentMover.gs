/**************************************************************
This code is used to move data around so that payload in deviceCreateGoogle_A is only users that actually have any changes, saves on processing time later on.
*/

// Load devices from manual import sheet
function load_manualSource() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var manual_import = SpreadsheetApp.setActiveSheet(ss.getSheetByName("manual_import"));

  var column = manual_import.getRange('A1:A').getValues();
  var lastRow = column.filter(String).length;
  var sourceManual = manual_import.getRange(2, 1, lastRow - 1, 5).getValues();  // start row, start column, number of rows, number of columns
  // console.log(sourceManual)
  return sourceManual
};

// Load devices you already have from devicePullGoogle_A
function load_current() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var devicePullGoogle_A = SpreadsheetApp.setActiveSheet(ss.getSheetByName("devicePullGoogle_A"));

  var column = devicePullGoogle_A.getRange('A1:A').getValues();
  var lastRow = column.filter(String).length;
  var current = devicePullGoogle_A.getRange(2, 1, lastRow - 1, 3).getValues();  // start row, start column, number of rows, number of columns
  // console.log(current)
  return current
};

// Load devices from Mosyle automated import
// Code goes here


// Compare all sources and find new devices  TODO: consider spliting this into parts if step is too slow.
function make_newArray(sourceManual, current) {
  const currentArray = load_current()
  const manualArray = load_manualSource()
  var newArray = []

  // console.log('currentArray')
  // console.log(currentArray)
  // console.log('manualArray')
  // console.log(manualArray)

  for (const mRow of manualArray) {
    if (mRow[4] === true)   // This will forcefully copy marked rows from manual_import into deviceCreateGoogle_A
    {
      newArray.push(
        {
          "serialNumber": mRow[0],
          "assetTag": mRow[1],
        }
      )
    } else {
      var count = 0
      for (const cRow of currentArray) {
        console.log(mRow[0] + ' vs ' + cRow[0])
        if (mRow[0] === cRow[0] && cRow[2] === 'COMPANY')  // Verify if it's already visible in google
        { count++ }
      }
      if (count == 0) {
        newArray.push(
          {
            "serialNumber": mRow[0],
            "assetTag": mRow[1],
          }
        )
      };
    }
  }

  // console.log(newArray)
  return newArray
};

// Save array of devices into deviceCreateGoogle_A
function save_source(newArray) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var deviceCreateGoogle_A = SpreadsheetApp.setActiveSheet(ss.getSheetByName("deviceCreateGoogle_A"));

  deviceCreateGoogle_A.getRange("A2:D").clearContent();  // Clear the space

  // This decided where to post. Starts after header.
  var lastRow = Math.max(deviceCreateGoogle_A.getRange(2, 1).getLastRow(), 1);
  var index = 0;
  var data = newArray;

  // Populate sheet by looping thru records in our list of dictonaries and pulling data we need into correct columns.
  for (var i = 0; i < data.length; i++) {

    deviceCreateGoogle_A.getRange(index + lastRow + i, 1).setValue(data[i]['serialNumber']);
    deviceCreateGoogle_A.getRange(index + lastRow + i, 2).setValue(data[i]["assetTag"]);

  }

  // This actually posts data when it's ready instead of making many changes one at a time.
  deviceCreateGoogle_A.sort(1);  // sort by column 1
  SpreadsheetApp.flush();
}


// This is what you use to run all the steps.
function run_main_data() {
  var sourceManual = load_manualSource();
  var current = load_current();
  var newArray = make_newArray(sourceManual, current);
  save_source(newArray);
};
