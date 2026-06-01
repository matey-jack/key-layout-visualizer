# Working notes for this repo

see [AGENTS.md](AGENTS.md) for a general intro to the app and dev workflows.
also [ReadMe.md](ReadMe.md) for general context.

## Environment / tooling gotchas

Some of this applies only when running on Windows. 
If running on WSL or other environments it might be different.

### `npx tsx -e` must be a SINGLE physical line — multiline silently fails
On this setup, a multiline `-e` script (and any `-e` using a top-level static `import`)
exits **0 with zero output** — no error, nothing. It's the shell/tool quoting mangling the
newlines, *not* an import throwing. Don't misread the silence as a code failure.

Reliable pattern (one line, dynamic imports, always a `.catch`):
```
npx tsx -e "Promise.all([import('./src/a.ts'),import('./src/b.ts')]).then(([a,b])=>{ /* ... */ console.log(...) }).catch(e=>console.log('ERR',e.stack))"
```
The trailing `.catch(e=>console.log('ERR',e.stack))` matters: it makes a *real* failure
visible so it can't masquerade as the silent-multiline trap.

### Project basics for ad-hoc inspection
- `tsx` is available with no install. Project is **ESM**; imports need explicit `.ts`
  extensions (`./src/base-model.ts`).
- Test runner is vitest (`npm test`), build is `npm run build` (runs `tsc -b` + vite).

### `tsx -e` as a read-only "what does this actually evaluate to" probe
This codebase is mostly **pure functions over data tables** (layout models, frame mappings,
color classes). The fastest ground-truth check is to import the real modules and evaluate —
e.g. resolve a merged frame mapping and run `keyColorClass` on every cell, or diff a
proposed change against the current output across all models. No need to run the app or
write a throwaway test file (handy in plan mode where you can't write test files anyway).

## Layout model architecture notes
- Models are plain object literals composed by **spread factories** (`{...lm, ...overrides}`),
  e.g. `createErgoPlankCenterArrows`, not ES classes. Object spread drops the prototype, so
  class-based inheritance does not mix with this pattern.
- `keyColorClass(label, row, col)` returns a `KEY_COLOR` ("" boring / "edge-key" grey /
  "highlighted-key"). `ergoFamilyKeyColorClass(shape)` captures a frame shape to derive row
  width — **re-bind it in any factory that changes row widths** (center/inline arrows), or it
  uses stale geometry. `model.keyWidths[row].length` always equals the frame-mapping row
  length (both drive `getKeyPositions`) and is a safe live width source.
