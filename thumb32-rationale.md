# Rationale for the `thumb32` Keymap Type

Written by Gemini via Antigravity and reviewed / edited by a human. 
Actually, I only deleted one argument that wasn't fully logical. 

## Overview of Keymap Types

1. **`ansi32`** (`[0, 11, 11, 10, 0]` keys per row)
   * **Scope**: 26 letters + 3 language-specific letters (e.g., German Umlauts `äöü`, French accents, Swedish letters) + 3 punctuation characters (`,.-`).
   * **Total**: 32 keys.

2. **`thumb32`** (`[0, 11, 11, 9, 1]` keys per row)
   * **Scope**: 26 letters + 3 language-specific letters + 3 punctuation characters (`,.-`).
   * **Total**: 32 keys (31 main row keys + 1 thumb key).

---

## Why `thumb32` is Preferred Over `thumb33`

We chose to define `thumb32` rather than `thumb33` (`[0, 11, 11, 10, 1]`) based on the following structural, ergonomic, and logical considerations:

### 1. Main Row Key Conservation (Hardware Compatibility)
Ergonomic split keyboards (e.g., Corne, Iris, Ferris Sweep) and custom staggered boards with split space bars are extremely key-constrained. 
* **`thumb32`** requires **31 keys** on the main three rows.
* **`thumb33`** requires **32 keys** on the main three rows.
By saving a key on the main rows, `thumb32` makes it easier to fit onto compact form factors without forcing the displacement of vital system keys (like `Backspace`, `Enter`, `Escape`, `Delete`, or modifier keys) to awkward layers or outer positions.

### 2. Symmetric Metric Comparisons
Using the exact same 32-character set as `ansi32` ensures a level playing field when comparing keymap performance:
* We can directly compare typing effort scores, same-finger bigram conflicts, and learning diffs between a layout's standard representation (`ansi32`) and its thumb-letter alternative (`thumb32`).
* If we introduced a 33rd character in `thumb33` (e.g., `ß` or another punctuation symbol), any direct comparison with `ansi32` would be skewed because the character frequencies and bigram statistics of the two layouts would evaluate different datasets.

### 3. Symmetry with the 30-Key Precedent
Our existing 30-key keymap types follow a clear mapping pattern where the thumb layout is derived by reducing the lower row by one key and moving it to the thumb:
* **`ansi30`** (`[0, 10, 10, 10, 0]`) $\rightarrow$ **`thumb30`** (`[0, 10, 10, 9, 1]`)
* **`ansi32`** (`[0, 11, 11, 10, 0]`) $\rightarrow$ **`thumb32`** (`[0, 11, 11, 9, 1]`)

This symmetrical relationship makes the codebase's validation rules, frame mappings, and overall architecture highly uniform, predictable, and easier to maintain.
