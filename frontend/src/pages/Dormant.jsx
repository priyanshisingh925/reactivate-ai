import { useState, useEffect, useRef } from "react";
import { api } from "../services/api.js";
import { ScoreBar, StatusBadge, LangBadge, Spinner, Toast, Modal, Field, Btn, Pagination, fmtCurrency, inputStyle, selectStyle } from "../components/ui.jsx";

const LANGUAGES    = ["Hindi","Tamil","Telugu","Marathi","Bengali","Kannada","Gujarati"];
const STATUSES     = ["Pending","Contacted","Reactivated","DEAF Fund","Failed"];
const ACCOUNT_TYPES= ["Savings","Current","Fixed Deposit","NRE","Salary"];
const BRANCHES     = ["Mumbai Central","Delhi Connaught","Chennai T.Nagar","Kolkata Park St","Bengaluru MG Road","Hyderabad Banjara","Ahmedabad CG Road","Pune FC Road","Jaipur MI Road","Lucknow Hazratganj"];

const BLANK = { name:"",phone:"",email:"",language:"Hindi",dormancyMonths:"",balance:"",age:"",accountType:"Savings",branch:"Mumbai Central",prevContacts:0,transactionHistoryScore:0.5,languageEngagementScore:0.5,accountTypeScore:0.5,branchActivityScore:0.5,notes:"" };

