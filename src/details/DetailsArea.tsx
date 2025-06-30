import {AppState} from "../model.ts";

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
        <p>The <b>{mapping.name}</b> key mapping for the <b>{layout.name}</b> layout is {mappingType}.</p>
        <p>{mapping.description}</p>
        <p>Source: <a href={mapping.sourceUrl}>{mapping.sourceUrl}</a></p>
    </div>
}