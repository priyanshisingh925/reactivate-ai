import { useState } from "react";
import Dashboard   from "./pages/Dashboard.jsx";
import Explanation from "./pages/Explanation.jsx";
import SMSPage     from "./pages/SMS.jsx";
import DormantPage from "./pages/Dormant.jsx";

const NAV = [
  { id:"dashboard",   icon:"▣",  label:"Dashboard"      },
  { id:"explanation", icon:"📖", label:"About Project"  },
  { id:"sms",         icon:"📱", label:"SMS & Comms"    },
  { id:"dormant",     icon:"🏦", label:"Reactivation"   },
];

const CSS = `
  .app{display:flex;min-height:100vh;}
  .page{padding:36px 40px;animation:fadeIn 0.3s ease;}
  @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  .page-title{font-family:var(--syne);font-size:26px;font-weight:700;margin-bottom:4px;}
  .page-sub{font-size:14px;color:var(--text2);}
  .chart-card{background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:24px;}
  .chart-title{font-family:var(--syne);font-size:14px;font-weight:600;margin-bottom:20px;}
  .table-card{background:var(--bg2);border:1px solid var(--border);border-radius:12px;overflow:hidden;}
  .table-header{padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;}
  .table-title{font-family:var(--syne);font-size:14px;font-weight:600;}
  .filter-select{background:var(--bg3);border:1px solid var(--border2);border-radius:8px;padding:9px 12px;font-size:13px;color:var(--text);font-family:var(--dm);outline:none;cursor:pointer;}
  .filter-select:focus{border-color:var(--accent);}
  @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
`;

export default function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <>
      <style>{CSS}</style>
      <div className="app">

        {/* ── SIDEBAR ── */}
        <aside style={{
          width:220, minHeight:"100vh", background:"var(--bg2)",
          borderRight:"1px solid var(--border)",
          display:"flex", flexDirection:"column",
          position:"fixed", left:0, top:0, zIndex:100,
        }}>
          {/* Logo */}
          <div style={{ padding:"28px 20px 20px", borderBottom:"1px solid var(--border)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,var(--accent),#0066ff)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:800, color:"#fff", fontFamily:"var(--syne)", boxShadow:"0 0 16px rgba(0,210,255,0.4)" }}>R</div>
              <span style={{ fontFamily:"var(--syne)", fontSize:15, fontWeight:700 }}>ReActivate AI</span>
            </div>
            <div style={{ fontSize:11, color:"var(--text2)", letterSpacing:"0.04em" }}>Dormant Account Intelligence</div>
          </div>

          {/* Nav items */}
          <nav style={{ flex:1, padding:"16px 12px", display:"flex", flexDirection:"column", gap:2 }}>
            {NAV.map(n => (
              <div key={n.id} onClick={() => setPage(n.id)} style={{
                display:"flex", alignItems:"center", gap:12,
                padding:"10px 12px", borderRadius:8, cursor:"pointer",
                fontSize:13.5, fontWeight:500, fontFamily:"var(--dm)",
                color:       page===n.id ? "var(--accent)" : "var(--text2)",
                background:  page===n.id ? "rgba(0,210,255,0.08)" : "transparent",
                border:`1px solid ${page===n.id ? "rgba(0,210,255,0.2)" : "transparent"}`,
                transition:"all 0.2s",
              }}>
                <span style={{ fontSize:16, width:20, textAlign:"center" }}>{n.icon}</span>
                <span>{n.label}</span>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div style={{ padding:16, borderTop:"1px solid var(--border)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:"var(--text2)" }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:"var(--green)", boxShadow:"0 0 6px var(--green)" }} />
              <span>AI: 50 trees active</span>
            </div>
            <div style={{ fontSize:11, color:"var(--text3)", marginTop:6 }}>v1.0 · Hackathon 2025</div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main style={{ marginLeft:220, flex:1, minHeight:"100vh" }}>
          {page==="dashboard"   && <Dashboard />}
          {page==="explanation" && <Explanation />}
          {page==="sms"         && <SMSPage />}
          {page==="dormant"     && <DormantPage />}
        </main>

      </div>
    </>
  );
}
