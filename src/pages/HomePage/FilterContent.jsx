import { useState, useEffect, useCallback } from "react"
import { Drawer, Button } from "@heroui/react";
import { useFilters, DEFAULT_FILTERS } from "../../hooks/useFilters"
import FilterItem from "./FilterItem"
import {SearchIcon} from 'lucide-react'

export default function FilterContent({ handleApply, filters, filterConfig, className="", variant }) {

    // actual applied filters
    // const { filters, filterConfig } = useFilters()

    // dirty filters, storing current user selection, NOT the applied filter. 
    // This gets coppied to applied filters on clicking apply
    const [dirtyFilters, setDirtyFilters] = useState(() => { console.log(`Initializing ${variant} with filters:`, filters); return filters ?? DEFAULT_FILTERS})

    // keep applied filters and dirty filters in sync
    // the applied filtes can change either from desktop filter panel
    // or mobile filter drawer, so to keep them in sync, this useEffect is used
    useEffect(() => {
        console.log(`USE_EFFECT ${variant}`, "aplied: ", filters, "dirty: ", dirtyFilters)
        setDirtyFilters(filters)
    }, [filters])

    // useCallback is used do the FilterItem doesn't re-render unnecessarily
    const updateDirtyFilter = useCallback((key, value) => {
        setDirtyFilters(prev => ({ ...prev, [key]: value }));
    }, [])


    return (
        <div className={`flex flex-col gap-5 ${className}`}>
            {/* <pre className="text-xs h-50 p-2 overflow-auto">{JSON.stringify(dirtyFilters, null, 2)}</pre> */}
            {Object.entries(filterConfig || {}).map(([key, config]) => (
                <FilterItem
                    key={key}
                    filterKey={key}
                    config={config}
                    value={dirtyFilters[key]}
                    onChange={updateDirtyFilter}
                    className="min-w-0"
                />
            ))}
            <Button onClick={()=>handleApply(dirtyFilters)}>
                <SearchIcon/>
                Apply
            </Button>
            
        </div>
    )
}


export function MobileFilterDrawer({ children, isOpen, onOpenChange, placement="left" }) {
    return (
        <Drawer>
            <Drawer.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
                <Drawer.Content placement={placement}>

                    <Drawer.Dialog>
                        <Drawer.CloseTrigger />
                        <Drawer.Header>
                            <Drawer.Heading>Filters</Drawer.Heading>
                        </Drawer.Header>
                        <Drawer.Body className="pr-2">
                            {children}
                        </Drawer.Body>
                    </Drawer.Dialog>
                </Drawer.Content>
            </Drawer.Backdrop>
        </Drawer>
    )
}