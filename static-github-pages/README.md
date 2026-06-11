# BTRT Awards 2026 Nomination Portal

Welcome to the brand new, highly polished **BTRT Awards 2026** mock portal. This folder contains the direct, standalone static assets (`index.html`, `styles.css`, and `script.js`) that replace your legacy prototype cleanly.

---

## 🎨 Visual Identity & Premium Styling
- **Aesthetic Pairings**: We integrated clean **Space Grotesk** display titles paired with extremely highly scan-friendly **Inter** body elements. 
- **High Contrast Framing**: Uses deep slate backgrounds (`color-bg: #f8fafc` up to `text-color: #0f172a`) paired with gold and emerald color themes to give a premium corporate recognition vibe.
- **Micro-Animations**: Features custom CSS gold pulse keyframe indicators telling nominees exactly where to click next.

---

## 🚀 Easy GitHub Pages Standalone Deployment

These static files require no build tools, compilation commands (such as `npm run build`), or server-side hosting frameworks. They run directly inside the user's browser, persisting data utilizing the browser's safe client-side key-value state (`localStorage`).

To upload to your live GitHub repository:
1. Log into your GitHub account and navigate to your `btrt-rubric` repository.
2. Select your `main` or `gh-pages` branch.
3. Replace the legacy contents of your root folder with these three files:
   - `index.html`
   - `styles.css`
   - `script.js`
4. Commit the changes and push to your remote repository.
5. Wait ~60 seconds. Your upgraded BTRT awards portal is now active on your GitHub Pages site!

---

## 🔬 Testing the Complete Mock Flow

Follow these simple steps to demonstrate the prototype to HR stakeholders:
1. **Load Initial Data**: Click **Reset 8 High-Fidelity Demo Cases** on the home screen sidebar to populate the system cache instantly.
2. **Submit a New Nomination**: Go to the **Submit Nomination** tab and click **Pre-fill Form with STAR Sample**. Hit submit. You will receive a unique Reference Receipt Code (e.g., `BTRT-7948`) indicating safe record capture.
3. **Log in as Reviewer**: Click **Reviewer Access** in the top-right header and enter the passcode:  
   `BTRT2026`  
   This unlocks administrative controls.
4. **Endorse & Shortlist candidates**: Go to the **HR/HOD Review Workspace** and select any nomination card to slide over the detailed assessment panel. Toggle checkboxes, enter vetting notes, and click **Quick-Shortlist as Finalist**.
5. **Direct Star Evaluations**: Navigate to the **Judge Scoring Panel** to evaluate the shortlisted finalists against the standard 5-point rubric. Submit comments for the candidate and save.
6. **Watch Live Rankings**: Go to the **Leaderboard Rankings** to see candidates ranked in real-time based on calculated judge percentages.
7. **Download Data Reports**: Click **Deploy Static Files** to export the entire local database to professional JSON or CSV files (compatible with standard Microsoft Excel / Google Sheets).

---

## 📋 Standard Industrial Best Practices
- **No confidential data**: Since GitHub Pages is completely public, do not upload real peer details. Only use our mock demo assets.
- **Enterprise Scale-up (Future Roadmap)**: When transitioning from a mock portal to active secure production, simply hook standard Microsoft Active Directory for SSO and connect the form actions directly to an **n8n / Power Automate** webhook forwarding inputs to a secure **SharePoint List / Microsoft Dataverse** array.
