import type {ComponentChildren} from "preact";

interface OptionButtonProps {
    selected: boolean;
    onClick: () => void;
    // An option the current board cannot take at all, as opposed to one it simply has not got.
    disabled?: boolean;
    children: ComponentChildren;
}

export function OptionButton({selected, onClick, disabled, children}: OptionButtonProps) {
    return (
        <button
            type="button"
            class={"toggle-btn toggle-btn--sm" + (selected ? " selected" : "")}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
