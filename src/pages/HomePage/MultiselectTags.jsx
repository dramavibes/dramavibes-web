import {
    Label,
    Tag, TagGroup,
} from "@heroui/react";


export default function MultiSelectTags({ selected, setSelected, label, options, className="" }) {
    return (
        <TagGroup
            selectedKeys={selected}
            selectionMode="multiple"
            onSelectionChange={(keys) => setSelected(Array.from(keys))}
            className={className}
            aria-label={label}
        >
            {/* <Label className="capitalize">{label}</Label> */}
            <TagGroup.List>
                {options?.map(opt => (
                    <Tag 
                        key={opt} 
                        id={opt}
                        // className="data-[selected=true]:bg-accent/50 data-[selected=true]:text-accent-foreground"
                        className="pb-1.5 border border-border-secondary data-[selected=true]:border-accent capitalize"
                    >
                        {opt}
                    </Tag>
                ))}
            </TagGroup.List>
        </TagGroup>
    )
}
