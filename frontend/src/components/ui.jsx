import { useEffect } from "react";

export const scoreColor = s => s >= 75 ? "#00e5a0" : s >= 50 ? "#ffb347" : "#ff4d6d";

export function ScoreBar({ score }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <div style={{ width:60, height:5, background:"var(--bg3)", borderRadius:3, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${score}%`, background:scoreColor(score), borderRadius:3 }} />
      </div>
      <span style={{ fontFamily:"var(--syne)", fontSize:12, fontWeight:700, color:scoreColor(score), minWidth:26 }}>{score}</span>
    </div>
  );
}

const BADGE = {
  Reactivated:{ bg:"rgba(0,229,160,0.1)",   color:"#00e5a0", border:"rgba(0,229,160,0.2)"  },
  Contacted:  { bg:"rgba(0,210,255,0.1)",   color:"#00d2ff", border:"rgba(0,210,255,0.2)"  },
  Pending:    { bg:"rgba(255,179,71,0.1)",  color:"#ffb347", border:"rgba(255,179,71,0.2)" },
  "DEAF Fund":{ bg:"rgba(167,139,250,0.1)", color:"#a78bfa", border:"rgba(167,139,250,0.2)"},
  Failed:     { bg:"rgba(255,77,109,0.1)",  color:"#ff4d6d", border:"rgba(255,77,109,0.2)" },
};
export function StatusBadge({ status }) {
  const s = BADGE[status] || { bg:"rgba(122,136,153,0.1)", color:"#7a8899", border:"rgba(122,136,153,0.2)" };
  return <span style={{ display:"inline-flex", alignItems:"center", padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, fontFamily:"var(--syne)", background:s.bg, color:s.color, border:`1px solid ${s.border}` }}>{status}</span>;
}
export function LangBadge({ lang }) {
  return <span style={{ display:"inline-flex", alignItems:"center", padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, fontFamily:"var(--syne)", background:"rgba(0,210,255,0.1)", color:"#00d2ff", border:"1px solid rgba(0,210,255,0.2)" }}>{lang}</span>;
}

export function StatCard({ label, value, change, icon, accentColor="var(--accent)" }) {
  return (
    <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12, padding:20, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${accentColor},transparent)`, opacity:0.6 }} />
      {icon && <div style={{ position:"absolute", right:16, top:16, fontSize:22, opacity:0.2 }}>{icon}</div>}
      <div style={{ fontSize:11, color:"var(--text2)", marginBottom:10, fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase" }}>{label}</div>
      <div style={{ fontFamily:"var(--syne)", fontSize:28, fontWeight:700, marginBottom:4 }}>{value}</div>
      {change && <div style={{ fontSize:12, color:accentColor }}>{change}</div>}
    </div>
  );
}

export function Toast({ msg, type="success", onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  const color = type==="success"?"#00e5a0":type==="error"?"#ff4d6d":"#ffb347";
  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:9999, background:"var(--bg2)", border:`1px solid ${color}33`, borderRadius:10, padding:"14px 20px", fontSize:13, fontWeight:500, display:"flex", alignItems:"center", gap:10, boxShadow:"0 8px 32px rgba(0,0,0,0.4)", animation:"slideUp 0.3s ease" }}>
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <span style={{ color }}>{type==="success"?"✓":"✕"}</span><span>{msg}</span>
    </div>
  );
}

