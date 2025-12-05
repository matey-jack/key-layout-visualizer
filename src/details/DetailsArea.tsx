import {
    bigramEffort,
    BigramType,
    FlexMapping,
    isLayoutViz,
    KeymapTypeId,
    MappingChange,
    RowBasedLayoutModel,
    SKE_AWAY,
    SKE_HOME,
    SKE_INCONV_NEIGHBOR,
    SKE_LF_UP,
    SKE_NEIGHBOR,
    VisualizationType
} from "../base-model.ts";
import {AppState} from "../app-model.ts";
import {
    compatibilityScore,
    diffSummary,
    diffToBase,
    fillMapping,
    findMatchingKeymapType,
    getKeySizeClass,
    keyCapSize
} from "../layout/layout-functions.ts";
import {TruncatedText} from "../components/TruncatedText.tsx";
import {bigramClassByType, getEffortClass} from "../layout/KeyboardSvg.tsx";
import {ComponentChildren} from "preact";
import {sumKeyFrequenciesByEffort, weighSingleKeyEffort} from "../mapping/mapping-functions.ts";
import {sum} from "../library/math.ts";
import {bigramFrequencyByType, bigramRankSize} from "../bigrams.ts";
import {qwertyMapping} from "../mapping/mappings.ts";
import {singleCharacterFrequencies as englishFreqs} from "../frequencies/english-single-character-frequencies.ts";

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
        case VisualizationType.LayoutKeySize:
            return <KeySizeDetails layout={layout}/>;
        case VisualizationType.LayoutFingering:
            return <FingeringDetails layout={layout}/>;
        case VisualizationType.LayoutAngle:
            return <p>
                The <span className="hand-stagger-line">green</span> line represents your hand's angle on the keyboard,
                assuming that you turn a split keyboard to get
                just the right straight angle.
                For the non-split keyboards the angle actually is more vertical for people sitting straight up
                and more tilted for people like me who spread their elbows on the desk.
                The <span className="stagger-line">red</span> line shows the keyboad stagger which for ANSI
                always faces one-way because of the 0.25 step
                that would be 0.75 if one tried to reach the other way.
            </p>;
        case VisualizationType.LayoutKeyEffort:
            return <SingleKeyEffortDetails layout={layout} mapping={mapping}/>;
        case VisualizationType.MappingDiff:
            return <DiffDetails diff={diffToBase(layout, mapping)} mapping={mapping}/>;
        case VisualizationType.MappingFrequeny:
            return <p>
                The area of each shown circle is proportional to how often each letter occurs in the average of all
                English texts. This frequency is used to calculate the single-key Typing Effort Score. Switch between
                this and the Single-Key Effort visualization to see if the most frequent letters are on the easiest
                keys.
            </p>;
        case VisualizationType.MappingBigrams:
            return <BigramEffortDetails layout={layout} mapping={mapping}/>;
        case VisualizationType.MappingAltGr:
            return <AltGrLayerDetails></AltGrLayerDetails>
    }
}

interface MappingSummaryProps {
    mapping: FlexMapping;
    layout: RowBasedLayoutModel;
}

export function MappingSummary({mapping, layout}: MappingSummaryProps) {
    const keymapType = findMatchingKeymapType(layout, mapping)!.supported.typeId;
    const mappingType: string =
        keymapType === KeymapTypeId.Ansi30 ? "derived from the generic 30-key without thumb mapping"
        : keymapType === KeymapTypeId.Thumb30 ? "derived from the generic 30-key with thumb mapping"
            : "specifically customized";
    const src = mapping.sourceUrl;
    const srcTitle = mapping.sourceLinkTitle ?? src;
    return <div className="mapping-summary">
        <p>
            The <b>{mapping.name}</b> key mapping for the <b>{layout.name}</b> layout is <i>{mappingType}</i>.
        </p>
        {mapping.description && <TruncatedText text={mapping.description}/>}
        {src && <p>Source: <a href={src}>{srcTitle}</a></p>}
    </div>
}

export function FingeringDetails({layout: _}: { layout: RowBasedLayoutModel }) {
    return <p>
        Colors on the keys denote which keys will be pressed by the same finger according to the touch-typing method.
        This allows us to see, how much work each finger has, how far it has to move, and what keys can cause bigram
        conflicts.
        <br/>
        Some people will probably hit some of those keys with different fingers. Given the many bigram conflicts and
        general awkwardness of the ANSI layout and Qwerty mapping, it might not even be the same finger for every tap
        on the same key.<br/>
        But however it might be, we need some base model for finger assignment to reason about the typing of bigrams,
        so we'll take this as a start.
    </p>
}

function countKeysBySize(layoutM: RowBasedLayoutModel) {
    const counts = new Map<number, number>();
    (layoutM.supportedKeymapTypes[0].frameMapping)!.forEach((row, r) => {
        row.forEach((label, c) => {
            if (label !== null) {
                const size = keyCapSize(layoutM)(r, c);
                counts.set(size, (counts.get(size) ?? 0) + 1);
            }
        })
    })
    return counts;
}

