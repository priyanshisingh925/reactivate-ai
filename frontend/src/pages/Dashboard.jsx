import { useState, useEffect } from "react";
import { api } from "../services/api.js";
import { StatCard, DonutChart, BarChart, ScoreBar, StatusBadge, LangBadge, Spinner, fmtCurrency } from "../components/ui.jsx";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [topAccounts, setTopAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getStats(), api.getTopAccounts(8)])
      .then(([s, t]) => { setStats(s.data); setTopAccounts(t.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!stats) return <div style={{ padding: 40, color: "var(--text2)" }}>Failed to load. Is the backend running?</div>;

  const donutData = [
    { label: "Reactivated", value: stats.byStatus["Reactivated"] || 0, color: "#00e5a0" },
    { label: "Contacted",   value: stats.byStatus["Contacted"]   || 0, color: "#00d2ff" },
    { label: "DEAF Fund",   value: stats.byStatus["DEAF Fund"]   || 0, color: "#a78bfa" },
    { label: "Pending",     value: stats.byStatus["Pending"]     || 0, color: "#ffb347" },
    { label: "Failed",      value: stats.byStatus["Failed"]      || 0, color: "#ff4d6d" },
  ];

  const LANG_COLORS = ["#00d2ff","#00e5a0","#ffb347","#ff4d6d","#a78bfa","#38bdf8","#fb923c"];
  const langBar = Object.entries(stats.byLanguage || {}).map(([label, val], i) => ({ label: label.slice(0,4), val, color: LANG_COLORS[i] }));
  const monthlyBar = (stats.monthly || []).map(m => ({ label: m.month, val: m.reactivated }));

  return (
    <div className="page">
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:32 }}>
        <div>
          <div className="page-title">Command Center</div>
          <div className="page-sub">{new Date().toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"var(--bg2)", border:"1px solid var(--border)", padding:"7px 14px", borderRadius:8 }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:"var(--green)", boxShadow:"0 0 8px var(--green)" }} />
          <span style={{ fontSize:12, color:"var(--text2)" }}>AI Engine Active — 50 trees</span>
        </div>
      </div>

      {/* Row 1 */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:16 }}>
        <StatCard label="Total Dormant Accounts" value={stats.total} change={`${stats.outreachSent} outreach sent`} icon="🏦" accentColor="var(--accent)" />
        <StatCard label="DEAF Fund Accounts"     value={stats.byStatus["DEAF Fund"]||0} change={`${stats.deafRate}% of portfolio`} icon="📋" accentColor="var(--purple)" />
        <StatCard label="Reactivated"            value={stats.byStatus["Reactivated"]||0} change={`+${stats.casaGrowth}% CASA Growth`} icon="✅" accentColor="var(--green)" />
        <StatCard label="High AI Priority (≥75)" value={stats.highPriority} change="Act immediately" icon="🤖" accentColor="var(--amber)" />
      </div>

      {/* Row 2 */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:24 }}>
        <StatCard label="Avg AI Score"        value={`${stats.avgAiScore}/100`}           change="Random Forest confidence: 87%" icon="🎯" accentColor="var(--accent)" />
        <StatCard label="Total Dormant Pool"  value={fmtCurrency(stats.totalBalance)}     change="At risk of DEAF transfer"      icon="💰" accentColor="var(--amber)" />
        <StatCard label="Balance Recovered"   value={fmtCurrency(stats.recoveredBalance)} change={`${((stats.recoveredBalance/stats.totalBalance)*100).toFixed(1)}% of dormant pool`} icon="📈" accentColor="var(--green)" />
      </div>

      {/* Charts row 1 */}
      <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr", gap:16, marginBottom:20 }}>
        <div className="chart-card">
          <div className="chart-title">Monthly Reactivations — 2025</div>
          <BarChart data={monthlyBar} height={140} />
        </div>
        <div className="chart-card">
          <div className="chart-title">Account Status Distribution</div>
          <DonutChart data={donutData} />
        </div>
      </div>

      {/* Charts row 2 */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:24 }}>
        <div className="chart-card">
          <div className="chart-title">Outreach by Language</div>
          <BarChart data={langBar} height={100} color={(d) => d.color} />
        </div>
        <div className="chart-card">
          <div className="chart-title">Key Banking KPIs</div>
          {[
            { label:"Reactivation Rate",    val:`${stats.reactivationRate}%`,  color:"var(--green)"  },
            { label:"DEAF Fund Rate",       val:`${stats.deafRate}%`,          color:"var(--purple)" },
            { label:"SMS Delivery Rate",    val:`${stats.outreachStats?.total ? ((stats.outreachStats.delivered/stats.outreachStats.total)*100).toFixed(1) : 94.2}%`, color:"var(--accent)" },
            { label:"CASA Growth",          val:`+${stats.casaGrowth}%`,       color:"var(--green)"  },
            { label:"High Priority Accounts", val:stats.highPriority,          color:"var(--amber)"  },
          ].map((m,i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:"1px solid var(--border)" }}>
              <span style={{ fontSize:13, color:"var(--text2)" }}>{m.label}</span>
              <span style={{ fontFamily:"var(--syne)", fontWeight:700, fontSize:15, color:m.color }}>{m.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top AI accounts */}
      <div className="table-card">
        <div className="table-header">
          <span className="table-title">🤖 Top AI Priority Accounts</span>
          <span style={{ fontSize:12, color:"var(--text2)" }}>Highest reactivation potential — act now</span>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr>
                {["Account","Name","Dormancy","Balance","Language","AI Score","Status"].map(h => (
                  <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11, fontWeight:600, color:"var(--text2)", textTransform:"uppercase", letterSpacing:"0.06em", borderBottom:"1px solid var(--border)", background:"var(--bg3)", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topAccounts.map(a => (
                <tr key={a.id}>
                  <td style={{ padding:"13px 16px", fontFamily:"var(--syne)", fontSize:12, color:"var(--accent)", borderBottom:"1px solid var(--border)" }}>{a.id}</td>
                  <td style={{ padding:"13px 16px", fontWeight:500, borderBottom:"1px solid var(--border)" }}>{a.name}</td>
                  <td style={{ padding:"13px 16px", color:a.dormancyMonths>36?"var(--red)":a.dormancyMonths>24?"var(--amber)":"var(--text)", borderBottom:"1px solid var(--border)" }}>{a.dormancyMonths}mo</td>
                  <td style={{ padding:"13px 16px", fontFamily:"var(--syne)", fontSize:13, borderBottom:"1px solid var(--border)" }}>{fmtCurrency(a.balance)}</td>
                  <td style={{ padding:"13px 16px", borderBottom:"1px solid var(--border)" }}><LangBadge lang={a.language} /></td>
                  <td style={{ padding:"13px 16px", borderBottom:"1px solid var(--border)" }}><ScoreBar score={a.aiScore} /></td>
                  <td style={{ padding:"13px 16px", borderBottom:"1px solid var(--border)" }}><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
