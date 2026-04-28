import { useState, useEffect } from "react";

export function useIsLargeScreen() {
    const [isLarge, setIsLarge] = useState(false);

    useEffect(() => {
        const media = window.matchMedia("(min-width: 1024px)"); // 'lg' breakpoint
        setIsLarge(media.matches);
        const listener = (e) => setIsLarge(e.matches);
        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
    }, []);

    return isLarge;
}