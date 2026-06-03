import type {ComponentChildren} from "preact";

interface OptionGroupProps {
    label: string;
    children: ComponentChildren;
}

export function OptionGroup({label, children}: OptionGroupProps) {
    return (
        <div class="layout-option-group--inline">
            <div class="layout-option-group-label">{label}</div>
            <div class="layout-option-button-group">
                {children}
            </div>
        </div>
    );
}