export default function DormantPage() {
  const [accounts, setAccounts]     = useState([]);
  const [total, setTotal]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(true);

  const [search, setSearch]         = useState("");
  const [filterSt, setFilterSt]     = useState("All");
  const [filterLang, setFilterLang] = useState("All");
  const [sortBy, setSortBy]         = useState("aiScore");
  const [sortDir, setSortDir]       = useState("desc");
  const [page, setPage]             = useState(1);

  const [showAdd, setShowAdd]       = useState(false);
  const [showCSV, setShowCSV]       = useState(false);
  const [form, setForm]             = useState(BLANK);
  const [csvFile, setCsvFile]       = useState(null);
  const [csvPreview, setCsvPreview] = useState(null);
  const [dragging, setDragging]     = useState(false);
  const [toast, setToast]           = useState(null);
  const [adding, setAdding]         = useState(false);
  const [importing, setImporting]   = useState(false);
  const fileRef = useRef();

  function load() {
    setLoading(true);
    api.getAccounts({
      status:   filterSt   !== "All" ? filterSt   : undefined,
      language: filterLang !== "All" ? filterLang : undefined,
      search:   search || undefined,
      sortBy, sortDir, page, limit:15,
    }).then(r => { setAccounts(r.data); setTotal(r.total); setTotalPages(r.totalPages); })
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [search, filterSt, filterLang, sortBy, sortDir, page]);

  function toggleSort(col) {
    if (sortBy === col) setSortDir(d => d==="desc"?"asc":"desc");
    else { setSortBy(col); setSortDir("desc"); }
    setPage(1);
  }

  async function handleAdd() {
    if (!form.name) return;
    setAdding(true);
    try {
      const r = await api.createAccount(form);
      setToast({ msg:`✓ ${r.data.id} created — AI score: ${r.data.aiScore}`, type:"success" });
      setShowAdd(false); setForm(BLANK); load();
    } catch(e) { setToast({ msg:`Error: ${e.message}`, type:"error" }); }
    finally { setAdding(false); }
  }

  function readCSV(file) {
    setCsvFile(file);
    const reader = new FileReader();
    reader.onload = e => {
      const lines = e.target.result.trim().split("\n");
      setCsvPreview({ headers: lines[0].split(",").map(h=>h.trim()), rows: lines.slice(1,6).map(l=>l.split(",").map(v=>v.trim())), total: lines.length-1 });
    };
    reader.readAsText(file);
  }

  async function handleImport() {
    if (!csvFile) return;
    setImporting(true);
    try {
      const r = await api.uploadCSV(csvFile);
      if (!r.success) throw new Error(r.error);
      setToast({ msg:`✓ ${r.imported} accounts imported — High:${r.scoreDistribution?.high} Med:${r.scoreDistribution?.medium} Low:${r.scoreDistribution?.low}`, type:"success" });
      setShowCSV(false); setCsvFile(null); setCsvPreview(null); load();
    } catch(e) { setToast({ msg:`Import failed: ${e.message}`, type:"error" }); }
    finally { setImporting(false); }
  }

  async function updateStatus(id, status) {
    await api.updateAccount(id, { status });
    setAccounts(prev => prev.map(a => a.id===id ? {...a, status, lastContact:new Date().toLocaleDateString("en-IN")} : a));
  }

  const Th = ({ col, children }) => (
    <th onClick={col ? () => toggleSort(col) : undefined}
      style={{ padding:"12px 16px", textAlign:"left", fontSize:11, fontWeight:600, color:"var(--text2)", textTransform:"uppercase", letterSpacing:"0.06em", borderBottom:"1px solid var(--border)", background:"var(--bg3)", whiteSpace:"nowrap", cursor:col?"pointer":"default" }}>
      {children}{col && sortBy===col ? (sortDir==="desc"?" ↓":" ↑") : ""}
    </th>
  );

  return (
    <div className="page">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
        <div>
          <div className="page-title">Dormant Account Reactivation</div>
          <div className="page-sub">AI-scored accounts ranked by reactivation probability — {total} total</div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <Btn variant="ghost"     size="sm" onClick={() => api.downloadTemplate()}>⬇ CSV Template</Btn>
          <Btn variant="secondary" size="sm" onClick={() => setShowCSV(true)}>📂 Import CSV</Btn>
          <Btn variant="primary"   size="sm" onClick={() => setShowAdd(true)}>＋ Add Account</Btn>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap", alignItems:"center" }}>
        <input style={{...inputStyle, width:240}} placeholder="Search name or account ID…" value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} />
        <select style={{...selectStyle,width:"auto"}} value={filterSt}   onChange={e=>{setFilterSt(e.target.value);setPage(1);}}>
          <option value="All">All Statuses</option>{STATUSES.map(s=><option key={s}>{s}</option>)}
        </select>
        <select style={{...selectStyle,width:"auto"}} value={filterLang} onChange={e=>{setFilterLang(e.target.value);setPage(1);}}>
          <option value="All">All Languages</option>{LANGUAGES.map(l=><option key={l}>{l}</option>)}
        </select>
        <span style={{ fontSize:12, color:"var(--text2)", marginLeft:"auto" }}>{total} accounts</span>
      </div>

      <div className="table-card">
        {loading ? <Spinner /> : (
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr>
                  <Th>Account ID</Th><Th>Name</Th><Th>Language</Th>
                  <Th col="dormancyMonths">Dormancy</Th>
                  <Th col="balance">Balance</Th>
                  <Th>Type</Th>
                  <Th col="aiScore">AI Score</Th>
                  <Th>Status</Th><Th>Last Contact</Th><Th>Update</Th>
                </tr>
              </thead>
              <tbody>
                {accounts.map(a => (
                  <tr key={a.id}>
                    <td style={{ padding:"13px 16px", fontFamily:"var(--syne)", fontSize:12, color:"var(--accent)", borderBottom:"1px solid var(--border)" }}>{a.id}</td>
                    <td style={{ padding:"13px 16px", borderBottom:"1px solid var(--border)" }}>
                      <div style={{ fontWeight:500 }}>{a.name}</div>
                      <div style={{ fontSize:11, color:"var(--text2)" }}>{a.phone}</div>
                    </td>
                    <td style={{ padding:"13px 16px", borderBottom:"1px solid var(--border)" }}><LangBadge lang={a.language} /></td>
                    <td style={{ padding:"13px 16px", borderBottom:"1px solid var(--border)", color:a.dormancyMonths>36?"var(--red)":a.dormancyMonths>24?"var(--amber)":"var(--text)" }}>{a.dormancyMonths}mo</td>
                    <td style={{ padding:"13px 16px", fontFamily:"var(--syne)", fontSize:13, borderBottom:"1px solid var(--border)" }}>{fmtCurrency(a.balance)}</td>
                    <td style={{ padding:"13px 16px", color:"var(--text2)", fontSize:12, borderBottom:"1px solid var(--border)" }}>{a.accountType}</td>
                    <td style={{ padding:"13px 16px", borderBottom:"1px solid var(--border)" }}><ScoreBar score={a.aiScore} /></td>
                    <td style={{ padding:"13px 16px", borderBottom:"1px solid var(--border)" }}><StatusBadge status={a.status} /></td>
                    <td style={{ padding:"13px 16px", fontSize:12, color:"var(--text2)", borderBottom:"1px solid var(--border)" }}>{a.lastContact||"—"}</td>
                    <td style={{ padding:"13px 16px", borderBottom:"1px solid var(--border)" }}>
                      <select style={{...selectStyle, fontSize:11, padding:"4px 8px", width:"auto"}} value={a.status} onChange={e=>updateStatus(a.id,e.target.value)}>
                        {STATUSES.map(s=><option key={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} totalPages={totalPages} onChange={p => { setPage(p); }} />
      </div>

      {/* ADD MODAL */}
      {showAdd && (
        <Modal title="Add Single Account" subtitle="The Random Forest model will AI-score this account immediately after saving." onClose={() => setShowAdd(false)}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            {[
              ["Full Name *","name","text","Priya Sharma"],
              ["Phone","phone","text","+91 9876543210"],
              ["Email","email","email","priya@email.com"],
              ["Dormancy (months) *","dormancyMonths","number","24"],
              ["Balance (₹) *","balance","number","25000"],
              ["Age","age","number","35"],
              ["Prev Contact Attempts","prevContacts","number","0"],
              ["Txn History Score (0-1)","transactionHistoryScore","number","0.5"],
              ["Language Engagement (0-1)","languageEngagementScore","number","0.5"],
            ].map(([label,key,type,placeholder]) => (
              <Field key={key} label={label}>
                <input style={inputStyle} type={type} placeholder={placeholder} value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))} />
              </Field>
            ))}
            <Field label="Language">
              <select style={selectStyle} value={form.language} onChange={e=>setForm(p=>({...p,language:e.target.value}))}>
                {LANGUAGES.map(l=><option key={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="Account Type">
              <select style={selectStyle} value={form.accountType} onChange={e=>setForm(p=>({...p,accountType:e.target.value}))}>
                {ACCOUNT_TYPES.map(t=><option key={t}>{t}</option>)}
              </select>
            </Field>
            <div style={{ gridColumn:"span 2" }}>
              <Field label="Branch">
                <select style={selectStyle} value={form.branch} onChange={e=>setForm(p=>({...p,branch:e.target.value}))}>
                  {BRANCHES.map(b=><option key={b}>{b}</option>)}
                </select>
              </Field>
            </div>
            <div style={{ gridColumn:"span 2" }}>
              <Field label="Notes">
                <input style={inputStyle} placeholder="Optional notes…" value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} />
              </Field>
            </div>
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:24 }}>
            <Btn variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Btn>
            <Btn variant="primary" onClick={handleAdd} disabled={!form.name||adding}>
              {adding ? "Scoring with AI…" : "Add & Score with AI"}
            </Btn>
          </div>
        </Modal>
      )}

      {/* CSV MODAL */}
      {showCSV && (
        <Modal title="Bulk CSV Import" subtitle="All accounts are AI-scored automatically after upload. Max 10,000 rows." onClose={() => { setShowCSV(false); setCsvFile(null); setCsvPreview(null); }} wide>
          <div
            onDragOver={e=>{e.preventDefault();setDragging(true);}}
            onDragLeave={()=>setDragging(false)}
            onDrop={e=>{e.preventDefault();setDragging(false);const f=e.dataTransfer.files[0];if(f)readCSV(f);}}
            onClick={()=>fileRef.current?.click()}
            style={{ border:`2px dashed ${dragging?"var(--accent)":"var(--border2)"}`, borderRadius:10, padding:32, textAlign:"center", cursor:"pointer", background:dragging?"rgba(0,210,255,0.04)":"transparent", transition:"all 0.2s", marginBottom:16 }}
          >
            <input ref={fileRef} type="file" accept=".csv" style={{ display:"none" }} onChange={e=>{if(e.target.files[0])readCSV(e.target.files[0]);}} />
            <div style={{ fontSize:32, marginBottom:8 }}>📂</div>
            <div style={{ fontSize:14, color:"var(--text2)" }}>Drop your CSV here or click to browse</div>
            <div style={{ fontSize:12, color:"var(--text3)", marginTop:4 }}>Supports .csv files up to 10,000 rows</div>
          </div>

          {csvPreview && (
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:13, color:"var(--green)", marginBottom:8 }}>✓ {csvPreview.total} rows detected — first 5 rows:</div>
              <div style={{ overflow:"auto", background:"var(--bg3)", borderRadius:8, padding:12, fontSize:11, fontFamily:"monospace", maxHeight:150 }}>
                <div style={{ color:"var(--accent)", marginBottom:6 }}>{csvPreview.headers.join(" | ")}</div>
                {csvPreview.rows.map((r,i) => <div key={i} style={{ color:"var(--text2)", padding:"2px 0" }}>{r.join(" | ")}</div>)}
                {csvPreview.total>5 && <div style={{ color:"var(--text3)", marginTop:4 }}>…and {csvPreview.total-5} more rows</div>}
              </div>
            </div>
          )}

          <div style={{ background:"var(--bg3)", borderRadius:8, padding:12, marginBottom:16, fontSize:12, color:"var(--text2)" }}>
            <strong style={{ color:"var(--accent)" }}>Expected columns:</strong> name, phone, language, dormancy_months, balance, age, account_type, branch, prev_contacts, txn_score, lang_score<br />
            <span style={{ color:"var(--text3)" }}>Only "name" is required. All others use smart defaults.</span>
          </div>

          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <Btn variant="ghost" onClick={()=>api.downloadTemplate()}>⬇ Download Template</Btn>
            <Btn variant="ghost" onClick={()=>{setShowCSV(false);setCsvFile(null);setCsvPreview(null);}}>Cancel</Btn>
            <Btn variant="primary" onClick={handleImport} disabled={!csvFile||importing}>
              {importing ? "Importing & scoring…" : csvPreview ? `Import ${csvPreview.total} Accounts` : "Waiting for file…"}
            </Btn>
          </div>
        </Modal>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)} />}
    </div>
  );
}
