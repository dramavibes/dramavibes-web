export default function DramaGrid({children, isFilterPanelOpen, className=""}){
    return (
        <div className={`
            grid
            grid-cols-[repeat(2,minmax(150px,170px))]
            sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]
            gap-3 sm:gap-4
            justify-center
            ${className}
        `}>
            {children}
        </div>
    )
}

// grid-cols-[repeat(auto-fill,minmax(200px,280px))]