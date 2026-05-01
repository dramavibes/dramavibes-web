import { useState, useEffect, useCallback } from "react"
import { Drawer, Button, Surface, Accordion } from "@heroui/react";
import { useFilters, DEFAULT_FILTERS } from "../../hooks/useFilters"
import FilterItem from "./FilterItem"
import { SearchIcon, TrashIcon } from 'lucide-react'


export default function FilterPanel({ handleApply, resetFilters, appliedFilters, filterConfig, variant = "desktop", className = "", isOpen, onOpenChange }) {
    // actual applied filters
    // const { filters, filterConfig } = useFilters()

    // dirty filters, storing current user selection, NOT the applied filter. 
    // This gets coppied to applied filters on clicking apply
    const [dirtyFilters, setDirtyFilters] = useState(() => { console.log(`[FilterPanel] Initializing ${variant} variant with filters:`, appliedFilters); return appliedFilters ?? DEFAULT_FILTERS })

    // keep applied filters and dirty filters in sync
    // the applied filtes can change either from desktop filter panel
    // or mobile filter drawer, so to keep them in sync, this useEffect is used
    useEffect(() => {
        // console.log(`[FilterPanel] SYCNING DIRTY FILTERS ${variant}`, "applied filters: ", appliedFilters, "dirty: ", dirtyFilters)
        console.log(`[FilterPanel] SYCNING filters`)
        setDirtyFilters(appliedFilters)
    }, [appliedFilters])

    // useCallback is used do the FilterItem doesn't re-render unnecessarily
    const updateDirtyFilter = useCallback((key, value) => {
        setDirtyFilters(prev => ({ ...prev, [key]: value }));
    }, [])

    const renderFilterContent = () => {
        return (
            <div className={`flex flex-col gap-5 ${className}`}>
                {/* <pre className="text-xs h-50 p-2 overflow-auto">{JSON.stringify(dirtyFilters, null, 2)}</pre> */}
                <Accordion allowsMultipleExpanded className="w-full max-w-md">
                    {Object.entries(filterConfig || {}).map(([key, config]) => {
                        if (config.component == null) return null;
                        return (
                            <Accordion.Item key={key} defaultExpanded={key != "genres"}>
                                <Accordion.Heading>
                                    <Accordion.Trigger className="capitalize text-foreground">
                                        {key?.replace("_", " ")}
                                        <Accordion.Indicator />
                                    </Accordion.Trigger>
                                </Accordion.Heading>
                                <Accordion.Panel>
                                    <Accordion.Body className="pt-2">
                                        <FilterItem
                                            filterKey={key}
                                            config={config}
                                            value={dirtyFilters[key]}
                                            onChange={updateDirtyFilter}
                                            className="min-w-0"
                                        />
                                    </Accordion.Body>
                                </Accordion.Panel>
                            </Accordion.Item>
                        )
                    })}
                </Accordion>
                <div className="flex gap-3 justify-end items-center mt-4 pr-2">
                    <Button onClick={resetFilters} variant="tertiary">
                        <TrashIcon />
                        Reset
                    </Button>
                    <Button onClick={() => handleApply(dirtyFilters)}>
                        <SearchIcon />
                        Apply
                    </Button>
                </div>
            </div>
        )
    }

    if (variant == "desktop") {
        return (
            <Surface className={`
                min-w-0 overflow-x-hidden
            `}>
                <div className="p-5">
                    {renderFilterContent()}
                </div>
            </Surface>
        )
    }
    else if (variant == "mobile") {
        return (
            <MobileFilterDrawer isOpen={isOpen} onOpenChange={onOpenChange}>
                {renderFilterContent()}
            </MobileFilterDrawer>)
    }
}


function MobileFilterDrawer({ children, isOpen, onOpenChange, placement = "left" }) {
    return (
        <Drawer>
            <Drawer.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
                <Drawer.Content placement={placement}>

                    <Drawer.Dialog className="pr-1 pb-0">
                        <Drawer.CloseTrigger />
                        <Drawer.Header className="pb-2">
                            <Drawer.Heading>Filters</Drawer.Heading>
                        </Drawer.Header>
                        <Drawer.Body className="pb-6 pr-2">
                            {children}
                        </Drawer.Body>
                    </Drawer.Dialog>
                </Drawer.Content>
            </Drawer.Backdrop>
        </Drawer>
    )
}