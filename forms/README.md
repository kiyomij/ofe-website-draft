# Form setup

The site has two forms that submit to Google Apps Script "Web Apps," which log
submissions to a Google Sheet: the contact form in the site footer, and the "Share
Your Ideas" form on the Vision page. Each needs its own script, deployed from your
own Google account — here's how, repeated for each form.

## Contact form

1. Go to [sheets.google.com](https://sheets.google.com) and create a new, blank spreadsheet. Name it something like "OFE Contact Submissions."
2. In that sheet, go to **Extensions → Apps Script**.
3. Delete any starter code in the editor, and paste in the contents of `contact-form.gs` (in this folder).
4. Click **Deploy → New deployment**.
   - Click the gear icon next to "Select type" and choose **Web app**.
   - Set "Execute as" to **Me**.
   - Set "Who has access" to **Anyone**.
   - Click **Deploy**, and authorize it when Google prompts you (it'll warn that it's an unverified app — that's expected since it's just for you; click "Advanced" → "Go to (project name)" to proceed).
5. Copy the **Web app URL** it gives you.
6. Paste that URL into `js/config.js`, replacing the empty string:
   ```js
   window.OFE_CONTACT_SCRIPT_URL = "https://script.google.com/macros/s/.../exec";
   ```

## Vision page "Share Your Ideas" form

Same steps, using a separate spreadsheet (e.g. "OFE Vision Submissions") and
`vision-form.gs` instead. Paste the resulting Web app URL into `js/config.js`:
```js
window.OFE_VISION_SCRIPT_URL = "https://script.google.com/macros/s/.../exec";
```

---

Submissions will appear as new rows in each spreadsheet. If you ever need to change a
form's behavior, edit its script at script.google.com and deploy a **new version**
(Deploy → Manage deployments → edit → new version) — the URL stays the same.
