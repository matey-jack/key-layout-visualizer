import {AppState} from "../app-model.ts";
import {BigramType, FlexMapping, MappingChange, RowBasedLayoutModel, SKE_HOME} from "../base-model.ts";
import {Signal} from "@preact/signals";
import {allMappings} from "./mappings.ts";
import {
    compatibilityScore,
    diffSummary,
    diffToBase,
    fillMapping,
    getKeyPositions,
} from "../layout/layout-functions.ts";
import {sumKeyFrequenciesByEffort, weighSingleKeyEffort} from "./mapping-functions.ts";
import {getBigramMovements, weighBigramTypes} from "../bigrams.ts";
import {singleCharacterFrequencies as englishFreqs} from "../frequencies/english-single-character-frequencies.ts";
import {singleCharacterFrequencies as spanishFreqs} from "../frequencies/spanish-single-character-frequencies.ts";
import {singleCharacterFrequencies as germanFreqs} from "../frequencies/german-single-character-frequencies.ts";

export interface MappingListProps {
    appState: AppState;
}

export function MappingList({appState}: MappingListProps) {
    return <table class="mapping-list">
        <thead>
        <tr class="mapping-list-header">
            <td>Mapping Name</td>
            <td>Learnability Score</td>
            <td>Home Row Proportion<br/>English / Spanish / German</td>
            <td>English Bigrams<br/>Same-Finger / Scissors</td>
        </tr>
        </thead>
        <tbody>
        {allMappings.map((mapping) =>
            <MappingListItem mapping={mapping}
                             layout={appState.layoutModel.value}
                             selectedMapping={appState.mapping}
                             key={mapping.techName}
                             appState={appState}/>
        )}
        </tbody>
    </table>
}

interface MappingListItemProps {
    layout: RowBasedLayoutModel;
    mapping: FlexMapping;
    selectedMapping: Signal<FlexMapping>;
    appState: AppState;
}

export function MappingListItem({layout, mapping, selectedMapping, appState}: MappingListItemProps) {
    const selectedClass = selectedMapping.value.name === mapping.name ? " selected" : "";
    const recommendedClass = mapping.localMaximum ? " recommended" : "";
    const thumbLetterClass = !!mapping.mapping30 ? " thumb-letter" : "";
    const charMap = fillMapping(layout, mapping);
    const movements = charMap && getBigramMovements(
        getKeyPositions(layout, false, charMap),
        `MappingListItem for ${mapping.name} on ${layout.name}`,
    );
    return <tr
        class={"mapping-list-item" + selectedClass + recommendedClass + thumbLetterClass}
        onClick={() => appState.setMapping(mapping)}
    >
        <td>
            <button>{mapping.name}</button>
        </td>
        <td>{charMap && formatDiff(diffSummary(diffToBase(layout, mapping)))}</td>
        <td>{charMap && sumKeyFrequenciesByEffort(layout, charMap, englishFreqs)[SKE_HOME]
        } / {charMap && sumKeyFrequenciesByEffort(layout, charMap, spanishFreqs)[SKE_HOME]
        } / {charMap && sumKeyFrequenciesByEffort(layout, charMap, germanFreqs)[SKE_HOME]}
        </td>
        <td>{movements && weighBigramTypes(movements, [BigramType.AltFinger, BigramType.SameFinger])}
            / {movements && weighBigramTypes(movements, [BigramType.OppositeRow])}
        </td>
    </tr>
}

function formatDiff(diff: Record<MappingChange, number>) {
    return `${compatibilityScore(diff)} (${diff[1]}/${diff[2]}/${diff[3]})`
}
