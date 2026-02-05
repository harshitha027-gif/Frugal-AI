'use client'

import { ChevronRight, Bot, Image as ImageIcon, Volume2, Code, Mic, FileText, Cpu, Brain } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

// Helper to get category icon
const getCatIcon = (cat: string) => {
    const c = (cat || '').toLowerCase()
    if (c.includes('llm') || c.includes('text') || c.includes('language')) return <Brain className="w-4.5 h-4.5" />
    if (c.includes('vision') || c.includes('image')) return <ImageIcon className="w-4.5 h-4.5" />
    if (c.includes('audio') || c.includes('speech')) return <Volume2 className="w-4.5 h-4.5" />
    if (c.includes('voice') || c.includes('transcri')) return <Mic className="w-4.5 h-4.5" />
    if (c.includes('document') || c.includes('ocr')) return <FileText className="w-4.5 h-4.5" />
    if (c.includes('edge') || c.includes('embedded')) return <Cpu className="w-4.5 h-4.5" />
    return <Code className="w-4.5 h-4.5" />
}

// Get color based on score
const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-[#06f9bc] to-emerald-400'
    if (score >= 60) return 'from-blue-400 to-cyan-400'
    if (score >= 40) return 'from-yellow-400 to-orange-400'
    return 'from-orange-400 to-red-400'
}

export function LeaderboardTable({ tools }: { tools: any[] }) {
    const router = useRouter()
    // Only show rank 4 onwards in the table (top 3 are in podium)
    const tableTools = tools.slice(3)

    if (tableTools.length === 0) {
        return null
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#151A23] border border-[#1E2532] rounded-2xl overflow-hidden ring-1 ring-white/5 shadow-xl"
        >
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gradient-to-r from-[#1E2532]/80 to-[#1E2532]/50 text-xs uppercase text-[#9CA3AF] font-semibold tracking-wider border-b border-[#1E2532]">
                            <th className="px-6 py-4 w-16">Rank</th>
                            <th className="px-6 py-4">Tool</th>
                            <th className="px-6 py-4 w-1/4">Frugal Score</th>
                            <th className="px-6 py-4 w-28 hidden md:table-cell">Trend</th>
                            <th className="px-6 py-4 w-32 hidden sm:table-cell">Category</th>
                            <th className="px-6 py-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1E2532]/70">
                        {tableTools.map((tool, index) => {
                            const score = tool.frugal_score_total || 0
                            const scoreGradient = getScoreColor(score)

                            return (
                                <motion.tr
                                    key={tool.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + index * 0.03 }}
                                    onClick={() => router.push(`/tool/${tool.slug}`)}
                                    className="hover:bg-[#1E2532]/40 transition-all duration-200 group cursor-pointer"
                                >
                                    {/* Rank */}
                                    <td className="px-6 py-4">
                                        <span className={`
                                            inline-flex items-center justify-center size-8 rounded-lg font-bold text-sm
                                            ${index < 7
                                                ? 'bg-[#06f9bc]/10 text-[#06f9bc] border border-[#06f9bc]/20'
                                                : 'bg-[#1E2532] text-[#9CA3AF]'
                                            }
                                        `}>
                                            {index + 4}
                                        </span>
                                    </td>

                                    {/* Tool Name */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-xl bg-gradient-to-br from-[#1E2532] to-[#151A23] flex items-center justify-center text-white/50 group-hover:text-[#06f9bc] transition-colors border border-white/5 group-hover:border-[#06f9bc]/30">
                                                {getCatIcon(tool.category_name)}
                                            </div>
                                            <div>
                                                <span className="font-bold text-white group-hover:text-[#06f9bc] transition-colors block">
                                                    {tool.name}
                                                </span>
                                                <span className="text-xs text-[#9CA3AF] hidden lg:block">
                                                    {tool.category_name}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Score with gradient bar */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3 w-full">
                                            <div className="flex-1 h-2.5 bg-[#0B0E14] rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${score}%` }}
                                                    transition={{ delay: 0.5 + index * 0.03, duration: 0.8, ease: 'easeOut' }}
                                                    className={`h-full bg-gradient-to-r ${scoreGradient} rounded-full shadow-[0_0_8px_rgba(6,249,188,0.3)]`}
                                                />
                                            </div>
                                            <span className={`text-sm font-bold w-8 ${score >= 70 ? 'text-[#06f9bc]' : 'text-white'}`}>
                                                {score}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Trend Sparkline */}
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <div className="flex items-center gap-2">
                                            <svg className="text-[#06f9bc]/70" fill="none" height="20" viewBox="0 0 60 20" width="60">
                                                <path
                                                    d={`M0 18 L10 ${14 + Math.sin(index) * 4} L20 ${10 + Math.cos(index) * 3} L30 ${8 + Math.sin(index * 2) * 2} L40 6 L50 4 L60 2`}
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                />
                                            </svg>
                                            {tool.trend > 0 && (
                                                <span className="text-xs text-emerald-400 font-medium">+{tool.trend}%</span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Category Badge */}
                                    <td className="px-6 py-4 hidden sm:table-cell">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-[#1E2532]/80 text-[#9CA3AF] border border-white/5 uppercase tracking-wider">
                                            {tool.category_name}
                                        </span>
                                    </td>

                                    {/* Arrow */}
                                    <td className="px-6 py-4 text-[#9CA3AF]">
                                        <ChevronRight className="w-5 h-5 group-hover:text-[#06f9bc] group-hover:translate-x-1 transition-all" />
                                    </td>
                                </motion.tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            {tableTools.length >= 10 && (
                <div className="bg-gradient-to-t from-[#0B0E14] to-[#151A23] border-t border-[#1E2532] p-4 flex justify-center">
                    <button className="text-sm text-[#9CA3AF] hover:text-[#06f9bc] transition-colors font-medium flex items-center gap-2 group">
                        <span>Show more rankings</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            )}
        </motion.div>
    )
}
