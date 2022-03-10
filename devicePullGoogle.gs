/****************************************************************************************************
Lists all devices in Google Workspace
Create a spreadsheet, name one sheer "devicePullGoogle_A" enable API's as needed.
https://cloud.google.com/identity/docs/reference/rest/v1/devices/list


 Please note, at the time of writing this API is returing nextPageToken even when there is no next page... fun...
 This means code will log "No Devices found."
 */
// Pulls Device data from Domain
function downloadGoogleDevices() {
  var service = getOAuthService();
  service.reset();
  if (service.hasAccess()) {
    var pageToken = ``;

    /************************
    Make the call and assemble data
    Clean and organise space
    */
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var devicePullGoogle_A = SpreadsheetApp.setActiveSheet(ss.getSheetByName('devicePullGoogle_A'));
    // Clear content except header all the way to "K" column.
    devicePullGoogle_A.getRange('A2:K').clear();

    // This decided where to post. Starts after header.
    var lastRow = Math.max(devicePullGoogle_A.getRange(2, 1).getLastRow(), 1);
    var index = 0;

    do {
      var querry = `?pageSize=100&filter=owner:COMPANY&pageToken=${pageToken}`  // &view=COMPANY_INVENTORY
      var URL = `https://cloudidentity.googleapis.com/v1/devices` + querry;
      var headers = {
        Authorization: 'Bearer ' + service.getAccessToken()
      };
      var options = {
        method: "GET",
        headers: headers,
      };

      var response = UrlFetchApp.fetch(URL, options);
      var parsed = JSON.parse(response);
      var data = parsed.devices

      // Populate sheet
      if (data) {
        for (var i = 0; i < data.length; i++) {

          devicePullGoogle_A.getRange(index + lastRow + i, 1).setValue(data[i]["serialNumber"]);
          devicePullGoogle_A.getRange(index + lastRow + i, 2).setValue(data[i]["assetTag"]);
          devicePullGoogle_A.getRange(index + lastRow + i, 3).setValue(data[i]["deviceType"]);
          devicePullGoogle_A.getRange(index + lastRow + i, 4).setValue(data[i]["ownerType"]);
          devicePullGoogle_A.getRange(index + lastRow + i, 5).setValue(data[i]["manufacturer"]);
          devicePullGoogle_A.getRange(index + lastRow + i, 6).setValue(data[i]["model"]);
          devicePullGoogle_A.getRange(index + lastRow + i, 7).setValue(data[i]["osVersion"]);
          devicePullGoogle_A.getRange(index + lastRow + i, 8).setValue(data[i]["encryptionState"]);
          devicePullGoogle_A.getRange(index + lastRow + i, 9).setValue(data[i]["lastSyncTime"]);

        }
        index += data.length;  // Has to be same as pageSize
      } else {
        console.log('No Devices found.');
      }
      pageToken = parsed.nextPageToken;
      // console.log(parsed.nextPageToken);
    } while (pageToken);
    // This actually posts data when it's ready.
    devicePullGoogle_A.sort(1);
    SpreadsheetApp.flush();
  } else {
    console.log('service Error');
    console.log(service.getLastError());
  }
}
