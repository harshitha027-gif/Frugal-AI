'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User, Globe, Link as LinkIcon, Save, Loader2, CheckCircle } from 'lucide-react'

export default function SettingsPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState(false)
    const [user, setUser] = useState<any>(null)

    const [formData, setFormData] = useState({
        full_name: '',
        avatar_url: '',
        website: ''
    })

    useEffect(() => {
        const getProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
                return
            }
            setUser(user)

            const { data: profile } = await supabase
                .from('profiles')
                .select('full_name, avatar_url, website')
                .eq('id', user.id)
                .single()

            if (profile) {
                setFormData({
                    full_name: profile.full_name || '',
                    avatar_url: profile.avatar_url || '',
                    website: profile.website || ''
                })
            }
            setLoading(false)
        }
        getProfile()
    }, [supabase, router])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setSaving(true)
        setSuccess(false)

        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: formData.full_name,
                avatar_url: formData.avatar_url,
                website: formData.website,
            })
            .eq('id', user.id)

        if (error) {
            console.error(error)
            alert('Error updating profile')
        } else {
            setSuccess(true)
            router.refresh()
            setTimeout(() => setSuccess(false), 3000)
        }
        setSaving(false)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-2xl">

                <div className="bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-white mb-2">Profile Settings</h1>
                        <p className="text-neutral-400">Update your public profile information.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">Display Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    placeholder="e.g. Pradeep"
                                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">Avatar URL</label>
                            <div className="relative">
                                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                <input
                                    type="url"
                                    name="avatar_url"
                                    value={formData.avatar_url}
                                    onChange={handleChange}
                                    placeholder="https://example.com/avatar.jpg"
                                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all opacity-80"
                                />
                            </div>
                            <p className="text-xs text-neutral-500 ml-1">Provide a direct link to an image file.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">Website / Portfolio</label>
                            <div className="relative">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    placeholder="https://your-portfolio.com"
                                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all opacity-80"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : success ? (
                                    <>
                                        <CheckCircle className="w-4 h-4" />
                                        Saved!
                                    </>
                                ) : (
                                    <>
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}
