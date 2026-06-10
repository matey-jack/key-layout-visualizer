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

/*
In the long term, change this to pair the labeled keys first, then pair starting from them outward and inward.
 */
export function pairKeysByPosition(prevPositions: KeyPosition[], nextPositions: KeyPosition[]): KeyMovement[] {
    const prevByRow = groupByRow(prevPositions);
    const nextByRow = groupByRow(nextPositions);

    const movements: KeyMovement[] = [];
    const allRows = new Set([...prevByRow.keys(), ...nextByRow.keys()]);

    for (const row of allRows) {
        const prevKeys = [...(prevByRow.get(row) ?? [])].sort((a, b) => a.col - b.col);
        const nextKeys = [...(nextByRow.get(row) ?? [])].sort((a, b) => a.col - b.col);

        const n = Math.min(prevKeys.length, nextKeys.length);
        const leftCount = Math.ceil(n / 2);
        const rightCount = Math.floor(n / 2);

        for (let i = 0; i < leftCount; i++) {
            movements.push({prev: prevKeys[i], next: nextKeys[i]});
        }

        // Extra keys in the middle of the longer side enter or exit.
        for (let i = leftCount; i < prevKeys.length - rightCount; i++) {
            movements.push({prev: prevKeys[i], next: undefined});
        }
        for (let i = leftCount; i < nextKeys.length - rightCount; i++) {
            movements.push({prev: undefined, next: nextKeys[i]});
        }

        for (let i = 0; i < rightCount; i++) {
            movements.push({
                prev: prevKeys[prevKeys.length - rightCount + i],
                next: nextKeys[nextKeys.length - rightCount + i],
            });
        }
    }

    return movements;
}