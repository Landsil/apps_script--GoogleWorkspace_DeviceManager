/***
API overview https://snipe-it.readme.io/reference/api-overview
Here we will be pulling devices we have to push them to Google instead of using manual input.
Remeber to put both credentials and domain into project properities as shown in "main.gs"

At this time 03/2022 API has very limited support for querry properties, 
check this issue for updates: https://github.com/snipe/snipe-it/issues/10816
*/
function downloadSnipeITDevices() {
  snipeITclean();
  downloadSnipeIT1();  // Deployed
  downloadSnipeIT2();  // RTD
};

function snipeITclean() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var devicePullSnipeIT_A = SpreadsheetApp.setActiveSheet(ss.getSheetByName('devicePullSnipeIT_A'));

  // Clear content except header all the way to "K" column.
  devicePullSnipeIT_A.getRange('A2:K').clear();
}

/**
Make a call with 1st filter (Deployed)
*/
function downloadSnipeIT1() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var devicePullSnipeIT_A = SpreadsheetApp.setActiveSheet(ss.getSheetByName('devicePullSnipeIT_A'));
  /**
  Organise space and initiall variables
  */
  // This decided where to post. Starts after header.
  var column = devicePullSnipeIT_A.getRange('A1:A').getValues();
  var lastRow = column.filter(String).length;
  var index = 0;
  var offset = 0;
  var limit = 100;  // Make it smaller if you have very few devices, bigger for faster processing.
  var saved = 0;

  do {
    // var category_id = '12'
    var search = 'Laptop'    // Use it instead of category if you can/have too
    var status = 'Deployed'          // RTD, Deployed, Undeployable, Deleted, Archived, Requestable
    var URL = snipeIT_domain + `/api/v1/hardware?components=false&status=${status}&search=${search}&offset=${offset}&limit=${limit}`;

    var headers = {
      Authorization: 'Bearer ' + snipeIT_token,
      Accept: 'application/json',
    };
    var options = {
      method: "GET",
      headers: headers,
    };

    var response = UrlFetchApp.fetch(URL, options);
    var parsed = JSON.parse(response);
    var data = parsed.rows;
    var total = parsed["total"];

    // Populate sheet
    if (data) {
      for (var i = 1; i < data.length; i++) {

        devicePullSnipeIT_A.getRange(index + lastRow + i, 1).setValue(data[i]["serial"]);
        devicePullSnipeIT_A.getRange(index + lastRow + i, 2).setValue(data[i]["asset_tag"]);
        devicePullSnipeIT_A.getRange(index + lastRow + i, 3).setValue(data[i].model["name"]);
        devicePullSnipeIT_A.getRange(index + lastRow + i, 4).setValue(data[i].category["name"]);
        devicePullSnipeIT_A.getRange(index + lastRow + i, 5).setValue(data[i].status_label["name"]);
        devicePullSnipeIT_A.getRange(index + lastRow + i, 6).setValue(data[i].status_label["status_type"]);
        devicePullSnipeIT_A.getRange(index + lastRow + i, 7).setValue(data[i].status_label["status_meta"]);
      }
      var index = index + i   // For placing input in correct rows
      var saved = saved + i   // Keep track of data done
      var total = total - saved   // Keep track when to end
      var offset = offset + limit // Ask for next set of data
    }
  } while (total > 0);
  SpreadsheetApp.flush();
}

/**
Make a call with 2nd filter (RTD)
*/
function downloadSnipeIT2() {
  /**
  Organise space and initiall variables
  */
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var devicePullSnipeIT_A = SpreadsheetApp.setActiveSheet(ss.getSheetByName('devicePullSnipeIT_A'));

  // This decided where to post. Starts after header.
  var column = devicePullSnipeIT_A.getRange('A1:A').getValues();
  var lastRow = column.filter(String).length;
  var index = 0;
  var offset = 0;
  var limit = 100;   // Make it smaller if you have very few devices, bigger for faster processing.
  var saved = 0;

  do {
    var search = 'Laptop'    // Use it instead of category if you can.
    var status = 'RTD'          // RTD, Deployed, Undeployable, Deleted, Archived, Requestable
    var URL = snipeIT_domain + `/api/v1/hardware?components=false&status=${status}&search=${search}&offset=${offset}&limit=${limit}`;
    var headers = {
      Authorization: 'Bearer ' + snipeIT_token,
      Accept: 'application/json',
    };
    var options = {
      method: "GET",
      headers: headers,
    };

    var response = UrlFetchApp.fetch(URL, options);
    var parsed = JSON.parse(response);
    var data = parsed.rows;
    var total = parsed["total"];

    // Populate sheet
    if (data) {
      for (var i = 0; i < data.length; i++) {

        devicePullSnipeIT_A.getRange(index + lastRow + i, 1).setValue(data[i]["serial"]);
        devicePullSnipeIT_A.getRange(index + lastRow + i, 2).setValue(data[i]["asset_tag"]);
        devicePullSnipeIT_A.getRange(index + lastRow + i, 3).setValue(data[i].model["name"]);
        devicePullSnipeIT_A.getRange(index + lastRow + i, 4).setValue(data[i].category["name"]);
        devicePullSnipeIT_A.getRange(index + lastRow + i, 5).setValue(data[i].status_label["name"]);
        devicePullSnipeIT_A.getRange(index + lastRow + i, 6).setValue(data[i].status_label["status_type"]);
        devicePullSnipeIT_A.getRange(index + lastRow + i, 7).setValue(data[i].status_label["status_meta"]);
      }
      var index = index + i   // For placing input in correct rows
      var saved = saved + i   // Keep track of data done
      var total = total - saved   // Keep track when to end
      var offset = offset + limit // Ask for next set of data
    }
  } while (total > 0);
  SpreadsheetApp.flush();

}
