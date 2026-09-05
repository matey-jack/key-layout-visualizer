import './DetailsArea.css';
import '../layout/KeyboardSvg.css';
import type {ComponentChildren, VNode} from "preact";
import type {AppState, ResolvedKeyLevels} from "../app-model.ts";
import {
    bigramEffort,
    BigramType,
    type FlexMapping,
    isLayoutViz,
    KeymapTypeId,
    type LayoutModel,
    MappingChange,
    SKE_AWAY,
    SKE_HOME,
    SKE_INCONV_NEIGHBOR,
    SKE_LF_UP,
    SKE_NEIGHBOR,
    VisualizationType,
} from "../base-model.ts";
import {bigramFrequencyByType, bigramRankSize} from "../bigrams.ts";
import {TruncatedText} from "../components/TruncatedText.tsx";
import {singleCharacterFrequencies as englishFreqs} from "../frequencies/english-single-character-frequencies.ts";
import {bigramClassByType, getEffortClass} from "../layout/KeyboardSvg.tsx";
import {
    compatibilityScore,
    diffSummary,
    diffToBase,
    fillMapping,
    findMatchingKeymapType,
    getKeySizeClass,
    keyCapSize,
} from "../layout/layout-functions.ts";
import {
    TRADEOFF_INCONTROVERTIBLY_SAME_FINGER_COLOR,
    TRADEOFF_OFF_HOME_COLOR,
    TRADEOFF_SAME_FINGER_COLOR
} from "../layout/TradeoffDiagram.tsx";
import {sum} from "../library/math.ts";
import {ShiftPairing} from "../mapping/key-levels.ts";
import {qwertyMapping} from "../mapping/baseMappings.ts";
import {sumKeyFrequenciesByEffort, weighSingleKeyEffort} from "../mapping/mapping-functions.ts";

interface DetailsAreaProps {
    appState: AppState;
}

export function DetailsArea({appState}: DetailsAreaProps) {
    const layout = appState.layoutModel.value;
    const mapping = appState.mapping.value;
    const vizType = appState.vizType.value;
    return <div class="details-area">
        {isLayoutViz(vizType)
            ? <div className="layout-description">
                <TruncatedText text={layout.description}/>
            </div>
            : <MappingSummary mapping={mapping} layout={layout}/>
        }
        <hr/>
        <div class="visualization-details">
            {getVizDetails(vizType, layout, mapping, appState.resolvedKeyLevels.value)}
        </div>
    </div>;
}

export function getVizDetails(
    vizType: VisualizationType, layout: LayoutModel, mapping: FlexMapping, keyLevels: ResolvedKeyLevels
) {
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
        case VisualizationType.MappingShiftLevels:
            return <ShiftLevelsDetails keyLevels={keyLevels}/>;
        case VisualizationType.MappingTradeoff:
            return <TradeoffDetails/>;
    }
}

export function TradeoffDetails() {
    return <div>
        <p>
            This diagram shows the trade-off between how much you have to <i>learn</i> when switching to a key
            mapping (x-axis) and the typing-effort improvement you get in return.
            Each dot is one of the recommended (locally-maximum) mappings; the dashed line groups the two scores
            for the same mapping. Click a label or dot to select that mapping.
        </p>
        <div class="tradeoff-legend">
            <div class="tradeoff-legend-item">
                <span class="tradeoff-legend-swatch"
                      style={{backgroundColor: TRADEOFF_OFF_HOME_COLOR}}/>
                <span>Off-home-row score (English) — left axis. Lower is better.</span>
            </div>
            <div class="tradeoff-legend-item">
                <span class="tradeoff-legend-swatch"
                      style={{backgroundColor: TRADEOFF_SAME_FINGER_COLOR}}/>
                <span>Same-finger bigram score (English, includes alt-finger) — right axis. Lower is better.</span>
            </div>
            <div class="tradeoff-legend-item">
                <span class="tradeoff-legend-swatch"
                      style={{backgroundColor: TRADEOFF_INCONTROVERTIBLY_SAME_FINGER_COLOR}}/>
                <span>Incontrovertible same-finger bigram score (English, excludes alt-finger) — right axis. Lower is better.</span>
            </div>
        </div>
        <p class="footnote">
            The x-axis (Learning Score) is computed against Qwerty: lower means fewer keys move and the change is
            easier to learn.
        </p>
    </div>;
}

interface MappingSummaryProps {
    mapping: FlexMapping;
    layout: LayoutModel;
}

