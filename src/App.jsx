import { useState, useEffect } from "react";

const BUDGET = 500;

// tiers: optional array of {label, cost, reach}
// if present, students can pick Full or Partial after selecting
const POLICIES = [
  {
    id: 1, category: "Early Childhood",
    name: "Universal Infant & Toddler Care (0–3)",
    subtitle: "Subsidized care for low-income families with children under 3",
    cost: 150,
    tiers: [
      { label: "Full", cost: 150, reach: "Families under 200% poverty line (~80,000 children)" },
      { label: "Targeted", cost: 80, reach: "Families under 100% poverty line only (~40,000 children)" },
    ],
    description: "Michigan's GSRP is already ranked #1 nationally for 4-year-olds — so this targets the real gap: infants and toddlers ages 0–3, where Heckman argues returns to investment are highest of all. New Mexico became the first state to offer free child care regardless of income in 2025. Connecticut and Illinois have expanded infant-toddler subsidies for families under 200% of the poverty line. This also directly addresses the gender wage gap: Claudia Goldin's research shows pay inequality kicks in after childbirth, driven by caregiving — affordable infant care enables mothers to stay in the workforce.",
    theorist: "Heckman / Goldin",
    tension: "Most expensive item on the menu. Is it worth it when GSRP already covers age 4?",
    tag: "Early Investment", example: "New Mexico (2025), Connecticut, Illinois",
  },
  {
    id: 2, category: "Early Childhood",
    name: "Head Start State Backup Fund",
    subtitle: "Insulate Michigan's 27,000 enrolled children from federal disruption",
    cost: 50,
    description: "Michigan has 48 Head Start programs serving 27,000 children — but 2025 exposed how fragile federal funding is. The Chicago regional office (which oversees Michigan) was abruptly closed in April 2025, and 9 Michigan programs lost funding during the 43-day government shutdown. A state backup fund would create a reserve to cover payroll and operations during federal funding gaps. This isn't about expanding the program — it's about making an existing one durable.",
    theorist: "Holzer",
    tension: "Should states be responsible for insulating programs the federal government should fully fund?",
    tag: "Compensatory", example: "Michigan-specific; no direct state model yet — that's the point",
  },
  {
    id: 3, category: "Education",
    name: "STEM Teachers in Low-Income Districts",
    subtitle: "Salary supplements and loan forgiveness to recruit and retain effective teachers",
    cost: 60,
    description: "Teacher quality is the single most important in-school factor for student achievement — yet the lowest-income districts struggle most to attract and keep effective teachers. This proposal offers salary supplements (e.g., $10,000/year) and student loan forgiveness for STEM teachers who commit to 5 years in high-need Michigan districts. Similar programs in California (Golden State Teacher Grant) and North Carolina (Teaching Fellows) have shown measurable retention effects. Holzer explicitly calls this out as a better use of scarce resources than universal pre-K.",
    theorist: "Holzer",
    tension: "Supply-side strategy. Does improving schools fix inequality if neighborhoods remain segregated?",
    tag: "Education", example: "California Golden State Teacher Grant, North Carolina Teaching Fellows",
  },
  {
    id: 4, category: "Education",
    name: "Mindset & Noncognitive Skills Programs",
    subtitle: "Low-cost, targeted interventions in middle and high schools",
    cost: 20,
    description: "Dweck's research shows that cheap, well-targeted psychological interventions — teaching students that intelligence is malleable, building self-regulation, addressing 'belonging uncertainty' — can meaningfully improve academic outcomes for low-income students even in later years. Programs like the University of Texas's 'growth mindset' intervention (one online session, $0.50/student) improved college enrollment rates. KIPP schools have built noncognitive skills explicitly into their model. The key insight from Dweck: late interventions aren't always inefficient — it depends on what you're targeting.",
    theorist: "Dweck",
    tension: "Heckman says late interventions cost more per unit of skill. Is this the exception, or does Dweck's evidence hold up?",
    tag: "Late Investment", example: "University of Texas growth mindset program, KIPP schools",
  },
  {
    id: 5, category: "Labor Market",
    name: "Raise State Minimum Wage",
    subtitle: "Indexed to inflation, with small employer transition support",
    cost: 90,
    tiers: [
      { label: "Full ($17/hr)", cost: 90, reach: "All workers; phased over 3 years with small employer tax credits" },
      { label: "Partial ($15/hr)", cost: 45, reach: "Faster to pass politically; Dube estimates roughly half the poverty-reduction impact" },
    ],
    description: "Michigan's minimum wage is $13.73/hour as of January 2026 — still well below what research suggests is needed. Arindrajit Dube's landmark study found that raising the minimum wage 10% reduces poverty by 2–5%. Washington State ($16.28), California ($16.50), and New York City ($16.50) have already passed $16+ floors with no significant employment losses. The Raise the Wage Act of 2023 proposed $17 federally by 2028. This option pairs the increase with small-business tax credits to ease the transition — a politically viable structure used in Illinois and New Jersey.",
    theorist: "Holzer / Dube",
    tension: "Helps the working poor — but what about the non-working poor, who don't benefit at all?",
    tag: "Labor Market", example: "Washington, California, New York City; Illinois small-business tax credit model",
  },
  {
    id: 6, category: "Labor Market",
    name: "Sectoral Wage Board",
    subtitle: "Industry-wide wage and benefit standards for home care & nursing home workers",
    cost: 20,
    description: "Rather than firm-by-firm union organizing, sectoral boards set wage and benefit floors across an entire industry. Since 2018, six states have passed versions of this: Minnesota set nursing home standards in 2023; California created a Fast Food Council that raised fast food wages to $20/hour in 2024; Nevada has a home care board. Massachusetts passed the first true sectoral bargaining law for rideshare workers in 2024. This is the closest American cousin to Danish 'flexicurity' — it doesn't require overhauling the whole labor market, just one sector at a time.",
    theorist: "Cohen & Sabel",
    tension: "Is this a meaningful step toward institutional reform, or just a more efficient version of the same minimum wage politics?",
    tag: "Institutional Reform", example: "Minnesota nursing homes (2023), California fast food (2024), Nevada home care, Massachusetts rideshare (2024)",
  },
  {
    id: 7, category: "Labor Market",
    name: "Flexicurity Pilot",
    subtitle: "Enhanced unemployment insurance + mandatory retraining for laid-off workers",
    cost: 100,
    tiers: [
      { label: "Full Pilot", cost: 100, reach: "3 industries (home care, manufacturing, retail); full UI enhancement + retraining" },
      { label: "Single Sector", cost: 50, reach: "Home care only — smaller, easier to evaluate, but less generalizable" },
    ],
    description: "Denmark's 'golden triangle': employers can hire and fire flexibly; workers receive generous UI (up to 90% of prior wages for up to 2 years); the government provides active retraining, placement services, and job search support. The result: persistently low unemployment, high labor force participation, and low inequality. No US state has fully replicated this, but Oregon's WorkShare program and New Jersey's UI modernization are partial parallels. Cohen and Sabel argue the key shift is from 'job security' to 'employment security' — you may lose this job, but you won't fall through the floor.",
    theorist: "Cohen & Sabel",
    tension: "Requires a fundamental shift in cultural norms about the employer-employee relationship. Can you transplant Danish institutions into Michigan?",
    tag: "Institutional Reform", example: "Denmark (full model); Oregon WorkShare, New Jersey UI modernization (partial)",
  },
  {
    id: 8, category: "Tax & Transfer",
    name: "EITC Take-Up Campaign",
    subtitle: "Outreach and free tax prep to reach the 20%+ of eligible workers who never claim it",
    cost: 15,
    description: "Michigan already has one of the better state EITCs in the country — expanded to 30% of the federal credit in 2023, delivering an average of $3,856 to 665,000 households in 2025. The problem: an estimated 20% or more of eligible Michigan workers never claim it, leaving hundreds of millions of dollars on the table every year. This policy funds a statewide outreach campaign, expands free Volunteer Income Tax Assistance (VITA) sites into underserved communities, and pays for multilingual tax prep services. For every $1 spent on EITC outreach, eligible families gain far more in unclaimed credits. This is arguably the cheapest, fastest way to get money to low-income workers — no new legislation, no new bureaucracy, just connecting people to a benefit they're already entitled to.",
    theorist: "Holzer",
    tension: "Addresses a symptom (non-take-up) rather than the underlying limit of the EITC itself. Still tied to work.",
    tag: "Compensatory", example: "Michigan VITA network (already exists, underfunded); Code for America's GetYourRefund platform used in 20+ states",
  },
  {
    id: 15, category: "Tax & Transfer",
    name: "Michigan State Child Tax Credit",
    subtitle: "Refundable credit for families with children earning under $60,000",
    cost: 85,
    tiers: [
      { label: "Full ($500/child)", cost: 85, reach: "Families earning under $60,000 — reaches ~700,000 Michigan children" },
      { label: "Deep Poverty ($300/child)", cost: 40, reach: "Families earning under $30,000 only — smaller reach but highest concentration of need" },
    ],
    description: "Michigan has no state-level Child Tax Credit — a significant gap, since the federal CTC is only partially refundable and provides little to the lowest-income families. Several states have moved aggressively here: Colorado created a fully refundable state CTC in 2021 (up to $1,200/child for families under $25,000); New Mexico offers up to $600/child fully refundable; California and Vermont have similar programs. In 2021, the American Rescue Plan temporarily made the federal CTC fully refundable — child poverty dropped by nearly 40% that year before it expired. A Michigan state CTC would directly reach families the EITC misses, including families with very low or no earned income.",
    theorist: "Holzer / Jackson",
    tension: "Expensive. And unlike the EITC, it's not tied to work — more inclusive but harder to sell politically.",
    tag: "Compensatory", example: "Colorado (2021, fully refundable), New Mexico (up to $600/child), California, Vermont; federal ARP expansion (2021, expired)",
  },
  {
    id: 9, category: "Tax & Transfer",
    name: "Guaranteed Income Pilot",
    subtitle: "$500/month, no strings attached, for 500 low-income families over 3 years",
    cost: 30,
    description: "Unconditional cash transfers challenge the core assumption of work-conditioned programs like EITC and TANF. Stockton, CA (2019–21): $500/month to 125 residents — recipients had better job stability, improved mental health, and no increase in 'frivolous' spending. Chicago (2022–23): $500/month to 5,000 residents. By 2026, pilots are running in Los Angeles, Newark, Minneapolis, Atlanta, and NYC. Jackson's 'second conversation' argument is relevant here: if we've been designing programs around the assumption people need to be incentivized to work, what does it mean if unconditional cash works just as well?",
    theorist: "Holzer / Jackson",
    tension: "Breaks from EITC/TANF work-requirement logic entirely. How do you make the political case for 'no strings attached'?",
    tag: "UBI / Cash", example: "Stockton CA (2019–21), Chicago (2022–23), active pilots in LA, Newark, Minneapolis, Atlanta, NYC",
  },
  {
    id: 10, category: "Wealth Building",
    name: "Michigan Baby Bonds",
    subtitle: "$3,200 seed account at birth for every child born on Medicaid",
    cost: 45,
    description: "Baby bonds target wealth, not just income — which is where inequality is most extreme. Connecticut launched the first state program in July 2023: every baby born on Medicaid receives a $3,200 seed account, automatically enrolled, held in trust until age 18, projected to grow to $11,000–$24,000 depending on market performance. Usable for a home down payment, college tuition, or business startup. California, Rhode Island, and Vermont have passed similar legislation. Notably, the federal 'Trump Accounts' (2025) give $1,000 to all children but allow family contributions — critics argue this widens rather than narrows wealth gaps since wealthier families can contribute more.",
    theorist: "Hamilton / Jackson",
    tension: "Long gestation — no political payoff for 18 years. Does wealth-building help if structural barriers remain?",
    tag: "Wealth Building", example: "Connecticut (2023, live), California, Rhode Island, Vermont (legislation passed); contrast with federal 'Trump Accounts'",
  },
  {
    id: 11, category: "Gender & Care",
    name: "Paid Family & Medical Leave",
    subtitle: "12 weeks of paid leave for new parents and caregivers, funded by payroll contributions",
    cost: 60,
    tiers: [
      { label: "Full (12 weeks, 80% wages)", cost: 60, reach: "All Michigan workers; modeled on Minnesota and Connecticut programs" },
      { label: "Partial (8 weeks, 60% wages)", cost: 30, reach: "Lower benefit level — more affordable but may not cover lower-wage workers' actual costs" },
    ],
    description: "Michigan has no paid family or maternity leave for private-sector workers. Workers rely on the federal FMLA, which provides up to 12 weeks of unpaid, job-protected leave — meaning lower-income workers, who can't afford to go without pay, effectively have no real leave at all. This directly drives the gender wage gap: Claudia Goldin's Nobel-winning research shows the pay gap is largely driven by what happens after childbirth, when women disproportionately reduce hours or exit the workforce due to caregiving costs. A paid leave insurance program — funded through small employer and employee payroll contributions, not state general funds — provides 12 weeks at 80% of wages. Minnesota launched its program in 2026; Connecticut offers up to 12 weeks; Massachusetts up to 26 weeks. Michigan's own FLOC Act (Senate Bills 332-333) proposed exactly this model but stalled in late 2024. The cost here represents state startup and administration costs; the ongoing program is largely self-funded through contributions.",
    theorist: "Goldin / Heckman",
    tension: "Small businesses worry about coverage costs during employee absences. And does leave help if affordable childcare still doesn't exist afterward?",
    tag: "Gender Equity",
    example: "Minnesota (launched 2026), Connecticut (12 weeks), Massachusetts (up to 26 weeks), Colorado (12 weeks + 4 for pregnancy complications); Michigan FLOC Act (stalled 2024)",
  },
  {
    id: 12, category: "Higher Education",
    name: "Community College Tuition-Free",
    subtitle: "For Pell-eligible students at Michigan public 2-year colleges",
    cost: 80,
    tiers: [
      { label: "All Pell-Eligible", cost: 80, reach: "Families earning under ~$60,000 — roughly 60% of Michigan community college students" },
      { label: "First-Gen Only", cost: 35, reach: "First-generation students from low-income families — more targeted, higher equity impact per dollar" },
    ],
    description: "College still matters for economic mobility — but completion rates for low-income students are far lower than for wealthy students, and debt is a major barrier. This makes Michigan community colleges free for Pell Grant recipients (roughly families earning under $60,000/year), and extends Pell eligibility to short-term certificate programs — a reform Holzer specifically recommends. Tennessee Promise (2015) made all community colleges free statewide, increasing enrollment and completion. Oregon, California, New York, and Rhode Island have similar programs. Michigan's Reconnect program already partially does this for adults 25+.",
    theorist: "Holzer",
    tension: "Helps those who enroll — but low-income students face barriers beyond tuition: transportation, childcare, lost wages.",
    tag: "Education", example: "Tennessee Promise (2015), Oregon, California, New York, Rhode Island; Michigan Reconnect (already exists for adults 25+)",
  },
  {
    id: 13, category: "Racial & Gender Equity",
    name: "Ban-the-Box + Criminal Record Reform",
    subtitle: "Restrict employer use of criminal history; fund expungement clinics",
    cost: 15,
    description: "Devah Pager's 'Marked' audit study found that being Black in America today is roughly equivalent to having a felony conviction in terms of job callbacks. 'Ban the box' — removing the criminal history checkbox from job applications — is already law in Michigan for public employers, but private employer coverage is inconsistent. This expands the policy to large private employers, strengthens EEOC compliance requirements, and funds 10 expungement clinics statewide. Over 700% growth in US incarceration since the 1980s means millions of workers — disproportionately Black men — carry records that shut them out of the labor market. Hawaii, Illinois, California, and New Jersey have the strongest statewide laws.",
    theorist: "Pager / Bertrand & Mullainathan",
    tension: "Addresses one barrier for one group — but doesn't touch structural racism in hiring, sentencing, or neighborhood disinvestment.",
    tag: "Racial Equity", example: "Hawaii, Illinois, California, New Jersey (strong statewide laws); Michigan already covers public employers",
  },
  {
    id: 14, category: "Racial & Gender Equity",
    name: "CEO Pay Transparency + Ratio Cap",
    subtitle: "Require large employers to disclose and limit CEO-to-worker pay ratios",
    cost: 10,
    description: "The CEO-to-worker pay ratio went from 31:1 in 1978 to 281:1 in 2024. Dodd-Frank (2010) required public companies to disclose this ratio — but disclosure alone hasn't changed behavior. This policy penalizes corporations with ratios above 100:1 through a graduated state tax surcharge, with revenue recycled into the EITC. Portland, Oregon became the first US city to impose such a surcharge in 2017; San Francisco followed. A group of 100 House Democrats proposed a federal cap at 50x in 2022. Germany and the UK have stronger constraints through co-determination laws that give workers seats on corporate boards.",
    theorist: "Hacker & Pierson / Piketty",
    tension: "Addresses the top of the distribution, not the bottom. Can a state-level policy really constrain multinationals?",
    tag: "Structural", example: "Portland OR (2017, first US city), San Francisco; Germany/UK co-determination; 100 House Democrats proposal (2022)",
  },
];

