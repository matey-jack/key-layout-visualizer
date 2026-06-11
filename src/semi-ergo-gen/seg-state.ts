import {computed, effect, type ReadonlySignal, signal} from '@preact/signals';
import {defaultHomeRowIndent, getStaggerType, maximalHomeRowIndent, minimalKeyboardWidth,
    type MinMaxStep, namedStaggerSets, NamedTypes, permittedHomeRowIndent,
    permittedKeyboardWidths, qwertyKeymap, type SegState, type StaggerSet, type DynamicLayoutModel
} from './seg-model.ts';
import {ergoMaker} from './dynamicLayoutModel.ts';
import {formatDecimal} from '../library/math.ts';

function nearestPermitted(current: number, {min, max, step}: MinMaxStep): number {
    const totalSteps = Math.round((max - min) / step);
    const clamped = Math.max(0, Math.min(totalSteps, Math.round((current - min) / step)));
    return Math.round((min + clamped * step) * 1e6) / 1e6;
}

function s2f(value: string | null): number | null {
    if (!value) return null;
    const n = Number(value);
    if (!Number.isFinite(n)) return null;
    return n;
}

function parseStaggerSet(value: string | null): StaggerSet | null {
    if (!value) return null;
    const parts = value.split("_").map(Number);
    if (parts.length !== 3 || parts.some(p => !Number.isFinite(p))) return null;
    if (parts[0] === 3 && parts[1] === 3 && parts[2] === 3) return [3, 3, 3];
    if ((parts[0] === 4 || parts[0] === 2) && (parts[1] === 4 || parts[1] === 2) && (parts[2] === 4 || parts[2] === 2)) {
        return parts as unknown as StaggerSet;
    }
    return null;
}

function updateUrlParams(keyboardWidth: number, stagger: StaggerSet, homeRowIndent: number) {
    const params = new URLSearchParams();
    params.set("w", keyboardWidth.toString());
    // somehow on the Chrome browser ',' as a delimiter gets percent-encoded, thus we use '_'.
    params.set("s", stagger.join("_"));
    params.set("h", formatDecimal(homeRowIndent));
    window.history.pushState(null, "", "#" + params.toString());
}

export function createSegState(): SegState {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const initialStaggerSet = parseStaggerSet(params.get("s")) ?? [4, 4, 2] as StaggerSet;
    const initialStaggerType = getStaggerType(initialStaggerSet);
    const initialKeyboardWidth = nearestPermitted(
        s2f(params.get("w")) ?? 15,
        permittedKeyboardWidths(initialStaggerType)
    );
    const initialHomeRowIndent = nearestPermitted(
        s2f(params.get("h")) ?? 0,
        permittedHomeRowIndent(initialStaggerType)
    );

    const staggerSet = signal(initialStaggerSet);
    const keyboardWidth = signal(initialKeyboardWidth);
    const homeRowIndent = signal(initialHomeRowIndent);

    const staggerType = computed(() => getStaggerType(staggerSet.value));

    const layoutModel: ReadonlySignal<DynamicLayoutModel> = computed(() =>
        ergoMaker(keyboardWidth.value, staggerSet.value, homeRowIndent.value, qwertyKeymap));
    const previousModel = signal(layoutModel.value);

    effect(() => updateUrlParams(keyboardWidth.value, staggerSet.value, homeRowIndent.value));
    return {
        keyboardWidth,
        setKeyboardWidth: (value: number) => {
            previousModel.value = layoutModel.value;
            keyboardWidth.value = nearestPermitted(value, permittedKeyboardWidths(staggerType.value));
            const theoreticalMax = maximalHomeRowIndent(staggerSet.value, value);
            if (homeRowIndent.value > theoreticalMax) {
                homeRowIndent.value = nearestPermitted(theoreticalMax, permittedHomeRowIndent(staggerType.value));
            }
        },
        homeRowIndent,
        setHomeRowIndent: (value: number) => {
            previousModel.value = layoutModel.value;
            homeRowIndent.value = nearestPermitted(value, permittedHomeRowIndent(staggerType.value));
            const theoreticalMin = minimalKeyboardWidth(staggerSet.value, value);
            if (keyboardWidth.value < theoreticalMin) {
                keyboardWidth.value = nearestPermitted(theoreticalMin, permittedKeyboardWidths(staggerType.value));
            }
        },
        staggerSet: computed(() => staggerSet.value),
        setStaggerSet: (value: StaggerSet) => {
            previousModel.value = layoutModel.value;
            staggerSet.value = value;
            homeRowIndent.value = nearestPermitted(homeRowIndent.value, permittedHomeRowIndent(staggerType.value));
            keyboardWidth.value = nearestPermitted(keyboardWidth.value, permittedKeyboardWidths(staggerType.value));
        },
        staggerType,
        setStaggerType: (value: NamedTypes) => {
            if (value === NamedTypes.Other) {
                console.log("Cannot set staggering to 'Other', because that's too many things.");
                return;
            }
            previousModel.value = layoutModel.value;
            homeRowIndent.value = defaultHomeRowIndent[value];
            staggerSet.value = namedStaggerSets[value]!;
            keyboardWidth.value = nearestPermitted(keyboardWidth.value, permittedKeyboardWidths(value));
        },
        layoutModel,
        previousModel: computed(() => previousModel.value),
    }
}
