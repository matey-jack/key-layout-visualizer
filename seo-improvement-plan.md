# SEO Improvement Plan

## Recommendations

| # | Recommendation | Impact | Effort | Status |
|---|----------------|--------|--------|--------|
| 1 | **Add meta description** - Add: `<meta name="description" content="Compare casual keyboard layouts like Colemak-DH, QWERTY modifications on ortho, column-staggered, and Harmonic keyboards. Visualize key mappings for ergonomic typing.">` | 5 | 1 | ✅ |
| 2 | **Add Open Graph tags** - For better social sharing from Reddit/Medium links: `og:title`, `og:description`, `og:image`, `og:url` | 4 | 2 | ✅ |
| 3 | **Add visible intro text in the HTML body** - SPAs with empty `<div id="app">` have no crawlable content. Add a `<noscript>` block or static paragraph describing the app before the JS loads | 5 | 2 | |
| 4 | **Add canonical URL** - `<link rel="canonical" href="https://matey-jack.github.io/key-layout-visualizer/">` | 3 | 1 | ✅ |
| 5 | **Add structured data (JSON-LD)** - WebApplication or SoftwareApplication schema for rich search results | 3 | 2 | ✅ |
| 6 | **Add keywords in title** - Expand to include searchable terms: "Keyboard Layout Visualizer - Compare QWERTY, Colemak, Ortho & Ergonomic Mappings" | 4 | 1 | ✅ |
| 7 | **Add sitemap.xml and robots.txt** in `docs/` | 2 | 1 | ✅ |
| 8 | **Pre-render / SSG** - Use a prerendering plugin to generate static HTML with actual content for crawlers | 5 | 4 | |

**Impact/Effort scale:** 1=low, 5=high

**Quick wins (high impact, low effort): #1, #6, #4**
