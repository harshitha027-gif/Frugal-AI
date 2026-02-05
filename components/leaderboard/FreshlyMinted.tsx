'use client'

import { Sparkles, Clock, Rocket, ArrowUpRight, Zap } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Helper to format relative time
const getRelativeTime = (date: string) => {
    const now = new Date()
    const then = new Date(date)
    const diffMs = now.getTime() - then.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    return then.toLocaleDateString()
}

export function FreshlyMinted({ tools }: { tools: any[] }) {
    return (
        <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="sticky top-24">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-6"
                >
                    <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                        <div className="size-8 rounded-lg bg-gradient-to-br from-[#06f9bc]/20 to-emerald-500/10 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-[#06f9bc]" />
                        </div>
                        Freshly Minted
                    </h3>
                    <span className="text-xs text-[#9CA3AF] bg-[#1E2532] px-2 py-1 rounded-full">
                        {tools.length} new
                    </span>
                </motion.div>

                {/* Tool Cards */}
                <div className="flex flex-col gap-3">
                    {tools.map((tool, index) => (
                        <motion.div
                            key={tool.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/tool/${tool.slug}`}>
                                <div className="bg-gradient-to-br from-[#151A23] to-[#0B0E14] border border-[#1E2532] hover:border-[#06f9bc]/50 p-4 rounded-xl transition-all duration-300 group cursor-pointer relative overflow-hidden hover:shadow-[0_0_20px_rgba(6,249,188,0.1)]">
                                    {/* New badge for first item */}
                                    {index === 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.3 }}
                                            className="absolute top-3 right-3"
                                        >
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-[#06f9bc] to-emerald-400 text-[#0B0E14] uppercase tracking-wider shadow-[0_0_10px_rgba(6,249,188,0.3)]">
                                                <Zap className="w-2.5 h-2.5 fill-current" />
                                                New
                                            </span>
                                        </motion.div>
                                    )}

                                    {/* Decorative gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#06f9bc]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                                    <div className="flex items-start gap-3">
                                        {/* Icon */}
                                        <div className="size-11 rounded-xl bg-gradient-to-br from-[#1E2532] to-[#151A23] flex items-center justify-center flex-shrink-0 border border-white/5 group-hover:border-[#06f9bc]/30 transition-colors">
                                            <Sparkles className="w-5 h-5 text-white/40 group-hover:text-[#06f9bc] transition-colors" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-white group-hover:text-[#06f9bc] transition-colors line-clamp-1 flex-1">
                                                    {tool.name}
                                                </h4>
                                                <ArrowUpRight className="w-4 h-4 text-[#9CA3AF] opacity-0 group-hover:opacity-100 group-hover:text-[#06f9bc] transition-all" />
                                            </div>
                                            <p className="text-xs text-[#9CA3AF] mt-1 line-clamp-2 leading-relaxed">
                                                {tool.tagline || 'An efficient AI tool'}
                                            </p>
                                            <div className="mt-2 flex items-center gap-2 text-xs text-[#9CA3AF]">
                                                <Clock className="w-3 h-3" />
                                                <span>{getRelativeTime(tool.approved_at || tool.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}

                    {/* Empty State */}
                    {tools.length === 0 && (
                        <div className="bg-[#151A23] border border-[#1E2532] p-6 rounded-xl text-center">
                            <Sparkles className="w-8 h-8 text-[#9CA3AF] mx-auto mb-2" />
                            <p className="text-sm text-[#9CA3AF]">No new tools yet</p>
                        </div>
                    )}

                    {/* Promo Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-2 p-6 rounded-xl bg-gradient-to-br from-[#06f9bc]/10 via-[#1E2532]/50 to-[#151A23] border border-[#06f9bc]/20 text-center relative overflow-hidden"
                    >
                        {/* Background glow */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,249,188,0.1),transparent_50%)] pointer-events-none" />

                        <div className="relative">
                            <div className="flex justify-center mb-3">
                                <div className="size-12 rounded-xl bg-gradient-to-br from-[#06f9bc]/20 to-emerald-500/10 flex items-center justify-center border border-[#06f9bc]/20">
                                    <Rocket className="w-6 h-6 text-[#06f9bc]" />
                                </div>
                            </div>
                            <h4 className="font-bold text-white mb-1">Built something efficient?</h4>
                            <p className="text-xs text-[#9CA3AF] mb-4 leading-relaxed">
                                Submit your tool to the leaderboard and get discovered by thousands of engineers.
                            </p>
                            <Link href="/submit">
                                <button className="w-full bg-[#0B0E14] hover:bg-black text-white border border-[#06f9bc]/50 hover:border-[#06f9bc] hover:shadow-[0_0_20px_rgba(6,249,188,0.2)] px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 group">
                                    <span>Submit for Review</span>
                                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </aside>
    )
}
