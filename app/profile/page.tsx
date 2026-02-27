'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Edit, Trash2, Eye, Plus, Settings, Globe, MapPin } from 'lucide-react'

export default function ProfilePage() {
    const router = useRouter()
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [tools, setTools] = useState<any[]>([])
    const [deletingId, setDeletingId] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
                return
            }
            setUser(user)

            // Fetch Profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()
            setProfile(profileData)

            // Fetch User's Tools
            const { data: toolsData } = await supabase
                .from('tools')
                .select('*, categories(name)')
                .eq('owner_id', user.id)
                .order('created_at', { ascending: false })

            setTools(toolsData || [])
            setLoading(false)
        }
        fetchData()
    }, [supabase, router])

    const handleDelete = async (toolId: string) => {
        if (!confirm('Are you sure you want to delete this tool? This action cannot be undone.')) return

        setDeletingId(toolId)
        const { error } = await supabase
            .from('tools')
            .delete()
            .eq('id', toolId)

        if (error) {
            alert('Error deleting tool')
            console.error(error)
        } else {
            setTools(tools.filter(t => t.id !== toolId))
        }
        setDeletingId(null)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-7xl">

                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16">
                    <div className="w-32 h-32 rounded-full border-4 border-emerald-500/20 overflow-hidden bg-neutral-900 flex-shrink-0">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl text-neutral-500 font-bold">
                                {user.email?.[0].toUpperCase()}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-foreground mb-2">{profile?.full_name || 'Anonymous Creator'}</h1>
                        <p className="text-muted-foreground mb-4">{user.email}</p>

                        {profile?.website && (
                            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors text-sm mb-6">
                                <Globe className="w-4 h-4" />
                                {new URL(profile.website).hostname}
                            </a>
                        )}

                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <Link
                                href="/settings"
                                className="px-5 py-2 text-sm font-medium border border-border rounded-full hover:bg-muted transition-colors flex items-center gap-2"
                            >
                                <Settings className="w-4 h-4" />
                                Edit Profile
                            </Link>
                            <Link
                                href="/submit"
                                className="px-5 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary-dark transition-colors flex items-center gap-2 font-bold shadow-lg shadow-primary/20"
                            >
                                <Plus className="w-4 h-4" />
                                Submit New Tool
                            </Link>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-2xl p-6 min-w-[200px] text-center">
                        <p className="text-sm text-muted-foreground mb-1">Total Views</p>
                        <p className="text-3xl font-bold text-foreground">
                            {tools.reduce((acc, curr) => acc + (curr.views || 0), 0).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Tools Grid */}
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-foreground">
                    Your Tools <span className="text-sm font-normal text-muted-foreground bg-muted px-3 py-1 rounded-full">{tools.length}</span>
                </h2>

                {tools.length === 0 ? (
                    <div className="text-center py-20 bg-card border border-border rounded-3xl border-dashed">
                        <p className="text-muted-foreground mb-6">You haven't submitted any tools yet.</p>
                        <Link href="/submit" className="px-6 py-3 bg-foreground text-background font-bold rounded-full hover:bg-muted transition-colors">
                            Submit your first tool
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tools.map(tool => (
                            <div key={tool.id} className="bg-card border border-border rounded-3xl p-6 relative group hover:border-primary/20 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-xs font-medium text-muted-foreground">
                                        {tool.categories?.name}
                                    </div>
                                    <div className={`px-2.5 py-1 rounded-full border text-xs font-bold ${tool.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                        'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                        }`}>
                                        {tool.status}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-foreground mb-2">{tool.name}</h3>
                                <p className="text-muted-foreground text-sm mb-6 line-clamp-2 min-h-[40px]">
                                    {tool.tagline}
                                </p>

                                <div className="flex items-center justify-between pt-6 border-t border-border">
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm font-mono">
                                        <Eye className="w-4 h-4" />
                                        {tool.views || 0}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/tool/${tool.slug}`}
                                            className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                            title="View Page"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            href={`/tool/${tool.slug}/edit`}
                                            className="p-2 text-neutral-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                            title="Edit Tool"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(tool.id)}
                                            disabled={deletingId === tool.id}
                                            className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                                            title="Delete Tool"
                                        >
                                            {deletingId === tool.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
