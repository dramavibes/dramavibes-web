import { memo, useCallback, useEffect, useMemo, useState } from "react"
import { Separator, Button, Surface } from "@heroui/react";
import { Filter as FilterIcon } from "lucide-react";

import { useFilters } from "../../hooks/useFilters"
import { useIsLargeScreen } from "../../hooks/useIsLargeScreen"

import { classicSearch, getFilterOptions } from '../../services/api'

import SearchModeSwitch from "./SearchModeSwitch"
import FilterContent, { MobileFilterDrawer } from './FilterContent'
import SearchBar from "./SearchBar"
import DramaGrid from "../../components/DramaGrid"
import DramaCard from "../../components/DramaCard"



export default function HomePage() {
    const [searchMode, setSearchMode] = useState("vibe")

    const [searchError, setSearchError] = useState("")
    const [response, setResponse] = useState({})

    const { filters, setFilters, filterConfig } = useFilters()
    const [isFilterPanelOpen, setFilterPanelOpen] = useState(true)

    const isLargeScreen = useIsLargeScreen();

    // const [shouldRender, setShouldRender] = useState(isFilterPanelOpen);


    const handleSearch = async (searchQuery) => {
        if (!(searchQuery?.length >= 3)) {
            setSearchError("Query must be at least 3 characters!")
            return
        }

        setSearchError("")
        await handleClassicSearch(searchQuery)
    }

    const handleClassicSearch = async (searchQuery) => {
        const res = await classicSearch(searchQuery);
        setResponse(res)
    }

    const handleFilterApply = useCallback((dirtyFilters) => {
        console.log("APPLYING", dirtyFilters)
        setFilters(dirtyFilters)        // apply the dirty (temporary) filters sent from the component
        // setFilterPanelOpen(false)   // close filter panel
    }, [])

    return (
        <div className="flex flex-col">

            {/* ------------------------ Search Section --------------------- */}
            <div className="flex flex-col items-center px-3">
                <p className="px-5 lg:px-8 pt-3 text-center text-[16px] sm:text-2xl text-foreground/80 mt-1">
                    Find your next Asian drama by vibe, not just title.
                </p>

                <SearchModeSwitch
                    searchMode={searchMode}
                    setSearchMode={setSearchMode}
                    className="mt-6 mb-4"
                />

                <SearchBar
                    placeholder={searchMode == "vibe" ? "Search by feeling, e.g. Heartwarming drama that feels like a warm hug" : "Search by title, e.g. Goblin"}
                    onSubmit={handleSearch}
                    isInvalid={searchError ? true : false}
                    errorMsg={searchError}
                />
                <Separator className="mt-6" />
            </div>

            {/* ------------------------ Results section ----------------------- */}
            <div className={`grow
               grid 
               ${!isLargeScreen? 'grid-cols-1': isFilterPanelOpen?'grid-cols-[320px_1fr]':'grid-cols-[0px_1fr]'}
               transition-all duration-300
            `}>
                {/* ----------------------- Filter Panel ------------------------------- */}
                {isLargeScreen && 
                    <SidePanel 
                        // isOpen={isFilterPanelOpen} 
                        // onOpenChange={setFilterPanelOpen}
                        // className="hidden lg:block"
                    >
                        <FilterContent handleApply={handleFilterApply} filters={filters} filterConfig={filterConfig} variant='desktop'/>
                    </SidePanel>
                }
                {/* ----------------------- Main section ------------------------------- */}
                <div className="grow shrink-0">

                    {/* -------- Top Filter Row --------- */}
                    <div className="flex px-2 py-2">
                        <Button onClick={() => setFilterPanelOpen(!isFilterPanelOpen)}>
                            <FilterIcon />
                            Filters
                        </Button>
                        <div className="grow"></div>
                    </div>
                    {/* <pre className="text-xs p-5">
                        {JSON.stringify(filters, null, 2)}
                    </pre> */}

                    {/* -------- Actual Results Grid -------- */}
                    <div className="px-5 mt-1 pb-6 transition-all duration-300">
                        {response?.total != null && <div className="mb-3 text-muted text-sm text-right">{`${response.total} result${response.total > 1 ? 's' : ''} found`}</div>}
                        {response?.results && response.results.length == 0 && <div className="text-muted text-center">No results found!</div>}
                        <DramaGrid isFilterPanelOpen={isFilterPanelOpen && isLargeScreen}>
                            {response?.results?.map(drama => <DramaCard key={drama.slug} drama={drama} />)}
                        </DramaGrid>
                    </div>
                </div>

            </div>

            {!isLargeScreen && (
                <MobileFilterDrawer isOpen={isFilterPanelOpen} onOpenChange={setFilterPanelOpen}>
                    <FilterContent handleApply={handleFilterApply} filters={filters} filterConfig={filterConfig} variant='mobile'/>
                </MobileFilterDrawer>
            )}

        </div>
    )
}

function SidePanel({children, isOpen, onOpenChange, className="", width=320}){
    return (
        <Surface className={`
            min-w-0 overflow-x-hidden
            ${className}
        `}>
            <div className="p-5">                
                {children}
            </div>
        </Surface>
    )
}


// transition-all duration-300
//             ${isOpen? `w-[${width}px]`: 'w-0'} 

// <div className={`
//     hidden lg:block overflow-hidden 
//     bg-surface min-w-0  
//     ${isFilterPanelOpen ? 'w-90' : 'w-0'} 
//     transition-all duration-300
// `}>
//     {/* This internal div prevents the content from squishing while sliding */}
//     {/* <div className={`min-w-0 overflow-hidden`}> */}
//     {shouldRender && <FilterContent handleApply={handleFilterApply} />}
//     {/* </div> */}
// </div>