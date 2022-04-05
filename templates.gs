/****************
This script is responsible for creating the empty pages for code to put data into.
Please make sure to keep content of the columns the same or you will have to re-do column calls in contentMover.gs 

*/

// This will create your "database's"
function make_sheets() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  try {
    var devicePullGoogle_A = spreadsheet.getSheetByName("devicePullGoogle_A");
  } catch (err) {
    spreadsheet.insertSheet().setName("devicePullGoogle_A");
  }
  var devicePullGoogle_A = spreadsheet.getSheetByName("devicePullGoogle_A");
  devicePullGoogle_A.setFrozenRows(1) // header
  devicePullGoogle_A.getRange("1:1").activate();
  devicePullGoogle_A.getActiveRangeList().setHorizontalAlignment("center").setFontWeight("bold"); // center and bold
  devicePullGoogle_A.getRange("1:999").setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);  // Clip when text to long

  devicePullGoogle_A.getRange("A1").setValue('S/N');
  devicePullGoogle_A.getRange("B1").setValue('assetTag');
  devicePullGoogle_A.getRange("C1").setValue('deviceType');
  devicePullGoogle_A.getRange("D1").setValue('ownerType');
  devicePullGoogle_A.getRange("E1").setValue('manufacturer');
  devicePullGoogle_A.getRange("F1").setValue('model');
  devicePullGoogle_A.getRange("G1").setValue('osVersion');
  devicePullGoogle_A.getRange("H1").setValue('encryptionState');
  devicePullGoogle_A.getRange("I1").setValue('lastSyncTime');

  try {
    var deviceCreateGoogle_A = spreadsheet.getSheetByName("deviceCreateGoogle_A");
  } catch (err) {
    spreadsheet.insertSheet().setName("deviceCreateGoogle_A");
  }
  var deviceCreateGoogle_A = spreadsheet.getSheetByName("deviceCreateGoogle_A");
  deviceCreateGoogle_A.setFrozenRows(1) // header
  deviceCreateGoogle_A.getRange("1:1").activate();
  deviceCreateGoogle_A.getActiveRangeList().setHorizontalAlignment("center").setFontWeight("bold"); // center and bold
  deviceCreateGoogle_A.getRange("1:999").setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);  // Clip when text to long

  deviceCreateGoogle_A.getRange("A1").setValue('S/N');
  deviceCreateGoogle_A.getRange("B1").setValue('assetTag');
  deviceCreateGoogle_A.getRange("C1").setValue('deviceType');


  try {
    var manual_import = spreadsheet.getSheetByName("manual_import");
  } catch (err) {
    spreadsheet.insertSheet().setName("manual_import");
  }
  var manual_import = spreadsheet.getSheetByName("manual_import");
  manual_import.setFrozenRows(1) // header
  manual_import.getRange("1:1").activate();
  manual_import.getActiveRangeList().setHorizontalAlignment("center").setFontWeight("bold"); // center and bold
  manual_import.getRange("1:999").setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);  // Clip when text to long

  manual_import.getRange("A1").setValue('S/N');
  manual_import.getRange("B1").setValue('assetTag');
  manual_import.getRange("C1").setValue('deviceType');


  try {
    var devicePullMosyle_A = spreadsheet.getSheetByName("devicePullMosyle_A");
  } catch (err) {
    spreadsheet.insertSheet().setName("devicePullMosyle_A");
  }
  var devicePullMosyle_A = spreadsheet.getSheetByName("devicePullMosyle_A");
  devicePullMosyle_A.setFrozenRows(1) // header
  devicePullMosyle_A.getRange("1:1").activate();
  devicePullMosyle_A.getActiveRangeList().setHorizontalAlignment("center").setFontWeight("bold"); // center and bold
  devicePullMosyle_A.getRange("1:999").setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);  // Clip when text to long

  devicePullMosyle_A.getRange("A1").setValue('S/N');
  devicePullMosyle_A.getRange("B1").setValue('asset_tag');
  devicePullMosyle_A.getRange("C1").setValue('device_model');
  devicePullMosyle_A.getRange("D1").setValue('device_name');
  devicePullMosyle_A.getRange("E1").setValue('userid');
  devicePullMosyle_A.getRange("G1").setValue('Force_Sync');
  

  try {
    var devicePullSnipeIT_A = spreadsheet.getSheetByName("devicePullSnipeIT_A");
  } catch (err) {
    spreadsheet.insertSheet().setName("devicePullSnipeIT_A");
  }
  var devicePullSnipeIT_A = spreadsheet.getSheetByName("devicePullSnipeIT_A");
  devicePullSnipeIT_A.setFrozenRows(1) // header
  devicePullSnipeIT_A.getRange("1:1").activate();
  devicePullSnipeIT_A.getActiveRangeList().setHorizontalAlignment("center").setFontWeight("bold"); // center and bold
  devicePullSnipeIT_A.getRange("1:999").setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);  // Clip when text to long

  devicePullSnipeIT_A.getRange("A1").setValue('S/N');
  devicePullSnipeIT_A.getRange("B1").setValue('asset_tag');
  devicePullSnipeIT_A.getRange("C1").setValue('model.name');
  devicePullSnipeIT_A.getRange("D1").setValue('category.name');
  devicePullSnipeIT_A.getRange("E1").setValue('status.name');
  devicePullSnipeIT_A.getRange("F1").setValue('status.name');
  devicePullSnipeIT_A.getRange("G1").setValue('status.name');

  devicePullSnipeIT_A.getRange("I1").setValue('Force_Sync');

  SpreadsheetApp.flush();
}
