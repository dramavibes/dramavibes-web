import { useState, useEffect } from "react"
import { checkHealth } from "../services/api"

export function useWakeUp() {
    const [isReady, setIsReady] = useState(false)
    const [isWakingUp, setIsWakingUp] = useState(false)

    useEffect(() => {
        let timer = null;

        const ping = async () => {
            try {
                await checkHealth()
                setIsReady(true)
                setIsWakingUp(false)
                console.log("Backend ping successful ...")
            } catch (error) {
                // failed — backend is sleeping, keep polling
                setIsWakingUp(true)
                timer = setTimeout(() => ping(), 5000)  // retry every 5s
            }
        }

        ping()
        return () => { if(timer!=null) clearTimeout(timer); }  // cleanup 
    }, [])

    return { isReady, isWakingUp }
}