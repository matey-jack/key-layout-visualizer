import type {ComponentChildren} from "preact";

interface LayoutVariantButtonProps<T> {
    variant: T;
    currentVariant: T;
    setVariant: (variant: T) => void;
    name: string;
    children?: ComponentChildren;
}

export function LayoutVariantButton<T>({variant, currentVariant, setVariant, name, children}: LayoutVariantButtonProps<T>) {
    const selected = variant === currentVariant;
    return <div class={"layout-variant-button-and-children" + (selected ? " selected" : "")}>
        <button type="button"
            className="layout-variant-button"
            onClick={() => setVariant(variant)}
        >
            {name}
        </button>
        <div class="layout-variant-options">
            {children}
        </div>
    </div>
}
