/**
 * SVG export utilities for keyboard visualization
 */

import keyboardSvgCss from '../layout/KeyboardSvg.css?inline';

/**
 * Extracts the SVG element from a container and returns it as a string with embedded styles.
 * 
 * @param container - DOM element containing the SVG (or the SVG itself)
 * @returns Serialized SVG string with embedded styles, or null if SVG not found
 */
export function extractSvgWithStyles(container: Element): string | null {
    // Find SVG element - it might be the container itself or a child
    let svgElement = container.querySelector('svg.keyboard-svg') as SVGElement;
    if (!svgElement && container.tagName === 'svg') {
        svgElement = container as SVGElement;
    }

    if (!svgElement) {
        console.warn('SVG element not found in container');
        return null;
    }

    // Clone SVG to avoid modifying live DOM
    const svgClone = svgElement.cloneNode(true) as SVGElement;
    bakeLabelOffsets(svgElement, svgClone);

    // Ensure xmlns is set only once (remove duplicates if present)
    if (svgClone.hasAttribute('xmlns')) {
        svgClone.removeAttribute('xmlns');
        svgClone.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'http://www.w3.org/2000/svg');
    }

    // Extract and embed styles
    const styleContent = staticKeyboardStyles();
    if (styleContent) {
        const styleElement = document.createElementNS('http://www.w3.org/2000/svg', 'style');
        styleElement.textContent = styleContent;
        // Insert style as first child of SVG
        svgClone.insertBefore(styleElement, svgClone.firstChild);
    }

    // Serialize to string
    let serialized = new XMLSerializer().serializeToString(svgClone);
    
    // Clean up duplicate xmlns attributes that may occur during serialization
    serialized = serialized.replace(/xmlns="http:\/\/www\.w3\.org\/2000\/svg"\s+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/g, 'xmlns="http://www.w3.org/2000/svg"');
    
    serialized = removeAnimationStyles(serialized);
    
    // Add newlines after each tag
    serialized = serialized.replace(/>/g, '>\n');
    
    return serialized.trim();
}

/**
 * Writes each key label's horizontal offset into its own `x`.
 *
 * On the page a label is drawn at x=0 and slid into place by a CSS transform that
 * reads the `--to-label-x` of its key group. An export carries neither: the custom
 * properties leave with the animation styles, and plain coordinates survive other
 * SVG tools better than CSS transforms do. Reading the offset off the live element
 * resolves the property; the clone it is written to is not in any document.
 */
function bakeLabelOffsets(liveSvg: SVGElement, svgClone: SVGElement): void {
    const liveLabels = liveSvg.querySelectorAll('text.key-label');
    const clonedLabels = svgClone.querySelectorAll('text.key-label');

    for (let i = 0; i < liveLabels.length; i++) {
        const offset = Number.parseFloat(getComputedStyle(liveLabels[i]).getPropertyValue('--to-label-x'));
        if (Number.isNaN(offset)) {
            continue;
        }
        const label = clonedLabels[i];
        label.setAttribute('x', String((Number(label.getAttribute('x')) || 0) + offset));
    }
}

/**
 * Removes animation-related inline styles from SVG elements.
 * Extracts the final transform position (--to-x, --to-y) and replaces the entire style
 * with a static transform to that position, removing all animation properties.
 * 
 * @param svgString - Serialized SVG string
 * @returns SVG string with animation styles replaced by static transforms
 */
function removeAnimationStyles(svgString: string): string {
    const animationStylePattern = /style="([^"]*)"/g;
    
    return svgString.replace(animationStylePattern, (_: string, styleContent: string) => {
        // Extract custom property values
        const toXMatch = styleContent.match(/--to-x:\s*([^;]+)/);
        const toYMatch = styleContent.match(/--to-y:\s*([^;]+)/);
        
        // If this style has animation properties with to-x and to-y, create a static transform
        if (toXMatch && toYMatch) {
            const toX = toXMatch[1].trim();
            const toY = toYMatch[1].trim();
            return `style="transform: translate(${toX}, ${toY})"`;
        }
        
        // For styles without animation properties, keep them as-is but remove custom properties and animation
        const properties = styleContent.split(';').map(prop => prop.trim());
        const filteredProperties = properties.filter(prop => {
            if (!prop) return false;
            const propName = prop.split(':')[0].trim().toLowerCase();
            // Remove animation-related properties
            return !['animation', 'transform-origin', 'animation-name', 'animation-duration', 
                     'animation-timing-function', 'animation-fill-mode', 'animation-delay']
                .includes(propName) && !propName.startsWith('--');
        });
        
        // Only return the style attribute if there are remaining properties
        if (filteredProperties.length === 0) {
            return '';
        }
        
        return `style="${filteredProperties.join(';')}"`;
    });
}

/**
 * The keyboard stylesheet, without the rules that only drive the animation on the page.
 * An export is a still, and its elements keep the `animating` classes they were rendered
 * with, so the keyframes would only replay a move that has already happened. Going
 * through the CSSOM also normalises every rule onto a single line.
 */
function staticKeyboardStyles(): string {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(keyboardSvgCss);

    const rules: string[] = [];
    for (let i = 0; i < sheet.cssRules.length; i++) {
        const rule = sheet.cssRules[i];
        if (rule instanceof CSSKeyframesRule) {
            continue;
        }
        if (rule instanceof CSSStyleRule) {
            rule.style.removeProperty('animation');
            if (rule.style.length === 0) {
                continue;
            }
        }
        rules.push(rule.cssText);
    }
    return rules.join('\n');
}
