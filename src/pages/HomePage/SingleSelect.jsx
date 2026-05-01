import { Label, ListBox, Select } from "@heroui/react";
import { useState } from "react";

export default function SingleSelect({ value, options, onChange, label, placeholder = "Select", defaultValue, className = "" }) {

    return (
        <Select
            className={`w-full ${className}`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            aria-label={label}
            variant="secondary"
        >
            {/* <Label>State (controlled)</Label> */}
            <Select.Trigger>
                <Select.Value className="capitalize"/>
                <Select.Indicator />
            </Select.Trigger>
            <Select.Popover className="dark:bg-surface-secondary">
                <ListBox>
                    {options.map((option) => {
                        const id = option.id || option
                        const name = option.name || option.replaceAll("_", " ")
                        return (
                            <ListBox.Item key={id} id={id} textValue={name} className="capitalize">
                                {name}
                                <ListBox.ItemIndicator />
                            </ListBox.Item>
                        )
                    })}
                </ListBox>
            </Select.Popover>
        </Select>
    );
}