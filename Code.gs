// ==========================================================================
// ÆRIEL.NET BACKEND CONFIGURATION
// ==========================================================================

// Email recipient for contact form submissions
const CONTACT_EMAIL = "contact@aeriel.net";

// Google Sheet ID for registration logging (Replace placeholder with actual Sheet ID from URL)
const SHEET_ID = "PASTE_YOUR_GOOGLE_SHEET_ID_HERE";

// Tab name inside Google Sheet where registrations will be appended
const SHEET_TAB = "Registrations";

/**
 * Handles GET requests for quick health check & status testing.
 */
function doGet(e) {
  return jsonResponse({ ok: true, status: "ÆRIEL backend online" });
}

/**
 * Handles incoming POST submissions from index.html contact and registration forms.
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, error: "NO_PAYLOAD_RECEIVED" });
    }

    const data = JSON.parse(e.postData.contents);

    if (!data || !data.formType) {
      return jsonResponse({ ok: false, error: "MISSING_FORM_TYPE" });
    }

    if (data.formType === "contact") {
      return handleContactForm(data);
    } else if (data.formType === "registration") {
      return handleRegistrationForm(data);
    } else {
      return jsonResponse({ ok: false, error: "UNKNOWN_FORM_TYPE: " + data.formType });
    }
  } catch (err) {
    return jsonResponse({ ok: false, error: err.toString() });
  }
}

/**
 * Processes contact form submissions and dispatches emails via MailApp.
 */
function handleContactForm(data) {
  const name = data.name || "Anonymous";
  const email = data.email || "";
  const social = data.social_handle || "N/A";
  const phone = data.phone || "N/A";
  const message = data.message || "";

  if (!email || !message) {
    return jsonResponse({ ok: false, error: "MISSING_REQUIRED_CONTACT_FIELDS" });
  }

  const emailBody = [
    "========================================",
    "AERIEL.NET - NEW CONTACT TRANSMISSION",
    "========================================",
    "",
    "Name: " + name,
    "Email: " + email,
    "Social Handle: " + social,
    "Phone: " + phone,
    "",
    "Message Body:",
    "----------------------------------------",
    message,
    "----------------------------------------"
  ].join("\n");

  MailApp.sendEmail({
    to: CONTACT_EMAIL,
    subject: "[AERIEL.NET] New Message from " + name,
    body: emailBody,
    replyTo: email
  });

  return jsonResponse({ ok: true });
}

/**
 * Processes registration form submissions and appends rows to Google Sheet.
 */
function handleRegistrationForm(data) {
  if (SHEET_ID === "PASTE_YOUR_GOOGLE_SHEET_ID_HERE") {
    return jsonResponse({ ok: false, error: "SHEET_ID_NOT_CONFIGURED" });
  }

  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_TAB);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_TAB);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Timestamp", "Name", "Email", "Social", "WhatsApp/Phone", "Preferred Contact"]);
  }

  sheet.appendRow([
    new Date(),
    data.name || "",
    data.email || "",
    data.social_handle || "",
    data.phone || "",
    data.contact_method || ""
  ]);

  return jsonResponse({ ok: true });
}

/**
 * Helper to return formatted JSON responses using ContentService.
 */
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
