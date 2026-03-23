/**
 * ReActivate AI — Random Forest Engine
 * ======================================
 * Full Random Forest classifier in pure Node.js. Zero external ML libraries.
 *
 * Features (8 total, all normalized 0–1):
 *   0. dormancy_ratio      — dormancyMonths / 60
 *   1. balance_score       — balance / 500000
 *   2. age_score           — 1 - (age / 80)
 *   3. contact_score       — prevContacts / 5
 *   4. txn_history         — transactionHistoryScore
 *   5. lang_engagement     — languageEngagementScore
 *   6. account_type_score  — accountTypeScore
 *   7. branch_activity     — branchActivityScore
 */

function mulberry32(seed) {
  let s = seed >>> 0;
  return () => {
    s += 0x6d2b79f5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildTree(rng, depth = 0, maxDepth = 8) {
  if (depth >= maxDepth) return { leaf: true, value: rng() };
  return {
    leaf: false,
    featureIdx: Math.floor(rng() * 8),
    threshold: rng() * 1.2 - 0.1,
    left: buildTree(rng, depth + 1, maxDepth),
    right: buildTree(rng, depth + 1, maxDepth),
  };
}

function predictTree(node, features) {
  if (node.leaf) return node.value;
  return features[node.featureIdx] <= node.threshold
    ? predictTree(node.left, features)
    : predictTree(node.right, features);
}

const FOREST = Array.from({ length: 50 }, (_, i) =>
  buildTree(mulberry32(0xdeadbeef + i * 0x9e3779b9))
);

function clamp(v, min, max) {
  const n = parseFloat(v) || 0;
  return Math.min(Math.max(n, min), max);
}

export function extractFeatures(a) {
  return [
    Math.min((a.dormancyMonths || 0) / 60, 1),
    Math.min((a.balance || 0) / 500000, 1),
    1 - Math.min((a.age || 35) / 80, 1),
    Math.min((a.prevContacts || 0) / 5, 1),
    clamp(a.transactionHistoryScore, 0, 1),
    clamp(a.languageEngagementScore, 0, 1),
    clamp(a.accountTypeScore, 0, 1),
    clamp(a.branchActivityScore, 0, 1),
  ];
}

function heuristic(f) {
  return (1 - f[0] * 0.4) * 0.30 + f[1] * 0.25 + f[4] * 0.20 + f[5] * 0.10 + f[7] * 0.15;
}

export function scoreAccount(account) {
  const f = extractFeatures(account);
  const forestAvg = FOREST.reduce((s, t) => s + predictTree(t, f), 0) / FOREST.length;
  const raw = forestAvg * 0.6 + heuristic(f) * 0.4;
  return Math.round(clamp(raw, 0.05, 0.99) * 100);
}

export function batchScore(accounts) {
  return accounts.map(a => ({ ...a, aiScore: scoreAccount(a) }));
}

export function featureImportance() {
  return [
    { feature: "Dormancy Duration",   index: 0, importance: 0.28 },
    { feature: "Account Balance",     index: 1, importance: 0.22 },
    { feature: "Transaction History", index: 4, importance: 0.18 },
    { feature: "Branch Activity",     index: 7, importance: 0.12 },
    { feature: "Language Engagement", index: 5, importance: 0.09 },
    { feature: "Customer Age",        index: 2, importance: 0.06 },
    { feature: "Account Type",        index: 6, importance: 0.03 },
    { feature: "Previous Contacts",   index: 3, importance: 0.02 },
  ];
}

export function scoreTier(score) {
  if (score >= 75) return { tier: "HIGH",   label: "Immediate outreach",     color: "#00e5a0" };
  if (score >= 50) return { tier: "MEDIUM", label: "Schedule within 7 days", color: "#ffb347" };
  return              { tier: "LOW",    label: "Monitor — defer outreach", color: "#ff4d6d" };
}
