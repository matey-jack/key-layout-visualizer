import {ComponentChildren} from "preact";

interface LayoutVariantButtonProps<T> {
    variant: T;
    currentVariant: T;
    setVariant: (variant: T) => void;
    name: string;
    children?: ComponentChildren;
}

export function LayoutVariantButton<T>({variant, currentVariant, setVariant, name, children}: LayoutVariantButtonProps<T>) {
    const selected = variant === currentVariant ? " selected" : "";
    return <div>
        <button
            className={"layout-options-button" + selected}
            onClick={() => setVariant(variant)}
        >
            {name}
        </button>
        {selected && children}
    </div>
}
