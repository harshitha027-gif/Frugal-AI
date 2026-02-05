'use client'

import { Crown, Trophy, TrendingUp, Zap, Box, Activity, Sparkles, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export function LeaderboardPodium({ tools }: { tools: any[] }) {
    if (tools.length < 3) return null

    const [first, second, third] = tools

    return (
        <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-end mt-12">
            {/* Rank 2 - Silver */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5, ease: 'easeOut' }}
                className="order-2 md:order-1"
            >
                <Link href={`/tool/${second.slug}`} className="block">
                    <div className="bg-gradient-to-b from-[#1E2532] to-[#151A23] rounded-2xl p-6 relative border border-[#2a3347] hover:border-purple-500/50 transition-all duration-300 flex flex-col items-center group cursor-pointer hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]">
                        {/* Rank Badge */}
                        <div className="absolute -top-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold px-4 py-1.5 rounded-full text-sm shadow-lg flex items-center gap-1.5">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            #2
                        </div>

                        {/* Avatar */}
                        <div className="size-20 rounded-full bg-gradient-to-br from-purple-500/30 to-indigo-500/20 flex items-center justify-center mb-4 border-2 border-purple-500/30 shadow-[0_0_20px_rgba(139,92,246,0.2)] group-hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all">
                            <Activity className="w-9 h-9 text-purple-400" />
                        </div>

                        {/* Name */}
                        <h3 className="text-xl font-bold mb-2 text-white text-center group-hover:text-purple-300 transition-colors line-clamp-1">
                            {second.name}
                        </h3>

                        {/* Score */}
                        <div className="flex items-baseline gap-1">
                            <span className="text-purple-400 font-black text-3xl">{second.frugal_score_total}</span>
                            <span className="text-xs text-[#9CA3AF] font-medium">pts</span>
                        </div>

                        {/* Trend */}
                        {second.trend > 0 && (
                            <div className="mt-3 text-xs text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                                <TrendingUp className="w-3 h-3" />
                                +{second.trend}%
                            </div>
                        )}

                        {/* Podium bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500/50 to-indigo-500/50 rounded-b-2xl" />
                    </div>
                </Link>
            </motion.div>

            {/* Rank 1 - Gold / Champion */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0, duration: 0.5, ease: 'easeOut' }}
                className="order-1 md:order-2 z-10"
            >
                <Link href={`/tool/${first.slug}`} className="block">
                    <div className="bg-gradient-to-b from-[#1a2a2a] to-[#151A23] rounded-2xl p-8 relative border-2 border-[#06f9bc]/40 shadow-[0_0_40px_rgba(6,249,188,0.2)] transform md:-translate-y-6 flex flex-col items-center group cursor-pointer hover:scale-[1.02] hover:shadow-[0_0_60px_rgba(6,249,188,0.3)] transition-all duration-300">
                        {/* Crown Animation */}
                        <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute -top-8"
                        >
                            <Crown className="w-10 h-10 text-[#06f9bc] fill-[#06f9bc]/20 drop-shadow-[0_0_10px_rgba(6,249,188,0.5)]" />
                        </motion.div>

                        {/* Rank Badge */}
                        <div className="absolute -top-5 mt-3 bg-[#06f9bc] text-[#0B0E14] font-black px-5 py-2 rounded-full text-base shadow-[0_0_20px_rgba(6,249,188,0.4)] flex items-center gap-1.5">
                            <Trophy className="w-4 h-4 fill-current" />
                            #1
                        </div>

                        {/* Glow ring */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[#06f9bc]/5 to-transparent pointer-events-none" />

                        {/* Avatar */}
                        <div className="size-28 rounded-full bg-gradient-to-br from-[#06f9bc]/30 to-emerald-500/20 flex items-center justify-center mb-4 border-2 border-[#06f9bc]/40 shadow-[0_0_30px_rgba(6,249,188,0.3)] mt-4 group-hover:shadow-[0_0_50px_rgba(6,249,188,0.5)] transition-all">
                            <Zap className="w-12 h-12 text-[#06f9bc] fill-[#06f9bc]/30" />
                        </div>

                        {/* Name */}
                        <h3 className="text-2xl font-bold mb-2 text-white text-center group-hover:text-[#06f9bc] transition-colors line-clamp-1">
                            {first.name}
                        </h3>

                        {/* Score */}
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-[#06f9bc] font-black text-5xl drop-shadow-[0_0_10px_rgba(6,249,188,0.3)]">{first.frugal_score_total}</span>
                            <span className="text-sm text-[#9CA3AF] font-medium">pts</span>
                        </div>

                        {/* Champion Badge */}
                        <div className="mt-4 text-sm text-[#06f9bc] font-bold bg-[#06f9bc]/10 px-4 py-1.5 rounded-full border border-[#06f9bc]/30 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Most Efficient
                        </div>

                        {/* Podium bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-[#06f9bc]/60 via-emerald-500/60 to-[#06f9bc]/60 rounded-b-2xl" />
                    </div>
                </Link>
            </motion.div>

            {/* Rank 3 - Bronze */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
                className="order-3"
            >
                <Link href={`/tool/${third.slug}`} className="block">
                    <div className="bg-gradient-to-b from-[#1E2532] to-[#151A23] rounded-2xl p-6 relative border border-[#2a3347] hover:border-orange-500/50 transition-all duration-300 flex flex-col items-center group cursor-pointer hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]">
                        {/* Rank Badge */}
                        <div className="absolute -top-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold px-4 py-1.5 rounded-full text-sm shadow-lg flex items-center gap-1.5">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            #3
                        </div>

                        {/* Avatar */}
                        <div className="size-20 rounded-full bg-gradient-to-br from-orange-500/30 to-amber-500/20 flex items-center justify-center mb-4 border-2 border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.2)] group-hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all">
                            <Box className="w-9 h-9 text-orange-400" />
                        </div>

                        {/* Name */}
                        <h3 className="text-xl font-bold mb-2 text-white text-center group-hover:text-orange-300 transition-colors line-clamp-1">
                            {third.name}
                        </h3>

                        {/* Score */}
                        <div className="flex items-baseline gap-1">
                            <span className="text-orange-400 font-black text-3xl">{third.frugal_score_total}</span>
                            <span className="text-xs text-[#9CA3AF] font-medium">pts</span>
                        </div>

                        {/* Trend */}
                        {third.trend > 0 && (
                            <div className="mt-3 text-xs text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                                <TrendingUp className="w-3 h-3" />
                                +{third.trend}%
                            </div>
                        )}

                        {/* Podium bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500/50 to-amber-500/50 rounded-b-2xl" />
                    </div>
                </Link>
            </motion.div>
        </div>
    )
}
