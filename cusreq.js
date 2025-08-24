function onFormSubmit(e) {
  // ===== CONFIGURATION =====
  const MASTER_SHEET_ID   = "<<<DATABASE SHEET ID>>>"; 
  const MASTER_TAB_NAME   = "<<<<eg:test_items>>>>";
  const RESPONSE_TAB_NAME = "Form responses 1";

  // Master sheet column numbers
  const MASTER_COLS = {
    A_code: 3,       // "A_code"
    Brand: 4,        // "Brand"
    Description: 5,  // "Description"
    Vendor: 9        // "Vendor Name"
  };

  // Response sheet column numbers
  const RESPONSE_COLS = {
    A_code: 2,        // "SKU Code (A Code)"
    Brand: 3,         // "Brand"
    Description: 4,   // "Description"
    Vendor: 8,        // "Vendor"
    Status: 6,        // "Status"
    TSS: 7            // "TSS"
  };

  const DEFAULT_STATUS = "Requested";
  const NOT_FOUND_TEXT = "Not found";
  // =========================

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const responseSheet = ss.getSheetByName(RESPONSE_TAB_NAME);

  const masterSS = SpreadsheetApp.openById(MASTER_SHEET_ID);
  const masterSheet = masterSS.getSheetByName(MASTER_TAB_NAME);

  // Get submitted row
  const row = e.range.getRow();
  const rawACode = responseSheet.getRange(row, RESPONSE_COLS.A_code).getValue();

  if (!rawACode) return; // skip if no code entered

  // Clean A_code: remove spaces + uppercase
  const cleanACode = rawACode.toString().replace(/\s+/g, '').toUpperCase();

  // Search in master
  const masterValues = masterSheet.getDataRange().getValues();
  const matchRow = masterValues.find(r => {
    const masterCode = r[MASTER_COLS.A_code - 1]
      .toString()
      .replace(/\s+/g, '')
      .toUpperCase();
    return masterCode === cleanACode;
  });

  // Fill values
  responseSheet.getRange(row, RESPONSE_COLS.Brand)
    .setValue(matchRow ? matchRow[MASTER_COLS.Brand - 1] : NOT_FOUND_TEXT);
  responseSheet.getRange(row, RESPONSE_COLS.Description)
    .setValue(matchRow ? matchRow[MASTER_COLS.Description - 1] : NOT_FOUND_TEXT);
  responseSheet.getRange(row, RESPONSE_COLS.Vendor)
    .setValue(matchRow ? matchRow[MASTER_COLS.Vendor - 1] : NOT_FOUND_TEXT);

  // Default status if empty
  const statusCell = responseSheet.getRange(row, RESPONSE_COLS.Status);
  if (!statusCell.getValue()) {
    statusCell.setValue(DEFAULT_STATUS);
    responseSheet.getRange(row, RESPONSE_COLS.TSS).setValue(new Date());
  }
}

function onEdit(e) {
  // ===== CONFIGURATION =====
  const RESPONSE_TAB_NAME = "Form responses 1";
  const RESPONSE_COLS = {
    Status: 6,  // "Status"
    TSS: 7      // "TSS"
  };
  // =========================

  const sheet = e.range.getSheet();
  if (sheet.getName() !== RESPONSE_TAB_NAME) return;

  if (e.range.getColumn() === RESPONSE_COLS.Status) {
    const row = e.range.getRow();
    sheet.getRange(row, RESPONSE_COLS.TSS).setValue(new Date());
  }
}
