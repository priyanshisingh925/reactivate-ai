import { Router } from "express";
import { store } from "../models/store.js";
import { scoreAccount, scoreTier } from "../services/randomForest.js";

const router = Router();

router.get("/", (req, res) => {
  const { status, language, search, sortBy, sortDir, page, limit } = req.query;
  res.json({ success: true, ...store.getAll({ status, language, search, sortBy, sortDir, page: +page||1, limit: +limit||15 }) });
});

router.get("/stats", (_req, res) => {
  res.json({ success: true, data: store.getStats() });
});

router.get("/:id", (req, res) => {
  const a = store.getById(req.params.id);
  if (!a) return res.status(404).json({ success: false, error: "Not found" });
  res.json({ success: true, data: { ...a, scoreTier: scoreTier(a.aiScore) } });
});

router.post("/", (req, res) => {
  const a = store.create(req.body);
  res.status(201).json({ success: true, data: a, message: `${a.id} created — AI score: ${a.aiScore}` });
});

router.put("/:id", (req, res) => {
  const a = store.update(req.params.id, req.body);
  if (!a) return res.status(404).json({ success: false, error: "Not found" });
  res.json({ success: true, data: a });
});

router.delete("/:id", (req, res) => {
  if (!store.delete(req.params.id)) return res.status(404).json({ success: false, error: "Not found" });
  res.json({ success: true });
});

router.post("/:id/score", (req, res) => {
  const a = store.getById(req.params.id);
  if (!a) return res.status(404).json({ success: false, error: "Not found" });
  const newScore = scoreAccount(a);
  store.update(req.params.id, { aiScore: newScore });
  res.json({ success: true, data: { id: a.id, previousScore: a.aiScore, newScore, tier: scoreTier(newScore) } });
});

export default router;
