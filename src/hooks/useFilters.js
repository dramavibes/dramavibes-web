import { useEffect, useState } from "react"
import { getFilterOptions } from "../services/api"

import MultiSelectTags from "../pages/HomePage/MultiselectTags"
import MultiSelectCheckbox from "../pages/HomePage/MultiSelectCheckbox"
import MultiSelectAutocomplete from "../pages/HomePage/MultiSelectAutocomplete"
import RangeSlider from "../pages/HomePage/RangeSlider"
import RangeInput from "../pages/HomePage/RangeInput"
import SingleSelect from "../pages/HomePage/SingleSelect"


export const DEFAULT_FILTERS = {
    type: [],
    country: [],
    pacing: [],
    romance_level: [],
    comfort_level: [],
    emotional_weight: [],
    ending_type: [],

    genres: [],
    tones: [],
    platforms: [],

    runtime_range: [null, null],
    episodes_range: [null, null],
    rating_range: [0, 10],
    year_range: [2000, new Date().getFullYear()],

    sort_by: "rating",
    sort_order: "desc",

    mode: "vibe",
    query: ""
}

export const FILTER_CONFIG = {
    type: { type: "multiselect", component: MultiSelectTags },
    country: { type: "multiselect", component: MultiSelectCheckbox },
    pacing: { type: "multiselect", component: MultiSelectTags },
    romance_level: { type: "multiselect", component: MultiSelectTags },
    comfort_level: { type: "multiselect", component: MultiSelectTags },
    emotional_weight: { type: "multiselect", component: MultiSelectTags },
    ending_type: { type: "multiselect", component: MultiSelectTags },
    genres: { type: "multiselect", component: MultiSelectCheckbox },
    tones: { type: "multiselect", component: MultiSelectTags },
    platforms: { type: "multiselect", component: MultiSelectTags },

    runtime_range: { type: "range", component: RangeInput },
    episodes_range: { type: "range", component: RangeInput },
    rating_range: {
        type: "range",
        minValue: DEFAULT_FILTERS.rating_range[0],
        maxValue: DEFAULT_FILTERS.rating_range[1],
        step: 0.5,
        component: RangeSlider,
        componentProps: {
            step: 0.5
        }
    },
    year_range: {
        type: "range",
        minValue: DEFAULT_FILTERS.year_range[0],
        maxValue: DEFAULT_FILTERS.year_range[1],

        component: RangeSlider,
        componentProps: {
            step: 1
        }
    },

    sort_by: {
        type: "select",
        component: SingleSelect,
    },

    sort_order: {
        type: "select",
        component: SingleSelect,
        options: [{ id: "asc", name: "Ascending" }, { id: "desc", name: "Descending" }]
    },

    mode: {
        type: "value",
        // this is specially handled in home page with searhc mode selection, so no component needs to be passed here
    },
    query : {
        type: "value"
    }
}

export function useFilters() {
    const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS)
    const [filterConfig, setFilterConfig] = useState(null)

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                console.log("Fetching filter options ...")
                const res = await getFilterOptions()
                console.log("Got filter options: ", res)
                if (!res?.filter_options) {
                    console.error("filter_options not found!")
                    return;
                }

                // add the list of valid options for each filter into the config
                let config = { ...FILTER_CONFIG }
                for (const key in res.filter_options) {
                    const options = res.filter_options[key];
                    if (config[key]) {
                        config[key].options = options;
                    }
                }
                // console.log("FILTER CONFIG: ", config)
                setFilterConfig(config)

            } catch (error) {
                console.log("Unable to get filter options", error)
            }
        }
        fetchFilterOptions()
    }, [])

    const updateFilter = (key, value) => {
        setAppliedFilters(prev => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => setAppliedFilters(DEFAULT_FILTERS);


    const buildSearchParams = (filters) => {
        const params = new URLSearchParams();

        for (const key in FILTER_CONFIG) {
            const value = filters[key];
            const config = FILTER_CONFIG[key];

           if (value !== undefined && value !== null) {
                // 1. Range Handling (min,max)
                if (config.type === "range") {
                    const [min, max] = value;
                    // Only add to URL if at least one value exists
                    if ((min !== "" && min != null) || (max !== "" && max != null)) {
                        params.set(key, `${min},${max}`);
                    }
                }
                // 2. Multi-select Handling
                else if (config.type === "multiselect" && value.length > 0) {
                    params.set(key, value.join(","));
                }
                // 3. Select Handling (Single Value)
                else if ((config.type === "select" ||  config.type === "value") && value !== "") {
                    params.set(key, value);
                }
            }
        }

        // if (filters.sort_by) {
        //     params.set("sort", `${filters.sort_by}:${filters.sort_order}`);
        // }

        return params;
    };

    const parseParamsToFilters = (params) => {
        let filters = { ...DEFAULT_FILTERS };

        for (const key in FILTER_CONFIG) {
            const paramValue = params[key];
            const config = FILTER_CONFIG[key];

            if (paramValue) {
                if (config.type === "multiselect") {
                    filters[key] = paramValue.split(",");
                }
                // Parse Range: ensure it returns [string, string]
                else if (config.type === "range") {
                    const parts = paramValue.split(",");
                    filters[key] = [parts[0] || "", parts[1] || ""];
                }
                // Parse Select: single string
                else if (config.type === "select" || config.type === "value") {
                    filters[key] = paramValue;
                }
            }
        }
        return filters;
    };

    const buildQuery = (filters) => {
        let res = {}
        for(const key in filters){
            if(!(key in FILTER_CONFIG)){console.log("!!KEY:", key); continue}

            const type = FILTER_CONFIG[key].type
            const val = filters[key]
            
            if(type == "multiselect"){
                if(val?.length>0){
                    res[key] = val
                }
            }
            else if(type=="range"){
                const [gte, lte] = val
                let rangeVal = {}
                if(gte){rangeVal.gte = gte}
                if(lte){rangeVal.lte = lte}
                res[key] = rangeVal;
            }
            else if(type=="select"){
                res[key] = val
            }
        }
        return res;
    }

    return { appliedFilters, setAppliedFilters, updateFilter, resetFilters, filterConfig, buildSearchParams, parseParamsToFilters, buildQuery };

}