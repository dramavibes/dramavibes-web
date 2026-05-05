import { useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import { useWakeUp } from '../hooks/useWakeUp'
import { Spinner } from '@heroui/react'

import { useLottie } from 'lottie-react'
import sleepingCat from "../assets/sleepingCat.json";

import Navbar from '../components/Navbar'


export default function NavbarLayout() {
    const { isReady: isBackendReady, isWakingUp } = useWakeUp()

    return (
        <>
            <Navbar />
            <main className='min-h-[calc(100vh-68px)] w-full bg-background grid grid-rows-1 text-foreground'>
                {isBackendReady ?
                    <Outlet />
                    :
                    <WakingUpBanner isWakingUp={isWakingUp} />
                }
            </main>
        </>
    )
}


// const SleepingCatAnimation = () => <Lottie animationData={sleepingCat} loop={true} />
const SleepingCatAnimation = ({ size = 180 }) => {
    const options = {
        animationData: sleepingCat,
        loop: true
    };

    const { View } = useLottie(options, { width: size, height: size });

    return <>{View}</>;
};

function WakingUpBanner({ isWakingUp }) {
    const [stageIndex, setStageIndex] = useState(0)
    const stages = ["Waking up", "Getting ready", "Almost there"]

    useEffect(() => {
        if (!isWakingUp) return
        if (stageIndex >= stages.length - 1) return   // stop at last stage

        const timeout = setTimeout(() => setStageIndex(i => i + 1), 20000)
        return () => clearTimeout(timeout)
    }, [stageIndex, isWakingUp])   // re-run each time stageIndex changes


    return (
        <div className='flex flex-1 flex-col items-center justify-center mb-30 p-8 max-w-lg mx-auto text-center'>
            {!isWakingUp ?
                <Spinner />
                :
                <>
                    <SleepingCatAnimation size={180} />
                    <div className='flex flex-col gap-2 -mt-5'>
                        <h1 className='text-2xl font-medium tracking-wide animate-pulse ml-4'>
                            {stages[stageIndex]}
                            <span className='tracking-widest'> ...</span>
                        </h1>
                        <p className='text-sm text-muted '>
                            This app is hosted on a free platform that goes to sleep when inactive.
                            <br />
                            It's waking up now. This may take up to a minute.
                        </p>
                    </div>
                </>

            }
        </div>
    )
}