export function Spinner() {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:60 }}>
      <div style={{ width:32, height:32, border:"2px solid var(--border2)", borderTopColor:"var(--accent)", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export function Modal({ title, subtitle, onClose, children, wide=false }) {
  return (
    <div onClick={e => e.target===e.currentTarget&&onClose()} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", backdropFilter:"blur(4px)", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"var(--bg2)", border:"1px solid var(--border2)", borderRadius:16, padding:32, width:wide?680:520, maxWidth:"95vw", maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ fontFamily:"var(--syne)", fontSize:18, fontWeight:700, marginBottom:6 }}>{title}</div>
        {subtitle && <div style={{ fontSize:13, color:"var(--text2)", marginBottom:24 }}>{subtitle}</div>}
        {children}
      </div>
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <label style={{ fontSize:11, fontWeight:600, color:"var(--text2)", textTransform:"uppercase", letterSpacing:"0.05em" }}>{label}</label>
      {children}
    </div>
  );
}

export const inputStyle = { background:"var(--bg3)", border:"1px solid var(--border2)", borderRadius:8, padding:"10px 12px", fontSize:13, color:"var(--text)", fontFamily:"var(--dm)", outline:"none", width:"100%" };
export const selectStyle = { ...inputStyle, cursor:"pointer" };

export function Btn({ children, onClick, variant="primary", size="md", disabled=false, style:sx={} }) {
  const base = { display:"inline-flex", alignItems:"center", gap:7, cursor:disabled?"not-allowed":"pointer", border:"none", fontFamily:"var(--dm)", fontWeight:600, borderRadius:8, transition:"all 0.2s", opacity:disabled?0.5:1, ...(size==="sm"?{padding:"6px 12px",fontSize:12}:{padding:"9px 16px",fontSize:13}) };
  const variants = { primary:{background:"var(--accent)",color:"#000"}, secondary:{background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border2)"}, ghost:{background:"transparent",color:"var(--text2)",border:"1px solid var(--border)"}, danger:{background:"rgba(255,77,109,0.1)",color:"#ff4d6d",border:"1px solid rgba(255,77,109,0.25)"} };
  return <button onClick={disabled?undefined:onClick} style={{...base,...variants[variant],...sx}}>{children}</button>;
}

export function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1);
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6, padding:"14px 20px", borderTop:"1px solid var(--border)" }}>
      <PB onClick={() => onChange(page-1)} disabled={page===1}>‹</PB>
      {pages.map(p => <PB key={p} active={p===page} onClick={() => onChange(p)}>{p}</PB>)}
      {totalPages > 7 && <span style={{ fontSize:12, color:"var(--text2)" }}>…{totalPages}</span>}
      <PB onClick={() => onChange(page+1)} disabled={page===totalPages}>›</PB>
    </div>
  );
}
function PB({ children, onClick, disabled, active }) {
  return <button onClick={disabled?undefined:onClick} disabled={disabled} style={{ width:30, height:30, borderRadius:6, fontSize:12, fontWeight:600, cursor:disabled?"not-allowed":"pointer", fontFamily:"var(--syne)", background:active?"var(--accent)":"transparent", color:active?"#000":"var(--text2)", border:`1px solid ${active?"var(--accent)":"var(--border)"}`, opacity:disabled?0.3:1 }}>{children}</button>;
}

export function DonutChart({ data, size=110 }) {
  const r=40, cx=size/2, cy=size/2, circ=2*Math.PI*r, total=data.reduce((s,d)=>s+d.value,0);
  let offset=0;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:24 }}>
      <svg width={size} height={size} style={{ flexShrink:0 }}>
        {data.map((d,i) => { const pct=d.value/total; const seg=<circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={d.color} strokeWidth={14} strokeDasharray={`${pct*circ} ${(1-pct)*circ}`} strokeDashoffset={-(offset*circ)} transform={`rotate(-90 ${cx} ${cy})`} />; offset+=pct; return seg; })}
        <circle cx={cx} cy={cy} r={33} fill="var(--bg2)" />
      </svg>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {data.map((d,i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13 }}>
            <div style={{ width:10, height:10, borderRadius:"50%", background:d.color, flexShrink:0 }} />
            <span style={{ color:"var(--text2)" }}>{d.label}</span>
            <span style={{ marginLeft:8, fontFamily:"var(--syne)", fontWeight:700 }}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BarChart({ data, height=120, color="var(--accent)" }) {
  const max = Math.max(...data.map(d=>d.val), 1);
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:6, height }}>
      {data.map((d,i) => (
        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <span style={{ fontSize:9, color:"var(--text)", fontWeight:600 }}>{d.val}</span>
          <div style={{ width:"100%", borderRadius:"4px 4px 0 0", minHeight:4, height:`${(d.val/max)*(height-30)}px`, background:typeof color==="function"?color(d,i):color, opacity:i===data.length-1?1:0.7 }} />
          <span style={{ fontSize:9, color:"var(--text2)" }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export function fmtCurrency(n) {
  if (n>=10000000) return `₹${(n/10000000).toFixed(1)}Cr`;
  if (n>=100000) return `₹${(n/100000).toFixed(1)}L`;
  if (n>=1000) return `₹${(n/1000).toFixed(0)}K`;
  return `₹${n}`;
}
