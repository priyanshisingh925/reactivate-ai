import express from "express";
import cors from "cors";
import accountsRouter from "./routes/accounts.js";
import uploadRouter  from "./routes/upload.js";
import smsAndAiRouter from "./routes/smsAndAi.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ["http://localhost:5173","http://localhost:3000","http://127.0.0.1:5173"] }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use((req, _res, next) => { console.log(`${req.method} ${req.path}`); next(); });

app.use("/api/accounts", accountsRouter);
app.use("/api/upload",   uploadRouter);
app.use("/api/sms",      smsAndAiRouter);
app.use("/api/ai",       smsAndAiRouter);

app.get("/api/health", (_req, res) => res.json({
  status: "ok", service: "ReActivate AI", version: "1.0.0",
  aiEngine: "Random Forest — 50 trees, 8 features", languages: 7,
}));

app.use((_req, res) => res.status(404).json({ success: false, error: "Route not found" }));
app.use((err, _req, res, _next) => { console.error(err); res.status(500).json({ success: false, error: err.message }); });

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════╗
║         ReActivate AI — Backend :${PORT}            ║
╠══════════════════════════════════════════════════╣
║  AI Engine : Random Forest (50 trees, 8 features)║
║  Languages : Hindi Tamil Telugu Marathi           ║
║              Bengali Kannada Gujarati             ║
║  Health    : http://localhost:${PORT}/api/health   ║
╚══════════════════════════════════════════════════╝
  `);
});
