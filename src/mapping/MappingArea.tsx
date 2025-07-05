import {AppState} from "../app-model.ts";
import {FlexMapping, MappingChange, RowBasedLayoutModel} from "../base-model.ts";
import {Signal} from "@preact/signals";
import {allMappings} from "./mappings.ts";
import {compatibilityScore, diffSummary, diffToQwerty} from "../layout/layout-functions.ts";
import {weighSingleKeyEffort} from "./mapping-functions.ts";
import {sumBigramScores} from "../bigrams.ts";

export interface MappingListProps {
    appState: AppState;
}

export function MappingList({appState}: MappingListProps) {
    const layoutModel = appState.layoutModel.value;
    const applicableMappings = allMappings.filter((m) =>
        Boolean(layoutModel.getSpecificMapping(m) || m.mapping30)
    )
    return <table class="mapping-list">
        <thead>
        <tr class="mapping-list-header">
            <td>Mapping Name</td>
            <td>Learnability Score</td>
            <td>Typing Effort Score</td>
        </tr>
        </thead>
        <tbody>
        {applicableMappings.map((mapping) => {
                return <MappingListItem mapping={mapping}
                                        layout={layoutModel}
                                        selectedMapping={appState.mapping}
                />;
            }
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
