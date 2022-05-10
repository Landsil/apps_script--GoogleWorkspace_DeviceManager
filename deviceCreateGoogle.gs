/****************************************************************************************************
Create a new device in Google Workspace as "Company Owned"
Use deviceCreateGoogle_A spreadsheet.
https://cloud.google.com/identity/docs/reference/rest/v1/devices/create


 */
// Pulls Device data from thr sheet
function createGoogleDevices() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var deviceCreateGoogle_A = SpreadsheetApp.setActiveSheet(ss.getSheetByName("deviceCreateGoogle_A"));

  var column = deviceCreateGoogle_A.getRange('A1:A').getValues();
  var lastRow = column.filter(String).length;
  var lastColumn = deviceCreateGoogle_A.getLastColumn();
  var dataArray = []

  if (lastRow > 1) {
    var data = deviceCreateGoogle_A.getRange(2, 1, lastRow - 1, 3).getValues(); // start row, start column, number of rows, number of columns
    // console.log(data);
    for (const row of data) {
      dataArray.push(
        {
          "serialNumber": row[0],   // All the values here are based on columns in a sheet A=0, B=1
          // "assetTag": row[1],
          "deviceType": row[2],
        }
      );
    };
  } else {
    console.log(`No changes`)
  }
  // console.log(dataArray)
  return dataArray
};


/***
Actual creation happens here
*/
function createGoogleDevices_Go(dataArray) {
    var dataArray = createGoogleDevices(dataArray);   // You this only if you want to run this step manually.
  
    // OAuth
    var service = getOAuthService();
    service.reset();

    if (service.hasAccess()) {

      // Check if there is anything to post and start posting.
      if (dataArray.length > 0) {
        for (var i = 0; i < dataArray.length; i++) {
          var update = {
              serialNumber: dataArray[i]['serialNumber'],
              // assetTag: dataArray[i]['assetTag'],
              deviceType: dataArray[i]['deviceType'],
        }; 

    // API details
    var URL = `https://cloudidentity.googleapis.com/v1/devices`;
    var headers = {
      Authorization: 'Bearer ' + service.getAccessToken(),
      'Content-Type': 'application/json',
    };
    var payload = JSON.stringify(update)
    var options = {
      method: "POST",
      headers: headers,
      payload : payload,
      muteHttpExceptions: true,
    };

        // console.log('Data to post')
        // console.log(options)               // This will let you see what you are pushing to double check before first live push.
        var update = UrlFetchApp.fetch(URL, options);  // This will update your org, you have to un-comment it to work.
        console.log(update.getContentText());
        }

    } else {
      console.log(`No changes`)
    }
    } else {
      console.log('service Error');
      console.log(service.getLastError());
    }
  }
