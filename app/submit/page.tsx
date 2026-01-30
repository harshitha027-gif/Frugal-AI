'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Upload, CheckCircle, Clock, Users, ChevronDown, Loader2, Sparkles, AlertCircle } from 'lucide-react'

export default function SubmitToolPage() {
    const router = useRouter()
    const supabase = createClient()

    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [categories, setCategories] = useState<any[]>([])
    const [user, setUser] = useState<any>(null)
    const [error, setError] = useState('')
    const [importRepo, setImportRepo] = useState('')
    const [importing, setImporting] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        tagline: '', // Short Description
        description: '', // Full Description
        url: '',
        category_id: '',
        pricing_model: 'Free',
        carbon_score: 50, // Default mid value
    })

    // Fetch Categories and User
    useEffect(() => {
        const init = async () => {
            setLoading(true)
            // Check User
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login?redirect=/submit')
                return
            }
            setUser(user)

            // Fetch Categories
            const { data: categoriesData } = await supabase
                .from('categories')
                .select('id, name')

            if (categoriesData) {
                setCategories(categoriesData)
                if (categoriesData.length > 0) {
                    setFormData(prev => ({ ...prev, category_id: categoriesData[0].id }))
                }
            }
            setLoading(false)
        }
        init()
    }, [supabase, router])

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

    const handleImport = async () => {
        if (!importRepo) return
        setImporting(true)
        setError('')

        try {
            const res = await fetch('/api/ingest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ repoId: importRepo })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to import')
            }

            setFormData(prev => ({
                ...prev,
                name: data.name,
                tagline: data.tagline,
                description: data.description,
                url: data.url
            }))
        } catch (err: any) {
            setError(err.message)
        } finally {
            setImporting(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return
        setSubmitting(true)
        setError('')

        // Creating slug from name
        const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000)

        const { error } = await supabase
            .from('tools')
            .insert({
                name: formData.name,
                tagline: formData.tagline,
                description: formData.description,
                url: formData.url,
                category_id: formData.category_id,
                pricing_model: formData.pricing_model,
                carbon_score: formData.carbon_score,
                owner_id: user.id,
                slug: slug,
                status: 'PENDING', // Default to pending approval
                views: 0
            })

        if (error) {
            console.error(error)
            setError(error.message)
            setSubmitting(false)
        } else {
            // Success redirect
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
        <div className="min-h-screen bg-[#0a0a0a] text-white pt-36 pb-20">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Left Column - Info (Sticky) */}
                    <div className="lg:sticky lg:top-32 space-y-12">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-sm font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <Sparkles className="w-4 h-4" />
                                <span>Contribute to the Community</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
                                Submit Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
                                    Frugal AI Tool
                                </span>
                            </h1>

                            <p className="text-lg text-neutral-400 leading-relaxed max-w-lg">
                                Join our growing ecosystem of efficient AI solutions. Share your tool with thousands of developers and researchers optimize for performance and sustainability.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex gap-5 items-start">
                                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#111] border border-white/5 flex items-center justify-center shadow-lg group">
                                    <Users className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Reach Thousands</h3>
                                    <p className="text-neutral-400 leading-relaxed text-sm">
                                        Get your tool in front of developers actively searching for efficient AI solutions.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-5 items-start">
                                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#111] border border-white/5 flex items-center justify-center shadow-lg group">
                                    <CheckCircle className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Community Verified</h3>
                                    <p className="text-neutral-400 leading-relaxed text-sm">
                                        Our team reviews each submission to ensure quality and relevance for the frugal AI ecosystem.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-5 items-start">
                                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#111] border border-white/5 flex items-center justify-center shadow-lg group">
                                    <Clock className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Quick Review</h3>
                                    <p className="text-neutral-400 leading-relaxed text-sm">
                                        Most submissions are reviewed within 24-48 hours. You'll be notified via email.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Form */}
                    <div className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">

                        {/* Auto-Import Banner */}
                        <div className="mb-8 p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-emerald-400" />
                                Auto-Import from Hugging Face or GitHub
                            </h3>
                            <p className="text-sm text-neutral-400 mb-4">
                                Enter a Hugging Face Repo ID (e.g. <code>TheBloke/Mistral...</code>) or a GitHub URL.
                            </p>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Repo ID or GitHub URL"
                                    value={importRepo}
                                    onChange={(e) => setImportRepo(e.target.value)}
                                    className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                                />
                                <button
                                    type="button"
                                    onClick={handleImport}
                                    disabled={importing || !importRepo}
                                    className="px-4 py-2 bg-emerald-500 text-black text-sm font-bold rounded-xl hover:bg-emerald-400 disabled:opacity-50 transition-colors"
                                >
                                    {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Import'}
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300 ml-1">Tool Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. TinyLlama-1.1B"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300 ml-1">Short Description <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="tagline"
                                    value={formData.tagline}
                                    onChange={handleChange}
                                    placeholder="Compact 1.1B parameter model trained on 3T tokens."
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300 ml-1">Full Description <span className="text-red-500">*</span></label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    placeholder="Detailed info about the tool, its features, use cases, and why it's frugal..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none leading-relaxed"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300 ml-1">Website / Repository URL <span className="text-red-500">*</span></label>
                                <input
                                    type="url"
                                    name="url"
                                    value={formData.url}
                                    onChange={handleChange}
                                    placeholder="https://github.com/..."
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-300 ml-1">Category <span className="text-red-500">*</span></label>
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

                            {/* Carbon Score Slider */}
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <label className="text-sm font-medium text-white">
                                            Carbon Efficiency Score
                                        </label>
                                    </div>
                                    <span className={`text-sm font-bold px-3 py-1 rounded-full border ${formData.carbon_score > 70 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                        formData.carbon_score > 40 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                            'bg-red-500/20 text-red-400 border-red-500/30'
                                        }`}>
                                        {formData.carbon_score} / 100
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
                                        className="absolute top-1/2 w-5 h-5 bg-white border-2 border-primary rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none transition-all transform -translate-x-1/2 -translate-y-1/2"
                                        style={{ left: `${formData.carbon_score}%` }}
                                    />
                                </div>
                                <p className="text-xs text-neutral-500">
                                    Slide to estimate the carbon efficiency (0 = High Impact, 100 = Extremely Efficient).
                                </p>
                            </div>

                            {error && (
                                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 text-base font-bold rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform active:scale-[0.99]"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Submit Tool
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
