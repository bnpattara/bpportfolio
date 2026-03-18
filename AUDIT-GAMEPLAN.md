# Portfolio Audit — Verified & Gameplan

Based on Antigravity's audit, here's what I've confirmed in the codebase and a prioritized action plan.

---

## ✅ Confirmed findings

### 1. **Title inconsistency across sections** — CONFIRMED
| Location | Current text |
|----------|--------------|
| **About FOCUS** (status grid) | "Brand strategy & product management" |
| **Contact** (open to roles) | "brand strategy, experience design, and creative direction roles" |
| **Footer** (all pages) | "Brand Experience Strategist & Systems Designer" |
| **Layout metadata** (tab title) | "Brand Experience Strategist & Systems Designer" |

Three different framings. Pick one and apply everywhere.

---

### 2. **Three sections hidden** — CONFIRMED
- **Metrics Strip** — `style={{ display: 'none' }}` (line 194)
- **Philosophy Interstitial** — `style={{ display: 'none' }}` (line 227)
- **Recent Writing** — `style={{ display: 'none' }}` (line 241)

Current flow: Accordion → About → Capabilities → Skills → Experience → Education → Contact → Footer. No break between Work and About.

---

### 3. **Featured In row unlinked** — CONFIRMED
AdAge, AdForum, Communication Arts, Print Mag, Stash are plain `<span>` elements with no links. No proof or context.

---

### 4. **Case study titles lack context in collapsed state** — CONFIRMED
Accordion collapsed titles: "NIKE SNKRS", "Vault by Saks", "The Carolyn", "On APEX", "Diesel Iceberg", "Stylect". No subtitles or hint of what you did. Insight text only shows on expand.

---

### 5. **Capabilities vs. Core Competencies overlap** — CONFIRMED
Capabilities: Product Management, Brand Strategy, Experience Design, Systems Design, AI & Technology  
Skills: Product Management, Brand Strategy, Experience Design, Trend Forecasting, Phygital Integration, User Journey Mapping, etc.  
"Brand Strategy" appears in both. There's redundancy.

---

### 6. **About bio density** — CONFIRMED
First paragraph is one long sentence (~60 words):  
> "I'm a multidisciplinary strategic creative that identifies the right problems and builds the systems, experiences, and narratives that move people from passive awareness to active brand citizenship — across digital products, physical spaces, and everything in between. I bridge creative customer experience and quantitative growth at every touchpoint, from brief to implementation..."

---

## ❌ Carolyn 404 — NOT CONFIRMED

The audit said `/work/carolyn` likely 404s. **It exists:**
- `src/app/work/carolyn/page.tsx` → iframes `public/case-studies/carolyn/index.html`
- `public/case-studies/carolyn/index.html` exists

The link should work. If it doesn't, the problem may be:
- Base path (e.g. GitHub Pages subpath)
- Iframe loading in a specific environment
- Asset paths inside the Carolyn HTML

Worth manually testing the live site.

---

## Gameplan (prioritized)

### 🔴 High — Do before launch

| # | Task | Files | Notes |
|---|------|-------|-------|
| 1 | **Unify title** across About, Contact, footer, metadata | `page.tsx`, `layout.tsx`, `13/page.tsx`, `blog/layout.tsx`, `work/*/page.tsx`, `public/case-studies/*/index.html` | Choose one: "Brand Experience Strategist & Systems Designer" or "Brand strategy & product management" or a combined version. |
| 2 | **Verify Carolyn works** | — | Visit `/work/carolyn` on your deployed site. If it breaks, debug iframe/basePath. |

---

### 🟡 Medium — Improves flow and clarity

| # | Task | Files | Notes |
|---|------|-------|-------|
| 3 | **Re-enable Philosophy interstitial** | `page.tsx` line 227 | Remove `style={{ display: 'none' }}` from `#philosophy` section. Adds a pause between Work and About. |
| 4 | **Add subtitles to accordion titles** | `page.tsx` case study data | e.g. `title: "NIKE SNKRS — The Confidence Hub"` or `subtitle: "The Confidence Hub"` and render both in collapsed state. |
| 5 | **Consider Metrics Strip or Recent Writing** | `page.tsx` lines 194, 241 | Re-enable one for visual break, or leave both hidden if you prefer a leaner flow. |

---

### 🟢 Low — Polish

| # | Task | Files | Notes |
|---|------|-------|-------|
| 6 | **Featured In — add links or proof** | `page.tsx` lines 371–382 | Add `href` to each publication (article/feature URL), or move to Experience with dates/project context. |
| 7 | **Break up About bio** | `page.tsx` lines 340–343 | Split first paragraph into 2–3 shorter sentences. |
| 8 | **Reduce Capabilities/Skills overlap** | `page.tsx` | Option A: Merge into one section. Option B: Capabilities = high-level, Skills = tactical tools. Option C: Trim Skills to only what's not in Capabilities. |

---

## Quick reference — where things live

| Element | File | Line(s) |
|---------|------|---------|
| Footer role text | `page.tsx` | 600 |
| Contact "open to" text | `page.tsx` | 573 |
| About FOCUS | `page.tsx` | 363 |
| Layout metadata | `layout.tsx` | 6 |
| Case study titles | `page.tsx` | 67–124 |
| Hidden sections | `page.tsx` | 194, 227, 241 |
| Featured In | `page.tsx` | 371–382 |
| About bio | `page.tsx` | 340–346 |
| Core Competencies | `page.tsx` | 466–482 |
| Capabilities | `page.tsx` | 394–458 |

---

## Suggested title options

1. **Keep current footer** — "Brand Experience Strategist & Systems Designer" (broader)
2. **Align with About** — "Brand Strategist & Product Manager" (narrower, matches FOCUS)
3. **Hybrid** — "Brand Experience Strategist & Product Designer" or "Brand Strategist & Systems Designer"

Pick one and search/replace across all locations in the Quick reference table.
