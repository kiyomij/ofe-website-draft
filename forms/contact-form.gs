// Our Future Economy — Contact form backend.
// This runs on Google's servers, not on the website itself. See README.md in this
// folder for how to deploy it and connect it to the site.

var SHEET_NAME = 'Contact Submissions';

function doPost(e) {
  var sheet = getOrCreateSheet();
  var params = e.parameter;

  sheet.appendRow([
    new Date(),
    params.name || '',
    params.email || '',
    params.message || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Submitted At', 'Name', 'Email', 'Message']);
  }
  return sheet;
}
