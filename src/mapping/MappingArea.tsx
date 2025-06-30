import {AppState} from "../model.ts";
import {FlexMapping} from "./mapping-model.ts";
import {Signal} from "@preact/signals";
import {allMappings} from "./mappings.ts";
import {diffSummary, diffToQwerty, MappingChange, RowBasedLayoutModel} from "../layout/layout-model.ts";

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
                return <MappingListItem mappingData={mapping}
                                        layoutModel={layoutModel}
                                        selectedMapping={appState.mapping}
                />;
            }
        )}
        </tbody>
    </table>
}

interface MappingListItemProps {
    mappingData: FlexMapping;
    layoutModel: RowBasedLayoutModel;
    selectedMapping: Signal<FlexMapping>;
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
