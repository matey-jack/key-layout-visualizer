import {
    bigramEffort,
    BigramType,
    FlexMapping,
    isLayoutViz,
    MappingChange,
    RowBasedLayoutModel,
    SKE_AWAY,
    SKE_HOME,
    SKE_INCONV_NEIGHBOR,
    SKE_LF_UP,
    SKE_NEIGHBOR,
    SKE_PINKY_UP,
    VisualizationType
} from "../base-model.ts";
import {AppState} from "../app-model.ts";
import {compatibilityScore, diffSummary, diffToQwerty} from "../layout/layout-functions.ts";
import {TruncatedText} from "../components/TruncatedText.tsx";
import {bigramClassByType, getEffortClass} from "../layout/KeyboardSvg.tsx";
import {ComponentChildren} from "preact";

interface DetailsAreaProps {
    appState: AppState;
}

export function DetailsArea({appState}: DetailsAreaProps) {
    const layout = appState.layoutModel.value;
    const mapping = appState.mapping.value;
    const vizType = appState.vizType.value;
    return <div>
        {isLayoutViz(vizType)
            ? <div className="layout-description">
                <TruncatedText text={layout.description}/>
            </div>
            : <MappingSummary mapping={mapping} layout={layout}/>
        }
        <hr/>
        <div class="visualization-details">
            {getVizDetails(vizType, layout, mapping)}
        </div>
    </div>;
}

export function getVizDetails(vizType: VisualizationType, layout: RowBasedLayoutModel, mapping: FlexMapping) {
    switch (vizType) {
        case VisualizationType.LayoutFingering:
            return <FingeringDetails layout={layout}/>;
        case VisualizationType.LayoutAngle:
            return <p>TODO</p>;
        case VisualizationType.LayoutEffort:
            return <KeyEffortDetails layout={layout}/>;
        case VisualizationType.MappingDiff:
            return <DiffDetails diff={diffToQwerty(layout, mapping)}/>;
        case VisualizationType.MappingFrequeny:
            return <p>
                TODO: this should show how often each letter occurs in the average of all English texts.
                This frequency is used to calculate the single-key Typing Effort Score.
            </p>;
        case VisualizationType.MappingBigrams:
            return <BigramDetails/>;
    }
}

interface MappingSummaryProps {
    mapping: FlexMapping;
    layout: RowBasedLayoutModel;
}

export function MappingSummary({mapping, layout}: MappingSummaryProps) {
    const mappingType: string = layout.getSpecificMapping(mapping)
        ? "specifically customized"
        : "derived from the generic 30-key mapping";
    const src = mapping.sourceUrl;
    return <div className="mapping-summary">
        <p>The <b>{mapping.name}</b> key mapping for the <b>{layout.name}</b> layout is {mappingType}.</p>
        {mapping.description && <TruncatedText text={mapping.description}/>}
        {src && <p>Source: <a href={src}>{src}</a></p>}
    </div>
}

export function FingeringDetails({layout: _}: { layout: RowBasedLayoutModel }) {
    return <p>
        Some people will probably hit some of those keys with different fingers. Given the many bigram conflicts and
        general awkwardness of the ANSI layout and Qwerty mapping, it might not even be the same finger for every tap
        on the same key.<br/>
        But however it might be, we need some base model for finger assignment to reason about the typing of bigrams,
        so we'll take this as a start.
    </p>
}

interface KeyEffortDetailsProps {
    layout: RowBasedLayoutModel;
}