function getUsedKeysizes(layoutM: RowBasedLayoutModel) {
    const keySizes: number[] = [];
    const frameMapping = layoutM.supportedKeymapTypes[0].frameMapping;
    frameMapping.forEach((row, r) => {
        row.forEach((label, c) => {
            const size = keyCapSize(layoutM)(r, c);
            if (label != null && size !== 1 && !keySizes.includes(size)) {
                keySizes.push(size);
            }
        })
    });
    keySizes.sort();
    return keySizes;
}

export function KeySizeDetails({layout}: { layout: RowBasedLayoutModel }) {
    const countsBySize = countKeysBySize(layout);
    const total = sum([...countsBySize.values()]);
    const sizeList = getUsedKeysizes(layout);
    return <div><p>
        Colors on the keys show which keycaps have the same size.<br/>
        It's easier to swap around keycaps to different places on the keyboard if many of them share the same size.
        It also makes production and logistics easier.
    </p>
        <div>
            <KeySizeDetailsLegendItem size={1} count={countsBySize.get(1)!}/>
            {sizeList.map((s) =>
                <KeySizeDetailsLegendItem size={s} count={countsBySize.get(s)!}/>
            )}
            <div><div class="keysize-legend-item"><b>Total</b></div> – {total} keys.</div>
        </div>
    </div>
}

type KeySizeDetailsLegendItemProps = {
    size: number;
    count: number;
    children?: ComponentChildren;
}

export function KeySizeDetailsLegendItem({size, count}: KeySizeDetailsLegendItemProps) {
    return <div>
        <div class={"keysize-legend-item " + getKeySizeClass(size)}>
            {size}
        </div>
        – {count} keys.
    </div>
}

interface KeyEffortDetailsProps {
    layout: RowBasedLayoutModel;
    mapping: FlexMapping;
}

