import {render} from '@testing-library/preact';
import {writeFileSync} from 'fs';
import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import {VisualizationType} from '../base-model.ts';
import {ansiIBMLayoutModel} from '../layout/ansiLayoutModel.ts';
import {KeyboardSvg, RowBasedKeyboard} from '../layout/KeyboardSvg.tsx';
import {fillMapping, getKeyMovements, getKeyPositions} from '../layout/layout-functions.ts';
import {splitOrthoLayoutModel} from '../layout/splitOrthoLayoutModel.ts';
import {qwertyMapping} from '../mapping/baseMappings.ts';
import {extractSvgWithStyles} from './svg-export.ts';

describe('SVG Export', () => {
    let tempFilePath: string;

    beforeAll(() => {
        // Set up temp file path for debugging
        tempFilePath = `keyboard-export-${Date.now()}.svg`;
    });

    afterAll(() => {
        // Temp file is left intentionally for manual inspection
        console.log(`\n📄 SVG content written to: ${tempFilePath}`);
    });

    it('extracts SVG with embedded styles', () => {
        // Setup: Create keyboard SVG component with test data
        const layoutModel = splitOrthoLayoutModel;
        const charMap = fillMapping(layoutModel, qwertyMapping);
        const keyPositions = getKeyPositions(layoutModel, true, charMap!);
        const keyMovements = getKeyMovements(keyPositions, keyPositions);

        const { container } = render(
            <KeyboardSvg>
                <RowBasedKeyboard
                    layoutModel={layoutModel}
                    prevLayoutModel={ansiIBMLayoutModel}
                    keyMovements={keyMovements}
                    vizType={VisualizationType.LayoutKeyEffort}
                    mappingDiff={{}}
                />
            </KeyboardSvg>
        );

        // Extract SVG content
        const svgContent = extractSvgWithStyles(container)!;

        // Assertions
        expect(svgContent).toBeTruthy();
        expect(svgContent).toContain('<svg');
        expect(svgContent).toContain('</svg>');
        expect(svgContent).toContain('<style>');
        expect(svgContent).toContain('</style>');

        // Save to a temp file for inspection
        writeFileSync(tempFilePath, svgContent, 'utf-8');
    });

    it('preserves SVG structure elements', () => {
        const charMap = fillMapping(ansiIBMLayoutModel, qwertyMapping);
        const keyPositions = getKeyPositions(ansiIBMLayoutModel, true, charMap!);
        const keyMovements = getKeyMovements(keyPositions, keyPositions);

        const { container } = render(
            <KeyboardSvg>
                <RowBasedKeyboard
                    layoutModel={ansiIBMLayoutModel}
                    prevLayoutModel={ansiIBMLayoutModel}
                    keyMovements={keyMovements}
                    vizType={VisualizationType.LayoutKeyEffort}
                    mappingDiff={{}}
                />
            </KeyboardSvg>
        );

        const svgContent = extractSvgWithStyles(container)!;

        // Verify SVG structure
        expect(svgContent).toContain('xmlns="http://www.w3.org/2000/svg"');
        expect(svgContent).toContain('viewBox="0 0 1800 500"');
        // make sure that there is only one 'xmlns' in the <svg> opening tag
        const svgTagMatch = svgContent.match(/<svg[^>]*>/);
        expect(svgTagMatch).toBeTruthy();
        const xmlnsCount = (svgTagMatch?.[0] || '').match(/xmlns=/g)?.length || 0;
        expect(xmlnsCount).toBe(1);
    });

    it('preserves CSS classes on key elements', () => {
        const charMap = fillMapping(ansiIBMLayoutModel, qwertyMapping);
        const keyPositions = getKeyPositions(ansiIBMLayoutModel, true, charMap!);
        const keyMovements = getKeyMovements(keyPositions, keyPositions);

        const { container } = render(
            <KeyboardSvg>
                <RowBasedKeyboard
                    layoutModel={ansiIBMLayoutModel}
                    prevLayoutModel={ansiIBMLayoutModel}
                    keyMovements={keyMovements}
                    vizType={VisualizationType.LayoutKeyEffort}
                    mappingDiff={{}}
                />
            </KeyboardSvg>
        );

        const svgContent = extractSvgWithStyles(container);

        // Verify key-related CSS classes are present
        expect(svgContent).toContain('class=');
        expect(svgContent).toContain('key-group');
        expect(svgContent).toContain('key-outline');
        expect(svgContent).toContain('key-label');
    });

    it('includes CSS style definitions', () => {
        const charMap = fillMapping(ansiIBMLayoutModel, qwertyMapping);
        const keyPositions = getKeyPositions(ansiIBMLayoutModel, true, charMap!);
        const keyMovements = getKeyMovements(keyPositions, keyPositions);

        const { container } = render(
            <KeyboardSvg>
                <RowBasedKeyboard
                    layoutModel={ansiIBMLayoutModel}
                    prevLayoutModel={ansiIBMLayoutModel}
                    keyMovements={keyMovements}
                    vizType={VisualizationType.LayoutKeyEffort}
                    mappingDiff={{}}
                />
            </KeyboardSvg>
        );

        const svgContent = extractSvgWithStyles(container)!;
        const styleMatch = svgContent.match(/<style>([\s\S]*?)<\/style>/);

        expect(styleMatch).toBeTruthy();
        expect(styleMatch?.[1]).toBeTruthy();
        expect(styleMatch?.[1]?.length).toBeGreaterThan(0);

        const styleContent = styleMatch?.[1] || '';
        // Verify some CSS rules are included
        expect(styleContent).toMatch(/\./); // Contains CSS selectors with dots (classes)
    });

    it('produces valid SVG output with finite size', () => {
        const charMap = fillMapping(ansiIBMLayoutModel, qwertyMapping);
        const keyPositions = getKeyPositions(ansiIBMLayoutModel, true, charMap!);
        const keyMovements = getKeyMovements(keyPositions, keyPositions);

        const { container } = render(
            <KeyboardSvg>
                <RowBasedKeyboard
                    layoutModel={ansiIBMLayoutModel}
                    prevLayoutModel={ansiIBMLayoutModel}
                    keyMovements={keyMovements}
                    vizType={VisualizationType.LayoutKeyEffort}
                    mappingDiff={{}}
                />
            </KeyboardSvg>
        );

        const svgContent = extractSvgWithStyles(container)!;

        // Verify it's a reasonable size (not empty, not gigantic)
        expect(svgContent.length).toBeGreaterThan(1000);
        expect(svgContent.length).toBeLessThan(1000000);
    });

    it('extracts different visualization types', () => {
        const charMap = fillMapping(ansiIBMLayoutModel, qwertyMapping);
        const keyPositions = getKeyPositions(ansiIBMLayoutModel, true, charMap!);
        const keyMovements = getKeyMovements(keyPositions, keyPositions);

        // Test different visualization types
        const vizTypes = [
            VisualizationType.LayoutKeySize,
            VisualizationType.LayoutFingering,
            VisualizationType.LayoutKeyEffort,
        ];

        vizTypes.forEach((vizType) => {
            const { container } = render(
                <KeyboardSvg>
                    <RowBasedKeyboard
                        layoutModel={ansiIBMLayoutModel}
                        prevLayoutModel={ansiIBMLayoutModel}
                        keyMovements={keyMovements}
                        vizType={vizType}
                        mappingDiff={{}}
                    />
                </KeyboardSvg>
            );

            const svgContent = extractSvgWithStyles(container);
            expect(svgContent).toBeTruthy();
            expect(svgContent).toContain('<svg');
            expect(svgContent).toContain('<style>');
        });
    });
});
