import './MappingArea.css';
import {type Signal, useSignal} from "@preact/signals";
import type {AppState} from "../app-model.ts";
import {BigramType, type FlexMapping, KeymapTypeId, type LayoutModel, type MappingChange,} from "../base-model.ts";
import {getBigramMovements, weighBigramTypes} from "../bigrams.ts";
import {CheckboxWithLabel} from "../components/CheckboxWithLabel.tsx";
import {singleCharacterFrequencies as englishFreqs} from "../frequencies/english-single-character-frequencies.ts";
import {singleCharacterFrequencies as germanFreqs} from "../frequencies/german-single-character-frequencies.ts";
import {singleCharacterFrequencies as spanishFreqs} from "../frequencies/spanish-single-character-frequencies.ts";
import {
    compatibilityScore,
    diffSummary,
    diffToBase,
    fillMapping,
    getKeyPositions,
} from "../layout/layout-functions.ts";
import {offHomeRowFrequency} from "./mapping-functions.ts";
import {allMappings} from "./mappings.ts";

export enum MappingFilter {
    English = "english",
    International = "international",
    All = "all",
}

function hasInternationalMapping(mapping: FlexMapping) {
    return !!mapping.mappings[KeymapTypeId.Ansi32] || !!mapping.mappings[KeymapTypeId.Thumb32];
}

function getInitialFilterMode(mapping: FlexMapping): MappingFilter {
    if (hasInternationalMapping(mapping)) {
        return MappingFilter.International;
    }
    if (mapping.localMaximum) {
        return MappingFilter.English;
    }
    return MappingFilter.All;
}

interface FilterTabButtonProps {
    filter: MappingFilter;
    filterSignal: Signal<MappingFilter>;
    label: string;
}

function FilterTabButton({filter, filterSignal, label}: FilterTabButtonProps) {
    return <button
        type="button"
        class={`toggle-btn toggle-btn--ui toggle-btn--seg toggle-btn--sm mapping-filter-tab${filterSignal.value === filter ? " selected" : ""}`}
        onClick={() => { filterSignal.value = filter; }}
    >
        {label}
    </button>;
}

export interface MappingListProps {
    appState: AppState;
}

export function MappingList({appState}: MappingListProps) {
    const filterMode = useSignal<MappingFilter>(getInitialFilterMode(appState.mapping.value));
    const filteredMappings = allMappings.filter((mapping) => {
        switch (filterMode.value) {
            case MappingFilter.English:
                return mapping.localMaximum;
            case MappingFilter.International:
                return mapping.name.toUpperCase() === "QWERTY" || hasInternationalMapping(mapping);
        }
        return true;
    });

    return <div class="mapping-list-controls">
        <div class="mapping-filter-tabs">
            <FilterTabButton label="recommended for English" filter={MappingFilter.English} filterSignal={filterMode}/>
            <FilterTabButton label="international alphabets" filter={MappingFilter.International} filterSignal={filterMode}/>
            <FilterTabButton label="all mappings" filter={MappingFilter.All} filterSignal={filterMode}/>
        </div>
        <table class="mapping-list">
            <thead>
            <tr class="mapping-list-header">
                <td rowspan={2}>Mapping Name</td>
                <td rowspan={2}>Learnability Score</td>
                <td>Key strokes off-home-row</td>
                <td>English Bigrams</td>
            </tr>
            <tr class="mapping-list-header">
                <td>English / Spanish / German</td>
                <td>Same-Finger / Alt-Fingerable / Piano</td>
            </tr>
            </thead>
            <tbody>
            {filteredMappings.map((mapping) =>
                <MappingListItem mapping={mapping}
                                 layout={appState.layoutModel.value}
                                 selectedMapping={appState.mapping}
                                 filterMode={filterMode.value}
                                 key={mapping.techName}
                                 appState={appState}/>,
            )}
            </tbody>
        </table>
    </div>;
}

interface MappingListItemProps {
    layout: LayoutModel;
    mapping: FlexMapping;
    selectedMapping: Signal<FlexMapping>;
    appState: AppState;
    filterMode: MappingFilter;
}

export function MappingListItem({layout, mapping, selectedMapping, appState, filterMode}: MappingListItemProps) {
    const selectedClass = selectedMapping.value.name === mapping.name ? "selected" : "";
    const recommendedClass = mapping.localMaximum && filterMode !== MappingFilter.English ? "recommended" : "";
    const thumbLetterClass = mapping.mappings[KeymapTypeId.Thumb30] ? "thumb-letter" : "";
    const charMap = fillMapping(layout, mapping);
    const movements = charMap && getBigramMovements(
        getKeyPositions(layout, false, charMap),
        `MappingListItem for ${mapping.name} on ${layout.name}`,
    );
    return <tr
        class={`mapping-list-item ${selectedClass} ${recommendedClass} ${thumbLetterClass}`}
        onClick={() => appState.setMapping(mapping)}
    >
        <td>{mapping.name}</td>
        <td>{charMap && formatDiff(diffSummary(diffToBase(layout, mapping)))}</td>
        <td>{charMap && offHomeRowFrequency(layout, charMap, englishFreqs)
        } / {charMap && offHomeRowFrequency(layout, charMap, spanishFreqs)
        } / {charMap && offHomeRowFrequency(layout, charMap, germanFreqs)}
        </td>
        <td>{movements && weighBigramTypes(movements, [BigramType.SameFinger])
        } / {movements && weighBigramTypes(movements, [BigramType.AltFinger])
        } / {movements && weighBigramTypes(movements, [BigramType.PianoAltFinger, BigramType.PianoScissor])}
        </td>
    </tr>;
}

function formatDiff(diff: Record<MappingChange, number>) {
    return `${compatibilityScore(diff)} (${diff[1]}/${diff[2]}/${diff[3]})`;
}
