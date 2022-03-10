/****************************************************************************************************
Lists all devices in Google Workspace
Create a spreadsheet, name one sheer "devicePullMosyle_A" enable API's as needed.
https://cloud.google.com/identity/docs/reference/rest/v1/devices/list


 Please note, at the time of writing this API is returing nextPageToken even when there is no next page... fun...
 This means code will log "No Devices found."
 */
// Pulls Device data from Domain
function downloadMosyleDevices() {

  /************************
      Make the call and assemble data
      Clean and organise space
      */
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var devicePullMosyle_A = SpreadsheetApp.setActiveSheet(ss.getSheetByName('devicePullMosyle_A'));
  // Clear content except header all the way to "K" column.
  devicePullMosyle_A.getRange('A2:K').clear();

  // This decided where to post. Starts after header.
  var lastRow = Math.max(devicePullMosyle_A.getRange(2, 1).getLastRow(), 1);
  var index = 0;
  var page = 1
  var page_size = 50   // forced by Mosyle, don't have
  var saved = 0

  do {
    var URL = `https://businessapi.mosyle.com/v1/devices`;
    var auth = Utilities.base64Encode(mosyleUser + ":" + mosylePass);
    var querry = {
      operation: 'list',
      options: {
        os: 'mac',
        page: page
      }
    }

    var payload = JSON.stringify(querry)
    var headers = {
      Authorization: 'Basic ' + auth,
      accesstoken: mosyleToken,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    var options = {
      method: "POST",
      headers: headers,
      payload: payload
    };

    var response = UrlFetchApp.fetch(URL, options);
    var parsed = JSON.parse(response);
    var data_responce = parsed.response[0]
    var data = data_responce.devices;
    var total = data_responce.rows
    // console.log(data_responce)
    // console.log(rows)

    // Populate sheet
    if (data) {
      for (var i = 0; i < data.length; i++) {

        devicePullMosyle_A.getRange(index + lastRow + i, 1).setValue(data[i]["serial_number"]);
        devicePullMosyle_A.getRange(index + lastRow + i, 2).setValue(data[i]["asset_tag"]);
        devicePullMosyle_A.getRange(index + lastRow + i, 3).setValue(data[i]["device_model"]);
        devicePullMosyle_A.getRange(index + lastRow + i, 4).setValue(data[i]["device_name"]);
        devicePullMosyle_A.getRange(index + lastRow + i, 5).setValue(data[i]["status"]);
        devicePullMosyle_A.getRange(index + lastRow + i, 6).setValue(data[i]["is_supervised"]);
        devicePullMosyle_A.getRange(index + lastRow + i, 7).setValue(data[i]["userid"]);
        devicePullMosyle_A.getRange(index + lastRow + i, 8).setValue(data[i]["usernam"]);

      }
    var index = index + page_size  // Has to be same as pageSize
      page++
      var saved = saved + page_size
      var total = total - saved
    }
    // This actually posts data when it's ready instead of making many changes one at a time.
    SpreadsheetApp.flush();
  } while (total >= 0);

}
