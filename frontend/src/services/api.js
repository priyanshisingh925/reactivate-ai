const BASE = "/api";
async function req(path, opts = {}) {
  const r = await fetch(`${BASE}${path}`, { headers: { "Content-Type": "application/json", ...opts.headers }, ...opts });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "Request failed");
  return j;
}
export const api = {
  getAccounts: (p = {}) => { const q = new URLSearchParams(Object.entries(p).filter(([,v]) => v !== undefined && v !== "")).toString(); return req(`/accounts?${q}`); },
  getStats: () => req("/accounts/stats"),
  getAccount: id => req(`/accounts/${id}`),
  createAccount: d => req("/accounts", { method: "POST", body: JSON.stringify(d) }),
  updateAccount: (id, d) => req(`/accounts/${id}`, { method: "PUT", body: JSON.stringify(d) }),
  deleteAccount: id => req(`/accounts/${id}`, { method: "DELETE" }),
  uploadCSV: file => { const f = new FormData(); f.append("file", file); return fetch(`${BASE}/upload/csv`, { method: "POST", body: f }).then(r => r.json()); },
  downloadTemplate: () => { window.location.href = `${BASE}/upload/template`; },
  getSMS: id => req(`/sms/account/${id}`),
  getStats2: () => req("/accounts/stats"),
  getTopAccounts: (n = 10) => req(`/ai/top/${n}`),
  getFeatureImportance: () => req("/ai/feature-importance"),
  scorePreview: d => req("/ai/score", { method: "POST", body: JSON.stringify(d) }),
  batchRescore: () => req("/ai/batch-score", { method: "POST" }),
  health: () => req("/health"),
};
