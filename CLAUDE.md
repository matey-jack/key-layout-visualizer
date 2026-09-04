# Working notes for this repo

see [AGENTS.md](AGENTS.md) for a general intro to the app and dev workflows.
also [ReadMe.md](ReadMe.md) for general context.
also [css-gotchas.md](css-gotchas.md) for CSS lessons learned (subgrid, min-height distribution, bold ghost pattern).

## Environment / tooling gotchas

Some of this applies only when running on Windows. 
If running on WSL or other environments it might be different.

### Preview app

`npm dev` (Vite) is usally already running. 
Try connecting to localhost:3000 with the browser before starting the dev server on your own.

#### Outgoing keys stay in the SVG — don't read the DOM right after a switch

After a layout or mapping switch, the keys of the *previous* board are still rendered next to the
new ones, so that they can animate out. `getKeyMovements` matches keys by label, so a key whose
label changed counts as one leaving and one arriving, and both are in the DOM at once.
Outgoing keys carry no Shift/AltGr levels (`KeyboardLayer` only passes levels to `movement.next`),
so they show a bare base label.

When reading the DOM to check a change, this looks exactly like a bug: a number row that is
supposed to be gone, punctuation whose Shift character vanished, two different sets of centre keys.
Switch to another mapping and back, or reload, and read again — or better, check the real thing
with a `tsx` probe (below) and use the browser only to confirm.

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

## Documentation style

A lot of the app describes itself, because the behavior is easily observed. We don't document 
key sizes or key mappings, because it's easier to see them graphically in the app than described 
anywhere. What we need to document is the rationale of why things are the way they are. But even 
this need not be overdone. 

Documentation describes the code as it is now, never as it was before.
No "this replaces X", no "used to be Y", no "is being retired", no migration notes —
not in `docs/`, not in code comments. Rationale for the current state is welcome
("we picked ␣ over ␠ because …"); the history of how we got there belongs in commit
messages and pull requests, where it stays attached to the change that made it true.

There should also be no redundancy in the documentation, which includes the user-facing docs 
(like keymap and layout descriptions), any .md files and comments in the code. 
Each fact should only be given or explained in the appropriate one of those places. 
If needed, other places can refer to the canonical place, 
but don't even need to do that if the relation to find the relevant doc is sufficiently obvious.

(If you see this redundantly in `~/.claude/CLAUDE.md` it's not the user violating their own rule, 
but it's because that local file will not be present in Claude Cloud Code.)
