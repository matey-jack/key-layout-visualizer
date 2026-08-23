import type {Signal} from "@preact/signals";
import {AnsiVariant, type LayoutOptions, ThumbsUpVariant} from "../app-model.ts";
import type {FlexMapping} from "../base-model.ts";
import {CheckboxWithLabel} from "../components/CheckboxWithLabel.tsx";
import {LayoutVariantButton} from "../components/LayoutVariantButton.tsx";
import {OptionButton} from "../components/OptionButton.tsx";
import {MidShiftCheckbox} from "./components/MidShiftCheckbox.tsx";
import {onlySupportsWide} from "./layout-functions.ts";

export interface AnsiLayoutOptionsProps {
    options: LayoutOptions;
    setOption: (opts: Partial<LayoutOptions>) => void;
    mapping: Signal<FlexMapping>;
}

const naturallyWideVariants = [AnsiVariant.XHKB];

export function AnsiLayoutOptions({options, setOption, mapping}: AnsiLayoutOptionsProps) {
    const {ansiWide, ansiVariant, ansiSplit, thumbsUpVariant} = options;
    const wideDisabled = onlySupportsWide(mapping.value) ||
        (naturallyWideVariants.includes(ansiVariant) && thumbsUpVariant !== ThumbsUpVariant.TU13);
    // The 16/5 has its arrow keys where the split would go.
    const splitDisabled = (ansiVariant === AnsiVariant.HHKB) ||
        ((ansiVariant === AnsiVariant.XHKB) && thumbsUpVariant === ThumbsUpVariant.TU16);
    const setVariant = (variant: AnsiVariant) => setOption({ansiVariant: variant});

    const handDist = ansiWide ? "3" : "2";

    return <div class="ansi-options">
            <div class="layout-variant-grid layout-variant-grid--ansi">
                <LayoutVariantButton variant={AnsiVariant.IBM}
                                     currentVariant={ansiVariant}
                                     setVariant={setVariant}
                                     name="IBM"
                                     note={`15/${handDist}`}>
                    <div class="layout-option-row">
                        <div class="layout-option-column">
                            <MidShiftCheckbox options={options} setOption={setOption}/>
                        </div>
                    </div>
                </LayoutVariantButton>

                <LayoutVariantButton variant={AnsiVariant.APPLE}
                                     currentVariant={ansiVariant}
                                     setVariant={setVariant}
                                     name="Apple"
                                     note={`14.5/${handDist}`}>
                    <div class="layout-option-row">
                        <div class="layout-option-column">
                            <MidShiftCheckbox options={options} setOption={setOption}/>
                        </div>
                    </div>
                </LayoutVariantButton>

                <LayoutVariantButton variant={AnsiVariant.HHKB}
                                     currentVariant={ansiVariant}
                                     setVariant={setVariant}
                                     name="HHKB"
                                     note={`15/${handDist}`} />

                <LayoutVariantButton variant={AnsiVariant.AN65}
                                     currentVariant={ansiVariant}
                                     setVariant={setVariant}
                                     name="AN65"
                                     note={`16/${handDist}`} />

                <LayoutVariantButton variant={AnsiVariant.XHKB}
                                     currentVariant={ansiVariant}
                                     setVariant={setVariant}
                                     name={"Thumbs Up\u00A0❤️"}
                                     note="13/2 to 16/5"
                                     shareSpace>
                    <div class="layout-option-row">
                        <div class="layout-option-column">
                            <div class="layout-option-button-group">
                                <OptionButton selected={thumbsUpVariant === ThumbsUpVariant.TU13}
                                              onClick={() => setOption({thumbsUpVariant: ThumbsUpVariant.TU13})}>
                                    13/2
                                </OptionButton>
                                <OptionButton selected={thumbsUpVariant === ThumbsUpVariant.TU15}
                                              onClick={() => setOption({thumbsUpVariant: ThumbsUpVariant.TU15})}>
                                    15/4
                                </OptionButton>
                                <OptionButton selected={thumbsUpVariant === ThumbsUpVariant.TU16}
                                              onClick={() => setOption({thumbsUpVariant: ThumbsUpVariant.TU16})}>
                                    16/5
                                </OptionButton>
                            </div>
                        </div>
                    </div>
                </LayoutVariantButton>
            </div>
            <div class="layout-option-checkboxes">
                <CheckboxWithLabel label="split keyboard"
                                   checked={ansiSplit}
                                   onChange={(split) => setOption({ansiSplit: split})}
                                   disabled={splitDisabled}/>
                <CheckboxWithLabel label="use wide key mapping"
                                   checked={ansiWide}
                                   onChange={(wide) => setOption({ansiWide: wide})}
                                   disabled={wideDisabled}/>
            </div>
    </div>
}

