import {
    AnsiVariant,
    EB65_LowShift_Variant,
    EB65_MidShift_Variant,
    HarmonicVariant,
    type LayoutOptions,
    PlankVariant,
} from "./app-model.ts";
import {type LayoutModel, LayoutType } from "./base-model.ts";
import {ahkbAddAngleMod, ahkbLayoutModel} from "./layout/ahkbLayoutModel.ts";
import {
    ansiIBMLayoutModel,
    ansiWideLayoutModel,
    createApple,
    createHHKB,
    splitSpaceBar,
} from "./layout/ansiLayoutModel.ts";
import {eb65BigEnterLayoutModel, eb65LowshiftLayoutModel} from "./layout/eb65LowshiftLayoutModel.ts";
import {
    eb65LowshiftWideAngleModLayoutModel,
    eb65LowshiftWideLayoutModel,
} from "./layout/eb65LowshiftWideLayoutModel.ts";
import {eb65MidshiftExtraWideLayoutModel} from "./layout/eb65MidshiftExtraWideLayoutModel.ts";
import {
    eb65CentralEnterLayoutModel,
    eb65MidshiftRightRetLayoutModel,
    eb65VerticalEnterLayoutModel,
} from "./layout/eb65MidshiftNarrowLayoutModels.ts";
import {eb65MidshiftNiceLayoutModel} from "./layout/eb65MidshiftNiceLayoutModel.ts";
import {ergoKbLayoutModel, ergoKbWithArrowsLayoutModel} from "./layout/ergoKbLayoutModel.ts";
import {ep60addAngleMod, ep60WithArrowsLayoutModel, ergoPlank60LayoutModel} from "./layout/ergoPlank60LayoutModel.ts";
import {harmonic12LayoutModel} from "./layout/harmonic12LayoutModel.ts";
import {harmonic13MidshiftLayoutModel} from "./layout/harmonic13MidshiftLayoutModel.ts";
import {harmonic13WideLayoutModel} from "./layout/harmonic13WideLayoutModel.ts";
import {harmonic14TraditionalLayoutModel} from "./layout/harmonic14TraditionalLayoutModel.ts";
import {harmonic14WideLayoutModel} from "./layout/harmonic14WideLayoutModel.ts";
import {katanaLayoutModel} from "./layout/katanaLayoutModel.ts";
import {splitOrthoLayoutModel} from "./layout/splitOrthoLayoutModel.ts";

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

export function getPlankVariant(opts: Partial<LayoutOptions>): LayoutModel {
    const {plankVariant, bottomArrows, angleMod, eb65LowshiftVariant, eb65MidshiftVariant} = opts;
    switch (plankVariant) {
        case PlankVariant.KATANA_60:
            return katanaLayoutModel;
        case PlankVariant.EB65_LOW_SHIFT:
            // UI calls this method without variant parameters, so we need a default.
            switch (eb65LowshiftVariant) {
                case EB65_LowShift_Variant.LESS_GAPS:
                    return eb65LowshiftLayoutModel;
                case EB65_LowShift_Variant.BIG_ENTER:
                    return eb65BigEnterLayoutModel;
                default:
                    return angleMod ? eb65LowshiftWideAngleModLayoutModel : eb65LowshiftWideLayoutModel;
            }
        case PlankVariant.EB65_MID_SHIFT:
            switch (eb65MidshiftVariant) {
                case EB65_MidShift_Variant.EXTRA_WIDE:
                    return eb65MidshiftExtraWideLayoutModel;
                // next three are the "narrow hands" subvariants
                case EB65_MidShift_Variant.CENTRAL_ENTER:
                    return eb65CentralEnterLayoutModel;
                case EB65_MidShift_Variant.RIGHT_ENTER:
                    return eb65MidshiftRightRetLayoutModel;
                case EB65_MidShift_Variant.VERTICAL_ENTER:
                    return eb65VerticalEnterLayoutModel;
                default: // default needed so Biome doesn't get scared by potential fall-through
                    return eb65MidshiftNiceLayoutModel; // "wide hands"
            }
        default: {
            const ep60LM = bottomArrows ? ep60WithArrowsLayoutModel : ergoPlank60LayoutModel;
            return angleMod ? ep60addAngleMod(ep60LM) : ep60LM;
        }
    }
}

export function getAnsiVariant(layoutOptions: LayoutOptions) {
    let base: LayoutModel = layoutOptions.ansiWide ? ansiWideLayoutModel : ansiIBMLayoutModel;
    switch (layoutOptions.ansiVariant) {
        case AnsiVariant.IBM:
            break;
        case AnsiVariant.APPLE:
            base = createApple(base);
            break;
        case AnsiVariant.HHKB:
            base = createHHKB(base);
            break;
        // no need to split the space bar, because it's already split
        case AnsiVariant.ERGO_KB:
            return layoutOptions.bottomArrows ? ergoKbWithArrowsLayoutModel : ergoKbLayoutModel;
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
            return splitOrthoLayoutModel;
        case LayoutType.Harmonic:
            return getHarmonicVariant(layoutOptions.harmonicVariant);
        default:
            return getPlankVariant(layoutOptions);
    }
}
