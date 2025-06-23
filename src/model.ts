import {HarmonicKeyboard} from "./KeyboardSvg.tsx";
import {HarmonicKeyboardPitch} from "./HarmonicLayoutConfig.ts";

export enum LayoutType {
    ANSI,
    Ortho,
    Harmonic,
}

export enum KeyboardRows {
    Number,
    Upper,
    Home,
    Lower,
    Bottom,
}

export const LayoutNames: Record<LayoutType, string> = {
    [LayoutType.ANSI]: "ANSI / Typewriter",
    [LayoutType.Ortho]: "Ortholinear",
    [LayoutType.Harmonic]: "Harmonic Rows",
}

export interface KeyboardProps {
    mapping: string;
}

type KeyboardElementType = (props: KeyboardProps) => preact.JSX.Element;

export const LayoutElements: Record<LayoutType, KeyboardElementType | null> = {
    [LayoutType.ANSI]: null,
    [LayoutType.Ortho]: null,
    [LayoutType.Harmonic]: HarmonicKeyboard,
}

export const LayoutDescriptions: Record<LayoutType, string> = {
    [LayoutType.ANSI]: "The ANSI keyboard layout is based on a typewriter keyboard from the 19th century which gradually evolved " +
        "to add some computer-specific keys like Ctrl, Alt, and most importantly the @ sign. " +
        "This layout has keys of widely varying withs and an awkward stagger of 0.5, 0.25, and again 0.25 between the rows. " +
        "This curiosity still dates back to old typewriter days when each key's middle needed to have a non-intersecting lever underneath to operate its type element. " +
        "The keyboard (and its default key mapping) also features an asymmetric and unnecessarily narrow default hand position. ",
    [LayoutType.Ortho]: "Ortholinear keyboards remove the weird row stagger and usually also use uniform key sizes. " +
        "Those are just as easy to use, but save a lot of space and also allow for easy changing of the key mapping. " +
    "The layout shown here corresponds to the Iris CE, a split keyboard which is incidentally the one that I used for coding this app. ",
    [LayoutType.Harmonic]: HarmonicKeyboardPitch,

}