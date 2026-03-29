# ReActivate AI 🏦
### AI-Powered Dormant Account Reactivation Platform

---

## ▶ HOW TO RUN

### Step 1 — Install Node.js (only once ever)
Download from **https://nodejs.org** → choose the LTS version → install it.

### Step 2 — Run the app

**Windows:** Double-click `START.bat`

**Mac/Linux:** Open terminal in this folder and run:
```
node start.js
```

That's it. The script will:
1. Auto-install all packages (first time only, ~60 seconds)
2. Start the backend API server (port 3001)
3. Start the frontend (port 5173)
4. Open http://localhost:5173 in your browser automatically

**To stop:** Press `Ctrl+C` in the terminal window.


---

## What This Project Does

**ReActivate AI** solves two RBI-aligned banking problems:

### Problem 4 — Winning Back DEAF & Dormant Account Holders
- AI (Random Forest, 50 trees) scores every dormant account 0–100 on reactivation probability
- 8 features: dormancy duration, balance, age, transaction history, branch activity, and more
- Triages accounts into HIGH / MEDIUM / LOW priority — saves 40%+ outreach costs
- Full CRUD — add single accounts or bulk import via CSV

### Problem 7 — Regional Language SMS & Communication
- Personalized SMS, Email, and IVR scripts in 7 Indian languages
- Hindi, Tamil, Telugu, Marathi, Bengali, Kannada, Gujarati
- Customer name, account ID, balance, and branch dynamically filled
- English translation toggle for bank staff reviewing messages

---

## Pages

| Page | What it shows |
|------|--------------|
| **Dashboard** | Live stats — dormant accounts, DEAF fund, CASA growth, AI scores, charts |
| **About Project** | Full explanation — problem, AI architecture, decision tree logic, language coverage |
| **SMS & Comms** | Preview every customer's message in their language + English translation toggle |
| **Reactivation** | Account table with AI scores, status updates, add single account, bulk CSV import |

---

## Folder Structure

```
ReActivateAI/
├── START.bat          ← Windows: double-click this
├── start.js           ← The actual launcher (Node.js)
├── README.md
├── backend/
│   ├── package.json
│   └── src/
│       ├── server.js              Express API (port 3001)
│       ├── routes/
│       │   ├── accounts.js        CRUD + AI rescore
│       │   ├── upload.js          CSV bulk import
│       │   └── smsAndAi.js        SMS preview + AI endpoints
│       ├── services/
│       │   ├── randomForest.js    AI engine (50 trees, pure JS)
│       │   └── smsService.js      7-language message templates
│       └── models/
│           └── store.js           In-memory store + 80 seed accounts
└── frontend/
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx                Sidebar + routing
        ├── pages/
        │   ├── Dashboard.jsx
        │   ├── Explanation.jsx
        │   ├── SMS.jsx
        │   └── Dormant.jsx
        ├── components/ui.jsx
        └── services/api.js
```

---

*Stack: Node.js · Express · React 18 · Vite · Random Forest (pure JS)*
*Hackathon — RBI Problems 4 & 7*
