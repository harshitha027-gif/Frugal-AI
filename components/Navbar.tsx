'use client'

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Menu, X, User, Settings, LogOut, Loader2, Moon, Sun } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { ThemeToggle } from "./theme-toggle"

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const [user, setUser] = React.useState<any>(null)
    const [loading, setLoading] = React.useState(true)
    const [isProfileOpen, setIsProfileOpen] = React.useState(false)

    // Search State
    const [showSearch, setShowSearch] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState('')

    const router = useRouter()
    const supabase = createClient()
    const searchInputRef = React.useRef<HTMLInputElement>(null)

    // Handle scroll effect
    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Focus input when shown
    React.useEffect(() => {
        if (showSearch && searchInputRef.current) {
            searchInputRef.current.focus()
        }
    }, [showSearch])

    // Check auth state
    React.useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            setLoading(false)
        }

        checkUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        setUser(null)
        setIsProfileOpen(false)
        router.push('/')
        router.refresh()
    }

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!searchQuery.trim()) return

        router.push(`/tools?q=${encodeURIComponent(searchQuery)}`)
        setShowSearch(false)
        setSearchQuery('')
    }

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isOpen
                ? "bg-background/80 backdrop-blur-md border-b border-border py-4"
                : "bg-transparent py-6"
                }`}
        >
            <div className="container mx-auto px-6 lg:px-12 max-w-7xl flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all duration-300">
                        F
                    </div>
                    <span className="text-xl font-bold text-foreground tracking-tight">
                        Frugal <span className="text-emerald-500">AI</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className={`hidden md:flex items-center gap-8 ${showSearch ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-200`}>
                    <Link
                        href="/tools"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Tools
                    </Link>
                    <Link
                        href="/leaderboard"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Leaderboard
                    </Link>
                    <Link
                        href="/submit"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Submit
                    </Link>
                    <Link
                        href="/docs"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Documentation
                    </Link>
                </div>

                {/* Centered Search Bar Overlay */}
                <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg px-6 ${showSearch ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-all duration-200`}>
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onBlur={() => !searchQuery && setShowSearch(false)}
                            placeholder="Search models, tools, agents..."
                            className="w-full bg-card border border-border rounded-full pl-12 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-emerald-500/50 shadow-2xl"
                        />
                        <button
                            type="button"
                            onClick={() => setShowSearch(false)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </form>
                </div>


                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    {!showSearch && (
                        <button
                            onClick={() => setShowSearch(true)}
                            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-foreground/5"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    )}

                    <ThemeToggle />

                    {loading ? (
                        <div className="w-8 h-8 flex items-center justify-center">
                            <Loader2 className="w-4 h-4 animate-spin text-neutral-500" />
                        </div>
                    ) : user ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center hover:border-emerald-500/50 transition-colors focus:outline-none"
                            >
                                {user.user_metadata?.avatar_url ? (
                                    <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <span className="text-sm font-semibold text-foreground">
                                        {user.email?.[0].toUpperCase() || 'U'}
                                    </span>
                                )}
                            </button>

                            {/* Profile Dropdown */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2">
                                    <div className="px-4 py-3 border-b border-border">
                                        <p className="text-xs text-muted-foreground">Signed in as</p>
                                        <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{user.email}</p>
                                    </div>

                                    <div className="py-1">
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <User className="w-4 h-4" />
                                            Profile
                                        </Link>
                                        <Link
                                            href="/settings"
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <Settings className="w-4 h-4" />
                                            Settings
                                        </Link>
                                    </div>

                                    <div className="pt-1 mt-1 border-t border-white/5">
                                        <button
                                            onClick={handleSignOut}
                                            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Log Out
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Backdrop to close dropdown */}
                            {isProfileOpen && (
                                <div className="fixed inset-0 z-[-1]" onClick={() => setIsProfileOpen(false)} />
                            )}
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-accent border border-border rounded-full transition-all"
                            >
                                <User className="w-4 h-4" />
                                Sign In
                            </Link>
                            <Link
                                href="/login?view=signup"
                                className="px-5 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary-dark rounded-full transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 text-muted-foreground hover:text-foreground"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 bg-background border-b border-border p-6 md:hidden flex flex-col gap-4 shadow-2xl">
                    {/* Mobile Search */}
                    <form onSubmit={handleSearchSubmit} className="relative mb-2">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="w-full bg-muted border border-border rounded-full pl-12 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-emerald-500/50"
                        />
                    </form>

                    <Link
                        href="/tools"
                        className="text-base font-medium text-muted-foreground hover:text-foreground py-2"
                        onClick={() => setIsOpen(false)}
                    >
                        Tools
                    </Link>
                    <Link
                        href="/leaderboard"
                        className="text-base font-medium text-muted-foreground hover:text-foreground py-2"
                        onClick={() => setIsOpen(false)}
                    >
                        Leaderboard
                    </Link>
                    <Link
                        href="/submit"
                        className="text-base font-medium text-muted-foreground hover:text-foreground py-2"
                        onClick={() => setIsOpen(false)}
                    >
                        Submit Tool
                    </Link>
                    <Link
                        href="/docs"
                        className="text-base font-medium text-muted-foreground hover:text-foreground py-2"
                        onClick={() => setIsOpen(false)}
                    >
                        Documentation
                    </Link>

                    <div className="h-px bg-white/10 my-2" />

                    {user ? (
                        <>
                            <Link
                                href="/profile"
                                className="flex items-center gap-2 text-base font-medium text-muted-foreground hover:text-foreground py-2"
                                onClick={() => setIsOpen(false)}
                            >
                                <User className="w-4 h-4" />
                                Profile
                            </Link>
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-2 w-full text-left text-base font-medium text-red-500 py-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Log Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="flex items-center justify-center w-full py-3 text-sm font-medium text-foreground bg-muted rounded-lg"
                                onClick={() => setIsOpen(false)}
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/login?view=signup"
                                className="flex items-center justify-center w-full py-3 text-sm font-medium text-primary-foreground bg-primary rounded-lg"
                                onClick={() => setIsOpen(false)}
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    )
}
