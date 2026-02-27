"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="p-2 w-9 h-9" />
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 text-neutral-400 hover:text-white transition-colors rounded-full hover:bg-white/5 flex items-center justify-center focus:outline-none dark:hover:bg-white/5 light:hover:bg-black/5"
            aria-label="Toggle theme"
        >
            {theme === "dark" ? (
                <Sun className="w-5 h-5 transition-all" />
            ) : (
                <Moon className="w-5 h-5 transition-all text-neutral-600 hover:text-black" />
            )}
        </button>
    )
}
