import type {ComponentChildren} from "preact";

interface LayoutVariantButtonProps<T> {
    variant: T;
    currentVariant: T;
    setVariant: (variant: T) => void;
    name: string;
    note?: string;
    children?: ComponentChildren;
    shareSpace?: boolean;
}

export function LayoutVariantButton<T>({variant, currentVariant, setVariant, name, note, children, shareSpace}: LayoutVariantButtonProps<T>) {
    const selected = variant === currentVariant;
    return <div class={"layout-variant-button-and-children" + (selected ? " selected" : "")}>
        <button type="button"
            className={"toggle-btn layout-variant-button" + (selected ? " selected" : "")}
            data-label={name}
            onClick={() => setVariant(variant)}
        >
            {name}
        </button>
        <div class={"layout-variant-details-wrapper" + (shareSpace ? " share-space" : "")}>
            {note && <div class="layout-variant-note">
                {note}
            </div>}
            <div class="layout-variant-options">
                {children}
            </div>
        </div>
    </div>
}
