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
        >
            <Label className="capitalize">{label}</Label>
            <TagGroup.List>
                {options?.map(opt => <Tag key={opt} id={opt}>{opt}</Tag>)}
            </TagGroup.List>
        </TagGroup>
    )
}
