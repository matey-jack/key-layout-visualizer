# Feature Plan: SVG Keyboard Export

## Overview
Add functionality to export the keyboard visualization as an SVG file, similar to the existing KLC export.

## Requirements
1. Add a "Download keyboard SVG" link next to the visualization type buttons in the VisualizationSwitches component (currently in app.tsx)
2. Name exported file using format: `{layoutName}-{keymapName}.svg`
3. Preserve all CSS classes in the SVG elements
4. Embed CSS style definitions in a `<style>` tag within the SVG
5. SVG does NOT need to include animation functionality - static snapshot is acceptable

## Implementation Details

### 1. SVG Extraction Function
Create a new utility function `extractSvgWithStyles()` in a new file: `src/utils/svg-export.ts`

**Function signature:**
```typescript
export function extractSvgWithStyles(): string | null
```

**Responsibilities:**
- Query the DOM for the SVG element (class: `keyboard-svg`)
- Clone the SVG element to avoid modifying the live DOM
- Extract all CSS styles related to keyboard visualization
- Embed styles in a `<style>` tag within the cloned SVG
- Return the SVG as a serialized string

**CSS sources to include:**
- `src/layout/KeyboardSvg.css` - Core keyboard SVG styles
- `src/layout/LayoutArea.css` - Layout-related styles (visualization buttons, etc.)
- Any other stylesheet that applies classes used in the keyboard SVG

**Key styling classes to preserve:**
- `.key-group`, `.key-outline`, `.key-label`
- `.keyboard-symbol`, `.key-name`
- Finger assignment classes: `.lthumb`, `.rthumb`, `.lindex`, `.rindex`, `.middy`, `.ringy`, `.pinky`
- Home key classes: `.home-key`, `.home-key-border`, `.home-marker-circle`
- Effort classes: `.home-key`, `.effort-*`
- Size classes: `.key-size-*`
- Frequency classes: `.frequency-circle`
- Ribbon classes: `.key-ribbon`, `.same-finger`, `.same-hand`, `.swap-hands`
- Bigram classes: `.bigram-line`, `.bigram-rank-*`, `.same-row`, `.neighboring-row`, `.opposite-row`, `.opposite-lateral`, `.alt-finger`, `.same-finger-bigram`
- Stagger line classes: `.hand-stagger-line`, `.stagger-line`
- Note: Animation classes (`.animating`, animation keyframes) are NOT required since this is a static snapshot

### 2. Naming Strategy
File naming logic (similar to KLC export):

```typescript
const layoutName = LayoutTypeNames[layout.value.type]  // e.g., "ANSI / TypeWriter"
const keymapName = mapping.value.name                   // e.g., "Colemak"
const fileName = `${keymapName}-${layoutName}.svg`      // e.g., "Colemak-ANSI.svg"
```

**Consider:** Sanitize fileName to be filesystem-safe (remove slashes, special characters)

### 3. Download Component
Create `DownloadSvgLink` component in app.tsx (or in a separate file):

**Location:** app.tsx, alongside DownloadKlcLink

**Structure:**
- Similar to DownloadKlcLink but always available (no compatibility checks needed like KLC has)
- Place after the visualization type buttons but could also be in the same section as DownloadKlcLink
- Use same styling class pattern (`.download-svg-link`) for consistency

**Flow:**
1. Extract current SVG with styles via `extractSvgWithStyles()`
2. Create a Blob with type `"image/svg+xml"`
3. Generate filename using layout name and keymap name
4. Trigger download using same pattern as KLC export

### 4. Placement Options

#### Option A: Next to visualization buttons (Recommended)
Place `DownloadSvgLink` right after the visualization type buttons in `VisualizationSwitches` component:
- Visually grouped with what's being visualized
- Clear intent: "download this visualization"
- Shares space with other export/action items

```jsx
<div className="visualization-switches">
    <div>
        Layout Visualizations: [buttons...]
        {/* Download SVG link here */}
    </div>
    <div>
        Mapping Visualizations: [buttons...]
        {appState && isKlcCompatible(appState) && <DownloadKlcLink appState={appState}/>}
        <DownloadSvgLink appState={appState}/>
    </div>
</div>
```

#### Option B: In layout options bar
Add to `LayoutOptionsBar` component in LayoutArea.tsx
- Groups all keyboard-specific actions
- Would require passing appState down

### 5. CSS Styling
Add to `src/layout/LayoutArea.css`:

```css
.download-svg-link {
    margin-left: 1rem;
    color: #003fae;
    text-decoration: none;
    cursor: pointer;
}

.download-svg-link:hover {
    text-decoration: underline;
    color: #5cdbef;
}
```

## Implementation Steps

1. **Create SVG export utility** (`src/utils/svg-export.ts`)
   - Implement `extractSvgWithStyles()` function
   - Handle CSS extraction from stylesheets
   - Return serialized SVG string

2. **Create download component** (in app.tsx or new file)
   - Implement `DownloadSvgLink` component
   - Add state/logic to call extraction and trigger download
   - Use consistent styling with KLC link

3. **Update app.tsx**
   - Import new download component
   - Add component to VisualizationSwitches JSX (or appropriate location)

4. **Update CSS** (LayoutArea.css)
   - Add styles for `.download-svg-link` and hover state

5. **Test**
   - Verify SVG downloads with correct filename
   - Verify all CSS classes are preserved in exported SVG
   - Verify styles are properly embedded
   - Test with different layout and keymap combinations
   - Test animation preservation (CSS variables used in transforms)

## Data Dependencies
- `appState.layoutModel.value` - Current keyboard layout model
- `appState.layout.value.type` - Current layout type (ANSI, Harmonic, etc.)
- `appState.mapping.value.name` - Current keymap name
- `appState.vizType.value` - Current visualization type (determines which styles are applied)

## CSS Requirements Simplified
Since the exported SVG is a static snapshot:
- No need to preserve CSS animations or keyframes
- No need to preserve CSS custom properties (--from-x, --to-x, etc.)
- Can extract a minimal set of CSS rules focused on colors, sizing, and visual styling
- SVG will show the current state without transitions

## Browser Compatibility
- SVG with embedded styles: Widely supported
- Blob and URL.createObjectURL: IE10+
- Modern browsers: Full support

## Future Enhancements
- Add "Copy SVG" functionality alongside download
- Option to export SVG without CSS (styles inlined)
- Option to export current animation frame
- SVG compression/optimization before export
- SVG editing after export (interactive SVG)
