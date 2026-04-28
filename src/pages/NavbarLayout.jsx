import {Outlet} from 'react-router'
import Navbar from '../components/Navbar'

export default function NavbarLayout(){

    return (
        <>
            <Navbar/>
            <main className='min-h-[calc(100vh-68px)] w-full bg-background grid grid-rows-1 text-foreground'>
                <Outlet/>
            </main>
        </>
    )
}