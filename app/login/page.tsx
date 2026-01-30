'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Github, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function AuthForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const supabase = createClient()

    // Determine initial mode from URL, default to 'login'
    const initialView = searchParams.get('view') === 'signup' ? 'signup' : 'login'

    const [mode, setMode] = useState<'login' | 'signup'>(initialView)
    const [authMethod, setAuthMethod] = useState<'password' | 'magic'>('password')

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    // Update mode if URL changes
    useEffect(() => {
        const view = searchParams.get('view')
        if (view === 'signup') setMode('signup')
        else if (view === 'login') setMode('login')
    }, [searchParams])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        let error = null

        if (authMethod === 'magic') {
            const res = await supabase.auth.signInWithOtp({
                email,
                options: { emailRedirectTo: `${location.origin}/auth/callback?next=/profile` },
            })
            error = res.error
            if (!error) setMessage('Check your email for the magic link!')
        } else {
            const res = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            error = res.error
            if (!error) {
                router.push('/profile')
                router.refresh()
            }
        }

        if (error) {
            setMessage('Error: ' + error.message)
        }
        setLoading(false)
    }

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback?next=/profile`,
                data: {
                    full_name: fullName,
                    avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${fullName}`,
                },
            },
        })

        if (error) {
            setMessage('Error: ' + error.message)
        } else {
            setMessage('Signup successful! Check your email to confirm.')
        }
        setLoading(false)
    }

    const handleGithubLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: `${location.origin}/auth/callback?next=/profile`,
            },
        })
    }

    const toggleMode = (newMode: 'login' | 'signup') => {
        setMode(newMode)
        // Update URL without reloading
        const newUrl = newMode === 'signup' ? '/login?view=signup' : '/login'
        router.replace(newUrl)
        setMessage('')
    }

    return (
        <div className="w-full max-w-md mx-auto relative z-10">
            {/* Glass Container */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">

                {/* Tab Switcher */}
                <div className="flex p-1 bg-black/40 rounded-lg mb-8 border border-white/5">
                    <button
                        type="button"
                        onClick={() => toggleMode('login')}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'login'
                            ? 'bg-white/10 text-white shadow-sm'
                            : 'text-neutral-400 hover:text-white'
                            }`}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        onClick={() => toggleMode('signup')}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'signup'
                            ? 'bg-white/10 text-white shadow-sm'
                            : 'text-neutral-400 hover:text-white'
                            }`}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">
                        {mode === 'login' ? 'Welcome back' : 'Create an account'}
                    </h1>
                    <p className="text-neutral-400 text-sm">
                        {mode === 'login'
                            ? 'Enter your credentials to access your account'
                            : 'Join thousands of developers building efficient AI'
                        }
                    </p>
                </div>

                {/* GitHub Button */}
                <button
                    type="button"
                    onClick={handleGithubLogin}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white text-black font-medium rounded-lg hover:bg-neutral-200 transition-colors mb-6"
                >
                    <Github className="w-5 h-5" />
                    <span>Continue with GitHub</span>
                </button>

                {/* Divider */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-[#111] px-2 text-neutral-500">Or continue with</span>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={mode === 'login' ? handleLogin : handleSignUp} className="space-y-4">

                    {/* Full Name (Signup only) */}
                    {mode === 'signup' && (
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-neutral-400 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-sm"
                                />
                            </div>
                        </div>
                    )}

                    {/* Email */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-neutral-400 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-sm"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    {(mode === 'signup' || authMethod === 'password') && (
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-neutral-400 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required={authMethod === 'password'}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-sm"
                                />
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {mode === 'signup' ? 'Create Account' : (authMethod === 'magic' ? 'Send Magic Link' : 'Sign In')}
                        {!loading && <ArrowRight className="w-4 h-4" />}
                    </button>

                    {/* Magic Link Toggle (Login only) */}
                    {mode === 'login' && (
                        <button
                            type="button"
                            onClick={() => setAuthMethod(authMethod === 'password' ? 'magic' : 'password')}
                            className="w-full text-center text-xs text-emerald-500 hover:text-emerald-400 mt-2"
                        >
                            {authMethod === 'password' ? 'Use Magic Link instead' : 'Use Password instead'}
                        </button>
                    )}
                </form>

                {/* Message */}
                {message && (
                    <div className={`mt-6 p-3 rounded-lg text-sm text-center border ${message.startsWith('Error')
                        ? 'bg-red-500/10 border-red-500/20 text-red-400'
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        }`}>
                        {message}
                    </div>
                )}
            </div>

            {/* Background elements to match theme */}
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-emerald-500/20 rounded-full blur-[80px] -z-10 pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-teal-500/20 rounded-full blur-[80px] -z-10 pointer-events-none" />
        </div>
    )
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 py-12 relative overflow-hidden">
            {/* Background spotlight effect */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-[#0a0a0a] to-[#0a0a0a] z-0" />

            <Suspense fallback={<div className="text-white">Loading...</div>}>
                <AuthForm />
            </Suspense>
        </div>
    )
}

