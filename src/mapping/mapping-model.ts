
export interface FlexMapping {
    name: string;
    description?: string;
    sourceUrl?: string;

    /*
        Key mappings can be defined generically or layout-specific or both.
        The app shows only the ones that apply to the selected layout,
        falling back to Qwerty if you switch layouts and the selected mapping doesn't apply.
     */

    // This is 3 rows of 10 characters – just the keys that most published key mappings are remapping.
    // It leaves some great improvements untapped, but transfers more easily between different keyboard layouts.
    // (Which is an ironic prevision of fate, since ortho keyboards only became really popular after many
    // of the classical layouts were invented...)
    mapping30?: string[];

    // for correct dimensions, see the layout model files
    mappingAnsi?: string[];
    mappingHarmonic?: string[];
    mappingSplitOrtho?: string[];

    // for customizing the ANSI wide Layout
    ansiMovedColumns?: number[];
}
