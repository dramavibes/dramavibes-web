import { useEffect, useState } from "react";
import {
    TextField,
    InputGroup,
    Button,
    FieldError,
} from "@heroui/react";
import {SearchIcon} from 'lucide-react'


export default function SearchBar({ 
    // value, 
    // setValue, 
    placeholder, 
    onSubmit, 
    isInvalid, 
    errorMsg, 
    defaultValue="",
    onQueryChange
}) {
    const [value, setValue] = useState(defaultValue)

    useEffect(()=>{
        setValue(defaultValue)
    }, [defaultValue])

    const handleChange = (val) => {
        setValue(val)
        onQueryChange(val)  // update ref on parent
    }

    return (
        <TextField aria-label="search" className="w-full max-w-xl" isInvalid={isInvalid}>
            <InputGroup className="rounded-full h-12 dark:bg-surface-tertiary">
                <InputGroup.Input
                    className="w-full ml-1 text-sm"
                    value={value}
                    placeholder={placeholder}
                    onChange={(event) => handleChange(event.target.value)}
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
