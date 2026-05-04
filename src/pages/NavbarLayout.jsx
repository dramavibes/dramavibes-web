import { useEffect, useState } from 'react'
import {Outlet} from 'react-router'
import { useWakeUp } from '../hooks/useWakeUp'
import { Spinner } from '@heroui/react'

import Navbar from '../components/Navbar'


export default function NavbarLayout(){
    const { isReady: isBackendReady, isWakingUp } = useWakeUp()

    return (
        <>
            <Navbar/>
            <main className='min-h-[calc(100vh-68px)] w-full bg-background grid grid-rows-1 text-foreground'>
                {isBackendReady ? 
                    <Outlet/>
                    :
                    <WakingUpBanner isWakingUp={isWakingUp} />
                }
            </main>
        </>
    )
}


function WakingUpBanner({isWakingUp}) {
    const [stageIndex, setStageIndex] = useState(0)
    const stages = ["Waking up", "Getting ready", "Almost there"]

    useEffect(() => {

        let timeout = setTimeout(() => setStageIndex(i => (i + 1) % stages.length), 20000)

        return () => clearTimeout(timeout)
    }, [])


    return (
        <div className='flex flex-1 flex-col items-center justify-center p-5 max-w-2xl mx-auto text-center'>
            {!isWakingUp?
                <Spinner/>
                :
                <>
                <h1 className='text-3xl animate-pulse mb-5 tracking-wide'>
                    {stages[stageIndex]} <span className='tracking-widest'>...</span>
                </h1>
                <p className='mt-5 text-muted'>
                    This app is hosted on a free platform that goes to sleep when inactive.
                    <br/>
                    It's waking up now. This may take up to a minute.
                </p>
                </>
            }
        </div>
    )
}