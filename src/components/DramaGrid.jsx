export default function DramaGrid({children}){
    return (
        <div className="
            grid
            grid-cols-[repeat(auto-fill,minmax(160px,200px))]
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5
            xl:grid-cols-6
            gap-4
            justify-center
        ">
            {children}
        </div>
    )
}
        // <div className="grid 
        //     grid-cols-[repeat(auto-fill,minmax(148px,1fr))] 
        //     sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] 
        //     xl:grid-cols-[repeat(auto-fill,minmax(190px,1fr))] 
        //     gap-2 sm:gap-4
        // ">
        //     {children}
        // </div>