// ==========================================================================
// ÆRIEL.NET BACKEND CONFIGURATION & SECURITY HARDENING
// ==========================================================================

// Email recipient for contact form submissions
const CONTACT_EMAIL = "contact@aeriel.net";

// Google Sheet ID for registration logging (Replace placeholder with actual Sheet ID from URL)
const SHEET_ID = "PASTE_YOUR_GOOGLE_SHEET_ID_HERE";

// Tab name inside Google Sheet where registrations will be appended
const SHEET_TAB = "Registrations";

// Input constraints
const MAX_MESSAGE_LENGTH = 5000;
const MAX_FIELD_LENGTH = 250;

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

    // Honeypot validation: If hp_check is filled, silently succeed to prevent bot retries
    if (data.hp_check && String(data.hp_check).trim().length > 0) {
      return jsonResponse({ ok: true });
    }

    if (data.formType === "contact") {
      return handleContactForm(data);
    } else if (data.formType === "registration") {
      return handleRegistrationForm(data);
    } else {
      return jsonResponse({ ok: false, error: "UNKNOWN_FORM_TYPE" });
    }
  } catch (err) {
    console.error("doPost handler exception:", err);
    return jsonResponse({ ok: false, error: "INTERNAL_PROCESSING_ERROR" });
  }
}

/**
 * Validates basic email formatting.
 */
function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Strips carriage returns and newlines to protect against email header injection.
 */
function sanitizeHeader(val) {
  return String(val || "").replace(/[\r\n\x00-\x1F\x7F]+/g, " ").trim();
}

/**
 * Sanitizes cell values to neutralize spreadsheet formula injection (=, +, -, @, \t, \r).
 */
function sanitizeForSheet(val) {
  const str = String(val || "").trim();
  if (/^[=+\-@\t\r]/.test(str)) {
    return "'" + str;
  }
  return str;
}

/**
 * Processes contact form submissions and dispatches emails via MailApp.
 */
function handleContactForm(data) {
  const rawEmail = String(data.email || "").trim();
  const rawMessage = String(data.message || "").trim();

  if (!rawEmail || !rawMessage) {
    return jsonResponse({ ok: false, error: "MISSING_REQUIRED_CONTACT_FIELDS" });
  }

  if (!isValidEmail(rawEmail)) {
    return jsonResponse({ ok: false, error: "INVALID_EMAIL_FORMAT" });
  }

  const name = sanitizeHeader(String(data.name || "Anonymous").slice(0, MAX_FIELD_LENGTH));
  const email = sanitizeHeader(rawEmail.slice(0, MAX_FIELD_LENGTH));
  const social = sanitizeHeader(String(data.social_handle || "N/A").slice(0, MAX_FIELD_LENGTH));
  const phone = sanitizeHeader(String(data.phone || "N/A").slice(0, MAX_FIELD_LENGTH));
  const message = rawMessage.slice(0, MAX_MESSAGE_LENGTH);

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

  const rawEmail = String(data.email || "").trim();
  if (!rawEmail || !isValidEmail(rawEmail)) {
    return jsonResponse({ ok: false, error: "INVALID_EMAIL_FORMAT" });
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
    sanitizeForSheet(String(data.name || "").slice(0, MAX_FIELD_LENGTH)),
    sanitizeForSheet(rawEmail.slice(0, MAX_FIELD_LENGTH)),
    sanitizeForSheet(String(data.social_handle || "").slice(0, MAX_FIELD_LENGTH)),
    sanitizeForSheet(String(data.phone || "").slice(0, MAX_FIELD_LENGTH)),
    sanitizeForSheet(String(data.contact_method || "").slice(0, MAX_FIELD_LENGTH))
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
