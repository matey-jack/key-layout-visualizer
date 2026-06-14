import type {ComponentChildren} from "preact";
import "./Tooltip.css";

interface TooltipProps {
    text: string;
    children: ComponentChildren;
}

export function Tooltip({text, children}: TooltipProps) {
    return (
        <div class="tooltip-container">
            {children}
            <div class="tooltip-bubble">
                {text}
            </div>
        </div>
    );
}
