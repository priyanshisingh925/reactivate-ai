import { Router } from "express";
import multer from "multer";
import { parse } from "csv-parse/sync";
import { store, LANGUAGES, ACCOUNT_TYPES, BRANCHES } from "../models/store.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post("/csv", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: "No file uploaded" });
  let records;
  try {
    records = parse(req.file.buffer.toString("utf8"), { columns: true, skip_empty_lines: true, trim: true });
  } catch (e) {
    return res.status(400).json({ success: false, error: "Invalid CSV: " + e.message });
  }
  if (!records.length) return res.status(400).json({ success: false, error: "CSV is empty" });
  if (records.length > 10000) return res.status(400).json({ success: false, error: "Max 10,000 rows" });

  const normalized = records.map(row => {
    const r = {};
    Object.entries(row).forEach(([k, v]) => { r[k.toLowerCase().replace(/[\s_\-]/g, "")] = v; });
    return {
      name: r.name || r.fullname || r.customername || "",
      phone: r.phone || r.mobile || "",
      email: r.email || "",
      language: LANGUAGES.includes(r.language) ? r.language : "Hindi",
      dormancyMonths: parseInt(r.dormancymonths || r.dormancy || r.months) || 12,
      balance: parseFloat(r.balance || r.amount) || 10000,
      age: parseInt(r.age) || 35,
      prevContacts: parseInt(r.prevcontacts || r.contacts) || 0,
      transactionHistoryScore: parseFloat(r.txnscore || r.transactionhistoryscore) || 0.5,
      languageEngagementScore: parseFloat(r.langscore || r.languageengagementscore) || 0.5,
      accountTypeScore: 0.5,
      branchActivityScore: parseFloat(r.branchactivityscore) || 0.5,
      accountType: r.accounttype || r.type || "Savings",
      branch: r.branch || BRANCHES[0],
      notes: r.notes || "",
    };
  }).filter(r => r.name.length > 0);

  if (!normalized.length) return res.status(400).json({ success: false, error: "No valid rows found. CSV must have a 'name' column." });

  const accounts = store.bulkCreate(normalized);
  res.status(201).json({
    success: true,
    message: `${accounts.length} accounts imported and AI-scored`,
    imported: accounts.length,
    skipped: records.length - normalized.length,
    scoreDistribution: {
      high: accounts.filter(a => a.aiScore >= 75).length,
      medium: accounts.filter(a => a.aiScore >= 50 && a.aiScore < 75).length,
      low: accounts.filter(a => a.aiScore < 50).length,
    },
    preview: accounts.slice(0, 5).map(a => ({ id: a.id, name: a.name, aiScore: a.aiScore, language: a.language })),
  });
});

router.get("/template", (_req, res) => {
  const csv = [
    "name,phone,email,language,dormancy_months,balance,age,account_type,branch,prev_contacts,txn_score,lang_score,notes",
    "Priya Sharma,+919876543210,priya@email.com,Tamil,24,45000,35,Savings,Chennai T.Nagar,1,0.7,0.8,High value",
    "Rajesh Kumar,+919123456789,rajesh@email.com,Hindi,36,12000,42,Current,Delhi Connaught,0,0.4,0.6,",
    "Anita Patel,+917654321098,anita@email.com,Gujarati,18,89000,29,Savings,Ahmedabad CG Road,2,0.8,0.9,",
  ].join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=reactivate_ai_template.csv");
  res.send(csv);
});

export default router;
