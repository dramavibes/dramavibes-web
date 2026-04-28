import { useState } from "react";
import {
    TextField,
    InputGroup,
    Button,
    FieldError,
} from "@heroui/react";
import {SearchIcon} from 'lucide-react'


export default function SearchBar({ placeholder, onSubmit, isInvalid, errorMsg }) {
    const [value, setValue] = useState("")

    return (
        <TextField aria-label="search" className="w-full max-w-xl" isInvalid={isInvalid}>
            <InputGroup className="rounded-full h-12 dark:bg-surface-tertiary">
                <InputGroup.Input
                    className="w-full ml-1"
                    value={value}
                    placeholder={placeholder}
                    onChange={(event) => setValue(event.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onSubmit(value);
                        }
                    }}
                />
                <InputGroup.Suffix className="m-0 px-0 pr-1">
                    <Button isIconOnly aria-label="search-button" size="md" variant="tertiary" onClick={()=>onSubmit(value)}>
                        <SearchIcon />
                    </Button>
                </InputGroup.Suffix>
            </InputGroup>
            <FieldError className="px-2">{errorMsg}</FieldError>
        </TextField>
    )
}
