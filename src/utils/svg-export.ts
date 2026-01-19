/**
 * SVG export utilities for keyboard visualization
 */

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

    // Ensure xmlns is set only once (remove duplicates if present)
    if (svgClone.hasAttribute('xmlns')) {
        svgClone.removeAttribute('xmlns');
        svgClone.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'http://www.w3.org/2000/svg');
    }

    // Extract and embed styles
    const styleContent = extractCriticalStyles();
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
 * Extracts CSS rules relevant to keyboard visualization.
 * Extracts from KeyboardSvg.css specifically, which contains all SVG styling rules.
 * 
 * @returns CSS text content with rules for keyboard visualization
 */
function extractCriticalStyles(): string {
    const cssRules: string[] = [];

    // Extract from KeyboardSvg.css stylesheet only
    // This file contains all the SVG styling and nothing else
    try {
        for (const sheet of document.styleSheets) {
            // Only include KeyboardSvg.css (and app.css for animations, but filter carefully)
            if (isKeyboardSvgStylesheet(sheet)) {
                try {
                    const rules = sheet.cssRules || sheet.rules || [];
                    for (const rule of rules) {
                        const cssText = rule.cssText;
                        if (cssText) {
                            cssRules.push(cssText);
                        }
                    }
                } catch (e) {
                    // Catch CORS errors on individual sheets
                    console.debug('Could not access rules from stylesheet:', sheet.href, e);
                }
            }
        }
    } catch (e) {
        console.warn('Error extracting stylesheets:', e);
    }

    // Fallback: If no rules extracted, return minimal but valid CSS
    if (cssRules.length === 0) {
        return getMinimalFallbackStyles();
    }

    return cssRules.join('\n');
}

/**
 * Determines if a stylesheet is the KeyboardSvg stylesheet.
 * We only want CSS from KeyboardSvg.css, which contains all SVG-specific styling
 * and doesn't have page layout rules.
 */
function isKeyboardSvgStylesheet(sheet: CSSStyleSheet): boolean {
    const href = sheet.href || '';
    // Only include KeyboardSvg.css - this has all the SVG styling we need
    if (href.includes('KeyboardSvg')) {
        return true;
    }
    return false;
}

/**
 * Fallback minimal CSS styles for keyboard visualization.
 * Used when stylesheets cannot be accessed.
 */
function getMinimalFallbackStyles(): string {
    return `
.keyboard-svg { }
.key-group { }
.key-outline { fill: #f0f0f0; stroke: #333; stroke-width: 2; }
.key-label { font-family: monospace; font-size: 24px; }
.keyboard-symbol { font-size: 24px;  text-anchor: middle;}
.key-name { font-size: 16; text-anchor: middle;}
.home-key { fill: #c0d0ff; }
.effort-1 { fill: #ffff99; }
.effort-2 { fill: #ffdd66; }
.effort-3 { fill: #ffbb33; }
.effort-4 { fill: #ff9900; }
.effort-5 { fill: #ff6600; }
.effort-6 { fill: #ff3333; }
.effort-7 { fill: #cc0000; }
.effort-8 { fill: #990000; }
.effort-9 { fill: #660000; }
.lthumb { fill: #e0c0ff; }
.rthumb { fill: #e0c0ff; }
.lindex { fill: #c0e0ff; }
.rindex { fill: #c0e0ff; }
.middy { fill: #c0ffc0; }
.ringy { fill: #ffffc0; }
.pinky { fill: #ffc0c0; }
.home-key-border { stroke: #0066cc; stroke-width: 3; }
.command-key-border { stroke: #999; stroke-width: 2; }
.unlabeled { fill: #e0e0e0; }
.key-ribbon { fill: none; stroke: #333; stroke-width: 1; }
.same-finger { stroke: #ff6600; stroke-width: 2; }
.same-hand { stroke: #ffaa00; stroke-width: 2; }
.swap-hands { stroke: #ff0000; stroke-width: 2; }
.frequency-circle { fill: none; stroke: #666; stroke-width: 1; }
.bigram-line { stroke-width: 2; }
.bigram-rank-1 { stroke: #ffff00; }
.bigram-rank-2 { stroke: #ffdd00; }
.bigram-rank-3 { stroke: #ffaa00; }
.bigram-rank-4 { stroke: #ff8800; }
.bigram-rank-5 { stroke: #ff6600; }
.bigram-rank-6 { stroke: #ff4400; }
.bigram-rank-7 { stroke: #ff2200; }
.bigram-rank-8 { stroke: #dd0000; }
.bigram-rank-9 { stroke: #bb0000; }
.same-row { stroke-dasharray: 5,5; }
.neighboring-row { stroke-dasharray: 3,3; }
.opposite-row { stroke-dasharray: 1,1; }
.opposite-lateral { stroke-dasharray: none; }
.alt-finger { opacity: 0.6; }
.same-finger-bigram { stroke-width: 3; }
.hand-stagger-line { stroke: #999; stroke-width: 1; stroke-dasharray: 2,2; }
.stagger-line { stroke: #ccc; stroke-width: 1; }
`;
}
