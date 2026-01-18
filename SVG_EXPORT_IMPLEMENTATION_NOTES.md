# SVG Export Implementation Notes

## Key Code References

### Current KLC Export Pattern (Template)
Located in: `src/app.tsx` lines 79-110

Key patterns to follow:
```typescript
// 1. Get data from appState
const layout = appState.layoutModel.value;
const keyMap = appState.mapping.value;
const layoutOptions = appState.layout.value;

// 2. Generate content
const content = generateContent(/* ... */);

// 3. Create blob
const blob = new Blob([content], { type: "text/plain" });

// 4. Create download link and trigger
const url = URL.createObjectURL(blob);
const link = document.createElement("a");
link.href = url;
link.download = `${fileName}.klc`;
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
URL.revokeObjectURL(url);
```

**Apply same pattern for SVG export but use:**
- `type: "image/svg+xml"` instead of `"text/plain"`
- `{fileName}.svg` instead of `{fileName}.klc`

### DOM Structure
SVG is wrapped in: `src/layout/KeyboardSvg.tsx` lines 24-29

```typescript
<div>
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1700 500" class="keyboard-svg">
        <title>Keyboard Layout Diagram</title>
        {props.children}
    </svg>
</div>
```

Query selector: `.keyboard-svg` or `svg.keyboard-svg`

### Layout Names
From: `src/base-model.ts` lines 115-120

```typescript
export const LayoutTypeNames = [
    "ANSI / TypeWriter",
    "Harmonic family",
    "Ergoplank / Katana",
    "Split Ortho",
];
```

These are indexed by `LayoutType` enum (ANSI=0, Harmonic=1, Ergoplank=2, Ergosplit=3)

### Key SVG Classes
All SVG elements use these classes (see KeyboardSvg.tsx):

**Structure:**
- `.keyboard-svg` - Root SVG container
- `.key-group` - Group of key elements (g tag)
- `.key-outline` - Key background rect
- `.key-label` - Key text

**Visual Variations (backgrounds):**
- Finger assignment: `.lthumb`, `.rthumb`, `.lindex`, `.rindex`, `.middy`, `.ringy`, `.pinky`
- Key size: `.key-size-*` (various)
- Effort: `.effort-*` (1-9) and `.home-key`
- Command keys: `.command-key-border`
- Unlabeled: `.unlabeled`

**Ribbon ribbons (mapping diff):**
- `.key-ribbon` - Container
- `.same-finger`, `.same-hand`, `.swap-hands`

**Frequency visualization:**
- `.frequency-circle` - Circle showing letter frequency

**Bigram lines:**
- `.bigram-line`
- `.bigram-rank-*` (1-9)
- `.same-row`, `.neighboring-row`, `.opposite-row`, `.opposite-lateral`, `.alt-finger`, `.same-finger-bigram`

**Stagger lines:**
- `.hand-stagger-line`, `.hand-stagger-line-left`, `.hand-stagger-line-right`
- `.stagger-line`, `.stagger-line-left`, `.stagger-line-right`
- `.stagger-line-animating`

**Animations:**
- `.animating` - Indicates element has transform animations

### CSS Files to Extract From
1. `src/layout/KeyboardSvg.css` - Main SVG styling
2. `src/layout/LayoutArea.css` - May contain utility classes

### Important: Animation CSS Properties
The SVG uses CSS custom properties (CSS variables) for animations:

```css
.key-group {
    --from-x, --from-y, --to-x, --to-y
    --from-width, --to-width
}

.stagger-line-animating {
    --from-offset, --to-offset
}
```

These are set inline on elements via JavaScript/JSX but the animation rules need to be in the stylesheet.

**Must preserve animations like:**
```css
@keyframes slideToPosition {
    from {
        transform: translate(var(--from-x), var(--from-y));
        width: var(--from-width);
    }
    to {
        transform: translate(var(--to-x), var(--to-y));
        width: var(--to-width);
    }
}
```

### Filename Sanitization
The layout name contains a slash: "ANSI / TypeWriter"

Need to sanitize for filesystem safety:
```typescript
const sanitized = layoutName.replace(/[\/\\:*?"<>|]/g, '_');
// "ANSI / TypeWriter" -> "ANSI _ TypeWriter"
```

Or use a simpler approach by using enum values instead of display names.

