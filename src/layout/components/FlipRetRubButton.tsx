import type {LayoutOptions} from "../../app-model.ts";

type FlipRetRubButtonProps = {
    options: LayoutOptions;
    setOption: (opts: Partial<LayoutOptions>) => void;
}

export function FlipRetRubButton({setOption, options}: FlipRetRubButtonProps) {
    return <button type="button"
                   class="toggle-btn toggle-btn--sm toggle-btn--ret flip-ret-rub-button"
                   onClick={() => setOption({flipRetRub: !options.flipRetRub})}
    >
        ⏎ flip ⌫
    </button>
}