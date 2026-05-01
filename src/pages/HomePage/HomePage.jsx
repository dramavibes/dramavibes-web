import { memo, useCallback, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router";
import { Separator, Button, Surface, Spinner } from "@heroui/react";
import { Filter as FilterIcon } from "lucide-react";

import { useFilters } from "../../hooks/useFilters"
import { useIsLargeScreen } from "../../hooks/useIsLargeScreen"

import { classicSearch, vibeSearch, getFilterOptions } from '../../services/api'

import SearchModeSwitch from "./SearchModeSwitch"
import SearchBar from "./SearchBar"
import DramaGrid from "../../components/DramaGrid"
import DramaCard from "../../components/DramaCard"
import FilterPanel from './FilterContent'



export default function HomePage() {
    const [searchParams, setSearchParams] = useSearchParams()

    // const [searchQuery, setSearchQuery] = useState("")
    // const [searchMode, setSearchMode] = useState("vibe")

    const [searchError, setSearchError] = useState("")
    const [response, setResponse] = useState({})
    const [loading, setLoading] = useState(false)

    const { appliedFilters, setAppliedFilters, updateFilter, filterConfig, buildSearchParams, parseParamsToFilters, buildQuery } = useFilters()
    const [isFilterPanelOpen, setFilterPanelOpen] = useState(true)

    const isLargeScreen = useIsLargeScreen();

    // const [shouldRender, setShouldRender] = useState(isFilterPanelOpen);

    useEffect(() => {
        const params = Object.fromEntries([...searchParams])
        console.log("SEARCH PARAMS:", params)
        const parsedFilters = parseParamsToFilters(params)
        console.log("parsedFilters", parsedFilters)
        setAppliedFilters(parsedFilters)
        if(Object.keys(params).length !== 0 && (params.mode == "classic" || (params.mode=="vibe" && params.query))){
            performSearch(parsedFilters)
        }
    }, [searchParams])

    useEffect(()=>{
        const params = buildSearchParams(appliedFilters)
        setSearchParams(params)
    }, [appliedFilters])

    const handleSearchSubmit = async (query) => {
        query = query.trim()
        if(appliedFilters.mode == "vibe"){
            if (!(query?.length >= 3)) {
                setSearchError("Query must be at least 3 characters!")
                return
            }
        }
        updateFilter("query", query)
        setSearchError("")

        performSearch({...appliedFilters, query: query})
    }

    const performSearch = async (filters) => {
        const query = filters.query
        const mode = filters.mode
        console.log(`${mode} SEARCH query:${query}, filter:`, filters)
        if(mode == "classic"){
            handleClassicSearch(query, buildQuery(filters))
        }
        else if(mode == "vibe"){
            handleVibeSearch(query, buildQuery(filters))
        }
    }

    const handleClassicSearch = async (query, filters) => {
        setLoading(true)
        const res = await classicSearch(query, filters);
        setLoading(false)
        setResponse(res)
    }
    const handleVibeSearch = async (query, filters) => {
        setLoading(true)
        const res = await vibeSearch(query, filters);
        setLoading(false)
        setResponse(res)
    }

    const handleFilterApply = useCallback((dirtyFilters) => {
        console.log("APPLYING", dirtyFilters)
        // let params = buildSearchParams(dirtyFilters)
        // params.query = searchQuery
        // setSearchParams(params)
        setAppliedFilters(dirtyFilters)        // apply the dirty (temporary) filters sent from the component
        if(!isLargeScreen){setFilterPanelOpen(false)}   // close filter panel
    }, [])

    return (
        <div className="flex flex-col">

            {/* ------------------------ Search Section --------------------- */}
            <div className="flex flex-col items-center px-3">
                <p className="px-5 lg:px-8 pt-3 text-center text-[16px] sm:text-2xl text-foreground/80 mt-1">
                    Find your next Asian drama by vibe, not just title.
                </p>

                <SearchModeSwitch
                    // searchMode={searchMode}
                    // setSearchMode={setSearchMode}
                    searchMode={appliedFilters["mode"]}
                    setSearchMode={val => updateFilter("mode", val)}
                    className="mt-6 mb-4"
                />

                <SearchBar
                    placeholder={appliedFilters["mode"] == "vibe" ? "Search by feeling, e.g. Heartwarming drama that feels like a warm hug" : "Search by title, e.g. Goblin"}
                    onSubmit={handleSearchSubmit}
                    isInvalid={searchError ? true : false}
                    errorMsg={searchError}
                    defaultValue={appliedFilters?.query}
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
                <FilterPanel
                    handleApply={handleFilterApply} appliedFilters={appliedFilters} filterConfig={filterConfig} 
                    variant={isLargeScreen?'desktop':'mobile'}
                    isOpen={isFilterPanelOpen} onOpenChange={setFilterPanelOpen}
                />

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
                    <pre className="text-xs p-5 h-20 overflow-y-auto border-2 border-border">
                        {JSON.stringify(appliedFilters, null, 2)}
                    </pre>

                    {/* -------- Actual Results Grid -------- */}
                    <div className="px-5 mt-1 pb-6 transition-all duration-300">
                        {response?.total != null && <div className="mb-3 text-muted text-sm text-right">{`${response.total} result${response.total > 1 ? 's' : ''} found`}</div>}
                        {response?.results && response.results.length == 0 && <div className="text-muted text-center">No results found!</div>}
                        {loading && <LoadingSpinner/>}
                        <DramaGrid isFilterPanelOpen={isFilterPanelOpen && isLargeScreen}>
                            {response?.results?.map(drama => <DramaCard key={drama.slug} drama={drama} />)}
                        </DramaGrid>
                    </div>
                </div>

            </div>

        </div>
    )
}

function LoadingSpinner({size="lg"}) {
    return (
        <div className="flex justify-center items-center gap-4 p-1 mt-4">
            <Spinner size={size}/>
        </div>
    )
}