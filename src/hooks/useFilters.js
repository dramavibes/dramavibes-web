import { useEffect, useState } from "react"
import { getFilterOptions } from "../services/api"

import MultiSelectTags from "../pages/HomePage/MultiselectTags"
import MultiSelectCheckbox from "../pages/HomePage/MultiSelectCheckbox"


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
    rating_range: [null, null],
    year_range: [null, null],

    sort_by: "rating",
    sort_order: "desc"
}

export const FILTER_CONFIG = {
    type: { type: "multiselect", component: MultiSelectTags },
    country: { type: "multiselect", component: MultiSelectCheckbox },
    romance_level: { type: "multiselect", component: MultiSelectTags },
    comfort_level: { type: "multiselect", component: MultiSelectTags },
    emotional_weight: { type: "multiselect", component: MultiSelectTags },
    ending_type: { type: "multiselect", component: MultiSelectTags },
    genres: { type: "multiselect", component: MultiSelectCheckbox },
    tones: { type: "multiselect", component: MultiSelectTags },
    platforms: { type: "multiselect", component: MultiSelectTags },

    runtime_range: { type: "range" },
    episodes_range: { type: "range" },
    rating_range: { type: "range" },
    year_range: { type: "range" },
}

export function useFilters() {
    const [filters, setFilters] = useState(DEFAULT_FILTERS)
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
                console.log("FILTER CONFIG: ", config)
                setFilterConfig(config)

            } catch (error) {
                console.log("Unable to get filter options", error)
            }
        }
        fetchFilterOptions()
    }, [])

    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => setFilters(DEFAULT_FILTERS);

    return { filters, setFilters, updateFilter, resetFilters, filterConfig };

}