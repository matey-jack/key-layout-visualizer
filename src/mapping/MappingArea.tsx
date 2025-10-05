import {AppState} from "../app-model.ts";
import {FlexMapping, MappingChange, RowBasedLayoutModel} from "../base-model.ts";
import {Signal} from "@preact/signals";
import {allMappings} from "./mappings.ts";
import {
    compatibilityScore,
    diffSummary,
    diffToBase,
    fillMapping,
    hasMatchingMapping
} from "../layout/layout-functions.ts";
import {weighSingleKeyEffort} from "./mapping-functions.ts";
import {sumBigramScores} from "../bigrams.ts";
import {singleCharacterFrequencies as englishFeqs} from "../frequencies/english-single-character-frequencies.ts";
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
            <td>Typing Effort Score<br/>(Single / Bigram)</td>
            <td>Typing Effort Score<br/>Single for German</td>
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
    return <tr
        class={"mapping-list-item" + selectedClass + recommendedClass + thumbLetterClass}
        onClick={() => appState.setMapping(mapping)}
    >
        <td>
            <button>{mapping.name}</button>
        </td>
        <td>{charMap && formatDiff(diffSummary(diffToBase(layout, mapping)))}</td>
        <td>{charMap && weighSingleKeyEffort(layout, charMap, englishFeqs)} / {charMap && sumBigramScores(layout, charMap, mapping.name)}</td>
        <td>{charMap && weighSingleKeyEffort(layout, charMap, germanFreqs)}</td>
    </tr>
}

function formatDiff(diff: Record<MappingChange, number>) {
    return `${compatibilityScore(diff)} (${diff[1]}/${diff[2]}/${diff[3]})`
}
