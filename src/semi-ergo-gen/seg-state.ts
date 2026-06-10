import {computed, type ReadonlySignal, signal} from '@preact/signals';
import {defaultHomeRowIndent, getStaggerType,
    type MinimalLayoutModel, namedStaggerSets, NamedTypes, permittedHomeRowIndent,
    permittedKeyboardWidths, qwertyKeymap, type SegState, type StaggerSet} from './seg-model.ts';
import {ergoMaker} from './dynamicLayoutModel.ts';

function nearestPermitted(current: number, permitted: number[]): number {
    return permitted.reduce((a, b) => Math.abs(b - current) < Math.abs(a - current) ? b : a);
}

export function createSegState(): SegState {
    const staggerSet = signal([4, 4, 2] as StaggerSet);
    const keyboardWidth = signal(15);
    const homeRowIndent = signal(0);

    const staggerType = computed(() => getStaggerType(staggerSet.value));

    const layoutModel: ReadonlySignal<MinimalLayoutModel> = computed(() =>
        ergoMaker(keyboardWidth.value, staggerSet.value, homeRowIndent.value, qwertyKeymap));
    const previousModel = signal(layoutModel.value);

    return {
        keyboardWidth: keyboardWidth,
        setKeyboardWidth: (value: number) => {
            previousModel.value = layoutModel.value;
            keyboardWidth.value = nearestPermitted(value, permittedKeyboardWidths(staggerType.value));
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
        homeRowIndent,
        setHomeRowIndent: (value: number) => {
            previousModel.value = layoutModel.value;
            homeRowIndent.value = nearestPermitted(value, permittedHomeRowIndent(staggerType.value));
        },
        layoutModel,
        previousModel: computed(() => previousModel.value),
    }
}
