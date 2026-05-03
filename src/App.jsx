import './App.css'
import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Routes, Route } from "react-router";
import NavbarLayout from './pages/NavbarLayout';
import HomePage from './pages/HomePage/HomePage'
import DetailPage from './pages/DetailPage'
import { useWakeUp } from "./hooks/useWakeUp"



const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,      // cache stays "fresh" forever
            gcTime: 1000 * 60 * 30,    // keep unused cache for 30 minutes
        }
    }
})

function App() {
    const { isReady: isBackendReady, isWakingUp } = useWakeUp()

    return (
        <QueryClientProvider client={queryClient}>
            <Routes>
                <Route element={<NavbarLayout />}>
                    <Route index element={isBackendReady ? <HomePage /> : <WakingUpBanner isWakingUp={isWakingUp} />} />
                    <Route path="title/:slug" element={<DetailPage />} />
                </Route>
            </Routes>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}

export default App


function WakingUpBanner({isWakingUp}) {
    const [stageIndex, setStageIndex] = useState(0)
    const stages = ["Waking up", "Stretching", "Getting ready", "Almost there"]

    useEffect(() => {

        let timeout = setTimeout(() => setStageIndex(i => (i + 1) % stages.length), 15000)

        return () => clearTimeout(timeout)
    }, [])

    if(!isWakingUp){return <div></div>}
    return (
        <div className='flex flex-1 flex-col items-center justify-center p-5 max-w-2xl mx-auto text-center'>
            <h1 className='text-4xl animate-pulse mb-5 tracking-wide'>
                {stages[stageIndex]} <span className='tracking-widest'>...</span>
            </h1>
            <p className='mt-5 text-muted'>
                This app is hosted on a free platform that goes to sleep when inactive.
                <br/>
                It's waking up now. This may take up to a minute.
            </p>
        </div>
    )
}