import {useState} from 'preact/hooks';

type CheckboxWithLabelProps = {
    label: string;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
};

export function CheckboxWithLabel(props: CheckboxWithLabelProps) {
    const [internalChecked, setInternalChecked] = useState(props.checked ?? false);

    const handleChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        setInternalChecked(target.checked);
        props.onChange?.(target.checked);
    };

    return (
        <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <input
                type="checkbox"
                checked={internalChecked}
                onChange={handleChange}
            />
            {props.label}
        </label>
    );
}