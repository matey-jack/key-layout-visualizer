import {ErgoboardVariant, ErgoplankArrows, type LayoutOptions, PlankVariant} from "../app-model.ts";
import {LayoutVariantButton} from "../components/LayoutVariantButton.tsx";
import {OptionButton} from "../components/OptionButton.tsx";
import {OptionGroup} from "../components/OptionGroup.tsx";
import {FlipRetRubButton} from "./components/FlipRetRubButton.tsx";
import {MidShiftCheckbox} from "./components/MidShiftCheckbox.tsx";

export interface PlankLayoutOptionsProps {
    options: LayoutOptions;
    setOption: (opts: Partial<LayoutOptions>) => void;
}

export function ErgoplankLayoutOptions({options, setOption}: PlankLayoutOptionsProps) {
    const variant = options.plankVariant;
    const setVariant = (plankVariant: PlankVariant) => setOption({plankVariant});

    return <div class="layout-variant-grid layout-variant-grid--plank">
        <LayoutVariantButton variant={PlankVariant.KATANA_60}
                             currentVariant={variant}
                             setVariant={setVariant}
                             name="Katana60"/>

        <LayoutVariantButton variant={PlankVariant.ERGOSLAT}
                             currentVariant={variant}
                             setVariant={setVariant}
                             name="Ergoslat 13/3">
            <div class="layout-option-row">
                <div class="layout-option-column">
                    <div class="layout-option-button-group">
                        <OptionButton selected={!options.esNumberless && !options.esSmallerThumbs}
                                      onClick={() => setOption({esNumberless: false, esSmallerThumbs: false})}>
                            57 keys
                        </OptionButton>
                        <OptionButton selected={!options.esNumberless && options.esSmallerThumbs}
                                      onClick={() => setOption({esNumberless: false, esSmallerThumbs: true})}>
                            59 keys
                        </OptionButton>
                        <OptionButton selected={options.esNumberless}
                                      onClick={() => setOption({esNumberless: true, esSmallerThumbs: true})}>
                            47 keys
                        </OptionButton>
                    </div>
                    <MidShiftCheckbox options={options} setOption={setOption}/>
                </div>
            </div>
        </LayoutVariantButton>

        <LayoutVariantButton variant={PlankVariant.ERGOPLANK}
                             currentVariant={variant}
                             setVariant={setVariant}
                             name="❤️ Ergoplank 15/5"
        >
            <div class="layout-option-row">
                <div class="layout-option-column">
                    <OptionGroup label="Lower Row">
                        <OptionButton selected={!options.midShift} onClick={() => setOption({midShift: false})}>
                            Shift
                        </OptionButton>
                        <OptionButton selected={options.midShift && !options.epRightReturn} onClick={() => setOption({midShift: true, epRightReturn: false})}>
                            Characters
                        </OptionButton>
                        <OptionButton selected={options.midShift && options.epRightReturn} onClick={() => setOption({midShift: true, epRightReturn: true})}>
                            Enter
                        </OptionButton>
                    </OptionGroup>
                    <OptionGroup label="Arrows">
                        <OptionButton selected={options.epArrows === ErgoplankArrows.None} onClick={() => setOption({epArrows: ErgoplankArrows.None})}>
                            None
                        </OptionButton>
                        <OptionButton selected={options.epArrows === ErgoplankArrows.Inline} onClick={() => setOption({epArrows: ErgoplankArrows.Inline})}>
                            Inline
                        </OptionButton>
                        <OptionButton selected={options.epArrows === ErgoplankArrows.Center} onClick={() => setOption({epArrows: ErgoplankArrows.Center})}>
                            Center
                        </OptionButton>
                    </OptionGroup>
                </div>
            </div>
        </LayoutVariantButton>

        <LayoutVariantButton variant={PlankVariant.ERGOBOARD_LEGACY}
                             currentVariant={variant}
                             setVariant={setVariant}
                             name="Ergoboard 16/x Legacy&nbsp;Ed">
            <div class="layout-option-row">
                <ErgoboardLayoutOptions ergoboardVariant={options.ergoboardVariant}
                                        setErgoboardVariant={(v) => setOption({ergoboardVariant: v})}/>
                <div class="layout-option-column">
                    <FlipRetRubButton setOption={setOption} options={options}/>
                </div>
            </div>
        </LayoutVariantButton>

        <LayoutVariantButton variant={PlankVariant.ERGOBOARD_CENTRAL}
                             currentVariant={variant} setVariant={setVariant}
                             name="❤️ Ergoboard 16/5 Central"
        >
        </LayoutVariantButton>
    </div>
}

type ErgoboardLayoutOptionsProps = {
    ergoboardVariant: ErgoboardVariant;
    setErgoboardVariant: (v: ErgoboardVariant) => void;
}

export function ErgoboardLayoutOptions({ergoboardVariant, setErgoboardVariant}: ErgoboardLayoutOptionsProps) {
    const narrowSubvariant = ergoboardVariant > ErgoboardVariant.SEMI_WIDE;

    // The Enter-key sub-group stacks below the hand-distance buttons in the same column.
    return <div class="layout-option-column">
        <OptionGroup label="Hand distance">
            <OptionButton selected={ergoboardVariant === ErgoboardVariant.EXTRA_WIDE} onClick={() => setErgoboardVariant(ErgoboardVariant.EXTRA_WIDE)}>
                16/5.5
            </OptionButton>
            <OptionButton selected={ergoboardVariant === ErgoboardVariant.COMFY_WIDE} onClick={() => setErgoboardVariant(ErgoboardVariant.COMFY_WIDE)}>
                16/5 ❤️
            </OptionButton>
            <OptionButton selected={ergoboardVariant === ErgoboardVariant.SEMI_WIDE} onClick={() => setErgoboardVariant(ErgoboardVariant.SEMI_WIDE)}>
                16/4.5
            </OptionButton>
            <OptionButton selected={narrowSubvariant} onClick={() => setErgoboardVariant(ErgoboardVariant.RIGHT_ENTER)}>
                16/4
            </OptionButton>
        </OptionGroup>

        {narrowSubvariant &&
            <OptionGroup label="Enter key">
                <OptionButton selected={ergoboardVariant === ErgoboardVariant.RIGHT_ENTER} onClick={() => setErgoboardVariant(ErgoboardVariant.RIGHT_ENTER)}>
                    Right
                </OptionButton>
                <OptionButton selected={ergoboardVariant === ErgoboardVariant.CENTRAL_ENTER} onClick={() => setErgoboardVariant(ErgoboardVariant.CENTRAL_ENTER)}>
                    Central
                </OptionButton>
                <OptionButton selected={ergoboardVariant === ErgoboardVariant.VERTICAL_ENTER} onClick={() => setErgoboardVariant(ErgoboardVariant.VERTICAL_ENTER)}>
                    Vertical
                </OptionButton>
            </OptionGroup>
        }
    </div>
}




