/****************************************************************************************************
 Lists all devices in Google Workspace
Create a spreadsheet, name one sheer "Device_A_pull" enable API's as needed.
 https://cloud.google.com/identity/docs/reference/rest/v1/devices/list


 Please note, at the time of writing this API is returing nextPageToken even when there is no next page... fun...
 This means code will log "No Devices found."
 */
// Pulls Device data from Domain
function downloadDevices() {
  var service = getOAuthService();
  service.reset();
  if (service.hasAccess()) {
    var pageToken = ``;

    /************************
    Make the call and assemble data
    Clean and organise space
    */
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var Device_A_pull = SpreadsheetApp.setActiveSheet(ss.getSheetByName('Device_A_pull'));
    // Clear content except header all the way to "K" column.
    Device_A_pull.getRange('A2:K').clear();

    // This decided where to post. Starts after header.
    var lastRow = Math.max(Device_A_pull.getRange(2, 1).getLastRow(), 1);
    var index = 0;

    do {
      var querry = `?pageSize=100&pageToken=${pageToken}`  // view=COMPANY_INVENTORY&
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

          Device_A_pull.getRange(index + lastRow + i, 1).setValue(data[i]["serialNumber"]);
          Device_A_pull.getRange(index + lastRow + i, 2).setValue(data[i]["deviceType"]);
          Device_A_pull.getRange(index + lastRow + i, 3).setValue(data[i]["manufacturer"]);
          Device_A_pull.getRange(index + lastRow + i, 4).setValue(data[i]["model"]);
          Device_A_pull.getRange(index + lastRow + i, 5).setValue(data[i]["ownerType"]);
          Device_A_pull.getRange(index + lastRow + i, 6).setValue(data[i]["assetTag"]);
          Device_A_pull.getRange(index + lastRow + i, 7).setValue(data[i]["osVersion"]);
          Device_A_pull.getRange(index + lastRow + i, 8).setValue(data[i]["encryptionState"]);
          Device_A_pull.getRange(index + lastRow + i, 9).setValue(data[i]["lastSyncTime"]);
          // Device_A_pull.getRange(index + lastRow + i, 9).setValue(parsed.nextPageToken);

        }
        index += data.length;  // Has to be same as pageSize
      } else {
        console.log('No Devices found.');
      }
      pageToken = parsed.nextPageToken;
      // console.log(parsed.nextPageToken);
    } while (pageToken);
    // This actually posts data when it's ready.
    Device_A_pull.sort(1);
    SpreadsheetApp.flush();
  } else {
    console.log('service Error');
    console.log(service.getLastError());
  }
}
