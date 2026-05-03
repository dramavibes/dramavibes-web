import { useEffect, useState } from "react";

export function useTheme() {
    const [isDark, setIsDark] = useState(() => {
        return (localStorage.getItem("theme") || "dark") === "dark";
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add("dark");
            root.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            root.setAttribute("data-theme", "light");
            localStorage.setItem("theme", "light");
        }
    }, [isDark]);

    const toggle = () => setIsDark(prev => !prev);

    return { isDark, toggle };
}