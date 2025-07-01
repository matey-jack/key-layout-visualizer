import {AppState} from "../model.ts";
import {diffSummary, diffToQwerty, MappingChange} from "../layout/layout-model.ts";

interface DetailsAreaProps {
    appState: AppState;
}

export function DetailsArea({appState}: DetailsAreaProps) {
    const layout = appState.layoutModel.value;
    const mapping = appState.mapping.value;
    const mappingType: string = layout.getSpecificMapping(mapping)
        ? "specifically customized"
        : "derived from the generic 30-key mapping";
    return <div>
        <div class="mapping-summary">
            <p>The <b>{mapping.name}</b> key mapping for the <b>{layout.name}</b> layout is {mappingType}.</p>
            <p>{mapping.description}</p>
            <p>Source: <a href={mapping.sourceUrl}>{mapping.sourceUrl}</a></p>
        </div>
        <hr/>
        <div class="visualization-details">
            <DiffDetails diff={diffToQwerty(appState.layoutModel.value, appState.mapping.value)}/>
        </div>
    </div>;
}

interface DiffDetailsProps {
    diff: Record<string, MappingChange>;
}

export function DiffDetails({diff}: DiffDetailsProps) {
    const diffSummy = diffSummary(diff);
    return <div>
        <p>Here's how letters and prose punctuation are changed in this layout compared to well-known Qwerty:</p>
        <DiffEntry
            count={diffSummy[MappingChange.SamePosition]}
            description="Keys unchanged."
            counterClass="unchanged"
        />
        <DiffEntry
            count={diffSummy[MappingChange.SameFinger]}
            description="Keys change on same finger."
            counterClass="same-finger"
        />
        <DiffEntry
            count={diffSummy[MappingChange.SameHand]}
            description="Keys change finger on same hand."
            counterClass="same-hand"
        />
        <DiffEntry
            count={diffSummy[MappingChange.SwapHands]}
            description="Keys swap hands."
            counterClass="swap-hands"
        />
    </div>;
}

interface DiffEntryProps {
    count: number;
    description: string;
    counterClass: string;
}

export function DiffEntry({count, description, counterClass}: DiffEntryProps) {
    return <div>
        <div class={`diff-counter ${counterClass}`}>{count}</div>
        {description}
    </div>
}
