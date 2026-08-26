/*
    Every layout model variant the app can show, in one list.
    Used by tests that have to hold for all of them – shape validation, and the finger-position
    blocks of the key levels visualization.
 */
import type {LayoutModel} from "./base-model.ts";
import {
    ansiIBMLayoutModel,
    ansiWideLayoutModel,
    createAN65,
    createApple,
    createHHKB
} from "./layout/ansiLayoutModel.ts";
import {ergoboardCentralLayoutModel} from './layout/ergoboardCentralLayoutModel.ts';
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
import {ergoboardSemiWideLayoutModel} from "./layout/ergoboardSemiWideLayoutModel.ts";
import {
    createErgoPlankCenterArrows,
    createErgoPlankInlineArrows,
    createErgoPlankMidShiftLowerCharacters,
    createErgoPlankMidShiftRightReturn,
    ergoplankLayoutModel
} from "./layout/ergoplankLayoutModel.ts";
import {
    majorErgoslatLayoutModel,
    makeErgoslatNumberless,
    minorErgoslatLayoutModel
} from './layout/ergoslatLayoutModel.ts';
import {harmonic12LayoutModel} from "./layout/harmonic12LayoutModel.ts";
import {harmonic13MidshiftLayoutModel} from "./layout/harmonic13MidshiftLayoutModel.ts";
import {harmonic13WideLayoutModel} from "./layout/harmonic13WideLayoutModel.ts";
import {harmonic14TraditionalLayoutModel} from "./layout/harmonic14TraditionalLayoutModel.ts";
import {harmonic14WideLayoutModel} from "./layout/harmonic14WideLayoutModel.ts";
import {katanaLayoutModel} from "./layout/katanaLayoutModel.ts";
import {splitOrthoLayoutModel} from "./layout/splitOrthoLayoutModel.ts";
import {xhkb13LayoutModel, xhkb15LayoutModel, xhkb16LayoutModel} from "./layout/xhkbLayoutModel.ts";

export const allLayoutModels: Array<LayoutModel> = [
    ansiIBMLayoutModel,
    ansiWideLayoutModel,
    createHHKB(ansiIBMLayoutModel),
    createApple(ansiIBMLayoutModel),
    createHHKB(ansiWideLayoutModel),
    createApple(ansiWideLayoutModel),
    createAN65(ansiIBMLayoutModel),
    createAN65(ansiWideLayoutModel),
    xhkb13LayoutModel,
    xhkb15LayoutModel,
    xhkb16LayoutModel,
    // Harmonics
    harmonic12LayoutModel,
    harmonic13WideLayoutModel,
    harmonic13MidshiftLayoutModel,
    harmonic14WideLayoutModel,
    harmonic14TraditionalLayoutModel,
    // Ergoplanks
    katanaLayoutModel,
    majorErgoslatLayoutModel(false),
    majorErgoslatLayoutModel(true),
    minorErgoslatLayoutModel(false),
    minorErgoslatLayoutModel(true),
    makeErgoslatNumberless(majorErgoslatLayoutModel(false)),
    makeErgoslatNumberless(minorErgoslatLayoutModel(false)),
    ergoplankLayoutModel,
    createErgoPlankMidShiftLowerCharacters(ergoplankLayoutModel),
    createErgoPlankMidShiftRightReturn(ergoplankLayoutModel),
    createErgoPlankInlineArrows(ergoplankLayoutModel),
    createErgoPlankInlineArrows(createErgoPlankMidShiftLowerCharacters(ergoplankLayoutModel)),
    createErgoPlankInlineArrows(createErgoPlankMidShiftRightReturn(ergoplankLayoutModel)),
    createErgoPlankCenterArrows(ergoplankLayoutModel),
    createErgoPlankCenterArrows(createErgoPlankMidShiftLowerCharacters(ergoplankLayoutModel)),
    createErgoPlankCenterArrows(createErgoPlankMidShiftRightReturn(ergoplankLayoutModel)),
    ergoboardCentralLayoutModel,
    ergoboardLowshiftLayoutModel,
    ergoboardBigEnterLayoutModel,
    ergoboardLowshiftWideLayoutModel,
    ergoboardLowshiftWideAngleModLayoutModel,
    ergoboardComfyLayoutModel,
    ergoboardRightRetLayoutModel,
    ergoboardCentralEnterLayoutModel,
    ergoboardVerticalEnterLayoutModel,
    ergoboardExtraWideLayoutModel,
    ergoboardSemiWideLayoutModel,
    // Ergosplits
    splitOrthoLayoutModel(false),
    splitOrthoLayoutModel(true),
];
