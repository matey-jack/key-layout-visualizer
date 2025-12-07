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
    return <div>
        <button type="button"
            className={"layout-options-button" + (selected ? " selected" : "")}
            onClick={() => setVariant(variant)}
        >
            {name}
        </button>
        <div hidden={!selected} class="layout-variant-options">
            {children}
        </div>
    </div>
}
