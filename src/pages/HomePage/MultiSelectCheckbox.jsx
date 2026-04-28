import {
    Label,
    Checkbox, CheckboxGroup,
} from "@heroui/react";


export default function MultiSelectCheckbox({ selected, setSelected, label, options, className = "" }) {
    return (
        <CheckboxGroup className="w-full min-w-0" name={label} variant="secondary" value={selected} onChange={setSelected}>
            <Label className="capitalize">{label}</Label>
            {options.map(opt => (
                <Checkbox key={opt} value={opt}>
                    <Checkbox.Control>
                        <Checkbox.Indicator />
                    </Checkbox.Control>
                    <Checkbox.Content>
                        <Label className="capitalize">{opt}</Label>
                    </Checkbox.Content>
                </Checkbox> 
            ))}
        </CheckboxGroup>
    )
}