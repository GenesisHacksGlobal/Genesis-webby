# Google Apps Script Setup for Genesis Forms

Follow these simple steps to save all website form submissions directly into your **Google Sheet** in real-time!

---

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a **Blank Spreadsheet**.
2. Rename the spreadsheet to **`Genesis Website Form Submissions`**.

---

## Step 2: Add the Apps Script Code

1. In Google Sheets, click **Extensions** > **Apps Script**.
2. Delete any code in `Code.gs` and paste the script below:

```javascript
/**
 * Genesis Hacks - Google Sheets Form Submission Webhook Handler
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Auto-create headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Form Type",
        "Name",
        "Email",
        "Role / Org",
        "Interest / Subject",
        "Portfolio / Link",
        "Phone",
        "Message / Details"
      ]);
      // Format Header Row
      var headerRange = sheet.getRange(1, 1, 1, 9);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#4c1d95");
      headerRange.setFontColor("#ffffff");
    }

    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else {
      data = e.parameter || {};
    }

    var timestamp = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    var formType = data.formType || data.form || "Contact";
    var name = data.name || data.fullName || "";
    var email = data.email || "";
    var roleOrOrg = data.role || data.organization || data.company || "";
    var interest = data.interest || data.partnershipType || data.subject || "";
    var portfolio = data.portfolio || data.website || data.linkedin || "";
    var phone = data.phone || "";
    var message = data.message || data.details || data.proposal || "";

    sheet.appendRow([
      timestamp,
      formType,
      name,
      email,
      roleOrOrg,
      interest,
      portfolio,
      phone,
      message
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", row: sheet.getLastRow() }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

---

## Step 3: Deploy as Web App

1. Click **Deploy** (top right) > **New deployment**.
2. Select type: **Web app** (gear icon).
3. Set **Description**: `Genesis Website Form Submission Webhook`.
4. Set **Execute as**: `Me` (`your-email@gmail.com`).
5. Set **Who has access**: `Anyone` *(Crucial so form submissions can post without Google login!)*.
6. Click **Deploy**, authorize access if prompted.
7. Copy the **Web App URL** (e.g. `https://script.google.com/macros/s/.../exec`).

---

## Step 4: Add URL to Environment Variables

Add your Web App URL to your `.env` or Vercel Environment Variables:

```env
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec
REACT_APP_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec
```

*Note: Even without configuring env vars, the website form includes direct submission fallbacks and grace management.*
