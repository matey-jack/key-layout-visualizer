import type {ComponentChildren} from "preact";

interface OptionButtonProps {
    selected: boolean;
    onClick: () => void;
    children: ComponentChildren;
}

export function OptionButton({selected, onClick, children}: OptionButtonProps) {
    return (
        <button
            type="button"
            class={"toggle-btn toggle-btn--sm" + (selected ? " selected" : "")}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