export function KeyEffortDetails({layout}: KeyEffortDetailsProps) {
    return <div>
        <p>
            There is always some individual bias in determining how hard or easy each key on the board is to reach from
            the home position, but the differences are mostly in details, so that a resulting evaluation of letter
            frequency times key effort should not differ strongly enough to justify a change to the layout. This is
            especially true for casual layouts which strongly limit the variation in letter placement.
        </p>
        <p>
            Anyway, here are the key effort scores assigned to each color of key.
            The first part of the Typing Effort Score is calculated using this value multiplied with the average
            frequency of each letter.
        </p>
        <div>
            <KeyEffortLegendItem score={SKE_HOME}>
                Home position, including the thumb keys, if present.
            </KeyEffortLegendItem>
            <KeyEffortLegendItem score={SKE_LF_UP}>
                Upward move for long fingers is particularly easy.
            </KeyEffortLegendItem>
            <KeyEffortLegendItem score={SKE_NEIGHBOR}>
                Most neighbors of home position keys.
            </KeyEffortLegendItem>
            <KeyEffortLegendItem score={SKE_PINKY_UP}>
                Upward move for pinkies is a bit harder.
            </KeyEffortLegendItem>
            <KeyEffortLegendItem score={SKE_INCONV_NEIGHBOR}>
                Several neighbors of home keys are inconvenient to reach, especially lateral movement of the index
                fingers.

                {(layout.name.includes("ANSI")) &&
                    <p class="footnote"> On the ANSI layout for typists with classical training,
                        this also affects the left lower row where the finger assignment goes against the natural
                        direction
                        of the hand/arm.
                        (You can train yourself to use the better-suited finger for hitting the key,
                        but the you'll have to retrain whenever you use an ortho board.)</p>}
            </KeyEffortLegendItem>
            <KeyEffortLegendItem score={SKE_AWAY}>
                Keys that aren't neighbors of home position keys.
            </KeyEffortLegendItem>
        </div>
    </div>
}

interface KeyEffortLegendItem {
    score: number;
    children?: ComponentChildren;
}

export function KeyEffortLegendItem({score, children}: KeyEffortLegendItem) {
    return <div>
        <div class={"key-effort-legend-item " + getEffortClass(score)}>{score}</div>
        {children}
    </div>
}

interface DiffDetailsProps {
    diff: Record<string, MappingChange>;
}

export function DiffDetails({diff}: DiffDetailsProps) {
    const diffSummy = diffSummary(diff);
    return <div>
        <p>Here's how 26 letters and six prose punctuation characters are changed in this layout
            compared to well-known Qwerty:</p>
        <DiffEntry
            count={diffSummy[MappingChange.SamePosition]}
            description="Keys unchanged."
            counterClass="unchanged"
        />
        <DiffEntry
            count={diffSummy[MappingChange.SameFinger]}
            description="Keys change on same finger. (0.5 LP)"
            counterClass="same-finger"
        />
        <DiffEntry
            count={diffSummy[MappingChange.SameHand]}
            description="Keys change finger on same hand. (1.0 LP)"
            counterClass="same-hand"
        />
        <DiffEntry
            count={diffSummy[MappingChange.SwapHands]}
            description="Keys swap hands. (2.0 LP)"
            counterClass="swap-hands"
        />
        <p>We calculate the total learnability (or switchability) score of the mapping by deducting
            the specified amount of learning points (LP) for each type of change as listed above.</p>
        <p><b>Total Score: {compatibilityScore(diffSummy)}</b> – Lower is better.</p>
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

interface BigramDetailsProps {
}

export function BigramDetails({}: BigramDetailsProps) {
    const bigramCap = 30;
    // const bigrams = getSameHandBigrams(bigramCap, getKeyPositions(flexMapping, layoutModel))
    return <div>
        <p>
            Human hands on a keyboard can move fingers independently and usually will move the next finger to its key
            while the current key is being hit. Obviously this doesn't work when both keys are to be typed by the same
            finger or when both keys are to far away from each other.
            The bigram effort scores give extra penalties to key mappings which make this happen for letter pairs that
            occur very often together. Here is a legend of the scores I used.
        </p>
        <BigramDetailsLegendItem bigramType={BigramType.SameFinger}>
            The worst thing to happen is having to use the same finger subsequently on different keys.
            We count this as highest effort.
        </BigramDetailsLegendItem>
        <BigramDetailsLegendItem bigramType={BigramType.AltFinger}>
            When the keyboard layout makes it easy to type some keys with another finger, the single finger bottleneck
            can be avoided. (Maybe you noticed yourself typing "er", "cd", or "un" with two different fingers, although
            strict touchtyping rules assign the same finger to both keys.
        </BigramDetailsLegendItem>
        <BigramDetailsLegendItem bigramType={BigramType.SameRow}>
            Two keys on the same row are so easy and fun to type, that I assign an effort rebate for this case.
        </BigramDetailsLegendItem>
        <BigramDetailsLegendItem bigramType={BigramType.NeighboringRow}>
            Two keys on neighboring rows are no extra effort.
        </BigramDetailsLegendItem>
        <BigramDetailsLegendItem bigramType={BigramType.OppositeRow}>
            Two keys on opposite rows (upper and lower letter row) are awkward to type in sequence,
            because curling a finger moves the palm up and stretching a finger moves the palm down.
        </BigramDetailsLegendItem>
        <p>
            The visualization doesn't show when two subsequent letters are typed with two different hands,
            or if one is typed by a thumb.
        </p>
    </div>
}

interface BigramDetailsLegendItemProps {
    bigramType: BigramType;
    children?: ComponentChildren;
}

export function BigramDetailsLegendItem({bigramType, children}: BigramDetailsLegendItemProps) {
    return <div>
        <div class={"bigram-effort-legend-item " + bigramClassByType[bigramType]}>
            {bigramEffort[bigramType]}
        </div>
        {children}
    </div>

}