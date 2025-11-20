type CheckboxWithLabelProps = {
    type?: "checkbox" | "radio";
    label: string;
    // for radio buttons: all within an exclusivity group need the same 'name'.
    groupName?: string;
    disabled?: boolean;
    checked: boolean;
    onChange?: (checked: boolean) => void;
};

export function CheckboxWithLabel({type = "checkbox", groupName, checked, disabled, label, onChange}: CheckboxWithLabelProps) {
    const handleChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        onChange?.(target.checked);
    };

    return (
        <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}
               class={disabled ? "disabled" : ""}
        >
            <input
                type={type}
                name={groupName}
                checked={checked}
                onChange={handleChange}
                disabled={disabled ?? false}
            />
            {label}
        </label>
    );
}