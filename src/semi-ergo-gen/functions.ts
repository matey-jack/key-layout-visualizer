import type {KeyMovement, KeyPosition} from '../base-model.ts';

const groupByRow = (positions: KeyPosition[]) => {
    const map = new Map<number, KeyPosition[]>();
    for (const pos of positions) {
        const list = map.get(pos.row) ?? [];
        list.push(pos);
        map.set(pos.row, list);
    }
    return map;
};

// Pairs two sorted arrays of unlabeled keys from both ends inward; extras enter/exit in the middle.
function pairGap(prevGap: KeyPosition[], nextGap: KeyPosition[]): KeyMovement[] {
    const movements: KeyMovement[] = [];
    const n = Math.min(prevGap.length, nextGap.length);
    const leftCount = Math.ceil(n / 2);
    const rightCount = Math.floor(n / 2);

    for (let i = 0; i < leftCount; i++) {
        movements.push({prev: prevGap[i], next: nextGap[i]});
    }
    for (let i = leftCount; i < prevGap.length - rightCount; i++) {
        movements.push({prev: prevGap[i], next: undefined});
    }
    for (let i = leftCount; i < nextGap.length - rightCount; i++) {
        movements.push({prev: undefined, next: nextGap[i]});
    }
    for (let i = 0; i < rightCount; i++) {
        movements.push({
            prev: prevGap[prevGap.length - rightCount + i],
            next: nextGap[nextGap.length - rightCount + i],
        });
    }
    return movements;
}

/*
 * Pairs labeled keys (non-empty label) first by matching label value, then pairs unlabeled keys
 * in each gap (before the first labeled pair, between consecutive labeled pairs, after the last)
 * from both ends inward, with extras entering or exiting in the middle.
 *
 * Labels in prev and next are assumed to always match; logs an error if they don't.
 */
export function pairKeysByPosition(prevPositions: KeyPosition[], nextPositions: KeyPosition[]): KeyMovement[] {
    const prevByRow = groupByRow(prevPositions);
    const nextByRow = groupByRow(nextPositions);

    const movements: KeyMovement[] = [];
    const allRows = new Set([...prevByRow.keys(), ...nextByRow.keys()]);

    for (const row of allRows) {
        const prevKeys = [...(prevByRow.get(row) ?? [])].sort((a, b) => a.col - b.col);
        const nextKeys = [...(nextByRow.get(row) ?? [])].sort((a, b) => a.col - b.col);

        const prevLabeled = prevKeys.filter(k => k.label !== '');
        const nextLabeled = nextKeys.filter(k => k.label !== '');
        const prevUnlabeled = prevKeys.filter(k => k.label === '');
        const nextUnlabeled = nextKeys.filter(k => k.label === '');

        const nextByLabel = new Map(nextLabeled.map(k => [k.label, k]));
        const prevByLabel = new Map(prevLabeled.map(k => [k.label, k]));

        const labeledPairs: Array<{prev: KeyPosition, next: KeyPosition}> = [];
        for (const pk of prevLabeled) {
            const nk = nextByLabel.get(pk.label);
            if (!nk) {
                console.error(`pairKeysByPosition: label '${pk.label}' in prev has no match in next (row ${row})`);
                continue;
            }
            labeledPairs.push({prev: pk, next: nk});
        }
        for (const nk of nextLabeled) {
            if (!prevByLabel.has(nk.label)) {
                console.error(`pairKeysByPosition: label '${nk.label}' in next has no match in prev (row ${row})`);
            }
        }
        labeledPairs.sort((a, b) => a.prev.col - b.prev.col);

        for (const pair of labeledPairs) {
            movements.push(pair);
        }

        // Pair unlabeled keys in each gap between (and around) labeled anchors.
        for (let g = 0; g <= labeledPairs.length; g++) {
            const prevLeft = g === 0 ? -Infinity : labeledPairs[g - 1].prev.col;
            const prevRight = g === labeledPairs.length ? Infinity : labeledPairs[g].prev.col;
            const nextLeft = g === 0 ? -Infinity : labeledPairs[g - 1].next.col;
            const nextRight = g === labeledPairs.length ? Infinity : labeledPairs[g].next.col;

            const prevGap = prevUnlabeled.filter(k => k.col > prevLeft && k.col < prevRight);
            const nextGap = nextUnlabeled.filter(k => k.col > nextLeft && k.col < nextRight);
            movements.push(...pairGap(prevGap, nextGap));
        }
    }

    return movements;
}