export function SingleKeyEffortDetails({layout, mapping}: KeyEffortDetailsProps) {
    // In the details screen, we know that layout options always match the mapping, because they are set for the mapping when that is selected.
    const charMap = fillMapping(layout, mapping)!;
    const freqsByEffort = sumKeyFrequenciesByEffort(layout, charMap, englishFreqs);
    const totalEffort = Math.round(sum(
        Object.entries(freqsByEffort)
            .map(([a, b]) => Number(a) * b)
    ));
    return <div>
        <p>
            There is always some individual bias in determining how hard or easy each key on the board is to reach from
            the home position, which is why the statistic on the left shows only the usage of the eight or nine home
            keys.
            Those are the easiest to type for any shape of keyboard or hand.
        </p>
        <p>
            The following legend shows the percentage (actually permilltage 😅) of key strokes (according to English
            average letter frequency),
            that fall on each color of letter. I assigned an effort score for each color of letter. By multiplying
            frequency with the score and adding it all up, we get a "total single key effort score" for this keymap in
            English of
            <b> {weighSingleKeyEffort(layout, charMap, englishFreqs)}</b>.
        </p>
        <table><tbody>
            <KeyEffortLegendItem score={SKE_HOME} frequency={freqsByEffort[SKE_HOME]}>
                Home position, including the thumb keys, if present.
            </KeyEffortLegendItem>
            <KeyEffortLegendItem score={SKE_LF_UP} frequency={freqsByEffort[SKE_LF_UP]}>
                Upward move for long fingers is particularly easy.
            </KeyEffortLegendItem>
            <KeyEffortLegendItem score={SKE_NEIGHBOR} frequency={freqsByEffort[SKE_NEIGHBOR]}>
                Most neighbors of home position keys.
            </KeyEffortLegendItem>
            <KeyEffortLegendItem score={SKE_INCONV_NEIGHBOR} frequency={freqsByEffort[SKE_INCONV_NEIGHBOR]}>
                Several neighbors of home keys are inconvenient to reach, especially lateral movement of the index
                fingers and upward movement of the pinky fingers.

                {(layout.name.includes("ANSI")) &&
                    <p class="footnote"> On the ANSI layout for typists with classical training,
                        this also affects the left lower row where the finger assignment goes against the natural
                        direction of the hand/arm.
                        (You can train yourself to use the better-suited finger for hitting the key,
                        but the you'll have to retrain whenever you use an ortho board.)</p>}
            </KeyEffortLegendItem>
            <KeyEffortLegendItem score={SKE_AWAY} frequency={freqsByEffort[SKE_AWAY]}>
                Keys that aren't neighbors of home position keys.
            </KeyEffortLegendItem>
        </tbody></table>
        <p><b>Total: {totalEffort}</b> – Higher is better!</p>
    </div>
}

interface KeyEffortLegendItem {
    frequency: number;
    score: number;
    children?: ComponentChildren;
}

export function KeyEffortLegendItem({frequency, score, children}: KeyEffortLegendItem) {
    return <tr>
        <td class={"key-effort-legend-item " + getEffortClass(score)}>{Math.round(frequency ?? 0)}</td>
        <td>[Score:&nbsp;{score.toFixed(1)}]</td>
        <td>{children}</td>
    </tr>
}

interface DiffDetailsProps {
    diff: Record<string, MappingChange>;
    mapping: FlexMapping;
}

export function DiffDetails({diff, mapping}: DiffDetailsProps) {
    const diffSummy = diffSummary(diff);
    const base = mapping.comparisonBase ?? qwertyMapping;
    return <div>
        <p>Here's how 26 letters and six prose punctuation characters are changed in this layout
            compared to well-known <i>{base.name}</i>:</p>
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
        <div class={`diff-legend-item ${counterClass}`}>{count}</div>
        {description}
    </div>
}

interface BigramEffortDetailsProps {
    layout: RowBasedLayoutModel;
    mapping: FlexMapping;
}

export function BigramEffortDetails({layout, mapping}: BigramEffortDetailsProps) {
    const freqs = bigramFrequencyByType(layout, mapping);
    const total = sum(Object.entries(freqs).map(([type, freq]) =>
        bigramEffort[Number(type)] * freq));
    return <div>
        <p>
            Human hands on a keyboard can move fingers independently and usually will move the next finger to its key
            while the current key is being hit. Obviously this doesn't work when both keys are to be typed by the same
            finger or when both keys are to far away from each other.
            The bigram effort scores give extra penalties to key mappings which make this happen for letter pairs that
            occur very often together. Here are the added frequencies of each type of bigram and theirs score.
            Like for single-key effort, the weighted sum is the total Typing Effort Score for bigrams.
        </p>
        <BigramDetailsLegendItem bigramType={BigramType.SameFinger} frequency={freqs[BigramType.SameFinger]}>
            "Same-finger Bigram": The worst thing to happen is having to use the same finger subsequently on different
            keys.
            We count this as highest effort.
        </BigramDetailsLegendItem>
        <BigramDetailsLegendItem bigramType={BigramType.AltFinger} frequency={freqs[BigramType.AltFinger]}>
            "Alt-Fingering": When the keyboard layout makes it easy to type some keys with another finger, the single
            finger bottleneck
            can be avoided. (Maybe you noticed yourself typing "er", "cd", or "un" with two different fingers, although
            strict touch-typing rules assign the same finger to both keys.)
        </BigramDetailsLegendItem>
        <BigramDetailsLegendItem bigramType={BigramType.OppositeRow} frequency={freqs[BigramType.OppositeRow]}>
            "Scissor movement": Two keys on opposite rows (upper and lower letter row) are awkward to type in sequence,
            because curling a finger moves the palm up and stretching a finger moves the palm down.
            This count is sometimes referred to as "scissor" movement in the literature.
        </BigramDetailsLegendItem>
        <BigramDetailsLegendItem bigramType={BigramType.NeighboringRow} frequency={freqs[BigramType.NeighboringRow]}>
            Two keys on neighboring rows are no extra effort.
        </BigramDetailsLegendItem>
        <BigramDetailsLegendItem bigramType={BigramType.SameRow} frequency={freqs[BigramType.SameRow]}>
            "Generalized Rolls": Two keys on the same row are so easy and fun to type, that many key maps try to
            maximize those.
        </BigramDetailsLegendItem>
        <BigramDetailsLegendItem bigramType={BigramType.InvolvesThumb} frequency={freqs[BigramType.InvolvesThumb]}>
            Bigrams where one letter is on a thumb key are not shown, because (most people's) thumbs move
            independently from the other fingers. (And we have at most one letter key per thumb. And the space key on
            the other thumb.)
        </BigramDetailsLegendItem>
        <BigramDetailsLegendItem bigramType={BigramType.OtherHand} frequency={freqs[BigramType.OtherHand]}>
            Bigrams typed with fingers of different hands aren't shown either. They make no trouble.
        </BigramDetailsLegendItem>
        <p><b>Total: {Math.round(total)}</b> – Lower is better.</p>
        <p class="footnote">
            Only the {4 * bigramRankSize} most frequent bigrams are shown in the keyboard visualization, but all
            available data is used in the calculation of the total score. (Infrequent bigrams have a an inconsequential
            contribution.)
        </p>
    </div>
}

interface BigramDetailsLegendItemProps {
    bigramType: BigramType;
    frequency: number;
    children?: ComponentChildren;
}

export function BigramDetailsLegendItem({bigramType, frequency, children}: BigramDetailsLegendItemProps) {
    return <div>
        <div class={"bigram-effort-legend-item " + bigramClassByType[bigramType]}>
            {Math.round(frequency ?? 0)}
        </div>
        [Score: {bigramEffort[bigramType]}] {children}
    </div>

}

interface AltGrLayerDetailsProps {
}

export function AltGrLayerDetails({}: AltGrLayerDetailsProps) {
    return <>
        <p>
            The US American keyboard mapping might be the only one that doesn't come with an AltGr layer.
            Even the UK English keyboards have it! This layer basically allows us to type a lot more characters.
            We can use it for characters that are on the traditional keyboards, but we rarely type them.
            And we can add some extra useful characters like ¢ or ‰ or the m-dash – I really use that one a lot.
        </p>
        <p>
            I think that all punctuation characters used in daily writing should be accessible via a direct key or
            Shift, while more rare characters can easily be moved to the AltGr layer. <br/>
            TODO: actually show an example mapping of the keys that some of the letter mappings omit.
        </p>
    </>
}