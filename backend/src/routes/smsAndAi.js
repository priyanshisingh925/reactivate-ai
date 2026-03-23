import { Router } from "express";
import { store } from "../models/store.js";
import { generateMessages, getSupportedLanguages } from "../services/smsService.js";
import { featureImportance, scoreTier, scoreAccount, extractFeatures } from "../services/randomForest.js";

const router = Router();

router.get("/languages", (_req, res) => res.json({ success: true, data: getSupportedLanguages() }));

router.get("/account/:id", (req, res) => {
  const a = store.getById(req.params.id);
  if (!a) return res.status(404).json({ success: false, error: "Not found" });
  res.json({ success: true, data: generateMessages(a), account: { id: a.id, name: a.name, language: a.language } });
});

router.get("/outreach", (req, res) => {
  const { page, limit, language, channel } = req.query;
  res.json({ success: true, ...store.getOutreachLog({ page: +page||1, limit: +limit||20, language, channel }) });
});

router.get("/feature-importance", (_req, res) => res.json({ success: true, data: featureImportance() }));

router.post("/score", (req, res) => {
  const score = scoreAccount(req.body);
  const features = extractFeatures(req.body);
  res.json({
    success: true,
    data: {
      score, tier: scoreTier(score),
      features: features.map((v, i) => ({
        name: ["dormancy_ratio","balance_score","age_score","contact_score","txn_history","lang_engagement","account_type","branch_activity"][i],
        value: parseFloat(v.toFixed(4)),
      })),
    },
  });
});

router.get("/top/:n", (req, res) => {
  const n = Math.min(+req.params.n || 10, 100);
  const data = store.getAll({ sortBy: "aiScore", sortDir: "desc", limit: n }).data;
  res.json({ success: true, data: data.map(a => ({ id: a.id, name: a.name, aiScore: a.aiScore, tier: scoreTier(a.aiScore), language: a.language, status: a.status, dormancyMonths: a.dormancyMonths, balance: a.balance })) });
});

router.post("/batch-score", (_req, res) => {
  let rescored = 0;
  store.accounts.forEach(a => { const s = scoreAccount(a); if (s !== a.aiScore) { store.update(a.id, { aiScore: s }); rescored++; } });
  res.json({ success: true, message: `Rescored ${store.accounts.length} accounts (${rescored} updated)` });
});

export default router;
