# BTRT Awards 2026 Nomination & Vetting Portal

Welcome to the fully upgraded **BTRT Awards 2026 Nomination Portal**. 

This system guides employees from initial peer nomination write-ups through HR/HOD safety checks, corporate shortlisting, senior judicial scoring, and live ranked leaderboards. It is designed to be highly secure, lightning-fast, and completely self-sustainable.

---

## 📂 Project Architecture

To give you the absolute best developer experience, we have provided two separate configurations:

1. **Vite React & Tailwind SPA (`/src/` & `/src/App.tsx`)**
   - The primary application booting in your **AI Studio Live Preview iframe**.
   - Fully optimized with animations, state management, and real-time calculation.
   - Saves all state securely in the browser's `localStorage` context.

2. **Standalone Standalone HTML Pages (`/static-github-pages/`)**
   - The exact, pure static files (`index.html`, `styles.css`, `script.js`, and `README.md`) requested for direct copy-pasting to your legency GitHub Pages repository.
   - Zero external compile dependencies. Simply drop them in and they will run perfectly!

---

## 🌟 Upgraded UX / UI Features

- **Pristine Typography Pairing**: Elegant **Space Grotesk** display titles matched with high-contrast **Inter** sub-components and **JetBrains Mono** digital identifiers.
- **Dynamic S.T.A.R. Case Formulation**: Guided fields helping submitters state precise **Situations, Tasks, Actions, and measurable Results** with short, helpful placeholder guides.
- **Single Passcode Portal Gate**: A clean, responsive administrative SSO mockup checking for the passcode:  
  `BTRT2026`
- **Vetting Checklist drawer**: HODs and review committees can view nominations and click on them to slide open a review screen to checklist-check, notes-annotate, and status-endorse.
- **Leaderboard Rankings**: Automatically computes and lists finalist averages across judges based on a weighted 5-criteria score range (1-5 star ratings).
- **Spreadsheet/JSON Data Exports**: Download entire lists directly as ready-to-import CSVs or clean raw JSON files.

---

## 🛠️ Detailed Vetting Flow

To test the complete mock journey:
1. Open the portal home. Under the administrative or developer console, click **Reset 8 High-Fidelity Demo Cases** to load initial mock profiles.
2. Formulate a new S.T.A.R recommendation under **Submit Nomination** or click **Pre-Fill Form with STAR Sample**. Hit submit.
3. Access the administrative view by clicking **Reviewer Access** and logging in with the key `BTRT2026`.
4. Go to **HR/HOD Review Workspace** to endorsement-mark your candidate as a `Finalist` and confirm Director-level eligibility.
5. Head to **Judge Scoring Panel** to evaluate the finalist's impact, togetherness and core values on a 5-point star scorecard.
6. Access the **Leaderboard Rankings** to view real-time global candidate placements.
7. Click the **Deploy Static Files** panel to download absolute CSV checklists or backup JSON logs.
