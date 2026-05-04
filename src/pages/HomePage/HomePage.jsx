import { memo, useCallback, useEffect, useMemo, useState, useRef, use } from "react"
import { useSearchParams } from "react-router";
import { useQuery } from '@tanstack/react-query'
import { Separator, Button, Surface, Spinner, Chip, Badge, CloseIcon } from "@heroui/react";
import { Filter as FilterIcon, TrashIcon } from "lucide-react";

import { useFilters } from "../../hooks/useFilters"
import { useIsLargeScreen } from "../../hooks/useIsLargeScreen"

import { classicSearch, vibeSearch, getFilterOptions } from '../../services/api'

import SearchModeSwitch from "./SearchModeSwitch"
import SearchBar from "./SearchBar"
import DramaGrid from "../../components/DramaGrid"
import DramaCard from "../../components/DramaCard"
import FilterPanel from './FilterContent'
import PageNavigator from "./PageNavigator";


export default function HomePage() {
    const isLargeScreen = useIsLargeScreen();
    const searchBarRef = useRef(null);

    const [searchParams, setSearchParams] = useSearchParams()

    const [searchMode, setSearchMode] = useState("vibe")
    const [searchError, setSearchError] = useState("")


    const { appliedFilters, setAppliedFilters, updateFilter, resetFilters, filterConfig, buildSearchParams, parseParamsToFilters, buildQuery, getFilterCounts } = useFilters()
    const [isFilterPanelOpen, setFilterPanelOpen] = useState(false)
    const filterCounts = getFilterCounts();

    useEffect(()=>{if(isLargeScreen){setFilterPanelOpen(true)}}, [isLargeScreen])
    
    
    // ---------------------- TanStack UseQuery ----------------------------------
    // Search flow: 
    // user searches -> handleSearchSubmit - sets searchParams (url) -> useEffect fires - sets Applied filters -> useQuery key changes - search triggers
    // similary when user applies filter -> handleFilterApply - sets searchparams -> useEffect fires - sets Applied filters -> useQuery key changes - search triggers
    const params = Object.fromEntries(searchParams)
    const hasParams = Object.keys(params).length > 0
    // const filters = parseParamsToFilters(params)
    const filters = appliedFilters
    const builtQuery = buildQuery(filters)

    const {data: response, isFetching: loading} = useQuery({
        queryKey: ['search', filters.mode, filters.query, builtQuery],
        queryFn: () => filters.mode === 'classic'? 
                        classicSearch(filters.query, builtQuery) 
                        : filters.query?vibeSearch(filters.query, builtQuery):null,

        enabled: hasParams && !searchError,   // only runs when there's something to search
        staleTime: Infinity,
    })

    // ---------------------------------------------------------------------------
    // URL params is the one source of truth for filter state
    // any change in url params will update filter state and that will trigger search
    // if the url has search params even on first load (opening a shared url with params) it will trigger search
    useEffect(() => {
        const params = Object.fromEntries(searchParams)
        console.log("[Home UseEffect] Search params:", params)

        const parsedFilters = parseParamsToFilters(params)
        console.log("[Home UseEffect] parsedFilters", parsedFilters)
        setAppliedFilters(parsedFilters)

        // sync UI controls
        setSearchMode(parsedFilters.mode || "vibe")

    }, [searchParams])


    const handleClassicSearch = async (query, filters) => {
        setLoading(true)
        try{
            const res = await classicSearch(query, filters);
            setResponse(res)
        } catch(error){
            console.log("[handleClassicSearch] Something went wrong!", error)
        } finally {
            setLoading(false)
        }
    }
    const handleVibeSearch = async (query, filters) => {
        setLoading(true)
        try{
            const res = await vibeSearch(query, filters);
            setResponse(res)
        } catch(error){
            console.log("[handleClassicSearch] Something went wrong!", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearchSubmit = async (query) => {
        console.log("[handleSearchSubmit]", query)

        query = query.trim()
        
        // validation BEFORE updating URL (important UX detail)
        if (searchMode === "vibe" && query.length < 3) {
            setSearchError("Query must be at least 3 characters!")
            return
        }

        const newFilters = {
            ...appliedFilters,
            query,
            mode: searchMode,
            page: 1,
        }

        setSearchError("")

        const params = buildSearchParams(newFilters)
        setSearchParams(params)          // <-- search param drives everything, change in search params will trigger search
        // performSearch(newFilters)     // This is commented as performSearch will be called whenever searchParams change using useEffect

    }
    
    // NOTE this was in useCallback before, removed it to check if performance reamins same
    const handleFilterApply = (dirtyFilters) => {
        console.log("[handleFilterApply]", dirtyFilters, "applied filter:", appliedFilters)

        const newFilters = {
            ...dirtyFilters,
            query: appliedFilters.query,
            mode: searchMode
        }
        const params = buildSearchParams(newFilters)
        setSearchParams(params)                // <-- search param drives everything, change in search params will update applied filters and trigger search

        if(!isLargeScreen){setFilterPanelOpen(false)}   // close filter panel
    }

    const handleResetFilters = () => {
        const f = resetFilters()
        const params = buildSearchParams(f)    
        setSearchParams(params)         // <-- search param drives everything, change in search params will update applied filters and trigger search
    }

    const handlePageChange = (page) => {
        console.log("[handlePageChange]", page)
        const newFilters = {
            ...appliedFilters,
           page: page
        }
        const params = buildSearchParams(newFilters)
        setSearchParams(params)
    }

    const scrollSearchBarIntoView = () => {
        // scrollIntoView moves the viewport to the element
        searchBarRef.current?.scrollIntoView({
            behavior: 'smooth', // Animates the scroll
            block: 'start',     // Aligns element to the top of the viewport
        });
    };

    return (
        <div className="flex flex-col">

            {/* ------------------------ Search Section --------------------- */}
            <div className="flex flex-col items-center px-3">
                <p className="max-w-70 sm:max-w-full lg:px-8 pt-3 text-center text-xl sm:text-2xl text-foreground/80 mt-1">
                    Find your next Asian drama by vibe, not just title.
                </p>

                <SearchModeSwitch
                    searchMode={searchMode}
                    setSearchMode={setSearchMode}
                    // searchMode={appliedFilters["mode"]}
                    // setSearchMode={val => updateFilter("mode", val)}
                    className="mt-6"
                />
                <div className="w-full pt-4" ref={searchBarRef}/>
                <SearchBar
                    placeholder={searchMode == "vibe" ? "Search by feeling, e.g. Heartwarming drama that feels like a warm hug" : "Search by title, e.g. Crash Landing on You"}
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
               transition-all duration-300 p-3
            `}>
                {/* ----------------------- Filter Panel ------------------------------- */}
                <FilterPanel
                    handleApply={handleFilterApply} resetFilters={handleResetFilters} appliedFilters={appliedFilters} filterConfig={filterConfig} 
                    variant={isLargeScreen?'desktop':'mobile'}
                    isOpen={isFilterPanelOpen} onOpenChange={setFilterPanelOpen}
                    searchMode={searchMode}
                />

                {/* ----------------------- Main section ------------------------------- */}
                <div className="grow shrink-0 min-w-0">

                    {/* -------- Top Filter Row --------- */}
                    <div className="px-2 py-2 flex gap-4 items-center min-w-0">
                        <Button onClick={() => setFilterPanelOpen(!isFilterPanelOpen)} size="sm">
                            <FilterIcon />
                            Filters
                        </Button>
                        <div className="grow flex items-center gap-3 min-w-0 w-full overflow-x-auto no-scrollbar py-2">
                            {filterCounts?.length>0 && <Chip className="capitalize border border-border cursor-pointer hover:bg-surface-secondary" onClick={handleResetFilters}><CloseIcon size={12}/>Clear All</Chip>}
                            {filterCounts.map((val, idx) => (
                                <FilterBadge key={val?.name} name={val?.name} count={val?.count}/>
                            ))}
                        </div>
                    </div>
                    {/* <pre className="text-xs p-5 h-20 overflow-y-auto border-2 border-border">
                        {JSON.stringify(appliedFilters, null, 2)}
                    </pre> */}

                    {/* -------- Actual Results Grid -------- */}
                    <div className="px-3 sm:px-5 mt-1 pb-6 transition-all duration-300">
                        {/* {response?.total != null && <div className="mb-3 text-muted text-sm text-right">{`${response.total} result${response.total > 1 ? 's' : ''} found`}</div>} */}
                        {response?.results && response.results.length == 0 && <div className="text-muted text-center">No results found!</div>}
                        
                        {loading && <LoadingSpinner/>}

                        {(response?.results?.length && response?.total > response?.limit && appliedFilters.mode==="classic") ? 
                            <PageNavigator 
                                page={appliedFilters.page || 1} 
                                setPage={handlePageChange} 
                                itemsPerPage={response.limit} 
                                total={response.total} 
                                showLabels={isLargeScreen}
                                className="mt-2 mb-3 pl-2"
                            />
                            :
                            <div className="mb-5"/>
                        }

                        <DramaGrid isFilterPanelOpen={isFilterPanelOpen && isLargeScreen}>
                            {response?.results?.map(drama => <DramaCard key={drama.slug} drama={drama} />)}
                        </DramaGrid>

                        {response?.results?.length > 0 && appliedFilters.mode==="classic" && 
                            <PageNavigator 
                                page={appliedFilters.page || 1} 
                                setPage={handlePageChange} 
                                itemsPerPage={response.limit} 
                                total={response.total} 
                                showLabels={isLargeScreen}
                                className="mt-6 pl-2"
                            />
                        }
                    
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

function FilterBadge({name, count}){
    return (
        <Badge.Anchor>
            <Chip className="capitalize border border-border">{name}</Chip>
            <Badge size="sm" color="warning">{count}</Badge>
        </Badge.Anchor>
    )
}