export function MappingSummary({mapping, layout}: MappingSummaryProps) {
    const keymapType = findMatchingKeymapType(layout, mapping)!.typeId;
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

export function FingeringDetails({layout: _}: { layout: LayoutModel }) {
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

function countKeysBySize(layoutM: LayoutModel) {
    const counts = new Map<number, number>();
    // we need to pick a mapping so that we can ignore `null` positions which are gaps, not keys.
    const firstFrameMapping = Object.values(layoutM.frameMappings)[0];
    firstFrameMapping!.forEach((row: unknown[], r: number) => {
        row.forEach((label: unknown, c: number) => {
            if (label !== null) {
                const size = keyCapSize(layoutM)(r, c);
                counts.set(size, (counts.get(size) ?? 0) + 1);
            }
        })
    })
    return counts;
}

export function KeySizeDetails({layout}: { layout: LayoutModel }) {
     const countsBySize = countKeysBySize(layout);
     const total = sum([...countsBySize.values()]);
     const sortedSizes = Array.from(countsBySize.keys()).sort((a, b) => a - b);
     return <div><p>
         Colors on the keys show which keycaps have the same size.<br/>
         It's easier to swap around keycaps to different places on the keyboard if many of them share the same size.
         It also makes production and logistics easier.
     </p>
         <div>
             {sortedSizes.map((s) =>
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
    layout: LayoutModel;
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
                        but then you'll have to retrain again whenever you use an ortho board.)</p>}
            </KeyEffortLegendItem>
            <KeyEffortLegendItem score={SKE_AWAY} frequency={freqsByEffort[SKE_AWAY]}>
                Keys that aren't neighbors of home position keys.
            </KeyEffortLegendItem>
        </tbody></table>
        <p><b>Total: {totalEffort}</b> – Lower is better!</p>
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
    layout: LayoutModel;
    mapping: FlexMapping;
}

export function BigramEffortDetails({layout, mapping}: BigramEffortDetailsProps) {
    const freqs = bigramFrequencyByType(layout, mapping);
    const total = sum(Object.entries(freqs).map(([type, freq]) =>
        bigramEffort[Number(type) as BigramType] * freq));
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
            "Alt-Fingering": When the keyboard layout makes it easy to type some keys with another finger,
            the single finger bottleneck can be avoided.
            Maybe you noticed yourself typing (on the qwerty keymap) "cd" or "ec" with two different fingers,
            although strict touch-typing rules assign the same finger to both keys.
        </BigramDetailsLegendItem>
        <BigramDetailsLegendItem bigramType={BigramType.PianoAltFinger} frequency={freqs[BigramType.PianoAltFinger]}>
            "Piano-Alt-Fingering": The index finger in strict touch-typing should handle two columns,
            but many people will type bigrams in these columns by moving their hand a bit inward and rolling middle and index fingers.
            The classic qwerty examples for this are "rt" and "un".
            Many people use this trick without even noticing,
            and therefore the qwerty layout is actually less bad in practice than many keying metrics suggest.
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

/*
    The character-key budget each pairing was designed for. A board with more keys than that maps
    the surplus twice: on its own peripheral key and on the central AltGr level. The standard
    international pairing needs one key more than the colloquial one, because the `/?` key is the
    only place it has for `/` and `?`.
 */
const COLLOQUIAL_KEYS = 40;
const INTERNATIONAL_KEYS = 43;
const STANDARD_INTERNATIONAL_KEYS = 44;

function Redundancy({characterKeys, budget}: { characterKeys: number, budget: number }) {
    const redundant = (characterKeys - budget) * 2;
    return redundant > 0
        ? <> The present keyboard layout model has {characterKeys} character keys available, and
            thus {redundant} characters are mapped redundantly on the central AltGr level and on
            their own (slightly) peripheral key.</>
        : <> The present keyboard layout model has exactly the {budget} character keys this needs,
            so no character is mapped twice.</>;
}

// The body the international pairings share, so that each of them only adds what is its own.
function InternationalPairing({characterKeys, budget}: { characterKeys: number, budget: number }) {
    return <>
        fine-tuning of the ANSI Shift pairings to have all punctuation for prose English writing on
        the base and Shift levels even on keyboards with as little as {budget} character
        keys, leaving space for 26 letter keys. The AltGr level collects the remaining "technical"
        punctuation.
        <Redundancy characterKeys={characterKeys} budget={budget}/>
    </>;
}

/*
    Which of the Shift pairings the board and key map take, in one paragraph each: what it is good
    for, never what it maps where – the keyboard above says that better than a sentence can. The
    rules that pick one are in mapping/key-levels.ts; here we only name the outcome.
 */
function ShiftPairingParagraph(
    {pairing, characterKeys}: { pairing: ShiftPairing, characterKeys: number }
): VNode {
    switch (pairing) {
        case ShiftPairing.Numberless:
            return <p>
                <b>Numberless special blend</b> – lacking a number row, this board not only loses the
                space for 10 punctuation characters, it also has to relocate the digits themselves.
                This Shift and Shaft level map does so by abandoning technical punctuation
                altogether and rearranging the Shift pairings, which keeps at least 12 of the
                colloquial punctuation characters on the base and Shift levels.
            </p>;
        case ShiftPairing.NumberlessInternational:
            return <p>
                <b>Numberless international blend</b> – same trade as the numberless English
                blend, but a 32-key flex map spends one of its punctuation spots on a letter, so the
                board is left with <code>,;</code>, <code>.:</code> and <code>-_</code>. That in
                turn lets the Shaft level carry <code>!</code>, <code>/</code> and <code>?</code> on
                the digits they belong to, at the price of the parentheses. A German key map{" "}
                moves <code>&amp;</code> and <code>/</code> to the digits a German keyboard has them
                on and fits <code>ß</code> in there too.
            </p>;
        case ShiftPairing.Colloquial:
            return <p>
                <b>Colloquial English</b> – fine-tuning of the ANSI Shift pairings to have all
                punctuation for prose English writing on the base and Shift levels even on keyboards
                with as little as {COLLOQUIAL_KEYS} character keys. The AltGr level collects the
                remaining "technical" punctuation.
                <Redundancy characterKeys={characterKeys} budget={COLLOQUIAL_KEYS}/>
            </p>;
        case ShiftPairing.International:
            return <p>
                <b>Standard International</b> – the ANSI Shift level on a board that has no{" "}
                <code>;:</code> key, so those two characters move onto <code>,</code> and{" "}
                <code>.</code>. Everything else sits where the ANSI keycaps say, which leaves{" "}
                <code>?</code> on the <code>/?</code> key – the one character key this pairing
                needs more than the colloquial one.
                <Redundancy characterKeys={characterKeys} budget={STANDARD_INTERNATIONAL_KEYS}/>
            </p>;
        case ShiftPairing.ColloquialInternational:
            return <p>
                <b>Colloquial International</b> –{" "}
                <InternationalPairing characterKeys={characterKeys} budget={INTERNATIONAL_KEYS}/>
                {" "}(Note that most international layouts put some or all of{" "}
                <code>[]&#123;&#125;\|</code> on the AltGr level already, but on much worse
                positions, which are overridden here.)
            </p>;
        case ShiftPairing.GermanInternational:
            return <p>
                <b>International, German variant</b> – this tweaks a few Shift pairings in the right
                half of the number row to fit the German letter <code>ß</code>. Those tweaks happen
                to settle the only pairings the standard and the colloquial map disagree about, so a
                German key map has one Shift level either way: the colloquial mode only moves the
                two keys that become <code>(&lt;</code> and <code>)&gt;</code>, and where the board
                has none to spare it is not offered at all. Otherwise it is the same{" "}
                <InternationalPairing characterKeys={characterKeys} budget={INTERNATIONAL_KEYS}/>
                {" "}(By the way, the standard German keymap also has <code>[]&#123;&#125;\|</code> on
                the AltGr level, but on much worse positions, which are overridden here.)
            </p>;
        case ShiftPairing.German:
            return <p>
                <b>Qwertz German</b> – Shift pairings from the German standard keyboard, applied to
                match the keyboard layout model and flex key map. This is the one pairing with no
                colloquial variant, so its button above is greyed out.
            </p>;
        case ShiftPairing.Ansi:
            return <p>
                <b>ANSI English</b> – Shift pairings from the well-known standard, applied to match
                the keyboard layout model and flex key map.
            </p>;
    }
}

// Why the standard button is greyed out – said here, where the pairings are explained, rather
// than on the switch itself.
function ForcedColloquial() {
    return <p>
        A standard pairing needs a <code>'</code>, a <code>-</code> and a <code>/</code> key: the
        first two carry characters that are nowhere else, and the third is the only home for{" "}
        <code>/</code> and <code>?</code> while the number row keeps <code>9(</code> and
        {" "}<code>0)</code>. This board is missing one of them, which is why only the colloquial
        pairing is on offer for it.
    </p>;
}

interface ShiftLevelsDetailsProps {
    keyLevels: ResolvedKeyLevels;
}

export function ShiftLevelsDetails({keyLevels}: ShiftLevelsDetailsProps) {
    const numberless = !keyLevels.hasNumberRow;
    return <>
        <ShiftPairingParagraph pairing={keyLevels.pairing} characterKeys={keyLevels.characterKeys}/>
        {!keyLevels.hasStandardLevel && <ForcedColloquial/>}
        {numberless
            ? <p>
                The third level is called Shaft here, after the <span class="altgr-level-legend">⇩</span>{" "}
                key that reaches it: a board this small deserves a modifier on each thumb, the way Shift
                sits under each pinky. What it gives up in return is the technical punctuation{" "}
                <code>`~[]&#123;&#125;&lt;&gt;|\</code>, which moves to layers we don't draw – imagine a
                board used for messages and notes rather than for programming.
            </p>
            : <p>
                The AltGr mappings shown are hand-crafted to bring technical characters in from keys that
                are far away from the hand's home positions. This not only improves ergonomy, but also
                allows those far-away keys to be dropped on smaller keyboards. Every board with a number
                row shares one AltGr mapping, whatever its flex key map, making it a learn once, use
                everywhere.
            </p>
        }
        {numberless
            ? <p>
                Navigation is in-line and takes both hands, one home key each: the four cursor keys in
                reading order on one of them, the four that move by more than a character – Home,
                PageUp, PageDown, End – on the other. Use the "Nav keys" buttons to swap which hand
                gets the cursor keys.
            </p>
            : <p>
                The other hand gets "hands down" navigation: the four cursor keys in their familiar
                inverted-T shape, but on the home row, with Home/End beside them and PageUp/PageDown
                below. Use the "Nav keys" buttons to swap which hand gets it. The mnemonic character
                placement needs an AltGr key for the opposite thumb – on an ISO board the extra key next
                to the left Shift can serve as one.
            </p>
        }
    </>
}