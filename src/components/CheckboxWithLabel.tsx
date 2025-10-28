type CheckboxWithLabelProps = {
    label: string;
    checked: boolean;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;
};

export function CheckboxWithLabel(props: CheckboxWithLabelProps) {
    const handleChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        props.onChange?.(target.checked);
    };

    return (
        <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}
               class={props.disabled ? "disabled" : ""}
        >
            <input
                type="checkbox"
                checked={props.checked}
                onChange={handleChange}
                disabled={props.disabled ?? false}
            />
            {props.label}
        </label>
    );
}