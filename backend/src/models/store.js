import { v4 as uuidv4 } from "uuid";
import { scoreAccount } from "../services/randomForest.js";

export const LANGUAGES = ["Hindi","Tamil","Telugu","Marathi","Bengali","Kannada","Gujarati"];
export const STATUSES  = ["Pending","Contacted","Reactivated","DEAF Fund","Failed"];
export const ACCOUNT_TYPES = ["Savings","Current","Fixed Deposit","NRE","Salary"];
export const BRANCHES = [
  "Mumbai Central","Delhi Connaught","Chennai T.Nagar","Kolkata Park St",
  "Bengaluru MG Road","Hyderabad Banjara","Ahmedabad CG Road","Pune FC Road",
  "Jaipur MI Road","Lucknow Hazratganj","Surat Ring Road","Bhopal MP Nagar",
];

const NAMES = [
  "Priya Sharma","Rajesh Kumar","Anita Patel","Suresh Nair","Meena Iyer",
  "Vijay Reddy","Kavitha Menon","Arjun Singh","Sunita Devi","Ramesh Babu",
  "Fatima Sheikh","Kiran Desai","Manoj Tiwari","Lakshmi Rao","Deepak Joshi",
  "Shobha Pillai","Arun Mishra","Pooja Agarwal","Santosh Yadav","Rekha Verma",
  "Harish Chand","Usha Kumari","Prakash Bhat","Divya Nath","Mohan Lal",
  "Sarala Devi","Venkat Krishnan","Nalini Shah","Bharat Gupta","Champa Bose",
  "Ganesh Patil","Indira Sahu","Kartik Mehta","Leela Nair","Sunil Chandra",
  "Asha Murthy","Pawan Kumar","Geeta Pandey","Vinod Tiwari","Madhu Reddy",
  "Renu Sinha","Sanjay Chauhan","Yamini Jain","Dilip Bhatt","Saroj Ghosh",
  "Tarun Kapoor","Uma Pillai","Mukesh Jha","Nirmala Shetty","Ashok Rao",
  "Bhavna Mehta","Chetan Shah","Durga Prasad","Esha Gupta","Firoz Khan",
  "Girish Nambiar","Hema Devi","Irfan Shaikh","Jayashree Patil","Kapil Sharma",
  "Lalitha Kumari","Mahesh Babu","Nandita Das","Om Prakash","Padma Srinivas",
  "Rohini Sharma","Suman Dey","Tulsi Ram","Vaibhav Joshi","Amit Banerjee",
  "Bina Roy","Chandra Shekhar","Deepa Nair","Eshwar Reddy","Falguni Shah",
  "Yogesh Mishra","Zara Khan","Harpreet Kaur","Balaji Rao","Chandni Verma",
  "Devika Menon","Farhan Sheikh","Govind Das","Heena Patel","Ishaan Gupta",
];

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s += 0x6d2b79f5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateSeedAccounts(n = 80) {
  const r = rng(20240101);
  return Array.from({ length: n }, (_, i) => {
    const dormancyMonths = Math.floor(r() * 55) + 6;
    const statusRand = r();
    const status =
      dormancyMonths > 40 && r() > 0.55 ? "DEAF Fund"
      : statusRand < 0.30 ? "Pending"
      : statusRand < 0.55 ? "Contacted"
      : statusRand < 0.75 ? "Reactivated"
      : "Failed";

    const acc = {
      id: `ACC${String(10000 + i).padStart(5, "0")}`,
      uuid: uuidv4(),
      name: NAMES[i % NAMES.length],
      phone: `+91 ${String(Math.floor(7000000000 + r() * 2900000000))}`,
      email: `${NAMES[i % NAMES.length].split(" ")[0].toLowerCase()}${10 + i}@email.com`,
      language: LANGUAGES[Math.floor(r() * LANGUAGES.length)],
      dormancyMonths,
      balance: Math.floor(r() * 480000) + 500,
      age: Math.floor(r() * 55) + 22,
      prevContacts: Math.floor(r() * 4),
      transactionHistoryScore: parseFloat((r() * 0.85 + 0.1).toFixed(3)),
      languageEngagementScore: parseFloat((r() * 0.85 + 0.1).toFixed(3)),
      accountTypeScore: parseFloat((r() * 0.8 + 0.2).toFixed(3)),
      branchActivityScore: parseFloat((r() * 0.85 + 0.1).toFixed(3)),
      accountType: ACCOUNT_TYPES[Math.floor(r() * ACCOUNT_TYPES.length)],
      branch: BRANCHES[Math.floor(r() * BRANCHES.length)],
      status,
      lastContact: status !== "Pending" ? `${Math.floor(r() * 28) + 1} Jan 2025` : null,
      joinedDate: `${Math.floor(r() * 28) + 1}/${Math.floor(r() * 12) + 1}/${2012 + Math.floor(r() * 8)}`,
      createdAt: new Date(Date.now() - Math.floor(r() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
      updatedAt: new Date().toISOString(),
      notes: "",
    };
    acc.aiScore = scoreAccount(acc);
    return acc;
  });
}

class AccountStore {
  constructor() {
    this.accounts = generateSeedAccounts(80);
    const r2 = rng(42);
    this.outreachLog = this.accounts
      .filter(a => a.status !== "Pending")
      .map(a => ({
        id: uuidv4(), accountId: a.id,
        channel: ["SMS","Email","IVR"][Math.floor(r2() * 3)],
        language: a.language,
        sentAt: new Date(Date.now() - Math.floor(r2() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
        delivered: r2() > 0.06,
        opened: r2() > 0.39,
        status: a.status,
      }));
  }

  getAll({ status, language, search, sortBy = "aiScore", sortDir = "desc", page = 1, limit = 15 } = {}) {
    let list = [...this.accounts];
    if (status && status !== "All") list = list.filter(a => a.status === status);
    if (language && language !== "All") list = list.filter(a => a.language === language);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(a => a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      const m = sortDir === "desc" ? -1 : 1;
      if (sortBy === "name") return m * a.name.localeCompare(b.name);
      return m * ((a[sortBy] || 0) - (b[sortBy] || 0));
    });
    const total = list.length;
    return { data: list.slice((page - 1) * limit, page * limit), total, page, totalPages: Math.ceil(total / limit), limit };
  }

  getById(id) { return this.accounts.find(a => a.id === id || a.uuid === id) || null; }

  create(data) {
    const acc = {
      id: `ACC${String(10000 + this.accounts.length + 1).padStart(5, "0")}`,
      uuid: uuidv4(),
      name: data.name || "Unknown",
      phone: data.phone || "",
      email: data.email || "",
      language: LANGUAGES.includes(data.language) ? data.language : "Hindi",
      dormancyMonths: parseInt(data.dormancyMonths) || 12,
      balance: parseFloat(data.balance) || 10000,
      age: parseInt(data.age) || 35,
      prevContacts: parseInt(data.prevContacts) || 0,
      transactionHistoryScore: parseFloat(data.transactionHistoryScore) || 0.5,
      languageEngagementScore: parseFloat(data.languageEngagementScore) || 0.5,
      accountTypeScore: parseFloat(data.accountTypeScore) || 0.5,
      branchActivityScore: parseFloat(data.branchActivityScore) || 0.5,
      accountType: ACCOUNT_TYPES.includes(data.accountType) ? data.accountType : "Savings",
      branch: data.branch || BRANCHES[0],
      status: "Pending", lastContact: null,
      joinedDate: new Date().toLocaleDateString("en-IN"),
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      notes: data.notes || "",
    };
    acc.aiScore = scoreAccount(acc);
    this.accounts.unshift(acc);
    return acc;
  }

  update(id, data) {
    const idx = this.accounts.findIndex(a => a.id === id || a.uuid === id);
    if (idx === -1) return null;
    const updated = { ...this.accounts[idx], ...data, id: this.accounts[idx].id, uuid: this.accounts[idx].uuid, updatedAt: new Date().toISOString() };
    if (data.status && data.status !== "Pending") updated.lastContact = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    updated.aiScore = scoreAccount(updated);
    this.accounts[idx] = updated;
    return updated;
  }

  delete(id) {
    const idx = this.accounts.findIndex(a => a.id === id || a.uuid === id);
    if (idx === -1) return false;
    this.accounts.splice(idx, 1); return true;
  }

  bulkCreate(records) { return records.map(r => this.create(r)); }

  getStats() {
    const total = this.accounts.length;
    const byStatus = Object.fromEntries(STATUSES.map(s => [s, this.accounts.filter(a => a.status === s).length]));
    const byLanguage = Object.fromEntries(LANGUAGES.map(l => [l, this.accounts.filter(a => a.language === l).length]));
    const totalBalance = this.accounts.reduce((s, a) => s + a.balance, 0);
    const recoveredBalance = this.accounts.filter(a => a.status === "Reactivated").reduce((s, a) => s + a.balance, 0);
    const r = rng(7777);
    return {
      total, byStatus, byLanguage, totalBalance, recoveredBalance,
      avgAiScore: Math.round(this.accounts.reduce((s, a) => s + a.aiScore, 0) / total),
      reactivationRate: parseFloat(((byStatus["Reactivated"] / total) * 100).toFixed(2)),
      deafRate: parseFloat(((byStatus["DEAF Fund"] / total) * 100).toFixed(2)),
      casaGrowth: parseFloat(((byStatus["Reactivated"] / total) * 100).toFixed(2)),
      outreachSent: this.accounts.filter(a => a.status !== "Pending").length,
      highPriority: this.accounts.filter(a => a.aiScore >= 75).length,
      monthly: Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2025, i, 1).toLocaleString("default", { month: "short" }),
        reactivated: i === 11 ? byStatus["Reactivated"] : Math.floor(10 + Math.sin(i * 0.6) * 8 + i * 3 + r() * 5),
      })),
      outreachStats: {
        total: this.outreachLog.length,
        delivered: this.outreachLog.filter(o => o.delivered).length,
        opened: this.outreachLog.filter(o => o.opened).length,
        byChannel: { SMS: this.outreachLog.filter(o => o.channel==="SMS").length, Email: this.outreachLog.filter(o => o.channel==="Email").length, IVR: this.outreachLog.filter(o => o.channel==="IVR").length },
      },
    };
  }

  getOutreachLog({ page = 1, limit = 20, language, channel } = {}) {
    let logs = [...this.outreachLog];
    if (language && language !== "All") logs = logs.filter(l => l.language === language);
    if (channel && channel !== "All") logs = logs.filter(l => l.channel === channel);
    return { data: logs.slice((page-1)*limit, page*limit), total: logs.length, page, totalPages: Math.ceil(logs.length/limit) };
  }
}

export const store = new AccountStore();