const TAG_COLORS = {
  "Early Investment": "#2D6A4F", "Late Investment": "#52796F", "Education": "#1B4F72",
  "Labor Market": "#6B2D2D", "Institutional Reform": "#8B4513", "Compensatory": "#4A235A",
  "UBI / Cash": "#6A0DAD", "Wealth Building": "#7B3F00", "Structural": "#1A5276",
  "Racial Equity": "#7D3C98", "Gender Equity": "#C0392B",
};

const CATEGORIES = ["Early Childhood","Education","Labor Market","Tax & Transfer","Wealth Building","Gender & Care","Higher Education","Racial & Gender Equity"];

const policyById = (id) => POLICIES.find(p => p.id === id);

// selections = { [id]: tierIndex }
const effectiveCost = (policy, tierIdx) =>
  policy.tiers ? policy.tiers[tierIdx ?? 0].cost : policy.cost;

const totalSpent = (selections) =>
  Object.entries(selections).reduce((s, [id, ti]) => {
    const p = policyById(Number(id));
    return s + (p ? effectiveCost(p, ti) : 0);
  }, 0);

// ── Supabase config ─────────────────────────────────────────────────────────
// 1. Go to supabase.com → new project → Settings → API
// 2. Copy "Project URL" and "anon public" key into the two lines below
// 3. In Supabase Table Editor, create a table called "submissions" with:
//      id   integer  primary key  default 1
//      data text
// 4. Insert one row manually: id=1, data=[]
const SUPABASE_URL = "https://bvmzbpgtxelfvzpmwvpy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2bXpicGd0eGVsZnZ6cG13dnB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwOTA3MTEsImV4cCI6MjA5MTY2NjcxMX0.3yRIbeMjqhT_SojXEu1vrYg4NGoggDA2JLJYWVnNOIY";

