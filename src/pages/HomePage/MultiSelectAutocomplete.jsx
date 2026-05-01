import {
    Autocomplete,
    EmptyState,
    Label,
    ListBox,
    SearchField,
    Tag,
    TagGroup,
    useFilter,
} from "@heroui/react";
import { useState } from "react";


export default function MultiSelectAutocomplete({ selected, setSelected, label, options, placeholder, className="" }) {
    const { contains } = useFilter({ sensitivity: "base" });

    // const items = [
    //     { id: "california", name: "California" },
    //     { id: "texas", name: "Texas" },
    //     { id: "florida", name: "Florida" },
    //     { id: "new-york", name: "New York" },
    //     { id: "illinois", name: "Illinois" },
    //     { id: "pennsylvania", name: "Pennsylvania" },
    // ];

    const onRemoveTags = (keys) => {
        let prev = [...selected]
        const res = prev?.filter((key) => !keys.has(key))
        setSelected(res)
    };

    console.log("SELECTED:", selected)

    return (
        <Autocomplete
            className={`w-full ${className}`}
            placeholder={placeholder}
            selectionMode="multiple"
            value={selected}
            onChange={(keys) => setSelected(Array.from(keys))}
        >
            <Label>{label}</Label>
            <Autocomplete.Trigger>
                <Autocomplete.Value>
                    {({ defaultChildren, isPlaceholder, state }) => {
                        if (isPlaceholder || state.selectedItems.length === 0) {
                            return defaultChildren;
                        }

                        const selectedItemsKeys = state.selectedItems.map((item) => item.key);

                        return (
                            <TagGroup size="sm" onRemove={onRemoveTags}>
                                <TagGroup.List>
                                    {selectedItemsKeys.map((selectedItemKey) => {
                                        // const item = items.find((s) => s.id === selectedItemKey);

                                        // if (!item) return null;

                                        return (
                                            <Tag key={selectedItemKey} id={selectedItemKey}>
                                                {selectedItemKey}
                                            </Tag>
                                        );
                                    })}
                                </TagGroup.List>
                            </TagGroup>
                        );
                    }}
                </Autocomplete.Value>
                <Autocomplete.ClearButton />
                <Autocomplete.Indicator />
            </Autocomplete.Trigger>
            <Autocomplete.Popover>
                <Autocomplete.Filter filter={contains}>
                    <SearchField autoFocus name="search" variant="secondary">
                        <SearchField.Group>
                            <SearchField.SearchIcon />
                            <SearchField.Input placeholder="Search..." />
                            <SearchField.ClearButton />
                        </SearchField.Group>
                    </SearchField>
                    <ListBox renderEmptyState={() => <EmptyState>No results found</EmptyState>}>
                        {options.map((option) => (
                            <ListBox.Item key={option} id={option} textValue={option}>
                                {option}
                                <ListBox.ItemIndicator />
                            </ListBox.Item>
                        ))}
                    </ListBox>
                </Autocomplete.Filter>
            </Autocomplete.Popover>
        </Autocomplete>
    );
}