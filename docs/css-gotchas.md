# CSS gotchas learned in this project

## Sharing row height across grid columns (CSS Subgrid)

**Goal:** All buttons in a 5-column grid should share the height of the tallest button, so that if any label wraps to 2 lines all buttons grow together.

**Solution:** Make the outer grid explicitly 2-row and use `grid-template-rows: subgrid` on each cell so the button row is a shared track:

```css
.outer-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    grid-template-rows: auto auto;   /* row 1 = buttons, row 2 = details */
    align-content: start;            /* see gotcha below */
}

.cell {
    display: grid;
    grid-row: span 2;
    grid-template-rows: subgrid;
    grid-template-columns: minmax(0, 1fr);  /* see gotcha below */
}
```

The first child of `.cell` lands in the shared button row; the second child lands in the shared details row. All first children therefore share a height.

Browser support: Chrome 117+, Firefox 71+, Safari 16+ (all evergreen browsers, 2024+).

---

## `min-height` on a grid distributes into `auto` rows — use `align-content: start`

`align-content` defaults to `normal` (= stretch) in CSS Grid. If you set `min-height` on the grid container and the natural content is shorter than that minimum, the browser **distributes the extra space into auto row tracks**, inflating them.

Fix: add `align-content: start` so rows only take their natural content height. The `min-height` still prevents the container from collapsing, but the extra space appears as blank area below the rows instead of inside them.

```css
.grid {
    min-height: 80px;
    align-content: start;   /* rows sit at top at natural height */
}
```

---

## Inner grid column auto-sizing can inflate beyond the outer cell

When a cell has `display: grid` (for subgrid rows), its implicit column is auto-sized. If any descendant has `width: max-content` (even hidden via `visibility: hidden`), the inner grid's column can grow much wider than the outer grid cell, and `width: 100%` on a child then resolves against the inflated inner column.

Fix: add an explicit `grid-template-columns: minmax(0, 1fr)` to every inner grid so its column is bounded by the outer cell:

```css
.cell {
    display: grid;
    grid-template-rows: subgrid;
    grid-template-columns: minmax(0, 1fr);  /* cap inner column to outer cell */
}
```

---

## Bold ghost (`::after`) for preventing bold-on-select reflow

A common pattern for pre-sizing a button to its bold width so selecting it (bold) never causes text to rewrap:

**❌ Does NOT work in a flex row container:**
```css
.btn::after {
    content: attr(data-label);
    font-weight: bold;
    display: block;
    height: 0;
    overflow: hidden;
    visibility: hidden;
}
```
Even though `overflow: hidden` should theoretically make `min-height: auto` resolve to 0 for flex items, Chrome adds ~1 line-height of phantom height to the flex container when the pseudo-element has text content. Result: button is 1 line-height taller than it should be.

**✓ Works: use `display: grid` on the button and overlap with `grid-area: 1/1`:**

```css
.btn {
    display: grid;          /* replaces display: flex */
    place-items: center;
}

.btn::after {
    content: attr(data-label);
    font-weight: bold;
    grid-area: 1 / 1;       /* overlaps the text in the same grid cell */
    max-height: 0;          /* max-height is a ceiling; height: 0 alone is not */
    overflow: hidden;
    visibility: hidden;
    width: 100%;
    text-align: center;
}
```

`max-height: 0` is the key: it acts as a hard ceiling on the grid item's contribution to the track, whereas `height: 0` alone is overridden by `min-height: auto` in both flex and grid contexts. The `overflow: hidden` clips the content visually.

Add `data-label={name}` to the button element in the template so `attr(data-label)` has a value.

---

## Debugging layout sizing in the preview

Useful eval snippets for diagnosing grid/flex sizing issues:

```js
// Computed row track sizes
getComputedStyle(document.querySelector('.my-grid')).gridTemplateRows

// Check if an inner grid's column is inflated beyond the outer cell
const cell = document.querySelector('.my-cell');
getComputedStyle(cell).gridTemplateColumns   // should match outer column width

// Measure button heights and compare to expected 1-line / 2-line
const lineH = parseFloat(getComputedStyle(btn).lineHeight);
const pad = parseFloat(getComputedStyle(btn).paddingTop) + parseFloat(getComputedStyle(btn).paddingBottom);
// 1-line expected: Math.round(lineH + pad)
// 2-line expected: Math.round(2 * lineH + pad)

// Isolate whether ::after is causing phantom height
const style = document.createElement('style');
style.textContent = '.my-btn::after { content: none !important; }';
document.head.appendChild(style);
// measure again — if height drops, ::after was the culprit
```
