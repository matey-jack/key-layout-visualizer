import type {RowBasedLayoutModel} from "./base-model.ts";
import {allMappings} from "./mapping/mappings.ts";
import {ansiIBMLayoutModel} from "./layout/ansiLayoutModel.ts";
import {harmonic14WideLayoutModel} from "./layout/harmonic14WideLayoutModel.ts";
import {harmonic14TraditionalLayoutModel} from "./layout/harmonic14TraditionalLayoutModel.ts";
import {harmonic13WideLayoutModel} from "./layout/harmonic13WideLayoutModel.ts";
import {harmonic13MidshiftLayoutModel} from "./layout/harmonic13MidshiftLayoutModel.ts";
import {harmonic12LayoutModel} from "./layout/harmonic12LayoutModel.ts";
import {katanaLayoutModel} from "./layout/katanaLayoutModel.ts";
import {ergoPlank60LayoutModel} from "./layout/ergoPlank60LayoutModel.ts";
import {eb65MidshiftNiceLayoutModel} from "./layout/eb65MidshiftNiceLayoutModel.ts";
import {splitOrthoLayoutModel} from "./layout/splitOrthoLayoutModel.ts";

export const allLayoutModels: RowBasedLayoutModel[] = [
    ansiIBMLayoutModel,
    harmonic14WideLayoutModel,
    harmonic14TraditionalLayoutModel,
    harmonic13WideLayoutModel,
    harmonic13MidshiftLayoutModel,
    harmonic12LayoutModel,
    katanaLayoutModel,
    ergoPlank60LayoutModel,
    eb65MidshiftNiceLayoutModel,
    splitOrthoLayoutModel,
];

export function generateSeoContent(): string {
    const lines: string[] = [];

    lines.push('<section id="seo-content" style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;">');
    lines.push('<h2>Keyboard Layouts</h2>');

    for (const layout of allLayoutModels) {
        if (layout.name) {
            lines.push(`<article><h3>${escapeHtml(layout.name)}</h3>`);
            if (layout.description) {
                lines.push(`<p>${escapeHtml(layout.description)}</p>`);
            }
            lines.push('</article>');
        }
    }

    lines.push('<h2>Key Mappings</h2>');

    for (const mapping of allMappings) {
        if (mapping.name) {
            lines.push(`<article><h3>${escapeHtml(mapping.name)}</h3>`);
            if (mapping.description) {
                lines.push(`<p>${escapeHtml(mapping.description)}</p>`);
            }
            if (mapping.sourceUrl) {
                lines.push(`<p><a href="${escapeHtml(mapping.sourceUrl)}">
${escapeHtml(mapping.sourceLinkTitle || 'Learn more')}</a></p>`);
            }
            lines.push('</article>');
        }
    }

    lines.push('</section>');

    return lines.join('\n');
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
