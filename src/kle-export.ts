/*
    The board as keyboard-layout-editor.com describes it: the same keys the app draws, in the format
    hardware builders use as a spec. Loading an export at https://www.keyboard-layout-editor.com/
    is what tells us whether a picture in the app translates into a keyboard someone could build.

    Only the base labels go in. KLE's 3×3 label grid could carry the Shift and AltGr levels too, but
    a build spec needs the key sizes and positions, and those levels are easier to read in the app.
 */
import {KleKey, KleKeyboard, KleKeyboardMetadata, serialize} from '@kcf-hub/kle-serial';
import {isSplit, type LayoutOptions} from './app-model.ts';
import type {FlexMapping, KeyboardRows, LayoutModel} from './base-model.ts';
import {defaultKeyColor, fillMapping, getKeyPositions, isHomeKey, keyCapHeight} from './layout/layout-functions.ts';

/*
    KLE stores a colour per key, so the classes of the plain layout visualization are resolved here
    against the same values KeyboardSvg.css gives them. The visualization the app happens to be
    showing plays no part: an effort or fingering colour says nothing to whoever builds the board.
 */
const colorClassMap: Record<string, string> = {
    "home-key": "#c3f3ac",
    "edge-key": "#729bac",
    "highlighted-key": "#c6b07c",
    "unlabeled": "#e7e7e7",
    "": "#faf5eb",
};

const metadata = (layout: LayoutModel, mapping: FlexMapping): KleKeyboardMetadata =>
    Object.assign(new KleKeyboardMetadata(), {
        author: "Robert Jack Will",
        notes: "https://matey-jack.github.io/key-layout-visualizer",
        radii: "20px",
        name: `${layout.name} — ${mapping.name}`,
        backcolor: "black",
    });

/**
 * Returns null for a mapping that does not fit the layout, which is `fillMapping`'s way of saying so.
 */
export function buildKle(layout: LayoutModel, mapping: FlexMapping, options: Partial<LayoutOptions>): KleKeyboard | null {
    const charMap = fillMapping(layout, mapping);
    if (!charMap) return null;

    const positions = getKeyPositions(layout, isSplit(options), charMap);
    const leftEdge = Math.min(...positions.map((p) => p.colPos));
    const keys = positions.map((pos) => {
        const colorFn = layout.keyColorClass || defaultKeyColor;
        const colorClass = isHomeKey(layout, pos.row, pos.col)
            ? "home-key"
            : (colorFn(pos.label, pos.row as KeyboardRows, pos.col) || (!pos.label ? "unlabeled" : ""));
        const height = keyCapHeight(layout, pos.row as KeyboardRows, pos.col);

        return Object.assign(new KleKey(), {
            x: pos.colPos - leftEdge,
            y: pos.row,
            width: pos.keyCapWidth,
            height,
            // The secondary rectangle describes the notch of an L-shaped key, of which we have none.
            // Leaving it congruent with the primary one is what keeps it out of the serialized form.
            width2: pos.keyCapWidth,
            height2: height,
            labels: [
                // it's a 3×3 matrix, but we fill only enough to reach the center
                "", "", "",
                "", pos.label,
            ],
            color: colorClassMap[colorClass] || colorClassMap[""],
        });
    });

    const keyboard = new KleKeyboard();
    keyboard.meta = metadata(layout, mapping);
    keyboard.keys = keys;
    return keyboard;
}

/**
 * The file content itself, ready to be saved and loaded at keyboard-layout-editor.com.
 */
export function kleJson(layout: LayoutModel, mapping: FlexMapping, options: Partial<LayoutOptions>): string | null {
    const keyboard = buildKle(layout, mapping, options);
    return keyboard && JSON.stringify(serialize(keyboard), null, 2);
}
