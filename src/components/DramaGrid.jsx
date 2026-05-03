export default function DramaGrid({children, isFilterPanelOpen, className=""}){
    return (
        <div className={`
            grid
            grid-cols-[repeat(auto-fill,minmax(200px,280px))]
            sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]
            gap-4
            justify-center
            ${className}
        `}>
            {children}
        </div>
    )
}