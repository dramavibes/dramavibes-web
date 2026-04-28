export default function DramaGrid({children, isFilterPanelOpen, className=""}){
    return (
        <div className={`
            grid
            grid-cols-[repeat(auto-fill,minmax(200px,300px))]
            sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]
            gap-4
            justify-center
            ${className}
        `}>
            {children}
        </div>
    )
}
        



        // grid-cols-[repeat(auto-fill,minmax(160px,200px))]
        //     sm:grid-cols-3
        //     md:grid-cols-4
        //     ${isFilterPanelOpen? 
        //         'lg:grid-cols-4 xl:grid-cols-5':
        //         'lg:grid-cols-5 xl:grid-cols-6'
        //     }



// ======= even older ========

        // <div className="grid 
        //     grid-cols-[repeat(auto-fill,minmax(148px,1fr))] 
        //     sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] 
        //     xl:grid-cols-[repeat(auto-fill,minmax(190px,1fr))] 
        //     gap-2 sm:gap-4
        // ">
        //     {children}
        // </div>