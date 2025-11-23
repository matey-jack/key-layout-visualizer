import {LayoutType, RowBasedLayoutModel} from "./base-model.ts";
import {
    EB65_LowShift_Variant,
    EB65_MidShift_Variant,
    HarmonicVariant,
    LayoutOptions,
    PlankVariant
} from "./app-model.ts";
import {getAnsiVariant} from "./layout/ansiLayoutModel.ts";
import {splitOrthoLayoutModel} from "./layout/orthoLayoutModel.ts";
import {harmonic13WideLayoutModel} from "./layout/harmonic13WideLayoutModel.ts";
import {harmonic14TraditionalLayoutModel} from "./layout/harmonic14TraditionalLayoutModel.ts";
import {harmonic13MidShiftLayoutModel} from "./layout/harmonic13MidshiftLayoutModel.ts";
import {harmonic12LayoutModel} from "./layout/harmonic12LayoutModel.ts";
import {harmonic14WideLayoutModel} from "./layout/harmonic14WideLayoutModel.ts";
import {katanaLayoutModel} from "./layout/katanaLayoutModel.ts";
import {
    ep60addAngleMod,
    ep60WithArrowsLayoutModel,
    ergoPlank60AnsiAngleLayoutModel
} from "./layout/ergoPlank60LayoutModel.ts";
import {eb65LowShiftWideLayoutModel} from "./layout/eb65LowshiftWideLayoutModel.ts";
import {eb65BigEnterLayoutModel, eb65LowShiftLayoutModel} from "./layout/eb65LowShiftLayoutModel.ts";
import {
    eb65CentralEnterLayoutModel,
    eb65MidshiftNiceLayoutModel,
    eb65MidshiftRightRetLayoutModel,
    eb65VerticalEnterLayoutModel
} from "./layout/eb65MidshiftNiceLayoutModel.ts";
import {eb65MidshiftExtraWideLayoutModel} from "./layout/eb65MidshiftExtraWideLayoutModel.ts";

export function getHarmonicVariant(variant: HarmonicVariant): RowBasedLayoutModel {
    switch (variant) {
        case HarmonicVariant.H14_Wide:
            return harmonic14WideLayoutModel;
        case HarmonicVariant.H14_Traditional:
            return harmonic14TraditionalLayoutModel;
        case HarmonicVariant.H13_Wide:
            return harmonic13WideLayoutModel;
        case HarmonicVariant.H13_MidShift:
            return harmonic13MidShiftLayoutModel;
        case HarmonicVariant.H12:
        default:
            return harmonic12LayoutModel;
    }
}

export function getPlankVariant(opts: Partial<LayoutOptions>): RowBasedLayoutModel {
    const {plankVariant, ep60Arrows, ep60ansiAngle, eb65LowshiftVariant, eb65MidshiftVariant} = opts;
    switch (plankVariant) {
        case PlankVariant.KATANA_60:
            return katanaLayoutModel;
        case PlankVariant.EP60:
        default:
            let ep60LM = ep60Arrows ? ep60WithArrowsLayoutModel : ergoPlank60AnsiAngleLayoutModel;
            return ep60ansiAngle ? ep60LM : ep60addAngleMod(ep60LM);
        case PlankVariant.EB65_LOW_SHIFT:
            // UI calls this method without variant parameters, so we need a default.
            switch (eb65LowshiftVariant) {
                default:
                    return eb65LowShiftWideLayoutModel;
                case EB65_LowShift_Variant.LESS_GAPS:
                    return eb65LowShiftLayoutModel;
                case EB65_LowShift_Variant.BIG_ENTER:
                    return eb65BigEnterLayoutModel;
            }
        case PlankVariant.EB65_MID_SHIFT:
            switch (eb65MidshiftVariant) {
                default:
                    return eb65MidshiftNiceLayoutModel; // "wide hands"
                case EB65_MidShift_Variant.EXTRA_WIDE:
                    return eb65MidshiftExtraWideLayoutModel;
                // below are the "narrow hands" subvariants
                case EB65_MidShift_Variant.CENTRAL_ENTER:
                    return eb65CentralEnterLayoutModel;
                case EB65_MidShift_Variant.RIGHT_ENTER:
                    return eb65MidshiftRightRetLayoutModel;
                case EB65_MidShift_Variant.VERTICAL_ENTER:
                    return eb65VerticalEnterLayoutModel;
            }
    }
}

export function getLayoutModel(layoutOptions: LayoutOptions): RowBasedLayoutModel {
    switch (layoutOptions.type) {
        case LayoutType.ANSI:
            return getAnsiVariant(layoutOptions);
        case LayoutType.Ergosplit:
            return splitOrthoLayoutModel;
        case LayoutType.Harmonic:
            return getHarmonicVariant(layoutOptions.harmonicVariant);
        case LayoutType.Ergoplank:
        default:
            return getPlankVariant(layoutOptions);
    }
}
