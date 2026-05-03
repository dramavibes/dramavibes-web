import React from "react";
import { Input } from "@heroui/react";


export default function RangeInput({ value, onChange, placeholders = ["From", "To"] }) {
    const [from, to] = value;

    const handleChange = (index, newValue) => {
        const nextValue = [...value];
        // Convert to number
        nextValue[index] = newValue === "" ? null : Number(newValue);
        onChange(nextValue);
    };

    return (
        <div className="flex w-full flex-row items-center gap-2 pt-1">
            <Input
                type="number"
                placeholder={placeholders[0]}
                value={from || ""}
                onChange={(event) => handleChange(0, event.target.value)}
                variant="secondary"
                className="max-w-xs min-w-0 text-xs"
            />

            <span className="text-default-400 font-medium">-</span>

            <Input
                type="number"
                placeholder={placeholders[1]}
                value={to || ""}
                onChange={(event) => handleChange(1, event.target.value)}
                variant="secondary"
                className="max-w-xs min-w-0 text-xs"
            />
        </div>
    );
}
