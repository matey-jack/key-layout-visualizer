// The shared table of the two key scripts: which map carries which key.

// The keys the tables are about: everything but the letters and digits, which each map carries
// anyway and which would only pad the table out. A flex map spot spent on a command key is worth
// a column of its own; a frame mapping is full of them, so that script filters them out on top.
export const isTableKey = (label: string) => label !== "" && !/^[a-z0-9]$/i.test(label);

export interface KeyMap {
    // What the line is about: a layout model, or a flex mapping.
    name: string;
    // The keymap type(s) the line stands for.
    type: string;
    keys: Set<string>;
}

export const pad = (text: string, width: number) => text + " ".repeat(Math.max(0, width - text.length));

/**
 * `counted` are the maps behind the column order, `rows` the lines to print, which may merge maps
 * that carry the same keys. Returns the columns, so the caller can report their number.
 */
export function printKeyTable(title: string, counted: KeyMap[], rows: KeyMap[] = counted): string[] {
    const count = (key: string) => counted.filter(({keys}) => keys.has(key)).length;
    const union = [...new Set(counted.flatMap(({keys}) => [...keys]))]
        .sort((a, b) => count(b) - count(a) || a.codePointAt(0)! - b.codePointAt(0)!);
    const line = (keys: Set<string>) =>
        union.map((key) => keys.has(key) ? key : " ".repeat(key.length)).join("");

    const nameWidth = Math.max(...rows.map(({name}) => name.length)) + 2;
    const typeWidth = Math.max(...rows.map(({type}) => type.length)) + 2;
    const shared = union.filter((key) => count(key) === counted.length);

    console.log(`\n${title}`);
    console.log("=".repeat(title.length) + "\n");
    console.log(`  ${pad("every key, in column order", nameWidth + typeWidth)}${line(new Set(union))}`);
    for (const {name, type, keys} of rows) {
        console.log(`  ${pad(name, nameWidth)}${pad(type, typeWidth)}${line(keys)}`);
    }
    console.log(shared.length > 0
        ? `\n  ${pad(`on all ${counted.length} of them`, nameWidth + typeWidth)}${line(new Set(shared))}`
        : "\n  No key is on every one of them.");
    return union;
}
