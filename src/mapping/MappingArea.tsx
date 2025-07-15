import {AppState} from "../app-model.ts";
import {FlexMapping, MappingChange, RowBasedLayoutModel} from "../base-model.ts";
import {Signal} from "@preact/signals";
import {allMappings} from "./mappings.ts";
import {compatibilityScore, diffSummary, diffToQwerty, hasMatchingMapping} from "../layout/layout-functions.ts";
import {weighSingleKeyEffort} from "./mapping-functions.ts";
import {sumBigramScores} from "../bigrams.ts";

export interface MappingListProps {
    appState: AppState;
}

export function MappingList({appState}: MappingListProps) {
    const applicableMappings = allMappings.filter((m) =>
        // TODO: use a different function that doesn't use concrete LayoutModels, but only considers the layout.type.
        //      we then also need a custom setMapping function that will adjust layout options if needed.
        hasMatchingMapping(appState.layoutModel.value, m)
    );
    return <table class="mapping-list">
        <thead>
        <tr class="mapping-list-header">
            <td>Mapping Name</td>
            <td>Learnability Score</td>
            <td>Typing Effort Score<br/>(Single / Bigram)</td>
        </tr>
        </thead>
        <tbody>
        {applicableMappings.map((mapping) =>
            <MappingListItem mapping={mapping}
                             layout={appState.layoutModel.value}
                             selectedMapping={appState.mapping}
                             key={mapping.techName}/>
        )}
        </tbody>
    </table>
}

interface MappingListItemProps {
    layout: RowBasedLayoutModel;
    mapping: FlexMapping;
    selectedMapping: Signal<FlexMapping>;
}

export function MappingListItem({layout, mapping, selectedMapping}: MappingListItemProps) {
    const isSelected = selectedMapping.value.name === mapping.name;
    return <tr
        class={"mapping-list-item" + (isSelected ? " selected" : "")}
        onClick={() => selectedMapping.value = mapping}
    >
        <td>
            <button>{mapping.name}</button>
        </td>
        <td>{formatDiff(diffSummary(diffToQwerty(layout, mapping)))}</td>
        <td>{weighSingleKeyEffort(layout, mapping)} / {sumBigramScores(layout, mapping)}</td>
    </tr>
}

function formatDiff(diff: Record<MappingChange, number>) {
    return `${compatibilityScore(diff)} (${diff[1]}/${diff[2]}/${diff[3]})`
}
