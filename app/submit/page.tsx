'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Upload, CheckCircle, Clock, Users, ChevronDown, Loader2, Sparkles, AlertCircle } from 'lucide-react'
import { ToolForm } from '@/components/forms/ToolForm'

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

    // New State for Analysis
    const [analysisData, setAnalysisData] = useState<any>(null)

    const [step, setStep] = useState<'import' | 'form'>('import')

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
                name: data.name || '',
                tagline: data.tagline || '',
                description: data.description || '',
                url: data.url || ''
            }))

            // Set Analysis Data
            if (data.analysis) {
                setAnalysisData(data.analysis)
            }

            // Move to next step
            setStep('form')

        } catch (err: any) {
            setError(err.message)
        } finally {
            setImporting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground pt-36 pb-20">
            <div className="container mx-auto px-6 max-w-7xl">

                {step === 'import' ? (
                    /* STEP 1: Import / Selection View (Split Layout) */
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start animate-in fade-in slide-in-from-bottom-4 duration-700">

                        {/* Left Column - Info (Sticky) */}
                        <div className="lg:sticky lg:top-32 space-y-12">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
                                    <Sparkles className="w-4 h-4" />
                                    <span>Contribute to the Community</span>
                                </div>

                                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
                                    Submit Your <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
                                        Frugal AI Tool
                                    </span>
                                </h1>

                                <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                                    Join our growing ecosystem of efficient AI solutions. Share your tool with thousands of developers and researchers optimize for performance and sustainability.
                                </p>
                            </div>

                            <div className="space-y-8">
                                <div className="flex gap-5 items-start">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center shadow-lg group">
                                        <Users className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Reach Thousands</h3>
                                        <p className="text-muted-foreground leading-relaxed text-sm">
                                            Get your tool in front of developers actively searching for efficient AI solutions.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-5 items-start">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center shadow-lg group">
                                        <CheckCircle className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Community Verified</h3>
                                        <p className="text-muted-foreground leading-relaxed text-sm">
                                            Our team reviews each submission to ensure quality and relevance for the frugal AI ecosystem.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-5 items-start">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center shadow-lg group">
                                        <Clock className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Quick Review</h3>
                                        <p className="text-muted-foreground leading-relaxed text-sm">
                                            Most submissions are reviewed within 24-48 hours. You'll be notified via email.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Import Form */}
                        <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
                            {/* Gradient Background Effect */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2" />

                            <div className="space-y-8">
                                <div className="text-center space-y-2 mb-8">
                                    <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border">
                                        <Sparkles className="w-8 h-8 text-emerald-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-foreground">Let's start with your tool</h2>
                                    <p className="text-muted-foreground">Import details automatically to save time.</p>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-muted-foreground">
                                        Repository URL or ID
                                    </label>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="e.g. TheBloke/Mistral-7B-v0.1 or https://github.com/..."
                                            value={importRepo}
                                            onChange={(e) => setImportRepo(e.target.value)}
                                            className="relative w-full bg-background border border-border rounded-xl px-5 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono text-sm"
                                        />
                                    </div>
                                    <p className="text-xs text-neutral-500 px-1">
                                        Supports Hugging Face Model IDs and GitHub Repository URLs.
                                    </p>
                                </div>

                                {error && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        {error}
                                    </div>
                                )}

                                <button
                                    onClick={handleImport}
                                    disabled={importing || !importRepo}
                                    className="w-full py-4 text-base font-bold rounded-xl bg-primary text-primary-foreground shadow-lg shadow-emerald-500/20 hover:bg-primary-dark hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                >
                                    {importing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            Analyze & Auto-Fill
                                        </>
                                    )}
                                </button>

                                <div className="relative py-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-border"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-card text-muted-foreground">or</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setStep('form')}
                                    className="w-full py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hover:bg-muted rounded-xl border border-transparent hover:border-border"
                                >
                                    Skip and fill details manually
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* STEP 2: Full Form View (Centered Single Column) */
                    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold mb-2 text-foreground">Review & Complete Submission</h1>
                                <p className="text-muted-foreground">Please verify the auto-filled details and add missing evidence.</p>
                            </div>
                            <button
                                onClick={() => setStep('import')}
                                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg hover:bg-muted"
                            >
                                ← Back to Import
                            </button>
                        </div>

                        {/* We add a key to force re-render when import happens */}
                        <ToolForm
                            key={formData.name + formData.url}
                            categories={categories}
                            analysis={analysisData} // Pass analysis data
                            defaultValues={{
                                name: formData.name,
                                tagline: formData.tagline,
                                description: formData.description,
                                url: formData.url,
                                category_id: formData.category_id,
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
