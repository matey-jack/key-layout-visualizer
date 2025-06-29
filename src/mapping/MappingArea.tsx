import {AppState, LayoutOptionsState, LayoutType} from "../model.ts";
import {KeyMapping} from "./mapping-model.ts";
import {Signal} from "@preact/signals";
import {all30keyMappings} from "./mappings-30-keys.ts";
import {diffSummary, diffToQwerty, getLayoutModel, MappingChange, RowBasedLayoutModel} from "../layout/layout-model.ts";

export interface MappingAreaProps {
    appState: AppState;
}

export function MappingArea({appState}: MappingAreaProps) {
    return <div class="mapping-container">
        <MappingList appState={appState}/>
    </div>
}

export interface MappingListProps {
    appState: AppState;
}

export function MappingList({appState}: MappingListProps) {
    return <table class="mapping-list">
        <thead>
        <tr class="mapping-list-header">
            <td>Mapping Name</td>
            <td>Learnability Score</td>
            <td>Typing Effort Score</td>
        </tr>
        </thead>
        <tbody>
        {all30keyMappings.map((mapping) =>
            <MappingListItem mappingData={mapping} layoutModel={appState.layoutModel.value} selectedMapping={appState.mapping}/>
        )}
        </tbody>
    </table>
}

interface MappingListItemProps {
    mappingData: KeyMapping;
    layoutModel: RowBasedLayoutModel;
    selectedMapping: Signal<KeyMapping>;
}

export function MappingListItem(
    {mappingData, layoutModel, selectedMapping}: MappingListItemProps
) {
    const isSelected = selectedMapping.value.name === mappingData.name;
    return <tr
        class={"mapping-list-item" + (isSelected ? " selected" : "")}
        onClick={() => selectedMapping.value = mappingData}
    >
        <td>
            <button>{mappingData.name}</button>
        </td>
        <td>{formatDiff(diffSummary(diffToQwerty(layoutModel, mappingData)))}</td>
        <td></td>
    </tr>
}

function formatDiff(diff: Record<MappingChange, number>) {
    return `${diff["1"]}/${diff["2"]}/${diff["3"]}`
}

export function MappingDiff() {
}