async function loadSubmissions() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/submissions?id=eq.1&select=data`, {
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    const rows = await res.json();
    if (!rows || rows.length === 0) return [];
    return JSON.parse(rows[0].data);
  } catch (e) { console.error("Load error:", e); return []; }
}

async function saveSubmissions(subs) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/submissions?id=eq.1`, {
      method: "PATCH",
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({ data: JSON.stringify(subs) }),
    });
  } catch (e) { console.error("Save error:", e); }
}

const S = {
  page: { fontFamily: "Georgia,'Times New Roman',serif", background: "#F7F3EE", minHeight: "100vh", color: "#1A1A1A" },
  header: { background: "#1A1A1A", color: "#F7F3EE", padding: "1.4rem 2rem 1.2rem", borderBottom: "4px solid #C8A96E" },
  label: { fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#C8A96E" },
  sectionLabel: { fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#888", borderBottom: "1px solid #DDD", paddingBottom: "0.25rem", marginBottom: "0.45rem", marginTop: "0.85rem" },
  gold: "#C8A96E", dark: "#1A1A1A", cream: "#F7F3EE",
};

export default function App() {
  const [view, setView] = useState("student");
  return view === "student"
    ? <StudentView onInstructor={() => setView("instructor")} />
    : <InstructorView onBack={() => setView("student")} />;
}

// ── Student View ──────────────────────────────────────────────────────────────
function StudentView({ onInstructor }) {
  // selections: { [policyId]: tierIndex }
  const [selections, setSelections] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [rationale, setRationale] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [warn, setWarn] = useState(false);
  const [busy, setBusy] = useState(false);

  const spent = totalSpent(selections);
  const remaining = BUDGET - spent;
  const pct = Math.min((spent / BUDGET) * 100, 100);
  const selectedIds = Object.keys(selections).map(Number);

  const toggle = (policy) => {
    const id = policy.id;
    if (selectedIds.includes(id)) {
      // deselect
      setSelections(prev => { const next = { ...prev }; delete next[id]; return next; });
    } else {
      const cost = effectiveCost(policy, 0);
      if (spent + cost > BUDGET) { setWarn(true); setTimeout(() => setWarn(false), 2200); return; }
      setSelections(prev => ({ ...prev, [id]: 0 }));
    }
  };

  const switchTier = (e, policy, tierIdx) => {
    e.stopPropagation();
    const id = policy.id;
    if (!selectedIds.includes(id)) return;
    const currentCost = effectiveCost(policy, selections[id]);
    const newCost = effectiveCost(policy, tierIdx);
    const delta = newCost - currentCost;
    if (delta > 0 && spent + delta > BUDGET) { setWarn(true); setTimeout(() => setWarn(false), 2200); return; }
    setSelections(prev => ({ ...prev, [id]: tierIdx }));
  };

  const submit = async () => {
    if (!groupName.trim() || busy) return;
    setBusy(true);
    const subs = await loadSubmissionsFromDb();
    const idx = subs.findIndex(s => s.groupName.toLowerCase() === groupName.trim().toLowerCase());
    const entry = { groupName: groupName.trim(), selections, rationale: rationale.trim(), spent, timestamp: Date.now() };
    if (idx >= 0) subs[idx] = entry; else subs.push(entry);
    await saveSubmissions(subs);
    setBusy(false); setSubmitted(true);
  };

  if (submitted) return (
    <div style={{ ...S.page, background: "#1A1A1A", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: 500, textAlign: "center", padding: "2rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>✓</div>
        <div style={{ ...S.label, marginBottom: "0.4rem" }}>Submitted</div>
        <h2 style={{ color: S.cream, fontSize: "1.5rem", margin: "0 0 0.4rem" }}>{groupName}</h2>
        <p style={{ color: "#888", fontSize: "0.88rem", marginBottom: "1.25rem" }}>${spent}M across {selectedIds.length} policies · ${remaining}M unspent</p>
        <div style={{ background: "#2A2A2A", border: "1px solid #333", borderRadius: 6, padding: "0.85rem 1rem", marginBottom: "1.25rem", textAlign: "left" }}>
          {selectedIds.map(id => {
            const p = policyById(id); const ti = selections[id];
            const label = p?.tiers ? ` (${p.tiers[ti].label})` : "";
            return <div key={id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
              <span style={{ fontSize: "0.78rem", color: "#DDD" }}>{p?.name}{label}</span>
              <span style={{ fontSize: "0.78rem", color: S.gold }}>${effectiveCost(p, ti)}M</span>
            </div>;
          })}
        </div>
        <div style={{ display: "flex", gap: "0.6rem", justifyContent: "center" }}>
          <button onClick={() => { setSubmitted(false); setSelections({}); setGroupName(""); setRationale(""); }}
            style={{ background: "transparent", border: "1px solid #555", color: "#AAA", padding: "0.45rem 1rem", borderRadius: 4, cursor: "pointer", fontSize: "0.78rem", fontFamily: "Georgia,serif" }}>← Start Over</button>
          <button onClick={onInstructor}
            style={{ background: S.gold, color: S.dark, border: "none", padding: "0.45rem 1.1rem", borderRadius: 4, cursor: "pointer", fontSize: "0.78rem", fontWeight: 700, fontFamily: "Georgia,serif" }}>View All Submissions →</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <div style={{ ...S.label, marginBottom: "0.35rem" }}>HRLR 401 · Week 13 · Policy Budget Exercise</div>
          <h1 style={{ fontSize: "clamp(1.5rem,4vw,2.1rem)", fontWeight: 700, margin: "0 0 0.25rem", letterSpacing: "-0.02em", color: "#F7F3EE" }}>You Have $500 Million.</h1>
          <p style={{ margin: 0, fontSize: "0.88rem", color: S.gold, fontStyle: "italic" }}>Advising Michigan's Governor · One legislative term · You cannot fund everything</p>
          <button onClick={onInstructor} style={{ marginTop: "0.55rem", background: "transparent", border: "1px solid #444", color: "#777", padding: "0.22rem 0.65rem", borderRadius: 3, cursor: "pointer", fontSize: "0.68rem", fontFamily: "Georgia,serif" }}>Instructor View →</button>
        </div>
      </div>

      {/* Budget bar */}
      <div style={{ background: "#2A2A2A", padding: "0.8rem 2rem", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 10px rgba(0,0,0,.28)" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
            <span style={{ fontSize: "1.05rem", fontWeight: 700, color: spent > BUDGET ? "#E74C3C" : S.cream }}>
              ${spent}M <span style={{ fontSize: "0.78rem", color: "#777", fontWeight: 400 }}>of $500M</span>
            </span>
            <span style={{ fontSize: "0.88rem", fontWeight: 600, color: remaining < 0 ? "#E74C3C" : remaining < 50 ? "#F39C12" : "#2ECC71" }}>
              {remaining >= 0 ? `$${remaining}M left` : `$${Math.abs(remaining)}M over`}
            </span>
          </div>
          <div style={{ height: 6, background: "#444", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: pct > 100 ? "#E74C3C" : pct > 80 ? "#F39C12" : S.gold, borderRadius: 3, transition: "width .35s ease,background .25s" }} />
          </div>
          {warn && <div style={{ marginTop: "0.28rem", fontSize: "0.7rem", color: "#E74C3C", fontStyle: "italic" }}>⚠ Not enough budget remaining for that option.</div>}
        </div>
      </div>

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "1.4rem 2rem" }}>
        {/* Group name */}
        <div style={{ marginBottom: "1.1rem" }}>
          <label style={{ ...S.label, display: "block", marginBottom: "0.3rem" }}>Your Group Name *</label>
          <input value={groupName} onChange={e => setGroupName(e.target.value)} placeholder="e.g. Group 3 or Team Heckman"
            style={{ width: "100%", maxWidth: 280, padding: "0.45rem 0.7rem", border: "1.5px solid #DDD", borderRadius: 4, fontFamily: "Georgia,serif", fontSize: "0.88rem", background: "#FEFAF5", boxSizing: "border-box" }} />
        </div>

        {/* Info banner */}
        <div style={{ background: "#FFF8EC", border: "1px solid #E8D5A3", borderRadius: 5, padding: "0.7rem 1rem", marginBottom: "1.1rem", fontSize: "0.78rem", color: "#5A4520", lineHeight: 1.6 }}>
          <strong>How to use:</strong> Click a card to select it. Click ▼ to read the full description and state examples.
          Six policies offer a <strong>Full / Partial</strong> funding option — choose after selecting. You cannot exceed $500M total.
        </div>

        {/* Policy cards */}
        {CATEGORIES.map(cat => {
          const catPolicies = POLICIES.filter(p => p.category === cat);
          if (!catPolicies.length) return null;
          return (
            <div key={cat}>
              <div style={S.sectionLabel}>{cat}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", marginBottom: "0.3rem" }}>
                {catPolicies.map(policy => {
                  const isSel = selectedIds.includes(policy.id);
                  const tierIdx = selections[policy.id] ?? 0;
                  const isExp = expanded === policy.id;
                  const displayCost = isSel ? effectiveCost(policy, tierIdx) : (policy.tiers ? policy.tiers[0].cost : policy.cost);
                  const cantAfford = !isSel && spent + (policy.tiers ? policy.tiers[0].cost : policy.cost) > BUDGET;

                  return (
                    <div key={policy.id} style={{
                      background: isSel ? S.dark : "#FEFAF5",
                      border: isSel ? `2px solid ${S.gold}` : "1.5px solid #E0D8CE",
                      borderRadius: 5, overflow: "hidden",
                      opacity: cantAfford ? 0.42 : 1,
                      transition: "all .22s",
                      boxShadow: isSel ? `0 2px 10px rgba(200,169,110,.18)` : "none",
                    }}>
                      {/* Header row */}
                      <div style={{ padding: "0.75rem 0.9rem", display: "flex", alignItems: "center", gap: "0.6rem", cursor: cantAfford ? "not-allowed" : "pointer" }}
                        onClick={() => !cantAfford && toggle(policy)}>
                        {/* Checkbox */}
                        <div style={{ width: 18, height: 18, border: `2px solid ${isSel ? S.gold : "#CCC"}`, borderRadius: 3, background: isSel ? S.gold : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .18s" }}>
                          {isSel && <span style={{ color: S.dark, fontSize: 10, fontWeight: "bold" }}>✓</span>}
                        </div>
                        {/* Name + tag */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.38rem", flexWrap: "wrap" }}>
                            <span style={{ fontWeight: 700, fontSize: "0.9rem", color: isSel ? S.cream : S.dark }}>{policy.name}</span>
                            <span style={{ fontSize: "0.58rem", padding: "0.08rem 0.42rem", borderRadius: 9, background: TAG_COLORS[policy.tag] || "#888", color: "#fff", letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{policy.tag}</span>
                            {policy.tiers && <span style={{ fontSize: "0.58rem", color: isSel ? "#AAA" : "#AAA", fontStyle: "italic" }}>· scalable</span>}
                          </div>
                          <div style={{ fontSize: "0.73rem", color: isSel ? S.gold : "#777", marginTop: "0.06rem" }}>{policy.subtitle}</div>
                        </div>
                        {/* Cost */}
                        <div style={{ fontSize: "1rem", fontWeight: 700, color: isSel ? S.gold : S.dark, flexShrink: 0, marginRight: "0.2rem" }}>${displayCost}M</div>
                        {/* Expand toggle */}
                        <button onClick={e => { e.stopPropagation(); setExpanded(isExp ? null : policy.id); }}
                          style={{ background: "transparent", border: "none", cursor: "pointer", color: isSel ? S.gold : "#999", fontSize: "0.82rem", padding: "0 0.12rem", flexShrink: 0 }}>
                          {isExp ? "▲" : "▼"}
                        </button>
                      </div>

                      {/* Tier toggle — only shown when selected and policy has tiers */}
                      {isSel && policy.tiers && (
                        <div style={{ padding: "0 0.9rem 0.65rem 2.9rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}
                          onClick={e => e.stopPropagation()}>
                          <span style={{ fontSize: "0.62rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", paddingTop: "0.35rem", flexShrink: 0 }}>Funding level:</span>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                            {policy.tiers.map((tier, ti) => {
                              const isActive = tierIdx === ti;
                              const canSwitch = ti !== tierIdx && (ti < tierIdx || spent - effectiveCost(policy, tierIdx) + tier.cost <= BUDGET);
                              return (
                                <button key={ti} onClick={e => canSwitch && switchTier(e, policy, ti)}
                                  style={{
                                    background: isActive ? S.gold : "transparent",
                                    border: `1.5px solid ${isActive ? S.gold : "#555"}`,
                                    color: isActive ? S.dark : "#AAA",
                                    padding: "0.25rem 0.7rem",
                                    borderRadius: 3,
                                    cursor: canSwitch ? "pointer" : "default",
                                    fontSize: "0.72rem",
                                    fontWeight: isActive ? 700 : 400,
                                    fontFamily: "Georgia,serif",
                                    textAlign: "left",
                                    opacity: !canSwitch && !isActive ? 0.4 : 1,
                                  }}>
                                  <span style={{ fontWeight: 700 }}>{tier.label} — ${tier.cost}M</span>
                                  <span style={{ marginLeft: "0.5rem", fontWeight: 400, fontSize: "0.68rem", opacity: 0.85 }}>{tier.reach}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Expanded detail */}
                      {isExp && (
                        <div style={{ padding: "0 0.9rem 0.9rem 2.9rem", borderTop: `1px solid ${isSel ? "#333" : "#EEE"}`, paddingTop: "0.7rem" }}>
                          <p style={{ fontSize: "0.8rem", color: isSel ? "#C8C8C8" : "#333", margin: "0 0 0.65rem", lineHeight: 1.7 }}>{policy.description}</p>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                              <div>
                                <div style={{ fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.1em", color: S.gold, marginBottom: 2 }}>Reading Connection</div>
                                <div style={{ fontSize: "0.75rem", color: isSel ? "#EEE" : "#333" }}>{policy.theorist}</div>
                              </div>
                              <div style={{ flex: 1, minWidth: 180 }}>
                                <div style={{ fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.1em", color: S.gold, marginBottom: 2 }}>Key Tension</div>
                                <div style={{ fontSize: "0.75rem", color: isSel ? "#EEE" : "#333", fontStyle: "italic" }}>{policy.tension}</div>
                              </div>
                            </div>
                            <div style={{ background: isSel ? "#2A2A2A" : "#F0EBE3", borderLeft: `3px solid ${S.gold}`, padding: "0.4rem 0.65rem", borderRadius: "0 3px 3px 0" }}>
                              <div style={{ fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.1em", color: S.gold, marginBottom: 2 }}>State/Local Examples</div>
                              <div style={{ fontSize: "0.75rem", color: isSel ? "#CCC" : "#555" }}>{policy.example}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Submit panel */}
        {selectedIds.length > 0 && (
          <div style={{ marginTop: "2rem", background: S.dark, border: `2px solid ${S.gold}`, borderRadius: 7, padding: "1.2rem 1.4rem" }}>
            <div style={{ ...S.label, marginBottom: "0.65rem" }}>Your Portfolio — ${spent}M of $500M</div>
            {selectedIds.map(id => {
              const p = policyById(id); const ti = selections[id];
              const tierLabel = p?.tiers ? ` · ${p.tiers[ti].label}` : "";
              return <div key={id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "0.8rem", color: S.cream }}>{p?.name}</span>
                  <span style={{ marginLeft: "0.4rem", fontSize: "0.62rem", color: "#888", fontStyle: "italic" }}>{tierLabel}</span>
                  <span style={{ marginLeft: "0.4rem", fontSize: "0.58rem", padding: "0.06rem 0.38rem", borderRadius: 8, background: TAG_COLORS[p?.tag] || "#888", color: "#fff", textTransform: "uppercase", letterSpacing: "0.04em" }}>{p?.tag}</span>
                </div>
                <span style={{ fontSize: "0.8rem", color: S.gold, fontWeight: 600, flexShrink: 0 }}>${effectiveCost(p, ti)}M</span>
              </div>;
            })}
            <div style={{ borderTop: "1px solid #333", paddingTop: "0.32rem", display: "flex", justifyContent: "space-between", marginBottom: "1.1rem" }}>
              <span style={{ fontSize: "0.78rem", color: "#777" }}>Unspent</span>
              <span style={{ fontSize: "0.78rem", color: remaining >= 0 ? "#2ECC71" : "#E74C3C", fontWeight: 600 }}>${remaining}M</span>
            </div>

            {/* Discussion prompts */}
            <div style={{ background: "#111", borderRadius: 4, padding: "0.65rem 0.85rem", marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.1em", color: S.gold, marginBottom: "0.4rem" }}>Be ready to defend:</div>
              {[
                "What did you cut entirely, and why?",
                "For tiered policies — why Full or Partial? What does scaling down mean for who gets helped?",
                "Does your portfolio address income, wealth, or both?",
                "Is this Jackson's 'right conversation' — or still the wrong one?",
              ].map((q, i) => (
                <div key={i} style={{ fontSize: "0.75rem", color: "#AAA", fontStyle: "italic", paddingLeft: "0.65rem", borderLeft: `2px solid ${S.gold}`, marginBottom: "0.28rem" }}>{q}</div>
              ))}
            </div>

            <label style={{ ...S.label, display: "block", marginBottom: "0.3rem" }}>What did you cut, and why? (optional but encouraged)</label>
            <textarea value={rationale} onChange={e => setRationale(e.target.value)}
              placeholder="Explain your tradeoffs — what you prioritized, what you sacrificed, and what tensions you ran into..."
              rows={3} style={{ width: "100%", padding: "0.55rem 0.7rem", border: "1.5px solid #444", borderRadius: 4, fontFamily: "Georgia,serif", fontSize: "0.8rem", background: "#2A2A2A", color: S.cream, resize: "vertical", boxSizing: "border-box" }} />

            <button onClick={submit} disabled={!groupName.trim() || busy}
              style={{ marginTop: "0.7rem", background: groupName.trim() ? S.gold : "#555", color: S.dark, border: "none", padding: "0.55rem 1.4rem", borderRadius: 4, cursor: groupName.trim() ? "pointer" : "not-allowed", fontSize: "0.83rem", fontWeight: 700, fontFamily: "Georgia,serif", transition: "background .2s" }}>
              {busy ? "Submitting…" : "Submit Portfolio →"}
            </button>
            {!groupName.trim() && <div style={{ fontSize: "0.68rem", color: "#E74C3C", marginTop: "0.28rem", fontStyle: "italic" }}>Enter your group name above to submit.</div>}
          </div>
        )}

        <div style={{ marginTop: "1.3rem", fontSize: "0.67rem", color: "#AAA", fontStyle: "italic", borderTop: "1px solid #DDD", paddingTop: "0.6rem", lineHeight: 1.6 }}>
          15 policies · Costs are illustrative estimates for discussion. Sources: Heckman (GH 69), Dweck (GH 70), Cohen & Sabel (GH 71), Holzer (GH 72), Jackson (GH 74); Dube (2019); Pager (2003); Goldin (2023); Hacker & Pierson (2010); Chetty et al. State examples current as of April 2026.
        </div>
      </div>
    </div>
  );
}

// ── Instructor View ───────────────────────────────────────────────────────────
function InstructorView({ onBack }) {
  const [subs, setSubs] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const load = async () => { const s = await loadSubmissionsFromDb(); s.sort((a, b) => b.timestamp - a.timestamp); setSubs(s); };
  useEffect(() => { load(); }, []);

  const clearAll = async () => {
    if (!window.confirm("Clear all submissions? This cannot be undone.")) return;
    await saveSubmissions([]); setSubs([]);
  };

  // tally: count selections per policy (regardless of tier)
  const tally = {};
  POLICIES.forEach(p => { tally[p.id] = 0; });
  if (subs) subs.forEach(s => {
    const ids = s.selections ? Object.keys(s.selections).map(Number) : (s.selected || []);
    ids.forEach(id => { tally[id] = (tally[id] || 0) + 1; });
  });
  const maxTally = Math.max(...Object.values(tally), 1);
  const n = subs?.length || 0;

  const getSelectionIds = (sub) =>
    sub.selections ? Object.keys(sub.selections).map(Number) : (sub.selected || []);

  const getSubCost = (sub, id) => {
    if (sub.selections) {
      const p = policyById(id);
      return p ? effectiveCost(p, sub.selections[id] ?? 0) : 0;
    }
    return policyById(id)?.cost ?? 0;
  };

  const getTierLabel = (sub, id) => {
    if (!sub.selections) return "";
    const p = policyById(id);
    if (!p?.tiers) return "";
    return ` · ${p.tiers[sub.selections[id] ?? 0].label}`;
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div style={{ maxWidth: 920, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <div style={{ ...S.label, marginBottom: "0.2rem" }}>Instructor View</div>
            <h1 style={{ color: "#F7F3EE", fontSize: "1.35rem", fontWeight: 700, margin: 0 }}>
              Group Submissions {n > 0 && <span style={{ fontSize: "0.95rem", color: S.gold }}>— {n} group{n !== 1 ? "s" : ""}</span>}
            </h1>
          </div>
          <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
            <button onClick={load} style={{ background: "transparent", border: "1px solid #555", color: "#AAA", padding: "0.38rem 0.75rem", borderRadius: 3, cursor: "pointer", fontSize: "0.72rem", fontFamily: "Georgia,serif" }}>↻ Refresh</button>
            <button onClick={clearAll} style={{ background: "transparent", border: "1px solid #6B2D2D", color: "#E74C3C", padding: "0.38rem 0.75rem", borderRadius: 3, cursor: "pointer", fontSize: "0.72rem", fontFamily: "Georgia,serif" }}>Clear All</button>
            <button onClick={onBack} style={{ background: S.gold, color: S.dark, border: "none", padding: "0.38rem 0.85rem", borderRadius: 3, cursor: "pointer", fontSize: "0.72rem", fontWeight: 700, fontFamily: "Georgia,serif" }}>← Student View</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "1.5rem 2rem" }}>
        {subs === null ? (
          <div style={{ color: "#888", fontStyle: "italic" }}>Loading…</div>
        ) : n === 0 ? (
          <div style={{ color: "#888", fontStyle: "italic", textAlign: "center", marginTop: "3rem" }}>No submissions yet.</div>
        ) : (
          <>
            {/* Popularity chart */}
            <div style={{ marginBottom: "2rem" }}>
              <div style={S.sectionLabel}>Policy Popularity — share of groups that selected each ({n} total)</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.42rem" }}>
                {[...POLICIES].sort((a, b) => tally[b.id] - tally[a.id]).map(p => {
                  const count = tally[p.id];
                  return (
                    <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                      <div style={{ width: 195, fontSize: "0.7rem", color: "#333", flexShrink: 0, lineHeight: 1.3 }}>{p.name}</div>
                      <div style={{ flex: 1, height: 16, background: "#EEE", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${(count / maxTally) * 100}%`, background: TAG_COLORS[p.tag] || "#888", borderRadius: 3, transition: "width .5s", opacity: count === 0 ? 0.15 : 1 }} />
                      </div>
                      <div style={{ width: 68, fontSize: "0.7rem", color: "#555", flexShrink: 0, textAlign: "right" }}>
                        {count}/{n} <span style={{ color: "#AAA" }}>({n > 0 ? Math.round((count / n) * 100) : 0}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Individual portfolios */}
            <div style={S.sectionLabel}>Individual Group Portfolios</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
              {subs.map((sub, i) => {
                const isOpen = expanded === i;
                const ids = getSelectionIds(sub);
                const tags = ids.map(id => policyById(id)?.tag).filter(Boolean);
                return (
                  <div key={i} style={{ background: "#FEFAF5", border: "1.5px solid #E0D8CE", borderRadius: 5, overflow: "hidden" }}>
                    <div style={{ padding: "0.72rem 0.9rem", display: "flex", alignItems: "center", gap: "0.65rem", cursor: "pointer" }} onClick={() => setExpanded(isOpen ? null : i)}>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontWeight: 700, fontSize: "0.92rem" }}>{sub.groupName}</span>
                        <span style={{ marginLeft: "0.65rem", fontSize: "0.75rem", color: "#888" }}>{ids.length} policies · ${sub.spent}M · ${BUDGET - sub.spent}M unspent</span>
                      </div>
                      <div style={{ display: "flex", gap: "0.22rem", flexWrap: "wrap", justifyContent: "flex-end", maxWidth: 260 }}>
                        {tags.map((tag, ti) => <span key={ti} style={{ fontSize: "0.55rem", padding: "0.08rem 0.38rem", borderRadius: 8, background: TAG_COLORS[tag] || "#888", color: "#fff", whiteSpace: "nowrap" }}>{tag}</span>)}
                      </div>
                      <span style={{ color: "#999", fontSize: "0.82rem", flexShrink: 0 }}>{isOpen ? "▲" : "▼"}</span>
                    </div>
                    {isOpen && (
                      <div style={{ padding: "0 0.9rem 0.9rem", borderTop: "1px solid #EEE" }}>
                        <div style={{ paddingTop: "0.6rem", display: "flex", flexDirection: "column", gap: "0.22rem", marginBottom: "0.65rem" }}>
                          {ids.map(id => {
                            const p = policyById(id);
                            return <div key={id} style={{ display: "flex", justifyContent: "space-between" }}>
                              <span style={{ fontSize: "0.78rem", color: "#333" }}>{p?.name}<span style={{ color: "#999", fontStyle: "italic" }}>{getTierLabel(sub, id)}</span></span>
                              <span style={{ fontSize: "0.78rem", color: "#666" }}>${getSubCost(sub, id)}M</span>
                            </div>;
                          })}
                          <div style={{ borderTop: "1px solid #EEE", paddingTop: "0.22rem", display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: "0.72rem", color: "#AAA" }}>Unspent</span>
                            <span style={{ fontSize: "0.72rem", color: BUDGET - sub.spent >= 0 ? "#2ECC71" : "#E74C3C" }}>${BUDGET - sub.spent}M</span>
                          </div>
                        </div>
                        {sub.rationale && (
                          <div style={{ background: "#F0EBE3", borderLeft: `3px solid ${S.gold}`, padding: "0.45rem 0.7rem", borderRadius: "0 4px 4px 0" }}>
                            <div style={{ fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.1em", color: S.gold, marginBottom: "0.2rem" }}>Rationale</div>
                            <p style={{ margin: 0, fontSize: "0.78rem", color: "#444", fontStyle: "italic", lineHeight: 1.55 }}>{sub.rationale}</p>
                          </div>
                        )}
                        <div style={{ fontSize: "0.62rem", color: "#BBB", marginTop: "0.45rem" }}>Submitted {new Date(sub.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
