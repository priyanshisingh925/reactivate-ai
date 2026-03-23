import { useState, useEffect } from "react";
import { api } from "../services/api.js";
import { StatusBadge, LangBadge, Spinner, scoreColor } from "../components/ui.jsx";

const LANGUAGES = ["Hindi","Tamil","Telugu","Marathi","Bengali","Kannada","Gujarati"];
const STATUSES  = ["Pending","Contacted","Reactivated","DEAF Fund","Failed"];

export default function SMSPage() {
  const [accounts, setAccounts]     = useState([]);
  const [selected, setSelected]     = useState(null);
  const [smsData, setSmsData]       = useState(null);
  const [showEng, setShowEng]       = useState(false);
  const [filterLang, setFilterLang] = useState("All");
  const [filterSt, setFilterSt]     = useState("All");
  const [outreach, setOutreach]     = useState(null);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([api.getAccounts({ limit:200 }), api.getStats()])
      .then(([a, s]) => {
        setAccounts(a.data);
        setOutreach(s.data?.outreachStats);
        if (a.data.length) pick(a.data[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  function pick(account) {
    setSelected(account);
    setSmsData(null);
    setShowEng(false);
    api.getSMS(account.id).then(r => setSmsData(r.data)).catch(() => {});
  }

  const filtered = accounts.filter(a =>
    (filterLang === "All" || a.language === filterLang) &&
    (filterSt   === "All" || a.status   === filterSt)
  );

  if (loading) return <Spinner />;

  const tot  = outreach?.total    || 0;
  const del  = outreach?.delivered || 0;
  const open = outreach?.opened    || 0;

  return (
    <div className="page">
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
        <div>
          <div className="page-title">SMS & Communication</div>
          <div className="page-sub">Multilingual outreach preview — toggle English translation for each message</div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <select className="filter-select" value={filterLang} onChange={e => setFilterLang(e.target.value)}>
            <option value="All">All Languages</option>
            {LANGUAGES.map(l => <option key={l}>{l}</option>)}
          </select>
          <select className="filter-select" value={filterSt} onChange={e => setFilterSt(e.target.value)}>
            <option value="All">All Statuses</option>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Delivery stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:20 }}>
        {[
          { label:"Total Accounts",   val:accounts.length, color:"var(--accent)"  },
          { label:"Outreach Sent",    val:tot,             color:"var(--amber)"   },
          { label:"Delivered",        val:del,             color:"var(--green)"   },
          { label:"Opened/Engaged",   val:open,            color:"var(--purple)"  },
          { label:"Delivery Rate",    val:tot ? `${((del/tot)*100).toFixed(1)}%` : "—", color:"var(--accent)" },
        ].map((s,i) => (
          <div key={i} style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12, padding:"14px 16px", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${s.color},transparent)`, opacity:0.6 }} />
            <div style={{ fontSize:11, color:"var(--text2)", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.05em", fontWeight:600 }}>{s.label}</div>
            <div style={{ fontFamily:"var(--syne)", fontSize:22, fontWeight:700, color:s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display:"grid", gridTemplateColumns:"300px 1fr", gap:20, height:"calc(100vh - 280px)" }}>
        {/* List */}
        <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12, overflow:"hidden", display:"flex", flexDirection:"column" }}>
          <div style={{ padding:"14px 16px", borderBottom:"1px solid var(--border)", fontFamily:"var(--syne)", fontSize:13, fontWeight:600 }}>
            {filtered.length} accounts
          </div>
          <div style={{ flex:1, overflowY:"auto" }}>
            {filtered.map(a => (
              <div key={a.id} onClick={() => pick(a)} style={{ padding:"12px 16px", borderBottom:"1px solid var(--border)", cursor:"pointer", background:selected?.id===a.id?"rgba(0,210,255,0.07)":"transparent", borderLeft:selected?.id===a.id?"2px solid var(--accent)":"2px solid transparent", transition:"background 0.15s" }}>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:3 }}>{a.name}</div>
                <div style={{ fontSize:11, color:"var(--text2)", marginBottom:5 }}>{a.id} · {a.dormancyMonths}mo dormant</div>
                <div style={{ display:"flex", gap:5 }}>
                  <LangBadge lang={a.language} />
                  <StatusBadge status={a.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail */}
        {selected && (
          <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12, display:"flex", flexDirection:"column", overflow:"hidden" }}>
            <div style={{ padding:"20px 24px", borderBottom:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontFamily:"var(--syne)", fontSize:15, fontWeight:700 }}>{selected.name}</div>
                <div style={{ fontSize:12, color:"var(--text2)", marginTop:3, display:"flex", alignItems:"center", gap:8 }}>
                  {selected.id} · {selected.phone} · <LangBadge lang={selected.language} />
                </div>
              </div>
              <StatusBadge status={selected.status} />
            </div>

            <div style={{ flex:1, padding:24, overflowY:"auto" }}>
              {/* Toggle */}
              <div style={{ display:"flex", background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:8, padding:4, width:"fit-content", marginBottom:20 }}>
                {[false,true].map(eng => (
                  <button key={String(eng)} onClick={() => setShowEng(eng)} style={{ padding:"6px 16px", borderRadius:6, fontSize:12, fontWeight:600, cursor:"pointer", border:"none", fontFamily:"var(--syne)", background:showEng===eng?"var(--accent)":"transparent", color:showEng===eng?"#000":"var(--text2)", transition:"all 0.2s" }}>
                    {eng ? "English Translation" : `Regional (${selected.language})`}
                  </button>
                ))}
              </div>

              {smsData ? (
                <>
                  <MsgBox title="SMS" badge={showEng?"English":selected.language} badgeColor={showEng?"var(--green)":"var(--accent)"}>
                    <div style={{ fontSize:14, lineHeight:1.8 }}>{showEng ? smsData.sms_en : smsData.sms}</div>
                    <div style={{ marginTop:10, fontSize:11, color:"var(--text2)" }}>
                      {showEng ? smsData.sms_en?.length : smsData.char_count_sms} chars · {smsData.sms_segments} SMS segment{smsData.sms_segments>1?"s":""}
                    </div>
                  </MsgBox>
                  <MsgBox title="Email Subject" badge={showEng?"English":selected.language} badgeColor={showEng?"var(--green)":"var(--accent)"}>
                    <div style={{ fontSize:14 }}>{smsData.email_subject}</div>
                  </MsgBox>
                  <MsgBox title="IVR Script" badge={showEng?"English":selected.language} badgeColor={showEng?"var(--green)":"var(--accent)"}>
                    <div style={{ fontSize:14, lineHeight:1.7 }}>{smsData.ivr}</div>
                  </MsgBox>
                </>
              ) : (
                <div style={{ display:"flex", alignItems:"center", gap:10, color:"var(--text2)", fontSize:13 }}>
                  <div style={{ width:16, height:16, border:"2px solid var(--border2)", borderTopColor:"var(--accent)", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                  Loading messages…
                </div>
              )}

              {/* Account info */}
              <div style={{ background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:10, padding:16, marginTop:8 }}>
                <div style={{ fontFamily:"var(--syne)", fontSize:11, fontWeight:700, color:"var(--text2)", marginBottom:12, textTransform:"uppercase", letterSpacing:"0.05em" }}>Account Details</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px 16px" }}>
                  {[
                    ["Account Type", selected.accountType],
                    ["Branch",       selected.branch],
                    ["Dormancy",     `${selected.dormancyMonths} months`],
                    ["Balance",      `₹${Number(selected.balance).toLocaleString("en-IN")}`],
                    ["Joined",       selected.joinedDate],
                    ["Last Contact", selected.lastContact||"—"],
                    ["Prev Contacts",selected.prevContacts],
                    ["Age",          selected.age],
                  ].map(([k,v],i) => (
                    <div key={i}>
                      <span style={{ fontSize:11, color:"var(--text2)" }}>{k}: </span>
                      <span style={{ fontSize:12, fontWeight:600 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI score */}
              <div style={{ background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:10, padding:16, marginTop:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                  <span style={{ fontFamily:"var(--syne)", fontSize:11, fontWeight:700, color:"var(--text2)", textTransform:"uppercase" }}>AI Reactivation Score</span>
                  <span style={{ fontFamily:"var(--syne)", fontSize:22, fontWeight:800, color:scoreColor(selected.aiScore) }}>{selected.aiScore}</span>
                </div>
                <div style={{ height:8, background:"var(--bg2)", borderRadius:4, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${selected.aiScore}%`, background:scoreColor(selected.aiScore), borderRadius:4 }} />
                </div>
                <div style={{ fontSize:11, color:"var(--text2)", marginTop:8 }}>
                  {selected.aiScore>=75?"🟢 High priority — immediate outreach recommended":selected.aiScore>=50?"🟡 Medium priority — schedule within 7 days":"🔴 Low priority — monitor, defer outreach"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MsgBox({ title, badge, badgeColor, children }) {
  return (
    <div style={{ background:"var(--bg3)", border:"1px solid var(--border2)", borderRadius:12, padding:18, marginBottom:12 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
        <span style={{ fontFamily:"var(--syne)", fontSize:11, fontWeight:700, color:"var(--text2)", textTransform:"uppercase", letterSpacing:"0.05em" }}>{title}</span>
        <span style={{ background:"var(--bg2)", border:`1px solid ${badgeColor}33`, color:badgeColor, padding:"2px 8px", borderRadius:20, fontSize:10, fontWeight:700, fontFamily:"var(--syne)" }}>{badge}</span>
      </div>
      {children}
    </div>
  );
}
