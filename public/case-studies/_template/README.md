# Case Study Template

A static HTML template for portfolio case studies, based on the Vault by Saks structure. Copy this folder, replace the `[PLACEHOLDER]` markers with your content, and add the route to your portfolio.

## Quick Start

1. **Copy the template**
   ```
   cp -r _template my-project
   cd my-project
   ```

2. **Find and replace** all `[PLACEHOLDER]` markers (see reference below).

3. **Add a route** in your app (e.g. `src/app/work/my-project/page.tsx`) that loads `/case-studies/my-project/index.html` in an iframe.

---

## Placeholder Reference

### Page & Hero
| Placeholder | Example | Notes |
|-------------|---------|------|
| `[PROJECT_NAME]` | Vault by Saks | Used in title, artifact eyebrow |
| `[HERO_TITLE_SHORT]` | Rebuilding Luxury Retail | Short title for `<title>` |
| `[HERO_TITLE]` | Vault by Saks:<br>Rebuilding Luxury<br>Retail from the<br>Balance Sheet Up | Full hero title. Use `<br>` for line breaks |
| `[GHOST_WORD]` | Vault | Large watermark behind hero |
| `[HERO_IMAGE]` | hero_image.png | **Optional.** If using image: replace the `cs-hero-bg` div content with `<img src="[HERO_IMAGE]" alt="..." />` and remove the `no-img` class. If no image, keep `no-img` for gradient fallback |

### Executive Summary
| Placeholder | Example |
|-------------|---------|
| `[EXEC_BODY_1]` | First paragraph of executive summary |
| `[EXEC_BODY_2]` | Second paragraph |
| `[META_CLIENT]` | Vault by Saks |
| `[META_YEAR]` | 2026 |
| `[META_ROLE]` | Brand Strategist & Product Designer |
| `[META_GOAL]` | Platform Design + Financial Modeling |
| `[META_DELIVERABLES]` | Platform Model · Financial Model · Membership Design |
| `[META_TOOLS]` | HTML · Brand Architecture · Financial Modeling |

### Sidenav
| Placeholder | Example |
|-------------|---------|
| `[SECTION_01_TITLE]` | The Context |
| `[SECTION_02_TITLE]` | Strategic Insight |
| `[TLDR_QUOTE]` | One-sentence TL;DR for sidebar |

### Section 01
| Placeholder | Example |
|-------------|---------|
| `[SECTION_01_HEADING]` | Six Structural Failures. Not One Bad Decision. |
| `[SECTION_01_BODY_1]` | First body paragraph |
| `[SECTION_01_BODY_2]` | Second body paragraph |
| `[STAT_1_LABEL]` | Debt Load |
| `[STAT_1_NUM]` | $4.7B |
| `[STAT_1_DESC]` | Debt following merger... |
| *(repeat for STAT_2, STAT_3)* |
| `[IMAGE_01]` | [01] |
| `[IMAGE_01_DESC]` | Exterior detail — street-level intrigue |
| `[IMAGE_01_CAPTION]` | Caption for image 1 |
| *(repeat for IMAGE_02)* |

### Section 02
| Placeholder | Example |
|-------------|---------|
| `[PULL_QUOTE]` | The answer isn't less physical, it's less permanent. |
| `[SECTION_02_COL1]` | Left column body |
| `[SECTION_02_COL2]` | Right column body |

### Outcome
| Placeholder | Example |
|-------------|---------|
| `[OUTCOME_HEADING]` | Three Numbers. One Thesis. |
| `[OUTCOME_BODY]` | Summary paragraph |
| `[OUTCOME_1_NUM]` | $964M |
| `[OUTCOME_1_LABEL]` | Annual run-rate savings |
| *(repeat for 2, 3)* |

### Next Case Study
| Placeholder | Example |
|-------------|---------|
| `[NEXT_CASE_HREF]` | /work/carolyn or carolyn.html |
| `[NEXT_CASE_META]` | Calvin Klein · 2026 |
| `[NEXT_CASE_TITLE]` | The Carolyn |

### Optional: Artifact Strip
Uncomment the artifact block in the HTML. Then:
| Placeholder | Example |
|-------------|---------|
| `[ARTIFACT_NAME]` | Financial Model |
| `[ARTIFACT_DESC]` | Adjustable sliders · Bear/Base/Bull scenarios |
| `[ARTIFACT_SRC]` | vault-financial-model.html |

---

## Hero: Image vs Gradient

**With image:** Place your hero image in the case study folder. Replace the `cs-hero-bg` div with:
```html
<div class="cs-hero-bg">
  <img src="your-hero.png" alt="[PROJECT_NAME] hero" />
</div>
```

**Without image:** Keep the gradient:
```html
<div class="cs-hero-bg no-img"></div>
```

---

## Adding / Removing Sections

- **Add section:** Copy a `<section class="cs-section">` block, assign unique `id` and `data-cs-section`, add a sidenav link with matching `data-target`.
- **Remove section:** Delete the section and its sidenav link.
- **Stats grid:** Use `cs-stats-3` or `cs-stats-4` for 3 or 4 columns.
- **Images:** Replace `img-placeholder` divs with `<img src="..." alt="..." />` or use the placeholder until you have assets.

---

## CSS Classes Quick Reference

| Class | Use |
|-------|-----|
| `cs-section` | Standard section |
| `cs-section-alt` | Alternate background (gray) |
| `cs-body-2col` | Two-column body text |
| `cs-pull-quote` | Italic blockquote |
| `cs-stats`, `cs-stats-3`, `cs-stats-4` | Stat grid |
| `cs-img-full`, `cs-img-2col` | Image layouts |
| `img-placeholder` | Placeholder until image ready |
| `cs-table` | Data table |
| `artifact-strip` | Expandable iframe artifact |

---

## File Structure

```
case-studies/
  _template/           ← Template (do not use as live case study)
    index.html
    README.md
  my-project/          ← Your new case study
    index.html         ← Copy from _template, customize
    hero_image.png     ← Your assets
    artifact.html      ← Optional embedded artifact
```

---

## Portfolio Integration

For Next.js: create `src/app/work/[slug]/page.tsx`:

```tsx
export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  return (
    <div style={{ width: "100%", height: "100dvh", background: "#fff" }}>
      <iframe
        src={`/case-studies/${params.slug}/index.html`}
        title="Case Study"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
}
```

Or create a static route per project: `src/app/work/my-project/page.tsx` with `src="/case-studies/my-project/index.html"`.
