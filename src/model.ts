
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
    [LayoutType.Ortho]: "Ortholinear / Iris CE",
    [LayoutType.Harmonic]: "Harmonic Rows",
}