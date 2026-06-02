import {
    AnsiVariant,
    ErgoboardLowshiftVariant,
    ErgoboardVariant,
    ErgoplankArrows,
    HarmonicVariant,
    type LayoutOptions,
    PlankVariant,
} from "./app-model.ts";
import {type LayoutModel, LayoutType} from "./base-model.ts";
import {
    ansiIBMLayoutModel,
    ansiWideLayoutModel,
    createAN65,
    createAnsiMidShift,
    createApple,
    createHHKB,
    splitSpaceBar,
} from "./layout/ansiLayoutModel.ts";
import { ergoboardCentralLayoutModel } from "./layout/ergoboardCentralLayoutModel.ts";
import {ergoboardComfyLayoutModel} from "./layout/ergoboardComfyLayoutModel.ts";
import {ergoboardExtraWideLayoutModel} from "./layout/ergoboardExtraWideLayoutModel.ts";
import {ergoboardBigEnterLayoutModel, ergoboardLowshiftLayoutModel} from "./layout/ergoboardLowshiftLayoutModel.ts";
import {
    ergoboardLowshiftWideAngleModLayoutModel,
    ergoboardLowshiftWideLayoutModel,
} from "./layout/ergoboardLowshiftWideLayoutModel.ts";
import {
    ergoboardCentralEnterLayoutModel,
    ergoboardRightRetLayoutModel,
    ergoboardVerticalEnterLayoutModel,
} from "./layout/ergoboardNarrowLayoutModels.ts";
import {ergoboardSemiWideLayoutModel} from './layout/ergoboardSemiWideLayoutModel.ts';
import {
    createErgoPlankCenterArrows,
    createErgoPlankInlineArrows,
    createErgoPlankMidShiftLowerCharacters, createErgoPlankMidShiftRightReturn,
    ergoplankLayoutModel
} from "./layout/ergoplankLayoutModel.ts";
import {majorErgoslatLayoutModel, makeErgoslatNumberless, minorErgoslatLayoutModel } from './layout/ergoslatLayoutModel.ts';
import {harmonic12LayoutModel} from "./layout/harmonic12LayoutModel.ts";
import {harmonic13MidshiftLayoutModel} from "./layout/harmonic13MidshiftLayoutModel.ts";
import {harmonic13WideLayoutModel} from "./layout/harmonic13WideLayoutModel.ts";
import {harmonic14TraditionalLayoutModel} from "./layout/harmonic14TraditionalLayoutModel.ts";
import {harmonic14WideLayoutModel} from "./layout/harmonic14WideLayoutModel.ts";
import {katanaLayoutModel} from "./layout/katanaLayoutModel.ts";
import {splitOrthoLayoutModel} from "./layout/splitOrthoLayoutModel.ts";
import {xhkb15LayoutModel, xhkb16LayoutModel} from "./layout/xhkbLayoutModel.ts";

export function getHarmonicVariant(variant: HarmonicVariant): LayoutModel {
    switch (variant) {
        case HarmonicVariant.H14_Wide:
            return harmonic14WideLayoutModel;
        case HarmonicVariant.H14_Traditional:
            return harmonic14TraditionalLayoutModel;
        case HarmonicVariant.H13_Wide:
            return harmonic13WideLayoutModel;
        case HarmonicVariant.H13_Mid_shift:
            return harmonic13MidshiftLayoutModel;
        default:
            return harmonic12LayoutModel;
    }
}

export function getPlankVariant(opts: LayoutOptions): LayoutModel {
    switch (opts.plankVariant) {
        case PlankVariant.KATANA_60:
            return katanaLayoutModel;
        case PlankVariant.ERGOSLAT: {
            const baseModel = opts.esSmallerThumbs
                ? minorErgoslatLayoutModel(opts.midShift)
                : majorErgoslatLayoutModel(opts.midShift);
            return opts.esNumberless ? makeErgoslatNumberless(baseModel) : baseModel;
        }
        case PlankVariant.ERGOBOARD_LOW_SHIFT:
            // UI calls this method without variant parameters, so we need a default.
            switch (opts.ergoboardLowshiftVariant) {
                case ErgoboardLowshiftVariant.LESS_GAPS:
                    return ergoboardLowshiftLayoutModel;
                case ErgoboardLowshiftVariant.BIG_ENTER:
                    return ergoboardBigEnterLayoutModel;
                default:
                    return opts.angleMod ? ergoboardLowshiftWideAngleModLayoutModel : ergoboardLowshiftWideLayoutModel;
            }
        case PlankVariant.ERGOBOARD_LEGACY:
            switch (opts.ergoboardVariant) {
                case ErgoboardVariant.EXTRA_WIDE:
                    return ergoboardExtraWideLayoutModel;
                case ErgoboardVariant.SEMI_WIDE:
                    return ergoboardSemiWideLayoutModel;
                // next three are the "narrow hands" subvariants
                case ErgoboardVariant.CENTRAL_ENTER:
                    return ergoboardCentralEnterLayoutModel;
                case ErgoboardVariant.RIGHT_ENTER:
                    return ergoboardRightRetLayoutModel;
                case ErgoboardVariant.VERTICAL_ENTER:
                    return ergoboardVerticalEnterLayoutModel;
                default: // default needed so Biome doesn't get scared by potential fall-through
                    return ergoboardComfyLayoutModel; // "comfy hands"
            }
        case PlankVariant.ERGOBOARD_CENTRAL:
            return ergoboardCentralLayoutModel;
        default: {
            const base = !opts.midShift ? ergoplankLayoutModel
                : (opts.epRightReturn ? createErgoPlankMidShiftRightReturn(ergoplankLayoutModel)
                : createErgoPlankMidShiftLowerCharacters(ergoplankLayoutModel));
            if (opts.epArrows === ErgoplankArrows.Inline) {
                return createErgoPlankInlineArrows(base);
            } else if (opts.epArrows === ErgoplankArrows.Center) {
                return createErgoPlankCenterArrows(base);
            }
            return base;
        }
    }
}

export function getAnsiVariant(layoutOptions: LayoutOptions) {
    let base: LayoutModel = layoutOptions.ansiWide ? ansiWideLayoutModel : ansiIBMLayoutModel;
    switch (layoutOptions.ansiVariant) {
        case AnsiVariant.IBM:
            if (layoutOptions.midShift) {
                base = createAnsiMidShift(base);
            }
            break;
        case AnsiVariant.APPLE:
            base = createApple(base);
            if (layoutOptions.midShift) {
                base = createAnsiMidShift(base);
            }
            break;
        case AnsiVariant.HHKB:
            base = createHHKB(base);
            break;
        case AnsiVariant.AN65:
            base = createAN65(base);
            break;
        // no need to split the space bar, because it's already split
        case AnsiVariant.XHKB:
            return layoutOptions.thumbsUp16 ? xhkb16LayoutModel : xhkb15LayoutModel;
    }
    return layoutOptions.ansiSplit ? splitSpaceBar(base) : base;
}

export function getLayoutModel(layoutOptions: LayoutOptions): LayoutModel {
    switch (layoutOptions.type) {
        case LayoutType.ANSI:
            return getAnsiVariant(layoutOptions);
        case LayoutType.Ergosplit:
            return splitOrthoLayoutModel(layoutOptions.soThumbShift);
        case LayoutType.Harmonic:
            return getHarmonicVariant(layoutOptions.harmonicVariant);
        default:
            return getPlankVariant(layoutOptions);
    }
}
