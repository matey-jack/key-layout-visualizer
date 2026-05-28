import {
    AnsiVariant,
    ErgoboardLowshiftVariant,
    ErgoboardMidshiftVariant,
    HarmonicVariant,
    type LayoutOptions,
    PlankVariant,
} from "./app-model.ts";
import {type LayoutModel, LayoutType} from "./base-model.ts";
import {ahkbAddAngleMod, ahkbLayoutModel} from "./layout/ahkbLayoutModel.ts";
import {
    ansiIBMLayoutModel,
    ansiWideLayoutModel,
    createAnsiMidShift,
    createApple,
    createHHKB,
    splitSpaceBar,
} from "./layout/ansiLayoutModel.ts";
import {ergoboardBigEnterLayoutModel, ergoboardLowshiftLayoutModel} from "./layout/ergoboardLowshiftLayoutModel.ts";
import {
    ergoboardLowshiftWideAngleModLayoutModel,
    ergoboardLowshiftWideLayoutModel,
} from "./layout/ergoboardLowshiftWideLayoutModel.ts";
import {ergoboardMidshiftExtraWideLayoutModel} from "./layout/ergoboardMidshiftExtraWideLayoutModel.ts";
import {
    ergoboardCentralEnterLayoutModel,
    ergoboardMidshiftRightRetLayoutModel,
    ergoboardVerticalEnterLayoutModel,
} from "./layout/ergoboardMidshiftNarrowLayoutModels.ts";
import {ergoboardMidshiftComfyLayoutModel} from "./layout/ergoboardMidshiftComfyLayoutModel.ts";
import {ergoboardMidshiftSemiWideLayoutModel} from './layout/ergoboardMidshiftSemiWideLayoutModel.ts';
import {
    createErgoPlankMidShift,
    createErgoPlankWithArrows,
    ergoPlankLayoutModel
} from "./layout/ergoPlankLayoutModel.ts";
import {majorErgoslatLayoutModel, makeErgoslatNumberless, minorErgoslatLayoutModel } from './layout/ergoslatLayoutModel.ts';
import {harmonic12LayoutModel} from "./layout/harmonic12LayoutModel.ts";
import {harmonic13MidshiftLayoutModel} from "./layout/harmonic13MidshiftLayoutModel.ts";
import {harmonic13WideLayoutModel} from "./layout/harmonic13WideLayoutModel.ts";
import {harmonic14TraditionalLayoutModel} from "./layout/harmonic14TraditionalLayoutModel.ts";
import {harmonic14WideLayoutModel} from "./layout/harmonic14WideLayoutModel.ts";
import {katanaLayoutModel} from "./layout/katanaLayoutModel.ts";
import {splitOrthoLayoutModel} from "./layout/splitOrthoLayoutModel.ts";
import {xhkbLayoutModel, xhkbWithArrowsLayoutModel} from "./layout/xhkbLayoutModel.ts";

const layoutModels: Array<LayoutModel> = [
    ansiIBMLayoutModel,
    ansiWideLayoutModel,
    createHHKB(ansiIBMLayoutModel),
    createApple(ansiIBMLayoutModel),
    createHHKB(ansiWideLayoutModel),
    createApple(ansiWideLayoutModel),
    xhkbLayoutModel,
    xhkbWithArrowsLayoutModel,
    ahkbLayoutModel,
    majorErgoslatLayoutModel(false),
    majorErgoslatLayoutModel(true),
    minorErgoslatLayoutModel(false),
    minorErgoslatLayoutModel(true),
    makeErgoslatNumberless(majorErgoslatLayoutModel(false)),
    makeErgoslatNumberless(minorErgoslatLayoutModel(false)),
    ergoboardLowshiftLayoutModel,
    ergoboardBigEnterLayoutModel,
    ergoboardLowshiftWideLayoutModel,

];

export function getHarmonicVariant(variant: HarmonicVariant): LayoutModel {
    switch (variant) {
        case HarmonicVariant.H14_Wide:
            return harmonic14WideLayoutModel;
        case HarmonicVariant.H14_Traditional:
            return harmonic14TraditionalLayoutModel;
        case HarmonicVariant.H13_Wide:
            return harmonic13WideLayoutModel;
        case HarmonicVariant.H13_MidShift:
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
        case PlankVariant.ERGOBOARD_MID_SHIFT:
            switch (opts.ergoboardMidshiftVariant) {
                case ErgoboardMidshiftVariant.EXTRA_WIDE:
                    return ergoboardMidshiftExtraWideLayoutModel;
                case ErgoboardMidshiftVariant.SEMI_WIDE:
                    return ergoboardMidshiftSemiWideLayoutModel;
                // next three are the "narrow hands" subvariants
                case ErgoboardMidshiftVariant.CENTRAL_ENTER:
                    return ergoboardCentralEnterLayoutModel;
                case ErgoboardMidshiftVariant.RIGHT_ENTER:
                    return ergoboardMidshiftRightRetLayoutModel;
                case ErgoboardMidshiftVariant.VERTICAL_ENTER:
                    return ergoboardVerticalEnterLayoutModel;
                default: // default needed so Biome doesn't get scared by potential fall-through
                    return ergoboardMidshiftComfyLayoutModel; // "comfy hands"
            }
        default: {
            const base = opts.midShift ? createErgoPlankMidShift(ergoPlankLayoutModel) : ergoPlankLayoutModel;
            return opts.bottomArrows ? createErgoPlankWithArrows(base) : base;
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
        // no need to split the space bar, because it's already split
        case AnsiVariant.XHKB:
            return layoutOptions.bottomArrows ? xhkbWithArrowsLayoutModel : xhkbLayoutModel;
        case AnsiVariant.AHKB:
            return layoutOptions.angleMod ? ahkbAddAngleMod(ahkbLayoutModel) : ahkbLayoutModel;
    }
    return layoutOptions.ansiSplit ? splitSpaceBar(base) : base;
}

export function getLayoutModel(layoutOptions: LayoutOptions): LayoutModel {
    switch (layoutOptions.type) {
        case LayoutType.ANSI:
            return getAnsiVariant(layoutOptions);
        case LayoutType.Ergosplit:
            return splitOrthoLayoutModel(layoutOptions.midShift);
        case LayoutType.Harmonic:
            return getHarmonicVariant(layoutOptions.harmonicVariant);
        default:
            return getPlankVariant(layoutOptions);
    }
}
