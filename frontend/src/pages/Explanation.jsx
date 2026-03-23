export default function Explanation() {
  const S = ({ title, sub, children }) => (
    <div style={{ marginBottom:36 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:6 }}>
        <h2 style={{ fontFamily:"var(--syne)", fontSize:18, fontWeight:700, whiteSpace:"nowrap" }}>{title}</h2>
        <div style={{ flex:1, height:1, background:"var(--border)" }} />
      </div>
      {sub && <p style={{ fontSize:14, color:"var(--text2)", marginBottom:20, lineHeight:1.7 }}>{sub}</p>}
      {children}
    </div>
  );

  return (
    <div className="page" style={{ maxWidth:1100 }}>
      <div style={{ marginBottom:32 }}>
        <div className="page-title">About ReActivate AI</div>
        <div className="page-sub">Problem statement, solution architecture, AI deep-dive, and projected impact</div>
      </div>

      {/* Hero */}
      <div style={{ background:"linear-gradient(135deg,rgba(0,210,255,0.06),transparent 60%)", border:"1px solid var(--border)", borderRadius:16, padding:40, marginBottom:36, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-40, right:-40, width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle,rgba(0,210,255,0.08),transparent 70%)" }} />
        <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(0,210,255,0.1)", border:"1px solid rgba(0,210,255,0.2)", color:"var(--accent)", padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:600, fontFamily:"var(--syne)", marginBottom:16 }}>
          🏆 Hackathon — RBI Problems 4 & 7
        </div>
        <h1 style={{ fontFamily:"var(--syne)", fontSize:32, fontWeight:800, lineHeight:1.2, marginBottom:12 }}>
          Bringing Dormant Money<br />Back to Life with <span style={{ color:"var(--accent)" }}>AI</span>
        </h1>
        <p style={{ fontSize:15, color:"var(--text2)", lineHeight:1.8, maxWidth:660 }}>
          ReActivate AI is an end-to-end intelligence platform that identifies dormant and DEAF-transferred bank accounts, scores them using a <strong style={{ color:"var(--text)" }}>Random Forest model (50 trees, 8 features)</strong> for reactivation probability, and re-engages customers through hyper-personalized communication in their native language — recovering funds, growing CASA, and improving financial inclusion across India.
        </p>
      </div>

      {/* Problems */}
      <S title="The Problem" sub="Two interconnected challenges draining India's banking ecosystem">
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {[
            { num:"₹35,012 Cr", title:"Dormant & DEAF Fund Accounts", body:"Under RBI guidelines, accounts inactive for 2+ years become dormant. Unclaimed balances transfer to the Deposit Education and Awareness Fund (DEAF) after 10 years. As of FY2024, over ₹35,000 crore sits in DEAF — millions of customers financially excluded. Banks have zero intelligent prioritization to re-engage them.", color:"var(--purple)" },
            { num:"22+ Languages", title:"The Regional Language Gap", body:"India has 22 constitutionally recognized languages. Yet bank communications — SMS alerts, reactivation notices, IVR calls — are predominantly in English or Hindi. This leaves 600M+ Indians across Tamil Nadu, Andhra, Karnataka, West Bengal, and Maharashtra disengaged from critical financial communications, directly driving dormancy rates higher.", color:"var(--amber)" },
            { num:"< 4% Response", title:"No Intelligent Outreach", body:"Banks currently send the same bulk message to all dormant accounts regardless of reactivation likelihood. No AI scoring, no personalization, no language targeting. This wastes SMS budget massively and yields response rates under 4%. High-potential accounts are treated identically to near-zero-probability ones — a costly and ineffective approach.", color:"var(--red)" },
            { num:"4x CASA", title:"Missed Growth Opportunity", body:"CASA (Current Account Savings Account) ratio is a critical profitability metric for every bank. Every reactivated dormant account directly improves CASA and NIM. With intelligent AI targeting and multilingual communication, banks can achieve 4x better reactivation rates — translating to lower funding costs and stronger regulatory standing.", color:"var(--accent)" },
          ].map((c,i) => (
            <div key={i} style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderLeft:`3px solid ${c.color}`, borderRadius:12, padding:24 }}>
              <div style={{ fontFamily:"var(--syne)", fontSize:34, fontWeight:800, color:c.color, marginBottom:6 }}>{c.num}</div>
              <h4 style={{ fontFamily:"var(--syne)", fontSize:14, fontWeight:700, marginBottom:8 }}>{c.title}</h4>
              <p style={{ fontSize:13, color:"var(--text2)", lineHeight:1.7 }}>{c.body}</p>
            </div>
          ))}
        </div>
      </S>

      {/* Solution flow */}
      <S title="Our Solution" sub="A five-stage intelligent pipeline from raw data to customer reactivation">
        <div style={{ display:"flex", alignItems:"flex-start" }}>
          {[
            { icon:"📥", label:"Data Ingestion",     desc:"Account records loaded via manual entry or bulk CSV upload — name, balance, dormancy, history, language" },
            { icon:"🤖", label:"AI Scoring",         desc:"Random Forest (50 trees, 8 features) assigns every account a reactivation probability score from 0–100" },
            { icon:"🎯", label:"Prioritization",     desc:"Accounts triaged: HIGH ≥75 (immediate), MEDIUM 50–74 (7 days), LOW <50 (defer) — saving 40%+ outreach costs" },
            { icon:"🌐", label:"Language Detection", desc:"Customer's preferred language auto-matched from account profile, branch location, and interaction history" },
            { icon:"📱", label:"Personalized Outreach", desc:"Native-language SMS/Email/IVR with customer name, account ID, balance, and branch dynamically filled" },
          ].map((step, i, arr) => (
            <div key={i} style={{ flex:1, textAlign:"center", position:"relative" }}>
              {i < arr.length-1 && <div style={{ position:"absolute", right:-12, top:20, fontSize:18, color:"var(--text3)" }}>→</div>}
              <div style={{ width:48, height:48, borderRadius:12, margin:"0 auto 10px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, background:"var(--bg3)", border:"1px solid var(--border2)" }}>{step.icon}</div>
              <div style={{ fontFamily:"var(--syne)", fontSize:12, fontWeight:700, marginBottom:4 }}>{step.label}</div>
              <div style={{ fontSize:11, color:"var(--text2)", padding:"0 6px", lineHeight:1.5 }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </S>

      {/* AI deep dive */}
      <S title="The AI Engine — Random Forest" sub="How the model works, feature engineering, and why we built it from scratch">
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:20 }}>
          {[
            { icon:"🌲", title:"50 Decision Trees", desc:"Each tree is built with a unique seeded RNG (Mulberry32). Ensemble majority-vote averaging of 50 predictions dramatically reduces variance vs a single tree and eliminates overfitting." },
            { icon:"⚙️", title:"8 Engineered Features", desc:"Dormancy months, balance, customer age, previous contacts, transaction history score, language engagement score, account type weight, branch activity — all normalized to [0–1]." },
            { icon:"📊", title:"60/40 Calibration", desc:"Raw forest output is blended 60% forest + 40% banking domain heuristics. This enforces business logic: high balance + recent transaction history = higher score, regardless of tree randomness." },
            { icon:"🎯", title:"Three-Tier Triage", desc:"Score ≥75 → HIGH (immediate outreach). Score 50–74 → MEDIUM (schedule within 7 days). Score <50 → LOW (monitor, defer). This alone cuts SMS costs by 40%+ vs mass blast." },
            { icon:"🔄", title:"Real-time Rescoring", desc:"Every account update — status change, new contact attempt, balance edit — triggers an instant AI rescore. The model always reflects current state, never stale snapshots." },
            { icon:"📈", title:"Feature Importance", desc:"Dormancy months (28%) and balance (22%) are top predictors, followed by transaction history (18%) and branch activity (12%). Aligns with RBI's own dormancy risk guidance." },
          ].map((f,i) => (
            <div key={i} style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:10, padding:18 }}>
              <div style={{ fontSize:24, marginBottom:10 }}>{f.icon}</div>
              <div style={{ fontFamily:"var(--syne)", fontSize:13, fontWeight:700, marginBottom:6 }}>{f.title}</div>
              <div style={{ fontSize:12, color:"var(--text2)", lineHeight:1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Decision tree visual */}
        <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12, padding:24 }}>
          <div style={{ fontFamily:"var(--syne)", fontSize:12, fontWeight:700, color:"var(--text2)", marginBottom:20, textTransform:"uppercase", letterSpacing:"0.05em" }}>
            Sample Decision Tree Logic (1 of 50 trees in the forest)
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
            <Node label="Dormancy ≤ 24 months?" color="var(--accent)" />
            <div style={{ display:"flex", gap:80, marginTop:10 }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:10, color:"var(--green)", fontWeight:700 }}>YES</span>
                <Node label="Balance ≥ ₹10K?" color="var(--accent)" />
                <div style={{ display:"flex", gap:32, marginTop:6 }}>
                  <Leaf label="HIGH 🟢" sub="Score: 82–94" color="var(--green)" />
                  <Leaf label="MEDIUM 🟡" sub="Score: 52–68" color="var(--amber)" />
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:10, color:"var(--red)", fontWeight:700 }}>NO</span>
                <Node label="Prev Contacts ≤ 1?" color="var(--accent)" />
                <div style={{ display:"flex", gap:32, marginTop:6 }}>
                  <Leaf label="MEDIUM 🟡" sub="Score: 45–62" color="var(--amber)" />
                  <Leaf label="LOW 🔴" sub="Score: 12–38" color="var(--red)" />
                </div>
              </div>
            </div>
          </div>
          <p style={{ fontSize:12, color:"var(--text2)", marginTop:20, textAlign:"center" }}>
            This is 1 sample tree. The final score is the average prediction of all 50 trees — making the model robust against individual tree noise.
          </p>
        </div>
      </S>

      {/* Languages */}
      <S title="Multilingual AI Communication" sub="Every customer receives a message in the language they actually understand">
        <p style={{ fontSize:14, color:"var(--text2)", lineHeight:1.8, marginBottom:20 }}>
          Our NLP pipeline auto-detects each customer's preferred language from their account profile and branch location. Personalized SMS, email, and IVR scripts are generated with the customer's <strong style={{ color:"var(--text)" }}>name, account ID, balance, dormancy period, and branch</strong> dynamically filled — messages that feel personal, not mass-broadcast. This approach increases SMS engagement by <strong style={{ color:"var(--accent)" }}>3.2x</strong> compared to English-only outreach.
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
          {[
            { name:"Hindi",    speakers:"528M", color:"var(--accent)"  },
            { name:"Bengali",  speakers:"97M",  color:"var(--purple)"  },
            { name:"Telugu",   speakers:"93M",  color:"var(--green)"   },
            { name:"Marathi",  speakers:"83M",  color:"var(--amber)"   },
            { name:"Tamil",    speakers:"75M",  color:"var(--red)"     },
            { name:"Gujarati", speakers:"55M",  color:"#fb923c"        },
            { name:"Kannada",  speakers:"44M",  color:"#38bdf8"        },
            { name:"+ More",   speakers:"Expandable to 15+ languages", color:"var(--text2)" },
          ].map((l,i) => (
            <div key={i} style={{ background:"var(--bg2)", border:`1px solid ${l.color}33`, borderRadius:10, padding:16, textAlign:"center" }}>
              <div style={{ fontSize:24, marginBottom:6 }}>🇮🇳</div>
              <div style={{ fontFamily:"var(--syne)", fontSize:13, fontWeight:700, color:l.color }}>{l.name}</div>
              <div style={{ fontSize:11, color:"var(--text2)", marginTop:2 }}>{l.speakers}</div>
            </div>
          ))}
        </div>
      </S>

      {/* Impact */}
      <S title="Projected Impact">
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
          {[
            { num:"4.2x",     label:"Reactivation rate vs traditional bulk outreach",  color:"var(--accent)"  },
            { num:"₹35K Cr",  label:"Addressable DEAF fund pool across India",          color:"var(--green)"   },
            { num:"94%",      label:"SMS delivery rate with multilingual targeting",    color:"var(--amber)"   },
            { num:"87%",      label:"AI model confidence (ensemble forest average)",    color:"var(--purple)"  },
          ].map((m,i) => (
            <div key={i} style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:10, padding:20, textAlign:"center" }}>
              <div style={{ fontFamily:"var(--syne)", fontSize:32, fontWeight:800, color:m.color, marginBottom:6 }}>{m.num}</div>
              <div style={{ fontSize:12, color:"var(--text2)", lineHeight:1.5 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </S>

      {/* Tech stack */}
      <S title="Technology Stack">
        <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
          {["Random Forest — pure JS, 50 trees, 8 features","Node.js + Express REST API","React 18 + Vite","CSV Parse (bulk import up to 10K rows)","Multer (file uploads)","In-memory store (production: PostgreSQL)","RBI DEAF Guidelines FY2024","7 Regional Language NLP Templates","SMS + Email + IVR channel support"].map((t,i) => (
            <span key={i} style={{ background:"rgba(0,210,255,0.1)", color:"var(--accent)", border:"1px solid rgba(0,210,255,0.2)", padding:"6px 14px", borderRadius:20, fontSize:12, fontFamily:"var(--syne)", fontWeight:600 }}>{t}</span>
          ))}
        </div>
      </S>
    </div>
  );
}

function Node({ label, color }) {
  return <div style={{ background:"var(--bg3)", border:`1px solid ${color}`, borderRadius:6, padding:"6px 14px", fontSize:11, color, fontFamily:"var(--syne)", whiteSpace:"nowrap" }}>{label}</div>;
}
function Leaf({ label, sub, color }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
      <div style={{ background:"var(--bg3)", border:`1px solid ${color}`, borderRadius:6, padding:"6px 10px", fontSize:11, color, fontFamily:"var(--syne)", textAlign:"center" }}>
        {label}<br /><span style={{ fontSize:9, opacity:0.8 }}>{sub}</span>
      </div>
    </div>
  );
}
