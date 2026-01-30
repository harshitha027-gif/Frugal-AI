'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Search, Filter, Sparkles, Zap, Leaf, ArrowUpRight, Eye } from 'lucide-react'

// ... existing interfaces ...

interface Category {
    id: string
    name: string
}

interface Tool {
    id: string
    name: string
    slug: string
    tagline: string
    description: string
    url: string
    category_id: string
    pricing_model: string
    carbon_score: number
    views: number
    created_at: string
    categories: {
        name: string
    } | null
    profiles: {
        full_name: string
    } | null
}

interface Props {
    initialTools: Tool[]
    categories: Category[]
}

export function ToolsList({ initialTools, categories }: Props) {
    const searchParams = useSearchParams()
    const [search, setSearch] = useState(searchParams.get('q') || '')
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [sortBy, setSortBy] = useState<'newest' | 'views' | 'carbon'>('newest')

    // Sync search state if URL changes (optional, but good for back button)
    useEffect(() => {
        const q = searchParams.get('q')
        if (q !== null) setSearch(q)
    }, [searchParams])

    const filteredTools = useMemo(() => {
        let result = [...initialTools]

        // Filter by Category
        if (selectedCategory !== 'all') {
            result = result.filter(tool => tool.category_id === selectedCategory)
        }

        // Filter by Search
        if (search) {
            const q = search.toLowerCase()
            result = result.filter(tool =>
                tool.name.toLowerCase().includes(q) ||
                tool.tagline.toLowerCase().includes(q)
            )
        }

        // Sort
        result.sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            if (sortBy === 'views') return (b.views || 0) - (a.views || 0)
            if (sortBy === 'carbon') return b.carbon_score - a.carbon_score
            return 0
        })

        return result
    }, [initialTools, selectedCategory, search, sortBy])

    return (
        <div className="space-y-12">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-[#111] p-6 rounded-2xl border border-white/5 shadow-2xl">

                {/* Search */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                    <input
                        type="text"
                        placeholder="Search for frugal tools..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
                    <div className="flex items-center gap-2 bg-[#0a0a0a] border border-white/10 rounded-xl p-1">
                        <button
                            onClick={() => setSortBy('newest')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${sortBy === 'newest' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                        >
                            Newest
                        </button>
                        <button
                            onClick={() => setSortBy('views')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${sortBy === 'views' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                        >
                            Most Viewed
                        </button>
                        <button
                            onClick={() => setSortBy('carbon')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${sortBy === 'carbon' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                        >
                            Eco-Friendly
                        </button>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-6 py-2.5 rounded-full border text-sm font-medium transition-all ${selectedCategory === 'all'
                        ? 'bg-emerald-500 text-black border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                        : 'bg-white/5 text-neutral-400 border-white/5 hover:bg-white/10 hover:text-white'
                        }`}
                >
                    All Tools
                </button>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-6 py-2.5 rounded-full border text-sm font-medium transition-all ${selectedCategory === cat.id
                            ? 'bg-emerald-500 text-black border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                            : 'bg-white/5 text-neutral-400 border-white/5 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredTools.map(tool => (
                    <Link href={`/tool/${tool.slug}`} key={tool.id} className="group">
                        <div className="h-full bg-[#111] border border-white/10 rounded-3xl p-6 hover:border-emerald-500/30 transition-all duration-300 relative overflow-hidden group-hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                            {/* Hover Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-neutral-300">
                                        {tool.categories?.name}
                                    </div>
                                    <div className={`px-2.5 py-1 rounded-full border text-xs font-bold ${tool.carbon_score > 70 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                        tool.carbon_score > 40 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                            'bg-red-500/10 text-red-400 border-red-500/20'
                                        }`}>
                                        CS: {tool.carbon_score}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                                    {tool.name}
                                </h3>
                                <p className="text-neutral-400 text-sm mb-6 line-clamp-2 flex-grow">
                                    {tool.tagline}
                                </p>

                                <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                                    <div className="flex items-center gap-2 text-neutral-500 text-xs font-mono">
                                        <Eye className="w-3 h-3" />
                                        {tool.views || 0}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-medium text-white/50">
                                            {tool.pricing_model || 'Free'}
                                        </span>
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black transition-all">
                                            <ArrowUpRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredTools.length === 0 && (
                <div className="text-center py-24">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Leaf className="w-8 h-8 text-neutral-600" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">No tools found</h3>
                    <p className="text-neutral-500">Try adjusting your filters or search query.</p>
                </div>
            )}
        </div>
    )
}
