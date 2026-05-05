import { memo, useCallback, useEffect, useMemo, useState, useRef, use } from "react"
import { Link, useSearchParams, createSearchParams  } from "react-router";
import { useQuery } from '@tanstack/react-query'
import { Separator, Button, Surface, Spinner, Chip, Badge, CloseIcon } from "@heroui/react";
import { Filter as FilterIcon, TrashIcon } from "lucide-react";

import { useFilters, buildQuery, buildSearchParams, parseParamsToFilters } from "../../hooks/useFilters"
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
    const latestQueryRef = useRef("");


    const { appliedFilters, setAppliedFilters, updateFilter, resetFilters, filterConfig, 
        // buildSearchParams, parseParamsToFilters, buildQuery, 
        getFilterCounts } = useFilters()
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

    const {data: response, isFetching: loading, error: queryError} = useQuery({
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
        if(searchMode == "vibe" && !latestQueryRef.current){
            console.log("handleFilterApply VIBE ERROR")
            setSearchError("Query must be at least 3 characters!")
            scrollSearchBarIntoView()
            // return;
        }
        else{
            console.log("handleFilterApply VIBE PASS")
            setSearchError("")
        }

        const newFilters = {
            ...dirtyFilters,
            // query: appliedFilters.query,
            query: latestQueryRef.current,  // get the latest query currently typed in the search bar
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
                    setSearchMode={(val)=>{setSearchMode(val);setSearchError("")}}
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
                    onQueryChange={(val) => {latestQueryRef.current = val}}
                />
                <Separator className="mt-6" />
            </div>

            {/* ------------------------ Results section ----------------------- */}
            <div className={`grow
               grid 
               ${!isLargeScreen? 'grid-cols-1': isFilterPanelOpen?'grid-cols-[320px_1fr]':'grid-cols-[0px_1fr]'}
               transition-all duration-300 mb-3 mt-5 px-0
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
                    <div className="mx-3 py-0 flex gap-4 items-center min-w-0">
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
                    <div className="mx-0 sm:mx-3 mt-4 pb-2 transition-all duration-300">
                        {!hasParams && 
                            <div className="flex flex-col gap-6 pt-2">
                                <HorizontalResults
                                    heading="Top KDramas"
                                    filters={{sort_by: "ranking", type: ["Drama"], country: ["South Korea"], sort_order: "asc", limit: 10}}
                                />
                                <HorizontalResults
                                    heading="Popular Titles"
                                    filters={{sort_by: "popularity", sort_order: "asc", limit: 10}}
                                />
                            </div>
                        }
                        {/* {response?.total != null && <div className="mb-3 text-muted text-sm text-right">{`${response.total} result${response.total > 1 ? 's' : ''} found`}</div>} */}
                        {response?.results && response.results.length == 0 && <div className="text-muted text-center">No results found!</div>}
                        
                        {loading && <LoadingSpinner/>}
                        {queryError && 
                            <div  className="p-1 mt-4 text-muted text-center max-w-lg">
                                Something went wrong! 
                                <div className="text-xs">{queryError.message}</div>
                            </div>
                        }

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

                        <DramaGrid isFilterPanelOpen={isFilterPanelOpen && isLargeScreen} className="mx-3">
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

function LoadingSpinner({size="lg", className=""}) {
    return (
        <div className={`flex justify-center items-center gap-4 p-1 mt-4 ${className}`}>
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

function HorizontalResults({heading, filters}) {
    
    const builtQuery = buildQuery(filters)
    const searchParams =(()=>{const r = {...filters}; delete r.limit; r.mode="classic"; return buildSearchParams(r)})()

    const {data: response, isFetching: loading, error} = useQuery({
        queryKey: ['landing-search', builtQuery],
        queryFn: () =>  classicSearch("", builtQuery),
        enabled: !!filters,   // only runs when there's something to search
        staleTime: Infinity,
    })


    return (
        // <div className="border-t border-b sm:border border-accent-soft rounded-none sm:rounded-xl bg-accent-soft">
        <div className="
            rounded-none sm:rounded-xl
            bg-linear-to-b from-surface dark:from-background-tertiary to-background
            min-h-60
        ">
            <div className="px-4 pt-2 flex justify-between items-center">
                {heading && <h1 className="text-xl font-semibold">{heading}</h1>}
                {searchParams && <Link to={{pathname: "/", search: `?${searchParams}`}} className="text-sm hover:underline leading-snug">View All</Link>}
            </div>
            
            {loading && <LoadingSpinner className="mt-8"/>}
            {error && 
                <div  className="p-1 mt-10 text-muted text-center w-full">
                    Something went wrong! 
                    <div className="text-xs">{error?.message}</div>
                </div>
            }
            <div className="
                flex gap-4 w-full overflow-auto p-4 justify-stretch 
                snap-x snap-mandatory scroll-px-3.5 no-scrollbar
            ">
                {response?.results?.map(drama => (
                    <DramaCard key={drama.slug} drama={drama} className="w-[180px] sm:w-[200px] shrink-0 snap-start" />
                ))}
                
            </div>
        </div>
    )
}