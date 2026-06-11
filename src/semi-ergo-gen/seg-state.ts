import {computed, type ReadonlySignal, signal} from '@preact/signals';
import {defaultHomeRowIndent, getStaggerType, maximalHomeRowIndent, minimalKeyboardWidth,
    type MinMaxStep, namedStaggerSets, NamedTypes, permittedHomeRowIndent,
    permittedKeyboardWidths, qwertyKeymap, type SegState, type StaggerSet, type DynamicLayoutModel
} from './seg-model.ts';
import {ergoMaker} from './dynamicLayoutModel.ts';

function nearestPermitted(current: number, {min, max, step}: MinMaxStep): number {
    const totalSteps = Math.round((max - min) / step);
    const clamped = Math.max(0, Math.min(totalSteps, Math.round((current - min) / step)));
    return Math.round((min + clamped * step) * 1e6) / 1e6;
}

export function createSegState(): SegState {
    const staggerSet = signal([4, 4, 2] as StaggerSet);
    const keyboardWidth = signal(15);
    const homeRowIndent = signal(0);

    const staggerType = computed(() => getStaggerType(staggerSet.value));

    const layoutModel: ReadonlySignal<DynamicLayoutModel> = computed(() =>
        ergoMaker(keyboardWidth.value, staggerSet.value, homeRowIndent.value, qwertyKeymap));
    const previousModel = signal(layoutModel.value);

    return {
        keyboardWidth,
        setKeyboardWidth: (value: number) => {
            previousModel.value = layoutModel.value;
            keyboardWidth.value = nearestPermitted(value, permittedKeyboardWidths(staggerType.value));
            if (homeRowIndent.value > maximalHomeRowIndent(staggerSet.value, value)) {
                homeRowIndent.value = maximalHomeRowIndent(staggerSet.value, value);
            }
        },
        homeRowIndent,
        setHomeRowIndent: (value: number) => {
            previousModel.value = layoutModel.value;
            homeRowIndent.value = nearestPermitted(value, permittedHomeRowIndent(staggerType.value));
            if (keyboardWidth.value < minimalKeyboardWidth(staggerSet.value, value)) {
                keyboardWidth.value = minimalKeyboardWidth(staggerSet.value, value);
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
