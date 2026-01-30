'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import { Upload, CheckCircle, Clock, Users, ChevronDown, Loader2, Sparkles, AlertCircle, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditToolPage() {
    const router = useRouter()
    const params = useParams()
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [categories, setCategories] = useState<any[]>([])
    const [user, setUser] = useState<any>(null)
    const [error, setError] = useState('')
    const [toolId, setToolId] = useState('')

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        tagline: '',
        description: '',
        url: '',
        category_id: '',
        pricing_model: 'Free',
        carbon_score: 50,
    })

    // Fetch Data
    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }
            setUser(user)

            // Fetch Categories
            const { data: categoriesData } = await supabase.from('categories').select('id, name')
            if (categoriesData) setCategories(categoriesData)

            // Fetch Tool
            const slug = params.slug as string
            const { data: tool } = await supabase
                .from('tools')
                .select('*')
                .eq('slug', slug)
                .single()

            if (!tool) {
                router.push('/profile')
                return
            }

            // Check Ownership
            if (tool.owner_id !== user.id) {
                router.push('/')
                return
            }

            setToolId(tool.id)
            setFormData({
                name: tool.name,
                tagline: tool.tagline,
                description: tool.description,
                url: tool.url,
                category_id: tool.category_id,
                pricing_model: tool.pricing_model || 'Free',
                carbon_score: tool.carbon_score,
            })
            setLoading(false)
        }
        init()
    }, [supabase, router, params.slug])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleCarbonScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, carbon_score: parseInt(e.target.value) }))
    }

    const handlePricingChange = (model: string) => {
        setFormData(prev => ({ ...prev, pricing_model: model }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        setError('')

        const { error } = await supabase
            .from('tools')
            .update({
                name: formData.name,
                tagline: formData.tagline,
                description: formData.description,
                url: formData.url,
                category_id: formData.category_id,
                pricing_model: formData.pricing_model,
                carbon_score: formData.carbon_score,
                status: 'PENDING', // Re-trigger review on edit
            })
            .eq('id', toolId)

        if (error) {
            console.error(error)
            setError(error.message)
            setSubmitting(false)
        } else {
            router.push('/profile')
        }
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
            <div className="container mx-auto px-6 max-w-4xl">

                <Link href="/profile" className="inline-flex items-center text-neutral-400 hover:text-white mb-8 transition-colors gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Profile
                </Link>

                <div className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Edit Tool</h1>
                        <p className="text-neutral-400">Update your tool's information. Significant changes may require re-approval.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300 ml-1">Tool Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300 ml-1">Short Description</label>
                                <input
                                    type="text"
                                    name="tagline"
                                    value={formData.tagline}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300 ml-1">Full Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none leading-relaxed"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300 ml-1">Website URL</label>
                                <input
                                    type="url"
                                    name="url"
                                    value={formData.url}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-300 ml-1">Category</label>
                                    <div className="relative">
                                        <select
                                            name="category_id"
                                            value={formData.category_id}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 appearance-none cursor-pointer"
                                        >
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id} className="bg-[#111]">{cat.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-300 ml-1">Pricing Model</label>
                                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                                        {['Free', 'Freemium', 'Paid'].map((model) => (
                                            <button
                                                key={model}
                                                type="button"
                                                onClick={() => handlePricingChange(model)}
                                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${formData.pricing_model === model
                                                        ? 'bg-emerald-500 text-black shadow-lg'
                                                        : 'text-neutral-400 hover:text-white'
                                                    }`}
                                            >
                                                {model}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-white">Carbon Efficiency Score</label>
                                    <span className={`text-sm font-bold px-3 py-1 rounded-full border ${formData.carbon_score > 70 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                            formData.carbon_score > 40 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                                'bg-red-500/20 text-red-400 border-red-500/30'
                                        }`}>
                                        {formData.carbon_score}/100
                                    </span>
                                </div>
                                <div className="relative h-2 bg-neutral-800 rounded-full mt-2">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500 rounded-full"
                                        style={{ width: '100%' }}
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="1"
                                        value={formData.carbon_score}
                                        onChange={handleCarbonScoreChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div
                                        className="absolute top-1/2 w-5 h-5 bg-white rounded-full shadow-lg pointer-events-none transition-all transform -translate-x-1/2 -translate-y-1/2"
                                        style={{ left: `${formData.carbon_score}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 py-4 text-base font-bold rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Update Tool
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
