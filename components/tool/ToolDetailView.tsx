'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, ExternalLink, Code, Activity, Bolt, Timer, CloudOff, Coins, Info, LayoutDashboard, Settings, FileText, Star, Terminal, Gavel, Shield } from 'lucide-react'
import { ReviewsSection } from '@/components/ReviewsSection'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { logEvent } from '@/actions/analytics'

interface ToolDetailViewProps {
    tool: any
}

export function ToolDetailView({ tool }: ToolDetailViewProps) {
    const [activeTab, setActiveTab] = useState('overview')

    useEffect(() => {
        // Track View
        logEvent('view_tool', tool.id, { source: document.referrer })
    }, [tool.id])

    const handleOutboundClick = () => {
        logEvent('click_outbound', tool.id, { url: tool.url || tool.destination_url })
    }

    // Mock scores if not present (logic from previous Scorecard)
    const efficiencyScore = tool.min_ram && tool.storage_footprint ? 90 : 50
    const score = tool.frugal_score_total || 0
    const isVerified = tool.status === 'approved'

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
            {/* Tool Header Section */}
            <header className="bg-surface-dark border border-surface-border rounded-xl p-6 mb-6 shadow-xl relative overflow-hidden">
                {/* Subtle accent gradient at top */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 opacity-50"></div>
                <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                    {/* Left: Logo & Info */}
                    <div className="flex gap-5">
                        <div className="h-24 w-24 flex-shrink-0 rounded-lg bg-[#1F2937] flex items-center justify-center border border-surface-border">
                            {/* Placeholder Icon or First Letter */}
                            <span className="text-primary text-[48px] font-bold">{tool.name.charAt(0)}</span>
                        </div>
                        <div className="flex flex-col justify-center gap-1">
                            <h1 className="text-3xl font-bold text-white tracking-tight">{tool.name}</h1>
                            <div className="flex items-center gap-2 text-text-muted text-sm font-medium">
                                <span>Sold by: <span className="text-white">{tool.profiles?.full_name || 'Anonymous'}</span></span>
                                {isVerified && (
                                    <span className="flex items-center text-primary" title="Verified Publisher">
                                        <CheckCircle className="w-4 h-4 fill-current" />
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-2 mt-2">
                                <span className="inline-flex items-center rounded-md bg-[#1F2937] px-2 py-1 text-xs font-medium text-text-muted ring-1 ring-inset ring-gray-500/10">
                                    {tool.categories?.name || 'Uncategorized'}
                                </span>
                                {tool.pricing_model && (
                                    <span className="inline-flex items-center rounded-md bg-[#1F2937] px-2 py-1 text-xs font-medium text-text-muted ring-1 ring-inset ring-gray-500/10">
                                        {tool.pricing_model}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Right: Actions */}
                    <div className="flex gap-3 w-full md:w-auto mt-2 md:mt-0">
                        <a
                            href={tool.url || tool.destination_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleOutboundClick}
                            className="flex-1 md:flex-none h-11 px-6 rounded-lg bg-accent-orange hover:bg-accent-orange-hover text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-900/20"
                        >
                            <span>Visit Tool</span>
                            <ExternalLink className="w-4 h-4" />
                        </a>
                        {/* Secondary Action - could be Source or specialized link */}
                        <button className="flex-1 md:flex-none h-11 px-6 rounded-lg border border-primary text-primary hover:bg-primary/10 text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                            <Code className="w-5 h-5" />
                            <span>View Source</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Tabs Navigation */}
            <div className="border-b border-surface-border mb-8">
                <nav aria-label="Tabs" className="-mb-px flex space-x-8 overflow-x-auto">
                    {[
                        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                        { id: 'specs', label: 'Technical Specs', icon: Settings },
                        { id: 'pricing', label: 'Pricing & Legal', icon: Gavel },
                        { id: 'usage', label: 'Usage', icon: Terminal },
                        { id: 'reviews', label: 'Reviews', icon: Star },
                    ].map((tab) => {
                        const Icon = tab.icon
                        const isActive = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${isActive
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-text-muted hover:text-white hover:border-gray-300'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        )
                    })}
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Dynamic Tab Content */}
                <div className="lg:col-span-2 space-y-8">

                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <>
                            {/* Tool Summary */}
                            <section>
                                <h3 className="text-xl font-bold text-white mb-3">Tool Summary</h3>
                                <div className="bg-surface-dark border border-surface-border rounded-xl p-6">
                                    <p className="text-text-muted leading-relaxed text-base">
                                        {tool.tagline}
                                    </p>
                                    <div className="mt-4 flex gap-2 flex-wrap">
                                        {/* Mock tags or derived from tool data */}
                                        <span className="bg-[#10231e] text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-medium">High Efficiency</span>
                                        {tool.is_offline_capable && <span className="bg-[#10231e] text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-medium">Offline Capable</span>}
                                    </div>
                                </div>
                            </section>

                            {/* Frugal Scorecard */}
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-white">Frugal Scorecard</h3>
                                    <span className="text-xs text-text-muted">Verified: {new Date(tool.updated_at || tool.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="bg-surface-dark border border-surface-border rounded-xl p-8 relative overflow-hidden">
                                    <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                                        {/* Gauge (CSS Implementation) */}
                                        <div className="flex flex-col items-center justify-center relative shrink-0">
                                            <div className="relative w-40 h-40">
                                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                                    <circle cx="50" cy="50" fill="none" r="45" stroke="#1F2937" strokeWidth="8"></circle>
                                                    <circle
                                                        cx="50" cy="50" fill="none" r="45" stroke="#06f9bc"
                                                        strokeDasharray="283"
                                                        strokeDashoffset={283 - (283 * score / 100)}
                                                        strokeLinecap="round" strokeWidth="8"
                                                    ></circle>
                                                </svg>
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <span className="text-4xl font-bold text-white tracking-tighter">{score}</span>
                                                    <span className="text-xs font-medium text-text-muted uppercase tracking-wide">/ 100</span>
                                                </div>
                                            </div>
                                            <span className="mt-3 text-sm font-semibold text-primary">
                                                {score > 80 ? 'Excellent Efficiency' : score > 50 ? 'Good Efficiency' : 'Needs Optimization'}
                                            </span>
                                        </div>

                                        {/* Highlights Grid */}
                                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                                            <div className="flex gap-3">
                                                <div className="mt-1 bg-[#10231e] p-2 rounded-lg h-min border border-[#1e3a34]">
                                                    <Bolt className="text-primary w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-white font-semibold text-sm">Resource Optimized</p>
                                                    <p className="text-text-muted text-xs mt-1">
                                                        {tool.min_ram ? `Min RAM: ${tool.min_ram}` : 'Low memory footprint expected.'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="mt-1 bg-[#10231e] p-2 rounded-lg h-min border border-[#1e3a34]">
                                                    <CloudOff className="text-primary w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-white font-semibold text-sm">Offline Capability</p>
                                                    <p className="text-text-muted text-xs mt-1">
                                                        {tool.is_offline_capable ? 'Runs fully offline.' : 'Requires internet connection.'}
                                                    </p>
                                                </div>
                                            </div>
                                            {/* Add more highlights if needed */}
                                        </div>
                                    </div>

                                    {/* Why Frugal */}
                                    <div className="mt-8 pt-6 border-t border-surface-border">
                                        <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                            <Info className="text-primary w-4 h-4" />
                                            Why it's Frugal?
                                        </h4>
                                        <p className="text-sm text-text-muted">
                                            {tool.efficiency_justification || "No specific justification provided, but passed automated checks."}
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </>
                    )}

                    {/* SPECS TAB */}
                    {activeTab === 'specs' && (
                        <section>
                            <h3 className="text-xl font-bold text-white mb-3">Hardware & Environment</h3>
                            <div className="bg-surface-dark border border-surface-border rounded-xl p-6 space-y-6">
                                <div>
                                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Requirements</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex justify-between p-3 bg-[#1F2937]/50 rounded border border-white/5">
                                            <span className="text-text-muted">Minimum RAM</span>
                                            <span className="text-white">{tool.min_ram || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between p-3 bg-[#1F2937]/50 rounded border border-white/5">
                                            <span className="text-text-muted">Storage Footprint</span>
                                            <span className="text-white">{tool.storage_footprint || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between p-3 bg-[#1F2937]/50 rounded border border-white/5">
                                            <span className="text-text-muted">GPU VRAM</span>
                                            <span className="text-white">{tool.gpu_vram || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Context</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {tool.deployment_context?.map((ctx: string) => (
                                            <span key={ctx} className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm">
                                                {ctx}
                                            </span>
                                        )) || <span className="text-text-muted text-sm">No context specified</span>}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* PRICING TAB */}
                    {activeTab === 'pricing' && (
                        <section>
                            <h3 className="text-xl font-bold text-white mb-3">Pricing & Legal</h3>
                            <div className="bg-surface-dark border border-surface-border rounded-xl p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-surface-border pb-4">
                                        <div>
                                            <h4 className="text-white font-bold">Pricing Model</h4>
                                            <p className="text-sm text-text-muted">How this tool is monetized</p>
                                        </div>
                                        <span className="px-4 py-2 bg-white/5 rounded-lg text-white font-mono">
                                            {tool.pricing_model || 'Unknown'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between pt-2">
                                        <div>
                                            <h4 className="text-white font-bold">License</h4>
                                            <p className="text-sm text-text-muted">Usage rights and restrictions</p>
                                        </div>
                                        {tool.license_url ? (
                                            <a href={tool.license_url} target="_blank" className="text-primary hover:underline flex items-center gap-1">
                                                View License <ExternalLink className="w-3 h-3" />
                                            </a>
                                        ) : (
                                            <span className="text-text-muted">Not specified</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* USAGE TAB */}
                    {activeTab === 'usage' && (
                        <section>
                            <h3 className="text-xl font-bold text-white mb-3">Usage & Documentation</h3>
                            <div className="bg-surface-dark border border-surface-border rounded-xl p-6">
                                <article className="prose prose-invert max-w-none text-neutral-300">
                                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                        {tool.description || "No documentation provided."}
                                    </ReactMarkdown>
                                </article>
                            </div>
                        </section>
                    )}

                    {/* REVIEWS TAB */}
                    {activeTab === 'reviews' && (
                        <ReviewsSection toolId={tool.id} />
                    )}
                </div>

                {/* Right Column: Metadata & Quick Stats */}
                <div className="space-y-6">
                    {/* Deployment Info Box */}
                    <div className="bg-surface-dark border border-surface-border rounded-xl p-5">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-surface-border pb-2">Deployment</h4>
                        <ul className="space-y-4">
                            <li className="flex justify-between items-center text-sm">
                                <span className="text-text-muted">Environment</span>
                                <span className="text-white font-medium truncate max-w-[150px] text-right">
                                    {tool.deployment_context?.[0] || 'Flexible'}
                                </span>
                            </li>
                            <li className="flex justify-between items-center text-sm">
                                <span className="text-text-muted">Offline?</span>
                                <span className={tool.is_offline_capable ? "text-primary font-bold" : "text-white font-medium"}>
                                    {tool.is_offline_capable ? 'Yes' : 'No'}
                                </span>
                            </li>
                            <li className="flex justify-between items-center text-sm">
                                <span className="text-text-muted">Created</span>
                                <span className="text-white font-medium">{new Date(tool.created_at).toLocaleDateString()}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
