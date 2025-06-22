
export enum LayoutType {
    IBM,
    Ortho,
    Harmonic,
}

export const LayoutNames: Record<LayoutType, string> = {
    [LayoutType.IBM]: "IBM",
    [LayoutType.Ortho]: "Ortho",
    [LayoutType.Harmonic]: "Harmonic",
}