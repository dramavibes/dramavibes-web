import { memo } from "react";

// using memo() so that each Filter Item only re-renders if its props change
// and not whenever parent state changes
const FilterItem = memo(({config, value, onChange, filterKey, className=""}) => {
        
    if(config.component == null || config.type == null) return null;
    
    const filter_type = config.type
    const Component = config.component
    const label = filterKey.replace("_", " ")

    if(filter_type == "multiselect"){

        return (
            <Component
                label={label} 
                options={config.options} 
                selected={value}
                setSelected={(val)=>onChange(filterKey, val)}
                className={className}
            />
        )
    }
    else if(filter_type == "range"){
        return (
            <Component
                label={label} 
                value={[value[0]==null?config.minValue:value[0], value[1]==null?config.maxValue:value[1]]}
                onChange={(val)=>onChange(filterKey, val)}
                className={className}
                minValue={config.minValue}
                maxValue={config.maxValue}
                {...config.componentProps}
            />
        )
    }
    else if(filter_type == "select"){
        return (
            <Component
                label={label} 
                options={config.options} 
                value={value}
                onChange={(val)=>onChange(filterKey, val)}
                className={className}
                {...config.componentProps}
            />
        )
    }
    
});

export default FilterItem;