import {computed, type ReadonlySignal, signal} from '@preact/signals';
import {defaultHomeRowIndent, getStaggerType,
    type MinimalLayoutModel, namedStaggerSets, NamedTypes, qwertyKeymap, type SegState, type StaggerSet} from './seg-model.ts';
import {ergoMaker} from './dynamicLayoutModel.ts';

export function createSegState(): SegState {
    const staggerSet = signal([4, 4, 2] as StaggerSet);
    // TODO: need to set previousModel when this changes
    const keyboardWidth = signal(15);
    const homeRowIndent = signal(0);

    const layoutModel: ReadonlySignal<MinimalLayoutModel> = computed(() =>
        ergoMaker(keyboardWidth.value, staggerSet.value, homeRowIndent.value, qwertyKeymap));
    const previousModel = signal(layoutModel.value);

    return {
        keyboardWidth,
        staggerSet: computed(() => staggerSet.value),
        setStaggerSet: (value: StaggerSet) => {
            previousModel.value = layoutModel.value;
            if ((value[0] === 3) !== (staggerSet.value[0] === 3)) {
                homeRowIndent.value = 0;
            }
            staggerSet.value = value;
            // TODO: set home row indent and keyboard width to nearest permitted value.
        },
        staggerType: computed(() => getStaggerType(staggerSet.value)),
        setStaggerType: (value: NamedTypes) => {
            if (value === NamedTypes.Other) {
                console.log("Cannot set staggering to 'Other', because that's too many things.");
                return;
            }
            previousModel.value = layoutModel.value;
            homeRowIndent.value = defaultHomeRowIndent[value];
            staggerSet.value = namedStaggerSets[value]!;
            // TODO: set keyboard width to nearest permitted value.
        },
        homeRowIndent,
        layoutModel,
        previousModel: computed(() => previousModel.value),
    }
}