### CSS Extraction Strategy

**Option 1: Extract from stylesheets (Recommended)**
```javascript
const sheets = document.styleSheets;
let cssText = '';
for (let sheet of sheets) {
    if (sheet.href && (sheet.href.includes('KeyboardSvg') || sheet.href.includes('LayoutArea'))) {
        try {
            cssText += Array.from(sheet.cssRules)
                .map(rule => rule.cssText)
                .join('\n');
        } catch (e) {
            // CORS or security restrictions
        }
    }
}
```

**Option 2: Extract computed styles from cloned elements**
```javascript
const svgClone = svgElement.cloneNode(true);
const allElements = svgClone.querySelectorAll('[class]');
const styles = new Set();
allElements.forEach(el => {
    const computed = window.getComputedStyle(el);
    // Build CSS rules from computed styles
});
```

**Option 3: Hardcode critical styles (Simplest)**
If only certain classes are visually relevant, hardcode them.

### Example Implementation Skeleton

**File: `src/utils/svg-export.ts`**
```typescript
export function extractSvgWithStyles(appState: AppState): string | null {
    const svgElement = document.querySelector('svg.keyboard-svg');
    if (!svgElement) return null;

    // Clone to avoid modifying live DOM
    const svgClone = svgElement.cloneNode(true) as SVGElement;

    // Extract CSS styles
    const styleText = extractCriticalStyles();

    // Create style element
    const styleElement = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    styleElement.textContent = styleText;

    // Insert style at beginning of SVG
    svgClone.insertBefore(styleElement, svgClone.firstChild);

    // Serialize and return
    return new XMLSerializer().serializeToString(svgClone);
}

function extractCriticalStyles(): string {
    // Extract from stylesheets or use predefined styles
    // Return CSS text
}
```

**File: `src/app.tsx` (additions)**
```typescript
import { extractSvgWithStyles } from './utils/svg-export.ts';

function DownloadSvgLink({appState}: {appState: AppState}) {
    const handleDownload = () => {
        const svgContent = extractSvgWithStyles(appState);
        if (!svgContent) {
            alert("Unable to export keyboard SVG");
            return;
        }

        const layoutName = LayoutTypeNames[appState.layout.value.type].replace(/[\/\\:*?"<>|]/g, '-');
        const keymapName = appState.mapping.value.name;
        const fileName = `${keymapName}-${layoutName}.svg`;

        const blob = new Blob([svgContent], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return <a href="#" onClick={(e) => {e.preventDefault(); handleDownload();}} class="download-svg-link">
        Download keyboard SVG
    </a>;
}
```

## Testing Checklist

- [ ] SVG downloads when clicking link
- [ ] Filename includes layout and keymap names
- [ ] SVG opens in browser when downloaded
- [ ] All CSS classes are preserved in SVG
- [ ] Styles are embedded in `<style>` tag
- [ ] Colors are correct (verify against live version)
- [ ] Animations work when SVG is opened in browser
- [ ] Works with different layout types (ANSI, Harmonic, etc.)
- [ ] Works with different keymap visualizations (Size, Fingering, etc.)
- [ ] Works with different visualization types (Layout vs Mapping)
- [ ] No console errors
- [ ] No memory leaks (URL.revokeObjectURL is called)

## Browser DevTools Tips

To debug SVG extraction:
```javascript
// In console:
const svgElem = document.querySelector('svg.keyboard-svg');
const styleText = extractCriticalStyles(); // if you define this
const clone = svgElem.cloneNode(true);
new XMLSerializer().serializeToString(clone);
// Copy output to text editor to verify
```

## Possible Complications

1. **CORS restrictions** - Stylesheets loaded from CDN might have CORS issues when reading cssRules
2. **Dynamic styles** - Animations defined in .css files might not be captured if only extracting computed styles
3. **Complex selectors** - Vendor prefixes, media queries, pseudo-elements might not serialize correctly
4. **Inline styles vs classes** - SVG elements use both inline styles (via JSX) and CSS classes
5. **CSS variables** - Custom properties won't be resolved if style tag references them

## Recommended Approach

1. Extract stylesheets by href matching and cssRules iteration
2. Fallback to inline style extraction if CORS prevents stylesheet access
3. Include full animation definitions in style tag
4. Test that exported SVG looks identical to on-screen version
